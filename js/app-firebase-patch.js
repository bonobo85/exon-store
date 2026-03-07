// Firebase Enhancements for app.js
// This file overrides app.js functions to use Firebase when available

// Wait for app.js to load, then override functions
(function() {
    'use strict';
    
    console.log('🎉 Firebase enhancements loading...');
    
    // Store original functions
    const originalHandleLogin = window.handleLogin;
    const originalHandleRegister = window.handleRegister;
    const originalHandleLogout = window.handleLogout;
    const originalUpdateCartInDB = window.updateCartInDB;
    
    // Override handleLogin
    window.handleLogin = async function() {
        const email = document.getElementById('login-email').value;
        const password = document.getElementById('login-password').value;

        clearErrorMessages();

        if (!email) {
            document.getElementById('login-email-error').textContent = 'Email requis';
            return;
        }
        if (!password) {
            document.getElementById('login-password-error').textContent = 'Mot de passe requis';
            return;
        }

        // Try Firebase first if available
        if (window.fbWrapper && window.fbWrapper.isAvailable()) {
            try {
                const fbResult = await window.fbWrapper.login(email, password);
                if (fbResult.success) {
                    const user = fbResult.user;
                    saveSessionToken(user.sessionToken || user.userId);
                    
                    // Merge cart items
                    let existing = cartItems || [];
                    let stored = user.cart || [];
                    const merged = [...stored];
                    existing.forEach(item => {
                        const found = merged.find(i => i.id === item.id);
                        if (found) {
                            found.quantity += item.quantity;
                        } else {
                            merged.push(item);
                        }
                    });
                    cartItems = merged;
                    
                    currentUser = user;
                    upsertLocalUser(user);
                    purchaseHistory = user.purchaseHistory || [];
                    
                    // Sync cart to Firebase
                    await window.fbWrapper.updateCart(user.userId, cartItems);
                    updateCartUI();
                    updateAuthUI();
                    closeModal('auth-modal');
                    showToast(`Bienvenue ${user.username}! ?Y"?`);
                    
                    if (pendingCheckout) {
                        pendingCheckout = false;
                        showPayment();
                    }
                    return;
                } else {
                    // Firebase login failed, show appropriate error
                    if (fbResult.error.includes('user-not-found') || fbResult.error.includes('wrong-password')) {
                        document.getElementById('login-error').textContent = 'Email ou mot de passe incorrect';
                    } else {
                        document.getElementById('login-error').textContent = 'Erreur de connexion: ' + fbResult.error;
                    }
                    return;
                }
            } catch (error) {
                console.error('Firebase login error:', error);
                // Continue to fallback
            }
        }

        // Fallback to original function
        return originalHandleLogin ? originalHandleLogin() : null;
    };
    
    // Override handleRegister
    window.handleRegister = async function() {
        const username = document.getElementById('register-username').value;
        const email = document.getElementById('register-email').value;
        const password = document.getElementById('register-password').value;
        const confirm = document.getElementById('register-confirm').value;

        clearErrorMessages();

        if (!username) {
            document.getElementById('register-username-error').textContent = 'Nom d\'utilisateur requis';
            return;
        }
        if (!email) {
            document.getElementById('register-email-error').textContent = 'Email requis';
            return;
        }
        if (!password) {
            document.getElementById('register-password-error').textContent = 'Mot de passe requis';
            return;
        }
        if (password !== confirm) {
            document.getElementById('register-confirm-error').textContent = 'Les mots de passe ne correspondent pas';
            return;
        }

        // Try Firebase first if available
        if (window.fbWrapper && window.fbWrapper.isAvailable()) {
            document.getElementById('register-btn').disabled = true;
            document.getElementById('register-btn').innerHTML = '<span class="spinner"></span>';
            
            try {
                const fbResult = await window.fbWrapper.register(email, password, username);
                if (fbResult.success) {
                    const newUser = fbResult.user;
                    saveSessionToken(newUser.sessionToken || newUser.userId);
                    
                    currentUser = newUser;
                    upsertLocalUser(newUser);
                    cartItems = newUser.cart || [];
                    purchaseHistory = newUser.purchaseHistory || [];
                    
                    // Sync cart to Firebase
                    await window.fbWrapper.updateCart(newUser.userId, cartItems);
                    updateCartUI();
                    updateAuthUI();
                    closeModal('auth-modal');
                    showToast('Inscription réussie! 🎉');
                    
                    document.getElementById('register-btn').disabled = false;
                    document.getElementById('register-btn').innerHTML = 'S\'inscrire';
                    return;
                } else {
                    document.getElementById('register-error').textContent = fbResult.error.includes('email-already-in-use') 
                        ? 'Cet email est déjà utilisé' 
                        : 'Erreur d\'inscription: ' + fbResult.error;
                    document.getElementById('register-btn').disabled = false;
                    document.getElementById('register-btn').innerHTML = 'S\'inscrire';
                    return;
                }
            } catch (error) {
                console.error('Firebase register error:', error);
                document.getElementById('register-btn').disabled = false;
                document.getElementById('register-btn').innerHTML = 'S\'inscrire';
                // Continue to fallback
            }
        }

        // Fallback to original function
        return originalHandleRegister ? originalHandleRegister() : null;
    };
    
    // Override handleLogout
    window.handleLogout = async function() {
        // Try Firebase first if available
        if (window.fbWrapper && window.fbWrapper.isAvailable()) {
            try {
                await window.fbWrapper.logout();
            } catch (error) {
                console.error('Firebase logout error:', error);
            }
        }
        
        // Continue with original logout
        return originalHandleLogout ? originalHandleLogout() : null;
    };
    
    // Override updateCartInDB to sync with Firebase
    const originalUpdateCartInDBFunc = window.updateCartInDB;
    window.updateCartInDB = async function() {
        // Call original function first
        if (originalUpdateCartInDBFunc) {
            await originalUpdateCartInDBFunc();
        } else {
            localStorage.setItem('bonobo_cart', JSON.stringify(cartItems));
            
            if (currentUser) {
                currentUser.cart = JSON.stringify(cartItems);
                upsertLocalUser(currentUser);
            }
        }
        
        // Sync to Firebase if available and user is logged in
        if (window.fbWrapper && window.fbWrapper.isAvailable() && currentUser && currentUser.userId) {
            try {
                await window.fbWrapper.updateCart(currentUser.userId, cartItems);
            } catch (error) {
                console.error('Firebase cart sync error:', error);
            }
        }
    };
    
    // Override completePurchase to save in Firebase
    const originalCompletePurchase = window.completePurchase;
    if (typeof completePurchase !== 'undefined') {
        window.completePurchase = async function() {
            const subtotal = cartItems.reduce((sum, item) => sum + (item.price * item.quantity), 0);
            const discount = currentPromo ? subtotal * currentPromo.discount : 0;
            const generatedOrderId = 'order_' + Date.now();
            
            const purchase = {
                id: generatedOrderId,
                items: JSON.stringify(cartItems),
                total: (subtotal - discount).toFixed(2),
                date: new Date().toISOString(),
                promoCode: currentPromo ? currentPromo.code : null,
                paymentMethod: 'Commande directe'
            };
            
            // Save to Firebase if available
            if (window.fbWrapper && window.fbWrapper.isAvailable() && currentUser && currentUser.userId) {
                try {
                    await window.fbWrapper.savePurchase(currentUser.userId, purchase);
                    console.log('✅ Purchase saved to Firebase');
                } catch (error) {
                    console.error('Firebase purchase save error:', error);
                }
            }
            
            // Continue with original function
            if (originalCompletePurchase) {
                return originalCompletePurchase();
            } else {
                // Fallback implementation
                purchaseHistory.push(purchase);
                if (currentUser) {
                    currentUser.purchaseHistory = JSON.stringify(purchaseHistory);
                    currentUser.cart = '[]';
                    upsertLocalUser(currentUser);
                }
                
                cartItems = [];
                currentPromo = null;
                updateCartUI();
                updateCartInDB();
                
                closeModal('payment-modal');
                showToast('Commande validée. Merci pour votre achat!');
                renderPurchaseHistory();
            }
        };
    }
    
    // New function for Google Sign-In
    window.handleGoogleLogin = async function() {
        if (!window.fbWrapper || !window.fbWrapper.isAvailable()) {
            showToast('🔒 Connexion Google non disponible');
            return;
        }
        
        try {
            const fbResult = await window.fbWrapper.loginWithGoogle();
            if (fbResult.success) {
                const user = fbResult.user;
                saveSessionToken(user.sessionToken || user.userId);
                
                // Merge cart items
                let existing = cartItems || [];
                let stored = user.cart || [];
                const merged = [...stored];
                existing.forEach(item => {
                    const found = merged.find(i => i.id === item.id);
                    if (found) {
                        found.quantity += item.quantity;
                    } else {
                        merged.push(item);
                    }
                });
                cartItems = merged;
                
                currentUser = user;
                upsertLocalUser(user);
                purchaseHistory = user.purchaseHistory || [];
                
                // Sync cart to Firebase
                await window.fbWrapper.updateCart(user.userId, cartItems);
                updateCartUI();
                updateAuthUI();
                closeModal('auth-modal');
                
                if (fbResult.isNewUser) {
                    showToast(`Bienvenue ${user.username}! 🎉 Compte créé avec Google`);
                } else {
                    showToast(`Bienvenue ${user.username}! 🎉`);
                }
                
                if (pendingCheckout) {
                    pendingCheckout = false;
                    showPayment();
                }
            } else {
                showToast('❌ Erreur de connexion Google: ' + fbResult.error);
            }
        } catch (error) {
            console.error('Google login error:', error);
            showToast('❌ Erreur de connexion Google');
        }
    };
    
    console.log('✅ Firebase enhancements loaded');
})();

