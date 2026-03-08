// Firebase Integration - Database Operations
// This file handles all Firebase Firestore operations

// Import Firebase services from config
import { auth, db, googleProvider, createUserWithEmailAndPassword, signInWithEmailAndPassword, signOut, onAuthStateChanged, signInWithPopup, collection, doc, setDoc, getDoc, getDocs, updateDoc, query, where, orderBy } from './firebase-config.js';

// Generate a login session token that changes at each authentication.
function generateSessionToken() {
    if (typeof crypto !== 'undefined' && typeof crypto.randomUUID === 'function') {
        return crypto.randomUUID();
    }
    return `session_${Date.now()}_${Math.random().toString(36).slice(2, 12)}`;
}

// ==================== USER MANAGEMENT ====================

// Create new user in Firebase Auth + Firestore
async function createFirebaseUser(email, password, username) {
    try {
        // Create user in Firebase Auth
        const userCredential = await createUserWithEmailAndPassword(auth, email, password);
        const user = userCredential.user;
        const sessionToken = generateSessionToken();
        
        // Create user document in Firestore
        const userData = {
            userId: user.uid,
            email: email,
            username: username,
            createdAt: new Date().toISOString(),
            lastLoginAt: new Date().toISOString(),
            cart: [],
            purchaseHistory: [],
            sessionToken: sessionToken
        };
        
        await setDoc(doc(db, 'users', user.uid), userData);
        
        return { success: true, user: userData };
    } catch (error) {
        console.error('Firebase user creation error:', error);
        return { success: false, error: error.message };
    }
}

// Login user with Firebase Auth
async function loginFirebaseUser(email, password) {
    try {
        const userCredential = await signInWithEmailAndPassword(auth, email, password);
        const user = userCredential.user;
        const sessionToken = generateSessionToken();
        const lastLoginAt = new Date().toISOString();
        
        // Get user data from Firestore
        const userDoc = await getDoc(doc(db, 'users', user.uid));
        
        if (userDoc.exists()) {
            await updateDoc(doc(db, 'users', user.uid), {
                sessionToken,
                lastLoginAt
            });

            const userData = userDoc.data();
            return {
                success: true,
                user: {
                    ...userData,
                    sessionToken,
                    lastLoginAt
                }
            };
        } else {
            return { success: false, error: 'User data not found' };
        }
    } catch (error) {
        console.error('Firebase login error:', error);
        return { success: false, error: error.message };
    }
}

// Login with Google
async function loginWithGoogle() {
    try {
        const result = await signInWithPopup(auth, googleProvider);
        const user = result.user;
        const sessionToken = generateSessionToken();
        const lastLoginAt = new Date().toISOString();
        
        // Check if user exists in Firestore
        const userDoc = await getDoc(doc(db, 'users', user.uid));
        
        if (userDoc.exists()) {
            await updateDoc(doc(db, 'users', user.uid), {
                sessionToken,
                lastLoginAt
            });

            // Existing user - return their data
            const userData = userDoc.data();
            return {
                success: true,
                user: {
                    ...userData,
                    sessionToken,
                    lastLoginAt
                }
            };
        } else {
            // New user - create Firestore document
            const userData = {
                userId: user.uid,
                email: user.email,
                username: user.displayName || user.email.split('@')[0],
                createdAt: new Date().toISOString(),
                lastLoginAt,
                cart: [],
                purchaseHistory: [],
                sessionToken,
                authProvider: 'google'
            };
            
            await setDoc(doc(db, 'users', user.uid), userData);
            return { success: true, user: userData, isNewUser: true };
        }
    } catch (error) {
        console.error('Google login error:', error);
        return { success: false, error: error.message };
    }
}

// Logout user
async function logoutFirebaseUser() {
    try {
        const currentUser = auth.currentUser;
        if (currentUser) {
            try {
                await updateDoc(doc(db, 'users', currentUser.uid), {
                    sessionToken: null,
                    sessionEndedAt: new Date().toISOString()
                });
            } catch (sessionError) {
                console.warn('Could not clear session token on logout:', sessionError);
            }
        }

        await signOut(auth);
        return { success: true };
    } catch (error) {
        console.error('Firebase logout error:', error);
        return { success: false, error: error.message };
    }
}

// Get user data from Firestore
async function getFirebaseUser(userId) {
    try {
        const userDoc = await getDoc(doc(db, 'users', userId));
        if (userDoc.exists()) {
            return { success: true, user: userDoc.data() };
        } else {
            return { success: false, error: 'User not found' };
        }
    } catch (error) {
        console.error('Firebase get user error:', error);
        return { success: false, error: error.message };
    }
}

// Update user data in Firestore
async function updateFirebaseUser(userId, updates) {
    try {
        await updateDoc(doc(db, 'users', userId), updates);
        return { success: true };
    } catch (error) {
        console.error('Firebase update user error:', error);
        return { success: false, error: error.message };
    }
}

