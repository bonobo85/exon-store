// Translations - All french and english content for the website
const translations = {
    'fr': {
        // Navigation
        'nav.home': 'Accueil',
        'nav.cars': 'Cars',
        'nav.scripts': 'Scripts',
        'nav.clothes': 'Clothes',
        'nav.templates': 'Templates',
        'nav.about': 'About',
        'nav.admin': 'Admin',
        'nav.search': 'Rechercher un produit...',
        'nav.connection': 'CONNEXION',
        'nav.profile': 'Profil',
        
        // Hero Section
        'hero.new_content': 'Nouveau contenu disponible',
        'hero.title_part1': 'PREMIUM',
        'hero.title_part2': 'FIVEM RESOURCES',
        'hero.description': 'Découvrez notre collection exclusive de scripts, vêtements et templates de haute qualité pour votre serveur FiveM.',
        'hero.explore_shop': 'Explorer la boutique',
        'hero.join_discord': 'Rejoindre Discord',
        'hero.stat_customers': 'Clients satisfaits',
        'hero.stat_products': 'Produits',
        'hero.stat_support': 'Support',
        
        // Products Sections
        'products.popular_title': 'PRODUITS POPULAIRES',
        'products.popular_desc': 'Nos ressources les plus appréciées par la communauté',
        'products.recent_title': 'RÉCEMMENT ACHETÉS',
        'products.recent_desc': 'Les produits achetés récemment par nos clients',
        'products.reviews_title': 'AVIS CLIENTS',
        'products.reviews_desc': 'Ce que nos clients pensent de nos services',
        'products.view_category': 'Voir la categorie',

        // Product Pages Static Content
        'page.cars.title': 'NOS VÉHICULES',
        'page.cars.desc': 'Découvrez notre collection exclusive de modèles de voitures pour FiveM',
        'page.scripts.title': 'NOS SCRIPTS',
        'page.scripts.desc': 'Scripts optimisés et performants pour votre serveur FiveM',
        'page.clothes.title': 'NOS VÊTEMENTS',
        'page.clothes.desc': 'Vêtements et accessoires uniques pour personnaliser vos personnages',
        'page.templates.title': 'NOS TEMPLATES',
        'page.templates.desc': 'Templates et UI prêts à l\'emploi pour vos projets',
        'page.filter.civil': 'Civil',
        'page.filter.police': 'Police',
        'page.filter.ambulance': 'Ambulance',
        'page.filter.pack': 'Pack',
        'page.filter.seasonal': 'Seasonal',
        'page.filter.free': 'Free',
        'page.sub.glasslight_marked': 'Glasslight Marked',
        'page.sub.glasslight_unmarked': 'Glasslight Unmarked',
        'page.sub.els_marked': 'ELS Marked',
        'page.sub.els_unmarked': 'ELS Unmarked',
        'page.sub.non_els_marked': 'Non-ELS Marked',
        'page.sub.non_els_unmarked': 'Non-ELS Unmarked',
        'page.season.spring': 'Printemps',
        'page.season.summer': 'Été',
        'page.season.autumn': 'Automne',
        'page.season.winter': 'Hiver',
        'page.footer.navigation': 'Navigation',
        'page.footer.support': 'Support',
        'page.footer.brand_desc': 'Votre source de confiance pour des ressources FiveM de haute qualité. Scripts, vêtements et templates pour créer le serveur parfait.',
        'page.footer.documentation': 'Documentation',
        'page.footer.terms': 'Conditions',
        'page.footer.rights': '© 2026 Exon. Tous droits réservés.',
        'page.meta.cars': 'Exon Store - Voitures',
        'page.meta.scripts': 'Exon Store - Scripts',
        'page.meta.clothes': 'Exon Store - Vêtements',
        'page.meta.templates': 'Exon Store - Templates',
        'page.meta.product_detail': 'Exon Store - Détail Produit',

        // Product Detail Static Content
        'detail.back': 'Retour',
        'detail.preview_alt': 'Aperçu produit',
        'detail.aria.prev_image': 'Image précédente',
        'detail.aria.next_image': 'Image suivante',
        'detail.aria.thumbs_left': 'Défiler les miniatures à gauche',
        'detail.aria.thumbs_right': 'Défiler les miniatures à droite',
        'detail.discord_support': 'SUPPORT DISCORD',
        'detail.youtube_channel': 'CHAÎNE YOUTUBE',
        'detail.overview': '📋 Aperçu',
        'detail.key_features': '🔥 Caractéristiques Principales',
        'detail.technical_details': '📦 Détails Techniques',
        'detail.important_info': '📜 Informations Importantes',
        'detail.purchase': '💳 ACHAT',
        'detail.vat_included': 'TVA incluse',
        'detail.add_to_cart': 'AJOUTER AU PANIER',
        'detail.secure_payment': 'Paiement sécurisé',
        'detail.instant_delivery': 'Livraison instantanée',
        'detail.support_24_7': 'Support 24/7',
        'detail.related_products': 'Produits similaires',
        
        // Cart
        'cart.title': 'Panier',
        'cart.empty': 'Votre panier est vide',
        'cart.view_details': 'Voir les détails',
        'cart.payment_method': 'Moyen de paiement',
        'cart.total': 'Total',
        'cart.checkout': 'Procéder au paiement',
        'cart.continue_shopping': 'Continuer vos achats',
        'cart.add_payment': 'Ajouter un moyen de paiement',
        'cart.no_payment_methods': 'Aucun moyen de paiement enregistré',
        
        // Auth Modal
        'auth.title': 'Connexion / Inscription',
        'auth.login_tab': 'Connexion',
        'auth.register_tab': 'Inscription',
        'auth.email_label': 'Email',
        'auth.email': 'votre@email.com',
        'auth.password_label': 'Mot de passe',
        'auth.password': 'Mot de passe',
        'auth.username_label': 'Nom d\'utilisateur',
        'auth.username': 'mon_pseudo',
        'auth.confirm_password_label': 'Confirmer le mot de passe',
        'auth.confirm_password': 'Confirmation',
        'auth.login_button': 'Se connecter',
        'auth.register_button': 'S\'inscrire',
        'auth.google_login': 'Se connecter avec Google',
        'auth.google_register': 'S\'inscrire avec Google',
        'auth.member_space': 'Espace membre',
        'auth.hero_title': 'Rejoins Exon Store',
        'auth.hero_subtitle': 'Accede a ton profil, ton historique et finalise tes commandes en un clic.',
        'auth.close_aria': 'Fermer la fenetre d\'authentification',
        'auth.or_divider': 'ou',
        'auth.forgot_password': 'Mot de passe oublié?',
        'auth.error': 'Erreur d\'authentification',
        'auth.success': 'Connecté avec succès',
        'auth.already_exists': 'Cet utilisateur existe déjà',
        'auth.invalid_credentials': 'Email ou mot de passe invalide',
        'auth.email_required': 'Email requis',
        'auth.password_required': 'Mot de passe requis',
        'auth.username_required': 'Nom d\'utilisateur requis',
        'auth.password_mismatch': 'Les mots de passe ne correspondent pas',
        'auth.no_account': 'Aucun compte avec cet email. Inscrivez-vous.',
        'auth.login_failed': 'Connexion échouée : email/nom d\'utilisateur ou mot de passe incorrect.',
        'auth.login_wrong_password': 'Connexion échouée : mot de passe incorrect.',
        'auth.email_in_use': 'Cet email est déjà utilisé',
        'auth.email_or_username_in_use': 'Cet email ou nom d\'utilisateur est déjà utilisé',
        'auth.register_success': 'Inscription réussie !',
        'auth.register_success_local': 'Inscription réussie ! (mode local)',
        
        // Profile
        'profile.title': 'Mon Profil',
        'profile.username': 'Pseudonyme',
        'profile.email': 'Email',
        'profile.purchase_history': 'Historique des achats',
        'profile.downloads': 'Téléchargements',
        'profile.settings': 'Paramètres',
        'profile.logout': 'Déconnexion',
        'profile.no_purchases': 'Aucun achat pour le moment',
        
        // Product Categories
        'category.cars': 'Voitures',
        'category.scripts': 'Scripts',
        'category.clothes': 'Vêtements',
        'category.templates': 'Modèles',
        
        // Common
        'common.close': 'Fermer',
        'common.search': 'Rechercher',
        'common.filter': 'Filtrer',
        'common.sort': 'Trier',
        'common.price': 'Prix',
        'common.buy': 'Acheter',
        'common.add_to_cart': 'Ajouter au panier',
        'common.remove': 'Supprimer',
        'common.select': 'Sélectionner',
        'common.save': 'Enregistrer',
        'common.cancel': 'Annuler',
        'common.loading': 'Chargement...',
        'common.error': 'Une erreur s\'est produite',
        'common.success': 'Opération réussie',
        'common.select_file': 'Sélectionnez un fichier',
        'common.import_success': 'Importation terminée',
        'common.import_error': 'Erreur lors de l\'importation',
        'common.network_error': 'Erreur réseau',
        'common.promo_code': 'PROMO2024',
        
        // About Page
        'about.title': 'À Propos',
        'about.description': 'En savoir plus sur Exon Store',
        'about.main_title': 'À PROPOS D\'EXON',
        'about.main_description': 'Une équipe de jeunes devs qui construit les ressources utiles que les serveurs attendent vraiment',
        'about.story_title': 'Notre Histoire',
        'about.story_part1': 'Exon, c\'est d\'abord une bande de jeunes développeurs passionnés qui veulent aider les serveurs là où beaucoup ne veulent pas s\'impliquer: les tâches techniques longues, répétitives et complexes.',
        'about.story_part2': 'On transforme ces besoins en solutions concrètes, propres et prêtes à l\'emploi, pour que chaque créateur puisse se concentrer sur son projet au lieu de perdre du temps sur des blocages techniques.',
        'about.mission_title': 'Notre Mission',
        'about.mission_intro': 'Notre mission est simple: proposer des produits utiles, robustes et accessibles pour tous les types de serveurs et de projets.',
        'about.mission_1': '✓ Développer des scripts performants et faciles à intégrer',
        'about.mission_2': '✓ Créer des vêtements et des véhicules de tout type',
        'about.mission_3': '✓ Proposer des templates pour bots et sites internet',
        'about.mission_4': '✓ Maintenir et améliorer nos produits avec les retours de la communauté',
        
        // Admin
        'admin.title': 'Panneau d\'administration',
        'admin.manage_products': 'Gérer les produits',
        'admin.manage_users': 'Gérer les utilisateurs',
        'admin.view_logs': 'Voir les journaux',
        'admin.import_data': 'Importer des données',
        
        // Payments
        'payment.card': 'Carte bancaire',
        'payment.paypal': 'PayPal',
        'payment.stripe': 'Stripe',
        'payment.add_new': 'Ajouter une nouvelle méthode',
        'payment.delete': 'Supprimer',
        'payment.default': 'Par défaut',
        
        // Language Selector
        'lang.select': 'Langue',
        'lang.french': 'Français',
        'lang.english': 'English',
    },
    'en': {
        // Navigation
        'nav.home': 'Home',
        'nav.cars': 'Cars',
        'nav.scripts': 'Scripts',
        'nav.clothes': 'Clothes',
        'nav.templates': 'Templates',
        'nav.about': 'About',
        'nav.admin': 'Admin',
        'nav.search': 'Search for a product...',
        'nav.connection': 'LOGIN',
        'nav.profile': 'Profile',
        
        // Hero Section
        'hero.new_content': 'New content available',
        'hero.title_part1': 'PREMIUM',
        'hero.title_part2': 'FIVEM RESOURCES',
        'hero.description': 'Discover our exclusive collection of high-quality scripts, clothing and templates for your FiveM server.',
        'hero.explore_shop': 'Explore the shop',
        'hero.join_discord': 'Join Discord',
        'hero.stat_customers': 'Satisfied Customers',
        'hero.stat_products': 'Products',
        'hero.stat_support': '24/7 Support',
        
        // Products Sections
        'products.popular_title': 'POPULAR PRODUCTS',
        'products.popular_desc': 'Our most appreciated resources by the community',
        'products.recent_title': 'RECENTLY PURCHASED',
        'products.recent_desc': 'Products recently purchased by our customers',
        'products.reviews_title': 'CUSTOMER REVIEWS',
        'products.reviews_desc': 'What our customers think about our services',
        'products.view_category': 'View category',

        // Product Pages Static Content
        'page.cars.title': 'OUR VEHICLES',
        'page.cars.desc': 'Discover our exclusive collection of FiveM vehicle models',
        'page.scripts.title': 'OUR SCRIPTS',
        'page.scripts.desc': 'Optimized and high-performance scripts for your FiveM server',
        'page.clothes.title': 'OUR CLOTHES',
        'page.clothes.desc': 'Unique clothing and accessories to customize your characters',
        'page.templates.title': 'OUR TEMPLATES',
        'page.templates.desc': 'Ready-to-use templates and UI for your projects',
        'page.filter.civil': 'Civil',
        'page.filter.police': 'Police',
        'page.filter.ambulance': 'Ambulance',
        'page.filter.pack': 'Pack',
        'page.filter.seasonal': 'Seasonal',
        'page.filter.free': 'Free',
        'page.sub.glasslight_marked': 'Glasslight Marked',
        'page.sub.glasslight_unmarked': 'Glasslight Unmarked',
        'page.sub.els_marked': 'ELS Marked',
        'page.sub.els_unmarked': 'ELS Unmarked',
        'page.sub.non_els_marked': 'Non-ELS Marked',
        'page.sub.non_els_unmarked': 'Non-ELS Unmarked',
        'page.season.spring': 'Spring',
        'page.season.summer': 'Summer',
        'page.season.autumn': 'Autumn',
        'page.season.winter': 'Winter',
        'page.footer.navigation': 'Navigation',
        'page.footer.support': 'Support',
        'page.footer.brand_desc': 'Your trusted source for high-quality FiveM resources. Scripts, clothes, and templates to build the perfect server.',
        'page.footer.documentation': 'Documentation',
        'page.footer.terms': 'Terms',
        'page.footer.rights': '© 2026 Exon. All rights reserved.',
        'page.meta.cars': 'Exon Store - Cars',
        'page.meta.scripts': 'Exon Store - Scripts',
        'page.meta.clothes': 'Exon Store - Clothes',
        'page.meta.templates': 'Exon Store - Templates',
        'page.meta.product_detail': 'Exon Store - Product Detail',

        // Product Detail Static Content
        'detail.back': 'Back',
        'detail.preview_alt': 'Product preview',
        'detail.aria.prev_image': 'Previous image',
        'detail.aria.next_image': 'Next image',
        'detail.aria.thumbs_left': 'Scroll thumbnails left',
        'detail.aria.thumbs_right': 'Scroll thumbnails right',
        'detail.discord_support': 'DISCORD SUPPORT',
        'detail.youtube_channel': 'YOUTUBE CHANNEL',
        'detail.overview': '📋 Overview',
        'detail.key_features': '🔥 Key Features',
        'detail.technical_details': '📦 Technical Details',
        'detail.important_info': '📜 Important Information',
        'detail.purchase': '💳 PURCHASE',
        'detail.vat_included': 'VAT included',
        'detail.add_to_cart': 'ADD TO CART',
        'detail.secure_payment': 'Secure payment',
        'detail.instant_delivery': 'Instant delivery',
        'detail.support_24_7': '24/7 support',
        'detail.related_products': 'Related products',
        
        // Cart
        'cart.title': 'Cart',
        'cart.empty': 'Your cart is empty',
        'cart.view_details': 'View details',
        'cart.payment_method': 'Payment method',
        'cart.total': 'Total',
        'cart.checkout': 'Proceed to checkout',
        'cart.continue_shopping': 'Continue shopping',
        'cart.add_payment': 'Add payment method',
        'cart.no_payment_methods': 'No payment methods registered',
        
        // Auth Modal
        'auth.title': 'Login / Register',
        'auth.login_tab': 'Login',
        'auth.register_tab': 'Register',
        'auth.email_label': 'Email',
        'auth.email': 'your@email.com',
        'auth.password_label': 'Password',
        'auth.password': 'Password',
        'auth.username_label': 'Username',
        'auth.username': 'your_username',
        'auth.confirm_password_label': 'Confirm password',
        'auth.confirm_password': 'Confirm password',
        'auth.login_button': 'Sign in',
        'auth.register_button': 'Sign up',
        'auth.google_login': 'Sign in with Google',
        'auth.google_register': 'Sign up with Google',
        'auth.member_space': 'Member area',
        'auth.hero_title': 'Join Exon Store',
        'auth.hero_subtitle': 'Access your profile, your history, and complete your orders in one click.',
        'auth.close_aria': 'Close authentication window',
        'auth.or_divider': 'or',
        'auth.forgot_password': 'Forgot password?',
        'auth.error': 'Authentication error',
        'auth.success': 'Successfully logged in',
        'auth.already_exists': 'This user already exists',
        'auth.invalid_credentials': 'Invalid email or password',
        'auth.email_required': 'Email required',
        'auth.password_required': 'Password required',
        'auth.username_required': 'Username is required',
        'auth.password_mismatch': 'Passwords do not match',
        'auth.no_account': 'No account found with this email. Please sign up.',
        'auth.login_failed': 'Login failed: incorrect email/username or password.',
        'auth.login_wrong_password': 'Login failed: incorrect password.',
        'auth.email_in_use': 'This email is already used',
        'auth.email_or_username_in_use': 'This email or username is already used',
        'auth.register_success': 'Registration successful!',
        'auth.register_success_local': 'Registration successful! (local mode)',
        
        // Profile
        'profile.title': 'My Profile',
        'profile.username': 'Username',
        'profile.email': 'Email',
        'profile.purchase_history': 'Purchase history',
        'profile.downloads': 'Downloads',
        'profile.settings': 'Settings',
        'profile.logout': 'Logout',
        'profile.no_purchases': 'No purchases yet',
        
        // Product Categories
        'category.cars': 'Cars',
        'category.scripts': 'Scripts',
        'category.clothes': 'Clothes',
        'category.templates': 'Templates',
        
        // Common
        'common.close': 'Close',
        'common.search': 'Search',
        'common.filter': 'Filter',
        'common.sort': 'Sort',
        'common.price': 'Price',
        'common.buy': 'Buy',
        'common.add_to_cart': 'Add to cart',
        'common.remove': 'Remove',
        'common.select': 'Select',
        'common.save': 'Save',
        'common.cancel': 'Cancel',
        'common.loading': 'Loading...',
        'common.error': 'An error occurred',
        'common.success': 'Operation successful',
        'common.select_file': 'Select a file',
        'common.import_success': 'Import completed',
        'common.import_error': 'Error during import',
        'common.network_error': 'Network error',
        'common.promo_code': 'PROMO2024',
        
        // About Page
        'about.title': 'About',
        'about.description': 'Learn more about Exon Store',
        'about.main_title': 'ABOUT EXON',
        'about.main_description': 'A team of young developers building the useful resources that servers really need',
        'about.story_title': 'Our Story',
        'about.story_part1': 'Exon is first and foremost a group of passionate young developers who want to help servers where many don\'t want to get involved: long, repetitive and complex technical tasks.',
        'about.story_part2': 'We transform these needs into concrete, clean and ready-to-use solutions, so that every creator can focus on their project instead of wasting time on technical roadblocks.',
        'about.mission_title': 'Our Mission',
        'about.mission_intro': 'Our mission is simple: to offer useful, robust and accessible products for all types of servers and projects.',
        'about.mission_1': '✓ Develop high-performance scripts that are easy to integrate',
        'about.mission_2': '✓ Create clothing and vehicles of all types',
        'about.mission_3': '✓ Offer templates for bots and websites',
        'about.mission_4': '✓ Maintain and improve our products with community feedback',
        
        // Admin
        'admin.title': 'Administration Panel',
        'admin.manage_products': 'Manage products',
        'admin.manage_users': 'Manage users',
        'admin.view_logs': 'View logs',
        'admin.import_data': 'Import data',
        
        // Payments
        'payment.card': 'Credit card',
        'payment.paypal': 'PayPal',
        'payment.stripe': 'Stripe',
        'payment.add_new': 'Add new method',
        'payment.delete': 'Delete',
        'payment.default': 'Default',
        
        // Language Selector
        'lang.select': 'Language',
        'lang.french': 'Français',
        'lang.english': 'English',
    }
};

