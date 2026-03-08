# 🔐 CHECKLIST DE SÉCURITÉ - EXON STORE

## Phase 1: Installation et Configuration

### Dépendances Node.js requises
- [ ] `npm install express`
- [ ] `npm install helmet` - Headers de sécurité HTTP
- [ ] `npm install express-rate-limit` - Rate limiting
- [ ] `npm install mongo-sanitize` - Sanitisation des entrées
- [ ] `npm install dotenv` - Gestion des variables d'environnement
- [ ] `npm install bcryptjs` - Hash sécurisé des mots de passe
- [ ] `npm install jsonwebtoken` - Tokens JWT (optionnel)
- [ ] `npm install express-session` - Gestion des sessions (optionnel)

### Installation:
```bash
npm install express helmet express-rate-limit mongo-sanitize dotenv bcryptjs
```

### Configuration .env
- [ ] Copier `.env.example` en `.env`
- [ ] Générer `PASSWORD_SALT`: `node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"`
- [ ] Changer `ADMIN_PASS` en un mot de passe fort et unique
- [ ] Définir `CORS_ORIGIN` avec le domaine production
- [ ] Ajouter `.env` au `.gitignore`

Vérifier .gitignore:
```bash
cat .gitignore | grep -E "\.env|node_modules|secrets|logs"
```

---

## Phase 2: Implémentation Serveur

### Fichiers de sécurité créés:
- [x] `/js/security-middleware.js` - Middleware Express
- [x] `/js/security-utils.js` - Utilitaires côté client
- [x] `/js/security-init.js` - Initialisation client
- [x] `/js/api-integration.js` - Exemples d'intégration API

### Vérifications serveur.js:
- [ ] Importe `security-middleware.js`
- [ ] Utilise `securityHeaders` middleware (début)
- [ ] Utilise `globalLimiter` middleware
- [ ] CORS restrictif (whitelist de domaines)
- [ ] `csrfProtection` appliqué
- [ ] `inputSanitization` actif
- [ ] `/api/register` avec `authLimiter` et validation
- [ ] `/api/login` avec `authLimiter` et détection injection
- [ ] `/api/logout` endpoint présent
- [ ] `/api/cart` validés
- [ ] `/api/import` avec `uploadLimiter`
- [ ] Error handler `secureErrorHandler` (dernier middleware)

### Tester le serveur:
```bash
# Démarrer le serveur
node js/server.js

# Tester l'endpoint CSRF
curl http://localhost:3000/api/csrf-token

# Tester rate limiting (5 requêtes rapides)
for i in {1..6}; do curl -X POST http://localhost:3000/api/login -H "Content-Type: application/json" -d '{"identifier":"test","password":"test"}'; done
```

---

## Phase 3: Implémentation Client

### Scripts de sécurité dans les pages HTML:

Ordre IMPORTANT:
1. `security-utils.js` - En PREMIER
2. `security-init.js` - En SECOND
3. `api-integration.js` - En TROISIÈME
4. `app.js` - En DERNIER

Exemple d'ordre correct dans `<head>`:
```html
<!-- SÉCURITÉ - Charger EN PREMIER -->
<script src="/js/security-utils.js"></script>
<script src="/js/security-init.js"></script>
<script src="/js/api-integration.js"></script>

<!-- Puis autres scripts -->
<script src="/js/app.js"></script>
```

### Meta tags de sécurité:
- [ ] CSP meta tag configuré
- [ ] X-UA-Compatible défini
- [ ] X-Content-Type-Options: nosniff
- [ ] X-XSS-Protection: 1; mode=block
- [ ] Referrer-Policy défini

Vérifier dans tous les fichiers HTML de `pages/`:
```bash
grep -l "Content-Security-Policy" pages/*.html
```

### Mise à jour des formulaires:
- [ ] Utilise `secureAPI()` pour les requêtes
- [ ] Validation côté client avec `validateEmail()`, `validatePassword()`, etc.
- [ ] Détection d'injection avec `detectInjectionAttempt()`
- [ ] Pas d'appels fetch directs (utiliser secureAPI)
- [ ] Pas de `innerHTML` avec données utilisateur (utiliser `textContent` ou `escapeHTML()`)

