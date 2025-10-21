// Koszyk zakupowy
let cart = [];
let cartCount = 0;
let cartTotal = 0;

// ========== SPRAWKO 1: SYSTEMY CMS ==========
let products = [
    { id: 1, name: "BTS - Proof Album", price: 149, category: "Albums", description: "Oficjalny album BTS Proof" },
    { id: 2, name: "BLACKPINK Light Stick", price: 299, category: "Akcesoria", description: "Oficjalny light stick BLACKPINK" },
    { id: 3, name: "TWICE - Oficjalne Fotokarty", price: 49, category: "Kolekcje", description: "Zestaw oficjalnych fotokart TWICE" },
    { id: 4, name: "EXO - Oficjalna Bluza", price: 199, category: "Kolekcje", description: "Oficjalna Bluza EXO" },
    { id: 5, name: "Huntrix Album", price: 149, category: "Albums", description: "Oficjalny album Huntrix" },
    { id: 6, name: "Stray Kids - Koszula", price: 89, category: "Akcesoria", description: "Oficjalna koszula Stray Kids" }
];

// ========== SPRAWKO 2: SYSTEMY HANDLU ELEKTRONICZNEGO ==========
let orders = JSON.parse(localStorage.getItem('orders')) || [];

// ========== SPRAWKO 3: MARKETING POCZTOWY ==========
let newsletterSubscribers = JSON.parse(localStorage.getItem('newsletterSubscribers')) || [];

// ========== SPRAWKO 4: NARZĘDZIA POZYCJONOWANIA ==========
function initializeSEOTools() {
    // Dynamic meta description update
    const metaDescription = document.querySelector('meta[name="description"]');
    if (metaDescription) {
        metaDescription.content = "Oficjalny sklep K-POP STORE - " + products.length + " unikalnych produktów. " + metaDescription.content;
    }
    
    // Structured data for products
    const structuredData = {
        "@context": "https://schema.org",
        "@type": "ItemList",
        "numberOfItems": products.length,
        "itemListElement": products.map((product, index) => ({
            "@type": "ListItem",
            "position": index + 1,
            "item": {
                "@type": "Product",
                "name": product.name,
                "description": product.description,
                "offers": {
                    "@type": "Offer",
                    "price": product.price,
                    "priceCurrency": "PLN"
                }
            }
        }))
    };
    
    const script = document.createElement('script');
    script.type = 'application/ld+json';
    script.textContent = JSON.stringify(structuredData);
    document.head.appendChild(script);
}

// ========== SPRAWKO 5: SYSTEMY REKLAMY KONTEKSTOWEJ ==========
function trackConversion(action, value, category = 'general') {
    // Google Analytics conversion tracking
    gtag('event', 'conversion', {
        'send_to': 'G-TD2XHQBB83/' + action,
        'value': value,
        'currency': 'PLN',
        'transaction_id': 'T' + Date.now(),
        'event_category': category
    });
    
    console.log(`Conversion tracked: ${action}, Value: ${value} PLN`);
}

function trackSocialClick(platform) {
    trackConversion('social_click', 0, 'social_media');
    showNotification(`Śledzenie: Kliknięcie w ${platform}`, 'success');
}

// ========== SPRAWKO 6: MEDIA SPOŁECZNOŚCIOWE ==========
function shareOnFacebook() {
    const url = encodeURIComponent(window.location.href);
    const text = encodeURIComponent("Sprawdź oficjalny sklep K-POP STORE z merchandise'm Twoich ulubionych grup!");
    window.open(`https://www.facebook.com/sharer/sharer.php?u=${url}&quote=${text}`, '_blank');
    trackConversion('social_share', 0, 'facebook');
}

function shareOnTwitter() {
    const text = encodeURIComponent("Oficjalny sklep K-POP STORE 🎵 #kpop #merchandise");
    const url = encodeURIComponent(window.location.href);
    window.open(`https://twitter.com/intent/tweet?text=${text}&url=${url}`, '_blank');
    trackConversion('social_share', 0, 'twitter');
}

