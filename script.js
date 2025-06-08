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

// Funcionalidad mejorada para la flecha de scroll
const scrollIndicator = document.getElementById('scrollIndicator');
const scrollArrow = document.getElementById('scrollArrow');
const scrollIcon = document.getElementById('scrollIcon');
let isScrolledDown = false;

if (scrollArrow) {
    scrollArrow.addEventListener('click', function() {
        if (isScrolledDown) {
            // Scroll hacia arriba
            window.scrollTo({
                top: 0,
                behavior: 'smooth'
            });
        } else {
            // Scroll hacia abajo
            window.scrollTo({
                top: document.body.scrollHeight,
                behavior: 'smooth'
            });
        }
    });
}

// Detectar scroll para cambiar la flecha
window.addEventListener('scroll', () => {
    const scrollPosition = window.scrollY;
    const windowHeight = window.innerHeight;
    const documentHeight = document.body.scrollHeight;
    
    // Si hemos scrolleado más del 30% de la página
    if (scrollPosition > windowHeight * 0.3) {
        if (!isScrolledDown) {
            isScrolledDown = true;
            scrollIndicator.classList.add('scrolled');
            scrollIcon.classList.remove('fa-chevron-down');
            scrollIcon.classList.add('fa-chevron-up');
            
            // Animación de rotación suave
            scrollArrow.style.transform = 'rotate(180deg)';
            setTimeout(() => {
                scrollArrow.style.transform = 'rotate(0deg)';
            }, 300);
        }
    } else {
        if (isScrolledDown) {
            isScrolledDown = false;
            scrollIndicator.classList.remove('scrolled');
            scrollIcon.classList.remove('fa-chevron-up');
            scrollIcon.classList.add('fa-chevron-down');
            
            // Animación de rotación suave
            scrollArrow.style.transform = 'rotate(180deg)';
            setTimeout(() => {
                scrollArrow.style.transform = 'rotate(0deg)';
            }, 300);
        }
    }
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
        const subject = encodeURIComponent(`Consulta de ${nombre} - Starry_System`);
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

// Contador animado para estadísticas mejorado
function animateCounter(element, target, duration = 2000) {
    const originalText = element.textContent;
    
    // Detectar si es un formato especial como "24/7"
    if (originalText.includes('/')) {
        const parts = originalText.split('/');
        const firstNumber = parseInt(parts[0]);
        const secondPart = '/' + parts[1];
        
        let start = 0;
        const increment = firstNumber / (duration / 16);
        
        const timer = setInterval(() => {
            start += increment;
            if (start >= firstNumber) {
                element.textContent = firstNumber + secondPart;
                clearInterval(timer);
            } else {
                element.textContent = Math.floor(start) + secondPart;
            }
        }, 16);
        return;
    }
    
    // Detectar si termina con %
    if (originalText.includes('%')) {
        const number = parseInt(originalText.replace('%', ''));
        let start = 0;
        const increment = number / (duration / 16);
        
        const timer = setInterval(() => {
            start += increment;
            if (start >= number) {
                element.textContent = number + '%';
                clearInterval(timer);
            } else {
                element.textContent = Math.floor(start) + '%';
            }
        }, 16);
        return;
    }
    
    // Detectar si termina con +
    if (originalText.includes('+')) {
        const number = parseInt(originalText.replace('+', ''));
        let start = 0;
        const increment = number / (duration / 16);
        
        const timer = setInterval(() => {
            start += increment;
            if (start >= number) {
                element.textContent = number + '+';
                clearInterval(timer);
            } else {
                element.textContent = Math.floor(start) + '+';
            }
        }, 16);
        return;
    }
    
    // Para números simples
    const number = parseInt(originalText);
    let start = 0;
    const increment = number / (duration / 16);
    
    const timer = setInterval(() => {
        start += increment;
        if (start >= number) {
            element.textContent = number;
            clearInterval(timer);
        } else {
            element.textContent = Math.floor(start);
        }
    }, 16);
}

// Aplicar animaciones al cargar la página
document.addEventListener('DOMContentLoaded', () => {
    // Observar elementos para animaciones
    const animatedSections = document.querySelectorAll('.services, .portfolio, .about');
    animatedSections.forEach(section => observer.observe(section));
    
    // Animar contadores en hero - MEJORADO
    const stats = document.querySelectorAll('.stat-number');
    stats.forEach(stat => {
        const originalText = stat.textContent;
        
        const statObserver = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    animateCounter(stat, originalText);
                    statObserver.unobserve(stat);
                }
            });
        });
        
        statObserver.observe(stat);
    });
    
    // Efecto de escritura para el título principal - MEJORADO CON CURSOR
    const heroTitle = document.querySelector('.hero-content h1');
    if (heroTitle) {
        const originalHTML = heroTitle.innerHTML;
        
        // Separar el texto normal del texto con gradiente
        const textParts = originalHTML.split('<span class="gradient-text">');
        const normalText = textParts[0];
        const gradientPart = textParts[1];
        
        if (gradientPart) {
            const gradientText = gradientPart.split('</span>')[0];
            const remainingText = gradientPart.split('</span>')[1] || '';
            
            heroTitle.innerHTML = '';
            heroTitle.classList.add('typing-active');
            let normalIndex = 0;
            let gradientIndex = 0;
            let remainingIndex = 0;
            let currentPhase = 'normal';
            
            const typeWriter = () => {
                if (currentPhase === 'normal' && normalIndex < normalText.length) {
                    heroTitle.innerHTML = normalText.slice(0, normalIndex + 1);
                    normalIndex++;
                    setTimeout(typeWriter, 60);
                } else if (currentPhase === 'normal' && normalIndex >= normalText.length) {
                    currentPhase = 'gradient';
                    heroTitle.innerHTML = normalText + '<span class="gradient-text"></span>';
                    setTimeout(typeWriter, 100);
                } else if (currentPhase === 'gradient' && gradientIndex < gradientText.length) {
                    const currentGradientText = gradientText.slice(0, gradientIndex + 1);
                    heroTitle.innerHTML = normalText + '<span class="gradient-text">' + currentGradientText + '</span>';
                    gradientIndex++;
                    setTimeout(typeWriter, 60);
                } else if (currentPhase === 'gradient' && gradientIndex >= gradientText.length) {
                    currentPhase = 'remaining';
                    setTimeout(typeWriter, 100);
                } else if (currentPhase === 'remaining' && remainingIndex < remainingText.length) {
                    const currentRemainingText = remainingText.slice(0, remainingIndex + 1);
                    heroTitle.innerHTML = normalText + '<span class="gradient-text">' + gradientText + '</span>' + currentRemainingText;
                    remainingIndex++;
                    setTimeout(typeWriter, 60);
                } else {
                    // Animación completada
                    setTimeout(() => {
                        heroTitle.classList.remove('typing-active');
                        heroTitle.classList.add('typing-complete');
                    }, 500);
                }
            };
            
            setTimeout(typeWriter, 1200);
        } else {
            // Si no hay gradiente, usar el método simple
            heroTitle.innerHTML = '';
            heroTitle.classList.add('typing-active');
            let index = 0;
            
            const simpleTypeWriter = () => {
                if (index < normalText.length) {
                    heroTitle.innerHTML += normalText.charAt(index);
                    index++;
                    setTimeout(simpleTypeWriter, 60);
                } else {
                    setTimeout(() => {
                        heroTitle.classList.remove('typing-active');
                        heroTitle.classList.add('typing-complete');
                    }, 500);
                }
            };
            
            setTimeout(simpleTypeWriter, 1200);
        }
    }
    
    // Parallax mejorado para elementos flotantes
    window.addEventListener('scroll', throttle(() => {
        const scrolled = window.pageYOffset;
        const parallaxElements = document.querySelectorAll('.floating-element');
        const rate = scrolled * -0.3;
        
        parallaxElements.forEach((element, index) => {
            const speed = 0.3 + (index * 0.15);
            const yPos = -(scrolled * speed);
            const rotation = scrolled * 0.05 * (index + 1);
            const scale = 1 + (Math.sin(scrolled * 0.001 + index) * 0.1);
            
            element.style.transform = `translateY(${yPos}px) rotate(${rotation}deg) scale(${scale})`;
        });
        
        // Parallax para la imagen del about
        const aboutImage = document.querySelector('.about-image i');
        if (aboutImage) {
            const aboutSection = document.querySelector('.about');
            const rect = aboutSection.getBoundingClientRect();
            
            if (rect.top < window.innerHeight && rect.bottom > 0) {
                const scrollPercent = (window.innerHeight - rect.top) / (window.innerHeight + rect.height);
                const rotateY = (scrollPercent - 0.5) * 30;
                const translateY = Math.sin(scrollPercent * Math.PI) * 20;
                
                aboutImage.style.transform = `translateY(${translateY}px) rotateY(${rotateY}deg) scale(${1 + scrollPercent * 0.1})`;
            }
        }
    }, 16));
    
    // Intersection Observer mejorado para animaciones
    const enhancedObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('revealed');
                
                // Animar elementos hijos con stagger effect
                const children = entry.target.querySelectorAll('.service-card, .portfolio-item, .feature, .contact-item');
                children.forEach((child, index) => {
                    setTimeout(() => {
                        child.style.opacity = '1';
                        child.style.transform = 'translateY(0) scale(1)';
                        child.classList.add('animate-in');
                    }, index * 200);
                });
                
                // Efectos especiales para secciones específicas
                if (entry.target.classList.contains('about')) {
                    const aboutImage = entry.target.querySelector('.about-image i');
                    if (aboutImage) {
                        setTimeout(() => {
                            aboutImage.style.animation = 'computerFloat 6s ease-in-out infinite';
                        }, 500);
                    }
                }
                
                if (entry.target.classList.contains('contact')) {
                    const formElements = entry.target.querySelectorAll('.contact-form input, .contact-form textarea, .contact-form button');
                    formElements.forEach((element, index) => {
                        setTimeout(() => {
                            element.style.opacity = '1';
                            element.style.transform = 'translateY(0)';
                        }, index * 100);
                    });
                }
            }
        });
    }, {
        threshold: 0.1,
        rootMargin: '0px 0px -100px 0px'
    });
    
    // Observar todas las secciones principales
    document.querySelectorAll('.services, .portfolio, .about, .contact, .footer').forEach(section => {
        section.classList.add('reveal-on-scroll');
        enhancedObserver.observe(section);
    });
    
    // Efecto de mouse move para elementos interactivos
    document.addEventListener('mousemove', (e) => {
        const mouseX = e.clientX / window.innerWidth;
        const mouseY = e.clientY / window.innerHeight;
        
        // Efecto parallax sutil para elementos flotantes
        const floatingElements = document.querySelectorAll('.floating-element');
        floatingElements.forEach((element, index) => {
            const speed = (index + 1) * 0.5;
            const x = (mouseX - 0.5) * speed;
            const y = (mouseY - 0.5) * speed;
            
            element.style.transform += ` translate(${x}px, ${y}px)`;
        });
        
        // Efecto sutil para la imagen del about
        const aboutImage = document.querySelector('.about-image i');
        if (aboutImage) {
            const x = (mouseX - 0.5) * 10;
            const y = (mouseY - 0.5) * 10;
            aboutImage.style.transform += ` translate(${x}px, ${y}px)`;
        }
    });
    
    // Efecto de hover mejorado para las tarjetas
    document.querySelectorAll('.service-card, .portfolio-item').forEach(card => {
        card.addEventListener('mouseenter', () => {
            card.style.transform = 'translateY(-20px) scale(1.02) rotateX(5deg)';
            card.style.transition = 'all 0.4s cubic-bezier(0.34, 1.56, 0.64, 1)';
        });
        
        card.addEventListener('mouseleave', () => {
            card.style.transform = 'translateY(0) scale(1) rotateX(0deg)';
        });
        
        // Efecto de seguimiento del mouse
        card.addEventListener('mousemove', (e) => {
            const rect = card.getBoundingClientRect();
            const x = e.clientX - rect.left;
            const y = e.clientY - rect.top;
            const centerX = rect.width / 2;
            const centerY = rect.height / 2;
            const rotateX = (y - centerY) / 10;
            const rotateY = (centerX - x) / 10;
            
            card.style.transform = `translateY(-20px) scale(1.02) rotateX(${rotateX}deg) rotateY(${rotateY}deg)`;
        });
    });
    
    // Animación de conteo mejorada con easing
    function animateCounterEnhanced(element, target, duration = 2500) {
        const originalText = element.textContent;
        let startTime = null;
        
        function easeOutCubic(t) {
            return 1 - Math.pow(1 - t, 3);
        }
        
        function animate(currentTime) {
            if (startTime === null) startTime = currentTime;
            const elapsed = currentTime - startTime;
            const progress = Math.min(elapsed / duration, 1);
            const easedProgress = easeOutCubic(progress);
            
            if (originalText.includes('/')) {
                const parts = originalText.split('/');
                const firstNumber = parseInt(parts[0]);
                const secondPart = '/' + parts[1];
                const currentValue = Math.floor(firstNumber * easedProgress);
                element.textContent = currentValue + secondPart;
            } else if (originalText.includes('%')) {
                const number = parseInt(originalText.replace('%', ''));
                const currentValue = Math.floor(number * easedProgress);
                element.textContent = currentValue + '%';
            } else if (originalText.includes('+')) {
                const number = parseInt(originalText.replace('+', ''));
                const currentValue = Math.floor(number * easedProgress);
                element.textContent = currentValue + '+';
            } else {
                const number = parseInt(originalText);
                const currentValue = Math.floor(number * easedProgress);
                element.textContent = currentValue;
            }
            
            if (progress < 1) {
                requestAnimationFrame(animate);
            }
        }
        
        requestAnimationFrame(animate);
    }
    
    // Reemplazar la función de contador existente
    document.querySelectorAll('.stat-number').forEach(stat => {
        const originalText = stat.textContent;
        
        const statObserver = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    animateCounterEnhanced(stat, originalText);
                    statObserver.unobserve(stat);
                }
            });
        });
        
        statObserver.observe(stat);
    });
    
    // Animaciones mejoradas para elementos de contacto
    const contactItems = document.querySelectorAll('.contact-item');
    contactItems.forEach((item, index) => {
        item.style.animationDelay = `${0.2 + (index * 0.2)}s`;
        item.classList.add('contact-animate');
    });
    
    // Animaciones para elementos del formulario
    const formElements = document.querySelectorAll('.contact-form .form-group');
    formElements.forEach((element, index) => {
        element.style.transform = 'translateY(30px)';
        element.style.opacity = '0';
        element.style.transition = 'all 0.6s cubic-bezier(0.25, 0.46, 0.45, 0.94)';
        element.style.animationDelay = `${0.1 + (index * 0.1)}s`;
    });
    
    // Intersection Observer para animaciones del formulario
    const formObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                // Animar elementos del formulario
                const formGroups = entry.target.querySelectorAll('.form-group');
                formGroups.forEach((group, index) => {
                    setTimeout(() => {
                        group.style.transform = 'translateY(0)';
                        group.style.opacity = '1';
                    }, index * 100);
                });
                
                // Animar elementos de contacto
                const contactItems = entry.target.querySelectorAll('.contact-item');
                contactItems.forEach((item, index) => {
                    setTimeout(() => {
                        item.style.transform = 'translateX(0)';
                        item.style.opacity = '1';
                    }, index * 150);
                });
                
                formObserver.unobserve(entry.target);
            }
        });
    }, {
        threshold: 0.2,
        rootMargin: '0px 0px -50px 0px'
    });
    
    const contactSection = document.querySelector('.contact');
    if (contactSection) {
        formObserver.observe(contactSection);
    }
    
    // Validación en tiempo real
    const form = document.getElementById('contactForm');
    if (form) {
        const inputs = form.querySelectorAll('input, textarea');
        
        inputs.forEach(input => {
            const formGroup = input.closest('.form-group') || input.parentElement;
            
            input.addEventListener('blur', () => validateField(input, formGroup));
            input.addEventListener('input', () => clearFieldError(input, formGroup));
            
            // Efecto de focus mejorado
            input.addEventListener('focus', () => {
                input.style.transform = 'translateY(-2px) scale(1.02)';
                input.style.boxShadow = '0 5px 15px rgba(99, 102, 241, 0.2)';
            });
            
            input.addEventListener('blur', () => {
                if (!input.value) {
                    input.style.transform = 'translateY(0) scale(1)';
                    input.style.boxShadow = 'none';
                }
            });
        });
    }
});

