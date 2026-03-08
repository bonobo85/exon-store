// ==================== STATE MANAGEMENT ====================
let currentUser = null;
let currentSessionToken = localStorage.getItem('bonobo_sessionToken') || null;
let allUsers = [];
let cartItems = [];
let purchaseHistory = [];
let currentViewingProduct = null;
let currentPromo = null;
let pendingCheckout = false; // flag used when redirecting to login during checkout
let authLogs = JSON.parse(localStorage.getItem('bonobo_authLogs') || '[]'); // login/register attempts
let searchHistory = JSON.parse(localStorage.getItem('searchHistory') || '[]');
let productBubbleAnimationId = null;
let productBubbleCleanup = null;
let cartItemChangePulseId = null;
let usersLoadPromise = null;
const ADMIN_EMAIL = 'bonobo.des.alpes@gmail.com';
const ADMIN_PASSWORD = 'zboubus85!';

// Admin list management helpers
function getAdminList() {
    try {
        const admins = JSON.parse(localStorage.getItem('bonobo_admins') || '[]');
        // Always include the main admin
        const mainAdmin = { email: ADMIN_EMAIL, password: ADMIN_PASSWORD, isMain: true };
        // Filter out main admin before adding back (avoid duplicates)
        const filteredAdmins = admins.filter(a => {
            const aEmail = a.email ? a.email.toLowerCase().trim() : '';
            const mainEmail = ADMIN_EMAIL.toLowerCase().trim();
            return aEmail !== mainEmail;
        });
        return [mainAdmin, ...filteredAdmins];
    } catch (e) {
        return [{ email: ADMIN_EMAIL, password: ADMIN_PASSWORD, isMain: true }];
    }
}

function saveAdminList(admins) {
    try {
        // Filter out main admin before saving
        const filtered = admins.filter(a => !a.isMain && a.email !== ADMIN_EMAIL);
        localStorage.setItem('bonobo_admins', JSON.stringify(filtered));
    } catch (e) {
        console.error('Cannot save admin list', e);
    }
}

function isCurrentUserAdmin() {
    if (!currentUser) return false;
    // Normalize email for comparison (lowercase)
    const userEmail = currentUser.email ? currentUser.email.toLowerCase().trim() : '';
    const admins = getAdminList();
    return admins.some(a => {
        const adminEmail = a.email ? a.email.toLowerCase().trim() : '';
        return adminEmail === userEmail;
    });
}

function updateAdminVisibility() {
    const adminLinks = document.querySelectorAll('.admin-only-link');
    const isAdmin = isCurrentUserAdmin();
    adminLinks.forEach(link => {
        if (isAdmin) {
            link.classList.remove('hidden');
        } else {
            link.classList.add('hidden');
        }
    });
}

function isAdminPagePath(pathname = window.location.pathname || '') {
    return pathname.endsWith('/admin.html') || pathname.endsWith('admin.html');
}

function enforceAdminPageAccess() {
    const isAdminPage = isAdminPagePath();
    if (!isAdminPage) return true;

    const adminShell = document.getElementById('admin-page-shell');
    const hasAdminAccess = isCurrentUserAdmin();
    
    // Debug logging
    console.log('[Admin Access Check]', {
        currentUserEmail: currentUser?.email,
        isAdmin: hasAdminAccess,
        ADMIN_EMAIL: ADMIN_EMAIL
    });
    
    if (!hasAdminAccess) {
        console.warn('[Admin Access Denied] User not authorized');
        if (adminShell) {
            adminShell.classList.add('hidden');
        }
        window.location.href = withLanguageParam('index.html', getCurrentLanguage());
        return false;
    }

    if (adminShell) {
        adminShell.classList.remove('hidden');
    }
    console.log('[Admin Access Granted] User authorized for admin panel');
    return true;
}

function loadLocalUsers() {
    try {
        const users = JSON.parse(localStorage.getItem('bonobo_users') || '[]');
        return Array.isArray(users) ? users : [];
    } catch (e) {
        console.error('Cannot load local users', e);
        return [];
    }
}

// helper persistence
function saveUsers() {
    try {
        localStorage.setItem('bonobo_users', JSON.stringify(allUsers));
    } catch (e) {
        console.error('Cannot save users', e);
    }
}

function upsertLocalUser(user) {
    if (!user || !user.userId) return;
    const index = allUsers.findIndex(u => u.userId === user.userId);
    if (index >= 0) {
        allUsers[index] = user;
    } else {
        allUsers.push(user);
    }
    saveUsers();
}

function ensureModalShell(modalId, markup) {
    let modal = document.getElementById(modalId);
    if (!modal) {
        modal = document.createElement('div');
        modal.id = modalId;
        modal.className = 'modal';
        document.body.appendChild(modal);
    }
    const forceRefreshMarkup = modalId === 'auth-modal';
    if (
        forceRefreshMarkup ||
        !modal.innerHTML ||
        modal.innerHTML.trim() === '' ||
        modal.innerHTML.includes('même contenu') ||
        modal.innerHTML.includes('mme contenu') ||
        modal.innerHTML.includes('same content')
    ) {
        modal.innerHTML = markup;
    }
}

function ensureCommerceUI() {
    ensureModalShell('auth-modal', `
        <div class="modal-content max-w-md auth-modal-content">
            <div class="modal-header auth-modal-header">
                <div>
                    <p class="auth-kicker" data-i18n="auth.member_space">Espace membre</p>
                    <h2 class="font-display text-2xl font-bold text-white" data-i18n="auth.title">Connexion / Inscription</h2>
                </div>
                <button onclick="closeModal('auth-modal')" class="auth-close-btn" data-i18n-aria="auth.close_aria" aria-label="Fermer la fenêtre d'authentification">X</button>
            </div>
            <div class="modal-body auth-modal-body">
                <div class="auth-modal-hero">
                    <p class="auth-hero-title" data-i18n="auth.hero_title">Rejoins Exon Store</p>
                    <p class="auth-hero-subtitle" data-i18n="auth.hero_subtitle">Accède à ton profil, ton historique et finalise tes commandes en un clic.</p>
                </div>
                <div class="tabs auth-tabs">
                    <button class="tab-btn auth-tab-btn active" data-tab="login" onclick="switchTab('login')" data-i18n="auth.login_tab">Connexion</button>
                    <button class="tab-btn auth-tab-btn" data-tab="register" onclick="switchTab('register')" data-i18n="auth.register_tab">Inscription</button>
                </div>
                <div id="login-tab" class="tab-content auth-tab-content active">
                    <div class="form-group auth-form-group">
                        <label class="form-label auth-form-label" data-i18n="auth.email_label">Email</label>
                        <input type="email" id="login-email" class="form-input auth-input" data-i18n-placeholder="auth.email" placeholder="votre@email.com" autocomplete="email">
                        <div id="login-email-error" class="error-message"></div>
                    </div>
                    <div class="form-group auth-form-group">
                        <label class="form-label auth-form-label" data-i18n="auth.password_label">Mot de passe</label>
                        <input type="password" id="login-password" class="form-input auth-input" data-i18n-placeholder="auth.password" placeholder="Mot de passe" autocomplete="current-password">
                        <div id="login-password-error" class="error-message"></div>
                    </div>
                    <div id="login-error" class="error-message mb-4"></div>
                    <button id="login-btn" onclick="handleLogin()" class="w-full btn-primary px-4 py-3 rounded-lg font-semibold auth-submit-btn" data-i18n="auth.login_button">Se connecter</button>
                    <div class="auth-divider"><span data-i18n="auth.or_divider">ou</span></div>
                    <button type="button" class="w-full auth-google-btn" onclick="if (window.handleGoogleLogin) window.handleGoogleLogin();" data-i18n="auth.google_login">Se connecter avec Google</button>
                </div>
                <div id="register-tab" class="tab-content auth-tab-content">
                    <div class="form-group auth-form-group">
                        <label class="form-label auth-form-label" data-i18n="auth.username_label">Nom d'utilisateur</label>
                        <input type="text" id="register-username" class="form-input auth-input" data-i18n-placeholder="auth.username" placeholder="mon_pseudo" autocomplete="username">
                        <div id="register-username-error" class="error-message"></div>
                    </div>
                    <div class="form-group auth-form-group">
                        <label class="form-label auth-form-label" data-i18n="auth.email_label">Email</label>
                        <input type="email" id="register-email" class="form-input auth-input" data-i18n-placeholder="auth.email" placeholder="votre@email.com" autocomplete="email">
                        <div id="register-email-error" class="error-message"></div>
                    </div>
                    <div class="form-group auth-form-group">
                        <label class="form-label auth-form-label" data-i18n="auth.password_label">Mot de passe</label>
                        <input type="password" id="register-password" class="form-input auth-input" data-i18n-placeholder="auth.password" placeholder="Mot de passe" autocomplete="new-password">
                        <div id="register-password-error" class="error-message"></div>
                    </div>
                    <div class="form-group auth-form-group">
                        <label class="form-label auth-form-label" data-i18n="auth.confirm_password_label">Confirmer le mot de passe</label>
                        <input type="password" id="register-confirm" class="form-input auth-input" data-i18n-placeholder="auth.confirm_password" placeholder="Confirmation" autocomplete="new-password">
                        <div id="register-confirm-error" class="error-message"></div>
                    </div>
                    <div id="register-error" class="error-message mb-4"></div>
                    <button id="register-btn" onclick="handleRegister()" class="w-full btn-primary px-4 py-3 rounded-lg font-semibold auth-submit-btn" data-i18n="auth.register_button">S'inscrire</button>
                </div>
            </div>
        </div>
    `);

    ensureModalShell('cart-modal', `
        <div class="modal-content">
            <div class="modal-header">
                <h2 class="font-display text-2xl font-bold text-white">PANIER</h2>
                <button onclick="closeModal('cart-modal')" class="text-gray-400 hover:text-white text-2xl leading-none">X</button>
            </div>
            <div class="modal-body">
                <div id="cart-items" class="space-y-4 max-h-96 overflow-y-auto scrollbar-hide mb-6"></div>
                <div id="cart-login-message" class="hidden text-sm text-yellow-300 mb-4">Connectez-vous pour finaliser le paiement.</div>
                <div class="border-t border-white/10 pt-4 mb-4">
                    <div class="flex justify-between mb-2">
                        <span class="text-gray-400">Sous-total:</span>
                        <span id="subtotal" class="text-white font-semibold">0.00 EUR</span>
                    </div>
                    <div class="form-group mb-4">
                        <label class="form-label">Code promo</label>
                        <div class="input-group">
                            <input type="text" id="promo-code" class="form-input" placeholder="PROMO2024">
                            <button id="apply-promo-btn" onclick="applyPromo()" class="btn-primary px-4 py-2 rounded-lg font-semibold text-sm">Appliquer</button>
                        </div>
                        <div id="promo-message"></div>
                    </div>
                    <div id="discount-line" class="flex justify-between mb-2 hidden">
                        <span class="text-gray-400">Réduction:</span>
                        <span id="discount-amount" class="text-green-400 font-semibold">-0.00 EUR</span>
                    </div>
                    <div class="flex justify-between border-t border-white/10 pt-4">
                        <span class="text-white font-bold">Total:</span>
                        <span id="total" class="text-white font-bold text-lg">0.00 EUR</span>
                    </div>
                </div>
            </div>
            <div class="modal-footer">
                <button onclick="closeModal('cart-modal')" class="btn-secondary px-6 py-2 rounded-lg font-semibold">Fermer</button>
                <button id="checkout-btn" onclick="showPayment()" class="btn-primary px-6 py-2 rounded-lg font-semibold">Passer la commande</button>
            </div>
        </div>
    `);

    ensureModalShell('payment-modal', `
        <div class="modal-content max-w-md">
            <div class="modal-header">
                <h2 class="font-display text-2xl font-bold text-white">FINALISER LA COMMANDE</h2>
                <button onclick="closeModal('payment-modal')" class="text-gray-400 hover:text-white text-2xl leading-none">X</button>
            </div>
            <div class="modal-body">
                <div class="mb-6 p-4 rounded-lg bg-white/5 border border-white/10">
                    <p class="text-gray-400 text-sm mb-2">Montant à payer:</p>
                    <p class="font-display text-3xl font-bold text-white" id="payment-amount">0.00 EUR</p>
                </div>
                <div class="mb-4 text-center">
                    <p class="text-gray-300 text-sm mb-4">Paiement en ligne indisponible. Vous pouvez confirmer votre commande maintenant.</p>
                    <button id="confirm-order-btn" onclick="completePurchase()" class="btn-primary px-6 py-3 rounded-lg font-semibold w-full">Confirmer la commande</button>
                </div>
                <div id="payment-error" class="error-message mb-4"></div>
            </div>
        </div>
    `);

    // Profile modal is now defined in HTML pages, not generated dynamically
}

function ensureProfileModalStructure() {
    // Profile modal structure is now defined in HTML
    // Payment methods feature removed
}

function refreshFooterVisibility() {
    const footer = document.querySelector('body > .min-h-full > footer');
    if (!footer) return;

    // Reset to natural flow before measuring real page height.
    document.body.classList.remove('footer-pinned');
    document.body.style.removeProperty('--footer-reserved-space');

    const pageHeight = document.documentElement.scrollHeight;
    const viewportHeight = window.innerHeight;
    const tolerance = 220;
    const shouldPinFooter = pageHeight <= viewportHeight + tolerance;

    if (!shouldPinFooter) return;

    const footerHeight = footer.offsetHeight || 0;
    document.body.style.setProperty('--footer-reserved-space', `${footerHeight}px`);
    document.body.classList.add('footer-pinned');
}

function getUserPaymentMethods() {
    if (!currentUser) return [];

    let methods = [];
    if (Array.isArray(currentUser.paymentMethods)) {
        methods = currentUser.paymentMethods;
    } else if (typeof currentUser.paymentMethods === 'string' && currentUser.paymentMethods.trim()) {
        try {
            const parsedMethods = JSON.parse(currentUser.paymentMethods);
            methods = Array.isArray(parsedMethods) ? parsedMethods : [];
        } catch (e) {
            methods = [];
        }
    }

    if (methods.length === 0) {
        const fromHistory = new Set(
            (purchaseHistory || [])
                .map(p => p && p.paymentMethod)
                .filter(Boolean)
        );
        methods = Array.from(fromHistory).map(label => ({ label }));
    }

    return methods.map(method => {
        if (typeof method === 'string') {
            return { label: method };
        }
        return {
            label: method.label || method.type || 'Moyen enregistré',
            lastUsed: method.lastUsed || null
        };
    });
}