// Get current language from localStorage or default to 'fr'
function getCurrentLanguage() {
    return localStorage.getItem('exon_language') || 'fr';
}

// Set language and save to localStorage
function setLanguage(lang) {
    if (lang === 'fr' || lang === 'en') {
        localStorage.setItem('exon_language', lang);
        return true;
    }
    return false;
}

// Get translation for a key
function t(key) {
    const lang = getCurrentLanguage();
    return translations[lang][key] || key;
}

// Translate element content
function translateElement(selector, translationKey) {
    const element = document.querySelector(selector);
    if (element) {
        element.textContent = t(translationKey);
    }
}

// Translate element attribute
function translateAttribute(selector, attribute, translationKey) {
    const element = document.querySelector(selector);
    if (element) {
        element.setAttribute(attribute, t(translationKey));
    }
}

// Translate all elements with data-i18n attribute
function translatePage() {
    const elements = document.querySelectorAll('[data-i18n]');
    elements.forEach(element => {
        const key = element.getAttribute('data-i18n');
        if (key) {
            element.textContent = t(key);
        }
    });
    
    // Translate placeholders
    const placeholders = document.querySelectorAll('[data-i18n-placeholder]');
    placeholders.forEach(element => {
        const key = element.getAttribute('data-i18n-placeholder');
        if (key) {
            element.placeholder = t(key);
        }
    });
    
    // Translate aria-labels
    const ariaLabels = document.querySelectorAll('[data-i18n-aria]');
    ariaLabels.forEach(element => {
        const key = element.getAttribute('data-i18n-aria');
        if (key) {
            element.setAttribute('aria-label', t(key));
        }
    });

    // Translate alt attributes
    const altLabels = document.querySelectorAll('[data-i18n-alt]');
    altLabels.forEach(element => {
        const key = element.getAttribute('data-i18n-alt');
        if (key) {
            element.setAttribute('alt', t(key));
        }
    });
}

