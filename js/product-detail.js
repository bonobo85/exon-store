// Product Detail Page Script

const galleryState = {
    images: [],
    currentIndex: 0
};

const DEFAULT_PRODUCT_IMAGE = 'https://i.postimg.cc/VLx43RYB/exon.png';
const DEFAULT_SUPPORT_URL = 'https://discord.com/invite/c9cKtrwMrs';
const DEFAULT_VIDEO_URL = 'https://www.youtube.com/@BonoboDesAlpes';

// Get product ID from URL
function getProductIdFromURL() {
    const urlParams = new URLSearchParams(window.location.search);
    return urlParams.get('id');
}

// Get category from URL
function getCategoryFromURL() {
    const urlParams = new URLSearchParams(window.location.search);
    return urlParams.get('category') || 'cars';
}

// Find product by ID
function findProductById(productId, category) {
    if (!products[category]) return null;
    return products[category].find(product => product.id === productId);
}

// Go back to previous page
function goBack() {
    const category = getCategoryFromURL();
    window.location.href = `${category}.html`;
}

// Display product details
function displayProductDetail() {
    const productId = getProductIdFromURL();
    const category = getCategoryFromURL();
    
    if (!productId) {
        console.error('No product ID found');
        goBack();
        return;
    }

    const product = findProductById(productId, category);
    
    if (!product) {
        console.error('Product not found:', productId);
        goBack();
        return;
    }

    // Update page title
    document.getElementById('page-title').textContent = `${product.title} - Exon Store`;
    
    // Update product info
    document.getElementById('product-title').textContent = product.title;
    document.getElementById('product-subtitle').textContent = product.subtitle || product.description;
    
    // Badge
    const badgeElement = document.getElementById('product-badge');
    if (product.badge) {
        badgeElement.textContent = product.badge;
        badgeElement.className = `inline-block px-4 py-2 rounded-full text-sm font-semibold ${product.badgeClass || 'bg-blue-500 text-white'}`;
    } else {
        badgeElement.style.display = 'none';
    }

    // Tags
    displayTags(product);

    // Price
    document.getElementById('product-price').textContent = `${product.price.toFixed(2)} €`;
    
    if (product.originalPrice) {
        const originalPriceElement = document.getElementById('product-original-price');
        originalPriceElement.textContent = `${product.originalPrice.toFixed(2)} €`;
        originalPriceElement.classList.remove('hidden');
    }

    // Overview
    document.getElementById('product-overview').textContent = product.details || product.description;

    // Quick action buttons
    displayQuickLinks(product);

    // Gallery
    displayGallery(product);

    // Features
    displayFeatures(product);

    // Technical Details
    displayTechnicalDetails(product);

    // Important Information
    displayImportantInfo(product);

    // Related Products
    displayRelatedProducts(product, category);

    // Store current product in global scope
    window.currentProduct = product;
}

function displayQuickLinks(product) {
    const supportBtn = document.getElementById('support-btn');
    const videoBtn = document.getElementById('video-btn');

    supportBtn.href = product.supportUrl || DEFAULT_SUPPORT_URL;
    videoBtn.href = product.videoUrl || DEFAULT_VIDEO_URL;
}

// Display product tags
function displayTags(product) {
    const tagsContainer = document.getElementById('product-tags');
    tagsContainer.innerHTML = '';

    if (product.productTags && product.productTags.length > 0) {
        product.productTags.forEach(tag => {
            const tagSpan = document.createElement('span');
            tagSpan.className = 'px-3 py-1 rounded-full text-xs font-semibold bg-gray-800 text-gray-400 border border-gray-700 hover:bg-white hover:text-black transition-all cursor-default';
            tagSpan.textContent = tag;
            tagsContainer.appendChild(tagSpan);
        });
    }
}

// Display product gallery as slider (main image + scrollable thumbnails)
function displayGallery(product) {
    const minSlots = 5;
    const customImages = (product.images || []).filter(Boolean);
    const images = customImages.length ? customImages : Array(minSlots).fill(DEFAULT_PRODUCT_IMAGE);

    galleryState.images = images;
    galleryState.currentIndex = 0;

    const mainImage = document.getElementById('main-product-image');
    const placeholder = document.getElementById('main-image-placeholder');
    const thumbsTrack = document.getElementById('product-thumbs-track');

    thumbsTrack.innerHTML = '';

    if (images.length === 0) {
        mainImage.removeAttribute('src');
        mainImage.classList.add('hidden');
        placeholder.classList.remove('hidden');
        renderPlaceholderThumbs(minSlots, product);
        bindGalleryControls();
        return;
    }

    mainImage.classList.remove('hidden');
    placeholder.classList.add('hidden');

    images.forEach((imageSrc, index) => {
        const thumbBtn = document.createElement('button');
        thumbBtn.type = 'button';
        thumbBtn.className = 'thumb-item w-24 h-16 md:w-28 md:h-20 rounded-lg overflow-hidden border border-white/10 hover:border-white/40 transition-all shrink-0';
        thumbBtn.setAttribute('data-index', String(index));
        thumbBtn.setAttribute('aria-label', `Afficher l\'image ${index + 1}`);
        thumbBtn.innerHTML = `
            <img src="${imageSrc}" alt="${product.title} Screenshot ${index + 1}" class="w-full h-full object-cover">
        `;
        thumbBtn.addEventListener('click', () => selectGalleryImage(index));
        thumbsTrack.appendChild(thumbBtn);
    });

    // Keep a consistent visual style even when fewer images are available.
    if (images.length < minSlots) {
        renderPlaceholderThumbs(minSlots - images.length, product);
    }

    bindGalleryControls();
    selectGalleryImage(0);
}