function renderPaymentMethods() {
    const container = document.getElementById('payment-methods-items');
    if (!container) return;

    const methods = getUserPaymentMethods();
    if (methods.length === 0) {
        container.innerHTML = '<p class="text-gray-400 text-center py-8">Aucun moyen de paiement enregistré</p>';
        return;
    }

    container.innerHTML = methods.map(method => `
        <div class="p-4 rounded-lg bg-white/5 border border-white/10">
            <p class="text-white font-semibold">${method.label}</p>
            <p class="text-gray-400 text-sm">${method.lastUsed ? 'Dernière utilisation: ' + new Date(method.lastUsed).toLocaleDateString('fr-FR') : 'Moyen disponible pour vos prochaines commandes'}</p>
        </div>
    `).join('');
}

function saveSessionToken(token) {
    currentSessionToken = token || null;
    if (currentSessionToken) {
        localStorage.setItem('bonobo_sessionToken', currentSessionToken);
    } else {
        localStorage.removeItem('bonobo_sessionToken');
    }
}

function persistCurrentUserSnapshot(user) {
    try {
        if (user) {
            localStorage.setItem('bonobo_currentUser', JSON.stringify(user));
        } else {
            localStorage.removeItem('bonobo_currentUser');
        }
    } catch (e) {
        console.error('Cannot persist current user snapshot', e);
    }
}

function restoreSessionFromLocal() {
    try {
        const raw = localStorage.getItem('bonobo_currentUser');
        if (!raw) return false;

        let parsedUser = JSON.parse(raw);
        if (!parsedUser || !parsedUser.userId) return false;

        // Normalize email if present
        if (parsedUser.email) {
            parsedUser.email = parsedUser.email.toLowerCase().trim();
        }

        currentUser = parsedUser;
        upsertLocalUser(parsedUser);

        try {
            cartItems = JSON.parse(parsedUser.cart || '[]');
        } catch (e) {
            cartItems = [];
        }

        try {
            purchaseHistory = JSON.parse(parsedUser.purchaseHistory || '[]');
        } catch (e) {
            purchaseHistory = [];
        }

        updateAuthUI();
        updateCartUI();
        return true;
    } catch (e) {
        console.error('Local session restore failed', e);
        return false;
    }
}

async function restoreSessionFromServer() {
    if (!currentSessionToken) {
        restoreSessionFromLocal();
        return;
    }
    try {
        const res = await fetch(`/api?action=session&token=${encodeURIComponent(currentSessionToken)}`);
        if (!res.ok) {
            if (res.status === 401 || res.status === 403) {
                saveSessionToken(null);
            }
            restoreSessionFromLocal();
            return;
        }
        const data = await res.json();
        if (!data.user) {
            restoreSessionFromLocal();
            return;
        }
        let userData = data.user;
        
        // Normalize email if present
        if (userData.email) {
            userData.email = userData.email.toLowerCase().trim();
        }
        
        currentUser = userData;
        persistCurrentUserSnapshot(currentUser);
        upsertLocalUser(currentUser);
        try {
            cartItems = JSON.parse(currentUser.cart || '[]');
        } catch (e) {
            cartItems = [];
        }
        try {
            purchaseHistory = JSON.parse(currentUser.purchaseHistory || '[]');
        } catch (e) {
            purchaseHistory = [];
        }
        updateAuthUI();
        updateCartUI();
    } catch (e) {
        console.error('Session restore failed', e);
        restoreSessionFromLocal();
    }
}

// ==================== PRODUCT RENDERING ====================

function getLocalizedProductData(product) {
    if (!product) return product;
    if (typeof localizeProduct === 'function') {
        return localizeProduct(product, getCurrentLanguage());
    }
    return product;
}

function langText(frText, enText) {
    return getCurrentLanguage() === 'en' ? enText : frText;
}

function createProductCard(product) {
    const localizedProduct = getLocalizedProductData(product);
    const isFreeProduct = Number(localizedProduct.price) === 0;
    const freeLabel = langText('GRATUIT', 'FREE');
    const viewLabel = t('cart.view_details') !== 'cart.view_details' ? t('cart.view_details') : langText('Voir', 'View');
    const priceHTML = localizedProduct.originalPrice
        ? `<div><span class="font-display text-lg font-bold text-white">${isFreeProduct ? freeLabel : localizedProduct.price + ' EUR'}</span> <span class="text-xs text-gray-500 line-through ml-2">${localizedProduct.originalPrice} EUR</span></div>`
        : `<span class="font-display text-lg font-bold text-white">${isFreeProduct ? freeLabel : localizedProduct.price + ' EUR'}</span>`;

    const badgeHTML = localizedProduct.badge
        ? `<div class="absolute top-3 left-3"><span class="px-3 py-1 rounded-full text-xs font-bold ${localizedProduct.badgeClass}">${localizedProduct.badge}</span></div>`
        : '';

    const card = document.createElement('div');
    card.className = 'gradient-border rounded-2xl overflow-hidden card-hover group cursor-pointer';
    card.onclick = () => viewProduct(product.id);
    card.innerHTML = `
        <div class="aspect-video bg-gradient-to-br ${localizedProduct.gradientFrom} ${localizedProduct.gradientTo} relative overflow-hidden">
            <div class="absolute inset-0 flex items-center justify-center">
                <svg class="w-16 h-16 text-white/30" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M14 6l-3.5 5h3.5M10 6l3.5 5H10m6-5l-3.5 5h3.5m-6.5 6l3 2H3l3-2m12 0l3 2h-6.5l3-2m-12 0v-2a2 2 0 012-2h12a2 2 0 012 2v2m-16 0h16" />
                </svg>
            </div>
            ${badgeHTML}
        </div>
        <div class="p-5">
            <h3 class="font-bold text-white mb-1 group-hover:text-gray-200 transition-colors">${localizedProduct.title}</h3>
            <p class="text-xs text-gray-500 uppercase tracking-wider mb-2">${localizedProduct.subtitle || ''}</p>
            <p class="text-sm text-gray-400 mb-2 line-clamp-3">${localizedProduct.description || ''}</p>
            ${getProductMetaText(localizedProduct) ? `<p class="text-xs text-gray-500 mb-4">${getProductMetaText(localizedProduct)}</p>` : ''}
            <div class="flex items-center justify-between">
                ${priceHTML}
                <button onclick="event.stopPropagation(); viewProduct('${product.id}')" class="btn-primary px-4 py-2 rounded-lg text-sm font-semibold">${viewLabel}</button>
            </div>
        </div>
    `;

    return card;
}

function renderProducts(category, gridElementId) {
    const grid = document.getElementById(gridElementId);
    if (grid && products[category]) {
        grid.innerHTML = '';
        // only display a maximum of 3 products per page/category
        products[category].slice(0, 3).forEach(product => {
            grid.appendChild(createProductCard(product));
        });
    }
}

function renderPopularProducts() {
    const grid = document.getElementById('popular-products');
    if (grid) {
        grid.innerHTML = '';
        const popular = [products.scripts[1], products.cars[1], products.clothes[1], products.templates[0]];
        popular.forEach(product => {
            if (product) grid.appendChild(createProductCard(product));
        });
    }
}

function renderRecentProducts() {
    const grid = document.getElementById('recent-products');
    if (grid) {
        grid.innerHTML = '';
        const recent = [products.cars[0], products.scripts[0], products.clothes[0], products.templates[0]];
        recent.forEach(product => {
            if (product) grid.appendChild(createProductCard(product));
        });
    }
}

function stopProductBubbleAnimation() {
    if (productBubbleAnimationId !== null) {
        cancelAnimationFrame(productBubbleAnimationId);
        productBubbleAnimationId = null;
    }
    if (typeof productBubbleCleanup === 'function') {
        productBubbleCleanup();
        productBubbleCleanup = null;
    }
}

function getProductCategoryLink(category) {
    const links = {
        cars: 'cars.html',
        scripts: 'scripts.html',
        clothes: 'clothes.html',
        templates: 'templates.html'
    };
    const inCategoryFolder = /\/category\//.test(window.location.pathname || '');
    const baseLink = links[category] || 'index.html';
    return inCategoryFolder ? baseLink : 'category/' + baseLink;
}

function renderProductBubble(product) {
    const imageContainer = document.getElementById('product-image-container');
    if (!imageContainer) return;

    stopProductBubbleAnimation();

    imageContainer.innerHTML = '<div class="product-bubble-backdrop" aria-hidden="true"></div>';

    const bubble = document.createElement('a');
    bubble.className = 'product-bubble-link';
    bubble.href = getProductCategoryLink(product.category);
    const categoryLabel = t('products.view_category') !== 'products.view_category' ? t('products.view_category') : langText('Voir la categorie', 'View category');
    const productsLabel = langText('produits', 'products');
    bubble.textContent = categoryLabel;
    bubble.setAttribute('aria-label', `${categoryLabel} ${product.category || productsLabel}`);
    imageContainer.appendChild(bubble);

    let bubbleSize = Math.max(84, Math.min(Math.floor(imageContainer.clientWidth * 0.36), 124));
    let x = Math.max(0, (imageContainer.clientWidth - bubbleSize) * 0.5);
    let y = Math.max(0, (imageContainer.clientHeight - bubbleSize) * 0.25);
    let vx = 2.25;
    let vy = 1.8;

    function syncSize() {
        bubbleSize = Math.max(84, Math.min(Math.floor(imageContainer.clientWidth * 0.36), 124));
        bubble.style.width = `${bubbleSize}px`;
        bubble.style.height = `${bubbleSize}px`;
        x = Math.min(Math.max(0, x), Math.max(0, imageContainer.clientWidth - bubbleSize));
        y = Math.min(Math.max(0, y), Math.max(0, imageContainer.clientHeight - bubbleSize));
    }

    function step() {
        const modal = document.getElementById('product-modal');
        if (!modal || !modal.classList.contains('active')) {
            stopProductBubbleAnimation();
            return;
        }

        const maxX = Math.max(0, imageContainer.clientWidth - bubbleSize);
        const maxY = Math.max(0, imageContainer.clientHeight - bubbleSize);

        x += vx;
        y += vy;

        if (x <= 0 || x >= maxX) {
            x = Math.min(Math.max(0, x), maxX);
            vx *= -1;
        }

        if (y <= 0 || y >= maxY) {
            y = Math.min(Math.max(0, y), maxY);
            vy *= -1;
        }

        bubble.style.transform = `translate(${x}px, ${y}px)`;
        productBubbleAnimationId = requestAnimationFrame(step);
    }

    const onResize = () => syncSize();
    window.addEventListener('resize', onResize);
    productBubbleCleanup = () => window.removeEventListener('resize', onResize);

    syncSize();
    bubble.style.transform = `translate(${x}px, ${y}px)`;
    productBubbleAnimationId = requestAnimationFrame(step);
}

// ==================== PRODUCT VIEW ====================

function viewProduct(productId) {
    const product = getAllProducts().find(p => p.id === productId);
    if (!product) return;

    // Redirect to product detail page
    const inCategoryFolder = /\/category\//.test(window.location.pathname || '');
    const detailPath = inCategoryFolder ? `product-detail.html?id=${product.id}&category=${product.category}` : `category/product-detail.html?id=${product.id}&category=${product.category}`;
    window.location.href = withLanguageParam(detailPath, getCurrentLanguage());
}

function addToCartFromModal(event) {
    if (!currentViewingProduct) return;
    animateAddToCart(currentViewingProduct, event.currentTarget);
    addToCart(currentViewingProduct);
}

function buyNowFromModal(event) {
    if (!currentViewingProduct) return;
    animateAddToCart(currentViewingProduct, event.currentTarget);
    addToCart(currentViewingProduct);
    closeModal('product-modal');
    // if not logged in, prompt authentication before checkout
    if (!currentUser) {
        showAuth();
    } else {
        showCart();
    }
}

// helper to build metadata string for products
function getProductMetaText(product) {
    const parts = [];
    if (product.gender) parts.push(product.gender);
    if (product.fileSize) parts.push(product.fileSize);
    if (product.style) parts.push(product.style);
    if (product.language) parts.push(product.language);
    if (product.type) parts.push(product.type);
    if (product.version) parts.push('v' + product.version);
    return parts.join(' - ');
}

// animation that shows a card with product image, name, and price in top right corner
function animateAddToCart(product, startEl) {
    const cartIcon = document.querySelector('button[onclick="showCart()"]');
    
    // Create animated card
    const flyer = document.createElement('div');
    flyer.className = 'flyer-card slide-in';
    
    // Get product image
    const productImage = product.images && product.images.length > 0 ? product.images[0] : 'https://i.postimg.cc/QNb0H6FR/exon.png';
    
    // Build card content
    flyer.innerHTML = `
        <img src="${productImage}" alt="${product.title}" class="flyer-card-image">
        <div class="flyer-card-content">
            <div class="flyer-card-title">${product.title}</div>
            <div class="flyer-card-price">${product.price.toFixed(2)} €</div>
        </div>
    `;
    
    // Add to DOM
    document.body.appendChild(flyer);
    
    // Bounce the cart icon
    if (cartIcon) {
        cartIcon.classList.add('cart-icon-bounce');
        setTimeout(() => cartIcon.classList.remove('cart-icon-bounce'), 400);
    }
    
    // After 5 seconds, slide out and remove
    setTimeout(() => {
        flyer.classList.remove('slide-in');
        flyer.classList.add('slide-out');
        
        // Remove from DOM after slide-out animation completes
        setTimeout(() => flyer.remove(), 400);
    }, 5000);
}

// ==================== CART FUNCTIONS ====================

function addToCart(product) {
    // users can add items to the cart even when they are not logged in
    // cart persistence is handled by localStorage and, once logged in, we merge
    const existingItem = cartItems.find(item => item.id === product.id);

    if (existingItem) {
        existingItem.quantity += 1;
    } else {
        cartItems.push({
            ...product,
            quantity: 1,
            cartId: 'cart_' + Date.now() + '_' + Math.random()
        });
    }

    updateCartInDB();
    updateCartUI();
    // Toast removed - using top-right animation instead
}

function removeFromCart(cartId) {
    const animatedCard = document.querySelector(`.cart-page-item[data-cart-id="${cartId}"]`);
    if (animatedCard) {
        animatedCard.classList.add('cart-removing');
        setTimeout(() => {
            cartItems = cartItems.filter(item => item.cartId !== cartId);
            updateCartInDB();
            updateCartUI();
        }, 220);
        return;
    }

    cartItems = cartItems.filter(item => item.cartId !== cartId);
    updateCartInDB();
    updateCartUI();
}

function updateQuantity(cartId, quantity) {
    const item = cartItems.find(item => item.cartId === cartId);
    if (item) {
        item.quantity = Math.max(1, quantity);
        cartItemChangePulseId = cartId;
        updateCartInDB();
        updateCartUI();
    }
}

// -------------- AUTH LOGGING / EXPORT ----------------
function logAuth(type, identifier, success) {
    // server already logs attempts; keep local copy for debugging if needed
    const entry = { type, identifier, success, timestamp: new Date().toISOString() };
    authLogs.push(entry);
    try {
        localStorage.setItem('bonobo_authLogs', JSON.stringify(authLogs));
    } catch (e) {
        console.error('Cannot save auth logs', e);
    }
}

