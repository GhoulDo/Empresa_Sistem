// Navegación suave mejorada
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
        e.preventDefault();
        const target = document.querySelector(this.getAttribute('href'));
        if (target) {
            const headerHeight = document.querySelector('.header').offsetHeight;
            const targetPosition = target.getBoundingClientRect().top + window.pageYOffset - headerHeight - 20;
            
            window.scrollTo({
                top: targetPosition,
                behavior: 'smooth'
            });
        }
    });
});

// Menú hamburguesa mejorado
const hamburger = document.querySelector('.hamburger');
const navMenu = document.querySelector('.nav-menu');
const body = document.body;

hamburger.addEventListener('click', () => {
    hamburger.classList.toggle('active');
    navMenu.classList.toggle('active');
    body.classList.toggle('menu-open');
});

// Cerrar menú al hacer click en un enlace
document.querySelectorAll('.nav-menu a').forEach(link => {
    link.addEventListener('click', () => {
        hamburger.classList.remove('active');
        navMenu.classList.remove('active');
        body.classList.remove('menu-open');
    });
});

// Cerrar menú al hacer click fuera
document.addEventListener('click', (e) => {
    if (!hamburger.contains(e.target) && !navMenu.contains(e.target)) {
        hamburger.classList.remove('active');
        navMenu.classList.remove('active');
        body.classList.remove('menu-open');
    }
});

// Formulario de contacto mejorado
const contactForm = document.getElementById('contactForm');

contactForm.addEventListener('submit', function(e) {
    e.preventDefault();
    
    // Mostrar indicador de carga
    const submitBtn = this.querySelector('button[type="submit"]');
    const originalText = submitBtn.innerHTML;
    submitBtn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Enviando...';
    submitBtn.disabled = true;
    
    // Obtener datos del formulario
    const formData = new FormData(this);
    const nombre = formData.get('nombre');
    const email = formData.get('email');
    const telefono = formData.get('telefono');
    const mensaje = formData.get('mensaje');
    
    // Simular delay de envío
    setTimeout(() => {
        // Crear enlace mailto
        const subject = encodeURIComponent(`Consulta de ${nombre} - EncisoSystem`);
        const body = encodeURIComponent(`Nombre: ${nombre}\nEmail: ${email}\nTeléfono: ${telefono}\n\nMensaje:\n${mensaje}`);
        const mailtoLink = `mailto:joooohanenciso@gmail.com?subject=${subject}&body=${body}`;
        
        // Abrir cliente de email
        window.location.href = mailtoLink;
        
        // Mostrar mensaje de confirmación mejorado
        showNotification('¡Gracias por tu mensaje! Se abrirá tu cliente de email para enviar la consulta.', 'success');
        
        // Limpiar formulario
        this.reset();
        
        // Restaurar botón
        submitBtn.innerHTML = originalText;
        submitBtn.disabled = false;
    }, 1000);
});

// Sistema de notificaciones
function showNotification(message, type = 'success') {
    const notification = document.createElement('div');
    notification.className = `notification notification-${type}`;
    notification.innerHTML = `
        <div class="notification-content">
            <i class="fas ${type === 'success' ? 'fa-check-circle' : 'fa-exclamation-circle'}"></i>
            <span>${message}</span>
            <button class="notification-close"><i class="fas fa-times"></i></button>
        </div>
    `;
    
    document.body.appendChild(notification);
    
    // Mostrar con animación
    setTimeout(() => notification.classList.add('show'), 100);
    
    // Auto cerrar después de 5 segundos
    const autoClose = setTimeout(() => closeNotification(notification), 5000);
    
    // Cerrar manualmente
    notification.querySelector('.notification-close').addEventListener('click', () => {
        clearTimeout(autoClose);
        closeNotification(notification);
    });
}

function closeNotification(notification) {
    notification.classList.remove('show');
    setTimeout(() => {
        if (notification.parentNode) {
            notification.parentNode.removeChild(notification);
        }
    }, 300);
}

// Efecto de scroll en header mejorado
let lastScrollY = window.scrollY;
const header = document.querySelector('.header');

window.addEventListener('scroll', () => {
    const currentScrollY = window.scrollY;
    
    if (currentScrollY > 100) {
        header.style.background = 'rgba(255, 255, 255, 0.95)';
        header.style.backdropFilter = 'blur(20px)';
        header.style.boxShadow = '0 4px 20px rgba(0, 0, 0, 0.1)';
    } else {
        header.style.background = 'rgba(255, 255, 255, 0.95)';
        header.style.backdropFilter = 'blur(16px)';
        header.style.boxShadow = '0 4px 20px rgba(0, 0, 0, 0.05)';
    }
    
    // Ocultar/mostrar header en scroll
    if (currentScrollY > lastScrollY && currentScrollY > 200) {
        header.style.transform = 'translateY(-100%)';
    } else {
        header.style.transform = 'translateY(0)';
    }
    
    lastScrollY = currentScrollY;
});

// Animaciones de entrada mejoradas
const observerOptions = {
    threshold: 0.1,
    rootMargin: '0px 0px -50px 0px'
};

const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.classList.add('animate-in');
            // Animar elementos hijos con delay
            const children = entry.target.querySelectorAll('.service-card, .portfolio-item, .feature');
            children.forEach((child, index) => {
                setTimeout(() => {
                    child.style.opacity = '1';
                    child.style.transform = 'translateY(0)';
                }, index * 150);
            });
        }
    });
}, observerOptions);

