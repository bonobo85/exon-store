# Ô£à Pre-Deployment Checklist

Use this checklist to verify everything is ready before deploying to Netlify.

## Local Setup

- [ ] `.env` file exists with `FIREBASE_SERVICE_ACCOUNT`
- [ ] `.gitignore` file exists and includes `.env`
- [ ] `package.json` has `firebase-admin` dependency
- [ ] `netlify.toml` is configured
- [ ] `netlify/functions/api.mjs` exists and uses Firebase

## Installation & Testing

- [ ] Run `npm install` successfully
- [ ] Run `netlify dev` and access http://localhost:8888
- [ ] Test user registration works
- [ ] Test user login works
- [ ] Test logout works
- [ ] Test cart persistence (add item, refresh, item still there)
- [ ] Check browser console has no errors
- [ ] Check Firestore in Firebase Console and see new users

## Code Review

- [ ] All Neon references removed from code
- [ ] API endpoints work locally
- [ ] No sensitive data in `.toml` or code files
- [ ] `.env.example` shows format without credentials
- [ ] `verify-setup.bat` or `verify-setup.sh` passes

## Firebase Verification

- [ ] Firebase project exists: `bonobo-store-v2`
- [ ] Service account JSON is valid
- [ ] Firestore database is active
- [ ] Collections are created: `users`, `sessions`, `authLogs`
- [ ] Firebase service account has permission for Firestore

## Git Preparation

- [ ] No `.env` file will be committed (check .gitignore)
- [ ] Run `git status` and verify `.env` is NOT listed
- [ ] Commit all other changes: `git add .` and `git commit`
- [ ] Push to GitHub: `git push origin main`

## Netlify Preparation

### Create/Connect Site
- [ ] Netlify account exists
- [ ] GitHub repo is connected to Netlify
- [ ] Netlify site is created
- [ ] Netlify site name noted (you'll need it)

### Environment Variables
- [ ] Go to Site Settings ÔåÆ Build & deploy ÔåÆ Environment
- [ ] Set `FIREBASE_SERVICE_ACCOUNT` environment variable
- [ ] Value is the complete JSON from `.env` file
- [ ] Variable is saved

### Build Settings
- [ ] Build command is set (usually auto-detected)
- [ ] Publish directory is `.` (root)
- [ ] Functions directory is `netlify/functions`
- [ ] Node.js version is set (14+ preferred)

## Pre-Deployment Tests

- [ ] Clear browser cache
- [ ] Test on different browsers (Chrome, Firefox, Safari)
- [ ] Test on mobile device
- [ ] Disabled JavaScript - verify graceful degradation
- [ ] With JavaScript enabled - full functionality works
- [ ] Open DevTools Network tab while registering - API calls succeed

## Deployment

- [ ] Run `netlify deploy --prod` OR push to GitHub
- [ ] Wait for build to complete (usually 1-2 minutes)
- [ ] Check build logs for errors
- [ ] Verify functions deployed (check Functions tab in Netlify)
- [ ] Verify environment variables set (check Settings ÔåÆ Build & deploy)

## Post-Deployment Tests

- [ ] Visit your Netlify URL
- [ ] Frontend loads (HTML/CSS/JS displayed)
- [ ] DevTools shows no CORS errors
- [ ] Register new account
- [ ] Check Firestore - new user in `users` collection
- [ ] Login with registered account
- [ ] Add items to cart
- [ ] Refresh page - cart persists
- [ ] Logout and login again
- [ ] Admin access works with admin credentials

## Monitoring

- [ ] Set up Netlify monitoring alerts (optional)
- [ ] Bookmark Firebase Console for monitoring
- [ ] Bookmark Netlify Dashboard for logs
- [ ] Share Netlify URL with testers/users
- [ ] Get feedback from users

## Documentation

- [ ] README.md updated with live URL
- [ ] Team informed of new deployment
- [ ] Backup of Firebase service account key kept securely
- [ ] Documentation shared with team

## If Something Goes Wrong

- [ ] Check Netlify function logs
- [ ] Check browser console for errors
- [ ] Verify Firestore has data
- [ ] Check environment variable is set in Netlify
- [ ] Review NETLIFY_DEPLOY.md troubleshooting section
- [ ] Verify `.env` file locally with `verify-setup.bat`

## Success Indicators Ô£à

- [ ] Site loads at https://yoursite.netlify.app
- [ ] Users can register
- [ ] Users can login
- [ ] Data persists in Firestore
- [ ] No console errors
- [ ] Admin panel works
- [ ] Cart persists across sessions

---

## If Deployment Fails

1. **Check build logs:**
   - Netlify Dashboard ÔåÆ Deploys ÔåÆ Click failed deploy ÔåÆ View logs

2. **Common issues:**
   ```
   FIREBASE_SERVICE_ACCOUNT not set
   ÔåÆ Add in Netlify Site Settings ÔåÆ Build & deploy ÔåÆ Environment

   MODULE_NOT_FOUND (firebase-admin)
   ÔåÆ Verify npm install ran successfully
   ÔåÆ Check node_modules exists

   Firestore permission denied
   ÔåÆ Check service account permissions
   ÔåÆ Verify JSON is valid
   ```

3. **Rollback if needed:**
   ```bash
   # Deploy previous version
   git revert HEAD
   git push origin main
   # Netlify will auto-deploy the previous version
   ```

---

**You're ready when ALL checkboxes above are Ô£à**

Good luck! ­ƒÜÇ