const frToEnGlossary = [
    ['Voitures', 'Cars'],
    ['Vêtements', 'Clothes'],
    ['À Propos', 'About'],
    ['À propos', 'About'],
    ['Voir les détails', 'View details'],
    ['Voir la categorie', 'View category'],
    ['Voir la catégorie', 'View category'],
    ['Voir les details', 'View details'],
    ['Voir', 'View'],
    ['Retour', 'Back'],
    ['Produits similaires', 'Related products'],
    ['Paiement sécurisé', 'Secure payment'],
    ['Paiement securise', 'Secure payment'],
    ['Livraison instantanée', 'Instant delivery'],
    ['Livraison instantanee', 'Instant delivery'],
    ['Support 24/7', '24/7 support'],
    ['Aucune caractéristique disponible.', 'No features available.'],
    ['Aucune caracteristique disponible.', 'No features available.'],
    ['Détails techniques disponibles bientôt', 'Technical details coming soon'],
    ['Details techniques disponibles bientot', 'Technical details coming soon'],
    ['Informations complémentaires disponibles bientôt', 'Additional information coming soon'],
    ['Informations complementaires disponibles bientot', 'Additional information coming soon'],
    ['Aucun moyen de paiement enregistré', 'No saved payment methods'],
    ['Aucun moyen de paiement enregistre', 'No saved payment methods'],
    ['Dernière utilisation:', 'Last used:'],
    ['Derniere utilisation:', 'Last used:'],
    ['Moyen disponible pour vos prochaines commandes', 'Method available for your next orders'],
    ['Votre panier est vide', 'Your cart is empty'],
    ['Se connecter pour payer', 'Log in to checkout'],
    ['Passer la commande', 'Place order'],
    ['Supprimer', 'Remove'],
    ['Ressource premium Exon', 'Exon premium resource'],
    ['Diminuer la quantite', 'Decrease quantity'],
    ['Augmenter la quantite', 'Increase quantity'],
    ['Veuillez entrer un code promo', 'Please enter a promo code'],
    ['Code promo applique !', 'Promo code applied!'],
    ['de reduction', 'off'],
    ['Code promo invalide', 'Invalid promo code'],
    ['Le formulaire de paiement est indisponible sur cette page', 'Payment form is unavailable on this page'],
    ['Commande directe', 'Direct order'],
    ['Commande validee. Merci pour votre achat!', 'Order confirmed. Thank you for your purchase!'],
    ['Aucun historique d\'achat', 'No purchase history'],
    ['Aucun compte avec cet email. Inscrivez-vous.', 'No account found with this email. Please sign up.'],
    ['Connexion échouée : email/nom d\'utilisateur ou mot de passe incorrect.', 'Login failed: incorrect email/username or password.'],
    ['Connexion echouee : email/nom d\'utilisateur ou mot de passe incorrect.', 'Login failed: incorrect email/username or password.'],
    ['Connexion échouée : mot de passe incorrect.', 'Login failed: incorrect password.'],
    ['Connexion echouee : mot de passe incorrect.', 'Login failed: incorrect password.'],
    ['Email requis', 'Email required'],
    ['Mot de passe requis', 'Password required'],
    ['Nom d\'utilisateur requis', 'Username is required'],
    ['Les mots de passe ne correspondent pas', 'Passwords do not match'],
    ['Inscription reussie !', 'Registration successful!'],
    ['Inscription réussie !', 'Registration successful!'],
    ['Cet email est déjà utilisé', 'This email is already used'],
    ['Cet email est deja utilise', 'This email is already used'],
    ['Cet email ou nom d\'utilisateur est déjà utilisé', 'This email or username is already used'],
    ['Cet email ou nom d\'utilisateur est deja utilise', 'This email or username is already used'],
    ['Tous droits réservés.', 'All rights reserved.'],
    ['Tous droits reserves.', 'All rights reserved.'],
    ['Votre source de confiance pour des ressources FiveM de haute qualité.', 'Your trusted source for high-quality FiveM resources.'],
    ['Votre source de confiance pour des ressources FiveM de haute qualite.', 'Your trusted source for high-quality FiveM resources.'],
    ['TVA incluse', 'VAT included'],
    ['AJOUTER AU PANIER', 'ADD TO CART'],
    ['GRATUIT', 'FREE'],
    ['NOUVEAU', 'NEW'],
    ['PACK', 'BUNDLE'],
    ['Inscrit le', 'Joined on'],
    ['achat(s)', 'purchase(s)'],
    ['Aucun membre trouve.', 'No members found.'],
    ['Aucun achat trouve.', 'No purchases found.'],
    ['Pas assez de donnees de session.', 'Not enough session data.'],
    ['Pas assez de données de session.', 'Not enough session data.'],
    ['Membre depuis :', 'Member since:'],
    ['Membre depuis:', 'Member since:'],
    ['Nom :', 'Name:'],
    ['Nom:', 'Name:'],
    ['Déconnexion', 'Logout'],
    ['Deconnexion', 'Logout'],
    ['Informations', 'Information'],
    ['Historique', 'History'],
    ['Moyen de paiement', 'Payment method'],
    ['Finaliser la commande', 'Complete order'],
    ['Connectez-vous pour finaliser le paiement.', 'Log in to complete checkout.'],
    ['Paiement en ligne indisponible. Vous pouvez confirmer votre commande maintenant.', 'Online payment is unavailable. You can confirm your order now.'],
    ['Confirmer la commande', 'Confirm order'],
    ['Sélectionnez un fichier', 'Select a file'],
    ['Selectionnez un fichier', 'Select a file'],
    ['Importation terminée', 'Import completed'],
    ['Importation terminee', 'Import completed'],
    ['Erreur lors de l\'importation', 'Import failed'],
    ['Erreur réseau', 'Network error'],
    ['Erreur reseau', 'Network error'],
    ['Aucune donnée à exporter', 'No data to export'],
    ['Aucune donnee a exporter', 'No data to export'],
    ['Aucun produit trouvé', 'No products found'],
    ['Aucun produit trouve', 'No products found'],

    // Product-specific wording
    ['Break sportif premium', 'Premium sport wagon'],
    ['circulation civile', 'civilian driving'],
    ['équilibré et réaliste', 'balanced and realistic'],
    ['Intercepteur police', 'Police interceptor'],
    ['complet avec setup sirènes et équipement RP', 'complete with siren setup and RP equipment'],
    ['Voiture de police banalisée', 'Unmarked police car'],
    ['Voiture de patrouille officielle', 'Official patrol car'],
    ['Véhicule police banalisé', 'Unmarked police vehicle'],
    ['Véhicule de patrouille marqué', 'Marked patrol vehicle'],
    ['Ambulance moderne', 'Modern ambulance'],
    ['livrée médicale officielle', 'official medical livery'],
    ['Ambulance banalisée', 'Unmarked ambulance'],
    ['système ELS complet', 'full ELS system'],
    ['sirènes ELS cachées', 'hidden ELS sirens'],
    ['Ambulance classique', 'Classic ambulance'],
    ['sirènes standard', 'standard sirens'],
    ['Pack de véhicules multi-usages', 'Multi-purpose vehicle pack'],
    ['serveur FiveM', 'FiveM server'],
    ['Édition limitée', 'Limited edition'],
    ['édition saisonnière', 'seasonal edition'],
    ['avec style hivernal', 'with winter styling'],
    ['palette fleurie', 'floral palette'],
    ['teintes chaudes', 'warm tones'],
    ['setup route longue', 'long-distance setup'],
    ['prêt à l\'emploi', 'ready to use'],
    ['prêt serveur RP', 'RP-server ready'],
    ['haute qualité', 'high quality'],
    ['optimisé', 'optimized'],
    ['optimisee', 'optimized'],
    ['banalisé', 'unmarked'],
    ['banalisée', 'unmarked'],
    ['marqué', 'marked'],
    ['marquée', 'marked'],
    ['sirènes', 'sirens'],
    ['sirene', 'siren'],
    ['véhicule', 'vehicle'],
    ['vehicule', 'vehicle'],
    ['voiture', 'car'],
    ['ambulance', 'ambulance'],
    ['police', 'police'],
    ['détaillé', 'detailed'],
    ['detaille', 'detailed'],
    ['compatibilité', 'compatibility'],
    ['compatibilite', 'compatibility'],
    ['support technique inclus', 'technical support included'],
    ['installation rapide et guidée', 'fast guided installation'],
    ['mises à jour gratuites', 'free updates'],
    ['confort', 'comfort'],
    ['discrétion', 'discretion'],
    ['discrete', 'discreet'],
    ['édition', 'edition'],
    ['edition', 'edition'],
    ['Civil', 'Civil'],
    ['Voiture', 'Car'],
    
    // Features translations
    ['FiveM Ready', 'FiveM Ready'],
    ['Textures HD haute qualité', 'High quality HD textures'],
    ['Handling équilibré et réaliste', 'Balanced and realistic handling'],
    ['Intérieur détaillé', 'Detailed interior'],
    ['Fenêtres teintables', 'Tintable windows'],
    ['Cartographie réaliste des salissures', 'Realistic dirt mapping'],
    ['Personnalisation complète', 'Full customization'],
    ['Optimisé pour les performances', 'Performance optimized'],
    ['Livrée police personnalisée', 'Custom police livery'],
    ['Sirènes configurées (Glass Light)', 'Configured sirens (Glass Light)'],
    ['Extras inclus (équipement police)', 'Included extras (police equipment)'],
    ['Prêt serveur RP', 'RP-server ready'],
    ['Handling optimisé poursuite', 'Optimized pursuit handling'],
    ['Intérieur détaillé police', 'Detailed police interior'],
    ['Lightbar fonctionnelle', 'Functional lightbar'],
    ['Compatibilité ELS', 'ELS compatibility'],
    ['Apparence civile banalisée', 'Unmarked civilian appearance'],
    ['Sirènes ELS cachées', 'Hidden ELS sirens'],
    ['Équipement discret intégré', 'Integrated discreet equipment'],
    ['Missions undercover', 'Undercover missions'],
    ['Handling police optimisé', 'Optimized police handling'],
    ['Intérieur civil modifié', 'Modified civilian interior'],
    ['Radio police cachée', 'Hidden police radio'],
    ['Surveillance discrète', 'Discreet surveillance'],
    ['Livrée police officielle marquée', 'Marked official police livery'],
    ['Système ELS complet', 'Full ELS system'],
    ['Lightbar haute visibilité', 'High visibility lightbar'],
    ['Patrouille urbaine optimisée', 'Optimized urban patrol'],
    ['Radio et équipement RP', 'Radio and RP equipment'],
    ['Extras police configurables', 'Configurable police extras'],
    ['Handling stable', 'Stable handling'],
    ['Intérieur police détaillé', 'Detailed police interior'],
    ['100% civil en apparence', '100% civilian appearance'],
    ['Sans système ELS', 'No ELS system'],
    ['Discrétion maximale', 'Maximum discretion'],
    ['Polyvalent RP', 'Versatile RP'],
    ['Budget friendly', 'Budget friendly'],
    ['Handling civil modifié', 'Modified civilian handling'],
    ['Installation simple', 'Simple installation'],
    ['Compatible tous frameworks', 'Compatible all frameworks'],
    ['Livrée police marquée', 'Marked police livery'],
    ['Sans ELS', 'No ELS'],
    ['Sirènes natives GTA', 'Native GTA sirens'],
    ['Sirènes simples', 'Simple sirens'],
    ['Budget', 'Budget'],
    ['Extras basiques inclus', 'Basic extras included'],
    ['Style classique', 'Classic style'],
    ['SUV utilitaire police', 'Police utility SUV'],
    ['Glasslight intégrée', 'Integrated glasslight'],
    ['Configuration banalisée', 'Unmarked configuration'],
    ['Grande capacité', 'Large capacity'],
    ['Handling robuste', 'Robust handling'],
    ['Intérieur équipé', 'Equipped interior'],
    ['Extras configurables', 'Configurable extras'],
    ['SUV Explorer premium', 'Premium Explorer SUV'],
    ['Banalisé 100% civil', '100% civilian unmarked'],
    ['Haute performance', 'High performance'],
    ['Équipement caché', 'Hidden equipment'],
    ['Missions avancées', 'Advanced missions'],
    ['Handling SUV optimisé', 'Optimized SUV handling'],
    ['Glasslight visible intégrée', 'Integrated visible glasslight'],
    ['Livrée EMS officielle', 'Official EMS livery'],
    ['Intérieur médical complet', 'Complete medical interior'],
    ['Animations compatibles', 'Compatible animations'],
    ['Équipement médical détaillé', 'Detailed medical equipment'],
    ['Optimisé serveur RP', 'RP-server optimized'],
    ['Brancards et accessoires', 'Stretchers and accessories'],
    ['Sirènes médicales', 'Medical sirens'],
    ['Glasslight discrète cachée', 'Hidden discreet glasslight'],
    ['Sans livrée visible', 'No visible livery'],
    ['Intérieur médical équipé', 'Equipped medical interior'],
    ['Missions spéciales EMS', 'EMS special missions'],
    ['Apparence civile', 'Civilian appearance'],
    ['Équipement complet intérieur', 'Complete interior equipment'],
    ['Transferts confidentiels', 'Confidential transfers'],
    ['Livrée médicale marquée', 'Marked medical livery'],
    ['Haute visibilité maximale', 'Maximum high visibility'],
    ['Équipement médical complet', 'Complete medical equipment'],
    ['Patterns ELS multiples', 'Multiple ELS patterns'],
    ['Sirènes synchronisées', 'Synchronized sirens'],
    ['Lightbar professionnelle', 'Professional lightbar'],
    ['Urgences haute priorité', 'High priority emergencies'],
    ['Sans livrée externe', 'No external livery'],
    ['Discrétion totale', 'Total discretion'],
    ['Opérations spéciales EMS', 'EMS special operations'],
    ['Configuration ELS avancée', 'Advanced ELS configuration'],
    ['Missions confidentielles', 'Confidential missions'],
    ['Sirènes standard GTA', 'Standard GTA sirens'],
    ['Livrée EMS marquée', 'Marked EMS livery'],
    ['Parfait serveurs débutants', 'Perfect for beginner servers'],
    ['Plug and play', 'Plug and play'],
    ['100% banalisée', '100% unmarked'],
    ['Prix abordable', 'Affordable price'],
    ['Installation immédiate', 'Instant installation'],
    ['Transferts basiques', 'Basic transfers'],
    ['Apparence civile pure', 'Pure civilian appearance'],
    ['Budget optimal', 'Optimal budget'],
    ['8 véhicules inclus', '8 vehicles included'],
    ['Mix civil et service', 'Mix civilian and service'],
    ['Bundle économique (-30%)', 'Economic bundle (-30%)'],
    ['Tous FiveM Ready', 'All FiveM Ready'],
    ['Documentation complète', 'Complete documentation'],
    ['Support prioritaire', 'Priority support'],
    ['Mises à jour gratuites', 'Free updates'],
    ['Édition limitée exclusive', 'Exclusive limited edition'],
    ['Skin hivernal unique', 'Unique winter skin'],
    ['Réglages neige adaptés', 'Adapted snow settings'],
    ['Compatible RP hiver', 'Winter RP compatible'],
    ['Textures givre et neige', 'Frost and snow textures'],
    ['Handling conditions froides', 'Cold weather handling'],
    ['Décors saisonniers', 'Seasonal decorations'],
    ['Collection limitée', 'Limited collection'],
    ['Edition limitée printemps', 'Spring limited edition'],
    ['Skin printanier exclusif', 'Exclusive spring skin'],
    ['Conduite fluide optimisée', 'Optimized smooth driving'],
    ['Compatible RP saison', 'Season RP compatible'],
    ['Palette couleurs pastel', 'Pastel color palette'],
    ['Décors floraux', 'Floral decorations'],
    ['Style urbain frais', 'Fresh urban style'],
    ['Collection exclusive', 'Exclusive collection'],
    ['Edition limitée été', 'Summer limited edition'],
    ['Skin estival vibrant', 'Vibrant summer skin'],
    ['Style cabriolet ouvert', 'Open convertible style'],
    ['Compatible RP plage', 'Beach RP compatible'],
    ['Couleurs soleil', 'Sunny colors'],
    ['Handling cruising', 'Cruising handling'],
    ['Atmosphère vacances', 'Vacation atmosphere'],
    ['Edition limitée automne', 'Autumn limited edition'],
    ['Skin automnal unique', 'Unique autumn skin'],
    ['Confort touring optimisé', 'Optimized touring comfort'],
    ['Compatible RP long trajet', 'Long journey RP compatible'],
    ['Teintes chaudes', 'Warm tones'],
    ['Atmosphère cosy', 'Cozy atmosphere'],
    ['Style break familial', 'Family wagon style'],
    ['Berline sport premium', 'Premium sport sedan'],
    ['Finitions luxe HD', 'HD luxury finishes'],
    ['Animations fluides', 'Smooth animations'],
    ['Textures haute qualité', 'High quality textures'],
    ['Intérieur cuir détaillé', 'Detailed leather interior'],
    ['Handling sport équilibré', 'Balanced sport handling'],
    ['Performance optimisée', 'Optimized performance'],
    ['SUV premium iconique', 'Iconic premium SUV'],
    ['Capacités tout-terrain', 'Off-road capabilities'],
    ['Handling robuste optimisé', 'Optimized robust handling'],
    ['Détails réalistes HD', 'HD realistic details'],
    ['Intérieur luxe complet', 'Complete luxury interior'],
    ['Hauteur de caisse ajustée', 'Adjusted ride height'],
    ['Polyvalent urbain/off-road', 'Versatile urban/off-road'],
    ['Personnalisation avancée', 'Advanced customization'],
    ['Multi-garage support', 'Multi-garage support'],
    ['Customisation 3D', '3D customization'],
    ['Système assurance', 'Insurance system'],
    ['Location véhicules', 'Vehicle rental'],
    ['Support ESX/QBCore', 'ESX/QBCore support'],
    ['15+ applications', '15+ applications'],
    ['Système messaging', 'Messaging system'],
    ['Appels multijoueurs', 'Multiplayer calls'],
    ['Banque intégrée', 'Integrated banking'],
    ['Design modern UI', 'Modern UI design'],
    ['Comptes bancaires multiples', 'Multiple bank accounts'],
    ['Transferts bancaires sécurisés', 'Secure bank transfers'],
    ['Système de prêts avancé', 'Advanced loan system'],
    ['Cartes bancaires virtuelles', 'Virtual bank cards'],
    ['Rapports financiers détaillés', 'Detailed financial reports'],
    ['Interface UI moderne', 'Modern UI interface'],
    ['Historique transactions', 'Transaction history'],
    ['Emplois modulables', 'Modular jobs'],
    ['Système grades', 'Rank system'],
    ['Missions RP', 'RP missions'],
    ['Salaires dynamiques', 'Dynamic salaries'],
    ['Support multi-framework', 'Multi-framework support'],
    ['Alarmes intégrées configurable', 'Configurable integrated alarms'],
    ['Caméras de surveillance', 'Surveillance cameras'],
    ['Butins variés aléatoires', 'Varied random loot'],
    ['Pénalités policières dynamiques', 'Dynamic police penalties'],
    ['Animations réalistes complètes', 'Complete realistic animations'],
    ['Système de risque avancé', 'Advanced risk system'],
    ['Multi-maisons support', 'Multi-house support'],
    ['Interface minimaliste', 'Minimalist interface'],
    ['50+ vêtements', '50+ clothing items'],
    ['Hoodies et joggers', 'Hoodies and joggers'],
    ['Chaussures incluses', 'Shoes included'],
    ['Accessoires', 'Accessories'],
    ['Tous personnages', 'All characters'],
    ['30+ outfits luxe', '30+ luxury outfits'],
    ['Marques prestige', 'Prestige brands'],
    ['Texture 4K', '4K texture'],
    ['Animations réalistes', 'Realistic animations'],
    ['Détails précis', 'Precise details'],
    ['40+ vêtements motard', '40+ biker clothing'],
    ['Vestes cuir', 'Leather jackets'],
    ['Chaînes et accessoires', 'Chains and accessories'],
    ['Tattoos inclus', 'Tattoos included'],
    ['Style authentique', 'Authentic style'],
    ['35+ tenues business', '35+ business outfits'],
    ['Costumes premium', 'Premium suits'],
    ['Robes formelles', 'Formal dresses'],
    ['Accessoires inclus', 'Accessories included'],
    ['Tous genres', 'All genders'],
    ['Panel admin complet', 'Complete admin panel'],
    ['Gestion rôles', 'Role management'],
    ['Statistiques', 'Statistics'],
    ['Discord OAuth2', 'Discord OAuth2'],
    ['Design moderne', 'Modern design'],
    ['Dashboards interactifs multiples', 'Multiple interactive dashboards'],
    ['Formulaires personnalisables', 'Customizable forms'],
    ['Composants réactifs modernes', 'Modern reactive components'],
    ['Thème sombre et clair', 'Dark and light theme'],
    ['Graphiques et statistiques', 'Charts and statistics'],
    ['Tables de données avancées', 'Advanced data tables'],
    ['Navigation responsive', 'Responsive navigation'],
    ['Documentation complète', 'Complete documentation'],
    ['Forum intégré complet', 'Complete integrated forum'],
    ['Galerie images responsive', 'Responsive image gallery'],
    ['Profils membres personnalisables', 'Customizable member profiles'],
    ['Calendrier événements', 'Event calendar'],
    ['Système de modération', 'Moderation system'],
    ['Statistiques temps réel', 'Real-time statistics'],
    ['Intégration Discord', 'Discord integration'],
    ['Panneau admin puissant', 'Powerful admin panel'],
    ['Panier avancé temps réel', 'Advanced real-time cart'],
    ['Paiement sécurisé Stripe', 'Secure Stripe payment'],
    ['Gestion stock automatisée', 'Automated stock management'],
    ['Système avis clients', 'Customer review system'],
    ['Recommandations IA', 'AI recommendations'],
    ['Wishlist utilisateur', 'User wishlist'],
    ['Tableau de bord vendeur', 'Seller dashboard'],
    ['Multi-devises support', 'Multi-currency support'],

    // Important Information translations
    ['Entièrement conforme aux politiques FiveM et Rockstar', 'Fully compliant with FiveM and Rockstar policies'],
    ['Ne contient aucune marque commerciale réelle', 'Contains no real trademarks'],
    ['Version cryptée fournie lors de l\'achat', 'Encrypted version provided upon purchase'],
    ['Configuration ELS incluse', 'ELS configuration included'],
    ['Livrée personnalisable selon vos besoins', 'Customizable livery according to your needs'],
    ['Installation rapide et guidée', 'Fast guided installation'],
    ['Support technique prioritaire', 'Priority technical support'],
    ['Configuration ELS cachée pour discrétion maximale', 'Hidden ELS configuration for maximum discretion'],
    ['Apparence 100% civile banalisée', '100% unmarked civilian appearance'],
    ['Installation avec guide ELS inclus', 'Installation with included ELS guide'],
    ['Idéal pour missions undercover et infiltration', 'Ideal for undercover and infiltration missions'],
    ['ELS configuré avec patterns multiples', 'ELS configured with multiple patterns'],
    ['Livrée personnalisable pour votre département', 'Customizable livery for your department'],
    ['Compatible avec tous les scripts police', 'Compatible with all police scripts'],
    ['Installation ELS simplifiée avec tutoriel', 'Simplified ELS installation with tutorial'],
    ['Aucune configuration ELS requise', 'No ELS configuration required'],
    ['Installation ultra-rapide plug and play', 'Ultra-fast plug and play installation'],
    ['Parfait pour serveurs avec budget limité', 'Perfect for budget-limited servers'],
    ['Idéal missions surveillance et infiltration', 'Ideal for surveillance and infiltration missions'],
    ['Solution économique sans ELS', 'Economic solution without ELS'],
    ['Parfait pour serveurs débutants', 'Perfect for beginner servers'],
    ['Sirènes natives GTA incluses', 'Native GTA sirens included'],
    ['Livrée personnalisable facilement', 'Easily customizable livery'],
    ['Glasslight discrète pour opérations mixtes', 'Discreet glasslight for mixed operations'],
    ['Grande capacité pour équipement tactique', 'Large capacity for tactical equipment'],
    ['Parfait pour unités spécialisées', 'Perfect for specialized units'],
    ['Installation avec guide glasslight', 'Installation with glasslight guide'],
    ['SUV haute performance pour unités spéciales', 'High performance SUV for special units'],
    ['Apparence totalement civile', 'Completely civilian appearance'],
    ['Pas de configuration ELS nécessaire', 'No ELS configuration needed'],
    ['Idéal pour détectives et unités undercover', 'Ideal for detectives and undercover units'],
    ['Intérieur médical entièrement équipé', 'Fully equipped medical interior'],
    ['Glasslight configurable selon besoins', 'Configurable glasslight according to needs'],
    ['Compatible tous scripts médicaux RP', 'Compatible with all RP medical scripts'],
    ['Livrée personnalisable pour votre service', 'Customizable livery for your service'],
    ['Glasslight cachée pour opérations discrètes', 'Hidden glasslight for discreet operations'],
    ['Parfait pour transferts VIP ou spéciaux', 'Perfect for VIP or special transfers'],
    ['Équipement médical intérieur complet', 'Complete interior medical equipment'],
    ['Installation glasslight simplifiée', 'Simplified glasslight installation'],
    ['Configuration ELS avec 8+ patterns inclus', 'ELS configuration with 8+ patterns included'],
    ['Livrée haute visibilité personnalisable', 'Customizable high visibility livery'],
    ['Compatible tous scripts EMS', 'Compatible with all EMS scripts'],
    ['Installation ELS détaillée fournie', 'Detailed ELS installation provided'],
    ['ELS caché pour opérations discrètes', 'Hidden ELS for discreet operations'],
    ['Configuration ELS complète fournie', 'Complete ELS configuration provided'],
    ['Équipement médical professionnel intérieur', 'Professional interior medical equipment'],
    ['Installation instantanée plug and play', 'Instant plug and play installation'],
    ['Parfait pour serveurs budget limité', 'Perfect for budget-limited servers'],
    ['Livrée EMS officielle personnalisable', 'Customizable official EMS livery'],
    ['Solution la plus économique de la gamme', 'Most economical solution in the range'],
    ['Aucune configuration technique requise', 'No technical configuration required'],
    ['Transferts médicaux discrets basiques', 'Basic discreet medical transfers'],
    ['Pack contient 8 véhicules complets', 'Pack contains 8 complete vehicles'],
    ['Économisez 30% par rapport à l\'achat séparé', 'Save 30% compared to separate purchase'],
    ['Installation guidée étape par étape', 'Step-by-step guided installation'],
    ['Tous les véhicules sont personnalisables', 'All vehicles are customizable'],
    ['Édition saisonnière limitée hiver', 'Limited winter seasonal edition'],
    ['Textures exclusives thème hivernal', 'Exclusive winter theme textures'],
    ['Disponible uniquement pendant la saison', 'Available only during the season'],
    ['Collection spéciale pour serveurs RP', 'Special collection for RP servers'],
    ['Édition saisonnière limitée printemps', 'Limited spring seasonal edition'],
    ['Textures exclusives thème floral', 'Exclusive floral theme textures'],
    ['Parfait pour RP atmosphère printanière', 'Perfect for spring atmosphere RP'],
    ['Édition saisonnière limitée été', 'Limited summer seasonal edition'],
    ['Textures exclusives thème plage', 'Exclusive beach theme textures'],
    ['Idéal pour RP zones côtières', 'Ideal for coastal zone RP'],
    ['Édition saisonnière limitée automne', 'Limited autumn seasonal edition'],
    ['Textures exclusives thème automnal', 'Exclusive autumn theme textures'],
    ['Parfait pour RP atmosphère automnale', 'Perfect for autumn atmosphere RP'],
    ['Téléchargement gratuit instantané', 'Instant free download'],
    ['Aucun frais caché', 'No hidden fees'],
    ['Utilisation commerciale autorisée', 'Commercial use authorized'],
    ['Idéal pour débuter avec nos produits', 'Ideal to get started with our products'],
    ['Berline sport luxe haute performance', 'High performance luxury sport sedan'],
    ['Idéale pour personnages VIP et business', 'Ideal for VIP and business characters'],
    ['Textures intérieur premium détaillées', 'Detailed premium interior textures'],
    ['Compatible tous frameworks FiveM', 'Compatible with all FiveM frameworks'],
    ['SUV luxe polyvalent urbain et tout-terrain', 'Versatile luxury SUV urban and off-road'],
    ['Parfait pour VIP et personnages haut standing', 'Perfect for VIP and high-class characters'],
    ['Handling adapté routes et off-road', 'Handling adapted for roads and off-road'],
    ['Intérieur premium entièrement détaillé', 'Fully detailed premium interior'],
    ['Système bancaire complet pour serveur RP', 'Complete banking system for RP server'],
    ['Configuration facile via fichier config', 'Easy configuration via config file'],
    ['Compatible tous les scripts économiques', 'Compatible with all economic scripts'],
    ['Mises à jour et support technique inclus', 'Updates and technical support included'],
    ['Script de cambriolage le plus réaliste', 'Most realistic robbery script'],
    ['Système d\'alarme et caméra intégré', 'Integrated alarm and camera system'],
    ['Configuration par maison personnalisable', 'Customizable per-house configuration'],
    ['Compatible tous frameworks majeurs', 'Compatible with all major frameworks'],
    ['UI kit professionnel pour admin panels', 'Professional UI kit for admin panels'],
    ['Plus de 50 composants pré-développés', '50+ pre-developed components'],
    ['Compatible tous navigateurs modernes', 'Compatible with all modern browsers'],
    ['Mises à jour gratuites à vie', 'Lifetime free updates'],
    ['Solution complète pour communauté gaming', 'Complete solution for gaming community'],
    ['Backend Node.js et Base de données inclus', 'Node.js Backend and Database included'],
    ['Personnalisation facile sans codage avancé', 'Easy customization without advanced coding'],
    ['Support et mises à jour inclus 6 mois', 'Support and updates included for 6 months'],
    ['Solution e-commerce professionnelle complète', 'Complete professional e-commerce solution'],
    ['Intégration Stripe pour paiements sécurisés', 'Stripe integration for secure payments'],
    ['Base de données PostgreSQL incluse', 'PostgreSQL database included'],
    ['Support technique et mises à jour 1 an', 'Technical support and updates for 1 year'],
    
    ['v', 'v']
];

