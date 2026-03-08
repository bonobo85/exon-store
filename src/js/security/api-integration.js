/**
 * ==================== API INTEGRATION HELPER ====================
 * Guide d'intégration de la sécurité dans app.js
 * 
 * IMPORTANT: Ajouter ces lignes au début de app.js pour charger la sécurité:
 * 
 * <script src="/js/security-utils.js"></script>
 * <script src="/js/security-init.js"></script>
 * <script src="/js/app.js"></script>
 */

// ==================== SECURE API EXAMPLES ====================

/**
 * Exemple: Enregistrement sécurisé
 */
async function secureRegister(email, password, username) {
    try {
        // 1. Validation côté client
        if (!validateEmail(email)) {
            console.error('Email invalide');
            return { error: 'invalid_email' };
        }

        if (!validatePassword(password)) {
            console.error('Mot de passe faible');
            return { error: 'weak_password' };
        }

        if (!validateUsername(username)) {
            console.error('Username invalide');
            return { error: 'invalid_username' };
        }

        // 2. Envoi sécurisé (token CSRF ajouté automatiquement)
        const response = await secureAPI('/api/register', {
            method: 'POST',
            body: JSON.stringify({
                email,
                password,
                username
            })
        });

        if (response.ok) {
            const data = await response.json();
            console.log('Enregistrement réussi:', data.user);
            
            // 3. Stockage sécurisé du token de session
            if (data.sessionToken) {
                SecureStorage.setSecure('sessionToken', data.sessionToken, 30);
            }
            
            return { success: true, user: data.user };
        } else {
            const error = await response.json();
            console.error('Erreur enregistrement:', error);
            return error;
        }
    } catch (error) {
        console.error('Erreur requête enregistrement:', error);
        return { error: 'network_error', message: error.message };
    }
}

/**
 * Exemple: Connexion sécurisée avec protection brute-force
 */
async function secureLogin(identifier, password) {
    try {
        // 1. Protection brute-force côté client
        if (!bruteForceProtection.recordAttempt(identifier)) {
            const attemptsLeft = bruteForceProtection.getAttemptsLeft(identifier);
            console.warn(`Trop de tentatives. Réessayez dans ${15 - Math.floor(Date.now() / 60000 % 15)} minutes`);
            return { error: 'too_many_attempts', attemptsLeft };
        }

        // 2. Validation basique
        if (!identifier || !password) {
            console.error('Identifiant et mot de passe requis');
            return { error: 'missing_fields' };
        }

        // 3. Envoi sécurisé
        const response = await secureAPI('/api/login', {
            method: 'POST',
            body: JSON.stringify({
                identifier,
                password
            })
        });

        if (response.ok) {
            const data = await response.json();
            console.log('Connexion réussie:', data.user);

            // 4. Stockage sécurisé
            bruteForceProtection.reset(identifier); // Réinitialise les tentatives
            SecureStorage.setSecure('sessionToken', data.sessionToken, 30);
            SecureStorage.setSecure('currentUser', JSON.stringify(data.user), 30);

            return { success: true, user: data.user };
        } else {
            const error = await response.json();
            console.error('Erreur connexion:', error);
            return error;
        }
    } catch (error) {
        console.error('Erreur requête connexion:', error);
        return { error: 'network_error', message: error.message };
    }
}

/**
 * Exemple: Déconnexion sécurisée
 */
async function secureLogout() {
    try {
        const sessionToken = SecureStorage.getSecure('sessionToken');

        const response = await secureAPI('/api/logout', {
            method: 'POST',
            body: JSON.stringify({ sessionToken })
        });

        // Nettoie le stockage côté client
        SecureStorage.removeSecure('sessionToken');
        SecureStorage.removeSecure('currentUser');
        csrfTokenManager.clearToken();

        console.log('Déconnexion réussie');
        return { success: true };
    } catch (error) {
        console.error('Erreur déconnexion:', error);
        return { error: 'logout_failed', message: error.message };
    }
}

/**
 * Exemple: Mise à jour panier sécurisée
 */
async function secureSaveCart(userId, cartItems) {
    try {
        // Validation
        if (!userId || !Array.isArray(cartItems)) {
            console.error('Données panier invalides');
            return { error: 'invalid_data' };
        }

        // Envoi avec CSRF protection
        const response = await secureAPI('/api/cart', {
            method: 'POST',
            body: JSON.stringify({
                userId,
                cart: cartItems
            })
        });

        if (response.ok) {
            const data = await response.json();
            console.log('Panier sauvegardé');
            return { success: true };
        } else {
            const error = await response.json();
            console.error('Erreur sauvegarde panier:', error);
            return error;
        }
    } catch (error) {
        console.error('Erreur requête panier:', error);
        return { error: 'network_error', message: error.message };
    }
}

/**
 * Exemple: Upload de fichier sécurisé
 */
async function secureUploadFile(file, userId) {
    try {
        // Validation du fichier
        const maxSize = 5 * 1024 * 1024; // 5MB
        const allowedTypes = ['application/vnd.ms-excel', 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet'];

        if (file.size > maxSize) {
            console.error('Fichier trop volumineux (max 5MB)');
            return { error: 'file_too_large' };
        }

        if (!allowedTypes.includes(file.type)) {
            console.error('Type de fichier non autorisé (Excel uniquement)');
            return { error: 'invalid_file_type' };
        }

        // Construction du FormData
        const formData = new FormData();
        formData.append('file', file);
        formData.append('userId', userId);

        // Récupère le token CSRF
        const csrfToken = csrfTokenManager.getToken();
        const headers = {
            'X-Requested-With': 'XMLHttpRequest',
            'X-CSRF-Token': csrfToken
        };

        // Envoi avec rate limiting côté serveur
        const response = await fetch('/api/import', {
            method: 'POST',
            credentials: 'same-origin',
            headers,
            body: formData
        });

        if (response.ok) {
            const data = await response.json();
            console.log(`${data.imported} utilisateurs importés`);
            return { success: true, imported: data.imported };
        } else {
            const error = await response.json();
            console.error('Erreur import:', error);
            return error;
        }
    } catch (error) {
        console.error('Erreur requête upload:', error);
        return { error: 'network_error', message: error.message };
    }
}

/**
 * Exemple: Validation avant envoi vers le serveur
 */
function validateBeforeSend(data, type = 'general') {
    let isValid = true;

    if (type === 'email' && !validateEmail(data)) {
        console.warn('Email invalide:', data);
        isValid = false;
    }

    if (type === 'password' && !validatePassword(data)) {
        console.warn('Mot de passe faible');
        isValid = false;
    }

    if (type === 'username' && !validateUsername(data)) {
        console.warn('Username invalide:', data);
        isValid = false;
    }

    if (type === 'injection' && detectInjectionAttempt(data)) {
        console.warn('Tentative d\'injection détectée:', data);
        isValid = false;
    }

    return isValid;
}

// ==================== INTEGRATION DANS APP.JS ====================

/*
// Remplacer les appels fetch existants par les exemples sécurisés

// ANCIEN CODE (NON-SÉCURISÉ):
fetch('/api/register', { method: 'POST', body: JSON.stringify(data) })

// NOUVEAU CODE (SÉCURISÉ):
await secureRegister(email, password, username)
await secureLogin(identifier, password)
await secureLogout()
await secureSaveCart(userId, cartItems)
await secureUploadFile(file, userId)

*/

// ==================== EXPORT ====================
if (typeof module !== 'undefined' && module.exports) {
    module.exports = {
        secureRegister,
        secureLogin,
        secureLogout,
        secureSaveCart,
        secureUploadFile,
        validateBeforeSend
    };
}
