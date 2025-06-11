// Navegación suave
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
        e.preventDefault();
        const target = document.querySelector(this.getAttribute('href'));
        if (target) {
            const headerHeight = 80;
            const targetPosition = target.getBoundingClientRect().top + window.pageYOffset - headerHeight;
            
            window.scrollTo({
                top: targetPosition,
                behavior: 'smooth'
            });
        }
    });
});

// Menú hamburguesa
const hamburger = document.querySelector('.hamburger');
const navMenu = document.querySelector('.nav-menu');

if (hamburger && navMenu) {
    hamburger.addEventListener('click', () => {
        hamburger.classList.toggle('active');
        navMenu.classList.toggle('active');
    });

    // Cerrar menú al hacer click en enlaces
    navMenu.querySelectorAll('a').forEach(link => {
        link.addEventListener('click', () => {
            hamburger.classList.remove('active');
            navMenu.classList.remove('active');
        });
    });
}

// Efecto de scroll en header
window.addEventListener('scroll', () => {
    const header = document.querySelector('.header');
    if (window.scrollY > 100) {
        header.style.background = 'rgba(255, 255, 255, 0.98)';
        header.style.boxShadow = '0 4px 30px rgba(232, 93, 4, 0.15)';
    } else {
        header.style.background = 'rgba(255, 255, 255, 0.95)';
        header.style.boxShadow = '0 4px 20px rgba(0, 0, 0, 0.1)';
    }
});

// Mostrar todas las secciones al cargar
document.addEventListener('DOMContentLoaded', () => {
    // Asegurar que todas las secciones sean visibles
    const sections = document.querySelectorAll('.module-section');
    sections.forEach(section => {
        section.classList.add('visible');
        section.style.opacity = '1';
        section.style.transform = 'translateY(0)';
    });

    // Intersection Observer simplificado
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('revealed');
            }
        });
    }, { threshold: 0.1 });

    // Observar secciones
    sections.forEach(section => observer.observe(section));

    // Animación de contadores simplificada
    const animateNumbers = () => {
        const numbers = document.querySelectorAll('.stat-number, .metric-number, .category-number, .sales-number, .client-number');
        numbers.forEach(num => {
            const text = num.textContent;
            const number = parseInt(text.replace(/[^0-9]/g, ''));
            if (number && number > 0) {
                let current = 0;
                const increment = number / 50;
                const timer = setInterval(() => {
                    current += increment;
                    if (current >= number) {
                        num.textContent = text;
                        clearInterval(timer);
                    } else {
                        const formatted = Math.floor(current);
                        if (text.includes('$')) {
                            num.textContent = '$' + formatted.toLocaleString();
                        } else if (text.includes('%')) {
                            num.textContent = formatted + '%';
                        } else {
                            num.textContent = formatted;
                        }
                    }
                }, 50);
            }
        });
    };

    // Ejecutar animación de números después de un segundo
    setTimeout(animateNumbers, 1000);

    // Modal de imágenes simplificado
    document.querySelectorAll('.image-frame').forEach(frame => {
        frame.addEventListener('click', () => {
            const img = frame.querySelector('.system-screenshot');
            if (img) {
                const modal = document.createElement('div');
                modal.innerHTML = `
                    <div style="position: fixed; top: 0; left: 0; width: 100%; height: 100%; background: rgba(0,0,0,0.9); z-index: 10000; display: flex; align-items: center; justify-content: center; padding: 20px;">
                        <div style="position: relative; max-width: 90%; max-height: 90%;">
                            <img src="${img.src}" style="width: 100%; height: auto; border-radius: 12px;">
                            <button style="position: absolute; top: 10px; right: 10px; background: rgba(0,0,0,0.7); color: white; border: none; width: 40px; height: 40px; border-radius: 50%; cursor: pointer; font-size: 20px;">×</button>
                        </div>
                    </div>
                `;
                document.body.appendChild(modal);
                
                modal.addEventListener('click', () => modal.remove());
            }
        });
    });
});

console.log('Ferretería System - JavaScript cargado correctamente');
