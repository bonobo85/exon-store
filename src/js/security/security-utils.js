/**
 * ==================== SÉCURITÉ UTILS ====================
 * Utilitaires de sécurité côté client
 * - Génération et gestion des tokens CSRF
 * - Protection XSS
 * - Validation d'entrée
 * - Sécurisation des données sensibles
 */

// ==================== CSRF TOKEN MANAGEMENT ====================

class CSRFTokenManager {
    constructor() {
        this.tokenKey = 'exon_csrf_token';
        this.tokenHeader = 'X-CSRF-Token';
        this.init();
    }

    /**
     * Initialise le token CSRF depuis le serveur
     */
    async init() {
        try {
            // Vérifie si un token existe déjà
            if (!this.getToken()) {
                await this.requestNewToken();
            }
        } catch (error) {
            console.error('Erreur initialisation CSRF:', error);
        }
    }

    /**
     * Demande un nouveau token au serveur
     */
    async requestNewToken() {
        try {
            const response = await fetch('/api/csrf-token', {
                method: 'GET',
                credentials: 'same-origin',
                headers: {
                    'Content-Type': 'application/json'
                }
            });

            if (response.ok) {
                const data = await response.json();
                this.setToken(data.token);
                return data.token;
            }
        } catch (error) {
            console.error('Erreur requête token CSRF:', error);
        }
    }

    /**
     * Sauvegarde le token en sessionStorage
     */
    setToken(token) {
        try {
            sessionStorage.setItem(this.tokenKey, token);
        } catch (error) {
            console.warn('sessionStorage indisponible, utilisation localStorage:', error);
            localStorage.setItem(this.tokenKey, token);
        }
    }

    /**
     * Récupère le token CSRF
     */
    getToken() {
        try {
            return sessionStorage.getItem(this.tokenKey) || localStorage.getItem(this.tokenKey);
        } catch (error) {
            return localStorage.getItem(this.tokenKey);
        }
    }

    /**
     * Supprime le token (logout)
     */
    clearToken() {
        try {
            sessionStorage.removeItem(this.tokenKey);
        } catch (error) {
            console.warn('Erreur suppression sessionStorage');
        }
        localStorage.removeItem(this.tokenKey);
    }

    /**
     * Ajoute le token CSRF aux headers
     */
    addToHeaders(headers = {}) {
        const token = this.getToken();
        if (token) {
            headers[this.tokenHeader] = token;
        }
        return headers;
    }
}

// Instance globale
const csrfTokenManager = new CSRFTokenManager();

// ==================== SECURE FETCH WRAPPER ====================

/**
 * Wrapper fetch sécurisé avec CSRF protection
 */
async function secureAPI(endpoint, options = {}) {
    const method = options.method || 'GET';
    const isWriteOperation = ['POST', 'PUT', 'DELETE', 'PATCH'].includes(method);

    // Configuration par défaut
    const config = {
        method,
        credentials: 'same-origin',
        headers: {
            'Content-Type': 'application/json',
            'X-Requested-With': 'XMLHttpRequest',
            ...options.headers
        },
        ...options
    };

    // Ajoute CSRF token pour toutes les opérations d'écriture
    if (isWriteOperation) {
        config.headers = csrfTokenManager.addToHeaders(config.headers);
    }

    try {
        const response = await fetch(endpoint, config);

        // Gère les réponses d'erreur
        if (!response.ok) {
            if (response.status === 403) {
                console.warn('Accès refusé - Token CSRF invalide?');
                await csrfTokenManager.requestNewToken();
            }
            throw new APIError(response.status, response.statusText);
        }

        return response;
    } catch (error) {
        console.error(`Erreur API [${method} ${endpoint}]:`, error);
        throw error;
    }
}

// ==================== XSS PROTECTION ====================

/**
 * Échappe les caractères HTML dangereux
 */
function escapeHTML(text) {
    if (!text) return '';
    const div = document.createElement('div');
    div.textContent = text;
    return div.innerHTML;
}

/**
 * Sanitize objet utilisateur (supprime les champs sensibles)
 */
function sanitizeUser(user) {
    if (!user) return null;
    return {
        userId: user.userId,
        username: sanitizeInput(user.username),
        email: sanitizeInput(user.email),
        createdAt: user.createdAt,
        // NE PAS inclure le mot de passe
    };
}

/**
 * Sanitize input - supprime balises HTML et caractères dangereux
 */
function sanitizeInput(input, maxLength = 255) {
    if (!input) return '';
    
    // Supprime les balises HTML
    let sanitized = input.replace(/<[^>]*>/g, '');
    
    // Échappe les caractères HTML
    sanitized = escapeHTML(sanitized);
    
    // Limite la longueur
    if (sanitized.length > maxLength) {
        sanitized = sanitized.substring(0, maxLength);
    }
    
    return sanitized.trim();
}

