# ­ƒöÑ Authentification Google - Guide d'int├®gration

## Ô£à Ce qui a ├®t├® ajout├®

L'authentification Google est maintenant **enti├¿rement int├®gr├®e** ├á Bonobo Shop V2. Les utilisateurs peuvent se connecter avec leur compte Google en un clic.

## ­ƒÄ» Fonctionnalit├®s

### Deux m├®thodes d'authentification disponibles

1. **Email/Password** (classique)
   - Inscription avec email, mot de passe et nom d'utilisateur
   - Connexion avec email et mot de passe

2. **Google Sign-In** (nouveau Ô£¿)
   - Connexion instantan├®e avec compte Google
   - Pas de mot de passe ├á cr├®er ou retenir
   - Cr├®ation automatique du profil utilisateur

## ­ƒôü Fichiers modifi├®s

### 1. Configuration Firebase

**`js/firebase-config.js`**
```javascript
// Ajout de GoogleAuthProvider et signInWithPopup
import { GoogleAuthProvider, signInWithPopup } from "firebase-auth.js";

const googleProvider = new GoogleAuthProvider();

export { googleProvider, signInWithPopup, ... };
```

### 2. Int├®gration Firebase

**`js/firebase-integration.js`**
```javascript
// Nouvelle fonction pour connexion Google
async function loginWithGoogle() {
    const result = await signInWithPopup(auth, googleProvider);
    const user = result.user;
    
    // V├®rifie si l'utilisateur existe d├®j├á
    if (userDoc.exists()) {
        return { success: true, user: userData };
    } else {
        // Cr├®e un nouveau compte automatiquement
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
// Fonction appel├®e par les boutons Google
window.handleGoogleLogin = async function() {
    const fbResult = await window.fbWrapper.loginWithGoogle();
    
    if (fbResult.success) {
        // Authentification r├®ussie
        currentUser = fbResult.user;
        // Fusion du panier local + cloud
        // Message de bienvenue
        if (fbResult.isNewUser) {
            showToast('Bienvenue! ­ƒÄë Compte cr├®├® avec Google');
        } else {
            showToast('Bienvenue! ­ƒöÑ');
        }
    }
};
```

### 5. Interface utilisateur

**6 pages HTML mises ├á jour** avec boutons Google:
- Ô£à `pages/index.html`
- Ô£à `pages/cars.html`
- Ô£à `pages/scripts.html`
- Ô£à `pages/clothes.html`
- Ô£à `pages/templates.html`
- Ô£à `pages/about.html`

**Bouton ajout├® dans les deux onglets** (Connexion ET Inscription):

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
        <!-- Logo Google color├® (bleu, vert, jaune, rouge) -->
        <path fill="#4285F4" d="..."/>
        <path fill="#34A853" d="..."/>
        <path fill="#FBBC05" d="..."/>
        <path fill="#EA4335" d="..."/>
    </svg>
    Se connecter avec Google
</button>
```

## ­ƒÄ¿ Apparence

Le bouton Google suit les guidelines officielles :
- Ô£à Fond blanc avec hover gris clair
- Ô£à Logo Google color├® officiel (4 couleurs)
- Ô£à Texte noir pour contraste maximum
- Ô£à S├®parateur "ou" entre les m├®thodes
- Ô£à M├¬me taille et style que les autres boutons

## ­ƒöº Configuration requise

### Dans Firebase Console

1. **Activer Google Sign-In**
   ```
   Firebase Console ÔåÆ Authentication ÔåÆ Sign-in method ÔåÆ Google
   Ôö£ÔöÇ Activer le bouton
   Ôö£ÔöÇ Email d'assistance: bonobo.des.alpes@gmail.com
   ÔööÔöÇ Enregistrer
   ```

2. **V├®rifier Email/Password activ├®**
   ```
   Firebase Console ÔåÆ Authentication ÔåÆ Sign-in method ÔåÆ Email/Password
   ÔööÔöÇ Doit ├¬tre activ├®
   ```

3. **R├¿gles Firestore** (d├®j├á configur├®es)
   - Permettent cr├®ation de compte Google
   - UID Firebase utilis├® comme identifiant unique
   - Email du compte Google enregistr├®

## ­ƒº¬ Test de la connexion Google

### Test 1: Premi├¿re connexion Google

1. Ouvrez `pages/index.html` dans le navigateur
2. Cliquez sur **Se connecter** ou **S'inscrire** 
3. Cliquez sur le bouton **Se connecter avec Google**
4. S├®lectionnez un compte Google dans la popup
5. Ô£à V├®rifiez:
   - Toast: "Bienvenue {nom}! ­ƒÄë Compte cr├®├® avec Google"
   - Utilisateur connect├® dans la navbar
   - Firebase Console ÔåÆ Authentication ÔåÆ Nouveau utilisateur visible
   - Firestore ÔåÆ Collection `users` ÔåÆ Nouveau document avec :
     ```json
     {
       "userId": "AbCdEfG123...",
       "email": "user@gmail.com",
       "username": "Pr├®nom",
       "authProvider": "google",
       "cart": [],
       "purchaseHistory": [],
       "createdAt": "2026-03-03T..."
     }
     ```

### Test 2: Reconnexion Google

1. D├®connectez-vous
2. Cliquez sur **Se connecter**
3. Cliquez sur **Se connecter avec Google**
4. S├®lectionnez le m├¬me compte
5. Ô£à V├®rifiez:
   - Toast: "Bienvenue {nom}! ­ƒöÑ"
   - Panier restaur├®
   - Historique d'achats visible

### Test 3: Panier synchronis├®

1. Connect├® avec Google
2. Ajoutez des produits au panier
3. D├®connexion
4. Reconnexion avec Google
5. Ô£à V├®rifiez:
   - Les produits sont toujours dans le panier
   - Firestore ÔåÆ users/{userId}/cart contient les articles

### Test 4: Achat avec compte Google

1. Connect├® avec Google
2. Ajoutez un produit gratuit au panier
3. Cliquez sur **Commander**
5. Ô£à V├®rifiez:
   - Achat enregistr├® dans Firestore
   - purchases/{purchaseId} cr├®├®
   - users/{userId}/purchaseHistory mis ├á jour

## ­ƒöì V├®rification dans le code

### Dans la console navigateur (F12)

```javascript
// V├®rifier que Firebase est disponible
window.fbWrapper.isAvailable()
// ÔåÆ true