// Funciones de validación
function validateField(input, formGroup) {
    const value = input.value.trim();
    const type = input.type;
    const name = input.name;
    
    clearFieldError(input, formGroup);
    
    if (!value && input.required) {
        showFieldError(input, formGroup, 'Este campo es obligatorio');
        return false;
    }
    
    if (type === 'email' && value) {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(value)) {
            showFieldError(input, formGroup, 'Por favor ingresa un email válido');
            return false;
        }
    }
    
    if (type === 'tel' && value) {
        const phoneRegex = /^[0-9\s\-\+\(\)]{10,}$/;
        if (!phoneRegex.test(value)) {
            showFieldError(input, formGroup, 'Por favor ingresa un teléfono válido');
            return false;
        }
    }
    
    if (name === 'nombre' && value.length < 2) {
        showFieldError(input, formGroup, 'El nombre debe tener al menos 2 caracteres');
        return false;
    }
    
    if (name === 'mensaje' && value.length < 10) {
        showFieldError(input, formGroup, 'El mensaje debe tener al menos 10 caracteres');
        return false;
    }
    
    showFieldSuccess(input, formGroup);
    return true;
}

function showFieldError(input, formGroup, message) {
    formGroup.classList.remove('success');
    formGroup.classList.add('error');
    
    // Remover mensaje anterior
    const existingError = formGroup.querySelector('.error-message');
    if (existingError) {
        existingError.remove();
    }
    
    // Agregar nuevo mensaje
    const errorDiv = document.createElement('div');
    errorDiv.className = 'error-message';
    errorDiv.innerHTML = `<i class="fas fa-exclamation-circle"></i> ${message}`;
    formGroup.appendChild(errorDiv);
    
    // Animación de error
    input.style.animation = 'shake 0.5s ease-in-out';
    setTimeout(() => {
        input.style.animation = '';
    }, 500);
}

function showFieldSuccess(input, formGroup) {
    formGroup.classList.remove('error');
    formGroup.classList.add('success');
    
    // Remover mensajes anteriores
    const existingMessage = formGroup.querySelector('.error-message, .success-message');
    if (existingMessage) {
        existingMessage.remove();
    }
    
    // Agregar mensaje de éxito
    const successDiv = document.createElement('div');
    successDiv.className = 'success-message';
    successDiv.innerHTML = `<i class="fas fa-check-circle"></i> Correcto`;
    formGroup.appendChild(successDiv);
}

function clearFieldError(input, formGroup) {
    formGroup.classList.remove('error', 'success');
    const message = formGroup.querySelector('.error-message, .success-message');
    if (message) {
        message.remove();
    }
}

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
        
        .nav-menu {
            height: calc(100vh - 70px);
            top: 70px;
            padding: 2rem 0;
        }
        
        .notification-content {
            padding: 15px;
            gap: 10px;
        }
        
        .notification.show {
            right: 5px;
        }
        
        .nav-menu a {
            font-size: 1.1rem;
            margin: 0 1rem;
        }
    }
`;
document.head.appendChild(style);