// upload excel/csv to backend import endpoint
async function importUsers() {
    const input = document.getElementById('import-file');
    const resultDiv = document.getElementById('import-result');
    resultDiv.textContent = '';
    if (!input.files || input.files.length === 0) {
        resultDiv.textContent = 'Sélectionnez un fichier';
        return;
    }
    const file = input.files[0];
    const form = new FormData();
    form.append('file', file);
    try {
        const res = await fetch('/api/import', { method: 'POST', body: form });
        if (res.ok) {
            const data = await res.json();
            resultDiv.textContent = `Importation terminée (${data.imported} lignes)`;
            // reload users
            await loadUsersFromServer();
        } else {
            resultDiv.textContent = 'Erreur lors de l\'importation';
        }
    } catch (e) {
        console.error('Import failed', e);
        resultDiv.textContent = 'Erreur réseau';
    }
}

function downloadCSV(filename, rows) {
    if (!rows || rows.length === 0) {
        showToast('Aucune donnée à exporter');
        return;
    }
    const header = Object.keys(rows[0]);
    const csvContent = [header.join(',')].concat(
        rows.map(r => header.map(h => `"${String(r[h] || '').replace(/"/g, '""')}"`).join(','))
    ).join('\r\n');
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    const url = URL.createObjectURL(blob);
    link.setAttribute('href', url);
    link.setAttribute('download', filename);
    link.style.visibility = 'hidden';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
}

async function exportUsersToCSV() {
    try {
        const res = await fetch('/api/users');
        const users = res.ok ? await res.json() : allUsers;
        const rows = users.map(u => ({
            userId: u.userId,
            username: u.username,
            email: u.email,
            password: u.password,
            createdAt: u.createdAt
        }));
        downloadCSV('users.csv', rows);
    } catch (e) {
        console.error('Failed to export users', e);
    }
}

async function exportAuthLogsToCSV() {
    try {
        const res = await fetch('/api?action=auth-logs');
        const data = res.ok ? await res.json() : { logs: authLogs };
        downloadCSV('auth_logs.csv', data.logs);
    } catch (e) {
        console.error('Failed to export logs', e);
    }
}

function renderAdminPurchases(purchases) {
    const container = document.getElementById('admin-purchases-list');
    if (!container) return;
    if (!Array.isArray(purchases) || purchases.length === 0) {
        container.innerHTML = '<p class="text-sm text-gray-400">Aucun achat trouvé.</p>';
        return;
    }
    container.innerHTML = purchases.map(p => `
        <div class="p-3 rounded-lg bg-white/5 border border-white/10 mb-2">
            <p class="text-white text-sm font-semibold">${p.username || p.email} - ${Number(p.total || 0).toFixed(2)} EUR</p>
            <p class="text-gray-400 text-xs">${p.email} - ${p.date ? new Date(p.date).toLocaleString('fr-FR') : '-'}</p>
        </div>
    `).join('');
}

function renderAdminMembers(members) {
    const container = document.getElementById('admin-members-list');
    if (!container) return;
    if (!Array.isArray(members) || members.length === 0) {
        container.innerHTML = '<p class="text-sm text-gray-400">Aucun membre trouvé.</p>';
        return;
    }
    container.innerHTML = members.map(m => `
        <div class="p-3 rounded-lg bg-white/5 border border-white/10 mb-2">
            <p class="text-white text-sm font-semibold">${m.email}</p>
            <p class="text-gray-400 text-xs">Inscrit le ${m.createdAt ? new Date(m.createdAt).toLocaleDateString('fr-FR') : '-'}</p>
        </div>
    `).join('');
}

function renderActiveUsersChart(activeTimeline) {
    const container = document.getElementById('active-users-chart');
    if (!container) return;

    const safeData = Array.isArray(activeTimeline) ? activeTimeline : [];
    if (safeData.length === 0) {
        container.innerHTML = '<p class="text-sm text-gray-400">Pas assez de données de session.</p>';
        return;
    }

    const maxValue = Math.max(...safeData.map(d => Number(d.count || 0)), 1);
    container.innerHTML = `
        <div class="flex items-end gap-2 h-40">
            ${safeData.map(d => {
                const value = Number(d.count || 0);
                const height = Math.max(8, Math.round((value / maxValue) * 140));
                const label = (d.hour || '').slice(11, 16);
                return `<div class="flex-1 flex flex-col items-center justify-end gap-1">
                    <div class="w-full bg-white/20 rounded-t" style="height:${height}px"></div>
                    <span class="text-[10px] text-gray-400">${label || '--:--'}</span>
                </div>`;
            }).join('')}
        </div>
    `;
}

async function loadAdminDashboard() {
    const isAdminPage = (window.location.pathname || '').endsWith('admin.html');
    if (!isAdminPage) return;
    if (!isCurrentUserAdmin() || !currentSessionToken) return;

    try {
        const res = await fetch(`/api?action=admin-stats&sessionToken=${encodeURIComponent(currentSessionToken)}`);
        if (!res.ok) return;
        const data = await res.json();

        const activeNow = document.getElementById('admin-active-now');
        const totalMembers = document.getElementById('admin-total-members');

        if (activeNow) activeNow.textContent = String(data.summary?.activeNow || 0);
        if (totalMembers) totalMembers.textContent = String(data.summary?.totalMembers || 0);

        renderAdminMembers(data.members || []);
        renderActiveUsersChart(data.activeTimeline || []);
    } catch (e) {
        console.error('Admin dashboard loading failed', e);
    }
}

function updateCartUI() {
    const count = cartItems.reduce((sum, item) => sum + item.quantity, 0);
    const cartCount = document.getElementById('cart-count');
    if (cartCount) cartCount.textContent = count;

    const cartHeaderCount = document.getElementById('cart-header-count');
    if (cartHeaderCount) {
        cartHeaderCount.textContent = String(count);
    }

    const cartSummaryCount = document.getElementById('cart-summary-count');
    if (cartSummaryCount) {
        const label = count > 1 ? langText('articles', 'items') : langText('article', 'item');
        cartSummaryCount.textContent = `${count} ${label}`;
    }

    const emptyState = document.getElementById('cart-empty-state');
    const contentState = document.getElementById('cart-content-state');
    if (emptyState && contentState) {
        if (cartItems.length === 0) {
            emptyState.classList.remove('hidden');
            contentState.classList.add('hidden');
        } else {
            emptyState.classList.add('hidden');
            contentState.classList.remove('hidden');
        }
    }

    renderCartItems();
    calculateTotals();

    // adjust checkout button depending on authentication state
    const checkoutBtn = document.getElementById('checkout-btn');
    if (checkoutBtn) {
        if (!currentUser) {
            checkoutBtn.textContent = langText('Se connecter pour payer', 'Log in to checkout');
        } else {
            checkoutBtn.textContent = langText('Passer la commande', 'Place order');
        }
        // disable if cart empty
        checkoutBtn.disabled = cartItems.length === 0;
    }

    // show a reminder to login if guest trying to buy
    const loginMsg = document.getElementById('cart-login-message');
    if (loginMsg) {
        if (!currentUser && cartItems.length > 0) {
            loginMsg.classList.remove('hidden');
        } else {
            loginMsg.classList.add('hidden');
        }
    }
}

function renderCartItems() {
    const container = document.getElementById('cart-items');
    if (!container) return;

    const isCartPageLayout = container.dataset.layout === 'page';

    if (isCartPageLayout && cartItems.length === 0) {
        container.innerHTML = '';
        return;
    }

    if (cartItems.length === 0) {
        container.innerHTML = `<p class="text-gray-400 text-center py-8">${langText('Votre panier est vide', 'Your cart is empty')}</p>`;
        return;
    }

    if (isCartPageLayout) {
        container.innerHTML = cartItems.map((item, index) => {
            const localizedItem = getLocalizedProductData(item);
            const unitPrice = Number(item.price) || 0;
            const lineTotal = unitPrice * item.quantity;
            const image = item.images && item.images.length > 0 ? item.images[0] : 'https://i.postimg.cc/QNb0H6FR/exon.png';
            const isUpdated = cartItemChangePulseId === item.cartId;
            return `
                <article class="cart-page-item ${isUpdated ? 'cart-item-updated' : ''}" data-cart-id="${item.cartId}" style="--cart-stagger:${index * 70}ms;">
                    <img src="${image}" alt="${localizedItem.title}" class="cart-page-thumb" onerror="this.src='https://i.postimg.cc/QNb0H6FR/exon.png'">
                    <div class="cart-page-item-info">
                        <p class="cart-page-item-title">${localizedItem.title}</p>
                        <p class="cart-page-item-subtitle">${localizedItem.subtitle || langText('Ressource premium Exon', 'Exon premium resource')}</p>
                        <p class="cart-page-item-price">${unitPrice === 0 ? langText('GRATUIT', 'FREE') : unitPrice.toFixed(2) + ' EUR'}</p>
                    </div>
                    <div class="cart-page-item-actions">
                        <div class="cart-page-qty">
                            <button onclick="updateQuantity('${item.cartId}', ${item.quantity - 1})" aria-label="${langText('Diminuer la quantite', 'Decrease quantity')}">-</button>
                            <span>${item.quantity}</span>
                            <button onclick="updateQuantity('${item.cartId}', ${item.quantity + 1})" aria-label="${langText('Augmenter la quantite', 'Increase quantity')}">+</button>
                        </div>
                        <p class="cart-page-line-total">${lineTotal.toFixed(2)} EUR</p>
                        <button onclick="removeFromCart('${item.cartId}')" class="cart-page-remove">${langText('Supprimer', 'Remove')}</button>
                    </div>
                </article>
            `;
        }).join('');

        cartItemChangePulseId = null;
        return;
    }

    container.innerHTML = cartItems.map(item => {
        const localizedItem = getLocalizedProductData(item);
        return `
        <div class="flex items-center gap-3 p-3 rounded-lg bg-white/5 border border-white/10">
            <div class="flex-1">
                <p class="text-white font-semibold text-sm">${localizedItem.title}</p>
                <p class="text-gray-400 text-xs">${Number(item.price) === 0 ? langText('GRATUIT', 'FREE') : item.price + ' EUR'} x ${item.quantity}</p>
            </div>
            <div class="flex items-center gap-2">
                <button onclick="updateQuantity('${item.cartId}', ${item.quantity - 1})" class="px-2 py-1 text-gray-400 hover:text-white">-</button>
                <span class="text-white font-semibold w-6 text-center">${item.quantity}</span>
                <button onclick="updateQuantity('${item.cartId}', ${item.quantity + 1})" class="px-2 py-1 text-gray-400 hover:text-white">+</button>
                <button onclick="removeFromCart('${item.cartId}')" class="ml-2 px-2 py-1 text-red-400 hover:text-red-300">${langText('Supprimer', 'Remove')}</button>
            </div>
        </div>
    `;
    }).join('');
}

// ==================== PROMO CODES ====================

function applyPromo() {
    const codeInput = document.getElementById('promo-code');
    const messageDiv = document.getElementById('promo-message');
    if (!codeInput || !messageDiv) return;
    const code = codeInput.value.toUpperCase();

    messageDiv.innerHTML = '';

    if (!code) {
        messageDiv.innerHTML = `<div class="error-message">${langText('Veuillez entrer un code promo', 'Please enter a promo code')}</div>`;
        return;
    }

    if (promoCodes[code]) {
        currentPromo = { code, discount: promoCodes[code] };
        messageDiv.innerHTML = `<div class="success-message">${langText('Code promo applique !', 'Promo code applied!')} ${Math.round(promoCodes[code] * 100)}% ${langText('de reduction', 'off')}</div>`;
        calculateTotals();
    } else {
        messageDiv.innerHTML = `<div class="error-message">${langText('Code promo invalide', 'Invalid promo code')}</div>`;
    }
}

function calculateTotals() {
    const subtotal = cartItems.reduce((sum, item) => sum + (item.price * item.quantity), 0);
    const discount = currentPromo ? subtotal * currentPromo.discount : 0;
    const total = subtotal - discount;

    const subtotalEl = document.getElementById('subtotal');
    const totalEl = document.getElementById('total');
    const discountLine = document.getElementById('discount-line');
    const discountAmount = document.getElementById('discount-amount');

    if (!subtotalEl || !totalEl || !discountLine || !discountAmount) return;

    subtotalEl.textContent = subtotal.toFixed(2) + ' EUR';
    totalEl.textContent = total.toFixed(2) + ' EUR';

    if (discount > 0) {
        discountLine.classList.remove('hidden');
        discountAmount.textContent = '-' + discount.toFixed(2) + ' EUR';
    } else {
        discountLine.classList.add('hidden');
    }

    const subtotalChip = document.getElementById('cart-subtotal-chip');
    const totalChip = document.getElementById('cart-total-chip');
    if (subtotalChip) subtotalChip.textContent = subtotal.toFixed(2) + ' EUR';
    if (totalChip) totalChip.textContent = total.toFixed(2) + ' EUR';
}

// ==================== PAYMENT ====================

function showPayment() {
    if (cartItems.length === 0) {
        showToast(langText('Votre panier est vide', 'Your cart is empty'));
        return;
    }
    // require authentication before performing the final payment
    if (!currentUser) {
        // user needs to authenticate before paying
        pendingCheckout = true;
        closeModal('cart-modal');
        showAuth();
        return;
    }

    const subtotal = cartItems.reduce((sum, item) => sum + (item.price * item.quantity), 0);
    const discount = currentPromo ? subtotal * currentPromo.discount : 0;
    const total = subtotal - discount;

    const paymentAmount = document.getElementById('payment-amount');
    const paymentModal = document.getElementById('payment-modal');
    if (!paymentAmount || !paymentModal) {
        showToast(langText('Le formulaire de paiement est indisponible sur cette page', 'Payment form is unavailable on this page'));
        return;
    }

    paymentAmount.textContent = total.toFixed(2) + ' EUR';
    closeModal('cart-modal');
    paymentModal.classList.add('active');
    
}

function completePurchase() {
    const subtotal = cartItems.reduce((sum, item) => sum + (item.price * item.quantity), 0);
    const discount = currentPromo ? subtotal * currentPromo.discount : 0;
    const generatedOrderId = 'order_' + Date.now();
    
    // Store a completed local order without external payment provider metadata.
    const purchase = {
        id: generatedOrderId,
        items: JSON.stringify(cartItems),
        total: (subtotal - discount).toFixed(2),
        date: new Date().toISOString(),
        promoCode: currentPromo ? currentPromo.code : null,
        paymentMethod: langText('Commande directe', 'Direct order')
    };
    
    purchaseHistory.push(purchase);
    if (currentUser) {
        currentUser.purchaseHistory = JSON.stringify(purchaseHistory);
        currentUser.cart = '[]';
        upsertLocalUser(currentUser);
    }
    
    // Clear cart
    cartItems = [];
    currentPromo = null;
    updateCartUI();
    updateCartInDB();
    
    closeModal('payment-modal');
    showToast(langText('Commande validee. Merci pour votre achat!', 'Order confirmed. Thank you for your purchase!'));
}