// Contador animado para estadísticas
function animateCounter(element, target, duration = 2000) {
    let start = 0;
    const increment = target / (duration / 16);
    
    const timer = setInterval(() => {
        start += increment;
        if (start >= target) {
            element.textContent = target + (element.dataset.suffix || '');
            clearInterval(timer);
        } else {
            element.textContent = Math.floor(start) + (element.dataset.suffix || '');
        }
    }, 16);
}

// Aplicar animaciones al cargar la página
document.addEventListener('DOMContentLoaded', () => {
    // Observar elementos para animaciones
    const animatedSections = document.querySelectorAll('.services, .portfolio, .about');
    animatedSections.forEach(section => observer.observe(section));
    
    // Animar contadores en hero
    const stats = document.querySelectorAll('.stat-number');
    stats.forEach(stat => {
        const target = parseInt(stat.textContent.replace(/\D/g, ''));
        stat.dataset.suffix = stat.textContent.replace(/\d/g, '');
        
        const statObserver = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    animateCounter(stat, target);
                    statObserver.unobserve(stat);
                }
            });
        });
        
        statObserver.observe(stat);
    });
    
    // Efecto de escritura para el título principal
    const heroTitle = document.querySelector('.hero-content h1');
    if (heroTitle) {
        const text = heroTitle.innerHTML;
        heroTitle.innerHTML = '';
        let index = 0;
        
        const typeWriter = () => {
            if (index < text.length) {
                heroTitle.innerHTML += text.charAt(index);
                index++;
                setTimeout(typeWriter, 50);
            }
        };
        
        setTimeout(typeWriter, 1000);
    }
    
    // Parallax suave para elementos flotantes
    window.addEventListener('scroll', () => {
        const scrolled = window.pageYOffset;
        const parallaxElements = document.querySelectorAll('.floating-element');
        
        parallaxElements.forEach((element, index) => {
            const speed = 0.5 + (index * 0.2);
            element.style.transform = `translateY(${scrolled * speed}px) rotate(${scrolled * 0.1}deg)`;
        });
    });
});

// Mejorar rendimiento con throttling
function throttle(func, limit) {
    let inThrottle;
    return function() {
        const args = arguments;
        const context = this;
        if (!inThrottle) {
            func.apply(context, args);
            inThrottle = true;
            setTimeout(() => inThrottle = false, limit);
        }
    }
}

// Aplicar throttling a eventos de scroll
window.addEventListener('scroll', throttle(() => {
    // Código de scroll optimizado
}, 16));

// CSS adicional mejorado para móvil
const style = document.createElement('style');
style.textContent = `
    .notification {
        position: fixed;
        top: 100px;
        right: -400px;
        background: white;
        border-radius: 12px;
        box-shadow: 0 10px 30px rgba(0, 0, 0, 0.2);
        z-index: 10000;
        transition: right 0.3s ease;
        min-width: 300px;
        max-width: 400px;
    }
    
    .notification.show {
        right: 20px;
    }
    
    .notification-content {
        padding: 20px;
        display: flex;
        align-items: center;
        gap: 15px;
    }
    
    .notification-success {
        border-left: 4px solid #10b981;
    }
    
    .notification-content i:first-child {
        color: #10b981;
        font-size: 1.2rem;
    }
    
    .notification-close {
        background: none;
        border: none;
        font-size: 1.1rem;
        cursor: pointer;
        color: #64748b;
        margin-left: auto;
    }
    
    .menu-open {
        overflow: hidden;
    }
    
    @media (max-width: 768px) {
        .nav-menu {
            position: fixed;
            left: -100%;
            top: 80px;
            flex-direction: column;
            background: rgba(255, 255, 255, 0.98);
            backdrop-filter: blur(20px);
            width: 100%;
            text-align: center;
            transition: left 0.3s ease;
            box-shadow: 0 10px 30px rgba(0, 0, 0, 0.1);
            padding: 3rem 0;
            height: calc(100vh - 80px);
            overflow-y: auto;
        }
        
        .nav-menu.active {
            left: 0;
        }
        
        .nav-menu li {
            margin: 1rem 0;
        }
        
        .nav-menu a {
            font-size: 1.2rem;
            padding: 1rem 2rem;
            display: block;
            border-radius: 12px;
            margin: 0 2rem;
            transition: all 0.3s ease;
        }
        
        .nav-menu a:hover {
            background: rgba(99, 102, 241, 0.1);
            transform: translateY(0);
        }
        
        .hamburger.active span:nth-child(2) {
            opacity: 0;
        }
        
        .hamburger.active span:nth-child(1) {
            transform: translateY(9px) rotate(45deg);
        }
        
        .hamburger.active span:nth-child(3) {
            transform: translateY(-9px) rotate(-45deg);
        }
        
        .notification {
            right: -350px;
            min-width: 280px;
            max-width: 320px;
        }
        
        .notification.show {
            right: 10px;
        }
    }
    
    @media (max-width: 480px) {
        .notification {
            right: -300px;
            min-width: 250px;
            max-width: 280px;
        }
        
        .notification.show {
            right: 5px;
        }
        
        .notification-content {
            padding: 15px;
            gap: 10px;
        }
        
        .nav-menu {
            top: 70px;
            height: calc(100vh - 70px);
            padding: 2rem 0;
        }
        
        .nav-menu a {
            font-size: 1.1rem;
            margin: 0 1rem;
        }
    }
`;
document.head.appendChild(style);
