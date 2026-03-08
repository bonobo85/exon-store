/**
 * ==================== SÉCURITÉ MIDDLEWARE ====================
 * Middleware Express.js pour la sécurité
 * - CSRF Token management
 * - Security headers (CSP, HSTS, etc)
 * - Rate limiting
 * - Input validation
 * - Request logging
 */

const crypto = require('crypto');
const rateLimit = require('express-rate-limit');
const helmet = require('helmet');
const mongoSanitize = require('mongo-sanitize');

// ==================== CSRF TOKEN MANAGEMENT ====================

/**
 * Gère les tokens CSRF
 */
class CSRFManager {
    constructor() {
        this.tokens = new Map();
        this.maxAge = 60 * 60 * 1000; // 1 heure
        this.cleanupInterval = 30 * 60 * 1000; // 30 minutes
        
        // Nettoyage automatique
        setInterval(() => this.cleanup(), this.cleanupInterval);
    }

    /**
     * Génère un nouveau token CSRF
     */
    generateToken() {
        return crypto.randomBytes(32).toString('hex');
    }

    /**
     * Stocke un token avec sa date de création
     */
    storeToken(sessionId, token) {
        this.tokens.set(token, {
            sessionId,
            createdAt: Date.now()
        });
    }

    /**
     * Vérifie et consomme un token CSRF
     */
    verifyToken(sessionId, token) {
        const data = this.tokens.get(token);
        
        if (!data) {
            return false;
        }

        // Vérifie que le token correspond à la session
        if (data.sessionId !== sessionId) {
            return false;
        }

        // Vérifie l'âge du token
        const age = Date.now() - data.createdAt;
        if (age > this.maxAge) {
            this.tokens.delete(token);
            return false;
        }

        // Token valide - le consomme (utilisation unique)
        this.tokens.delete(token);
        return true;
    }

    /**
     * Nettoie les tokens expirés
     */
    cleanup() {
        const now = Date.now();
        
        for (const [token, data] of this.tokens.entries()) {
            if (now - data.createdAt > this.maxAge) {
                this.tokens.delete(token);
            }
        }
    }
}

const csrfManager = new CSRFManager();

// ==================== RATE LIMITING ====================

/**
 * Rate limiter global
 */
const globalLimiter = rateLimit({
    windowMs: 15 * 60 * 1000, // 15 minutes
    max: 100, // limit each IP to 100 requests per windowMs
    message: 'Trop de requêtes, veuillez réessayer plus tard',
    standardHeaders: true, // Return rate limit info in the `RateLimit-*` headers
    legacyHeaders: false, // Disable the `X-RateLimit-*` headers
    keyGenerator: (req) => {
        // Utilise l'IP réelle (utile derrière un proxy)
        return req.ip || req.connection.remoteAddress;
    }
});

/**
 * Rate limiter pour l'authentification (plus strict)
 */
const authLimiter = rateLimit({
    windowMs: 15 * 60 * 1000, // 15 minutes
    max: 5, // 5 tentatives par IP
    message: 'Trop de tentatives de connexion, veuillez réessayer dans 15 minutes',
    skipSuccessfulRequests: true, // Ne compte pas les tentatives réussies
    keyGenerator: (req) => {
        // Utilise l'email/username à la place de l'IP pour éviter les contournements
        return req.body.identifier || req.body.email || req.ip;
    }
});

/**
 * Rate limiter pour les uploads
 */
const uploadLimiter = rateLimit({
    windowMs: 60 * 60 * 1000, // 1 heure
    max: 10, // 10 uploads par heure
    message: 'Limite d\'upload dépassée',
    keyGenerator: (req) => {
        return (req.user?.userId || req.body.userId || req.ip);
    }
});

// ==================== INPUT VALIDATION ====================

/**
 * Valide une adresse email
 */
function validateEmail(email) {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email) && email.length <= 254;
}

/**
 * Valide un username
 */
function validateUsername(username) {
    const usernameRegex = /^[a-zA-Z0-9_-]{3,20}$/;
    return usernameRegex.test(username);
}

/**
 * Valide un mot de passe fort
 */
function validatePassword(password) {
    // Min 8 caractères, majuscule, minuscule, chiffre, caractère spécial
    const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/;
    return passwordRegex.test(password);
}

/**
 * Valide une entrée générale
 */
function validateInput(input, minLength = 1, maxLength = 1000) {
    if (typeof input !== 'string') {
        return false;
    }

    const trimmed = input.trim();
    return trimmed.length >= minLength && trimmed.length <= maxLength;
}

// ==================== INJECTION DETECTION ====================

/**
 * Détecte les tentatives d'injection
 */