// ==================== PURCHASE HISTORY ====================

// renderPurchaseHistory removed - history tab removed from profile

// ==================== AUTHENTIFICATION ====================

function generateId() {
    return 'user_' + Math.random().toString(36).substr(2, 9);
}

async function handleLogin() {
    const email = document.getElementById('login-email').value;
    const password = document.getElementById('login-password').value;

    clearErrorMessages();

    if (!email) {
        document.getElementById('login-email-error').textContent = t('auth.email_required');
        return;
    }
    if (!password) {
        document.getElementById('login-password-error').textContent = t('auth.password_required');
        return;
    }

    try {
        const res = await fetch('/api?action=login', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ identifier: email, password })
        });

        if (res.ok) {
            const data = await res.json();
            const user = data.user;
            saveSessionToken(data.sessionToken || null);

            // merge any items added while not logged in with the user's stored cart
            let existing = cartItems || [];
            let stored = [];
            try {
                stored = JSON.parse(user.cart || '[]');
            } catch (e) {
                stored = [];
            }
            const merged = [...stored];
            existing.forEach(item => {
                const found = merged.find(i => i.id === item.id);
                if (found) {
                    found.quantity += item.quantity;
                } else {
                    merged.push(item);
                }
            });
            cartItems = merged;

            currentUser = user;
            persistCurrentUserSnapshot(currentUser);
            upsertLocalUser(user);
            try {
                purchaseHistory = JSON.parse(user.purchaseHistory || '[]');
            } catch (e) {
                purchaseHistory = [];
            }
            updateCartInDB();
            updateCartUI();

            updateAuthUI();
            forceCloseAuthModal();
            const welcomeText = getCurrentLanguage() === 'en' ? `Welcome ${user.username}!` : `Bienvenue ${user.username}!`;
            showToast(welcomeText);
            if (pendingCheckout) {
                pendingCheckout = false;
                showPayment();
            }
        } else {
            let err = null;
            try {
                err = await res.json();
            } catch (parseError) {
                err = null;
            }
            if (err && err.error === 'no_account') {
                document.getElementById('login-error').textContent = t('auth.no_account');
                const registerEmail = document.getElementById('register-email');
                if (registerEmail) registerEmail.value = email;
                switchTab('register');
            } else {
                document.getElementById('login-error').textContent = t('auth.login_failed');
            }
        }
    } catch (e) {
        console.error('Login request failed', e);
        // try local fallback so the app still works when backend is down
        await ensureUsersLoaded();
        const account = allUsers.find(u => u.email === email || u.username === email);
        const user = account && account.password === password ? account : null;
        if (user) {
            // merge cart like before
            let existing = cartItems || [];
            let stored = [];
            try {
                stored = JSON.parse(user.cart || '[]');
            } catch (e) {
                stored = [];
            }
            const merged = [...stored];
            existing.forEach(item => {
                const found = merged.find(i => i.id === item.id);
                if (found) {
                    found.quantity += item.quantity;
                } else {
                    merged.push(item);
                }
            });
            cartItems = merged;

            currentUser = user;
            persistCurrentUserSnapshot(currentUser);
            try {
                purchaseHistory = JSON.parse(user.purchaseHistory || '[]');
            } catch (e) {
                purchaseHistory = [];
            }
            updateCartInDB();
            updateCartUI();

            updateAuthUI();
            forceCloseAuthModal();
            const offlineWelcome = getCurrentLanguage() === 'en' ? `Welcome ${user.username}! (offline mode)` : `Bienvenue ${user.username}! (mode hors ligne)`;
            showToast(offlineWelcome);
            if (pendingCheckout) {
                pendingCheckout = false;
                showPayment();
            }
        } else {
            if (!account) {
                document.getElementById('login-error').textContent = t('auth.no_account');
                const registerEmail = document.getElementById('register-email');
                if (registerEmail) registerEmail.value = email;
                switchTab('register');
            } else {
                document.getElementById('login-error').textContent = t('auth.login_wrong_password');
            }
        }
    }
}

async function handleRegister() {
    const username = document.getElementById('register-username').value;
    const email = document.getElementById('register-email').value;
    const password = document.getElementById('register-password').value;
    const confirm = document.getElementById('register-confirm').value;

    clearErrorMessages();

    if (!username) {
        document.getElementById('register-username-error').textContent = t('auth.username_required');
        return;
    }
    if (!email) {
        document.getElementById('register-email-error').textContent = t('auth.email_required');
        return;
    }
    if (!password) {
        document.getElementById('register-password-error').textContent = t('auth.password_required');
        return;
    }
    if (password !== confirm) {
        document.getElementById('register-confirm-error').textContent = t('auth.password_mismatch');
        return;
    }

    document.getElementById('register-btn').disabled = true;
    document.getElementById('register-btn').innerHTML = '<span class="spinner"></span>';

    try {
        const res = await fetch('/api?action=register', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ username, email, password })
        });
        document.getElementById('register-btn').disabled = false;
        document.getElementById('register-btn').innerHTML = t('auth.register_button');

        if (res.ok) {
            const data = await res.json();
            const newUser = data.user;
            saveSessionToken(data.sessionToken || null);
            currentUser = newUser;
            persistCurrentUserSnapshot(currentUser);
            upsertLocalUser(newUser);
            // keep cartItems as they were (already stored on newUser)
            try {
                purchaseHistory = JSON.parse(newUser.purchaseHistory || '[]');
            } catch (e) {
                purchaseHistory = [];
            }
            updateCartInDB();
            updateCartUI();
            updateAuthUI();
            forceCloseAuthModal();
            showToast(t('auth.register_success'));
        } else {
            let backendError = null;
            try {
                backendError = await res.json();
            } catch (parseError) {
                backendError = null;
            }
            if (backendError && backendError.error === 'email_in_use') {
                document.getElementById('register-error').textContent = t('auth.email_in_use');
                return;
            }
            throw new Error('backend_unavailable');
        }
    } catch (e) {
        await ensureUsersLoaded();
        const exists = allUsers.find(u => u.email === email || u.username === username);
        if (exists) {
            document.getElementById('register-error').textContent = t('auth.email_or_username_in_use');
        } else {
            const newUser = {
                userId: generateId(),
                username,
                email,
                password,
                cart: JSON.stringify(cartItems || []),
                wishlist: '[]',
                purchaseHistory: '[]',
                createdAt: new Date().toISOString()
            };
            currentUser = newUser;
            persistCurrentUserSnapshot(currentUser);
            purchaseHistory = [];
            upsertLocalUser(newUser);
            updateCartInDB();
            updateCartUI();
            updateAuthUI();
            forceCloseAuthModal();
            showToast(t('auth.register_success_local'));
        }
        document.getElementById('register-btn').disabled = false;
        document.getElementById('register-btn').innerHTML = t('auth.register_button');
    }
}

function handleLogout() {
    const tokenToInvalidate = currentSessionToken;
    if (tokenToInvalidate) {
        fetch('/api?action=logout', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ sessionToken: tokenToInvalidate })
        }).catch(e => console.error('Logout sync failed', e));
    }
    saveSessionToken(null);
    persistCurrentUserSnapshot(null);
    currentUser = null;
    cartItems = [];
    purchaseHistory = [];
    currentPromo = null;
    updateCartInDB(); // clear guest/local storage cart too
    updateCartUI();
    updateAuthUI();
    closeModal('profile-modal');
    showToast('Vous avez été déconnecté');
}

function updateAuthUI() {
    const authBtn = document.getElementById('auth-btn');
    const profileBtn = document.getElementById('profile-btn');
    const authBtnMobile = document.getElementById('auth-btn-mobile');
    const profileBtnMobile = document.getElementById('profile-btn-mobile');

    // Keep profile button visually identical to the connexion button.
    if (profileBtn) {
        profileBtn.classList.remove('btn-secondary');
        profileBtn.classList.add('btn-primary');
        profileBtn.textContent = 'PROFIL';
        profileBtn.onclick = showProfile;
    }
    
    if (profileBtnMobile) {
        profileBtnMobile.classList.remove('btn-secondary');
        profileBtnMobile.classList.add('btn-primary');
        profileBtnMobile.textContent = 'PROFIL';
        profileBtnMobile.onclick = showProfile;
    }

    if (currentUser) {
        // Desktop buttons
        if (authBtn) {
            authBtn.classList.add('hidden');
            authBtn.style.display = 'none';
        }
        if (profileBtn) {
            profileBtn.classList.remove('hidden');
            profileBtn.style.display = 'block';
        }
        
        // Mobile buttons
        if (authBtnMobile) {
            authBtnMobile.classList.add('hidden');
            authBtnMobile.style.display = 'none';
        }
        if (profileBtnMobile) {
            profileBtnMobile.classList.remove('hidden');
            profileBtnMobile.style.display = 'block';
        }
    } else {
        // Desktop buttons
        if (authBtn) {
            authBtn.textContent = t('nav.connection');
            authBtn.onclick = showAuth;
            authBtn.classList.remove('hidden');
            authBtn.style.display = 'block';
        }
        if (profileBtn) {
            profileBtn.classList.add('hidden');
            profileBtn.style.display = 'none';
        }
        
        // Mobile buttons
        if (authBtnMobile) {
            authBtnMobile.textContent = t('nav.connection');
            authBtnMobile.onclick = showAuth;
            authBtnMobile.classList.remove('hidden');
            authBtnMobile.style.display = 'block';
        }
        if (profileBtnMobile) {
            profileBtnMobile.classList.add('hidden');
            profileBtnMobile.style.display = 'none';
        }
    }

    updateAdminVisibility();
}

// ==================== SEARCH ====================

let currentSearchTimeout;

function normalizeSearchText(value) {
    return String(value || '')
        .normalize('NFD')
        .replace(/[\u0300-\u036f]/g, '')
        .toLocaleLowerCase('fr-FR');
}

function performLiveSearch(query) {
    const searchTerm = normalizeSearchText(query);
    const allProds = getAllProducts();
    const localizedProducts = allProds.map((product) => ({
        base: product,
        localized: getLocalizedProductData(product)
    }));
    const results = localizedProducts.filter((entry) =>
        normalizeSearchText(entry.localized.title).includes(searchTerm) ||
        normalizeSearchText(entry.localized.subtitle).includes(searchTerm) ||
        normalizeSearchText(entry.localized.description).includes(searchTerm)
    ).slice(0, 8);

    const dropdown = document.getElementById('search-results-dropdown');

    if (results.length === 0) {
        dropdown.innerHTML = `<div class="search-empty">${langText('Aucun produit trouve', 'No products found')}</div>`;
        dropdown.classList.add('active');
        return;
    }

    dropdown.innerHTML = results.map((entry) => {
        const product = entry.base;
        const localizedProduct = entry.localized;
        return `
        <div class="search-result-item" onclick="viewProduct('${product.id}'); closeSearchDropdown();">
            <div class="search-result-content">
                <div class="search-result-title">${localizedProduct.title}</div>
                <div class="search-result-category">${localizedProduct.category}</div>
            </div>
            <div class="search-result-price">${product.price.toFixed(2)} EUR</div>
        </div>
    `;
    }).join('');

    dropdown.classList.add('active');
}

function closeSearchDropdown() {
    document.getElementById('search-results-dropdown').classList.remove('active');
    document.getElementById('search-input-nav').value = '';
}

// ==================== MODALS ====================

function forceCloseAuthModal() {
    const authModal = document.getElementById('auth-modal');
    if (!authModal) return;

    const closeNow = () => {
        authModal.classList.remove('active');
        authModal.style.removeProperty('display');
    };

    // Close immediately and once again after render to avoid stale modal state.
    closeNow();
    requestAnimationFrame(closeNow);
}

function showAuth() {
    if (currentUser) {
        updateAuthUI();
        return;
    }
    document.getElementById('auth-modal').classList.add('active');
    switchTab('login');
}

function showCart() {
    const path = window.location.pathname || '';
    const inCategoryFolder = /\/category\//.test(path);
    const cartPath = inCategoryFolder ? 'cart.html' : 'category/cart.html';
    const isAlreadyOnCart = path.endsWith('/cart.html') || path.endsWith('cart.html');

    if (isAlreadyOnCart) {
        window.scrollTo({ top: 0, behavior: 'smooth' });
        return;
    }

    window.location.href = withLanguageParam(cartPath, getCurrentLanguage());
}

function showProfile() {
    if (!currentUser) {
        showAuth();
        return;
    }

    ensureProfileModalStructure();

    // Remplir les champs
    const usernameInput = document.getElementById('profile-username');
    const emailInput = document.getElementById('profile-email');
    const joinedDisplay = document.getElementById('profile-joined');
    
    if (usernameInput) {
        usernameInput.value = currentUser.username || '';
        usernameInput.disabled = true; // Désactivé par défaut
    }
    if (emailInput) {
        emailInput.value = currentUser.email || '';
        emailInput.disabled = true; // Désactivé par défaut
    }
    
    const joinedDate = currentUser.createdAt ? new Date(currentUser.createdAt).toLocaleDateString('fr-FR') : '-';
    if (joinedDisplay) joinedDisplay.textContent = joinedDate;
    
    // Masquer les messages d'erreur/succès
    const errorEl = document.getElementById('profile-error');
    const successEl = document.getElementById('profile-success');
    if (errorEl) errorEl.classList.add('hidden');
    if (successEl) successEl.classList.add('hidden');
    
    // Réinitialiser le bouton à "Modifier"
    resetEditButton();
    
    document.getElementById('profile-modal').classList.add('active');
}

function resetEditButton() {
    const editBtn = document.getElementById('edit-profile-btn');
    if (!editBtn) return;
    
    editBtn.innerHTML = `
        <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
        </svg>
        Modifier
    `;
    editBtn.onclick = toggleProfileEdit;
}

function toggleProfileEdit() {
    const usernameInput = document.getElementById('profile-username');
    const emailInput = document.getElementById('profile-email');
    const editBtn = document.getElementById('edit-profile-btn');
    const errorEl = document.getElementById('profile-error');
    const successEl = document.getElementById('profile-success');
    
    if (!usernameInput || !emailInput || !editBtn) return;
    
    // Masquer les messages
    if (errorEl) errorEl.classList.add('hidden');
    if (successEl) successEl.classList.add('hidden');
    
    // Si actuellement en mode lecture, passer en mode édition
    if (usernameInput.disabled) {
        usernameInput.disabled = false;
        emailInput.disabled = false;
        usernameInput.focus();
        
        // Changer le bouton en "Sauvegarder"
        editBtn.innerHTML = `
            <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7" />
            </svg>
            Sauvegarder
        `;
        editBtn.onclick = saveProfileChanges;
    }
}

