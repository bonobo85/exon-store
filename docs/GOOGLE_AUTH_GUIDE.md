# 🔥 Authentification Google - Guide d'intégration

## ✅ Ce qui a été ajouté

L'authentification Google est maintenant **entièrement intégrée** à Bonobo Shop V2. Les utilisateurs peuvent se connecter avec leur compte Google en un clic.

## 🎯 Fonctionnalités

### Deux méthodes d'authentification disponibles

1. **Email/Password** (classique)
   - Inscription avec email, mot de passe et nom d'utilisateur
   - Connexion avec email et mot de passe

2. **Google Sign-In** (nouveau ✨)
   - Connexion instantanée avec compte Google
   - Pas de mot de passe à créer ou retenir
   - Création automatique du profil utilisateur

## 📁 Fichiers modifiés

### 1. Configuration Firebase

**`js/firebase-config.js`**
```javascript
// Ajout de GoogleAuthProvider et signInWithPopup
import { GoogleAuthProvider, signInWithPopup } from "firebase-auth.js";

const googleProvider = new GoogleAuthProvider();

export { googleProvider, signInWithPopup, ... };
```

### 2. Intégration Firebase

**`js/firebase-integration.js`**
```javascript
// Nouvelle fonction pour connexion Google
async function loginWithGoogle() {
    const result = await signInWithPopup(auth, googleProvider);
    const user = result.user;
    
    // Vérifie si l'utilisateur existe déjà
    if (userDoc.exists()) {
        return { success: true, user: userData };
    } else {
        // Crée un nouveau compte automatiquement
        const userData = {
            userId: user.uid,
            email: user.email,
            username: user.displayName || user.email.split('@')[0],
            authProvider: 'google',
            ...
        };
        await setDoc(doc(db, 'users', user.uid), userData);
        return { success: true, user: userData, isNewUser: true };
    }
}
```

### 3. Wrapper Firebase

**`js/firebase-wrapper.js`**
```javascript
// Exposition globale de la fonction Google
async function fbLoginWithGoogle() {
    if (firebaseAvailable && firebaseIntegration) {
        return await firebaseIntegration.loginWithGoogle();
    }
    return { success: false, error: 'Firebase not available' };
}

window.fbWrapper = {
    ...
    loginWithGoogle: fbLoginWithGoogle,
    ...
};
```

### 4. Handler global

**`js/app-firebase-patch.js`**
```javascript
// Fonction appelée par les boutons Google
window.handleGoogleLogin = async function() {
    const fbResult = await window.fbWrapper.loginWithGoogle();
    
    if (fbResult.success) {
        // Authentification réussie
        currentUser = fbResult.user;
        // Fusion du panier local + cloud
        // Message de bienvenue
        if (fbResult.isNewUser) {
            showToast('Bienvenue! 🎉 Compte créé avec Google');
        } else {
            showToast('Bienvenue! 🔥');
        }
    }
};
```

### 5. Interface utilisateur

**6 pages HTML mises à jour** avec boutons Google:
- ✅ `pages/index.html`
- ✅ `pages/cars.html`
- ✅ `pages/scripts.html`
- ✅ `pages/clothes.html`
- ✅ `pages/templates.html`
- ✅ `pages/about.html`

**Bouton ajouté dans les deux onglets** (Connexion ET Inscription):

```html
<div class="relative my-6">
    <div class="absolute inset-0 flex items-center">
        <div class="w-full border-t border-gray-700"></div>
    </div>
    <div class="relative flex justify-center text-sm">
        <span class="px-2 bg-gray-800 text-gray-400">ou</span>
    </div>
</div>

<button onclick="handleGoogleLogin()" class="w-full bg-white hover:bg-gray-100 text-gray-900 px-4 py-3 rounded-lg font-semibold flex items-center justify-center gap-3 transition-colors">
    <svg class="w-5 h-5" viewBox="0 0 24 24">
        <!-- Logo Google coloré (bleu, vert, jaune, rouge) -->
        <path fill="#4285F4" d="..."/>
        <path fill="#34A853" d="..."/>
        <path fill="#FBBC05" d="..."/>
        <path fill="#EA4335" d="..."/>
    </svg>
    Se connecter avec Google
</button>
```

## 🎨 Apparence

Le bouton Google suit les guidelines officielles :
- ✅ Fond blanc avec hover gris clair
- ✅ Logo Google coloré officiel (4 couleurs)
- ✅ Texte noir pour contraste maximum
- ✅ Séparateur "ou" entre les méthodes
- ✅ Même taille et style que les autres boutons

## 🔧 Configuration requise

### Dans Firebase Console

1. **Activer Google Sign-In**
   ```
   Firebase Console → Authentication → Sign-in method → Google
   ├─ Activer le bouton
   ├─ Email d'assistance: bonobo.des.alpes@gmail.com
   └─ Enregistrer
   ```

2. **Vérifier Email/Password activé**
   ```
   Firebase Console → Authentication → Sign-in method → Email/Password
   └─ Doit être activé
   ```

3. **Règles Firestore** (déjà configurées)
   - Permettent création de compte Google
   - UID Firebase utilisé comme identifiant unique
   - Email du compte Google enregistré

## 🧪 Test de la connexion Google

### Test 1: Première connexion Google