function detectInjectionAttempt(input) {
    const injectionPatterns = [
        /<script[^>]*>.*?<\/script>/gi,
        /javascript:/gi,
        /onerror\s*=/gi,
        /onload\s*=/gi,
        /onclick\s*=/gi,
        /eval\s*\(/gi,
        /expression\s*\(/gi,
        /vbscript:/gi,
        /on\w+\s*=/gi
    ];

    if (typeof input === 'string') {
        return injectionPatterns.some(pattern => pattern.test(input));
    }

    // Pour les objets, vérifie récursivement
    if (typeof input === 'object' && input !== null) {
        return Object.values(input).some(val => detectInjectionAttempt(val));
    }

    return false;
}

// ==================== MIDDLEWARE FACTORIES ====================

/**
 * Middleware CSRF protection
 */
function csrfProtection(req, res, next) {
    // Génère une session ID si elle n'existe pas
    if (!req.session) {
        req.session = { id: crypto.randomBytes(16).toString('hex') };
    }

    // GET/HEAD/OPTIONS: génère un nouveau token
    if (['GET', 'HEAD', 'OPTIONS'].includes(req.method)) {
        const token = csrfManager.generateToken();
        csrfManager.storeToken(req.session.id, token);
        res.cookie('XSRF-TOKEN', token, {
            httpOnly: false, // Le client a besoin d'y accéder
            secure: process.env.NODE_ENV === 'production',
            sameSite: 'Strict',
            maxAge: 60 * 60 * 1000 // 1 heure
        });
        res.locals.csrfToken = token;
    } else {
        // POST/PUT/DELETE/PATCH: vérifie le token
        const token = req.headers['x-csrf-token'] || req.body._csrf;
        
        if (!token || !csrfManager.verifyToken(req.session.id, token)) {
            return res.status(403).json({ 
                error: 'invalid_csrf_token',
                message: 'Token CSRF invalide ou expiré'
            });
        }
    }

    next();
}

/**
 * Middleware des headers de sécurité
 */
function securityHeaders(req, res, next) {
    // Utilise helmet pour les headers standards
    helmet({
        contentSecurityPolicy: {
            directives: {
                defaultSrc: ["'self'"],
                scriptSrc: ["'self'", "'unsafe-inline'", "cdn.jsdelivr.net"],
                styleSrc: ["'self'", "'unsafe-inline'", "cdn.jsdelivr.net"],
                imgSrc: ["'self'", "data:", "https:", "blob:"],
                fontSrc: ["'self'", "cdn.jsdelivr.net"],
                connectSrc: ["'self'", "https://firebase.google.com"],
                frameSrc: ["'none'"],
                objectSrc: ["'none'"],
                formAction: ["'self'"]
            }
        },
        hsts: {
            maxAge: 31536000,
            includeSubDomains: true,
            preload: true
        },
        xssFilter: true,
        noSniff: true,
        referrerPolicy: { policy: 'strict-origin-when-cross-origin' },
        xssFilter: true,
        frameguard: { action: 'deny' }
    })(req, res, next);
}

/**
 * Middleware input sanitization
 */
function inputSanitization(req, res, next) {
    // Sanitize corps de requête
    if (req.body) {
        req.body = mongoSanitize()(req.body);

        // Validations supplémentaires
        for (const [key, value] of Object.entries(req.body)) {
            if (typeof value === 'string') {
                // Détecte les tentatives d'injection
                if (detectInjectionAttempt(value)) {
                    return res.status(400).json({ 
                        error: 'invalid_input',
                        message: `Entrée suspecte détectée: ${key}`
                    });
                }

                // Supprime les espaces inutiles
                req.body[key] = value.trim();
            }
        }
    }

    next();
}

/**
 * Middleware request logging avec sécurité
 */
function securityLogging(req, res, next) {
    const start = Date.now();

    // Log sécurisé (n'inclut pas les mots de passe)
    res.on('finish', () => {
        const duration = Date.now() - start;
        const logData = {
            timestamp: new Date().toISOString(),
            method: req.method,
            path: req.path,
            status: res.statusCode,
            duration: duration + 'ms',
            ip: req.ip
        };

        // Seulement log les erreurs et opérations sensibles
        if (res.statusCode >= 400 || ['POST', 'PUT', 'DELETE'].includes(req.method)) {
            console.log('[SECURITY LOG]', JSON.stringify(logData));
        }
    });

    next();
}

/**
 * Middleware de gestion des erreurs sécurisées
 */
function secureErrorHandler(err, req, res, next) {
    console.error('[ERROR]', {
        message: err.message,
        stack: err.stack,
        path: req.path,
        method: req.method
    });

    // Ne révèle pas les détails internes en production
    const isDevelopment = process.env.NODE_ENV === 'development';
    
    const errorResponse = {
        error: err.name || 'InternalServerError',
        message: isDevelopment ? err.message : 'Une erreur est survenue'
    };

    const statusCode = err.statusCode || 500;
    res.status(statusCode).json(errorResponse);
}

/**
 * Middleware pour obtenir le token CSRF
 */
function getCsrfToken(req, res, next) {
    if (req.method === 'GET' && req.path === '/api/csrf-token') {
        const token = csrfManager.generateToken();
        
        // Utilise une session basique si disponible
        const sessionId = req.session?.id || crypto.randomBytes(16).toString('hex');
        csrfManager.storeToken(sessionId, token);

        return res.json({ token });
    }
    next();
}

// ==================== EXPORT ====================

module.exports = {
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
    detectInjectionAttempt,
    csrfManager
};
