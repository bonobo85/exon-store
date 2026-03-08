// Firebase Wrapper - Bridges app.js with Firebase
// This file loads Firebase and exposes functions to app.js

let firebaseAvailable = false;
let firebaseIntegration = null;

// Try to load Firebase integration
async function initFirebase() {
    try {
        firebaseIntegration = await import('./firebase-integration.js');
        firebaseAvailable = true;
        console.log('?o. Firebase loaded successfully');
        
        // Setup auth state listener
        firebaseIntegration.onFirebaseAuthStateChanged(async (user) => {
            if (user) {
                console.log('Firebase user authenticated:', user.email);
                // Load user data from Firestore
                const result = await firebaseIntegration.getFirebaseUser(user.uid);
                if (result.success && window.currentUser) {
                    // Sync with global state
                    Object.assign(window.currentUser, result.user);
                }
            }
        });
        
        return true;
    } catch (error) {
        console.warn('?s?? Firebase not available, using localStorage:', error.message);
        firebaseAvailable = false;
        return false;
    }
}

// Wrapper functions that use Firebase if available, otherwise fall back to original behavior

async function fbLogin(email, password) {
    if (firebaseAvailable && firebaseIntegration) {
        return await firebaseIntegration.loginFirebaseUser(email, password);
    }
    return { success: false, error: 'Firebase not available' };
}

async function fbRegister(email, password, username) {
    if (firebaseAvailable && firebaseIntegration) {
        return await firebaseIntegration.createFirebaseUser(email, password, username);
    }
    return { success: false, error: 'Firebase not available' };
}

async function fbLoginWithGoogle() {
    if (firebaseAvailable && firebaseIntegration) {
        return await firebaseIntegration.loginWithGoogle();
    }
    return { success: false, error: 'Firebase not available' };
}

async function fbLogout() {
    if (firebaseAvailable && firebaseIntegration) {
        return await firebaseIntegration.logoutFirebaseUser();
    }
    return { success: true };
}

async function fbUpdateCart(userId, cartItems) {
    if (firebaseAvailable && firebaseIntegration) {
        return await firebaseIntegration.updateFirebaseCart(userId, cartItems);
    }
    return { success: false };
}

async function fbGetCart(userId) {
    if (firebaseAvailable && firebaseIntegration) {
        return await firebaseIntegration.getFirebaseCart(userId);
    }
    return { success: false };
}

async function fbSavePurchase(userId, purchaseData) {
    if (firebaseAvailable && firebaseIntegration) {
        return await firebaseIntegration.saveFirebasePurchase(userId, purchaseData);
    }
    return { success: false };
}

async function fbGetPurchaseHistory(userId) {
    if (firebaseAvailable && firebaseIntegration) {
        return await firebaseIntegration.getFirebasePurchaseHistory(userId);
    }
    return { success: false };
}

async function fbGetAllUsers() {
    if (firebaseAvailable && firebaseIntegration) {
        return await firebaseIntegration.getAllFirebaseUsers();
    }
    return { success: false };
}

async function fbGetAllPurchases() {
    if (firebaseAvailable && firebaseIntegration) {
        return await firebaseIntegration.getAllFirebasePurchases();
    }
    return { success: false };
}

async function fbGetStats() {
    if (firebaseAvailable && firebaseIntegration) {
        return await firebaseIntegration.getFirebaseStats();
    }
    return { success: false };
}

// Export to global scope for app.js to use
window.fbWrapper = {
    init: initFirebase,
    isAvailable: () => firebaseAvailable,
    login: fbLogin,
    register: fbRegister,
    loginWithGoogle: fbLoginWithGoogle,
    logout: fbLogout,
    updateCart: fbUpdateCart,
    getCart: fbGetCart,
    savePurchase: fbSavePurchase,
    getPurchaseHistory: fbGetPurchaseHistory,
    getAllUsers: fbGetAllUsers,
    getAllPurchases: fbGetAllPurchases,
    getStats: fbGetStats
};

// Auto-initialize Firebase on load
document.addEventListener('DOMContentLoaded', async () => {
    await initFirebase();
});

