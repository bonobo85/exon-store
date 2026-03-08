# ­ƒöÑ Configuration Firebase pour Bonobo Shop V2

## Vue d'ensemble

Votre application utilise maintenant Firebase Firestore comme base de donn├®es cloud. Les donn├®es sont synchronis├®es automatiquement et disponibles partout.

## Architecture de la base de donn├®es

### Collections Firestore

Votre application utilise deux collections principales:

1. **`users`** - Stocke les utilisateurs et leurs donn├®es
   ```
   users/{userId}
   Ôö£ÔöÇÔöÇ userId: string (UID Firebase Auth)
   Ôö£ÔöÇÔöÇ email: string
   Ôö£ÔöÇÔöÇ username: string
   Ôö£ÔöÇÔöÇ createdAt: timestamp
   Ôö£ÔöÇÔöÇ cart: array of objects
   ÔööÔöÇÔöÇ purchaseHistory: array of objects
   ```

2. **`purchases`** - Stocke tous les achats (pour l'admin)
   ```
   purchases/{purchaseId}
   Ôö£ÔöÇÔöÇ userId: string
   Ôö£ÔöÇÔöÇ userEmail: string
   Ôö£ÔöÇÔöÇ items: array
   Ôö£ÔöÇÔöÇ total: number
   Ôö£ÔöÇÔöÇ date: timestamp
   Ôö£ÔöÇÔöÇ promoCode: string | null
   Ôö£ÔöÇÔöÇ paymentMethod: string
   ```

## Configuration des r├¿gles de s├®curit├® Firestore

Pour configurer les r├¿gles de s├®curit├® :

1. Allez sur [Firebase Console](https://console.firebase.google.com/)
2. S├®lectionnez votre projet **bonobo-store-v2**
3. Dans le menu de gauche, cliquez sur **Firestore Database**
4. Allez dans l'onglet **R├¿gles**
5. Remplacez le contenu par les r├¿gles suivantes :

```javascript
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    
    // Fonction helper pour v├®rifier si l'utilisateur est admin
    function isAdmin() {
      return request.auth != null && request.auth.token.email == 'bonobo.des.alpes@gmail.com';
    }
    
    // R├¿gles pour la collection 'users'
    match /users/{userId} {
      // Lecture: l'utilisateur peut lire ses propres donn├®es, l'admin peut tout lire
      allow read: if request.auth != null && 
                    (request.auth.uid == userId || isAdmin());
      
      // Cr├®ation: seulement lors de l'inscription (auth uid doit correspondre)
      allow create: if request.auth != null && 
                      request.auth.uid == userId &&
                      request.resource.data.userId == userId &&
                      request.resource.data.email == request.auth.token.email;
      
      // Mise ├á jour: l'utilisateur peut modifier ses propres donn├®es
      allow update: if request.auth != null && 
                      request.auth.uid == userId &&
                      request.resource.data.userId == userId;
      
      // Suppression: interdit (ou seulement admin)
      allow delete: if isAdmin();
    }
    
    // R├¿gles pour la collection 'purchases'
    match /purchases/{purchaseId} {
      // Lecture: seulement l'admin peut lire les achats
      allow read: if isAdmin();
      
      // Cr├®ation: un utilisateur authentifi├® peut cr├®er un achat
      allow create: if request.auth != null &&
                      request.resource.data.userId == request.auth.uid;
      
      // Mise ├á jour et suppression: seulement l'admin
      allow update, delete: if isAdmin();
    }
  }
}
```

6. Cliquez sur **Publier**

## Configuration de l'authentification Google

L'application prend en charge deux m├®thodes d'authentification:
- **Email/Password** - Inscription classique avec email et mot de passe
- **Google Sign-In** - Connexion rapide avec un compte Google

### Activer l'authentification Google

1. Allez sur [Firebase Console](https://console.firebase.google.com/)
2. S├®lectionnez votre projet **bonobo-store-v2**
3. Dans le menu de gauche, cliquez sur **Authentication**
4. Allez dans l'onglet **Sign-in method**
5. Activez **Google** :
   - Cliquez sur **Google** dans la liste des fournisseurs
   - Activez le bouton
   - Saisissez un **Email d'assistance du projet** (ex: bonobo.des.alpes@gmail.com)
   - Cliquez sur **Enregistrer**
6. Activez ├®galement **Email/Password** si ce n'est pas d├®j├á fait

### Fonctionnement de la connexion Google

Lorsqu'un utilisateur clique sur "Se connecter avec Google" :

1. **Popup Google** s'ouvre pour s├®lectionner un compte
2. **Premi├¿re connexion** :
   - Firebase cr├®e un utilisateur dans Authentication
   - Un document Firestore est cr├®├® dans `users/{userId}` avec :
     - `userId`: UID Firebase
     - `email`: Email du compte Google
     - `username`: Pr├®nom du compte Google (ou partie avant @)
     - `authProvider`: "google"
     - `cart`: []
     - `purchaseHistory`: []
   - Message: "Bienvenue {username}! ­ƒÄë Compte cr├®├® avec Google"

3. **Connexion suivante** :
   - Firebase authentifie l'utilisateur
   - Les donn├®es sont r├®cup├®r├®es depuis Firestore
   - Le panier est fusionn├® (local + cloud)
   - Message: "Bienvenue {username}! ­ƒöÑ"

### Avantages de la connexion Google

- Ô£à **Pas de mot de passe ├á retenir** - Utilise le compte Google existant
- Ô£à **Connexion instantan├®e** - S├®lection du compte en un clic
- Ô£à **S├®curis├®** - Authentification OAuth2 de Google
- Ô£à **Donn├®es synchronis├®es** - M├¬me compte sur tous les appareils

## Logique de fonctionnement

### Priorit├® de stockage

L'application utilise Firebase en **priorit├®**, avec des fallbacks:

1. **Firebase Firestore** (cloud, synchronis├®)
2. API backend (si impl├®ment├®)
3. localStorage (fallback local)

### Flux d'authentification

```
Inscription/Connexion
    Ôåô
Firebase Authentication (email/password)
    Ôåô
Cr├®ation/R├®cup├®ration document Firestore users/{userId}
    Ôåô
Synchronisation cart et purchaseHistory
    Ôåô
Interface mise ├á jour
```

### Synchronisation du panier

- **Ajout article**: Sync imm├®diate vers Firestore
- **Suppression article**: Sync imm├®diate vers Firestore
- **Connexion**: Fusion cart local + cart cloud
- **D├®connexion**: Cart reste en localStorage

### Enregistrement des achats


1. Enregistrement dans `users/{userId}/purchaseHistory`
2. Cr├®ation d'un document dans `purchases/{purchaseId}`
3. Vidage du panier dans Firestore
4. Mise ├á jour localStorage (fallback)

## V├®rification que Firebase fonctionne

### Dans la console du navigateur

Ouvrez DevTools (F12) et v├®rifiez :

```javascript
// Firebase est-il disponible ?
window.fbWrapper.isAvailable()
// Devrait retourner: true

// ├ëtat de connexion
window.fbWrapper.getCurrentUser()
// Retourne l'utilisateur connect├® ou null
```

### Indicateurs visuels

- ­ƒöÑ `Firebase enhancements loading...` dans la console
- Ô£à `Firebase enhancements loaded` apr├¿s chargement
- Ô£à `Purchase saved to Firebase` apr├¿s un achat

### V├®rifier dans Firebase Console

1. Allez sur [Firebase Console](https://console.firebase.google.com/)
2. Projet **bonobo-store-v2**
3. **Authentication** ÔåÆ Onglet **Users** ÔåÆ Vous devriez voir les utilisateurs
4. **Firestore Database** ÔåÆ Collections ÔåÆ V├®rifiez `users` et `purchases`

## Structure des donn├®es dans Firestore

### Exemple document `users/{userId}`

```json
{
  "userId": "AbCdEfGhIjKlMnOpQrStUv",
  "email": "client@example.com",
  "username": "Jean",
  "createdAt": "2024-01-15T10:30:00.000Z",
  "cart": [
    {
      "id": "car-police-1",
      "name": "V├®hicule Police",
      "price": 15,
      "quantity": 1,
      "image": "assets/placeholder.jpg",
      "category": "cars"
    }
  ],
  "purchaseHistory": [
    {
      "id": "7AB123456789",
      "items": "[{...}]",
      "total": "15.00",
      "date": "2024-01-15T14:20:00.000Z",
      "promoCode": null,
      "payerEmail": "client@example.com"
    }
  ]
}
```

### Exemple document `purchases/{purchaseId}`

```json
{
  "userId": "AbCdEfGhIjKlMnOpQrStUv",
  "userEmail": "client@example.com",
  "items": [
    {
      "id": "car-police-1",
      "name": "V├®hicule Police",
      "price": 15,
      "quantity": 1,
      "category": "cars"
    }
  ],
  "total": 15.00,
  "date": "2024-01-15T14:20:00.000Z",
  "promoCode": null,
}
```

## Administration

### Dashboard Admin

Le dashboard admin (admin.html) affiche automatiquement:

- Statistiques depuis Firebase (si disponible)
- Tous les utilisateurs
- Tous les achats
- Graphiques et totaux

### Acc├¿s admin

L'email **bonobo.des.alpes@gmail.com** a les droits admin:

- Lecture de tous les utilisateurs
- Lecture de tous les achats
- Acc├¿s au dashboard complet

## Migration des donn├®es existantes

Si vous avez d├®j├á des donn├®es en localStorage:

### Utilisateurs

Les utilisateurs doivent se **r├®inscrire** via Firebase Authentication. Les anciens comptes localStorage ne sont pas migr├®s automatiquement.

### Paniers

Le panier localStorage sera **fusionn├®** avec le panier Firebase lors de la premi├¿re connexion.

## D├®pannage

### Firebase ne se charge pas

- V├®rifiez la console (F12) pour les erreurs
- V├®rifiez que la configuration dans `firebase-config.js` est correcte
- V├®rifiez dans Network tab que les scripts Firebase se chargent

### Erreurs d'authentification

- **Email d├®j├á utilis├®**: L'utilisateur existe d├®j├á
- **Mot de passe incorrect**: V├®rifiez le mot de passe
- **Permission denied**: V├®rifiez les r├¿gles Firestore

### Donn├®es non synchronis├®es

- V├®rifiez que `window.fbWrapper.isAvailable()` retourne `true`
- V├®rifiez les r├¿gles de s├®curit├® Firestore
- V├®rifiez que l'utilisateur est bien connect├®

### Achats non enregistr├®s

- V├®rifiez la console pour les erreurs
- V├®rifiez dans Firestore ÔåÆ purchases

## S├®curit├®

### ÔÜá´©Å Important

- **Cl├® API publique**: L'apiKey dans firebase-config.js peut ├¬tre publique, elle est s├®curis├®e par les r├¿gles Firestore
- **R├¿gles Firestore**: Configurez correctement les r├¿gles pour prot├®ger les donn├®es
- **Email admin**: Changez l'email admin dans les r├¿gles si n├®cessaire

### Bonnes pratiques

1. Ô£à Utilisez Firebase Auth pour l'authentification
2. Ô£à Validez c├┤t├® serveur avec les r├¿gles Firestore
3. Ô£à Ne stockez jamais de secrets c├┤t├® client
4. Ô£à Utilisez HTTPS en production

## Performance

### Optimisations

- **Mise en cache**: Firestore met en cache les donn├®es localement
- **Connexion hors-ligne**: Les modifications sont synchronis├®es ├á la reconnexion
- **Requ├¬tes minimales**: Une seule lecture du document utilisateur par session

### Quotas gratuits Firebase

Plan gratuit (Spark):
- **Authentication**: 10 000 v├®rifications/mois
- **Firestore**: 50 000 lectures/jour, 20 000 ├®critures/jour
- **Stockage**: 1 GB

Pour un site e-commerce de taille moyenne, c'est largement suffisant!

## Support

Pour plus d'informations:
- [Documentation Firebase](https://firebase.google.com/docs)
- [R├¿gles de s├®curit├® Firestore](https://firebase.google.com/docs/firestore/security/get-started)
- [Firebase Authentication](https://firebase.google.com/docs/auth)

---

Ô£à **Firebase est maintenant configur├® et fonctionnel!**

Prochaines ├®tapes:
1. Configurez les r├¿gles de s├®curit├® Firestore (voir ci-dessus)
2. Testez l'inscription et la connexion
3. V├®rifiez la synchronisation du panier
5. V├®rifiez le dashboard admin
