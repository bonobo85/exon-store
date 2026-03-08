# ­ƒöÑ Guide de v├®rification Firebase - Bonobo Store V2

## ├ëtat actuel de la configuration

### Ô£à Ce qui est en place

1. **Configuration Firebase** (`firebase-config.js`)
   - Project ID: `bonobo-store-v2`
   - Auth Domain: `bonobo-store-v2.firebaseapp.com`
   - Configuration compl├¿te et valide

2. **Modules Firebase charg├®s**
   - Ô£à `firebase-config.js` - Configuration et imports
   - Ô£à `firebase-wrapper.js` - Wrapper exposant `window.fbWrapper`
   - Ô£à `firebase-integration.js` - Fonctions de base de donn├®es
   - Ô£à `app-firebase-patch.js` - Surcharge des fonctions d'authentification

3. **Fonctionnalit├®s impl├®ment├®es**
   - Inscription avec email/mot de passe
   - Connexion avec email/mot de passe
   - Connexion Google OAuth
   - Gestion du panier synchronis├®
   - Historique des achats
   - D├®connexion

## ­ƒº¬ Comment tester

### 1. Page de test Firebase
Ouvrez le fichier `test-firebase.html` dans votre navigateur :
```
http://localhost:5500/test-firebase.html
```
ou
```
file:///d:/site/bonobo-shopv2/test-firebase.html
```

Cette page vous permet de :
- Ô£à V├®rifier que Firebase est initialis├®
- ­ƒôØ Tester l'inscription d'un nouvel utilisateur
- ­ƒöæ Tester la connexion
- ­ƒîÉ Tester la connexion Google
- ­ƒôè Voir tous les logs en temps r├®el

### 2. Console du navigateur
Ouvrez la console d├®veloppeur (F12) et v├®rifiez :
- `Ô£à Firebase loaded successfully` - Firebase wrapper charg├®
- `Ô£à Firebase enhancements loaded` - Patch d'authentification actif
- Pas d'erreurs de type CORS ou permissions

### 3. Test sur la page principale
1. Allez sur `pages/cars.html`
2. Cliquez sur "Connexion"
3. Essayez de cr├®er un compte
4. Essayez de vous connecter

## ÔÜá´©Å Points ├á v├®rifier dans Firebase Console