async function saveProfileChanges() {
    if (!currentUser) return;
    
    const usernameInput = document.getElementById('profile-username');
    const emailInput = document.getElementById('profile-email');
    const errorEl = document.getElementById('profile-error');
    const successEl = document.getElementById('profile-success');
    const editBtn = document.getElementById('edit-profile-btn');
    
    // Masquer les messages précédents
    if (errorEl) errorEl.classList.add('hidden');
    if (successEl) successEl.classList.add('hidden');
    
    const newUsername = usernameInput?.value.trim() || '';
    const newEmail = emailInput?.value.trim() || '';
    
    // Validation
    if (!newUsername) {
        if (errorEl) {
            errorEl.textContent = 'Le nom d\'utilisateur ne peut pas être vide';
            errorEl.classList.remove('hidden');
        }
        return;
    }
    
    if (!newEmail || !newEmail.includes('@')) {
        if (errorEl) {
            errorEl.textContent = 'Veuillez entrer une adresse email valide';
            errorEl.classList.remove('hidden');
        }
        return;
    }
    
    // Vérifier si l'email est déjà utilisé par un autre utilisateur
    const emailExists = allUsers.some(u => u.userId !== currentUser.userId && u.email === newEmail);
    if (emailExists) {
        if (errorEl) {
            errorEl.textContent = 'Cet email est déjà utilisé par un autre compte';
            errorEl.classList.remove('hidden');
        }
        return;
    }
    
    // Désactiver le bouton pendant la sauvegarde
    if (editBtn) {
        editBtn.disabled = true;
        editBtn.innerHTML = `
            <svg class="w-4 h-4 animate-spin" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
            </svg>
            Sauvegarde...
        `;
    }
    
    try {
        // Mettre à jour l'utilisateur
        currentUser.username = newUsername;
        currentUser.email = newEmail;
        
        // Sauvegarder localement
        upsertLocalUser(currentUser);
        persistCurrentUserSnapshot(currentUser);
        
        // Tenter de sauvegarder sur le serveur
        try {
            await fetch('/api?action=updateProfile', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    userId: currentUser.userId,
                    sessionToken: currentSessionToken,
                    username: newUsername,
                    email: newEmail
                })
            });
        } catch (e) {
            console.log('Server update failed, saved locally only', e);
        }
        
        // Mettre à jour l'interface
        updateAuthUI();
        
        // Afficher le message de succès
        if (successEl) {
            successEl.textContent = '✓ Profil mis à jour avec succès';
            successEl.classList.remove('hidden');
            setTimeout(() => successEl.classList.add('hidden'), 3000);
        }
        
        // Repasser en mode lecture
        if (usernameInput) usernameInput.disabled = true;
        if (emailInput) emailInput.disabled = true;
        
        // Réinitialiser le bouton "Modifier"
        resetEditButton();
        
    } catch (error) {
        if (errorEl) {
            errorEl.textContent = 'Erreur lors de la sauvegarde';
            errorEl.classList.remove('hidden');
        }
        // Réactiver le bouton en cas d'erreur
        if (editBtn) {
            editBtn.disabled = false;
            editBtn.innerHTML = `
                <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7" />
                </svg>
                Sauvegarder
            `;
        }
    }
}

function closeModal(modalId) {
    const modal = document.getElementById(modalId);
    if (!modal) return;
    modal.classList.remove('active');
    modal.style.removeProperty('display');
    if (modalId === 'product-modal') {
        stopProductBubbleAnimation();
    }
}

function switchTab(tabName) {
    document.querySelectorAll('.tab-content').forEach(t => t.classList.remove('active'));
    document.querySelectorAll('.tab-btn').forEach(b => b.classList.remove('active'));
    
    const targetTab = document.getElementById(tabName + '-tab');
    if (targetTab) targetTab.classList.add('active');
    
    const buttons = document.querySelectorAll('.tab-btn');
    buttons.forEach(btn => {
        const mappedTab = btn.dataset.tab || '';
        const onclickMatch = (btn.getAttribute('onclick') || '').match(/switchTab\('([^']+)'\)/);
        const fallbackMappedTab = onclickMatch ? onclickMatch[1] : '';
        if (mappedTab === tabName || fallbackMappedTab === tabName) {
            btn.classList.add('active');
        }
    });
}

// ==================== UTILITIES ====================

function clearErrorMessages() {
    document.querySelectorAll('.error-message').forEach(el => el.textContent = '');
}

function showToast(message) {
    const toast = document.createElement('div');
    toast.className = 'toast';
    toast.textContent = message;
    document.body.appendChild(toast);
    setTimeout(() => toast.remove(), 3000);
}

// ==================== INITIALIZATION ====================

async function loadUsersFromServer() {
    allUsers = loadLocalUsers();
    try {
        const res = await fetch('/api/users');
        if (res.ok) {
            allUsers = await res.json();
            saveUsers();
        } else {
            const seedRes = await fetch('/data/users.json');
            if (seedRes.ok) {
                const seededUsers = await seedRes.json();
                if (Array.isArray(seededUsers) && allUsers.length === 0) {
                    allUsers = seededUsers;
                    saveUsers();
                }
            }
        }
    } catch (e) {
        console.error('Error fetching users, using local cache', e);
    }
}

function ensureUsersLoaded(options = {}) {
    const { forceRefresh = false } = options;
    if (!forceRefresh && usersLoadPromise) {
        return usersLoadPromise;
    }

    usersLoadPromise = loadUsersFromServer().catch((error) => {
        console.error('Users warmup failed', error);
        return allUsers;
    });

    return usersLoadPromise;
}

function warmUsersLoadInBackground() {
    if (typeof window.requestIdleCallback === 'function') {
        window.requestIdleCallback(() => {
            ensureUsersLoaded();
        }, { timeout: 1200 });
        return;
    }

    setTimeout(() => {
        ensureUsersLoaded();
    }, 0);
}

// override previous updateCartInDB to notify backend
async function updateCartInDB() {
    localStorage.setItem('bonobo_cart', JSON.stringify(cartItems));

    if (currentUser) {
        currentUser.cart = JSON.stringify(cartItems);
        upsertLocalUser(currentUser);
        console.log('Cart updated for user', currentUser.email);
        try {
            await fetch('/api?action=cart', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    userId: currentUser.userId,
                    sessionToken: currentSessionToken,
                    cart: cartItems
                })
            });
        } catch (e) {
            console.error('Error syncing cart to server', e);
        }
    }
}

// ==================== LANGUAGE MANAGEMENT ====================

function getLanguageDisplayLabel(lang) {
    return lang === 'en' ? 'EN' : 'FR';
}

function getLanguageFromQueryParam() {
    const queryLang = new URLSearchParams(window.location.search).get('lang');
    return queryLang === 'en' || queryLang === 'fr' ? queryLang : null;
}

function withLanguageParam(url, lang) {
    const targetLang = lang === 'en' ? 'en' : 'fr';

    try {
        const parsed = new URL(url, window.location.href);
        if (parsed.origin !== window.location.origin) {
            return url;
        }

        parsed.searchParams.set('lang', targetLang);
        return `${parsed.pathname}${parsed.search}${parsed.hash}`;
    } catch (error) {
        return url;
    }
}

function persistLanguageInInternalLinks(lang) {
    const targetLang = lang === 'en' ? 'en' : 'fr';

    document.querySelectorAll('a[href]').forEach((link) => {
        const href = link.getAttribute('href');
        if (!href) return;

        const trimmedHref = href.trim();
        if (
            !trimmedHref ||
            trimmedHref.startsWith('#') ||
            trimmedHref.startsWith('mailto:') ||
            trimmedHref.startsWith('tel:') ||
            trimmedHref.toLowerCase().startsWith('javascript:')
        ) {
            return;
        }

        const localizedHref = withLanguageParam(trimmedHref, targetLang);
        if (localizedHref !== trimmedHref) {
            link.setAttribute('href', localizedHref);
        }
    });
}

function resolveInitialLanguage() {
    const langFromUrl = getLanguageFromQueryParam();
    if (langFromUrl) {
        setLanguage(langFromUrl);
        return langFromUrl;
    }

    return getCurrentLanguage();
}

function updateLanguageToggleLabel() {
    const currentLang = getCurrentLanguage();
    const label = getLanguageDisplayLabel(currentLang);

    const directLabel = document.getElementById('language-toggle-label');
    if (directLabel) {
        directLabel.textContent = label;
        return;
    }

    // Keep HTML changes minimal by upgrading the existing language button at runtime.
    const langButton = document.querySelector('button[onclick="toggleLanguageMenu()"]');
    if (!langButton) return;

    langButton.innerHTML = `<span id="language-toggle-label" class="text-xs font-bold tracking-wider">${label}</span>`;
}

function buildStaticTextDictionary() {
    const dictionary = { frToEn: {}, enToFr: {} };
    const frPack = (typeof translations !== 'undefined' && translations.fr) ? translations.fr : {};
    const enPack = (typeof translations !== 'undefined' && translations.en) ? translations.en : {};

    Object.keys(frPack).forEach((key) => {
        const frText = frPack[key];
        const enText = enPack[key];
        if (typeof frText !== 'string' || typeof enText !== 'string') return;
        if (!frText.trim() || !enText.trim()) return;
        dictionary.frToEn[frText.trim()] = enText;
        dictionary.enToFr[enText.trim()] = frText;
    });

    return dictionary;
}

function translateStaticPageContent(lang) {
    const dictionary = buildStaticTextDictionary();
    const map = lang === 'en' ? dictionary.frToEn : dictionary.enToFr;
    const forbiddenTags = new Set(['SCRIPT', 'STYLE', 'NOSCRIPT', 'CODE', 'PRE']);

    const walker = document.createTreeWalker(document.body, NodeFilter.SHOW_TEXT);
    let node = walker.nextNode();
    while (node) {
        const parentTag = node.parentElement ? node.parentElement.tagName : '';
        if (!forbiddenTags.has(parentTag)) {
            const raw = node.nodeValue || '';
            const trimmed = raw.trim();
            if (trimmed) {
                let nextValue = raw;
                if (Object.prototype.hasOwnProperty.call(map, trimmed)) {
                    nextValue = raw.replace(trimmed, map[trimmed]);
                }
                if (typeof translateFreeText === 'function') {
                    nextValue = translateFreeText(nextValue, lang);
                }
                if (nextValue !== raw) {
                    node.nodeValue = nextValue;
                }
            }
        }
        node = walker.nextNode();
    }

    document.querySelectorAll('[placeholder],[title],[aria-label],[alt],[value]').forEach((el) => {
        ['placeholder', 'title', 'aria-label', 'alt', 'value'].forEach((attr) => {
            const value = el.getAttribute(attr);
            if (!value) return;
            const trimmed = value.trim();
            if (!trimmed) return;
            let nextValue = value;
            if (Object.prototype.hasOwnProperty.call(map, trimmed)) {
                nextValue = map[trimmed];
            }
            if (typeof translateFreeText === 'function') {
                nextValue = translateFreeText(nextValue, lang);
            }
            if (nextValue !== value) {
                el.setAttribute(attr, nextValue);
            }
        });
    });
}

function updateDocumentTitleByLanguage(lang) {
    const path = (window.location.pathname || '').toLowerCase();
    if (path.endsWith('/cars.html') || path.endsWith('cars.html')) {
        document.title = t('page.meta.cars');
        return;
    }
    if (path.endsWith('/scripts.html') || path.endsWith('scripts.html')) {
        document.title = t('page.meta.scripts');
        return;
    }
    if (path.endsWith('/clothes.html') || path.endsWith('clothes.html')) {
        document.title = t('page.meta.clothes');
        return;
    }
    if (path.endsWith('/templates.html') || path.endsWith('templates.html')) {
        document.title = t('page.meta.templates');
        return;
    }
    if (path.endsWith('/product-detail.html') || path.endsWith('product-detail.html')) {
        const pageTitle = document.getElementById('page-title');
        if (pageTitle && !document.title.includes(' - Exon Store')) {
            document.title = t('page.meta.product_detail');
        }
    }
}

function normalizeHeroBubbleLinks() {
    const leftBubble = document.querySelector('.hero-bubble-left');
    const rightBubble = document.querySelector('.hero-bubble-right');
    if (!leftBubble && !rightBubble) return;

    const lang = getCurrentLanguage();
    if (leftBubble) {
        leftBubble.setAttribute('href', withLanguageParam('cars.html', lang));
        leftBubble.setAttribute('aria-label', lang === 'en' ? 'View Cars collection' : 'Voir la collection Cars');
    }

    if (rightBubble) {
        rightBubble.setAttribute('href', withLanguageParam('clothes.html', lang));
        rightBubble.setAttribute('aria-label', lang === 'en' ? 'Browse Clothes shop' : 'Parcourir la boutique Clothes');
    }
}

// ==================== ADMIN PANEL FUNCTIONS ====================

function isUserAdmin(email) {
    if (!email) return false;
    const normalizedEmail = email.toLowerCase().trim();
    const admins = getAdminList();
    return admins.some(a => {
        const adminEmail = a.email ? a.email.toLowerCase().trim() : '';
        return adminEmail === normalizedEmail;
    });
}

// Tab switching
function switchAdminTab(tabName) {
    // Update tab buttons
    document.querySelectorAll('.admin-tab').forEach(tab => {
        tab.classList.remove('active');
        tab.classList.add('text-gray-400');
        tab.classList.remove('border-white');
        tab.classList.add('border-transparent');
    });
    
    const activeTab = document.getElementById(`tab-${tabName}`);
    if (activeTab) {
        activeTab.classList.add('active');
        activeTab.classList.remove('text-gray-400');
        activeTab.classList.add('border-white');
        activeTab.classList.remove('border-transparent');
    }
    
    // Update content
    document.querySelectorAll('.admin-tab-content').forEach(content => {
        content.classList.add('hidden');
    });
    
    const activeContent = document.getElementById(`admin-tab-${tabName}`);
    if (activeContent) {
        activeContent.classList.remove('hidden');
    }
    
    // Load content based on tab
    if (tabName === 'admins') {
        loadAdminsManagement();
    } else if (tabName === 'products') {
        loadProductsManagement();
    } else if (tabName === 'stats') {
        loadAdminDashboard();
    }
}

// Admin management
function loadAdminsManagement() {
    const adminsList = document.getElementById('current-admins-list');
    const userSelect = document.getElementById('user-to-promote');
    
    if (!adminsList || !userSelect) return;
    
    const admins = getAdminList();
    
    // Display current admins
    adminsList.innerHTML = admins.map(admin => `
        <div class="admin-user-item flex justify-between items-center">
            <div>
                <p class="text-white font-semibold">${admin.email}</p>
                ${admin.isMain ? '<span class="text-xs text-gray-500">Admin Principal</span>' : ''}
            </div>
            ${!admin.isMain ? `<button onclick="removeAdmin('${admin.email}')" class="text-red-500 hover:text-red-400 text-sm">Retirer</button>` : '<span class="text-gray-500 text-sm">Non supprimable</span>'}
        </div>
    `).join('');
    
    // Populate user select
    const users = loadLocalUsers();
    const nonAdminUsers = users.filter(u => !isUserAdmin(u.email));
    
    userSelect.innerHTML = '<option value="">-- Choisir un utilisateur --</option>' +
        nonAdminUsers.map(u => `<option value="${u.email}">${u.email}</option>`).join('');
}

