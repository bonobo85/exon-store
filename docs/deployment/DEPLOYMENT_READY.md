# ­ƒÜÇ Exon Store - Netlify + Firebase Deployment

Your project is now fully configured for deployment to Netlify with Firebase as your backend!

## ­ƒôï What's Ready

Ô£à **Backend API** - Netlify Functions with Firebase Firestore  
Ô£à **Database** - Firebase Firestore (no Neon needed)  
Ô£à **Environment** - `.env` file with Firebase credentials  
Ô£à **Security** - `.gitignore` to protect credentials  
Ô£à **Documentation** - Complete setup guides  

## ­ƒÄ» Quick Start

### 1. Verify Your Setup (Optional but Recommended)

**Windows:**
```bash
verify-setup.bat
```

**Mac/Linux:**
```bash
bash verify-setup.sh
```

### 2. Install Dependencies

```bash
npm install
```

### 3. Test Locally

```bash
netlify dev
```

Then visit: `http://localhost:8888`

Test the following:
- Register a new account
- Login/Logout
- Add items to cart
- Refresh page (cart should persist)
- Check admin panel (if you're the admin)

### 4. Deploy to Netlify

**Option A: Connect GitHub (Recommended)**

1. Push your code:
   ```bash
   git add .
   git commit -m "Ready for Netlify deployment"
   git push origin main
   ```

2. Go to [Netlify Dashboard](https://app.netlify.com)

3. Click **Add new site** ÔåÆ **Import an existing project**

4. Select your GitHub repo

5. Netlify will ask for environment variables - set:
   - **Key:** `FIREBASE_SERVICE_ACCOUNT`
   - **Value:** Copy from your `.env` file (the JSON string after the `=`)

6. Click **Deploy**

**Option B: Deploy via CLI**

```bash
npm install -g netlify-cli
netlify login
netlify env:set FIREBASE_SERVICE_ACCOUNT "$(cat .env | grep FIREBASE_SERVICE_ACCOUNT | cut -d= -f2-)"
netlify deploy --prod
```

## ­ƒôü New Files Created

| File | Purpose |
|------|---------|
| `.env` | Your Firebase credentials (local development) |
| `.env.example` | Template showing the format |
| `.gitignore` | Prevents `.env` from being committed |
| `NETLIFY_DEPLOY.md` | Step-by-step deployment guide |
| `NETLIFY_FIREBASE_SETUP.md` | Detailed setup documentation |
| `MIGRATION.md` | Technical migration details |
| `verify-setup.sh` | Verification script (Mac/Linux) |
| `verify-setup.bat` | Verification script (Windows) |

## ­ƒöÆ Security Checkpoints

Ô£à **Credentials are protected:**
- `.env` is in `.gitignore` (won't be committed)
- Only Netlify environment variables contain sensitive data
- Service account key is never in your code

Ô£à **Local development:**
- Uses `.env` file for Firebase credentials
- Same as production environment flow

Ô£à **Production deployment:**
- Environment variables set in Netlify UI
- Never exposed in code or Git history

## ­ƒöÑ Firebase Project Details

- **Project ID:** `bonobo-store-v2`
- **Database:** Firestore (real-time NoSQL)
- **Collections:**
  - `users` - User accounts and data
  - `sessions` - Active session tokens
  - `authLogs` - Login/registration attempts

## ­ƒôè Monitoring After Deployment

### Netlify Dashboard
- **Builds:** https://app.netlify.com/sites/YOUR_SITE/builds
- **Functions:** https://app.netlify.com/sites/YOUR_SITE/functions
- **Environment:** https://app.netlify.com/sites/YOUR_SITE/settings/build

### Firebase Console
- **Firestore:** https://console.firebase.google.com/project/bonobo-store-v2/firestore
- **Usage:** Check free tier limits
- **Security Rules:** Configure as needed

## ÔÜá´©Å Important Reminders

1. **Never commit `.env` to Git** - It's in `.gitignore` for a reason
2. **Keep your Firebase key secret** - It's in `.env` and Netlify env vars only
3. **Monitor your Firebase usage** - Stay within free tier limits
4. **Test locally first** - Use `netlify dev` before going live
5. **Save your credentials** - Keep the JSON backup somewhere secure

## ­ƒåÿ Troubleshooting

### Local testing fails
```bash
# Reinstall dependencies
rm -rf node_modules
npm install

# Verify setup
netlify dev  # or verify-setup.bat
```

### Deployment fails
- Check Netlify build logs
- Verify `FIREBASE_SERVICE_ACCOUNT` is set in Netlify
- Confirm `.env` exists locally with valid JSON

### API calls return 500 error
- Check Netlify function logs (Functions tab in Netlify Dashboard)
- Verify Firebase service account is valid
- Check Firestore is active in Firebase Console

### CORS errors in browser
- Verify your Netlify domain is the request origin
- Check API headers in `netlify/functions/api.mjs`

## ­ƒôÜ Complete Documentation

- **[NETLIFY_DEPLOY.md](NETLIFY_DEPLOY.md)** - Detailed deployment steps
- **[NETLIFY_FIREBASE_SETUP.md](NETLIFY_FIREBASE_SETUP.md)** - API documentation
- **[MIGRATION.md](MIGRATION.md)** - What changed from Neon
- **[FIREBASE_SETUP.md](FIREBASE_SETUP.md)** - Client-side Firebase setup (French)
- **[FIREBASE_VERIFICATION.md](FIREBASE_VERIFICATION.md)** - Testing guide (French)

## ­ƒÜÇ Deployment Flow Diagram

```
Your Code (GitHub)
       Ôåô
Netlify (detects push)
       Ôåô
Install deps & build
       Ôåô
Deploy Static Files (HTML/CSS/JS)
       Ôåô
Deploy Netlify Functions (API)
       Ôåô
Functions use FIREBASE_SERVICE_ACCOUNT env var
       Ôåô
Firebase Firestore (Database)
       Ôåô
Live at: yoursite.netlify.app Ô£à
```

## ­ƒÆ░ Costs

### Free Tier Coverage
- **Netlify:** Unlimited static hosting, 125,000 function invocations/month
- **Firebase:** 50,000 reads, 20,000 writes, 1GB storage per month
- **Your shop:** Well within free tier with typical usage

### When you might need to pay
- High-traffic site with millions of users
- Large image/media storage needs
- Custom domain (already included)

## ­ƒÄë You're Ready!

Everything is configured. Next steps:

1. Ô£à Run `verify-setup.bat` or `npm install`
2. Ô£à Test with `netlify dev`
3. Ô£à Push to GitHub
4. Ô£à Deploy to Netlify (add env var)
5. Ô£à Visit your live site!

---

**Questions?** Review the documentation files listed above or check:
- [Netlify Docs](https://docs.netlify.com)
- [Firebase Docs](https://firebase.google.com/docs)