/**
 * Valide une adresse email
 */
function validateEmail(email) {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email) && email.length <= 254;
}

/**
 * Valide un mot de passe
 * Min 8 caractères, majuscule, minuscule, chiffre, caractère spécial
 */
function validatePassword(password) {
    const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/;
    return passwordRegex.test(password);
}

/**
 * Valide un username
 */
function validateUsername(username) {
    const usernameRegex = /^[a-zA-Z0-9_-]{3,20}$/;
    return usernameRegex.test(username);
}

// ==================== SECURE STORAGE ====================

/**
 * Gère le stockage sécurisé des données sensibles
 */
class SecureStorage {
    /**
     * Sauvegarde une donnée sensible avec expiration
     */
    static setSecure(key, value, expirationMinutes = 30) {
        const data = {
            value,
            timestamp: Date.now(),
            expiration: expirationMinutes * 60 * 1000
        };
        
        try {
            sessionStorage.setItem(key, JSON.stringify(data));
        } catch (error) {
            console.warn('sessionStorage indisponible');
        }
    }

    /**
     * Récupère une donnée sensible (vérifie l'expiration)
     */
    static getSecure(key) {
        try {
            const data = JSON.parse(sessionStorage.getItem(key));
            
            if (!data) return null;
            
            // Vérifie l'expiration
            const age = Date.now() - data.timestamp;
            if (age > data.expiration) {
                sessionStorage.removeItem(key);
                return null;
            }
            
            return data.value;
        } catch (error) {
            return null;
        }
    }

    /**
     * Supprime une donnée sensible
     */
    static removeSecure(key) {
        try {
            sessionStorage.removeItem(key);
        } catch (error) {
            console.warn('Erreur suppression sessionStorage');
        }
    }

    /**
     * Nettoie toutes les données à l'expiration
     */
    static cleanExpired() {
        try {
            for (let i = 0; i < sessionStorage.length; i++) {
                const key = sessionStorage.key(i);
                const data = JSON.parse(sessionStorage.getItem(key));
                
                if (data && data.expiration) {
                    const age = Date.now() - data.timestamp;
                    if (age > data.expiration) {
                        sessionStorage.removeItem(key);
                    }
                }
            }
        } catch (error) {
            console.warn('Erreur nettoyage sessionStorage');
        }
    }
}

// ==================== ERROR CLASSES ====================

/**
 * Classe pour les erreurs API
 */
class APIError extends Error {
    constructor(status, message) {
        super(message);
        this.name = 'APIError';
        this.status = status;
    }
}

// ==================== LINE OF DEFENSE UTILITIES ====================

/**
 * Détecte les tentatives d'injection
 */
function detectInjectionAttempt(input) {
    const injectionPatterns = [
        /<script[^>]*>.*?<\/script>/gi,
        /javascript:/gi,
        /on\w+\s*=/gi,
        /eval\s*\(/gi,
        /alert\s*\(/gi,
        /onerror\s*=/gi
    ];

    return injectionPatterns.some(pattern => pattern.test(input));
}

/**
 * Vérifie les tentatives de brute force
 */
class BruteForceProtection {
    constructor(maxAttempts = 5, windowMinutes = 15) {
        this.maxAttempts = maxAttempts;
        this.windowMs = windowMinutes * 60 * 1000;
        this.attempts = new Map();
    }

    recordAttempt(identifier) {
        const now = Date.now();
        
        if (!this.attempts.has(identifier)) {
            this.attempts.set(identifier, []);
        }

        const attempts = this.attempts.get(identifier);
        
        // Supprime les tentatives expirées
        const validAttempts = attempts.filter(time => now - time < this.windowMs);
        
        if (validAttempts.length >= this.maxAttempts) {
            return false; // Blocage
        }

        validAttempts.push(now);
        this.attempts.set(identifier, validAttempts);
        return true; // Autorisé
    }

    isBlocked(identifier) {
        const attempts = this.attempts.get(identifier) || [];
        const now = Date.now();
        
        const validAttempts = attempts.filter(time => now - time < this.windowMs);
        return validAttempts.length >= this.maxAttempts;
    }

    getAttemptsLeft(identifier) {
        const attempts = this.attempts.get(identifier) || [];
        const now = Date.now();
        
        const validAttempts = attempts.filter(time => now - time < this.windowMs);
        return Math.max(0, this.maxAttempts - validAttempts.length);
    }

    reset(identifier) {
        this.attempts.delete(identifier);
    }
}

// Instance globale pour protection brute force
const bruteForceProtection = new BruteForceProtection(5, 15);

// ==================== EXPORT ====================

// Nettoyage automatique des données expirées chaque 5 minutes
setInterval(() => SecureStorage.cleanExpired(), 5 * 60 * 1000);