function promoteToAdmin() {
    const select = document.getElementById('user-to-promote');
    const email = select.value ? select.value.toLowerCase().trim() : '';
    
    if (!email) {
        showToast('Veuillez sélectionner un utilisateur');
        return;
    }
    
    const user = allUsers.find(u => (u.email || '').toLowerCase().trim() === email);
    if (!user) {
        showToast('Utilisateur non trouvé');
        return;
    }
    
    const admins = getAdminList();
    const normalizedEmail = email.toLowerCase().trim();
    if (admins.some(a => (a.email || '').toLowerCase().trim() === normalizedEmail)) {
        showToast('Cet utilisateur est déjà admin');
        return;
    }
    
    admins.push({ email: normalizedEmail, password: user.password });
    saveAdminList(admins);
    
    showToast(`${email} a été promu admin`);
    loadAdminsManagement();
}

function removeAdmin(email) {
    const normalizedEmail = email ? email.toLowerCase().trim() : '';
    const mainAdminEmail = ADMIN_EMAIL.toLowerCase().trim();
    
    if (normalizedEmail === mainAdminEmail) {
        showToast('Impossible de retirer l\'admin principal');
        return;
    }
    
    if (!confirm(`Êtes-vous sûr de vouloir retirer ${email} des admins ?`)) {
        return;
    }
    
    const admins = getAdminList();
    const filtered = admins.filter(a => (a.email || '').toLowerCase().trim() !== normalizedEmail);
    saveAdminList(filtered);
    
    showToast(`${email} n'est plus admin`);
    loadAdminsManagement();
}

// Product management
function getCustomProducts() {
    try {
        return JSON.parse(localStorage.getItem('bonobo_custom_products') || '{}');
    } catch (e) {
        return {};
    }
}

function saveCustomProducts(customProducts) {
    try {
        localStorage.setItem('bonobo_custom_products', JSON.stringify(customProducts));
    } catch (e) {
        console.error('Cannot save custom products', e);
    }
}

function getAllProductsWithCustom() {
    const baseProducts = products; // from data.js
    const customProducts = getCustomProducts();
    const currentLang = getCurrentLanguage();
    
    // Merge custom products
    const merged = { ...baseProducts };
    
    Object.keys(customProducts).forEach(category => {
        if (!merged[category]) {
            merged[category] = [];
        }
        
        customProducts[category].forEach(customProd => {
            if (customProd._deleted) {
                // Remove deleted product
                merged[category] = merged[category].filter(p => p.id !== customProd.id);
            } else {
                // Use the version matching current language if available
                let productToUse = customProd;
                if (customProd._frVersion && customProd._enVersion) {
                    productToUse = currentLang === 'en' ? customProd._enVersion : customProd._frVersion;
                }
                
                const existingIndex = merged[category].findIndex(p => p.id === customProd.id);
                if (existingIndex >= 0) {
                    // Update existing product
                    merged[category][existingIndex] = productToUse;
                } else {
                    // Add new product
                    merged[category].push(productToUse);
                }
            }
        });
    });
    
    return merged;
}

function loadProductsManagement() {
    // Products management - no need to update total products stat anymore
    filterProducts();
}

function filterProducts() {
    const productsList = document.getElementById('products-list');
    if (!productsList) return;
    
    const category = document.getElementById('filter-category')?.value || '';
    const searchTerm = document.getElementById('search-product')?.value.toLowerCase() || '';
    
    const allProds = getAllProductsWithCustom();
    let productsToShow = [];
    
    if (category) {
        productsToShow = allProds[category] || [];
    } else {
        productsToShow = Object.values(allProds).flat();
    }
    
    // Filter out deleted products
    productsToShow = productsToShow.filter(p => !p._deleted);
    
    if (searchTerm) {
        productsToShow = productsToShow.filter(p => 
            p.title.toLowerCase().includes(searchTerm) ||
            p.id.toLowerCase().includes(searchTerm) ||
            (p.description && p.description.toLowerCase().includes(searchTerm))
        );
    }
    
    productsList.innerHTML = productsToShow.map(product => `
        <div class="product-item flex justify-between items-center gap-4">
            <div class="flex-1">
                <div class="flex items-center gap-3 mb-2">
                    <span class="text-xs px-2 py-1 rounded bg-white/10 text-gray-400">${product.category}</span>
                    <h3 class="text-white font-bold">${product.title}</h3>
                    ${product.originalPrice ? `<span class="text-gray-500 line-through text-sm">${product.originalPrice.toFixed(2)}€</span>` : ''}
                    <span class="text-green-400 font-semibold">${product.price.toFixed(2)}€</span>
                    ${product.badge ? `<span class="text-xs px-2 py-1 rounded ${product.badgeClass || 'bg-blue-500 text-white'}">${product.badge}</span>` : ''}
                </div>
                <p class="text-gray-400 text-sm">${product.description || ''}</p>
                <p class="text-xs text-gray-500 mt-1">ID: ${product.id}</p>
            </div>
            <div class="flex gap-2">
                <button onclick="quickSetPromo('${product.id}', '${product.category}')" class="px-3 py-2 bg-orange-500 hover:bg-orange-600 text-white rounded-lg text-sm" title="Mettre en promo rapidement">🎉 Promo</button>
                <button onclick="editProduct('${product.id}', '${product.category}')" class="px-4 py-2 bg-blue-500 hover:bg-blue-600 text-white rounded-lg text-sm">Modifier</button>
                <button onclick="deleteProduct('${product.id}', '${product.category}')" class="px-4 py-2 bg-red-500 hover:bg-red-600 text-white rounded-lg text-sm">Supprimer</button>
            </div>
        </div>
    `).join('');
}

let adminSelectedProductTags = new Set();

const ADMIN_SUBCATEGORY_MAP = {
    police: ['els-marked', 'els-unmarked', 'glasslight-marked', 'glasslight-unmarked', 'non-els-marked', 'non-els-unmarked'],
    ambulance: ['els-marked', 'els-unmarked', 'glasslight-marked', 'glasslight-unmarked', 'non-els-marked', 'non-els-unmarked'],
    seasonal: ['spring', 'summer', 'autumn', 'winter'],
};

const ADMIN_GRADIENT_PRESETS = {
    byCategory: {
        cars: { from: 'from-slate-900', to: 'to-slate-950' },
        scripts: { from: 'from-emerald-900', to: 'to-emerald-950' },
        clothes: { from: 'from-orange-900', to: 'to-orange-950' },
        templates: { from: 'from-red-900', to: 'to-red-950' },
    },
    byMainTag: {
        civil: { from: 'from-slate-900', to: 'to-slate-950' },
        police: { from: 'from-indigo-900', to: 'to-indigo-950' },
        ambulance: { from: 'from-red-900', to: 'to-red-950' },
        seasonal: { from: 'from-emerald-900', to: 'to-emerald-950' },
        free: { from: 'from-emerald-900', to: 'to-emerald-950' },
    },
    bySeasonalSubcategory: {
        spring: { from: 'from-green-900', to: 'to-emerald-950' },
        summer: { from: 'from-yellow-700', to: 'to-amber-900' },
        autumn: { from: 'from-orange-900', to: 'to-amber-950' },
        winter: { from: 'from-cyan-900', to: 'to-cyan-950' },
    },
};

function getBadgeClassSuggestion(badgeText) {
    const text = (badgeText || '').toUpperCase();
    if (!text) return 'bg-blue-500 text-white';
    if (text.includes('PROMO') || text.includes('SOLDE') || text.includes('SALE')) return 'bg-red-500 text-white';
    if (text.includes('NEW') || text.includes('NOUVEAU')) return 'bg-emerald-500 text-white';
    if (text.includes('LIMITED') || text.includes('EXCLUSIVE')) return 'bg-violet-500 text-white';
    if (text.includes('BETA') || text.includes('TEST')) return 'bg-amber-500 text-black';
    return 'bg-blue-500 text-white';
}

function getAutomaticGradientPreset(category, mainTag, subcategory) {
    if (mainTag === 'seasonal' && subcategory && ADMIN_GRADIENT_PRESETS.bySeasonalSubcategory[subcategory]) {
        return ADMIN_GRADIENT_PRESETS.bySeasonalSubcategory[subcategory];
    }

    if (mainTag && ADMIN_GRADIENT_PRESETS.byMainTag[mainTag]) {
        return ADMIN_GRADIENT_PRESETS.byMainTag[mainTag];
    }

    if (category && ADMIN_GRADIENT_PRESETS.byCategory[category]) {
        return ADMIN_GRADIENT_PRESETS.byCategory[category];
    }

    return { from: 'from-gray-900', to: 'to-gray-950' };
}

function slugifyProductPart(value) {
    return (value || '')
        .toString()
        .normalize('NFD')
        .replace(/[\u0300-\u036f]/g, '')
        .toLowerCase()
        .replace(/[^a-z0-9]+/g, '-')
        .replace(/^-+|-+$/g, '')
        .replace(/-{2,}/g, '-');
}

function generateAutomaticProductId(category, title) {
    const safeCategory = slugifyProductPart(category) || 'product';
    const safeTitle = slugifyProductPart(title) || 'item';
    const baseId = `${safeCategory}-${safeTitle}`;

    const allProducts = getAllProductsWithCustom();
    const existingIds = new Set(
        Object.values(allProducts)
            .flat()
            .filter((p) => p && !p._deleted && p.id)
            .map((p) => p.id)
    );

    if (!existingIds.has(baseId)) {
        return baseId;
    }

    let suffix = 2;
    while (existingIds.has(`${baseId}-${suffix}`)) {
        suffix += 1;
    }

    return `${baseId}-${suffix}`;
}

function refreshAdminSelectedTagsSummary() {
    const selectedTagsContainer = document.getElementById('product-selected-tags');
    const hiddenInput = document.getElementById('product-tags');

    if (hiddenInput) {
        hiddenInput.value = Array.from(adminSelectedProductTags).join(', ');
    }

    document.querySelectorAll('.product-tag-chip').forEach((chip) => {
        const tagValue = chip.dataset.tagValue;
        const isActive = !!tagValue && adminSelectedProductTags.has(tagValue);
        chip.classList.toggle('bg-white', isActive);
        chip.classList.toggle('text-black', isActive);
        chip.classList.toggle('border-white', isActive);
        chip.classList.toggle('ring-2', isActive);
        chip.classList.toggle('ring-white/30', isActive);
    });

    if (!selectedTagsContainer) return;

    if (adminSelectedProductTags.size === 0) {
        selectedTagsContainer.innerHTML = 'Aucun tag sélectionné';
        return;
    }

    selectedTagsContainer.innerHTML = Array.from(adminSelectedProductTags)
        .map((tag) => `<span class="inline-flex items-center px-2 py-1 mr-2 mb-2 rounded-full text-xs font-semibold bg-white text-black">${tag}</span>`)
        .join('');
}

function applyAutomaticBadgeClass(options = {}) {
    const { force = false } = options;
    const badgeInput = document.getElementById('product-badge');
    const badgeClassInput = document.getElementById('product-badge-class');
    if (!badgeInput || !badgeClassInput) return;

    const badgeValue = badgeInput.value.trim();
    const shouldApply = force || badgeClassInput.dataset.auto === 'true' || !badgeClassInput.value.trim();

    if (!shouldApply) return;

    if (!badgeValue) {
        badgeClassInput.value = '';
        badgeClassInput.dataset.auto = 'true';
        return;
    }

    badgeClassInput.value = getBadgeClassSuggestion(badgeValue);
    badgeClassInput.dataset.auto = 'true';
}

function applyAutomaticProductStyling(options = {}) {
    const { force = false } = options;
    const gradientFromInput = document.getElementById('product-gradient-from');
    const gradientToInput = document.getElementById('product-gradient-to');
    const category = document.getElementById('product-category')?.value;
    const mainTag = document.getElementById('product-main-tag')?.value;
    const subcategory = document.getElementById('product-subcategory')?.value;

    if (!gradientFromInput || !gradientToInput) return;

    const preset = getAutomaticGradientPreset(category, mainTag, subcategory);
    const shouldAutoGradient = force
        || gradientFromInput.dataset.auto === 'true'
        || gradientToInput.dataset.auto === 'true'
        || !gradientFromInput.value.trim()
        || !gradientToInput.value.trim();

    if (shouldAutoGradient) {
        gradientFromInput.value = preset.from;
        gradientToInput.value = preset.to;
        gradientFromInput.dataset.auto = 'true';
        gradientToInput.dataset.auto = 'true';
    }

    applyAutomaticBadgeClass({ force });
}

function renderAdminSubcategoryChips(mainTag) {
    const container = document.getElementById('product-subcategory-options');
    if (!container) return;

    const options = ADMIN_SUBCATEGORY_MAP[mainTag] || [];
    if (options.length === 0) {
        container.innerHTML = '<p class="text-xs text-gray-500">Aucune sous-catégorie pour ce tag principal.</p>';
        return;
    }

    container.innerHTML = options
        .map((value) => `<button type="button" data-subcategory-value="${value}" class="product-subcategory-chip px-3 py-1.5 rounded-full text-xs font-semibold border border-white/20 text-gray-300 hover:text-white hover:border-white/40 transition-all">${value}</button>`)
        .join('');

    container.querySelectorAll('.product-subcategory-chip').forEach((chip) => {
        chip.addEventListener('click', () => {
            const selectedValue = chip.dataset.subcategoryValue || '';
            const hiddenInput = document.getElementById('product-subcategory');
            const nextValue = hiddenInput?.value === selectedValue ? '' : selectedValue;
            setAdminSubcategory(nextValue, { applyAuto: true });
        });
    });
}

function setAdminSubcategory(value, options = {}) {
    const { applyAuto = true } = options;
    const hiddenInput = document.getElementById('product-subcategory');
    if (hiddenInput) {
        hiddenInput.value = value || '';
    }

    document.querySelectorAll('.product-subcategory-chip').forEach((chip) => {
        const isActive = chip.dataset.subcategoryValue === value;
        chip.classList.toggle('bg-white', isActive);
        chip.classList.toggle('text-black', isActive);
        chip.classList.toggle('border-white', isActive);
        chip.classList.toggle('ring-2', isActive);
        chip.classList.toggle('ring-white/30', isActive);
    });

    if (applyAuto) {
        applyAutomaticProductStyling({ force: false });
    }
}

