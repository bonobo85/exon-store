# 🔥 Configuration Firebase pour Bonobo Shop V2

## Vue d'ensemble

Votre application utilise maintenant Firebase Firestore comme base de données cloud. Les données sont synchronisées automatiquement et disponibles partout.

## Architecture de la base de données

### Collections Firestore

Votre application utilise deux collections principales:

1. **`users`** - Stocke les utilisateurs et leurs données
   ```
   users/{userId}
   ├── userId: string (UID Firebase Auth)
   ├── email: string
   ├── username: string
   ├── createdAt: timestamp
   ├── cart: array of objects
   └── purchaseHistory: array of objects
   ```

2. **`purchases`** - Stocke tous les achats (pour l'admin)
   ```
   purchases/{purchaseId}
   ├── userId: string
   ├── userEmail: string
   ├── items: array
   ├── total: number
   ├── date: timestamp
   ├── promoCode: string | null
   ├── paymentMethod: string
   ```

## Configuration des règles de sécurité Firestore

Pour configurer les règles de sécurité :

1. Allez sur [Firebase Console](https://console.firebase.google.com/)
2. Sélectionnez votre projet **bonobo-store-v2**
3. Dans le menu de gauche, cliquez sur **Firestore Database**
4. Allez dans l'onglet **Règles**
5. Remplacez le contenu par les règles suivantes :

```javascript
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    
    // Fonction helper pour vérifier si l'utilisateur est admin
    function isAdmin() {
      return request.auth != null && request.auth.token.email == 'bonobo.des.alpes@gmail.com';
    }
    
    // Règles pour la collection 'users'
    match /users/{userId} {
      // Lecture: l'utilisateur peut lire ses propres données, l'admin peut tout lire
      allow read: if request.auth != null && 
                    (request.auth.uid == userId || isAdmin());
      
      // Création: seulement lors de l'inscription (auth uid doit correspondre)
      allow create: if request.auth != null && 
                      request.auth.uid == userId &&
                      request.resource.data.userId == userId &&
                      request.resource.data.email == request.auth.token.email;
      
      // Mise à jour: l'utilisateur peut modifier ses propres données
      allow update: if request.auth != null && 
                      request.auth.uid == userId &&
                      request.resource.data.userId == userId;
      
      // Suppression: interdit (ou seulement admin)
      allow delete: if isAdmin();
    }
    
    // Règles pour la collection 'purchases'
    match /purchases/{purchaseId} {
      // Lecture: seulement l'admin peut lire les achats
      allow read: if isAdmin();
      
      // Création: un utilisateur authentifié peut créer un achat
      allow create: if request.auth != null &&
                      request.resource.data.userId == request.auth.uid;
      
      // Mise à jour et suppression: seulement l'admin
      allow update, delete: if isAdmin();
    }
  }
}
```

6. Cliquez sur **Publier**

## Configuration de l'authentification Google

L'application prend en charge deux méthodes d'authentification:
- **Email/Password** - Inscription classique avec email et mot de passe
- **Google Sign-In** - Connexion rapide avec un compte Google

### Activer l'authentification Google

1. Allez sur [Firebase Console](https://console.firebase.google.com/)
2. Sélectionnez votre projet **bonobo-store-v2**
3. Dans le menu de gauche, cliquez sur **Authentication**
4. Allez dans l'onglet **Sign-in method**
5. Activez **Google** :
   - Cliquez sur **Google** dans la liste des fournisseurs
   - Activez le bouton
   - Saisissez un **Email d'assistance du projet** (ex: bonobo.des.alpes@gmail.com)
   - Cliquez sur **Enregistrer**
6. Activez également **Email/Password** si ce n'est pas déjà fait

### Fonctionnement de la connexion Google

Lorsqu'un utilisateur clique sur "Se connecter avec Google" :

1. **Popup Google** s'ouvre pour sélectionner un compte
2. **Première connexion** :
   - Firebase crée un utilisateur dans Authentication
   - Un document Firestore est créé dans `users/{userId}` avec :
     - `userId`: UID Firebase
     - `email`: Email du compte Google
     - `username`: Prénom du compte Google (ou partie avant @)
     - `authProvider`: "google"
     - `cart`: []
     - `purchaseHistory`: []
   - Message: "Bienvenue {username}! 🎉 Compte créé avec Google"

3. **Connexion suivante** :
   - Firebase authentifie l'utilisateur
   - Les données sont récupérées depuis Firestore
   - Le panier est fusionné (local + cloud)
   - Message: "Bienvenue {username}! 🔥"

### Avantages de la connexion Google

- ✅ **Pas de mot de passe à retenir** - Utilise le compte Google existant
- ✅ **Connexion instantanée** - Sélection du compte en un clic
- ✅ **Sécurisé** - Authentification OAuth2 de Google
- ✅ **Données synchronisées** - Même compte sur tous les appareils

## Logique de fonctionnement

### Priorité de stockage

L'application utilise Firebase en **priorité**, avec des fallbacks:

1. **Firebase Firestore** (cloud, synchronisé)
2. API backend (si implémenté)
3. localStorage (fallback local)

### Flux d'authentification

```
Inscription/Connexion
    ↓
Firebase Authentication (email/password)
    ↓
Création/Récupération document Firestore users/{userId}
    ↓
Synchronisation cart et purchaseHistory
    ↓
Interface mise à jour
```

### Synchronisation du panier

- **Ajout article**: Sync immédiate vers Firestore
- **Suppression article**: Sync immédiate vers Firestore
- **Connexion**: Fusion cart local + cart cloud
- **Déconnexion**: Cart reste en localStorage

### Enregistrement des achats


1. Enregistrement dans `users/{userId}/purchaseHistory`
2. Création d'un document dans `purchases/{purchaseId}`
3. Vidage du panier dans Firestore
4. Mise à jour localStorage (fallback)

## Vérification que Firebase fonctionne

### Dans la console du navigateur

Ouvrez DevTools (F12) et vérifiez :

```javascript
// Firebase est-il disponible ?
window.fbWrapper.isAvailable()
// Devrait retourner: true

// État de connexion
window.fbWrapper.getCurrentUser()
// Retourne l'utilisateur connecté ou null
```

### Indicateurs visuels

- 🔥 `Firebase enhancements loading...` dans la console
- ✅ `Firebase enhancements loaded` après chargement
- ✅ `Purchase saved to Firebase` après un achat

### Vérifier dans Firebase Console

1. Allez sur [Firebase Console](https://console.firebase.google.com/)
2. Projet **bonobo-store-v2**
3. **Authentication** → Onglet **Users** → Vous devriez voir les utilisateurs
4. **Firestore Database** → Collections → Vérifiez `users` et `purchases`

## Structure des données dans Firestore

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
      "name": "Véhicule Police",
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
      "name": "Véhicule Police",
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

### Accès admin

L'email **bonobo.des.alpes@gmail.com** a les droits admin:

- Lecture de tous les utilisateurs
- Lecture de tous les achats
- Accès au dashboard complet

## Migration des données existantes

Si vous avez déjà des données en localStorage:

### Utilisateurs

Les utilisateurs doivent se **réinscrire** via Firebase Authentication. Les anciens comptes localStorage ne sont pas migrés automatiquement.

### Paniers

Le panier localStorage sera **fusionné** avec le panier Firebase lors de la première connexion.

## Dépannage

### Firebase ne se charge pas

- Vérifiez la console (F12) pour les erreurs
- Vérifiez que la configuration dans `firebase-config.js` est correcte
- Vérifiez dans Network tab que les scripts Firebase se chargent

### Erreurs d'authentification

- **Email déjà utilisé**: L'utilisateur existe déjà
- **Mot de passe incorrect**: Vérifiez le mot de passe
- **Permission denied**: Vérifiez les règles Firestore

### Données non synchronisées

- Vérifiez que `window.fbWrapper.isAvailable()` retourne `true`
- Vérifiez les règles de sécurité Firestore
- Vérifiez que l'utilisateur est bien connecté

### Achats non enregistrés

- Vérifiez la console pour les erreurs
- Vérifiez dans Firestore → purchases

## Sécurité

### ⚠️ Important

- **Clé API publique**: L'apiKey dans firebase-config.js peut être publique, elle est sécurisée par les règles Firestore
- **Règles Firestore**: Configurez correctement les règles pour protéger les données
- **Email admin**: Changez l'email admin dans les règles si nécessaire

### Bonnes pratiques

1. ✅ Utilisez Firebase Auth pour l'authentification
2. ✅ Validez côté serveur avec les règles Firestore
3. ✅ Ne stockez jamais de secrets côté client
4. ✅ Utilisez HTTPS en production

## Performance

### Optimisations

- **Mise en cache**: Firestore met en cache les données localement
- **Connexion hors-ligne**: Les modifications sont synchronisées à la reconnexion
- **Requêtes minimales**: Une seule lecture du document utilisateur par session

### Quotas gratuits Firebase

Plan gratuit (Spark):
- **Authentication**: 10 000 vérifications/mois
- **Firestore**: 50 000 lectures/jour, 20 000 écritures/jour
- **Stockage**: 1 GB

Pour un site e-commerce de taille moyenne, c'est largement suffisant!

## Support

Pour plus d'informations:
- [Documentation Firebase](https://firebase.google.com/docs)
- [Règles de sécurité Firestore](https://firebase.google.com/docs/firestore/security/get-started)
- [Firebase Authentication](https://firebase.google.com/docs/auth)

---

✅ **Firebase est maintenant configuré et fonctionnel!**

Prochaines étapes:
1. Configurez les règles de sécurité Firestore (voir ci-dessus)
2. Testez l'inscription et la connexion
3. Vérifiez la synchronisation du panier
5. Vérifiez le dashboard admin