const enToFrGlossary = frToEnGlossary.map(([frText, enText]) => [enText, frText]);

function normalizeAccents(value) {
    if (typeof value !== 'string') return value;
    return value
        .normalize('NFD')
        .replace(/[\u0300-\u036f]/g, '')
    .replace(/\p{Extended_Pictographic}/gu, '')
        .trim();
}

function applyGlossaryFragments(input, glossaryEntries) {
    if (typeof input !== 'string' || input.length === 0) return input;
    let output = input;
    const ordered = [...glossaryEntries].sort((a, b) => b[0].length - a[0].length);

    // For simple alphanumeric terms (like tags), replace whole tokens only
    // to avoid cascading replacements such as "civil" inside "civilian".
    const buildGlossaryRegex = (term) => {
        const escapedTerm = term.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
        const isSimpleToken = /^[\p{L}\p{N}_-]+$/u.test(term);
        const pattern = isSimpleToken
            ? `(?<![\\p{L}\\p{N}_-])${escapedTerm}(?![\\p{L}\\p{N}_-])`
            : escapedTerm;
        return new RegExp(pattern, 'giu');
    };

    ordered.forEach(([fromText, toText]) => {
        if (!fromText) return;
        output = output.replace(buildGlossaryRegex(fromText), (match) => {
            if (match === match.toUpperCase()) return toText.toUpperCase();
            return toText;
        });

        const normalizedFrom = normalizeAccents(fromText);
        if (normalizedFrom && normalizedFrom !== fromText) {
            output = output.replace(buildGlossaryRegex(normalizedFrom), (match) => {
                if (match === match.toUpperCase()) return toText.toUpperCase();
                return toText;
            });
        }
    });

    return output;
}