// ==================== CART MANAGEMENT ====================

// Update user's cart in Firestore
async function updateFirebaseCart(userId, cartItems) {
    try {
        await updateDoc(doc(db, 'users', userId), {
            cart: cartItems
        });
        return { success: true };
    } catch (error) {
        console.error('Firebase cart update error:', error);
        return { success: false, error: error.message };
    }
}

// Get user's cart from Firestore
async function getFirebaseCart(userId) {
    try {
        const userDoc = await getDoc(doc(db, 'users', userId));
        if (userDoc.exists()) {
            const cart = userDoc.data().cart || [];
            return { success: true, cart };
        } else {
            return { success: false, error: 'User not found' };
        }
    } catch (error) {
        console.error('Firebase get cart error:', error);
        return { success: false, error: error.message };
    }
}

// ==================== PURCHASE MANAGEMENT ====================

// Save purchase to Firestore
async function saveFirebasePurchase(userId, purchaseData) {
    try {
        // Add to purchases collection
        const purchaseRef = doc(collection(db, 'purchases'));
        const purchase = {
            ...purchaseData,
            userId: userId,
            timestamp: new Date().toISOString()
        };
        await setDoc(purchaseRef, purchase);
        
        // Update user's purchase history
        const userDoc = await getDoc(doc(db, 'users', userId));
        if (userDoc.exists()) {
            const currentHistory = userDoc.data().purchaseHistory || [];
            currentHistory.push(purchase);
            await updateDoc(doc(db, 'users', userId), {
                purchaseHistory: currentHistory,
                cart: [] // Clear cart after purchase
            });
        }
        
        return { success: true, purchaseId: purchaseRef.id };
    } catch (error) {
        console.error('Firebase save purchase error:', error);
        return { success: false, error: error.message };
    }
}

// Get user's purchase history from Firestore
async function getFirebasePurchaseHistory(userId) {
    try {
        const userDoc = await getDoc(doc(db, 'users', userId));
        if (userDoc.exists()) {
            const history = userDoc.data().purchaseHistory || [];
            return { success: true, history };
        } else {
            return { success: false, error: 'User not found' };
        }
    } catch (error) {
        console.error('Firebase get purchase history error:', error);
        return { success: false, error: error.message };
    }
}

// Get all purchases (for admin)
async function getAllFirebasePurchases() {
    try {
        const purchasesSnapshot = await getDocs(collection(db, 'purchases'));
        const purchases = [];
        purchasesSnapshot.forEach((doc) => {
            purchases.push({ id: doc.id, ...doc.data() });
        });
        return { success: true, purchases };
    } catch (error) {
        console.error('Firebase get all purchases error:', error);
        return { success: false, error: error.message };
    }
}

// ==================== ADMIN FUNCTIONS ====================

// Get all users (for admin)
async function getAllFirebaseUsers() {
    try {
        const usersSnapshot = await getDocs(collection(db, 'users'));
        const users = [];
        usersSnapshot.forEach((doc) => {
            users.push({ id: doc.id, ...doc.data() });
        });
        return { success: true, users };
    } catch (error) {
        console.error('Firebase get all users error:', error);
        return { success: false, error: error.message };
    }
}

// Get stats for admin dashboard
async function getFirebaseStats() {
    try {
        const usersSnapshot = await getDocs(collection(db, 'users'));
        const purchasesSnapshot = await getDocs(collection(db, 'purchases'));
        
        let totalRevenue = 0;
        let totalMembers = usersSnapshot.size;
        
        purchasesSnapshot.forEach((doc) => {
            const purchase = doc.data();
            totalRevenue += parseFloat(purchase.total || 0);
        });
        
        return {
            success: true,
            stats: {
                totalRevenue: totalRevenue.toFixed(2),
                totalMembers: totalMembers,
                totalPurchases: purchasesSnapshot.size
            }
        };
    } catch (error) {
        console.error('Firebase get stats error:', error);
        return { success: false, error: error.message };
    }
}

// ==================== AUTH STATE LISTENER ====================

// Listen to auth state changes
function onFirebaseAuthStateChanged(callback) {
    return onAuthStateChanged(auth, callback);
}

// Export all functions
export {
    createFirebaseUser,
    loginFirebaseUser,
    loginWithGoogle,
    logoutFirebaseUser,
    getFirebaseUser,
    updateFirebaseUser,
    updateFirebaseCart,
    getFirebaseCart,
    saveFirebasePurchase,
    getFirebasePurchaseHistory,
    getAllFirebasePurchases,
    getAllFirebaseUsers,
    getFirebaseStats,
    onFirebaseAuthStateChanged,
    auth
};
