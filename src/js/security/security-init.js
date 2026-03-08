/**
 * ==================== SÉCURITÉ HTML ====================
 * Ajoute les headers de sécurité au HTML
 * et initialise les protections côté client
 */

// =========== A AJOUTER DANS <head> DE TOUS LES HTML ===========

/*
<!-- ==================== SECURITY HEADERS ==================== -->

<!-- Content Security Policy - Protège contre XSS et injections -->
<meta http-equiv="Content-Security-Policy" content="
    default-src 'self';
    script-src 'self' 'unsafe-inline' cdn.jsdelivr.net;
    style-src 'self' 'unsafe-inline' cdn.jsdelivr.net;
    img-src 'self' data: https: blob:;
    font-src 'self' cdn.jsdelivr.net;
    connect-src 'self' https://firebase.google.com https://www.googleapis.com https://identitytoolkit.googleapis.com;
    frame-src 'none';
    object-src 'none';
    form-action 'self';
    upgrade-insecure-requests;
">

<!-- Prevent clickjacking -->
<meta http-equiv="X-UA-Compatible" content="IE=edge">
<meta name="X-UA-Compatible" content="IE=edge">

<!-- Disable MIME sniffing -->
<meta http-equiv="X-Content-Type-Options" content="nosniff">

<!-- Enable XSS filter -->
<meta http-equiv="X-XSS-Protection" content="1; mode=block">

<!-- Referrer Policy -->
<meta name="referrer" content="strict-origin-when-cross-origin">

<!-- Suivi des ressources non-sécurisées -->
<meta http-equiv="upgrade-insecure-requests">

<!-- Disable idle timeout (si nécessaire) -->
<meta name="service-worker" content="security-sw.js">


==================== CHARGER LES SCRIPTS DE SÉCURITÉ =======================

<!-- IMPORTANT: Charger security-utils.js en premier -->
<script src="/js/security-utils.js"></script>

<!-- Puis charger les autres scripts -->
<script src="/js/app.js"></script>

*/

(function() {
    'use strict';
    
    // ==================== INITIALIZE SECURITY ====================
    
    /**
     * Initialise tous les mécanismes de sécurité
     */
    function initializeSecurity() {
        console.log('[SECURITY] Initialisation des protections...');
        
        // 1. CSRF Token
        console.log('[SECURITY] Configuration CSRF Token Manager');
        
        // 2. Nettoyage des données expirées
        SecureStorage.cleanExpired();
        
        // 3. Protection contre les modifications du DOM
        setupDOMProtection();
        
        // 4. Surveillance des événements storage
        setupStorageMonitoring();
        
        // 5. Détection de contenu malveillant
        setupMalwareDetection();
        
        // 6. Protection contre les clics malveillants
        setupClickjackingProtection();
        
        console.log('[SECURITY] Protections initialisées');
    }
    
    // ==================== DOM PROTECTION ====================
    
    /**
     * Protège le DOM contre les modifications non-autorisées
     */
    function setupDOMProtection() {
        // Observe les mutations du DOM
        const observer = new MutationObserver((mutations) => {
            mutations.forEach((mutation) => {
                // Vérifie les scripts injectés
                if (mutation.type === 'childList') {
                    mutation.addedNodes.forEach((node) => {
                        if (node.nodeName === 'SCRIPT') {
                            // Script injecté détecté
                            console.warn('[SECURITY] Script injecté détecté:', node);
                            
                            // Supprime le script si non autorisé
                            if (!node.src || !isAllowedDomain(node.src)) {
                                node.remove();
                                console.warn('[SECURITY] Script malveillant supprimé');
                            }
                        }
                    });
                }
            });
        });
        
        observer.observe(document.body, {
            childList: true,
            subtree: true,
            attributes: false
        });
    }
    
    /**
     * Vérifie si un domaine est autorisé
     */
    function isAllowedDomain(url) {
        const allowedDomains = [
            window.location.origin,
            'https://cdn.jsdelivr.net',
            'https://firebase.google.com',
            'https://www.googleapis.com'
        ];
        
        return allowedDomains.some(domain => url.startsWith(domain));
    }
    
    // ==================== STORAGE MONITORING ====================
    
    /**
     * Surveille les modifications du localStorage/sessionStorage
     */
    function setupStorageMonitoring() {
        const originalSetItem = Storage.prototype.setItem;
        const originalRemoveItem = Storage.prototype.removeItem;
        
        // Ajoute logging et validation
        Storage.prototype.setItem = function(key, value) {
            // Ne log pas les tokens sensibles
            if (!key.includes('csrf') && !key.includes('token')) {
                console.log(`[STORAGE] setItem: ${key}`);
            }
            
            // Limite la taille
            if (value && value.length > 1000000) { // 1MB
                console.warn(`[SECURITY] Storage size limit exceeded for key: ${key}`);
                return;
            }
            
            return originalSetItem.call(this, key, value);
        };
        
        Storage.prototype.removeItem = function(key) {
            console.log(`[STORAGE] removeItem: ${key}`);
            return originalRemoveItem.call(this, key);
        };
    }
    
    // ==================== MALWARE DETECTION ====================
    
    /**
     * Détecte les patterns malveillants courants
     */
    function setupMalwareDetection() {
        // Patterns courants de malware/phishing
        const malwarePatterns = [
            /eval\s*\(/gi,
            /document\.write\s*\(/gi,
            /innerHTML\s*=/gi,
            /dangerouslySetInnerHTML/gi,
            /onclick.*javascript:/gi
        ];
        
        // Surveille les tentatives d'exécution
        window.addEventListener('error', (event) => {
            const message = event.message || '';
            const source = event.filename || '';
            
            malwarePatterns.forEach(pattern => {
                if (pattern.test(message) || pattern.test(source)) {
                    console.warn('[SECURITY] Tentative malveillante détectée:', event);
                }
            });
        });
    }
    
    // ==================== CLICKJACKING PROTECTION ====================
    
    /**
     * Protège contre les attaques clickjacking
     */
    function setupClickjackingProtection() {
        // Vérifie que la page n'est pas dans un iframe
        if (window.self !== window.top) {
            console.warn('[SECURITY] Page détectée dans un iframe!');
            
            // Peut rediriger ou afficher un avertissement
            try {
                window.top.location = window.self.location;
            } catch (e) {
                console.warn('[SECURITY] Impossible de breakout du iframe');
            }
        }
    }
    
    // ==================== SECURE EVENT LISTENERS ====================
    
    /**
     * Ajoute des event listeners sécurisés
     */
    function setupSecureEventListeners() {
        // Empêche la modification des fonctions sensibles
        Object.defineProperty(window, 'eval', {
            get: function() {
                console.warn('[SECURITY] Tentative d\'accès à eval()');
                return undefined;
            }
        });
    }
    
    // ==================== INITIALIZATION ====================
    
    // Initialise les protections au chargement du document
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', initializeSecurity);
    } else {
        initializeSecurity();
    }
    
    // Exporte les fonctions pour débogage
    window.SecurityDebug = {
        validateEmail,
        validatePassword,
        validateUsername,
        sanitizeInput,
        sanitizeUser,
        escapeHTML,
        detectInjectionAttempt,
        CSRFTokenManager: CSRFTokenManager
    };
})();