function translateFreeText(input, lang) {
    if (typeof input !== 'string' || input.length === 0) return input;
    const targetLang = lang === 'en' ? 'en' : 'fr';
    if (targetLang === 'en') {
        return applyGlossaryFragments(input, frToEnGlossary);
    }
    return applyGlossaryFragments(input, enToFrGlossary);
}

function translateProductContent(productData, targetLanguage) {
    if (!productData || typeof productData !== 'object') return productData;

    const lang = (targetLanguage === 'en' || targetLanguage === 'fr') ? targetLanguage : getCurrentLanguage();
    const translated = { ...productData };

    // Translate text fields
    const textFields = ['title', 'subtitle', 'description', 'details', 'badge'];
    textFields.forEach(field => {
        if (typeof translated[field] === 'string' && translated[field]) {
            translated[field] = translateFreeText(translated[field], lang);
        }
    });

    // Translate features array
    if (Array.isArray(translated.features)) {
        translated.features = translated.features.map(feature => 
            typeof feature === 'string' ? translateFreeText(feature, lang) : feature
        );
    }

    // Translate important info array
    if (Array.isArray(translated.importantInfo)) {
        translated.importantInfo = translated.importantInfo.map(info => 
            typeof info === 'string' ? translateFreeText(info, lang) : info
        );
    }

    // Translate product tags
    if (Array.isArray(translated.productTags)) {
        translated.productTags = translated.productTags.map(tag => 
            typeof tag === 'string' ? translateFreeText(tag, lang) : tag
        );
    }

    // Translate technical details
    if (typeof translated.technicalDetails === 'object' && translated.technicalDetails) {
        const translatedTech = {};
        Object.entries(translated.technicalDetails).forEach(([key, value]) => {
            const translatedKey = translateFreeText(key, lang);
            const translatedValue = typeof value === 'string' ? translateFreeText(value, lang) : value;
            translatedTech[translatedKey] = translatedValue;
        });
        translated.technicalDetails = translatedTech;
    }

    // Mark the language version
    translated._language = lang;

    return translated;
}