// V├®rifier que loginWithGoogle existe
typeof window.handleGoogleLogin
// ÔåÆ "function"

// V├®rifier l'utilisateur actuel apr├¿s connexion Google
window.currentUser
// ÔåÆ { userId, email, username, authProvider: "google", ... }
```

### Console lors de la connexion

```
­ƒöÑ Firebase enhancements loading...
Ô£à Firebase enhancements loaded
Ô£à Firebase loaded successfully
Firebase user authenticated: user@gmail.com
```

## ÔÜá´©Å Domaines autoris├®s

### Pour la production

Si vous h├®bergez sur un domaine personnalis├®, ajoutez-le dans Firebase :

1. Firebase Console ÔåÆ Authentication ÔåÆ Settings
2. **Domaines autoris├®s**
3. Ajoutez votre domaine: `boutique.votresite.com`
4. Enregistrez

Par d├®faut, ces domaines fonctionnent :
- Ô£à localhost
- Ô£à 127.0.0.1
- Ô£à *.firebaseapp.com
- Ô£à Votre domaine Netlify

## ­ƒÜ¿ D├®pannage

### "Popup has been closed by the user"

**Cause**: L'utilisateur a ferm├® la popup Google avant de s├®lectionner un compte

**Solution**: Normal, rien ├á faire. L'utilisateur peut r├®essayer.

### "Unauthorized domain"

**Cause**: Votre domaine n'est pas autoris├® dans Firebase

**Solution**:
1. Firebase Console ÔåÆ Authentication ÔåÆ Settings ÔåÆ Domaines autoris├®s
2. Ajoutez votre domaine
3. R├®essayez

### "Firebase not available"

**Cause**: Scripts Firebase n'ont pas charg├® correctement

**Solution**:
1. V├®rifiez la console (F12) pour les erreurs
2. V├®rifiez votre connexion Internet
3. V├®rifiez que firebase-config.js, firebase-wrapper.js, app-firebase-patch.js sont bien charg├®s
4. Hard refresh: Ctrl+Shift+R

### Utilisateur cr├®├® mais donn├®es manquantes

**Cause**: Erreur lors de la cr├®ation du document Firestore

**Solution**:
1. V├®rifiez les r├¿gles Firestore
2. V├®rifiez dans la console les erreurs
3. L'utilisateur peut se reconnecter, son document sera recr├®├® automatiquement

## ­ƒôè Donn├®es stock├®es

### Utilisateur Google vs Email/Password

| Champ | Email/Password | Google Sign-In |
|-------|----------------|----------------|
| `userId` | UID Firebase | UID Firebase |
| `email` | Email saisi | Email Google |
| `username` | Saisi par l'utilisateur | `displayName` Google ou email |
| `authProvider` | Non pr├®sent | `"google"` |
| `cart` | [] | [] |
| `purchaseHistory` | [] | [] |
| `createdAt` | timestamp | timestamp |

**Note**: Les champs `cart` et `purchaseHistory` fonctionnent de mani├¿re identique pour les deux m├®thodes.

## Ô£à Avantages

### Pour l'utilisateur

- Ô£à **Connexion rapide** - Un clic au lieu de taper email/mot de passe
- Ô£à **Pas de mot de passe** - Utilise le compte Google existant
- Ô£à **S├®curis├®** - OAuth2 de Google
- Ô£à **Multi-appareils** - M├¬me compte partout

### Pour vous

- Ô£à **Moins d'abandons** - Connexion facilit├®e = plus de conversions
- Ô£à **Email v├®rifi├®** - Les comptes Google ont un email v├®rifi├®
- Ô£à **Moins de support** - Moins de "mot de passe oubli├®"
- Ô£à **Donn├®es fiables** - Nom et email corrects

## ­ƒôê Statistiques

Dans le dashboard admin, vous pouvez voir :

- Nombre total d'utilisateurs
- M├®thode d'authentification (email ou google)
- Taux de conversion par m├®thode

## ­ƒÄ» Prochaines ├®tapes recommand├®es

1. Ô£à **Activer Google Sign-In dans Firebase** (obligatoire)
2. Ô£à **Tester avec un compte Google test**
3. ÔÜ¬ Ajouter d'autres providers (Facebook, Apple, etc.)
4. ÔÜ¬ Impl├®menter "Mot de passe oubli├®" pour Email/Password
5. ÔÜ¬ Ajouter photo de profil depuis Google

---

Ô£à **L'authentification Google est pr├¬te ├á l'emploi!**

Il suffit d'activer Google Sign-In dans Firebase Console et les utilisateurs pourront se connecter avec leur compte Google imm├®diatement.