### 1. Authentication activ├®e
Allez sur [Firebase Console](https://console.firebase.google.com/project/bonobo-store-v2/authentication)

**M├®thodes de connexion ├á activer :**
- Ô£à Email/Password
- Ô£à Google

**Comment activer :**
1. Allez dans Authentication > Sign-in method
2. Activez "Email/Password"
3. Activez "Google" et configurez l'OAuth avec votre email de support

### 2. R├¿gles Firestore
Allez sur [Firestore Rules](https://console.firebase.google.com/project/bonobo-store-v2/firestore/rules)

**R├¿gles recommand├®es pour le d├®veloppement :**
```javascript
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    // R├¿gles pour les utilisateurs
    match /users/{userId} {
      // Lecture : l'utilisateur peut lire ses propres donn├®es
      allow read: if request.auth != null && request.auth.uid == userId;
      
      // ├ëcriture : l'utilisateur peut cr├®er/modifier ses propres donn├®es
      allow create: if request.auth != null && request.auth.uid == userId;
      allow update: if request.auth != null && request.auth.uid == userId;
      
      // Admin peut tout voir
      allow read, write: if request.auth != null && 
        exists(/databases/$(database)/documents/users/$(request.auth.uid)) &&
        get(/databases/$(database)/documents/users/$(request.auth.uid)).data.role == 'admin';
    }
    
    // R├¿gles pour les achats
    match /purchases/{purchaseId} {
      // Les utilisateurs peuvent lire leurs propres achats
      allow read: if request.auth != null && resource.data.userId == request.auth.uid;
      
      // Les utilisateurs peuvent cr├®er leurs propres achats
      allow create: if request.auth != null && request.resource.data.userId == request.auth.uid;
      
      // Admin peut tout voir
      allow read, write: if request.auth != null && 
        exists(/databases/$(database)/documents/users/$(request.auth.uid)) &&
        get(/databases/$(database)/documents/users/$(request.auth.uid)).data.role == 'admin';
    }
  }
}
```

**ÔÜá´©Å R├¿gles de test (NE PAS UTILISER EN PRODUCTION) :**
```javascript
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    match /{document=**} {
      allow read, write: if request.auth != null;
    }
  }
}
```

### 3. Domaines autoris├®s
Allez dans Authentication > Settings > Authorized domains

**Domaines ├á ajouter :**
- `localhost`
- Votre domaine de production si d├®ploy├®

### 4. Configuration Google OAuth
Si vous utilisez Google Sign-In :
1. Allez dans Authentication > Sign-in method > Google
2. Configurez l'email de support
3. T├®l├®chargez la configuration OAuth si n├®cessaire

## ­ƒÉø R├®solution des probl├¿mes courants

### Erreur : "Firebase not available"
**Cause :** Firebase ne s'initialise pas correctement
**Solution :**
1. V├®rifiez la console (F12) pour les erreurs
2. Assurez-vous que les scripts sont dans le bon ordre
3. V├®rifiez que `firebase-config.js` est bien charg├® en premier

### Erreur : "auth/unauthorized-domain"
**Cause :** Le domaine n'est pas autoris├® dans Firebase
**Solution :**
1. Allez dans Firebase Console > Authentication > Settings
2. Ajoutez votre domaine dans "Authorized domains"

### Erreur : "Permission denied"
**Cause :** Les r├¿gles Firestore bloquent l'acc├¿s
**Solution :**
1. V├®rifiez les r├¿gles Firestore
2. Utilisez temporairement les r├¿gles de test
3. V├®rifiez que l'utilisateur est authentifi├®

### Erreur : "Network request failed"
**Cause :** Probl├¿me de connexion ou CORS
**Solution :**
1. V├®rifiez votre connexion Internet
2. D├®sactivez les bloqueurs de pub
3. V├®rifiez les param├¿tres CORS de Firebase

### La connexion fonctionne mais les donn├®es ne se sauvent pas
**Cause :** R├¿gles Firestore trop restrictives
**Solution :**
1. V├®rifiez les r├¿gles de s├®curit├®
2. Assurez-vous que l'utilisateur a les permissions d'├®criture
3. V├®rifiez la console pour les erreurs sp├®cifiques

## ­ƒôØ Structure de donn├®es Firestore

### Collection `users`
```javascript
{
  userId: "firebase_uid",           // String - UID Firebase
  email: "user@example.com",        // String
  username: "username",             // String
  createdAt: "2026-03-04T...",     // ISO String
  cart: [],                         // Array - Articles du panier
  purchaseHistory: [],              // Array - Historique des achats
  sessionToken: "firebase_uid",     // String
  authProvider: "email" | "google"  // String (optionnel)
}
```

### Collection `purchases`
```javascript
{
  userId: "firebase_uid",           // String
  items: "[{...}]",                 // JSON String
  total: "29.99",                   // String
  date: "2026-03-04T...",          // ISO String
  timestamp: "2026-03-04T...",     // ISO String
  promoCode: "PROMO2024",          // String | null
}
```

## Ô£à Checklist de v├®rification

- [ ] Firebase Console accessible
- [ ] Authentication Email/Password activ├®e
- [ ] Google Sign-In configur├® (si utilis├®)
- [ ] R├¿gles Firestore configur├®es
- [ ] Domaines autoris├®s ajout├®s
- [ ] `test-firebase.html` fonctionne sans erreur
- [ ] Inscription fonctionne
- [ ] Connexion fonctionne
- [ ] Google Sign-In fonctionne (si activ├®)
- [ ] Donn├®es sauvegard├®es dans Firestore
- [ ] Panier synchronis├®
- [ ] D├®connexion fonctionne

## ­ƒÜÇ Prochaines ├®tapes

Une fois que tout fonctionne :
1. Testez toutes les fonctionnalit├®s dans `cars.html`
2. V├®rifiez la synchronisation du panier
3. Testez un achat complet
4. Configurez les r├¿gles de s├®curit├® pour la production
5. D├®ployez sur votre environnement de production

## ­ƒô× Support

Si vous rencontrez des probl├¿mes :
1. V├®rifiez la console du navigateur (F12)
2. Consultez ce guide
3. Testez avec `test-firebase.html`
4. V├®rifiez les r├¿gles Firebase Console
5. Consultez la [documentation Firebase](https://firebase.google.com/docs)