function localizeTechnicalDetails(technicalDetails, lang) {
    if (!technicalDetails || typeof technicalDetails !== 'object') {
        return technicalDetails;
    }

    const localized = {};
    Object.entries(technicalDetails).forEach(([key, value]) => {
        localized[translateFreeText(key, lang)] = typeof value === 'string' ? translateFreeText(value, lang) : value;
    });
    return localized;
}

const productEnglishOverrides = {
    'car-civil-1': {
        title: 'Audi RS6 Civil',
        subtitle: 'CIVIL',
        description: 'Premium sport wagon for civilian driving, balanced and realistic.',
        details: 'FiveM-optimized Audi RS6 pack for civilian use with stable handling and HQ finishes. An exceptional sport wagon combining power, elegance, and practicality for your FiveM servers.'
    },
    'car-police-1': {
        title: 'Dodge Charger Police',
        subtitle: 'POLICE - GLASSLIGHT MARKED',
        description: 'Complete police interceptor with siren setup and RP equipment.',
        details: 'Ready-to-use police vehicle with configured lightbar, livery, and extras. High-performance interceptor for law enforcement roleplay.'
    },
    'car-police-2': {
        title: 'Unmarked Police Charger',
        subtitle: 'POLICE - ELS UNMARKED',
        description: 'Unmarked police car with integrated ELS equipment.',
        details: 'Unmarked vehicle with hidden ELS sirens and discreet equipment. Perfect for undercover operations and surveillance with full interceptor performance.'
    },
    'car-police-3': {
        title: 'Marked Police Crown',
        subtitle: 'POLICE - ELS MARKED',
        description: 'Official patrol car with visible ELS sirens.',
        details: 'Marked patrol vehicle with ELS sirens and official livery. Iconic patrol sedan with complete police equipment and high visibility for urban patrols.'
    },
    'car-police-4': {
        title: 'Unmarked Police Sedan',
        subtitle: 'POLICE - NON-ELS UNMARKED',
        description: 'Unmarked police vehicle without ELS siren equipment.',
        details: 'Simple unmarked sedan for discreet or civilian missions. Ideal for budget-friendly servers and light surveillance roleplay.'
    },
    'car-police-5': {
        title: 'Marked Police Patrol',
        subtitle: 'POLICE - NON-ELS MARKED',
        description: 'Marked patrol vehicle without modern ELS sirens.',
        details: 'Marked patrol vehicle with basic equipment and standard sirens. Cost-effective choice for patrol gameplay without ELS complexity.'
    },
    'car-ambulance-1': {
        title: 'Mercedes Sprinter EMS Glasslight',
        subtitle: 'AMBULANCE - GLASSLIGHT MARKED',
        description: 'Modern ambulance with visible glasslight and official medical livery.',
        details: 'Complete EMS Sprinter for medical RP services with compatible animations and accessories. Premium ambulance with detailed medical interior and professional equipment.'
    },
    'car-ambulance-2': {
        title: 'Unmarked Glasslight Ambulance',
        subtitle: 'AMBULANCE - GLASSLIGHT UNMARKED',
        description: 'Unmarked ambulance with discreet glasslight for special interventions.',
        details: 'Unmarked ambulance with discreet integrated glasslight. Medical vehicle without markings for special operations and confidential transfers.'
    },
    'car-ambulance-3': {
        title: 'Marked ELS Ambulance',
        subtitle: 'AMBULANCE - ELS MARKED',
        description: 'Ambulance with full ELS system and visible official livery.',
        details: 'ELS ambulance with complete sirens and official medical livery. Advanced ELS setup with multiple patterns for high-visibility emergency response.'
    },
    'car-ambulance-4': {
        title: 'Unmarked ELS Ambulance',
        subtitle: 'AMBULANCE - ELS UNMARKED',
        description: 'Unmarked ambulance with hidden ELS sirens for discreet operations.',
        details: 'Unmarked ELS ambulance with concealed sirens. Discreet medical vehicle with full ELS capabilities for special operations.'
    },
    'car-ambulance-5': {
        title: 'Classic Marked Ambulance',
        subtitle: 'AMBULANCE - NON-ELS MARKED',
        description: 'Traditional ambulance with standard sirens and official livery.',
        details: 'Classic ambulance with simple sirens and visible livery. Cost-effective solution for medical services without ELS complexity.'
    },
    'car-ambulance-6': {
        title: 'Standard Unmarked Ambulance',
        subtitle: 'AMBULANCE - NON-ELS UNMARKED',
        description: 'Unmarked ambulance with simple equipment for discreet missions.',
        details: 'Simple unmarked ambulance without ELS sirens. Budget-friendly option for discreet transfers and basic medical missions.'
    },
    'car-pack-1': {
        title: 'City Starter Pack',
        subtitle: 'PACK',
        description: 'Multi-purpose vehicle pack to quickly launch a server.',
        details: 'Pack including 8 civilian, public service, and utility vehicles. Cost-effective solution to start your FiveM server with a complete and diverse garage.'
    },
    'car-seasonal-1': {
        title: 'Winter Patrol SUV',
        subtitle: 'SEASONAL',
        description: 'Seasonal edition SUV with winter style and snow setup.',
        details: 'Limited winter season edition with dedicated textures and adapted tuning. Winter SUV with snowy livery and optimized handling for cold-weather RP.'
    },
    'car-seasonal-2': {
        title: 'Spring City Coupe',
        subtitle: 'SEASONAL',
        description: 'Spring edition coupe with floral palette and smooth driving.',
        details: 'Limited spring season edition with fresh textures and urban style. Spring coupe with pastel tones and floral ambience for seasonal RP.'
    },
    'car-seasonal-3': {
        title: 'Summer Beach Cabrio',
        subtitle: 'SEASONAL',
        description: 'Summer edition convertible for coastal areas and cruising.',
        details: 'Limited summer season edition with sunny design and leisure setup. Ideal for coastal cruising and vacation-themed RP.'
    },
    'car-seasonal-4': {
        title: 'Autumn Touring Wagon',
        subtitle: 'SEASONAL',
        description: 'Autumn edition wagon with warm tones and long-route setup.',
        details: 'Limited autumn season edition with comfort-focused tuning for long RP trips and a cozy warm visual style.'
    },
    'car-free-1': {
        title: 'Compact Free Starter',
        subtitle: 'FREE',
        description: 'Free vehicle to quickly get started on your server.',
        details: 'Free optimized model, ready to install, perfect for first deployment. This compact vehicle is ideal to test our quality with no commitment.'
    },
    'car-civil-2': {
        title: 'BMW M5 Civil',
        subtitle: 'CIVIL - LUXURY',
        description: 'Luxury sport sedan for civilian use with premium finishes.',
        details: 'FiveM-optimized BMW M5 with luxury interior, smooth animations, and HD textures. Premium sedan combining performance and elegance for VIP RP.'
    },
    'car-civil-3': {
        title: 'Mercedes G-Class',
        subtitle: 'CIVIL - SUV',
        description: 'Premium all-purpose civilian SUV with comfort and performance.',
        details: 'Mercedes G-Class with robust handling, realistic details, and RP optimization. Iconic luxury SUV blending urban elegance and off-road capability.'
    },
    'car-police-6': {
        title: 'Police Interceptor Utility',
        subtitle: 'POLICE - GLASSLIGHT UNMARKED',
        description: 'Alternative police utility vehicle with lightweight equipment and sirens.',
        details: 'Police utility SUV with glasslight setup and unmarked configuration. Versatile platform for heavy patrol and tactical transport.'
    },
    'car-police-7': {
        title: 'Police Explorer NON-ELS',
        subtitle: 'POLICE - NON-ELS UNMARKED',
        description: 'Unmarked police SUV without ELS sirens for discreet missions.',
        details: 'High-performance unmarked police SUV for advanced discreet operations with hidden police equipment and civilian appearance.'
    },
    'script-1': {
        title: 'Advanced Garage System',
        subtitle: 'COMPLETE SYSTEM',
        description: 'Advanced garage system with multi-vehicle support and full customization.',
        details: 'Complete garage system with unlimited vehicle storage, real-time 3D customization, insurance management, and rental system. ESX and QBCore compatible.'
    },
    'script-2': {
        title: 'Phone System Pro',
        subtitle: 'FULL APPLICATION',
        description: 'Complete phone system with apps, messages, calls, and notifications.',
        details: 'Complete phone with 15+ integrated apps: messaging, calls, banking, real estate, jobs, marketplace. Modern design, optimized and multiplayer synchronized.'
    },
    'script-3': {
        title: 'Banking Script',
        subtitle: 'BANKING SYSTEM',
        description: 'Banking script with transfers, loans, and complete account management.',
        details: 'Complete banking system with multiple accounts, transfers, real-estate and car loans, virtual bank cards, and detailed financial reporting.'
    },
    'script-4': {
        title: 'Job System Framework',
        subtitle: 'JOB SYSTEM',
        description: 'Complete framework to create and manage RP jobs and employers.',
        details: 'Modular jobs framework with salaries, ranks, uniforms, and missions. ESX and QBCore compatible with leave and promotion systems.'
    },
    'script-5': {
        title: 'House Robbery Script',
        subtitle: 'ROBBERIES',
        description: 'Home robbery script with alarms, loot, and risk mechanics.',
        details: 'Complete robbery system with alarms, cameras, penalties, and varied loot. Includes immersive interactions and realistic animations.'
    },
    'clothes-1': {
        title: 'Street Pack Vol.3',
        subtitle: 'URBAN COLLECTION',
        description: 'Collection of 50+ high-quality trendy streetwear items.',
        details: '50+ authentic streetwear outfits: hoodies, joggers, shoes, accessories. High-quality textures and natural animations, compatible with all characters.'
    },
    'clothes-2': {
        title: 'Luxury Fashion',
        subtitle: 'PREMIUM COLLECTION',
        description: 'Luxury outfits with exclusive designs and high-end materials.',
        details: '30+ luxury outfits with 4K textures, realistic animations, and precise details designed for premium RP experiences.'
    },
    'clothes-3': {
        title: 'Biker Outfit Pack',
        subtitle: 'BIKER COLLECTION',
        description: '40+ biker-style outfits with leather, chains, and authentic accessories.',
        details: 'Complete biker pack: leather jackets, ripped jeans, boots, chains, tattoos. High-quality textures and authentic gang RP style.'
    },
    'clothes-4': {
        title: 'Business Formal Pack',
        subtitle: 'BUSINESS COLLECTION',
        description: '35+ formal and business outfits for professional roleplay.',
        details: 'Professional collection with suits, dresses, shirts, ties, and business accessories. Perfect for lawyers, agents, and executive RP.'
    },
    'template-1': {
        title: 'Discord Bot Dashboard',
        subtitle: 'BOT DASHBOARD',
        description: 'Complete template for a modern responsive Discord bot dashboard.',
        details: 'Complete Discord dashboard with admin panel, role management, server statistics, and modular logs. Modern stack with Discord OAuth2.'
    },
    'template-2': {
        title: 'Admin Panel UI Kit',
        subtitle: 'INTERFACE KIT',
        description: 'Collection of elegant admin interfaces ready to use.',
        details: 'Complete UI kit with dashboards, charts, forms, and reactive components. Suitable for any web admin project with modern visual style.'
    },
    'template-3': {
        title: 'Community Website Builder',
        subtitle: 'WEBSITE BUILDER',
        description: 'Complete template to build a modern gaming community website.',
        details: 'Full responsive template with forum, gallery, members, and events. Includes moderation system and real-time statistics.'
    },
    'template-4': {
        title: 'E-Commerce Shop Template',
        subtitle: 'MODERN SHOP',
        description: 'Complete e-commerce template with cart, payments, and product management.',
        details: 'Complete store template with Stripe payments, stock management, customer reviews, wishlist, and AI recommendations.'
    }
};