function setAdminMainTag(value, options = {}) {
    const { applyAuto = true } = options;
    const hiddenInput = document.getElementById('product-main-tag');
    if (hiddenInput) {
        hiddenInput.value = value || '';
    }

    document.querySelectorAll('.product-main-tag-chip').forEach((chip) => {
        const isActive = chip.dataset.mainTagValue === value;
        chip.classList.toggle('bg-white', isActive);
        chip.classList.toggle('text-black', isActive);
        chip.classList.toggle('border-white', isActive);
        chip.classList.toggle('ring-2', isActive);
        chip.classList.toggle('ring-white/30', isActive);
    });

    renderAdminSubcategoryChips(value);

    const currentSubcategory = document.getElementById('product-subcategory')?.value || '';
    const allowedSubcategories = ADMIN_SUBCATEGORY_MAP[value] || [];
    if (!allowedSubcategories.includes(currentSubcategory)) {
        setAdminSubcategory('', { applyAuto: false });
    } else {
        setAdminSubcategory(currentSubcategory, { applyAuto: false });
    }

    if (applyAuto) {
        applyAutomaticProductStyling({ force: false });
    }
}

function inferMainTagFromProduct(product) {
    if (product.tag) return product.tag;
    if (product.policeSubcategory) return 'police';
    if (product.ambulanceSubcategory) return 'ambulance';
    if (product.seasonalSubcategory) return 'seasonal';
    return '';
}

function setupAdminProductTaggingUI() {
    const form = document.getElementById('product-form');
    if (!form || form.dataset.taggingSetup === 'true') return;

    form.dataset.taggingSetup = 'true';

    document.querySelectorAll('.product-tag-chip').forEach((chip) => {
        chip.addEventListener('click', () => {
            const tagValue = chip.dataset.tagValue;
            if (!tagValue) return;

            if (adminSelectedProductTags.has(tagValue)) {
                adminSelectedProductTags.delete(tagValue);
            } else {
                adminSelectedProductTags.add(tagValue);
            }

            refreshAdminSelectedTagsSummary();
        });
    });

    document.querySelectorAll('.product-main-tag-chip').forEach((chip) => {
        chip.addEventListener('click', () => {
            const tagValue = chip.dataset.mainTagValue || '';
            const current = document.getElementById('product-main-tag')?.value || '';
            setAdminMainTag(current === tagValue ? '' : tagValue, { applyAuto: true });
        });
    });

    const categoryInput = document.getElementById('product-category');
    if (categoryInput) {
        categoryInput.addEventListener('change', () => applyAutomaticProductStyling({ force: false }));
    }

    const badgeInput = document.getElementById('product-badge');
    if (badgeInput) {
        badgeInput.addEventListener('input', () => applyAutomaticBadgeClass({ force: false }));
    }

    const badgeClassInput = document.getElementById('product-badge-class');
    if (badgeClassInput) {
        badgeClassInput.addEventListener('input', () => {
            badgeClassInput.dataset.auto = 'false';
        });
    }

    const gradientFromInput = document.getElementById('product-gradient-from');
    const gradientToInput = document.getElementById('product-gradient-to');
    if (gradientFromInput) {
        gradientFromInput.addEventListener('input', () => {
            gradientFromInput.dataset.auto = 'false';
        });
    }
    if (gradientToInput) {
        gradientToInput.addEventListener('input', () => {
            gradientToInput.dataset.auto = 'false';
        });
    }

    renderAdminSubcategoryChips('');
    refreshAdminSelectedTagsSummary();
}

function showAddProductModal() {
    setupAdminProductTaggingUI();

    document.getElementById('product-modal-title').textContent = 'Ajouter un produit';
    document.getElementById('product-form').reset();
    document.getElementById('product-edit-id').value = '';

    adminSelectedProductTags = new Set();
    refreshAdminSelectedTagsSummary();
    setAdminMainTag('', { applyAuto: false });
    setAdminSubcategory('', { applyAuto: false });

    const gradientFromInput = document.getElementById('product-gradient-from');
    const gradientToInput = document.getElementById('product-gradient-to');
    const badgeClassInput = document.getElementById('product-badge-class');
    if (gradientFromInput) gradientFromInput.dataset.auto = 'true';
    if (gradientToInput) gradientToInput.dataset.auto = 'true';
    if (badgeClassInput) badgeClassInput.dataset.auto = 'true';
    applyAutomaticProductStyling({ force: true });
    
    // Reset promo fields
    const promoEnabled = document.getElementById('promo-enabled');
    if (promoEnabled) promoEnabled.checked = false;
    togglePromoFields();
    
    const modal = document.getElementById('product-modal');
    modal.style.display = 'flex';
    
    // ID is generated automatically on save for new products.
    document.getElementById('product-id').value = '';
}

function editProduct(productId, category) {
    const allProds = getAllProductsWithCustom();
    const product = allProds[category]?.find(p => p.id === productId);
    
    if (!product) {
        showToast('Produit non trouvé');
        return;
    }
    
    document.getElementById('product-modal-title').textContent = 'Modifier le produit';
    document.getElementById('product-edit-id').value = productId;
    document.getElementById('product-id').value = product.id;
    document.getElementById('product-category').value = product.category;
    document.getElementById('product-title').value = product.title;
    document.getElementById('product-subtitle').value = product.subtitle || '';
    document.getElementById('product-description').value = product.description || '';
    document.getElementById('product-details').value = product.details || '';
    document.getElementById('product-price').value = product.price;
    document.getElementById('product-original-price').value = product.originalPrice || '';
    document.getElementById('product-badge').value = product.badge || '';
    document.getElementById('product-badge-class').value = product.badgeClass || '';
    document.getElementById('product-gradient-from').value = product.gradientFrom || '';
    document.getElementById('product-gradient-to').value = product.gradientTo || '';

    setupAdminProductTaggingUI();
    
    if (product.features && Array.isArray(product.features)) {
        document.getElementById('product-features').value = product.features.join('\n');
    }
    
    if (product.images && Array.isArray(product.images)) {
        document.getElementById('product-images').value = product.images.join('\n');
    }
    
    // Populate new fields
    if (document.getElementById('product-tags')) {
        document.getElementById('product-tags').value = product.productTags ? product.productTags.join(', ') : '';
        adminSelectedProductTags = new Set(Array.isArray(product.productTags) ? product.productTags : []);
        refreshAdminSelectedTagsSummary();
    }

    const inferredMainTag = inferMainTagFromProduct(product);
    setAdminMainTag(inferredMainTag, { applyAuto: false });
    const inferredSubcategory = product.policeSubcategory || product.ambulanceSubcategory || product.seasonalSubcategory || '';
    setAdminSubcategory(inferredSubcategory, { applyAuto: false });

    const gradientFromInput = document.getElementById('product-gradient-from');
    const gradientToInput = document.getElementById('product-gradient-to');
    const badgeClassInput = document.getElementById('product-badge-class');
    if (gradientFromInput) gradientFromInput.dataset.auto = product.gradientFrom ? 'false' : 'true';
    if (gradientToInput) gradientToInput.dataset.auto = product.gradientTo ? 'false' : 'true';
    if (badgeClassInput) badgeClassInput.dataset.auto = product.badgeClass ? 'false' : 'true';
    applyAutomaticProductStyling({ force: !product.gradientFrom || !product.gradientTo });
    
    if (document.getElementById('tech-spawn-name')) {
        const tech = product.technicalDetails || {};
        document.getElementById('tech-spawn-name').value = tech['Spawn Name'] || '';
        document.getElementById('tech-file-size').value = tech['Taille'] || '';
        document.getElementById('tech-poly-count').value = tech['Poly Count'] || '';
        document.getElementById('tech-version').value = tech['Version'] || '';
        document.getElementById('tech-compatibility').value = tech['Compatibilité'] || '';
        document.getElementById('tech-style').value = tech['Style'] || '';
    }
    
    if (document.getElementById('product-important-info')) {
        document.getElementById('product-important-info').value = product.importantInfo ? product.importantInfo.join('\n') : '';
    }
    
    // Reset promo fields
    const promoEnabled = document.getElementById('promo-enabled');
    if (promoEnabled) promoEnabled.checked = false;
    togglePromoFields();
    
    const modal = document.getElementById('product-modal');
    modal.style.display = 'flex';
}

function quickSetPromo(productId, category) {
    const allProds = getAllProductsWithCustom();
    const product = allProds[category]?.find(p => p.id === productId);
    
    if (!product) {
        showToast('Produit non trouvé');
        return;
    }
    
    const discount = prompt('Entrez le pourcentage de réduction (ex: 20 pour -20%):', '20');
    if (!discount || isNaN(discount) || discount <= 0 || discount > 100) {
        if (discount !== null) showToast('Pourcentage invalide');
        return;
    }
    
    const discountPercent = parseFloat(discount) / 100;
    const originalPrice = product.price;
    const newPrice = originalPrice * (1 - discountPercent);
    
    product.originalPrice = originalPrice;
    product.price = parseFloat(newPrice.toFixed(2));
    product.badge = 'PROMO';
    product.badgeClass = 'bg-red-500 text-white';
    
    const customProducts = getCustomProducts();
    if (!customProducts[category]) {
        customProducts[category] = [];
    }
    
    const existingIndex = customProducts[category].findIndex(p => p.id === productId);
    if (existingIndex >= 0) {
        customProducts[category][existingIndex] = product;
    } else {
        customProducts[category].push(product);
    }
    
    saveCustomProducts(customProducts);
    showToast(`Promotion de ${discount}% appliquée ! Prix: ${originalPrice.toFixed(2)}€ → ${newPrice.toFixed(2)}€`);
    loadProductsManagement();
}

function deleteProduct(productId, category) {
    if (!confirm(`Êtes-vous sûr de vouloir supprimer le produit "${productId}" ?`)) {
        return;
    }
    
    const customProducts = getCustomProducts();
    
    if (!customProducts[category]) {
        customProducts[category] = [];
    }
    
    // Mark as deleted by adding a deleted flag
    const deletedProduct = { id: productId, _deleted: true };
    
    const existingIndex = customProducts[category].findIndex(p => p.id === productId);
    if (existingIndex >= 0) {
        customProducts[category][existingIndex] = deletedProduct;
    } else {
        customProducts[category].push(deletedProduct);
    }
    
    saveCustomProducts(customProducts);
    showToast('Produit supprimé');
    loadProductsManagement();
}

function closeProductModal() {
    document.getElementById('product-modal').style.display = 'none';
}

// Product form submission
document.addEventListener('DOMContentLoaded', function() {
    const productForm = document.getElementById('product-form');
    if (productForm) {
        productForm.addEventListener('submit', function(e) {
            e.preventDefault();
            saveProduct();
        });
    }
    
    // Close modal when clicking outside
    const productModal = document.getElementById('product-modal');
    if (productModal) {
        productModal.addEventListener('click', function(e) {
            if (e.target === productModal) {
                closeProductModal();
            }
        });
    }
    
    // Initialize admin panel if on admin page
    const isAdminPage = isAdminPagePath();
    if (isAdminPage && isCurrentUserAdmin()) {
        setupAdminProductTaggingUI();

        setTimeout(() => {
            loadAdminsManagement();
            loadProductsManagement();
        }, 500);
    }
});

function saveProduct() {
    const editId = document.getElementById('product-edit-id').value;
    const isEditing = !!editId;
    const categoryValue = document.getElementById('product-category').value;
    const titleValue = document.getElementById('product-title').value.trim();
    const idInput = document.getElementById('product-id');

    const generatedId = isEditing
        ? (idInput?.value.trim() || editId)
        : generateAutomaticProductId(categoryValue, titleValue);

    if (idInput) {
        idInput.value = generatedId;
    }
    
    const productData = {
        id: generatedId,
        category: categoryValue,
        title: titleValue,
        subtitle: document.getElementById('product-subtitle').value.trim(),
        description: document.getElementById('product-description').value.trim(),
        details: document.getElementById('product-details').value.trim(),
        price: parseFloat(document.getElementById('product-price').value),
        originalPrice: document.getElementById('product-original-price').value ? parseFloat(document.getElementById('product-original-price').value) : undefined,
        badge: document.getElementById('product-badge').value.trim() || undefined,
        badgeClass: document.getElementById('product-badge-class').value.trim() || undefined,
        gradientFrom: document.getElementById('product-gradient-from').value.trim() || 'from-gray-900',
        gradientTo: document.getElementById('product-gradient-to').value.trim() || 'to-gray-950',
    };
    
    // Parse features
    const featuresText = document.getElementById('product-features').value.trim();
    if (featuresText) {
        productData.features = featuresText.split('\n').filter(f => f.trim());
    }
    
    // Parse images
    const imagesText = document.getElementById('product-images').value.trim();
    if (imagesText) {
        productData.images = imagesText.split('\n').filter(i => i.trim());
    } else {
        productData.images = [];
    }
    
    // Parse product tags
    const productTagsText = document.getElementById('product-tags')?.value.trim();
    if (productTagsText) {
        productData.productTags = productTagsText.split(',').map(t => t.trim()).filter(t => t);
    }
    
    // Main tag and subcategory
    const mainTag = document.getElementById('product-main-tag')?.value;
    if (mainTag) {
        productData.tag = mainTag;
    }
    
    const subcategory = document.getElementById('product-subcategory')?.value;
    if (subcategory) {
        if (mainTag === 'police') {
            productData.policeSubcategory = subcategory;
        } else if (mainTag === 'ambulance') {
            productData.ambulanceSubcategory = subcategory;
        } else if (mainTag === 'seasonal') {
            productData.seasonalSubcategory = subcategory;
        }
    }
    
    // Technical details
    const technicalDetails = {};
    const spawnName = document.getElementById('tech-spawn-name')?.value.trim();
    const fileSize = document.getElementById('tech-file-size')?.value.trim();
    const polyCount = document.getElementById('tech-poly-count')?.value.trim();
    const version = document.getElementById('tech-version')?.value.trim();
    const compatibility = document.getElementById('tech-compatibility')?.value.trim();
    const style = document.getElementById('tech-style')?.value.trim();
    
    if (spawnName) technicalDetails['Spawn Name'] = spawnName;
    if (fileSize) technicalDetails['Taille'] = fileSize;
    if (polyCount) technicalDetails['Poly Count'] = polyCount;
    if (version) technicalDetails['Version'] = version;
    if (compatibility) technicalDetails['Compatibilité'] = compatibility;
    if (style) technicalDetails['Style'] = style;
    
    if (Object.keys(technicalDetails).length > 0) {
        productData.technicalDetails = technicalDetails;
    }
    
    // Important info
    const importantInfoText = document.getElementById('product-important-info')?.value.trim();
    if (importantInfoText) {
        productData.importantInfo = importantInfoText.split('\n').filter(i => i.trim());
    }
    
    // Validate required fields
    if (!productData.category || !productData.title || !productData.description || isNaN(productData.price)) {
        showToast('Veuillez remplir tous les champs obligatoires');
        return;
    }
    
    const customProducts = getCustomProducts();
    
    if (!customProducts[productData.category]) {
        customProducts[productData.category] = [];
    }
    
    const existingIndex = customProducts[productData.category].findIndex(p => p.id === productData.id);
    
    if (!isEditing && existingIndex >= 0 && !customProducts[productData.category][existingIndex]._deleted) {
        showToast('Un produit avec cet ID existe déjà. Utilisez le bouton Modifier.');
        return;
    }
    
    // Store both French and English versions of the product
    const currentLang = getCurrentLanguage();
    const frVersion = currentLang === 'fr' ? productData : translateProductContent(productData, 'fr');
    const enVersion = currentLang === 'en' ? productData : translateProductContent(productData, 'en');
    
    // Use the version matching the current language setting
    const versionToStore = currentLang === 'en' ? enVersion : frVersion;
    versionToStore._frVersion = frVersion;
    versionToStore._enVersion = enVersion;
    
    if (existingIndex >= 0) {
        customProducts[productData.category][existingIndex] = versionToStore;
    } else {
        customProducts[productData.category].push(versionToStore);
    }
    
    saveCustomProducts(customProducts);
    
    showToast(isEditing ? 'Produit modifié avec succès' : 'Produit ajouté avec succès');
    closeProductModal();
    loadProductsManagement();
}

