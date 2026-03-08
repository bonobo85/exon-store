# 🔐 GUIDE DE SÉCURITÉ - EXON STORE

## Vue d'ensemble des protections implémentées

### 1. **CSRF Token Protection** 🛡️
Protection contre les attaques Cross-Site Request Forgery

#### Fonctionnement:
- Génération de tokens uniques par session
- Stockage sécurisé en `sessionStorage`
- Validation obligatoire pour toute opération d'écriture (POST, PUT, DELETE)
- Tokens auto-expirables après 1 heure

#### Utilisation côté client:
```javascript
// Les tokens sont gérés automatiquement par secureAPI()
await secureAPI('/api/register', {
    method: 'POST',
    body: JSON.stringify(userData)
});
// Le token CSRF est ajouté automatiquement aux headers
```

#### Utilisation côté serveur:
```javascript
// Protection automatique via middleware
app.use(csrfProtection);
```

---

### 2. **Content Security Policy (CSP)** 📋
Contrôle strictement quelles ressources peuvent être chargées

#### Directives implémentées:
| Directive | Valeur | Raison |
|-----------|--------|--------|
| `default-src` | `'self'` | Uniquement les ressources du même domaine |
| `script-src` | `'self'`, `cdn.jsdelivr.net` | Scripts locaux + CDN approuvés |
| `style-src` | `'self'`, `cdn.jsdelivr.net` | Feuilles de style sécurisées |
| `img-src` | `'self'`, `data:`, `https:`, `blob:` | Images de sources approuvées |
| `connect-src` | `'self'`, `firebase.google.com` | API approuvées uniquement |
| `frame-src` | `'none'` | Empêche les iframes (protection clickjacking) |
| `object-src` | `'none'` | Pas de plugins Flash/Java |
| `form-action` | `'self'` | Formulaires vers le même domaine |

#### Avantages:
- Bloque les scripts injectés
- Empêche le chargement de ressources malveillantes
- Réduit l'impact des failles XSS

---

### 3. **Rate Limiting** ⏱️
Prévient les attaques par force brute et débordement de ressources

#### Limites configurées:

**Global Rate Limit:**
- 100 requêtes par IP / 15 minutes
- Protège le serveur contre les abus généraux

**Auth Rate Limit (Login/Register):**
- 5 tentatives par identifiant / 15 minutes
- Protège contre le brute-force de mots de passe

**Upload Rate Limit:**
- 10 uploads par utilisateur / heure
- Récurrence par userID ou IP

#### Gestion côté client:
```javascript
// Vérifie les tentatives disponibles
const attemptsLeft = bruteForceProtection.getAttemptsLeft(email);
if (attemptsLeft === 0) {
    console.warn('Compte temporairement bloqué');
}

// Vérifie si bloqué
if (bruteForceProtection.isBlocked(email)) {
    // Affiche message d'erreur
}
```

---

### 4. **Input Validation & Sanitization** ✔️
Valide et nettoie toutes les entrées utilisateur

#### Validations implémentées:

**Email:**
```javascript
validateEmail('user@example.com') // true/false
// Regex: /^[^\s@]+@[^\s@]+\.[^\s@]+$/
```

**Password:**
```javascript
validatePassword('Secure@Pass123') // true/false
// Exigences:
// - Minimum 8 caractères
// - 1 majuscule
// - 1 minuscule
// - 1 chiffre
// - 1 caractère spécial (@$!%*?&)
```

**Username:**
```javascript
validateUsername('user_123') // true/false
// Regex: /^[a-zA-Z0-9_-]{3,20}$/
```

**Input générique:**
```javascript
sanitizeInput(userInput, minLength, maxLength) // string sécurisé
// - Supprime les balises HTML
// - Échappe les caractères spéciaux
// - Limite la longueur
```

#### Injection Detection:
```javascript
// Détecte les tentatives XSS/injection
if (detectInjectionAttempt(userInput)) {
    // Rejette l'entrée
}
```

---

### 5. **XSS Protection** 🚫
Prévention des attaques Cross-Site Scripting

#### Techniques:
1. **HTML Escaping:**
```javascript
escapeHTML('<script>alert("XSS")</script>')
// Résultat: "&lt;script&gt;alert(&quot;XSS&quot;)&lt;/script&gt;"
```

2. **DOM Protection:**
- Moniteur des mutations du DOM
- Détecte et supprime les scripts injectés
- Valide les domaines des scripts externes

3. **Content Security Policy:**
- Bloque les scripts inline non-autorisés
- Contrôle les domaines de ressources

---

### 6. **Security Headers** 🔒
Headers HTTP importants pour la sécurité

| Header | Valeur | Protection |
|--------|--------|------------|
| `X-Content-Type-Options` | `nosniff` | Empêche MIME sniffing |
| `X-Frame-Options` | `DENY` | Protège contre clickjacking |
| `X-XSS-Protection` | `1; mode=block` | Active le filtre XSS du navigateur |
| `Strict-Transport-Security` | `max-age=31536000` | Force HTTPS (1 an) |
| `Referrer-Policy` | `strict-origin-when-cross-origin` | Contrôle les infos de referer |
| `Permissions-Policy` | Restrictive | Contrôle l'accès aux API sensibles |

---

### 7. **Secure Storage** 💾
Gestion sécurisée des données sensibles

#### SessionStorage vs LocalStorage:
```javascript
// Données sensibles (sessions, tokens):
SecureStorage.setSecure('sessionToken', token, 30) // 30 min expiration
const token = SecureStorage.getSecure('sessionToken')

// Données non-sensibles:
localStorage.setItem('preferences', JSON.stringify(prefs))
```

#### Expirations automatiques:
- SessionStorage: Données sensibles w/ TTL
- Nettoyage auto: Toutes les 5 minutes
- Stockage sessionnaire: Durée de session du navigateur