function localizeProduct(product, lang) {
    if (!product || typeof product !== 'object') return product;

    const targetLang = lang || getCurrentLanguage();
    const localized = { ...product };

    const stringFields = ['title', 'subtitle', 'description', 'details', 'badge', 'gender', 'fileSize', 'style', 'language', 'type'];
    stringFields.forEach((field) => {
        if (typeof localized[field] === 'string') {
            localized[field] = translateFreeText(localized[field], targetLang);
        }
    });

    if (Array.isArray(localized.features)) {
        localized.features = localized.features.map((feature) => translateFreeText(feature, targetLang));
    }

    if (Array.isArray(localized.importantInfo)) {
        localized.importantInfo = localized.importantInfo.map((info) => translateFreeText(info, targetLang));
    }

    if (Array.isArray(localized.productTags)) {
        localized.productTags = localized.productTags.map((tag) => translateFreeText(tag, targetLang));
    }

    if (targetLang === 'en' && localized.id && productEnglishOverrides[localized.id]) {
        const explicitTranslation = productEnglishOverrides[localized.id];
        ['title', 'subtitle', 'description', 'details'].forEach((field) => {
            if (typeof explicitTranslation[field] === 'string' && explicitTranslation[field].length > 0) {
                localized[field] = explicitTranslation[field];
            }
        });
    }

    localized.technicalDetails = localizeTechnicalDetails(localized.technicalDetails, targetLang);
    return localized;
}