// ==================== PROMOTION MANAGEMENT ====================

function togglePromoFields() {
    const promoEnabled = document.getElementById('promo-enabled');
    const promoFields = document.getElementById('promo-fields');
    
    if (promoEnabled && promoFields) {
        if (promoEnabled.checked) {
            promoFields.classList.remove('hidden');
        } else {
            promoFields.classList.add('hidden');
            // Reset promo fields
            document.getElementById('promo-discount').value = '';
            document.getElementById('promo-calculated-price').value = '';
        }
    }
}

function calculatePromoPrice() {
    const priceInput = document.getElementById('product-price');
    const originalPriceInput = document.getElementById('product-original-price');
    const discountInput = document.getElementById('promo-discount');
    const calculatedPriceInput = document.getElementById('promo-calculated-price');
    
    if (!priceInput || !calculatedPriceInput || !discountInput) return;
    
    const basePrice = parseFloat(originalPriceInput?.value) || parseFloat(priceInput.value) || 0;
    const discount = parseFloat(discountInput.value) || 0;
    
    if (basePrice > 0 && discount > 0 && discount <= 100) {
        const discountPercent = discount / 100;
        const promoPrice = basePrice * (1 - discountPercent);
        calculatedPriceInput.value = promoPrice.toFixed(2);
    } else {
        calculatedPriceInput.value = '';
    }
}

function applyPromoPrice() {
    const priceInput = document.getElementById('product-price');
    const originalPriceInput = document.getElementById('product-original-price');
    const calculatedPriceInput = document.getElementById('promo-calculated-price');
    const badgeInput = document.getElementById('product-badge');
    const badgeClassInput = document.getElementById('product-badge-class');
    
    const calculatedPrice = calculatedPriceInput.value;
    
    if (!calculatedPrice || parseFloat(calculatedPrice) <= 0) {
        showToast('Veuillez d\'abord calculer un prix promo valide');
        return;
    }
    
    // Save current price as original price if not already set
    if (!originalPriceInput.value) {
        originalPriceInput.value = priceInput.value;
    }
    
    // Apply the promo price
    priceInput.value = calculatedPrice;
    
    // Set PROMO badge
    if (!badgeInput.value || badgeInput.value === '') {
        badgeInput.value = 'PROMO';
    }
    if (!badgeClassInput.value || badgeClassInput.value === '') {
        badgeClassInput.value = 'bg-red-500 text-white';
    }
    
    showToast('Prix promotionnel appliqué ! N\'oubliez pas d\'enregistrer le produit.');
}

// ==================== PRODUCT FORM HELPERS ====================

function addDefaultImage() {
    const imagesTextarea = document.getElementById('product-images');
    if (!imagesTextarea) return;
    
    const defaultImageUrl = 'https://placehold.co/600x400/0a0a0a/ffffff?text=EXON';
    const currentValue = imagesTextarea.value.trim();
    
    if (currentValue) {
        imagesTextarea.value = currentValue + '\n' + defaultImageUrl;
    } else {
        imagesTextarea.value = defaultImageUrl;
    }
    
    showToast('Image par défaut ajoutée');
}

function updateProductPreview() {
    const previewContainer = document.getElementById('product-preview');
    if (!previewContainer) return;
    
    const title = document.getElementById('product-title')?.value.trim();
    const price = document.getElementById('product-price')?.value;
    const originalPrice = document.getElementById('product-original-price')?.value;
    const badge = document.getElementById('product-badge')?.value.trim();
    const category = document.getElementById('product-category')?.value;
    const gradientFrom = document.getElementById('product-gradient-from')?.value || 'from-gray-900';
    const gradientTo = document.getElementById('product-gradient-to')?.value || 'to-gray-950';
    
    if (!title || !price) {
        previewContainer.innerHTML = '<p class="text-gray-500 text-center">Remplissez le titre et le prix pour voir l\'aperçu</p>';
        return;
    }
    
    const hasDiscount = originalPrice && parseFloat(originalPrice) > parseFloat(price);
    
    const previewHTML = `
        <div class="product-card bg-gradient-to-br ${gradientFrom} ${gradientTo} border border-white/10 rounded-2xl p-4 relative overflow-hidden">
            ${badge ? `<span class="absolute top-4 right-4 px-2 py-1 text-xs font-bold rounded ${badge === 'PROMO' || badge === 'SOLDE' ? 'bg-red-500 text-white' : 'bg-blue-500 text-white'}">${badge}</span>` : ''}
            <div class="aspect-video bg-black/30 rounded-lg mb-3 flex items-center justify-center">
                <span class="text-gray-500 text-sm">Aperçu Image</span>
            </div>
            <div class="mb-2">
                <span class="text-xs text-gray-400 uppercase tracking-wider">${category || 'Catégorie'}</span>
                <h3 class="text-white font-semibold text-lg">${title}</h3>
            </div>
            <div class="flex items-baseline gap-2">
                <span class="text-xl font-bold text-white">${parseFloat(price).toFixed(2)} EUR</span>
                ${hasDiscount ? `<span class="text-sm text-gray-400 line-through">${parseFloat(originalPrice).toFixed(2)} EUR</span>` : ''}
            </div>
        </div>
    `;
    
    previewContainer.innerHTML = previewHTML;
}

// Toggle language menu visibility
function toggleLanguageMenu() {
    const menu = document.getElementById('language-menu');
    if (menu) {
        menu.classList.toggle('hidden');
    }
}

// Switch to a specific language
function switchLanguageTo(lang) {
    const currentLang = getCurrentLanguage();
    if (currentLang === lang) {
        const menu = document.getElementById('language-menu');
        if (menu) menu.classList.add('hidden');
        updateLanguageMenuDisplay();
        updateLanguageToggleLabel();
        return;
    }

    switchLanguage(lang);
    // Close the language menu
    const menu = document.getElementById('language-menu');
    if (menu) {
        menu.classList.add('hidden');
    }
    // Update language menu highlights
    updateLanguageMenuDisplay();
    updateLanguageToggleLabel();

    // Keep language explicit in URL and propagate to internal links.
    persistLanguageInInternalLinks(lang);
    window.location.href = withLanguageParam(window.location.href, lang);
}

// Update language menu to show current language
function updateLanguageMenuDisplay() {
    const currentLang = getCurrentLanguage();
    const options = document.querySelectorAll('.language-option');
    options.forEach(option => {
        if (option.getAttribute('data-lang') === currentLang) {
            option.classList.add('bg-white/20');
        } else {
            option.classList.remove('bg-white/20');
        }
    });
}

let languageRefreshRaf = null;

function applyFullLanguageState(lang) {
    const targetLang = lang === 'en' ? 'en' : 'fr';
    document.documentElement.lang = targetLang;
    translatePage();
    translateStaticPageContent(targetLang);
    updateNavigationTranslations(targetLang);
    updateAuthUIText(targetLang);
    updateLanguageMenuDisplay();
    updateLanguageToggleLabel();
    persistLanguageInInternalLinks(targetLang);
    normalizeHeroBubbleLinks();
    updateDocumentTitleByLanguage(targetLang);
}

function scheduleLanguageRefresh(lang) {
    if (languageRefreshRaf !== null) {
        cancelAnimationFrame(languageRefreshRaf);
    }

    languageRefreshRaf = requestAnimationFrame(() => {
        languageRefreshRaf = null;
        applyFullLanguageState(lang || getCurrentLanguage());
    });
}

function setupLanguageMutationObserver() {
    if (!document.body) return;

    let refreshQueued = false;

    function queueRefresh() {
        if (refreshQueued) return;
        refreshQueued = true;

        setTimeout(() => {
            refreshQueued = false;
            scheduleLanguageRefresh(getCurrentLanguage());
        }, 120);
    }

    const observer = new MutationObserver(() => {
        queueRefresh();
    });

    observer.observe(document.body, {
        childList: true,
        subtree: true
    });
}

// Initialize translations on page load
function initializeTranslations() {
    const currentLang = resolveInitialLanguage();
    window.history.replaceState({}, '', withLanguageParam(window.location.href, currentLang));
    applyFullLanguageState(currentLang);
}

// Refresh all product displays with new language versions
function refreshProductsDisplay() {
    // Re-render category products on current page
    const gridIds = ['cars-grid', 'scripts-grid', 'clothes-grid', 'templates-grid'];
    const categories = ['cars', 'scripts', 'clothes', 'templates'];
    
    gridIds.forEach((gridId, index) => {
        const grid = document.getElementById(gridId);
        if (grid) {
            renderProducts(categories[index], gridId);
        }
    });
    
    // Re-render popular and recent products
    const popularGrid = document.getElementById('popular-products');
    const recentGrid = document.getElementById('recent-products');
    
    if (popularGrid) {
        renderPopularProducts();
    }
    if (recentGrid) {
        renderRecentProducts();
    }
    
    // Re-render any currently displayed product detail
    const productModal = document.getElementById('product-modal');
    if (productModal && productModal.classList.contains('active')) {
        const productIdElement = document.querySelector('[data-product-id]');
        if (productIdElement) {
            const productId = productIdElement.getAttribute('data-product-id');
            const product = getAllProducts().find(p => p.id === productId);
            if (product) {
                viewProduct(productId);
            }
        }
    }
}

// Listen for language changes and update content
window.addEventListener('languageChanged', function(event) {
    const lang = event.detail.language;
    window.history.replaceState({}, '', withLanguageParam(window.location.href, lang));
    applyFullLanguageState(lang);

    // Update search placeholder
    const searchInput = document.getElementById('search-input-nav');
    if (searchInput) {
        searchInput.placeholder = t('nav.search');
    }
    
    // Refresh product display with translated content
    refreshProductsDisplay();
});

function updateNavigationTranslations(lang) {
    const navLinks = document.querySelectorAll('.nav-link');
    const navTexts = ['nav.home', 'nav.cars', 'nav.scripts', 'nav.clothes', 'nav.templates', 'nav.about'];
    
    navLinks.forEach((link, index) => {
        if (navTexts[index]) {
            link.textContent = t(navTexts[index]);
        }
    });
}

function updateAuthUIText(lang) {
    const authBtn = document.getElementById('auth-btn');
    const profileBtn = document.getElementById('profile-btn');
    const authBtnMobile = document.getElementById('auth-btn-mobile');
    const profileBtnMobile = document.getElementById('profile-btn-mobile');
    
    if (authBtn) authBtn.textContent = t('nav.connection');
    if (profileBtn) profileBtn.textContent = t('nav.profile');
    if (authBtnMobile) authBtnMobile.textContent = t('nav.connection');
    if (profileBtnMobile) profileBtnMobile.textContent = t('nav.profile');
}

// ==================== INITIALIZATION AND UI HANDLERS ====================

document.addEventListener('DOMContentLoaded', async function() {
    // Initialize translations
    initializeTranslations();
    // Observe language-related DOM changes only on admin pages where dynamic templates are frequent.
    const isAdminPage = isAdminPagePath();
    if (isAdminPage) {
        setupLanguageMutationObserver();
    }
    
    ensureCommerceUI();
    // Commerce modals are injected dynamically, so enforce full language state after insertion too.
    applyFullLanguageState(getCurrentLanguage());
    ensureProfileModalStructure();
    updateAdminVisibility();

    // Mobile menu toggle (NE MASQUE PAS LA NAVBAR)
    const mobileMenuBtn = document.getElementById('mobile-menu-btn');
    if (mobileMenuBtn) {
        mobileMenuBtn.addEventListener('click', function(e) {
            e.preventDefault();
            e.stopPropagation();
            const menu = document.getElementById('mobile-menu');
            menu.classList.toggle('hidden');
        });
    }
    
    // Search input handler
    const searchInput = document.getElementById('search-input-nav');
    if (searchInput) {
        searchInput.addEventListener('input', function(e) {
            clearTimeout(currentSearchTimeout);
            const query = e.target.value.trim();

            if (query === '') {
                document.getElementById('search-results-dropdown').classList.remove('active');
                return;
            }

            currentSearchTimeout = setTimeout(() => {
                performLiveSearch(query);
            }, 300);
        });

        searchInput.addEventListener('focus', function(e) {
            if (e.target.value.trim() !== '') {
                performLiveSearch(e.target.value.trim());
            }
        });
    }
    
    // Close dropdown when clicking outside
    document.addEventListener('click', function(e) {
        const searchContainer = document.getElementById('search-container');
        if (searchContainer && !searchContainer.contains(e.target)) {
            document.getElementById('search-results-dropdown').classList.remove('active');
        }
    });
    
    if (isAdminPage) {
        await ensureUsersLoaded();
    } else {
        warmUsersLoadInBackground();
    }

    // Restore immediately from local snapshot so session stays active across pages.
    restoreSessionFromLocal();

    // restore server-side session if present
    await restoreSessionFromServer();
    updateAuthUI();
    const hasAdminAccess = enforceAdminPageAccess();
    if (isAdminPage && hasAdminAccess) {
        setupAdminProductTaggingUI();
        loadAdminsManagement();
        loadProductsManagement();
    }
    await loadAdminDashboard();

    // Load cart from localStorage if available
    const savedCart = localStorage.getItem('bonobo_cart');
    if (savedCart) {
        try {
            cartItems = JSON.parse(savedCart);
            updateCartUI();
        } catch (e) {
            console.error('Error loading cart', e);
        }
    }
    
    // Save cart to localStorage on beforeunload
    window.addEventListener('beforeunload', function() {
        localStorage.setItem('bonobo_cart', JSON.stringify(cartItems));
    });

    // Footer positioning now handled by flexbox CSS automatically
    // refreshFooterVisibility();
    // window.addEventListener('resize', refreshFooterVisibility);
});