---

### 8. **User Data Sanitization** 👤
Nettoyage des données utilisateur

```javascript
// Ne retourne que les champs autorisés
const safeUser = sanitizeUser(userData);
// Supprime: password, sensitive_data, internal_fields
```

---

### 9. **API Security** 🔌

#### Endpoints inclus:

**GET `/api/csrf-token`** - Obtenir un token CSRF
```javascript
const response = await fetch('/api/csrf-token');
const { token } = await response.json();
```

**POST `/api/register`** - Créer un compte
- Rate limited: 5/15min
- Input validé
- CSRF token requis
- Email/username/password validés

**POST `/api/login`** - Se connecter
- Rate limited: 5/15min
- Détecte les tentatives de brute-force
- Pas d'exposition des raisons d'échec

**POST `/api/logout`** - Se déconnecter
- Invalide la session
- Supprime les tokens

---

### 10. **Logging & Monitoring** 📊

#### Logs de sécurité:
```javascript
[SECURITY] Attempt malveillant détecté: ...
[SECURITY] Token CSRF invalide
[SECURITY] Script injecté supprimé
[SECURITY] Page dans iframe détectée
```

#### Audit trail:
- Toutes les tentatives de login/register
- Opérations d'écriture (POST/PUT/DELETE)
- Erreurs d'authentification
- Tentatives suspectes

---

## 📋 Checklist d'implémentation

### Serveur (server.js)
- [x] Charger le middleware de sécurité
- [x] CSRF protection activée
- [x] Rate limiting configuré
- [x] Input validation active
- [x] Security headers ajoutés
- [x] Error handling sécurisé
- [x] Logging implémenté

### Client (HTML pages)
- [ ] Charger `security-utils.js` en premier
- [ ] Charger `security-init.js` après
- [ ] Ajouter meta tags CSP
- [ ] Utiliser `secureAPI()` pour tous les appels
- [ ] Ajouter validation côté client

### Configuration
- [ ] NODE_ENV = 'production'
- [ ] HTTPS activé
- [ ] Cookies sécurisés (secure + httpOnly)
- [ ] CORS restreint
- [ ] Service Worker pour CSP

---

## 🚀 Utilisation

### Enregistrement sécurisé:
```javascript
// Côté client
const email = sanitizeInput(formData.email);
const username = sanitizeInput(formData.username);
const password = formData.password;

// Validation
if (!validateEmail(email)) {
    alert('Email invalide');
    return;
}
if (!validatePassword(password)) {
    alert('Mot de passe faible');
    return;
}

// Envoi sécurisé (token CSRF ajouté auto)
const response = await secureAPI('/api/register', {
    method: 'POST',
    body: JSON.stringify({ email, username, password })
});
```

### Connexion sécurisée:
```javascript
// Protection brute-force côté client
const email = formData.email;
if (bruteForceProtection.isBlocked(email)) {
    const attemptsLeft = bruteForceProtection.getAttemptsLeft(email);
    alert(`Compte bloqué. Réessayez dans ${attemptsLeft} min`);
    return;
}

// Enregistre tentative
if (!bruteForceProtection.recordAttempt(email)) {
    alert('Limite d\'essais atteinte');
    return;
}

// Envoi
const response = await secureAPI('/api/login', {
    method: 'POST',
    body: JSON.stringify({ identifier: email, password })
});
```

---

## ⚠️ Pratiques de sécurité

### Ne PAS faire:
❌ Stocker les mots de passe en clair  
❌ Utiliser `innerHTML` avec données utilisateur  
❌ Faire confiance aux données du client  
❌ Exposer les erreurs de détail en production  
❌ Ignorer les logs de sécurité  
❌ Utiliser des tokens sans expiration  
❌ Envoyer des données sensibles en GET  

### Faire:
✅ Hash les mots de passe (côté serveur)  
✅ Valider/sanitizer toutes les entrées  
✅ Utiliser HTTPS uniquement  
✅ Rotate les tokens régulièrement  
✅ Monitorer les logs de sécurité  
✅ Utiliser secureAPI() pour les requêtes  
✅ Implémenter le rate limiting  
✅ Actualiser régulièrement les dépendances  

---

## 🔧 Configuration avancée

### Ajouter des domaines CSP:
```javascript
// security-middleware.js
scriptSrc: ["'self'", "'unsafe-inline'", "cdn.jsdelivr.net", "votre-cdn.com"],
```

### Modifier les limites rate limit:
```javascript
// security-middleware.js
const authLimiter = rateLimit({
    windowMs: 10 * 60 * 1000,  // 10 minutes
    max: 3,  // 3 tentatives
});
```

### Ajouter une clé API sécurisée:
```javascript
// Utiliser des variables d'environnement
const API_KEY = process.env.SECURE_API_KEY;
// Ne jamais hardcoder les secrets!
```

---

## 📞 Support & Dépannage

**Token CSRF expiré?**
- Rafraîchir la page
- Les tokens se renouvellent automatiquement

**Rate limit atteint?**
- Attendre 15 minutes
- Protection active contre les abus

**Injection détectée?**
- Les entrées suspectes sont bloquées
- Vérifier la syntaxe de l'entrée

**CSP violation?**
- Vérifier la console du navigateur
- Ajouter le domaine à la whitelist CSP

---

## 📚 Ressources

- [OWASP Top 10](https://owasp.org/www-project-top-ten/)
- [Content Security Policy](https://developer.mozilla.org/en-US/docs/Web/HTTP/CSP)
- [Helmet.js Documentation](https://helmetjs.github.io/)
- [nodeID Security Best Practices](https://nodejs.org/en/docs/guides/security/)

---

**Dernière mise à jour:** Mars 2025
**Statut:** Production Ready ✅