// ========== ADMIN PANEL FUNCTIONS ==========
function toggleAdminPanel() {
    const adminPanel = document.getElementById('admin');
    adminPanel.style.display = adminPanel.style.display === 'none' ? 'block' : 'none';
    if (adminPanel.style.display === 'block') {
        loadAdminData();
    }
}

function loadAdminData() {
    updateSubscriberCount();
    loadOrders();
}

// CMS - Dodawanie nowych produktów
document.getElementById('product-form')?.addEventListener('submit', function(e) {
    e.preventDefault();
    
    const name = document.getElementById('product-name').value;
    const price = parseInt(document.getElementById('product-price').value);
    const category = document.getElementById('product-category').value;
    const description = document.getElementById('product-description').value;
    
    const newProduct = {
        id: products.length + 1,
        name: name,
        price: price,
        category: category,
        description: description
    };
    
    products.push(newProduct);
    saveProductsToLocalStorage();
    renderProducts();
    
    document.getElementById('product-form').reset();
    showNotification('Produkt dodany pomyślnie!', 'success');
    trackConversion('product_added', 0, 'cms');
});

// System handlu elektronicznego - Zarządzanie zamówieniami
function loadOrders() {
    const ordersList = document.getElementById('orders-list');
    ordersList.innerHTML = '';
    
    if (orders.length === 0) {
        ordersList.innerHTML = '<p>Brak zamówień</p>';
        return;
    }
    
    orders.forEach(order => {
        const orderElement = document.createElement('div');
        orderElement.className = 'order-item';
        orderElement.innerHTML = `
            <div class="order-number">Zamówienie: ${order.id}</div>
            <div>Data: ${new Date(order.date).toLocaleDateString()}</div>
            <div class="order-total">Suma: ${order.total} zł</div>
            <div>Produkty: ${order.items.map(item => item.name).join(', ')}</div>
        `;
        ordersList.appendChild(orderElement);
    });
}

function processOrder() {
    if (cart.length === 0) {
        showNotification('Koszyk jest pusty!', 'warning');
        return;
    }
    
    const order = {
        id: generateOrderNumber(),
        date: new Date().toISOString(),
        items: [...cart],
        total: cartTotal
    };
    
    orders.push(order);
    localStorage.setItem('orders', JSON.stringify(orders));
    
    // Track conversion for advertising
    trackConversion('purchase', cartTotal, 'ecommerce');
    
    showNotification(`Zamówienie #${order.id} złożone! Suma: ${cartTotal} zł`, 'success');
    
    // Reset cart
    cart = [];
    cartCount = 0;
    cartTotal = 0;
    updateCartUI();
    closeCart();
    
    // Update admin panel if visible
    if (document.getElementById('admin').style.display === 'block') {
        loadOrders();
    }
}

// Marketing pocztowy - Newsletter management
function updateSubscriberCount() {
    const count = newsletterSubscribers.length;
    document.getElementById('subscriber-count').textContent = count;
    document.getElementById('total-subscribers').textContent = count;
}

function exportSubscribers() {
    if (newsletterSubscribers.length === 0) {
        showNotification('Brak subskrybentów do eksportu', 'warning');
        return;
    }
    
    const csvContent = "data:text/csv;charset=utf-8," 
        + "Email,Data zapisu,Źródło\n"
        + newsletterSubscribers.map(sub => 
            `${sub.email},${sub.date},${sub.source}`
        ).join("\n");
    
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", "subskrybenci_newsletter.csv");
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    
    trackConversion('subscribers_export', newsletterSubscribers.length, 'email_marketing');
}

// ========== CORE SHOP FUNCTIONS ==========
function solveSimpleChallenge() {
    console.log('Simple challenge solved');
    return true;
}

function addToCart(productName, price) {
    cart.push({ name: productName, price: price });
    cartCount++;
    cartTotal += price;
    
    updateCartUI();
    showCartNotification();
    
    // Track add to cart conversion
    trackConversion('add_to_cart', price, 'ecommerce');
    
    // Dodaj efekt wizualny do przycisku
    const button = event.target;
    button.classList.add('added');
    button.innerHTML = '<i class="fas fa-check"></i> Dodano!';
    
    setTimeout(() => {
        button.classList.remove('added');
        button.innerHTML = '<i class="fas fa-shopping-cart"></i> Dodaj do koszyka';
    }, 2000);
}

