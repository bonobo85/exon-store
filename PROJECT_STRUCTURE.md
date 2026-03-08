# 📁 Structure d'Exon Store

Ce document décrit la nouvelle organisation logique du projet Exon Store.

## Vue d'ensemble

```
exon-store/
├── public/                 # 🌐 Fichiers statiques publics (root du serveur)
│   ├── index.html         # Redirection principale
│   ├── pages/             # Pages HTML de l'application
│   │   ├── index.html
│   │   ├── home.html
│   │   ├── about.html
│   │   ├── admin.html
│   │   ├── cars.html
│   │   ├── clothes.html
│   │   ├── scripts.html
│   │   ├── templates.html
│   │   ├── cart.html
│   │   ├── product-detail.html
│   │   ├── secure-example.html
│   │   └── ...
│   └── css/               # Feuilles de style
│       └── styles.css
│
├── src/                    # 💻 Code source (logique applicative)
│   └── js/                # Tous les scripts JavaScript
│       ├── core/          # Code de base de l'application
│       │   ├── app.js
│       │   ├── data.js
│       │   ├── translations.js
│       │   ├── product-detail.js
│       │   └── ...
│       ├── firebase/      # Intégration Firebase & authentification
│       │   ├── firebase-config.js
│       │   ├── firebase-wrapper.js
│       │   ├── firebase-integration.js
│       │   └── app-firebase-patch.js
│       └── security/      # Middleware & utilitaires de sécurité
│           ├── security-init.js
│           ├── security-middleware.js
│           ├── security-utils.js
│           └── api-integration.js
│
├── security/              # 🔒 Sécurité & guides de conformité
│   └── docs/
│       ├── SECURITY_README.md
│       ├── SECURITY_SUMMARY.md
│       ├── SECURITY_GUIDE.md
│       ├── SECURITY_CHECKLIST.md
│       ├── SECURITY_IMPLEMENTATION_GUIDE.html
│       └── PACKAGE_SECURITY_GUIDE.js
│
├── docs/                  # 📚 Documentation du projet
│   ├── deployment/        # Guides de déploiement
│   │   ├── DEPLOYMENT_READY.md
│   │   ├── NETLIFY_DEPLOY.md
│   │   ├── NETLIFY_FIREBASE_SETUP.md
│   │   ├── FIREBASE_SETUP.md
│   │   └── FIREBASE_VERIFICATION.md
│   └── guides/           # Guides divers & configuration
│       ├── GOOGLE_AUTH_GUIDE.md
│       ├── MIGRATION.md
│       ├── README_STATUS.md
│       └── PRE_DEPLOYMENT_CHECKLIST.md
│
├── config/                # ⚙️ Fichiers de configuration
│   └── netlify.toml      # Configuration Netlify
│
├── data/                  # 💾 Données JSON
│   ├── users.json
│   └── authLogs.json
│
├── netlify/              # 🚀 Fonctions Netlify (API serverless)
│   └── functions/
│       └── api.mjs
│
├── scripts/              # 🛠️ Scripts utilitaires
│   ├── verify-setup.sh
│   └── verify-setup.bat
│
├── .env                  # Variables d'environnement (local, ignoré)
├── .env.example          # Modèle des variables d'environnement
├── package.json          # Dépendances Node.js
├── CNAME                 # Configuration GitHub Pages
├── netlify.toml          # Configuration Netlify
└── README.md             # Documentation principale
```

## 📝 Guides de navigation

### Ajouter une nouvelle page
1. Créer `public/pages/ma-page.html`
2. Importer les scripts avec les nouveaux chemins:
   ```html
   <link rel="stylesheet" href="../../public/css/styles.css">
   <script src="../../src/js/core/translations.js"></script>
   <script src="../../src/js/core/app.js"></script>
   ```

### Ajouter une nouvelle fonctionnalité de sécurité
1. Créer le fichier dans `src/js/security/ma-feature.js`
2. L'importer dans les pages HTML qui l'utilisent
3. Documenter dans `security/docs/`

### Ajouter de la documentation
- **Déploiement**: `docs/deployment/`
- **Guides & configuration**: `docs/guides/`
- **Sécurité**: `security/docs/`

### Fichiers de données
- Données d'application: `data/*.json`
- Configuration Firebase: `src/js/firebase/firebase-config.js`

## 🔗 Chemins relatifs courants

Depuis une page dans `public/pages/`:
```javascript
// Accéder aux styles
<link rel="stylesheet" href="../../public/css/styles.css">

// Accéder aux scripts de base
<script src="../../src/js/core/app.js"></script>

// Accéder à Firebase
<script src="../../src/js/firebase/firebase-config.js"></script>

// Accéder aux utilitaires de sécurité
<script src="../../src/js/security/security-utils.js"></script>
```

## 📦 Migration depuis l'ancienne structure

### Anciennes localisations → Nouvelles localisations

| Ancien | Nouveau |
|--------|---------|
| `js/app.js` | `src/js/core/app.js` |
| `js/firebase-config.js` | `src/js/firebase/firebase-config.js` |
| `js/security-init.js` | `src/js/security/security-init.js` |
| `css/styles.css` | `public/css/styles.css` |
| `pages/*.html` | `public/pages/*.html` |
| `docs/SECURITY_*.md` | `security/docs/SECURITY_*.md` |
| `docs/*DEPLOYMENT*.md` | `docs/deployment/` |
| `docs/*GUIDE*.md` | `docs/guides/` |
| `netlify.toml` | `config/netlify.toml` |

### Mise à jour des imports

Les chemins dans les fichiers HTML ont été automatiquement mis à jour vers:
```
../css/styles.css       → ../../public/css/styles.css
../js/app.js            → ../../src/js/core/app.js
../js/firebase-*.js     → ../../src/js/firebase/firebase-*.js
../js/security-*.js     → ../../src/js/security/security-*.js
```

## 🎯 Objectif de cette organisation

✅ **Clarté**: Chaque dossier a un objectif clair
✅ **Maintenabilité**: Code source organisé logiquement
✅ **Scalabilité**: Facile d'ajouter de nouveaux modules
✅ **Sécurité**: Documentation & code de sécurité centralisés
✅ **Déploiement**: Configuration & guides accessibles

---

Pour toute question, consultez la documentation correspondante dans `docs/` ou `security/docs/`.
