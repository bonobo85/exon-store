# 🔥 Guide de vérification Firebase - Bonobo Store V2

## État actuel de la configuration

### ✅ Ce qui est en place

1. **Configuration Firebase** (`firebase-config.js`)
   - Project ID: `bonobo-store-v2`
   - Auth Domain: `bonobo-store-v2.firebaseapp.com`
   - Configuration complète et valide

2. **Modules Firebase chargés**
   - ✅ `firebase-config.js` - Configuration et imports
   - ✅ `firebase-wrapper.js` - Wrapper exposant `window.fbWrapper`
   - ✅ `firebase-integration.js` - Fonctions de base de données
   - ✅ `app-firebase-patch.js` - Surcharge des fonctions d'authentification

3. **Fonctionnalités implémentées**
   - Inscription avec email/mot de passe
   - Connexion avec email/mot de passe
   - Connexion Google OAuth
   - Gestion du panier synchronisé
   - Historique des achats
   - Déconnexion

## 🧪 Comment tester

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
- ✅ Vérifier que Firebase est initialisé
- 📝 Tester l'inscription d'un nouvel utilisateur
- 🔑 Tester la connexion
- 🌐 Tester la connexion Google
- 📊 Voir tous les logs en temps réel

### 2. Console du navigateur
Ouvrez la console développeur (F12) et vérifiez :
- `✅ Firebase loaded successfully` - Firebase wrapper chargé
- `✅ Firebase enhancements loaded` - Patch d'authentification actif
- Pas d'erreurs de type CORS ou permissions

### 3. Test sur la page principale
1. Allez sur `pages/cars.html`
2. Cliquez sur "Connexion"
3. Essayez de créer un compte
4. Essayez de vous connecter

## ⚠️ Points à vérifier dans Firebase Console

### 1. Authentication activée
Allez sur [Firebase Console](https://console.firebase.google.com/project/bonobo-store-v2/authentication)

**Méthodes de connexion à activer :**
- ✅ Email/Password
- ✅ Google

**Comment activer :**
1. Allez dans Authentication > Sign-in method
2. Activez "Email/Password"
3. Activez "Google" et configurez l'OAuth avec votre email de support

### 2. Règles Firestore
Allez sur [Firestore Rules](https://console.firebase.google.com/project/bonobo-store-v2/firestore/rules)

**Règles recommandées pour le développement :**
```javascript
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    // Règles pour les utilisateurs
    match /users/{userId} {
      // Lecture : l'utilisateur peut lire ses propres données
      allow read: if request.auth != null && request.auth.uid == userId;
      
      // Écriture : l'utilisateur peut créer/modifier ses propres données
      allow create: if request.auth != null && request.auth.uid == userId;
      allow update: if request.auth != null && request.auth.uid == userId;
      
      // Admin peut tout voir
      allow read, write: if request.auth != null && 
        exists(/databases/$(database)/documents/users/$(request.auth.uid)) &&
        get(/databases/$(database)/documents/users/$(request.auth.uid)).data.role == 'admin';
    }
    
    // Règles pour les achats
    match /purchases/{purchaseId} {
      // Les utilisateurs peuvent lire leurs propres achats
      allow read: if request.auth != null && resource.data.userId == request.auth.uid;
      
      // Les utilisateurs peuvent créer leurs propres achats
      allow create: if request.auth != null && request.resource.data.userId == request.auth.uid;
      
      // Admin peut tout voir
      allow read, write: if request.auth != null && 
        exists(/databases/$(database)/documents/users/$(request.auth.uid)) &&
        get(/databases/$(database)/documents/users/$(request.auth.uid)).data.role == 'admin';
    }
  }
}
```

**⚠️ Règles de test (NE PAS UTILISER EN PRODUCTION) :**
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

### 3. Domaines autorisés
Allez dans Authentication > Settings > Authorized domains

**Domaines à ajouter :**
- `localhost`
- Votre domaine de production si déployé

### 4. Configuration Google OAuth
Si vous utilisez Google Sign-In :
1. Allez dans Authentication > Sign-in method > Google
2. Configurez l'email de support
3. Téléchargez la configuration OAuth si nécessaire

## 🐛 Résolution des problèmes courants

### Erreur : "Firebase not available"
**Cause :** Firebase ne s'initialise pas correctement
**Solution :**
1. Vérifiez la console (F12) pour les erreurs
2. Assurez-vous que les scripts sont dans le bon ordre
3. Vérifiez que `firebase-config.js` est bien chargé en premier

### Erreur : "auth/unauthorized-domain"
**Cause :** Le domaine n'est pas autorisé dans Firebase
**Solution :**
1. Allez dans Firebase Console > Authentication > Settings
2. Ajoutez votre domaine dans "Authorized domains"

### Erreur : "Permission denied"
**Cause :** Les règles Firestore bloquent l'accès
**Solution :**
1. Vérifiez les règles Firestore
2. Utilisez temporairement les règles de test
3. Vérifiez que l'utilisateur est authentifié

### Erreur : "Network request failed"
**Cause :** Problème de connexion ou CORS
**Solution :**
1. Vérifiez votre connexion Internet
2. Désactivez les bloqueurs de pub
3. Vérifiez les paramètres CORS de Firebase

### La connexion fonctionne mais les données ne se sauvent pas
**Cause :** Règles Firestore trop restrictives
**Solution :**
1. Vérifiez les règles de sécurité
2. Assurez-vous que l'utilisateur a les permissions d'écriture
3. Vérifiez la console pour les erreurs spécifiques

## 📝 Structure de données Firestore

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

## ✅ Checklist de vérification

- [ ] Firebase Console accessible
- [ ] Authentication Email/Password activée
- [ ] Google Sign-In configuré (si utilisé)
- [ ] Règles Firestore configurées
- [ ] Domaines autorisés ajoutés
- [ ] `test-firebase.html` fonctionne sans erreur
- [ ] Inscription fonctionne
- [ ] Connexion fonctionne
- [ ] Google Sign-In fonctionne (si activé)
- [ ] Données sauvegardées dans Firestore
- [ ] Panier synchronisé
- [ ] Déconnexion fonctionne

## 🚀 Prochaines étapes

Une fois que tout fonctionne :
1. Testez toutes les fonctionnalités dans `cars.html`
2. Vérifiez la synchronisation du panier
3. Testez un achat complet
4. Configurez les règles de sécurité pour la production
5. Déployez sur votre environnement de production

## 📞 Support

Si vous rencontrez des problèmes :
1. Vérifiez la console du navigateur (F12)
2. Consultez ce guide
3. Testez avec `test-firebase.html`
4. Vérifiez les règles Firebase Console
5. Consultez la [documentation Firebase](https://firebase.google.com/docs)