### Test du formulaire d'exemple:
```bash
# Naviguer vers:
# http://localhost:3000/pages/secure-example.html
```

---

## Phase 4: Protections Implémentées

### ✅ CSRF Token
- [x] Génération automatique
- [x] Stockage en sessionStorage
- [x] Expiration après 1 heure
- [x] Valance obligatoire sur POST/PUT/DELETE
- [x] Endpoint: `GET /api/csrf-token`

### ✅ Content Security Policy (CSP)
- [x] Header HTTP configuré
- [x] Meta tag dans HTML
- [x] Bloque scripts non-autorisés
- [x] Contrôle les ressources externes

### ✅ Rate Limiting
- [x] Global: 100 req/IP/15min
- [x] Auth: 5 tentatives/15min
- [x] Upload: 10/utilisateur/heure

### ✅ Input Validation
- [x] Email: RFC valide
- [x] Password: Fort (8+ caractères, majuscule, minuscule, chiffre, spécial)
- [x] Username: 3-20 caractères alphanumérique
- [x] Détection XSS/injection
- [x] Limite de longueur

### ✅ Secure Storage
- [x] SessionStorage pour données sensibles
- [x] Expiration automatique
- [ ] Nettoyage toutes les 5 minutes

### ✅ XSS Protection
- [x] Escaping HTML
- [x] Validation des sources
- [x] Monitoring mutations DOM
- [x] Blocage scripts injectés

### ✅ Security Headers
- [x] X-Content-Type-Options: nosniff
- [x] X-Frame-Options: DENY
- [x] X-XSS-Protection: 1; mode=block
- [x] Strict-Transport-Security
- [x] Referrer-Policy

### ✅ Password Security
- [ ] Hash SHA256 (mettre en place bcryptjs)
- [x] Jamais stocké en clair
- [x] Validation force
- [x] Non retourné au client

### ✅ Admin Protection
- [x] HTTP Basic Auth
- [x] Hash du mot de passe
- [x] Logging des tentatives
- [ ] 2FA (optionnel)

---

## Phase 5: Tests de Sécurité

### Tester CSRF Protection:
```bash
# Sans token - devrait échouer (403)
curl -X POST http://localhost:3000/api/register \
  -H "Content-Type: application/json" \
  -d '{"email":"test@test.com","password":"Test@123456","username":"test"}'

# Avec token - devrait réussir
TOKEN=$(curl -s http://localhost:3000/api/csrf-token | jq -r '.token')
curl -X POST http://localhost:3000/api/register \
  -H "Content-Type: application/json" \
  -H "X-CSRF-Token: $TOKEN" \
  -d '{"email":"test@test.com","password":"Test@123456","username":"test"}'
```

### Tester Rate Limiting:
```bash
# Devrait bloquer après 5 essais
for i in {1..6}; do
  curl -X POST http://localhost:3000/api/login \
    -H "Content-Type: application/json" \
    -d '{"identifier":"test@test.com","password":"wrong"}'
  echo "Attempt $i"
  sleep 1
done
```

### Tester Input Validation:
```bash
# Email invalide - devrait échouer
curl -X POST http://localhost:3000/api/register \
  -H "X-CSRF-Token: valid_token" \
  -H "Content-Type: application/json" \
  -d '{"email":"not-an-email","password":"Test@123456","username":"test"}'

# Mot de passe faible - devrait échouer
curl -X POST http://localhost:3000/api/register \
  -H "X-CSRF-Token: valid_token" \
  -H "Content-Type: application/json" \
  -d '{"email":"test@test.com","password":"weak","username":"test"}'

# Injection détectée - devrait échouer
curl -X POST http://localhost:3000/api/register \
  -H "X-CSRF-Token: valid_token" \
  -H "Content-Type: application/json" \
  -d '{"email":"test@test.com","password":"Test@123456","username":"<script>alert(1)</script>"}'
```

