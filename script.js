// Animacje przy scrollowaniu
function checkScroll() {
    const elements = document.querySelectorAll('.section-title, .feature-card, .stat-item, .testimonial-card, .artist-card');
    
    elements.forEach(element => {
        const elementTop = element.getBoundingClientRect().top;
        const windowHeight = window.innerHeight;
        
        if (elementTop < windowHeight - 100) {
            element.classList.add('visible');
        }
    });
}

// Liczniki statystyk
function animateCounters() {
    const counters = document.querySelectorAll('.stat-number');
    const speed = 200;

    counters.forEach(counter => {
        const target = +counter.getAttribute('data-target');
        const count = +counter.innerText;
        const increment = target / speed;

        if (count < target) {
            counter.innerText = Math.ceil(count + increment);
            setTimeout(() => animateCounters(), 1);
        } else {
            counter.innerText = target.toLocaleString();
        }
    });
}

// Odliczanie
function updateCountdown() {
    const targetDate = new Date('2024-12-31T23:59:59').getTime();
    const now = new Date().getTime();
    const difference = targetDate - now;

    const days = Math.floor(difference / (1000 * 60 * 60 * 24));
    const hours = Math.floor((difference % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
    const minutes = Math.floor((difference % (1000 * 60 * 60)) / (1000 * 60));
    const seconds = Math.floor((difference % (1000 * 60)) / 1000);

    document.getElementById('days').textContent = days.toString().padStart(2, '0');
    document.getElementById('hours').textContent = hours.toString().padStart(2, '0');
    document.getElementById('minutes').textContent = minutes.toString().padStart(2, '0');
    document.getElementById('seconds').textContent = seconds.toString().padStart(2, '0');
}

// Popup
function showPopup() {
    setTimeout(() => {
        document.getElementById('popup').style.display = 'flex';
    }, 3000);
}

function closePopup() {
    document.getElementById('popup').style.display = 'none';
}

function handlePopupSubmit(event) {
    event.preventDefault();
    const email = event.target.querySelector('input[type="email"]').value;
    alert(`Dziękujemy! Prezent został wysłany na adres: ${email}`);
    closePopup();
}

function handleNewsletterSubmit(event) {
    event.preventDefault();
    const email = event.target.querySelector('input[type="email"]').value;
    alert(`Dziękujemy za zapisanie się do newslettera! Na adres ${email} wysłaliśmy wiadomość potwierdzającą.`);
    event.target.reset();
}

// Płynne scrollowanie
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
        e.preventDefault();
        document.querySelector(this.getAttribute('href')).scrollIntoView({
            behavior: 'smooth'
        });
    });
});

// Scroll header
window.addEventListener('scroll', () => {
    const header = document.getElementById('header');
    if (window.scrollY > 100) {
        header.classList.add('scrolled');
    } else {
        header.classList.remove('scrolled');
    }
});

// Inicjalizacja
window.addEventListener('load', () => {
    checkScroll();
    animateCounters();
    updateCountdown();
    setInterval(updateCountdown, 1000);
    showPopup();
});

window.addEventListener('scroll', checkScroll);