function renderPlaceholderThumbs(count, product) {
    const thumbsTrack = document.getElementById('product-thumbs-track');

    for (let i = 0; i < count; i++) {
        const emptyThumb = document.createElement('div');
        emptyThumb.className = `w-24 h-16 md:w-28 md:h-20 rounded-lg border border-white/10 bg-gradient-to-br ${product.gradientFrom || 'from-gray-800'} ${product.gradientTo || 'to-gray-900'} flex items-center justify-center shrink-0`;
        emptyThumb.innerHTML = `
            <svg class="w-5 h-5 text-white/20" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14" />
            </svg>
        `;
        thumbsTrack.appendChild(emptyThumb);
    }
}

function selectGalleryImage(index) {
    if (!galleryState.images.length) return;

    galleryState.currentIndex = index;

    const mainImage = document.getElementById('main-product-image');
    const imageSrc = galleryState.images[index];
    mainImage.src = imageSrc;
    mainImage.alt = `Product image ${index + 1}`;
    mainImage.onclick = () => openImageModal(imageSrc);

    document.querySelectorAll('.thumb-item').forEach((thumb) => {
        const thumbIndex = Number(thumb.getAttribute('data-index'));
        if (thumbIndex === index) {
            thumb.classList.remove('border-white/10');
            thumb.classList.add('border-white');
        } else {
            thumb.classList.remove('border-white');
            thumb.classList.add('border-white/10');
        }
    });
}

function slideGallery(step) {
    if (!galleryState.images.length) return;

    const total = galleryState.images.length;
    const nextIndex = (galleryState.currentIndex + step + total) % total;
    selectGalleryImage(nextIndex);
}

function scrollThumbs(step) {
    const thumbsViewport = document.getElementById('product-thumbs');
    if (!thumbsViewport) return;

    thumbsViewport.scrollBy({
        left: step * 180,
        behavior: 'smooth'
    });
}

function bindGalleryControls() {
    const prevBtn = document.getElementById('gallery-prev-btn');
    const nextBtn = document.getElementById('gallery-next-btn');
    const thumbsPrevBtn = document.getElementById('thumbs-prev-btn');
    const thumbsNextBtn = document.getElementById('thumbs-next-btn');

    prevBtn.onclick = () => slideGallery(-1);
    nextBtn.onclick = () => slideGallery(1);
    thumbsPrevBtn.onclick = () => scrollThumbs(-1);
    thumbsNextBtn.onclick = () => scrollThumbs(1);
}

// Display features
function displayFeatures(product) {
    const featuresContainer = document.getElementById('product-features');
    featuresContainer.innerHTML = '';

    if (product.features && product.features.length > 0) {
        product.features.forEach(feature => {
            const featureDiv = document.createElement('div');
            featureDiv.className = 'flex items-start gap-3';
            featureDiv.innerHTML = `
                <div class="flex-shrink-0 mt-1">
                    <svg class="w-5 h-5 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7" />
                    </svg>
                </div>
                <span class="text-gray-300">${feature}</span>
            `;
            featuresContainer.appendChild(featureDiv);
        });
    } else {
        featuresContainer.innerHTML = '<p class="text-gray-400">Aucune caractéristique disponible.</p>';
    }
}

// Display technical details
function displayTechnicalDetails(product) {
    const technicalContainer = document.getElementById('product-technical');
    const technicalSection = document.getElementById('technical-section');
    
    // Always show section
    technicalSection.style.display = 'block';

    if (product.technicalDetails && Object.keys(product.technicalDetails).length > 0) {
        technicalContainer.innerHTML = '';

        const technicalDetailsToRender = { ...product.technicalDetails };
        const computedTotalFileSize = getTotalFileSize(product);
        if (computedTotalFileSize && !technicalDetailsToRender['Total File Size']) {
            technicalDetailsToRender['Total File Size'] = computedTotalFileSize;
        }

        Object.entries(technicalDetailsToRender).forEach(([key, value]) => {
            const detailDiv = document.createElement('div');
            detailDiv.className = 'bg-black/40 rounded-lg p-4 border border-white/5';
            detailDiv.innerHTML = `
                <p class="text-sm text-gray-400 mb-1">${key}</p>
                <p class="text-white font-semibold">${value}</p>
            `;
            technicalContainer.appendChild(detailDiv);
        });
    } else {
        technicalContainer.innerHTML = '<p class="text-gray-400 text-center py-4">Détails techniques disponibles bientôt</p>';
    }
}