function updateCartUI() {
    const cartCountElement = document.querySelector('.cart-count');
    const cartTotalElement = document.getElementById('cartTotal');
    const cartItemsElement = document.getElementById('cartItems');
    
    if (cartCountElement) {
        cartCountElement.textContent = cartCount;
    }
    
    if (cartTotalElement) {
        cartTotalElement.textContent = cartTotal;
    }
    
    if (cartItemsElement) {
        cartItemsElement.innerHTML = '';
        
        if (cart.length === 0) {
            cartItemsElement.innerHTML = '<div class="cart-empty">Koszyk jest pusty</div>';
        } else {
            cart.forEach((item, index) => {
                const cartItem = document.createElement('div');
                cartItem.className = 'cart-item';
                cartItem.innerHTML = `
                    <div class="cart-item-info">
                        <div class="cart-item-name">${item.name}</div>
                        <div class="cart-item-price">${item.price} zł</div>
                    </div>
                    <button class="cart-item-remove" onclick="removeFromCart(${index})">🗑️</button>
                `;
                cartItemsElement.appendChild(cartItem);
            });
        }
    }
}

function removeFromCart(index) {
    if (index >= 0 && index < cart.length) {
        const removedItem = cart[index];
        cart.splice(index, 1);
        cartCount--;
        cartTotal -= removedItem.price;
        updateCartUI();
        
        showNotification('Produkt usunięty z koszyka!', 'warning');
        trackConversion('remove_from_cart', 0, 'ecommerce');
    }
}

function showCartNotification() {
    showNotification('Produkt dodany do koszyka!', 'success');
}

function showNotification(message, type = 'success') {
    // Usuń istniejące powiadomienia
    const existingNotifications = document.querySelectorAll('.custom-notification');
    existingNotifications.forEach(notification => notification.remove());
    
    const notification = document.createElement('div');
    const backgroundColor = type === 'success' ? 'var(--success-color)' : 'var(--warning-color)';
    
    notification.className = 'custom-notification';
    notification.style.cssText = `
        position: fixed;
        top: 100px;
        right: 20px;
        background: ${backgroundColor};
        color: white;
        padding: 1rem 2rem;
        border-radius: 8px;
        z-index: 1000;
        box-shadow: 0 4px 12px rgba(0,0,0,0.15);
        animation: slideInRight 0.3s ease, fadeOut 0.3s ease 2.7s forwards;
        font-weight: 500;
    `;
    notification.textContent = message;
    
    document.body.appendChild(notification);
    
    setTimeout(() => {
        if (notification.parentNode) {
            notification.parentNode.removeChild(notification);
        }
    }, 3000);
}

function openCart() {
    const cartElement = document.getElementById('cart');
    if (cartElement) {
        cartElement.classList.add('active');
        
        // Dodaj overlay
        const overlay = document.createElement('div');
        overlay.className = 'cart-overlay';
        overlay.style.cssText = `
            position: fixed;
            top: 0;
            left: 0;
            width: 100%;
            height: 100%;
            background: rgba(0,0,0,0.5);
            z-index: 1999;
        `;
        overlay.onclick = closeCart;
        document.body.appendChild(overlay);
    }
}

function closeCart() {
    const cartElement = document.getElementById('cart');
    if (cartElement) {
        cartElement.classList.remove('active');
    }
    
    // Usuń overlay
    const overlay = document.querySelector('.cart-overlay');
    if (overlay) {
        overlay.remove();
    }
}

// ========== PRODUCTS MANAGEMENT ==========
function saveProductsToLocalStorage() {
    localStorage.setItem('products', JSON.stringify(products));
}

function loadProductsFromLocalStorage() {
    const savedProducts = localStorage.getItem('products');
    if (savedProducts) {
        products = JSON.parse(savedProducts);
    }
}

