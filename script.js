// Koszyk zakupowy
let cart = [];
let cartCount = 0;
let cartTotal = 0;

// Funkcja do rozwiązania prostego wyzwania (jeśli jest potrzebna)
function solveSimpleChallenge() {
    console.log('Simple challenge solved');
    return true;
}

// Funkcje koszyka
function addToCart(productName, price) {
    cart.push({ name: productName, price: price });
    cartCount++;
    cartTotal += price;
    
    updateCartUI();
    showCartNotification();
    
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

// Animacje przy scrollowaniu
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

// Popup
function showPopup() {
    // Sprawdź czy użytkownik już widział popup
    const popupShown = localStorage.getItem('popupShown');
    if (popupShown) return;
    
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

function handlePopupSubmit(event) {
    event.preventDefault();
    const emailInput = event.target.querySelector('input[type="email"]');
    if (emailInput) {
        const email = emailInput.value;
        if (validateEmail(email)) {
            showNotification('Kod rabatowy WELCOME10 został wysłany na Twój email!', 'success');
            closePopup();
            emailInput.value = '';
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
            showNotification('Dziękujemy za zapisanie się! Kod rabatowy został wysłany.', 'success');
            event.target.reset();
        } else {
            showNotification('Proszę podać poprawny adres email!', 'warning');
        }
    }
}

// Walidacja email
function validateEmail(email) {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
}

// Płynne scrollowanie
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

// Scroll header
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

// Inicjalizacja koszyka
function initCart() {
    const cartIcon = document.querySelector('.cart-icon a');
    if (cartIcon) {
        cartIcon.addEventListener('click', function(e) {
            e.preventDefault();
            openCart();
        });
    }

    // Przycisk checkout
    const checkoutBtn = document.querySelector('.checkout-btn');
    if (checkoutBtn) {
        checkoutBtn.addEventListener('click', function() {
            if (cart.length === 0) {
                showNotification('Koszyk jest pusty! Dodaj produkty przed złożeniem zamówienia.', 'warning');
            } else {
                const orderSummary = cart.map(item => `• ${item.name} - ${item.price} zł`).join('\n');
                const confirmOrder = confirm(`Potwierdzenie zamówienia:\n\n${orderSummary}\n\nSuma: ${cartTotal} zł\n\nCzy chcesz przejść do płatności?`);
                
                if (confirmOrder) {
                    showNotification('Dziękujemy za zakupy! Zamówienie zostało przyjęte.', 'success');
                    
                    // Reset koszyka po udanym zakupie
                    cart = [];
                    cartCount = 0;
                    cartTotal = 0;
                    updateCartUI();
                    closeCart();
                }
            }
        });
    }
}

// Dodanie stylów CSS
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

// Główna funkcja inicjalizacji
function init() {
    addStyles();
    initSmoothScroll();
    initHeaderScroll();
    initCart();
    checkScroll();
    updateCartUI();
    
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

// Event listeners
document.addEventListener('DOMContentLoaded', init);
window.addEventListener('scroll', checkScroll);

// Zapobieganie domyślnemu zachowaniu formularzy
document.addEventListener('DOMContentLoaded', function() {
    const forms = document.querySelectorAll('form');
    forms.forEach(form => {
        form.addEventListener('submit', function(e) {
            if (!this.classList.contains('newsletter-form')) {
                e.preventDefault();
            }
        });
    });
});

// Obsługa błędów
window.addEventListener('error', function(e) {
    console.error('Wystąpił błąd:', e.error);
});

// Eksport funkcji dla globalnego dostępu (dla onclick w HTML)
window.addToCart = addToCart;
window.removeFromCart = removeFromCart;
window.openCart = openCart;
window.closeCart = closeCart;
window.closePopup = closePopup;
window.handlePopupSubmit = handlePopupSubmit;
window.handleNewsletterSubmit = handleNewsletterSubmit;
window.solveSimpleChallenge = solveSimpleChallenge;