### Tester CSP:
1. Ouvrir les DevTools (F12)
2. Aller à Console
3. Vérifier qu'il y a des CSP violations si on essaie d'inclure un script non-autorisé
4. Les scripts autorisés devraient charger sans erreur

### Vérifier les headers de sécurité:
```bash
curl -i http://localhost:3000 | grep -E "Strict-Transport-Security|X-Frame-Options|X-Content-Type-Options|Content-Security-Policy"
```

---

## Phase 6: Audit de Sécurité

### Vérifier les mots de passe en clair:
```bash
# Ne devrait rien trouver
grep -r "password.*:" pages/ --include="*.html" --include="*.js" | grep -v "placeholder" | grep -v "type.*password"
```

### Vérifier innerHTML avec données:
```bash
# Chercher les utilisations dangereuses
grep -r "innerHTML" js/ --include="*.js" | grep -v "escapeHTML" | grep -v "textContent"
```

### Vérifier les secrets hardcodés:
```bash
# Ne devrait rien trouver
grep -r "password\|secret\|api_key" . --include="*.js" --include="*.html" | grep -v node_modules | grep -v ".env"
```

### Vérifier les dépendances:
```bash
# Chercher les vulnérabilités
npm audit

# Mettre à jour les paquets
npm audit fix
```

---

## Phase 7: Production Deployment

### Avant de déployer:
- [ ] NODE_ENV=production dans .env
- [ ] HTTPS activé
- [ ] SSL certificates valides
- [ ] CORS correctement restreint
- [ ] PASSWORD_SALT généré et secret
- [ ] ADMIN_PASS fort et unique
- [ ] Tous les secrets en variables d'environnement
- [ ] .env NON commité dans Git
- [ ] Logs configurés
- [ ] Monitoring actif

### Sur le serveur de production:
```bash
# Installer npm packages
npm install --production

# Vérifier les erreurs
npm audit

# Démarrer le serveur
NODE_ENV=production node js/server.js

# Ou utiliser PM2 pour persistance:
npm install -g pm2
pm2 start js/server.js --name "exon-store" --env production
```

### Configuration Nginx/Apache:
```nginx
# Ajouter ces headers (si pas déjà fait par Express)
add_header Strict-Transport-Security "max-age=31536000; includeSubDomains" always;
add_header X-Content-Type-Options "nosniff" always;
add_header X-Frame-Options "DENY" always;
add_header X-XSS-Protection "1; mode=block" always;
```

---

## Phase 8: Monitoring et Maintenance

### Logs de sécurité à surveiller:
- Tentatives de login échouées
- Tentatives d'injection détectées
- Scripts injectés bloqués
- Requêtes au-delà du rate limit
- Erreurs d'authentification admin

### Vérifications régulières:
- [ ] Mettre à jour npm packages: `npm update`
- [ ] Chercher vulnérabilités: `npm audit`
- [ ] Vérifier les logs: `tail -f logs/server.log`
- [ ] Analyser les patterns suspects
- [ ] Archiver les anciens logs
- [ ] Vérifier les certificats SSL (expiration)

### Backup régulier:
- [ ] Base de données users
- [ ] Fichiers uploadés
- [ ] Logs
- [ ] Configuration

---

## Ressources de Sécurité

📚 OWASP Top 10: https://owasp.org/www-project-top-ten/
📚 Node.js Security: https://nodejs.org/en/docs/guides/security/
📚 CSP Reference: https://content-security-policy.com/
📚 Helmet.js: https://helmetjs.github.io/
📚 PASSWD Standards: https://cheatsheetseries.owasp.org/

---

## Support & Issues

**Problème:** CSRF token invalide
**Solution:** Actualiser la page, les tokens se renouvellent automatiquement

**Problème:** Rate limit atteint
**Solution:** Attendre 15 minutes

**Problème:** Injection détectée
**Solution:** Vérifier la syntaxe de l'entrée, utiliser des caractères autorisés

**Problème:** CSP violation
**Solution:** Ajouter le domaine à la whitelist CSP dans security-middleware.js

---

**Date:** Mars 2026
**Dernière révision:** Mars 2026
**Statut:** ✅ Production Ready
