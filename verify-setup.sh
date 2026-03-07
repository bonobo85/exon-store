#!/bin/bash

# Netlify + Firebase Setup Verification Script
# This script verifies your environment is ready for deployment

echo "🔥 Bonobo Shop - Netlify + Firebase Setup Verification"
echo "======================================================"
echo ""

# Check Node.js
echo "✓ Checking Node.js..."
if command -v node &> /dev/null; then
    NODE_VERSION=$(node -v)
    echo "  ✅ Node.js is installed: $NODE_VERSION"
else
    echo "  ❌ Node.js is NOT installed. Please install from https://nodejs.org/"
    exit 1
fi

# Check npm
echo ""
echo "✓ Checking npm..."
if command -v npm &> /dev/null; then
    NPM_VERSION=$(npm -v)
    echo "  ✅ npm is installed: $NPM_VERSION"
else
    echo "  ❌ npm is NOT installed. Please install Node.js with npm."
    exit 1
fi

# Check .env file
echo ""
echo "✓ Checking .env file..."
if [ -f ".env" ]; then
    echo "  ✅ .env file exists"
    
    # Check if FIREBASE_SERVICE_ACCOUNT is set
    if grep -q "FIREBASE_SERVICE_ACCOUNT" .env; then
        echo "  ✅ FIREBASE_SERVICE_ACCOUNT is configured in .env"
        
        # Verify JSON format
        ENV_VALUE=$(grep "FIREBASE_SERVICE_ACCOUNT=" .env | cut -d= -f2-)
        if echo "$ENV_VALUE" | grep -q '"type":"service_account"'; then
            echo "  ✅ Firebase credentials appear to be valid JSON"
        else
            echo "  ⚠️  Could not verify Firebase credentials format"
        fi
    else
        echo "  ❌ FIREBASE_SERVICE_ACCOUNT not found in .env"
        exit 1
    fi
else
    echo "  ❌ .env file not found. Create it from .env.example"
    exit 1
fi

# Check .gitignore
echo ""
echo "✓ Checking .gitignore..."
if [ -f ".gitignore" ]; then
    echo "  ✅ .gitignore file exists"
    
    if grep -q "\.env" .gitignore; then
        echo "  ✅ .env is properly excluded from Git"
    else
        echo "  ⚠️  .env is not in .gitignore (add it to prevent credential leaks)"
    fi
else
    echo "  ⚠️  .gitignore not found"
fi

# Check package.json
echo ""
echo "✓ Checking package.json..."
if [ -f "package.json" ]; then
    echo "  ✅ package.json exists"
    
    if grep -q "firebase-admin" package.json; then
        echo "  ✅ firebase-admin dependency is configured"
    else
        echo "  ❌ firebase-admin not found in package.json"
        exit 1
    fi
else
    echo "  ❌ package.json not found"
    exit 1
fi

# Check dependencies installed
echo ""
echo "✓ Checking node_modules..."
if [ -d "node_modules" ]; then
    echo "  ✅ Dependencies already installed"
else
    echo "  ⚠️  Dependencies not installed. Run: npm install"
fi

# Check netlify.toml
echo ""
echo "✓ Checking netlify.toml..."
if [ -f "netlify.toml" ]; then
    echo "  ✅ netlify.toml exists"
    
    if grep -q "functions" netlify.toml; then
        echo "  ✅ Functions directory is configured"
    else
        echo "  ⚠️  Functions configuration not found"
    fi
else
    echo "  ❌ netlify.toml not found"
    exit 1
fi

# Check API function
echo ""
echo "✓ Checking API function..."
if [ -f "netlify/functions/api.mjs" ]; then
    echo "  ✅ Netlify function exists"
    
    if grep -q "firebase-admin" netlify/functions/api.mjs; then
        echo "  ✅ API is configured for Firebase"
    else
        echo "  ⚠️  API may not be using Firebase"
    fi
else
    echo "  ❌ Netlify function not found"
    exit 1
fi

# Check Netlify CLI
echo ""
echo "✓ Checking Netlify CLI..."
if command -v netlify &> /dev/null; then
    NETLIFY_VERSION=$(netlify --version)
    echo "  ✅ Netlify CLI is installed: $NETLIFY_VERSION"
else
    echo "  ⚠️  Netlify CLI not installed. Install with: npm install -g netlify-cli"
fi

# Summary
echo ""
echo "======================================================"
echo "✅ Setup Verification Complete!"
echo "======================================================"
echo ""
echo "📚 Next Steps:"
echo "   1. npm install                 (to install dependencies)"
echo "   2. netlify dev                 (to test locally)"
echo "   3. Push to Git and deploy to Netlify"
echo ""
echo "📖 Documentation:"
echo "   - NETLIFY_DEPLOY.md           (Deployment instructions)"
echo "   - NETLIFY_FIREBASE_SETUP.md   (Detailed setup guide)"
echo "   - MIGRATION.md                (Migration details)"
echo ""
