/**
 * ==================== PACKAGE.JSON - SECURITY DEPENDENCIES ====================
 * 
 * IMPORTANT: Add these dependencies to your package.json
 * Then run: npm install
 * 
 * This file shows the recommended packages for production-grade security
 */

{
  "name": "exon-store",
  "version": "1.0.0",
  "description": "Exon Store - Secure E-commerce Platform",
  "main": "js/server.js",
  "scripts": {
    "start": "node js/server.js",
    "dev": "nodemon js/server.js",
    "test": "jest",
    "test:security": "npm audit && node scripts/security-check.js",
    "lint": "eslint js/",
    "secure": "NODE_ENV=production node js/server.js"
  },
  "engines": {
    "node": ">=14.0.0",
    "npm": ">=6.0.0"
  },
  "dependencies": {
    "express": "^4.18.2",
    "helmet": "^7.1.0",
    "express-rate-limit": "^7.1.5",
    "mongo-sanitize": "^2.1.0",
    "dotenv": "^16.3.1",
    "bcryptjs": "^2.4.3",
    "jsonwebtoken": "^9.1.2",
    "express-session": "^1.17.3",
    "express-validator": "^7.0.0",
    "cors": "^2.8.5",
    "axios": "^1.6.2",
    "firebase-admin": "^12.0.0",
    "xlsx": "^0.18.5",
    "multer": "^1.4.5-lts.1",
    "uuid": "^9.0.1",
    "joi": "^17.11.0"
  },
  "devDependencies": {
    "nodemon": "^3.0.2",
    "jest": "^29.7.0",
    "supertest": "^6.3.3",
    "eslint": "^8.54.0",
    "eslint-config-standard": "^17.1.0",
    "eslint-plugin-security": "^1.7.1"
  },
  "keywords": [
    "e-commerce",
    "security",
    "csrf-protection",
    "rate-limiting",
    "input-validation",
    "xss-protection",
    "csp"
  ],
  "author": "Exon Store Team",
  "license": "MIT",
  "repository": {
    "type": "git",
    "url": "https://github.com/your-org/exon-store"
  }
}

/**
 * ==================== SECURITY PACKAGES EXPLAINED ====================
 * 
 * CORE SECURITY:
 * - helmet: Security headers (CSP, X-Frame-Options, HSTS, etc.)
 * - express-rate-limit: Rate limiting to prevent brute-force attacks
 * - mongo-sanitize: Remove malicious characters from user inputs
 * - bcryptjs: Hash passwords securely (instead of SHA256)
 * - express-validator: Validate and sanitize form data
 * 
 * AUTHENTICATION:
 * - jsonwebtoken: JWT tokens for stateless authentication
 * - express-session: Session management
 * - cors: CORS middleware for secure cross-origin requests
 * 
 * UTILITIES:
 * - dotenv: Load environment variables from .env
 * - axios: HTTP client (user-facing API calls)
 * - uuid: Generate unique IDs
 * - joi: Schema validation (alternative to express-validator)
 * 
 * FILE HANDLING:
 * - multer: File upload middleware with security
 * - xlsx: Excel file parsing (for imports)
 * 
 * FIREBASE:
 * - firebase-admin: Firebase Admin SDK for backend
 * 
 * DEVELOPMENT:
 * - nodemon: Auto-restart server on file changes
 * - jest: Unit testing framework
 * - supertest: HTTP assertions for testing
 * - eslint: Code linting with security plugin
 * 
 * ==================== INSTALLATION ====================
 * 
 * 1. Install all dependencies:
 *    npm install
 * 
 * 2. Check for vulnerabilities:
 *    npm audit
 * 
 * 3. Fix vulnerabilities:
 *    npm audit fix
 * 
 * 4. Verify installation:
 *    npm list --depth=0
 * 
 * ==================== SECURITY BEST PRACTICES ====================
 * 
 * 1. Always use bcryptjs instead of SHA256 for passwords
 *    // WRONG:
 *    password: crypto.createHash('sha256').update(pwd).digest()
 *    
 *    // RIGHT:
 *    const hashedPassword = await bcrypt.hash(password, 10);
 * 
 * 2. Validate ALL inputs with express-validator or joi
 *    const { body, validationResult } = require('express-validator');
 *    
 *    app.post('/api/register', [
 *      body('email').isEmail(),
 *      body('password').isLength({ min: 8 })
 *    ], (req, res) => {
 *      const errors = validationResult(req);
 *      if (!errors.isEmpty()) return res.status(400).json({ errors });
 *    });
 * 
 * 3. Always use helmet for security headers
 *    const helmet = require('helmet');
 *    app.use(helmet());
 * 
 * 4. Use rate limiting on sensitive endpoints
 *    const rateLimit = require('express-rate-limit');
 *    const limiter = rateLimit({ windowMs: 15 * 60 * 1000, max: 5 });
 *    app.post('/api/login', limiter, loginHandler);
 * 
 * 5. NEVER commit .env file
 *    echo ".env" >> .gitignore
 * 
 * 6. Use environment variables for all secrets
 *    const adminPass = process.env.ADMIN_PASSWORD;
 * 
 * 7. Sanitize user inputs to prevent XSS
 *    const mongoSanitize = require('mongo-sanitize');
 *    app.use(mongoSanitize());
 * 
 * 8. Log security events
 *    console.log('[SECURITY] Suspicious activity:', event);
 * 
 * ==================== UPGRADE SECURITY FROM SHA256 ====================
 * 
 * Current code uses SHA256 (weak for passwords).
 * To use bcryptjs (recommended):
 * 
 * BEFORE:
 * ---------
 * const crypto = require('crypto');
 * const passwordHash = crypto.createHash('sha256')
 *   .update(password + salt)
 *   .digest('hex');
 * 
 * AFTER:
 * ---------
 * const bcrypt = require('bcryptjs');
 * const passwordHash = await bcrypt.hash(password, 10);
 * 
 * // For login:
 * const isPasswordValid = await bcrypt.compare(inputPassword, storedHash);
 * 
 * ==================== TESTING SECURITY ====================
 * 
 * Run security tests:
 * npm run test:security
 * 
 * Check for vulnerabilities:
 * npm audit
 * 
 * Lint code for security issues:
 * npm run lint
 * 
 * ==================== PRODUCTION DEPLOYMENT ====================
 * 
 * 1. Set NODE_ENV=production
 * 2. Install only production dependencies: npm install --production
 * 3. Set all environment variables via .env or hosting platform
 * 4. Enable HTTPS with valid SSL certificate
 * 5. Set secure=true on cookies (see security-middleware.js)
 * 6. Use a process manager like PM2
 * 7. Set up monitoring and logging
 * 8. Enable automated security updates
 */

/**
 * To convert this to a real package.json:
 * 1. Remove the comment wrappers (/ * and * /)
 * 2. Save as package.json
 * 3. Run: npm install
 */
