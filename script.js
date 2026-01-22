AOS.init({
    duration: 800,
    offset: 100,
    once: true,
    easing: 'ease-in-out-quad'
});

const menuToggle = document.getElementById('menuToggle');
const navMenu = document.getElementById('navMenu');

if (menuToggle) {
    menuToggle.addEventListener('click', () => {
        menuToggle.classList.toggle('active');
        navMenu.classList.toggle('active');
    });

    navMenu.querySelectorAll('a').forEach(link => {
        link.addEventListener('click', () => {
            menuToggle.classList.remove('active');
            navMenu.classList.remove('active');
        });
    });

    document.addEventListener('click', (e) => {
        if (!e.target.closest('.header')) {
            menuToggle.classList.remove('active');
            navMenu.classList.remove('active');
        }
    });
}

const swiper = new Swiper('.swiper', {
    effect: 'slide',
    speed: 800,
    autoplay: {
        delay: 4000,
        disableOnInteraction: false,
    },
    pagination: {
        el: '.swiper-pagination',
        clickable: true,
        dynamicBullets: true,
    },
    slidesPerView: 1,
    spaceBetween: 20,
    loop: true,
    breakpoints: {
        768: {
            slidesPerView: 2,
        },
        1024: {
            slidesPerView: 3,
        }
    }
});

document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
        const href = this.getAttribute('href');
        if (href !== '#' && document.querySelector(href)) {
            e.preventDefault();
            const target = document.querySelector(href);
            const headerHeight = document.querySelector('.header').offsetHeight;
            const targetPosition = target.offsetTop - headerHeight;
            
            window.scrollTo({
                top: targetPosition,
                behavior: 'smooth'
            });
        }
    });
});

const contactForm = document.querySelector('.contact-form');
if (contactForm) {
    contactForm.addEventListener('submit', function(e) {
        e.preventDefault();
        
        const inputs = this.querySelectorAll('input, textarea');
        const name = inputs[0].value.trim();
        const email = inputs[1].value.trim();
        const phone = inputs[2].value.trim();
        const message = inputs[3].value.trim();
        if (!name || !email || !phone || !message) {
            alert('Mohon isi semua field');
            return;
        }
        
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(email)) {
            alert('Mohon masukkan email yang valid');
            return;
        }
        
        if (phone.length < 10) {
            alert('Mohon masukkan nomor telepon yang valid');
            return;
        }
        
        alert(`Terima kasih ${name}! Pesan Anda telah dikirim. Kami akan menghubungi Anda segera melalui email atau telepon.`);
        this.reset();
    });
}

const header = document.querySelector('.header');
let lastScrollTop = 0;

window.addEventListener('scroll', () => {
    let scrollTop = window.pageYOffset || document.documentElement.scrollTop;
    
    if (scrollTop > 50) {
        header.style.boxShadow = '0 5px 25px rgba(0, 0, 0, 0.12)';
        header.style.backgroundColor = 'rgba(255, 255, 255, 0.99)';
    } else {
        header.style.boxShadow = '0 2px 10px rgba(0, 0, 0, 0.05)';
        header.style.backgroundColor = 'rgba(255, 255, 255, 0.95)';
    }
    
    lastScrollTop = scrollTop <= 0 ? 0 : scrollTop;
});

function animateCounter(element, target, duration = 1000) {
    let current = 0;
    const increment = target / (duration / 16);
    
    const updateCount = () => {
        current += increment;
        if (current < target) {
            element.textContent = Math.floor(current);
            requestAnimationFrame(updateCount);
        } else {
            element.textContent = target;
        }
    };
    
    updateCount();
}

const observerOptions = {
    threshold: 0.1,
    rootMargin: '0px 0px -50px 0px'
};

const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.style.opacity = '1';
            entry.target.style.transform = 'translateY(0)';
        }
    });
}, observerOptions);

document.querySelectorAll('.card, .product-card, .testimonial').forEach(el => {
    el.style.opacity = '0';
    el.style.transform = 'translateY(20px)';
    el.style.transition = 'all 0.6s ease';
    observer.observe(el);
});

document.querySelectorAll('.btn').forEach(button => {
    button.addEventListener('click', function(e) {
        const ripple = document.createElement('span');
        const rect = this.getBoundingClientRect();
        const size = Math.max(rect.width, rect.height);
        const x = e.clientX - rect.left - size / 2;
        const y = e.clientY - rect.top - size / 2;
        
        ripple.style.width = ripple.style.height = size + 'px';
        ripple.style.left = x + 'px';
        ripple.style.top = y + 'px';
        ripple.classList.add('ripple');
        
        this.appendChild(ripple);
        
        setTimeout(() => ripple.remove(), 600);
    });
});

document.addEventListener('DOMContentLoaded', () => {
    console.log('✓ Gletser Indonesia - Landing page loaded successfully');
    console.log('✓ All features initialized');
    AOS.refresh();
    if (window.performance && window.performance.timing) {
        const pageLoadTime = window.performance.timing.loadEventEnd - window.performance.timing.navigationStart;
        console.log(`Page load time: ${pageLoadTime}ms`);
    }
});