function renderProducts() {
    const container = document.getElementById('products-container');
    if (!container) return;
    
    container.innerHTML = '';
    
    // Mapa zdjęć dla produktów
    const productImages = {
        "BTS - Proof Album": "./images/BTS_Proof_album_cover_art.jpg",
        "BLACKPINK Light Stick": "./images/blackpink_light_stick.jpg", 
        "TWICE - Oficjalne Fotokarty": "./images/twice_oficial_photocards.jpg",
        "EXO - Oficjalna Bluza": "./images/EXO - Oficjalna Bluza.jpg",
        "Huntrix Album": "./images/kpdh.jpg",
        "Stray Kids - Koszula": "./images/Stray_kids_koszula.jpg"
    };
    
    products.forEach(product => {
        // Użyj odpowiedniego zdjęcia lub domyślnego
        const productImage = productImages[product.name] || "./images/default-product.jpg";
        
        const productCard = document.createElement('div');
        productCard.className = 'product-card';
        productCard.innerHTML = `
            <div class="product-badge">Nowość</div>
            <img src="${productImage}" alt="${product.name}" onerror="this.src='./images/default-product.jpg'">
            <div class="product-info">
                <h3>${product.name}</h3>
                <p class="product-price">${product.price} zł</p>
                <button class="add-to-cart" onclick="addToCart('${product.name}', ${product.price})">
                    <i class="fas fa-shopping-cart"></i> Dodaj do koszyka
                </button>
            </div>
        `;
        container.appendChild(productCard);
    });
}

// ========== UTILITY FUNCTIONS ==========
function generateOrderNumber() {
    return 'ORD-' + Date.now() + '-' + Math.random().toString(36).substr(2, 9);
}

function validateEmail(email) {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
}

// ========== EVENT HANDLERS ==========
function handlePopupSubmit(event) {
    event.preventDefault();
    const emailInput = event.target.querySelector('input[type="email"]');
    if (emailInput) {
        const email = emailInput.value;
        if (validateEmail(email)) {
            newsletterSubscribers.push({
                email: email,
                date: new Date().toISOString(),
                source: 'popup'
            });
            localStorage.setItem('newsletterSubscribers', JSON.stringify(newsletterSubscribers));
            
            showNotification('Kod rabatowy WELCOME10 został wysłany na Twój email!', 'success');
            closePopup();
            emailInput.value = '';
            updateSubscriberCount();
            trackConversion('newsletter_signup', 0, 'email_marketing');
        } else {
            showNotification('Proszę podać poprawny adres email!', 'warning');
        }
    }
}

function handleNewsletterSubmit(event) {
    event.preventDefault();
    const emailInput = event.target.querySelector('input[type="email"]');
    if (emailInput) {
        const email = emailInput.value;
        if (validateEmail(email)) {
            newsletterSubscribers.push({
                email: email,
                date: new Date().toISOString(),
                source: 'newsletter'
            });
            localStorage.setItem('newsletterSubscribers', JSON.stringify(newsletterSubscribers));
            
            showNotification('Dziękujemy za zapisanie się! Kod rabatowy został wysłany.', 'success');
            event.target.reset();
            updateSubscriberCount();
            trackConversion('newsletter_signup', 0, 'email_marketing');
        } else {
            showNotification('Proszę podać poprawny adres email!', 'warning');
        }
    }
}

// ========== INITIALIZATION ==========
function init() {
    addStyles();
    initSmoothScroll();
    initHeaderScroll();
    initCart();
    checkScroll();
    updateCartUI();
    
    // Load data
    loadProductsFromLocalStorage();
    renderProducts();
    initializeSEOTools();
    updateSubscriberCount();
    
    // Sprawdź czy użytkownik już widział popup
    const popupShown = localStorage.getItem('popupShown');
    if (!popupShown) {
        showPopup();
    }
    
    // Rozwiąż proste wyzwanie jeśli jest wymagane
    if (typeof solveSimpleChallenge === 'function') {
        solveSimpleChallenge();
    }
}

// Pozostałe funkcje pozostają bez zmian...
// (initSmoothScroll, initHeaderScroll, initCart, checkScroll, showPopup, closePopup, addStyles)

// Event listeners
document.addEventListener('DOMContentLoaded', init);
window.addEventListener('scroll', checkScroll);

