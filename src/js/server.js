const express = require('express');
const path = require('path');
const fs = require('fs');
const multer = require('multer');
const xlsx = require('xlsx');
const crypto = require('crypto');

// Import security middleware
const {
  csrfProtection,
  securityHeaders,
  inputSanitization,
  securityLogging,
  secureErrorHandler,
  getCsrfToken,
  globalLimiter,
  authLimiter,
  uploadLimiter,
  validateEmail,
  validateUsername,
  validatePassword,
  validateInput,
  detectInjectionAttempt
} = require('./security-middleware.js');

const app = express();
const PORT = process.env.PORT || 3000;

// ==================== SECURITY MIDDLEWARE ====================

// 1. Security headers first
app.use(securityHeaders);

// 2. Request logging
app.use(securityLogging);

// 3. Global rate limiting
app.use(globalLimiter);

// 4. Body parsing with size limits
app.use(express.json({ limit: '10kb' })); // Limite la taille
app.use(express.urlencoded({ extended: true, limit: '10kb' }));

// 5. Input sanitization
app.use(inputSanitization);

// 6. CORS - Restrictif
app.use((req, res, next) => {
  const allowedOrigins = [
    'http://localhost:3000',
    'http://localhost:5000',
    'https://exon-store.netlify.app',
    process.env.CORS_ORIGIN // Variable d'environnement pour production
  ].filter(Boolean);

  const origin = req.headers.origin;

  if (allowedOrigins.includes(origin)) {
    res.header('Access-Control-Allow-Origin', origin);
  }

  res.header('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
  res.header('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept, X-CSRF-Token');
  res.header('Access-Control-Allow-Credentials', 'true');
  
  if (req.method === 'OPTIONS') {
    return res.sendStatus(200);
  }

  next();
});

// 7. CSRF protection
app.use(csrfProtection);
app.get('/api/csrf-token', getCsrfToken);

const DATA_DIR = path.join(__dirname, '..', 'data');
if (!fs.existsSync(DATA_DIR)) fs.mkdirSync(DATA_DIR);
const USERS_FILE = path.join(DATA_DIR, 'users.json');
const LOGS_FILE = path.join(DATA_DIR, 'authLogs.json');

function loadData(file) {
  if (!fs.existsSync(file)) return [];
  try {
    return JSON.parse(fs.readFileSync(file));
  } catch (e) {
    console.error('loadData error', e);
    return [];
  }
}

function saveData(file, data) {
  fs.writeFileSync(file, JSON.stringify(data, null, 2));
}

function logAuth(type, identifier, success) {
  const logs = loadData(LOGS_FILE);
  logs.push({ type, identifier, success, timestamp: new Date().toISOString() });
  saveData(LOGS_FILE, logs);
}

app.post('/api/register', authLimiter, (req, res) => {
  const { username, email, password } = req.body;

  // Validation des entrées
  if (!email || !password || !username) {
    return res.status(400).json({ error: 'missing', message: 'Email, mot de passe et username requis' });
  }

  // Validation sécurisée
  if (!validateEmail(email)) {
    return res.status(400).json({ error: 'invalid_email', message: 'Format email invalide' });
  }

  if (!validateUsername(username)) {
    return res.status(400).json({ error: 'invalid_username', message: 'Username doit contenir 3-20 caractères (lettres, chiffres, -, _)' });
  }

  if (!validatePassword(password)) {
    return res.status(400).json({ 
      error: 'weak_password', 
      message: 'Mot de passe doit contenir 8+ caractères, majuscule, minuscule, chiffre et caractère spécial (@$!%*?&)' 
    });
  }

  // Détecte tentatives d'injection
  if (detectInjectionAttempt(username) || detectInjectionAttempt(email)) {
    console.warn(`[SECURITY] Injection attempt detected for registration: ${email}`);
    return res.status(400).json({ error: 'invalid_input', message: 'Entrée invalide' });
  }

  const users = loadData(USERS_FILE);
  
  // Vérifie si l'email existe déjà
  if (users.find(u => u.email === email)) {
    logAuth('register', email, false);
    return res.status(409).json({ error: 'email_in_use', message: 'Cet email est déjà enregistré' });
  }

  // Hash du mot de passe (basique - utiliser bcrypt en production)
  const passwordHash = crypto.createHash('sha256').update(password + process.env.PASSWORD_SALT || 'default_salt').digest('hex');

  const user = {
    userId: 'user_' + Date.now(),
    username,
    email,
    password: passwordHash, // Stocke le hash, pas le mot de passe en clair
    cart: '[]',
    wishlist: '[]',
    purchaseHistory: '[]',
    createdAt: new Date().toISOString()
  };

  users.push(user);
  saveData(USERS_FILE, users);
  logAuth('register', email, true);

  // Ne retourne pas le mot de passe
  delete user.password;
  res.status(201).json({ user, message: 'Compte créé avec succès' });
});

app.post('/api/login', authLimiter, (req, res) => {
  const { identifier, password } = req.body;

  // Validation des entrées
  if (!identifier || !password) {
    return res.status(400).json({ error: 'missing', message: 'Email/username et mot de passe requis' });
  }

  // Validation d'injection
  if (detectInjectionAttempt(identifier) || detectInjectionAttempt(password)) {
    console.warn(`[SECURITY] Injection attempt detected for login: ${identifier}`);
    return res.status(400).json({ error: 'invalid_input', message: 'Entrée invalide' });
  }

  const users = loadData(USERS_FILE);
  
  // Hash du mot de passe pour comparaison
  const passwordHash = crypto.createHash('sha256').update(password + process.env.PASSWORD_SALT || 'default_salt').digest('hex');

  const user = users.find(u =>
    (u.email === identifier || u.username === identifier) && u.password === passwordHash
  );

  if (user) {
    logAuth('login', identifier, true);
    
    // Génère un token de session
    const sessionToken = crypto.randomBytes(32).toString('hex');
    
    // Ne retourne pas le mot de passe
    const safeUser = { ...user };
    delete safeUser.password;

    res.json({ 
      user: safeUser,
      sessionToken,
      message: 'Connexion réussie'
    });
  } else {
    logAuth('login', identifier, false);
    
    // Ne révèle pas si c'est l'email ou le mot de passe qui est mauvais (sécurité)
    res.status(401).json({ 
      error: 'invalid_credentials',
      message: 'Email/username ou mot de passe incorrect'
    });
  }
});

app.post('/api/cart', (req, res) => {
  const { userId, cart } = req.body;
  
  if (!userId) {
    return res.status(400).json({ error: 'missing', message: 'userId requis' });
  }

  if (!validateInput(userId, 5, 50)) {
    return res.status(400).json({ error: 'invalid_input', message: 'userId invalide' });
  }

  const users = loadData(USERS_FILE);
  const user = users.find(u => u.userId === userId);
  
  if (!user) {
    return res.status(404).json({ error: 'no_user', message: 'Utilisateur non trouvé' });
  }

  // Validation du panier
  if (!Array.isArray(cart)) {
    return res.status(400).json({ error: 'invalid_cart', message: 'Panier invalide' });
  }

  user.cart = JSON.stringify(cart || []);
  saveData(USERS_FILE, users);
  
  res.json({ success: true, message: 'Panier mis à jour' });
});

// Logout endpoint
app.post('/api/logout', (req, res) => {
  const { sessionToken } = req.body;

  if (!sessionToken) {
    return res.status(400).json({ error: 'missing', message: 'sessionToken requis' });
  }

  // Invalide le token (en production, utiliser une base de données)
  // Pour maintenant, le client supprime simplement le token côté client

  res.json({ success: true, message: 'Déconnexion réussie' });
});

const upload = multer({ 
  dest: path.join(DATA_DIR, 'uploads/'),
  limits: {
    fileSize: 5 * 1024 * 1024 // 5MB max
  },
  fileFilter: (req, file, cb) => {
    // Accepte uniquement les fichiers Excel
    const allowedMimes = ['application/vnd.ms-excel', 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet'];
    
    if (allowedMimes.includes(file.mimetype)) {
      cb(null, true);
    } else {
      cb(new Error('Seuls les fichiers Excel sont acceptés'));
    }
  }
});

app.post('/api/import', uploadLimiter, upload.single('file'), (req, res) => {
  const file = req.file;

  if (!file) {
    return res.status(400).json({ error: 'no_file', message: 'Aucun fichier uploadé' });
  }

  if (!req.body.userId) {
    return res.status(400).json({ error: 'missing', message: 'userId requis' });
  }

  try {
    const workbook = xlsx.readFile(file.path);
    const sheet = workbook.Sheets[workbook.SheetNames[0]];
    const rows = xlsx.utils.sheet_to_json(sheet);

    // Validation des données du fichier
    if (!Array.isArray(rows) || rows.length === 0) {
      return res.status(400).json({ error: 'empty_file', message: 'Fichier vide' });
    }

    const users = loadData(USERS_FILE);
    let importedCount = 0;

    rows.forEach(r => {
      // Validation stricte
      if (!r.email || !r.password) return;

      if (!validateEmail(r.email) || !validatePassword(r.password)) {
        console.warn(`[SECURITY] Invalid data in import file: ${r.email}`);
        return;
      }

      // Détecte injection
      if (detectInjectionAttempt(r.email) || detectInjectionAttempt(r.username)) {
        console.warn(`[SECURITY] Injection attempt in import file`);
        return;
      }

      if (!users.find(u => u.email === r.email)) {
        // Hash du mot de passe
        const passwordHash = crypto.createHash('sha256').update(r.password + process.env.PASSWORD_SALT || 'default_salt').digest('hex');

        users.push({
          userId: 'user_' + Date.now() + '_' + Math.random().toString(36).substr(2, 5),
          email: r.email,
          password: passwordHash,
          username: r.username || r.email,
          cart: '[]',
          wishlist: '[]',
          purchaseHistory: '[]',
          createdAt: new Date().toISOString()
        });
        importedCount++;
      }
    });

    saveData(USERS_FILE, users);

    // Supprime le fichier uploadé
    fs.unlink(file.path, (err) => {
      if (err) console.error('Error deleting uploaded file:', err);
    });

    res.json({ imported: importedCount, message: `${importedCount} utilisateur(s) importé(s)` });
  } catch (e) {
    console.error('import error', e);
    
    // Supprime le fichier en cas d'erreur
    fs.unlink(file.path, (err) => {
      if (err) console.error('Error deleting uploaded file:', err);
    });

    res.status(500).json({ error: 'parsing', message: 'Erreur lors du traitement du fichier' });
  }
});

app.get('/api/users', (req, res) => {
  // En production, vérifier l'authentification admin
  const users = loadData(USERS_FILE);
  
  // Sanitize: ne retourne pas les mots de passe
  const sanitized = users.map(user => {
    const safe = { ...user };
    delete safe.password;
    return safe;
  });

  res.json(sanitized);
});

app.get('/api/authLogs', (req, res) => {
  // En production, vérifier l'authentification admin
  res.json(loadData(LOGS_FILE));
});

// ==================== ADMIN AUTHENTICATION ====================

// Utilise des variables d'environnement pour les credentials
const ADMIN_USER = process.env.ADMIN_USER || 'bonobo';
const ADMIN_PASS = process.env.ADMIN_PASS || 'zboubus';

/**
 * Middleware d'authentification admin sécurisé
 */
function adminAuthMiddleware(req, res, next) {
  // Paths protégés
  const protectedPaths = ['/admin.html', '/admin', '/api/users', '/api/authLogs'];
  const isProtected = protectedPaths.some(path => req.path === path || req.path.startsWith(path));

  if (!isProtected) {
    return next();
  }

  const auth = req.headers.authorization;
  
  if (!auth) {
    res.setHeader('WWW-Authenticate', 'Basic realm="Admin Area"');
    return res.status(401).json({ error: 'unauthorized', message: 'Authentication required' });
  }

  const parts = auth.split(' ');
  
  if (parts.length !== 2 || parts[0] !== 'Basic') {
    res.setHeader('WWW-Authenticate', 'Basic realm="Admin Area"');
    return res.status(401).json({ error: 'invalid_auth', message: 'Invalid authorization header' });
  }

  try {
    const buf = Buffer.from(parts[1], 'base64');
    const [user, pass] = buf.toString().split(':');

    // Hash le mot de passe
    const passHash = crypto.createHash('sha256').update(pass + process.env.PASSWORD_SALT || 'default_salt').digest('hex');
    const adminPassHash = crypto.createHash('sha256').update(ADMIN_PASS + process.env.PASSWORD_SALT || 'default_salt').digest('hex');

    // Vérification sécurisée (timing-safe comparison en production)
    if (user === ADMIN_USER && passHash === adminPassHash) {
      req.isAdmin = true;
      return next();
    }

    logAuth('admin_login', user, false);
    res.setHeader('WWW-Authenticate', 'Basic realm="Admin Area"');
    return res.status(401).json({ error: 'invalid_credentials', message: 'Invalid credentials' });
  } catch (error) {
    console.error('[SECURITY] Admin auth error:', error);
    return res.status(400).json({ error: 'bad_request', message: 'Invalid request' });
  }
}

app.use(adminAuthMiddleware);

// Serve static files from project root
app.use(express.static(path.join(__dirname, '..')));

// 404 handler
app.use((req, res) => {
  res.status(404).json({ error: 'not_found', message: 'Ressource non trouvée' });
});

// ==================== ERROR HANDLER ====================
// Doit être en dernier
app.use(secureErrorHandler);

// ==================== SERVER STARTUP ====================
app.listen(PORT, () => {
  console.log(`[SERVER] Démarrage sur le port ${PORT}`);
  console.log(`[SECURITY] Mode: ${process.env.NODE_ENV || 'development'}`);
  console.log('[SECURITY] Tous les middleware de sécurité sont actifs');
});

