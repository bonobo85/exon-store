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
const ADMIN_EMAIL = 'bonobo.des.alpes@gmail.com';
const ADMIN_PASSWORD = 'zboubus85!';

function isCurrentUserAdmin() {
    return !!currentUser && currentUser.email === ADMIN_EMAIL && currentUser.password === ADMIN_PASSWORD;
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

function enforceAdminPageAccess() {
    const path = window.location.pathname || '';
    const isAdminPage = path.endsWith('/admin.html') || path.endsWith('admin.html');
    if (!isAdminPage) return;
    if (isCurrentUserAdmin()) return;
    window.location.href = withLanguageParam('index.html', getCurrentLanguage());
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

    ensureModalShell('profile-modal', `
        <div class="modal-content max-w-2xl">
            <div class="modal-header">
                <h2 class="font-display text-2xl font-bold text-white">MON PROFIL</h2>
                <button onclick="closeModal('profile-modal')" class="text-gray-400 hover:text-white text-2xl leading-none">X</button>
            </div>
            <div class="modal-body">
                <div class="tabs">
                    <button class="tab-btn active" data-tab="profile-info" onclick="switchTab('profile-info')">Informations</button>
                    <button class="tab-btn" data-tab="purchase-history" onclick="switchTab('purchase-history')">Historique</button>
                    <button class="tab-btn" data-tab="payment-methods" onclick="switchTab('payment-methods')">Moyen de paiement</button>
                </div>
                <div id="profile-info-tab" class="tab-content active">
                    <p class="text-gray-300"><strong>Nom:</strong> <span id="profile-username">-</span></p>
                    <p class="text-gray-300"><strong>Email:</strong> <span id="profile-email">-</span></p>
                    <p class="text-gray-300"><strong>Membre depuis:</strong> <span id="profile-joined">-</span></p>
                    <button onclick="handleLogout()" class="mt-4 btn-secondary px-4 py-2 rounded-lg">Déconnexion</button>
                </div>
                <div id="purchase-history-tab" class="tab-content">
                    <div id="history-items" class="space-y-3"></div>
                </div>
                <div id="payment-methods-tab" class="tab-content">
                    <div id="payment-methods-items" class="space-y-3"></div>
                </div>
            </div>
        </div>
    `);
}

function ensureProfileModalStructure() {
    const profileModal = document.getElementById('profile-modal');
    if (!profileModal) return;

    const modalBody = profileModal.querySelector('.modal-body');
    if (!modalBody) return;

    const tabs = modalBody.querySelector('.tabs');
    if (tabs && !tabs.querySelector('[data-tab="payment-methods"]')) {
        const paymentBtn = document.createElement('button');
        paymentBtn.className = 'tab-btn';
        paymentBtn.dataset.tab = 'payment-methods';
        paymentBtn.setAttribute('onclick', "switchTab('payment-methods')");
        paymentBtn.textContent = 'Moyen de paiement';
        tabs.appendChild(paymentBtn);
    }

    if (!document.getElementById('payment-methods-tab')) {
        const paymentTab = document.createElement('div');
        paymentTab.id = 'payment-methods-tab';
        paymentTab.className = 'tab-content';
        paymentTab.innerHTML = '<div id="payment-methods-items" class="space-y-3"></div>';
        modalBody.appendChild(paymentTab);
    }
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

async function restoreSessionFromServer() {
    if (!currentSessionToken) return;
    try {
        const res = await fetch(`/api?action=session&token=${encodeURIComponent(currentSessionToken)}`);
        if (!res.ok) {
            saveSessionToken(null);
            return;
        }
        const data = await res.json();
        if (!data.user) return;
        currentUser = data.user;
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
    return links[category] || 'index.html';
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
    window.location.href = withLanguageParam(`product-detail.html?id=${product.id}&category=${product.category}`, getCurrentLanguage());
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
            <p class="text-white text-sm font-semibold">${m.username} (${m.email})</p>
            <p class="text-gray-400 text-xs">Inscrit le ${m.createdAt ? new Date(m.createdAt).toLocaleDateString('fr-FR') : '-'} - ${m.purchaseCount || 0} achat(s)</p>
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

        const totalRevenue = document.getElementById('admin-total-revenue');
        const activeNow = document.getElementById('admin-active-now');
        const totalMembers = document.getElementById('admin-total-members');

        if (totalRevenue) totalRevenue.textContent = `${Number(data.summary?.totalRevenue || 0).toFixed(2)} EUR`;
        if (activeNow) activeNow.textContent = String(data.summary?.activeNow || 0);
        if (totalMembers) totalMembers.textContent = String(data.summary?.totalMembers || 0);

        renderAdminPurchases(data.purchases || []);
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
    renderPurchaseHistory();
}

// ==================== PURCHASE HISTORY ====================

function renderPurchaseHistory() {
    const container = document.getElementById('history-items');

    if (purchaseHistory.length === 0) {
        container.innerHTML = `<p class="text-gray-400 text-center py-8">${langText('Aucun historique d\'achat', 'No purchase history')}</p>`;
        return;
    }

    container.innerHTML = purchaseHistory.map(purchase => {
        const items = JSON.parse(purchase.items);
        return `
            <div class="p-4 rounded-lg bg-white/5 border border-white/10">
                <div class="flex justify-between items-start mb-2">
                    <div>
                        <p class="text-white font-semibold">${items.map(i => i.title).join(', ')}</p>
                        <p class="text-gray-400 text-sm">${new Date(purchase.date).toLocaleDateString('fr-FR')}</p>
                    </div>
                    <span class="text-white font-bold">${purchase.total} EUR</span>
                </div>
                ${purchase.promoCode ? `<p class="text-green-400 text-xs"><span class="promo-tag">${purchase.promoCode}</span></p>` : ''}
            </div>
        `;
    }).join('');
}

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
            upsertLocalUser(user);
            try {
                purchaseHistory = JSON.parse(user.purchaseHistory || '[]');
            } catch (e) {
                purchaseHistory = [];
            }
            updateCartInDB();
            updateCartUI();

            updateAuthUI();
            closeModal('auth-modal');
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
            try {
                purchaseHistory = JSON.parse(user.purchaseHistory || '[]');
            } catch (e) {
                purchaseHistory = [];
            }
            updateCartInDB();
            updateCartUI();

            updateAuthUI();
            closeModal('auth-modal');
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
            closeModal('auth-modal');
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
            purchaseHistory = [];
            upsertLocalUser(newUser);
            updateCartInDB();
            updateCartUI();
            updateAuthUI();
            closeModal('auth-modal');
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

    // Keep profile button visually identical to the connexion button.
    if (profileBtn) {
        profileBtn.classList.remove('btn-secondary');
        profileBtn.classList.add('btn-primary');
        profileBtn.textContent = 'PROFIL';
        profileBtn.onclick = showProfile;
    }

    if (currentUser) {
        if (authBtn) {
            authBtn.classList.add('hidden');
            authBtn.style.display = 'none';
        }
        if (profileBtn) {
            profileBtn.classList.remove('hidden');
            profileBtn.style.display = 'block';
        }
    } else {
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

function showAuth() {
    document.getElementById('auth-modal').classList.add('active');
    switchTab('login');
}

function showCart() {
    const path = window.location.pathname || '';
    const inPagesFolder = /\/pages\//.test(path);
    const cartPath = inPagesFolder ? 'cart.html' : 'pages/cart.html';
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

    document.getElementById('profile-username').textContent = currentUser.username;
    document.getElementById('profile-email').textContent = currentUser.email;
    const joinedDate = currentUser.createdAt ? new Date(currentUser.createdAt).toLocaleDateString('fr-FR') : '-';
    document.getElementById('profile-joined').textContent = joinedDate;
    renderPurchaseHistory();
    renderPaymentMethods();
    switchTab('profile-info');
    document.getElementById('profile-modal').classList.add('active');
}

function closeModal(modalId) {
    const modal = document.getElementById(modalId);
    if (!modal) return;
    modal.classList.remove('active');
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

    const observer = new MutationObserver(() => {
        scheduleLanguageRefresh(getCurrentLanguage());
    });

    observer.observe(document.body, {
        childList: true,
        subtree: true,
        attributes: true,
        attributeFilter: ['placeholder', 'title', 'aria-label', 'href']
    });
}

// Initialize translations on page load
function initializeTranslations() {
    const currentLang = resolveInitialLanguage();
    window.history.replaceState({}, '', withLanguageParam(window.location.href, currentLang));
    applyFullLanguageState(currentLang);
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
    setupLanguageMutationObserver();
    
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
    
    // load users from backend
    await loadUsersFromServer();

    // restore server-side session if present
    await restoreSessionFromServer();
    updateAuthUI();
    enforceAdminPageAccess();
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

    refreshFooterVisibility();
    window.addEventListener('resize', refreshFooterVisibility);
});