function translateStaticPageContent(lang) {
    const dictionary = buildStaticTextDictionary();
    const map = lang === 'en' ? dictionary.frToEn : dictionary.enToFr;
    const glossary = lang === 'en' ? frToEnGlossary : enToFrGlossary;
    const forbiddenTags = new Set(['SCRIPT', 'STYLE', 'NOSCRIPT', 'CODE', 'PRE']);

    const walker = document.createTreeWalker(document.body, NodeFilter.SHOW_TEXT);
    let node = walker.nextNode();
    while (node) {
        const parentTag = node.parentElement ? node.parentElement.tagName : '';
        if (!forbiddenTags.has(parentTag)) {
            const raw = node.nodeValue || '';
            const trimmed = raw.trim();
            let nextValue = raw;

            if (trimmed && Object.prototype.hasOwnProperty.call(map, trimmed)) {
                nextValue = raw.replace(trimmed, map[trimmed]);
            }

            nextValue = applyGlossaryFragments(nextValue, glossary);
            if (nextValue !== raw) {
                node.nodeValue = nextValue;
            }
        }
        node = walker.nextNode();
    }

    document.querySelectorAll('[placeholder],[title],[aria-label],[value]').forEach((el) => {
        ['placeholder', 'title', 'aria-label', 'value'].forEach((attr) => {
            const value = el.getAttribute(attr);
            if (!value) return;
            const trimmed = value.trim();
            let nextValue = value;

            if (trimmed && Object.prototype.hasOwnProperty.call(map, trimmed)) {
                nextValue = map[trimmed];
            }

            nextValue = applyGlossaryFragments(nextValue, glossary);
            if (nextValue !== value) {
                el.setAttribute(attr, nextValue);
            }
        });
    });
}

// Update language and refresh page
function switchLanguage(lang) {
    if (setLanguage(lang)) {
        translatePage();
        // Update html lang attribute
        document.documentElement.lang = lang;
        // Dispatch custom event for other scripts to listen
        window.dispatchEvent(new CustomEvent('languageChanged', { detail: { language: lang } }));
    }
}

window.translateFreeText = translateFreeText;
window.localizeProduct = localizeProduct;
