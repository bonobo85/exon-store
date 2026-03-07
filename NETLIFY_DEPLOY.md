# Deploy to Netlify - Quick Start

## Local Setup (Already Done ✅)

Your Firebase service account credentials are now saved in `.env` file for local development.

```bash
# Install dependencies
npm install

# Test locally
netlify dev
```

The API will work locally at `http://localhost:8888/api`

## Deploy to Production 🚀

### Option 1: Deploy via Netlify UI (Recommended)

1. **Push your code to GitHub:**
   ```bash
   git add .
   git commit -m "Migrate to Firebase and Netlify"
   git push origin main
   ```

2. **Connect Netlify to your repo:**
   - Go to [Netlify Dashboard](https://app.netlify.com)
   - Click **Add new site** → **Import an existing project**
   - Select your GitHub repository
   - Click **Deploy**

3. **Add Environment Variable:**
   - Go to **Site settings** → **Build & deploy** → **Environment**
   - Click **Edit variables**
   - Add new variable:
     - **Key:** `FIREBASE_SERVICE_ACCOUNT`
     - **Value:** Copy the entire JSON from your `.env` file (it's the long JSON string)
   - Click **Save**

4. **Trigger a new deploy:**
   - Go to **Deploys**
   - Click **Trigger deploy** → **Deploy site**
   - Wait for it to complete (usually 1-2 minutes)

### Option 2: Deploy via Netlify CLI

```bash
# Install Netlify CLI if you haven't already
npm install -g netlify-cli

# Login (if not already logged in)
netlify login

# Set the environment variable
netlify env:set FIREBASE_SERVICE_ACCOUNT "$(cat .env | grep FIREBASE_SERVICE_ACCOUNT | cut -d= -f2-)"

# Deploy
netlify deploy --prod
```

## Verify Your Deployment ✅

Once deployed, test these:

1. **Registration:**
   - Open your Netlify domain
   - Click login/register
   - Fill in form and register
   - Check Firestore in Firebase Console for new user

2. **Login:**
   - Register a user
   - Log out
   - Log back in
   - Should work smoothly

3. **Cart:**
   - Add items to cart
   - Refresh page - cart should persist

4. **Admin Panel:**
   - Login with admin email: `bonobo.des.alpes@gmail.com`
   - Admin password: `zboubus85!`
   - Should see admin stats

## Troubleshooting

### "Error: FIREBASE_SERVICE_ACCOUNT is not set"
- Make sure you added the environment variable in Netlify Site Settings
- The variable name must be **exactly** `FIREBASE_SERVICE_ACCOUNT`
- The value must be the complete JSON string

### "Firebase initialization failed"
- Check that the JSON is valid (try pasting in [jsonlint.com](https://jsonlint.com))
- Verify all required fields are present in the JSON

### "User data not visible in Firestore"
- Check Firebase Console → Firestore Database
- Verify collection is named `users`
- Confirm documents are being created

## Netlify Dashboard Links

- **Deploy logs:** https://app.netlify.com/sites/YOUR_SITE_NAME/deploys
- **Function logs:** https://app.netlify.com/sites/YOUR_SITE_NAME/functions
- **Environment variables:** https://app.netlify.com/sites/YOUR_SITE_NAME/settings/build

Replace `YOUR_SITE_NAME` with your actual Netlify site name.

## Security Reminders

⚠️ **IMPORTANT:**
- The `.env` file contains your private Firebase credentials
- Never commit it to Git (it's in `.gitignore`)
- In `.github/workflows` or CI/CD, always use environment variables
- Add the credentials in Netlify's UI, not in `.toml` or code files
- Rotate your Firebase service account key periodically

## Monitoring

Once deployed:
1. Check **Netlify Functions** tab to see API call logs
2. Monitor **Firestore** quota in Firebase Console
3. Set up **Netlify alerts** for build failures
4. Review **Firebase Security Rules** for production setup

## What's Running

- **Frontend:** Static HTML/CSS/JS hosted on Netlify CDN
- **Backend:** Node.js Netlify Function at `/.netlify/functions/api`
- **Database:** Firebase Firestore (auto-scaling)
- **Auth:** Firebase native auth + custom session tokens

---

Questions? See `NETLIFY_FIREBASE_SETUP.md` for detailed documentation.