1. Ouvrez `pages/index.html` dans le navigateur
2. Cliquez sur **Se connecter** ou **S'inscrire** 
3. Cliquez sur le bouton **Se connecter avec Google**
4. Sélectionnez un compte Google dans la popup
5. ✅ Vérifiez:
   - Toast: "Bienvenue {nom}! 🎉 Compte créé avec Google"
   - Utilisateur connecté dans la navbar
   - Firebase Console → Authentication → Nouveau utilisateur visible
   - Firestore → Collection `users` → Nouveau document avec :
     ```json
     {
       "userId": "AbCdEfG123...",
       "email": "user@gmail.com",
       "username": "Prénom",
       "authProvider": "google",
       "cart": [],
       "purchaseHistory": [],
       "createdAt": "2026-03-03T..."
     }
     ```

### Test 2: Reconnexion Google

1. Déconnectez-vous
2. Cliquez sur **Se connecter**
3. Cliquez sur **Se connecter avec Google**
4. Sélectionnez le même compte
5. ✅ Vérifiez:
   - Toast: "Bienvenue {nom}! 🔥"
   - Panier restauré
   - Historique d'achats visible

### Test 3: Panier synchronisé

1. Connecté avec Google
2. Ajoutez des produits au panier
3. Déconnexion
4. Reconnexion avec Google
5. ✅ Vérifiez:
   - Les produits sont toujours dans le panier
   - Firestore → users/{userId}/cart contient les articles

### Test 4: Achat avec compte Google

1. Connecté avec Google
2. Ajoutez un produit gratuit au panier
3. Cliquez sur **Commander**
5. ✅ Vérifiez:
   - Achat enregistré dans Firestore
   - purchases/{purchaseId} créé
   - users/{userId}/purchaseHistory mis à jour

## 🔍 Vérification dans le code

### Dans la console navigateur (F12)

```javascript
// Vérifier que Firebase est disponible
window.fbWrapper.isAvailable()
// → true

// Vérifier que loginWithGoogle existe
typeof window.handleGoogleLogin
// → "function"

// Vérifier l'utilisateur actuel après connexion Google
window.currentUser
// → { userId, email, username, authProvider: "google", ... }
```

### Console lors de la connexion

```
🔥 Firebase enhancements loading...
✅ Firebase enhancements loaded
✅ Firebase loaded successfully
Firebase user authenticated: user@gmail.com
```

## ⚠️ Domaines autorisés

### Pour la production

Si vous hébergez sur un domaine personnalisé, ajoutez-le dans Firebase :

1. Firebase Console → Authentication → Settings
2. **Domaines autorisés**
3. Ajoutez votre domaine: `boutique.votresite.com`
4. Enregistrez

Par défaut, ces domaines fonctionnent :
- ✅ localhost
- ✅ 127.0.0.1
- ✅ *.firebaseapp.com
- ✅ Votre domaine Netlify

## 🚨 Dépannage

### "Popup has been closed by the user"

**Cause**: L'utilisateur a fermé la popup Google avant de sélectionner un compte

**Solution**: Normal, rien à faire. L'utilisateur peut réessayer.

### "Unauthorized domain"

**Cause**: Votre domaine n'est pas autorisé dans Firebase

**Solution**:
1. Firebase Console → Authentication → Settings → Domaines autorisés
2. Ajoutez votre domaine
3. Réessayez

### "Firebase not available"

**Cause**: Scripts Firebase n'ont pas chargé correctement

**Solution**:
1. Vérifiez la console (F12) pour les erreurs
2. Vérifiez votre connexion Internet
3. Vérifiez que firebase-config.js, firebase-wrapper.js, app-firebase-patch.js sont bien chargés
4. Hard refresh: Ctrl+Shift+R

### Utilisateur créé mais données manquantes

**Cause**: Erreur lors de la création du document Firestore

**Solution**:
1. Vérifiez les règles Firestore
2. Vérifiez dans la console les erreurs
3. L'utilisateur peut se reconnecter, son document sera recréé automatiquement

## 📊 Données stockées

### Utilisateur Google vs Email/Password

| Champ | Email/Password | Google Sign-In |
|-------|----------------|----------------|
| `userId` | UID Firebase | UID Firebase |
| `email` | Email saisi | Email Google |
| `username` | Saisi par l'utilisateur | `displayName` Google ou email |
| `authProvider` | Non présent | `"google"` |
| `cart` | [] | [] |
| `purchaseHistory` | [] | [] |
| `createdAt` | timestamp | timestamp |

**Note**: Les champs `cart` et `purchaseHistory` fonctionnent de manière identique pour les deux méthodes.

## ✅ Avantages

### Pour l'utilisateur

- ✅ **Connexion rapide** - Un clic au lieu de taper email/mot de passe
- ✅ **Pas de mot de passe** - Utilise le compte Google existant
- ✅ **Sécurisé** - OAuth2 de Google
- ✅ **Multi-appareils** - Même compte partout

### Pour vous

- ✅ **Moins d'abandons** - Connexion facilitée = plus de conversions
- ✅ **Email vérifié** - Les comptes Google ont un email vérifié
- ✅ **Moins de support** - Moins de "mot de passe oublié"
- ✅ **Données fiables** - Nom et email corrects

## 📈 Statistiques

Dans le dashboard admin, vous pouvez voir :

- Nombre total d'utilisateurs
- Méthode d'authentification (email ou google)
- Taux de conversion par méthode

## 🎯 Prochaines étapes recommandées

1. ✅ **Activer Google Sign-In dans Firebase** (obligatoire)
2. ✅ **Tester avec un compte Google test**
3. ⚪ Ajouter d'autres providers (Facebook, Apple, etc.)
4. ⚪ Implémenter "Mot de passe oublié" pour Email/Password
5. ⚪ Ajouter photo de profil depuis Google

---

✅ **L'authentification Google est prête à l'emploi!**

Il suffit d'activer Google Sign-In dans Firebase Console et les utilisateurs pourront se connecter avec leur compte Google immédiatement.
