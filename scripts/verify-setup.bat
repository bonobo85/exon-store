@echo off
REM Netlify + Firebase Setup Verification Script for Windows

echo 🔥 Bonobo Shop - Netlify + Firebase Setup Verification
echo ======================================================
echo.

REM Check Node.js
echo ✓ Checking Node.js...
where node >nul 2>nul
if %ERRORLEVEL% EQU 0 (
    for /f "tokens=*" %%i in ('node -v') do set NODE_VERSION=%%i
    echo   ✅ Node.js is installed: %NODE_VERSION%
) else (
    echo   ❌ Node.js is NOT installed. Please install from https://nodejs.org/
    exit /b 1
)

REM Check npm
echo.
echo ✓ Checking npm...
where npm >nul 2>nul
if %ERRORLEVEL% EQU 0 (
    for /f "tokens=*" %%i in ('npm -v') do set NPM_VERSION=%%i
    echo   ✅ npm is installed: %NPM_VERSION%
) else (
    echo   ❌ npm is NOT installed. Please install Node.js with npm.
    exit /b 1
)

REM Check .env file
echo.
echo ✓ Checking .env file...
if exist ".env" (
    echo   ✅ .env file exists
    
    findstr /M "FIREBASE_SERVICE_ACCOUNT" .env >nul 2>nul
    if %ERRORLEVEL% EQU 0 (
        echo   ✅ FIREBASE_SERVICE_ACCOUNT is configured in .env
        echo   ✅ Firebase credentials appear to be configured
    ) else (
        echo   ❌ FIREBASE_SERVICE_ACCOUNT not found in .env
        exit /b 1
    )
) else (
    echo   ❌ .env file not found. Create it from .env.example
    exit /b 1
)

REM Check .gitignore
echo.
echo ✓ Checking .gitignore...
if exist ".gitignore" (
    echo   ✅ .gitignore file exists
    
    findstr /M "\.env" .gitignore >nul 2>nul
    if %ERRORLEVEL% EQU 0 (
        echo   ✅ .env is properly excluded from Git
    ) else (
        echo   ⚠️  .env is not in .gitignore
    )
) else (
    echo   ⚠️  .gitignore not found
)

REM Check package.json
echo.
echo ✓ Checking package.json...
if exist "package.json" (
    echo   ✅ package.json exists
    
    findstr /M "firebase-admin" package.json >nul 2>nul
    if %ERRORLEVEL% EQU 0 (
        echo   ✅ firebase-admin dependency is configured
    ) else (
        echo   ❌ firebase-admin not found in package.json
        exit /b 1
    )
) else (
    echo   ❌ package.json not found
    exit /b 1
)

REM Check node_modules
echo.
echo ✓ Checking node_modules...
if exist "node_modules" (
    echo   ✅ Dependencies already installed
) else (
    echo   ⚠️  Dependencies not installed. Run: npm install
)

REM Check netlify.toml
echo.
echo ✓ Checking netlify.toml...
if exist "netlify.toml" (
    echo   ✅ netlify.toml exists
    
    findstr /M "functions" netlify.toml >nul 2>nul
    if %ERRORLEVEL% EQU 0 (
        echo   ✅ Functions directory is configured
    ) else (
        echo   ⚠️  Functions configuration not found
    )
) else (
    echo   ❌ netlify.toml not found
    exit /b 1
)

REM Check API function
echo.
echo ✓ Checking API function...
if exist "netlify\functions\api.mjs" (
    echo   ✅ Netlify function exists
    
    findstr /M "firebase-admin" "netlify\functions\api.mjs" >nul 2>nul
    if %ERRORLEVEL% EQU 0 (
        echo   ✅ API is configured for Firebase
    ) else (
        echo   ⚠️  API may not be using Firebase
    )
) else (
    echo   ❌ Netlify function not found
    exit /b 1
)

REM Check Netlify CLI
echo.
echo ✓ Checking Netlify CLI...
where netlify >nul 2>nul
if %ERRORLEVEL% EQU 0 (
    for /f "tokens=*" %%i in ('netlify --version') do set NETLIFY_VERSION=%%i
    echo   ✅ Netlify CLI is installed
) else (
    echo   ⚠️  Netlify CLI not installed. Install with: npm install -g netlify-cli
)

REM Summary
echo.
echo ======================================================
echo ✅ Setup Verification Complete!
echo ======================================================
echo.
echo 📚 Next Steps:
echo    1. npm install                 (to install dependencies)
echo    2. netlify dev                 (to test locally)
echo    3. Push to Git and deploy to Netlify
echo.
echo 📖 Documentation:
echo    - NETLIFY_DEPLOY.md           (Deployment instructions)
echo    - NETLIFY_FIREBASE_SETUP.md   (Detailed setup guide)
echo    - MIGRATION.md                (Migration details)
echo.

pause
