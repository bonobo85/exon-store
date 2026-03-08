# Configuration d'accès administrateur

## Objectif
Les utilisateurs avec les emails suivants doivent avoir un accès administrateur complet au panneau admin (`admin.html`), qu'ils se connectent via :
- **bonobo.des.alpes@gmail.com** (Administrateur principal)
- **willemjackson12@gmail.com** (Administrateur permanent)
- **exon.wizard@gmail.com** (Administrateur permanent)
- Email/Mot de passe (authentification locale)
- Google Sign-In (authentification par Google)

## Implémentation

### 1. Email Normalization (Normalisation d'email)
Tous les emails sont automatiquement **normalisés en minuscules et sans espaces** à chaque point critique :
- Lors de la connexion (email/password)
- Lors de la connexion avec Google
- Lors de la création de compte
- Lors de la restauration de session depuis le localStorage
- Lors de la restauration de session depuis le serveur

### 2. Fonctions Clés Modifiées

#### a) `isCurrentUserAdmin()`
Vérifie si l'utilisateur connecté est administrateur
- Compare l'email de `currentUser` avec la liste des admins
- **Utilise la comparaison en minuscules** pour éviter les problèmes de casse

#### b) `getAdminList()`
Retourne la liste des administrateurs
- **Toujours inclut** les administrateurs permanents définis dans `PERMANENT_ADMINS`
  - bonobo.des.alpes@gmail.com
  - willemjackson12@gmail.com
  - exon.wizard@gmail.com
- Filtre les doublons avec comparaison en minuscules
- Les admins permanents ne peuvent pas être supprimés de la liste

#### c) `isUserAdmin(email)`
Vérifie si un utilisateur spécifique est administrateur
- Comparaison d'email normalisée (minuscules)

#### d) `promoteToAdmin()` et `removeAdmin()`
Gèrent la promotion/dégradation des administrateurs
- Normalisation des emails
- Protection des administrateurs permanents (ne peuvent pas être retirés)

#### e) `enforceAdminPageAccess()`
Contrôle l'accès à la page admin
- Affiche/cache le shell admin (`admin-page-shell`)
- Redirige vers la page d'accueil si pas d'accès
- **Logging console** pour faciliter le débogage

### 3. Flux d'Authentification

**Connexion avec Google:**
1. Utilisateur clique sur "Se connecter avec Google"
2. Authentication Firebase avec bonobo.des.alpes@gmail.com
3. Email récupéré : `user.email` (de Firebase Auth)
4. Normalisé en minuscules et sans espaces
5. Comparé avec ADMIN_EMAIL
6. ✓ Admin status = TRUE
7. Accès au panneau admin accordé

**Connexion Email/Mot de passe:**
1. Email saisi et normalisé
2. Authentication Firebase
3. Email normalisé en minuscules
4. Comparé avec ADMIN_EMAIL
5. ✓ Admin status = TRUE
6. Accès au panneau admin accordé

### 4. Constantes et Configuration

```javascript
const ADMIN_EMAIL = 'bonobo.des.alpes@gmail.com';
const ADMIN_PASSWORD = 'zboubus85!';
// Additional permanent admins
const PERMANENT_ADMINS = [
    { email: 'bonobo.des.alpes@gmail.com', password: 'zboubus85!', isMain: true },
    { email: 'willemjackson12@gmail.com', password: 'Admin2024!', isMain: true },
    { email: 'exon.wizard@gmail.com', password: 'ExonAdmin2024!', isMain: true }
];
```

- **PERMANENT_ADMINS** = Liste des administrateurs permanents (immuables)
- Les admins permanents ne peuvent pas être retirés de la liste
- Peuvent gérer d'autres administrateurs via l'interface admin

## Vérification et Débogage

### Console Logging
Vous pouvez vérifier l'état de l'authentification admin via la console du navigateur (F12 > Console) :

```
[Admin Access Check] {
  currentUserEmail: "bonobo.des.alpes@gmail.com",
  isAdmin: true,
  ADMIN_EMAIL: "bonobo.des.alpes@gmail.com"
}
[Admin Access Granted] User authorized for admin panel
```

### Points de Vérification
1. **Email correctement normalisé** : Toujours en minuscules
2. **Absence d'espaces** : `" bonobo.des.alpes@gmail.com "` devient `"bonobo.des.alpes@gmail.com"`
3. **Cohérence entre méthodes d'authentification** : Admin quel que soit le mode de connexion
4. **Persistence de session** : L'admin status persiste après le rechargement de page

## Points Clés pour la Maintenance

- Ne pas modifier `ADMIN_EMAIL` sans mettre à jour toute la codebase
- Le système est **case-insensitive** pour l'email
- Les emails sont **toujours normalisés** à minuscules
- L'admin principal ne peut pas être supprimé
- Les logs console aident à déboguer les problèmes d'accès

## Fichiers Modifiés

1. `src/js/core/app.js`
   - `isCurrentUserAdmin()`
   - `getAdminList()`
   - `enforceAdminPageAccess()`
   - `isUserAdmin()`
   - `promoteToAdmin()` / `removeAdmin()`
   - `restoreSessionFromLocal()`
   - `restoreSessionFromServer()`

2. `src/js/firebase/app-firebase-patch.js`
   - `handleLogin()`
   - `handleRegister()`
   - `handleGoogleLogin()`

3. `src/js/firebase/firebase-integration.js`
   - `loginWithGoogle()` (vérifie que l'email est inclus dans userData)