// Eksport funkcji dla globalnego dostępu
window.addToCart = addToCart;
window.removeFromCart = removeFromCart;
window.openCart = openCart;
window.closeCart = closeCart;
window.closePopup = closePopup;
window.handlePopupSubmit = handlePopupSubmit;
window.handleNewsletterSubmit = handleNewsletterSubmit;
window.solveSimpleChallenge = solveSimpleChallenge;
window.toggleAdminPanel = toggleAdminPanel;
window.loadOrders = loadOrders;
window.exportSubscribers = exportSubscribers;
window.shareOnFacebook = shareOnFacebook;
window.shareOnTwitter = shareOnTwitter;
window.trackSocialClick = trackSocialClick;
window.processOrder = processOrder;

// Pozostałe funkcje pomocnicze...
function initSmoothScroll() {
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            const href = this.getAttribute('href');
            if (href !== '#' && href !== '#cart') {
                e.preventDefault();
                const target = document.querySelector(href);
                if (target) {
                    const headerHeight = document.getElementById('header') ? document.getElementById('header').offsetHeight : 0;
                    const targetPosition = target.offsetTop - headerHeight;
                    
                    window.scrollTo({
                        top: targetPosition,
                        behavior: 'smooth'
                    });
                }
            }
        });
    });
}

function initHeaderScroll() {
    window.addEventListener('scroll', () => {
        const header = document.getElementById('header');
        if (header) {
            if (window.scrollY > 100) {
                header.classList.add('scrolled');
            } else {
                header.classList.remove('scrolled');
            }
        }
    });
}

function initCart() {
    const cartIcon = document.querySelector('.cart-icon a');
    if (cartIcon) {
        cartIcon.addEventListener('click', function(e) {
            e.preventDefault();
            openCart();
        });
    }
}

function showPopup() {
    setTimeout(() => {
        const popup = document.getElementById('popup');
        if (popup) {
            popup.style.display = 'flex';
        }
    }, 3000);
}

function closePopup() {
    const popup = document.getElementById('popup');
    if (popup) {
        popup.style.display = 'none';
        localStorage.setItem('popupShown', 'true');
    }
}

function addStyles() {
    const style = document.createElement('style');
    style.textContent = `
        @keyframes slideInRight {
            from {
                transform: translateX(100%);
                opacity: 0;
            }
            to {
                transform: translateX(0);
                opacity: 1;
            }
        }
        
        @keyframes fadeOut {
            from {
                opacity: 1;
            }
            to {
                opacity: 0;
            }
        }
        
        .cart-item {
            display: flex;
            justify-content: space-between;
            align-items: center;
            padding: 1rem 0;
            border-bottom: 1px solid #eee;
        }
        
        .cart-item-info {
            flex: 1;
        }
        
        .cart-item-name {
            font-weight: bold;
            margin-bottom: 0.25rem;
        }
        
        .cart-item-price {
            color: var(--primary-color);
            font-weight: bold;
        }
        
        .cart-item-remove {
            background: var(--error-color);
            color: white;
            border: none;
            padding: 5px 10px;
            border-radius: 5px;
            cursor: pointer;
            transition: background 0.3s;
        }
        
        .cart-item-remove:hover {
            background: #cc0000;
        }
        
        .cart-empty {
            text-align: center;
            padding: 2rem;
            color: #666;
            font-style: italic;
        }
        
        .add-to-cart.added {
            background: var(--success-color) !important;
        }
        
        .cart-overlay {
            position: fixed;
            top: 0;
            left: 0;
            width: 100%;
            height: 100%;
            background: rgba(0,0,0,0.5);
            z-index: 1999;
        }
    `;
    document.head.appendChild(style);
}

function checkScroll() {
    const elements = document.querySelectorAll('.section-title, .feature-card, .product-card, .testimonial-card, .artist-card');
    
    elements.forEach(element => {
        const elementTop = element.getBoundingClientRect().top;
        const windowHeight = window.innerHeight;
        
        if (elementTop < windowHeight - 100) {
            element.classList.add('visible');
        }
    });
}