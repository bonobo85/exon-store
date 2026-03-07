# Netlify + Firebase Setup Guide

## Overview
This project has been migrated from Neon PostgreSQL to Firebase Firestore and Firebase Authentication. It uses Netlify Functions for the backend API.

## Prerequisites
- Firebase project (already created: bonobo-store-v2)
- Netlify account and project
- Node.js and npm installed locally

## Step 1: Get Firebase Service Account Credentials

1. Go to [Firebase Console](https://console.firebase.google.com)
2. Select your project: **bonobo-store-v2**
3. Click on **⚙️ Project Settings** (gear icon)
4. Go to **Service Accounts** tab
5. Click **Generate New Private Key** button
6. Save the JSON file securely - this contains your credentials

## Step 2: Add Service Account to Netlify Environment Variables

### Option A: Using Netlify UI
1. Go to your Netlify project dashboard
2. Navigate to **Site Settings** → **Build & deploy** → **Environment**
3. Click **Edit variables**
4. Add a new variable:
   - **Key:** `FIREBASE_SERVICE_ACCOUNT`
   - **Value:** Copy and paste the entire contents of the JSON file from Step 1
5. Save

### Option B: Using Netlify CLI
```bash
# Install Netlify CLI if not already installed
npm install -g netlify-cli

# Login to Netlify
netlify login

# Set environment variable
netlify env:set FIREBASE_SERVICE_ACCOUNT "$(cat /path/to/service-account-key.json)"
```

## Step 3: Update netlify.toml (Already Done)

The redirects and function directory are already configured in `netlify.toml`:
```toml
[functions]
  directory = "netlify/functions"

[[redirects]]
  from = "/api/*"
  to = "/.netlify/functions/api"
  status = 200
```

## Step 4: Install Dependencies Locally

```bash
npm install
```

This installs:
- `firebase-admin`: Firebase Admin SDK for Netlify Functions

## Step 5: Test Locally with Netlify CLI

```bash
# Install Netlify CLI (if not done)
npm install -g netlify-cli

# Run local development server
netlify dev

# Your site will be available at http://localhost:8888
```

## Step 6: Deploy to Netlify

```bash
# Commit your changes
git add .
git commit -m "Migrate from Neon to Firebase"

# Push to your repository
git push origin main

# Netlify will automatically deploy on push
# Or manually deploy:
netlify deploy

# For production deployment:
netlify deploy --prod
```

## API Endpoints

The following endpoints are available through the Netlify Function:

### User Authentication

#### Register
```
POST /api?action=register
Content-Type: application/json

{
  "username": "string",
  "email": "string",
  "password": "string"
}

Response:
{
  "user": { userId, username, email, password, cart, wishlist, purchaseHistory, createdAt },
  "sessionToken": "string"
}
```

#### Login
```
POST /api?action=login
Content-Type: application/json

{
  "identifier": "email or username",
  "password": "string"
}

Response:
{
  "user": { userId, username, email, password, cart, wishlist, purchaseHistory, createdAt },
  "sessionToken": "string"
}
```

#### Get Session
```
GET /api?action=session&token={token}

Response:
{
  "user": { userId, username, email, password, cart, wishlist, purchaseHistory, createdAt }
}
```

#### Logout
```
POST /api?action=logout
Content-Type: application/json

{
  "sessionToken": "string"
}

Response:
{
  "success": true
}
```

### Data Management

#### Update Cart
```
POST /api?action=cart
Content-Type: application/json

{
  "sessionToken": "string",
  "cart": [ { id, name, price, quantity, ... } ]
}

Response:
{
  "success": true
}
```

#### Get All Users (Admin)
```
GET /api?action=users

Response: [ { userId, username, email, cart, purchaseHistory, ... } ]
```

#### Get Auth Logs (Admin)
```
GET /api?action=auth-logs

Response:
{
  "logs": [
    { type, identifier, success, timestamp },
    ...
  ]
}
```

#### Get Admin Stats (Admin)
```
GET /api?action=admin-stats&sessionToken={token}

Response:
{
  "summary": { totalRevenue, totalPurchases, totalMembers, activeNow },
  "purchases": [ { userId, username, email, purchaseId, total, date, promoCode }, ... ],
  "members": [ { userId, username, email, createdAt, purchaseCount }, ... ],
  "activeTimeline": [ { hour, count }, ... ]
}
```

## Firebase Structure

### Collections

#### users
```
userId (document ID)
├── userId: string
├── username: string
├── email: string
├── password: string
├── cart: array
├── wishlist: array
├── purchaseHistory: array
└── createdAt: timestamp
```

#### sessions
```
sessionToken (document ID)
├── userId: string
├── expiresAt: timestamp
└── createdAt: timestamp
```

#### authLogs
```
(auto-generated ID)
├── type: string (register, login)
├── identifier: string
├── success: boolean
└── timestamp: timestamp
```

## Troubleshooting

### "missing_database_url" error
- Check that `FIREBASE_SERVICE_ACCOUNT` environment variable is set in Netlify
- Verify the JSON content is valid and complete

### Session not persisting
- Check that sessions collection is being created in Firestore
- Verify sessionToken is being passed correctly in requests

### CORS errors
- The API already has CORS headers enabled for all origins
- Check browser console for specific error messages

### Firebase initialization fails
- Ensure the service account credentials are properly formatted as JSON
- Check that all required fields are present in the credentials

## Migration Notes

### What Changed
- **Database:** Neon PostgreSQL → Firebase Firestore
- **Backend API:** Still uses Netlify Functions (compatible endpoint)
- **Authentication:** Manual session tokens (compatible with existing UI)
- **Data Format:** SQL → Firestore documents (automatically handled by API)

### What Stayed the Same
- All frontend code remains compatible
- API endpoints unchanged
- Local storage implementation for cart and UI state
- User interface and styling

## Security Considerations

1. **Service Account Key:** Never commit the JSON key file to Git. It's only needed in Netlify environment variables.
2. **Password Storage:** Currently stores passwords in plain text (matches original). Consider hashing passwords in future updates.
3. **Session Tokens:** Auto-expire after 14 days of creation.
4. **Admin Access:** Based on email and password comparison. Should use better authentication in production.

## Next Steps

1. Deploy to Netlify
2. Test all authentication flows
3. Verify admin panel functionality
4. Monitor Firestore usage and costs
5. Set up Firestore security rules for production
6. Consider adding password hashing for security
7. Implement proper role-based access control

## Support

For issues with:
- **Firebase:** Check [Firebase Documentation](https://firebase.google.com/docs)
- **Netlify Functions:** Check [Netlify Functions Guide](https://docs.netlify.com/functions/overview/)
- **Project-specific issues:** Review the code in `netlify/functions/api.mjs`
