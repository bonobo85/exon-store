const express = require('express');
const path = require('path');
const fs = require('fs');
const multer = require('multer');
const xlsx = require('xlsx');

const app = express();
const PORT = process.env.PORT || 3000;

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// CORS headers to simplify development (same origin if serving static files)
app.use((req, res, next) => {
  res.header('Access-Control-Allow-Origin', '*');
  res.header('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept');
  next();
});

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

app.post('/api/register', (req, res) => {
  const { username, email, password } = req.body;
  if (!email || !password || !username) {
    return res.status(400).json({ error: 'missing' });
  }
  const users = loadData(USERS_FILE);
  if (users.find(u => u.email === email)) {
    logAuth('register', email, false);
    return res.status(409).json({ error: 'email_in_use' });
  }
  const user = {
    userId: 'user_' + Date.now(),
    username,
    email,
    password,
    cart: '[]',
    wishlist: '[]',
    purchaseHistory: '[]',
    createdAt: new Date().toISOString()
  };
  users.push(user);
  saveData(USERS_FILE, users);
  logAuth('register', email, true);
  res.json({ user });
});

app.post('/api/login', (req, res) => {
  const { identifier, password } = req.body;
  if (!identifier || !password) return res.status(400).json({ error: 'missing' });
  const users = loadData(USERS_FILE);
  const user = users.find(u =>
    (u.email === identifier || u.username === identifier) && u.password === password
  );
  if (user) {
    logAuth('login', identifier, true);
    res.json({ user });
  } else {
    logAuth('login', identifier, false);
    res.status(401).json({ error: 'invalid' });
  }
});

app.post('/api/cart', (req, res) => {
  const { userId, cart } = req.body;
  if (!userId) return res.status(400).json({ error: 'missing' });
  const users = loadData(USERS_FILE);
  const user = users.find(u => u.userId === userId);
  if (!user) return res.status(404).json({ error: 'no_user' });
  user.cart = JSON.stringify(cart || []);
  saveData(USERS_FILE, users);
  res.json({ success: true });
});

const upload = multer({ dest: path.join(DATA_DIR, 'uploads/') });
app.post('/api/import', upload.single('file'), (req, res) => {
  const file = req.file;
  if (!file) return res.status(400).send('no file');
  try {
    const workbook = xlsx.readFile(file.path);
    const sheet = workbook.Sheets[workbook.SheetNames[0]];
    const rows = xlsx.utils.sheet_to_json(sheet);
    const users = loadData(USERS_FILE);
    rows.forEach(r => {
      if (r.email && r.password) {
        if (!users.find(u => u.email === r.email)) {
          users.push({
            userId: 'user_' + Date.now() + '_' + Math.random().toString(36).substr(2, 5),
            email: r.email,
            password: r.password,
            username: r.username || r.email,
            cart: '[]',
            wishlist: '[]',
            purchaseHistory: '[]',
            createdAt: new Date().toISOString()
          });
        }
      }
    });
    saveData(USERS_FILE, users);
    res.json({ imported: rows.length });
  } catch (e) {
    console.error('import error', e);
    res.status(500).json({ error: 'parsing' });
  }
});

app.get('/api/users', (req, res) => {
  res.json(loadData(USERS_FILE));
});

app.get('/api/authLogs', (req, res) => {
  res.json(loadData(LOGS_FILE));
});

// serve static files from project root
// Basic HTTP auth for admin.html
const ADMIN_USER = 'bonobo';
const ADMIN_PASS = 'zboubus';

function adminAuthMiddleware(req, res, next) {
  if (req.path === '/admin.html' || req.path.startsWith('/admin')) {
    const auth = req.headers.authorization;
    if (!auth) {
      res.setHeader('WWW-Authenticate', 'Basic realm="Admin Area"');
      return res.status(401).send('Authentication required');
    }
    const parts = auth.split(' ');
    if (parts.length !== 2 || parts[0] !== 'Basic') {
      res.setHeader('WWW-Authenticate', 'Basic realm="Admin Area"');
      return res.status(401).send('Invalid authorization header');
    }
    const buf = Buffer.from(parts[1], 'base64');
    const [user, pass] = buf.toString().split(':');
    if (user === ADMIN_USER && pass === ADMIN_PASS) return next();
    res.setHeader('WWW-Authenticate', 'Basic realm="Admin Area"');
    return res.status(401).send('Invalid credentials');
  }
  next();
}

app.use(adminAuthMiddleware);

app.use(express.static(path.join(__dirname, '..')));

app.listen(PORT, () => console.log('Server running on', PORT));