function getTotalFileSize(product) {
    if (product.fileSize) {
        return product.fileSize;
    }

    if (!product.technicalDetails) {
        return null;
    }

    const yftSize = parseSizeToKB(product.technicalDetails['YFT Size']);
    const ytdSize = parseSizeToKB(product.technicalDetails['YTD Size']);

    if (yftSize === null || ytdSize === null) {
        return null;
    }

    const totalKB = yftSize + ytdSize;
    if (totalKB >= 1024) {
        return `${(totalKB / 1024).toFixed(2)} MB`;
    }

    return `${Math.round(totalKB)} KB`;
}

function parseSizeToKB(sizeValue) {
    if (!sizeValue || typeof sizeValue !== 'string') {
        return null;
    }

    const normalized = sizeValue.trim().toUpperCase();
    const match = normalized.match(/([0-9]+(?:\.[0-9]+)?)\s*(KB|MB)/);
    if (!match) {
        return null;
    }

    const numericValue = Number(match[1]);
    const unit = match[2];

    if (Number.isNaN(numericValue)) {
        return null;
    }

    return unit === 'MB' ? numericValue * 1024 : numericValue;
}

// Display important information
function displayImportantInfo(product) {
    const infoContainer = document.getElementById('product-info');
    const infoSection = document.getElementById('info-section');
    
    // Always show section
    infoSection.style.display = 'block';

    if (product.importantInfo && product.importantInfo.length > 0) {
        infoContainer.innerHTML = '';

        product.importantInfo.forEach(info => {
            const infoDiv = document.createElement('div');
            infoDiv.className = 'flex items-start gap-3';
            infoDiv.innerHTML = `
                <div class="flex-shrink-0 mt-1">
                    <svg class="w-5 h-5 text-blue-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                </div>
                <span class="text-gray-300">${info}</span>
            `;
            infoContainer.appendChild(infoDiv);
        });
    } else {
        infoContainer.innerHTML = '<p class="text-gray-400 text-center py-4">Informations complémentaires disponibles bientôt</p>';
    }
}

// Display related products
function displayRelatedProducts(product, category) {
    const relatedContainer = document.getElementById('related-products');
    relatedContainer.innerHTML = '';

    if (!products[category]) return;

    // Get products from same category, excluding current product
    const relatedProducts = products[category]
        .filter(p => p.id !== product.id)
        .slice(0, 3);

    relatedProducts.forEach(relatedProduct => {
        const productCard = document.createElement('div');
        productCard.className = 'bg-gradient-to-br ' + (relatedProduct.gradientFrom || 'from-gray-900') + ' ' + (relatedProduct.gradientTo || 'to-black') + ' rounded-xl border border-white/10 overflow-hidden hover:border-white/30 transition-all cursor-pointer';
        productCard.onclick = () => {
            window.location.href = `product-detail.html?id=${relatedProduct.id}&category=${category}`;
        };
        
        productCard.innerHTML = `
            <div class="aspect-video bg-black/40 flex items-center justify-center">
                <svg class="w-16 h-16 text-white/20" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                </svg>
            </div>
            <div class="p-6">
                <h3 class="font-display text-xl font-bold text-white mb-2">${relatedProduct.title}</h3>
                <p class="text-gray-400 text-sm mb-4">${relatedProduct.description}</p>
                <div class="flex items-center justify-between">
                    <span class="font-display text-2xl font-bold text-white">${relatedProduct.price.toFixed(2)} €</span>
                    <span class="btn-primary px-4 py-2 rounded-lg text-sm font-semibold">Voir</span>
                </div>
            </div>
        `;
        
        relatedContainer.appendChild(productCard);
    });
}

// Add to cart from detail page
function addToCartFromDetail() {
    if (window.currentProduct) {
        // Animate product flying to cart
        const btn = event.target;
        animateAddToCart(window.currentProduct, btn);
        
        addToCart(window.currentProduct);
        
        // Visual feedback
        const originalText = btn.textContent;
        btn.textContent = '✓ AJOUTÉ AU PANIER';
        btn.classList.add('bg-green-500');
        
        setTimeout(() => {
            btn.textContent = originalText;
            btn.classList.remove('bg-green-500');
        }, 2000);
    }
}

// Open image in modal (optional enhancement)
function openImageModal(imageSrc) {
    // Create modal
    const modal = document.createElement('div');
    modal.className = 'fixed inset-0 z-[100] flex items-center justify-center bg-black/90 p-4';
    modal.onclick = () => modal.remove();
    
    modal.innerHTML = `
        <div class="relative max-w-6xl w-full">
            <button onclick="this.closest('.fixed').remove()" class="absolute -top-12 right-0 text-white hover:text-gray-300">
                <svg class="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
                </svg>
            </button>
            <img src="${imageSrc}" alt="Product Image" class="w-full h-auto rounded-lg" onclick="event.stopPropagation()">
        </div>
    `;
    
    document.body.appendChild(modal);
}

// Initialize on page load
document.addEventListener('DOMContentLoaded', () => {
    displayProductDetail();
});
