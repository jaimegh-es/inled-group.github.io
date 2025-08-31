/**
 * Efectos suaves universales para Inled.es
 * Scroll suave y animaciones sutiles en todas las páginas
 */

document.addEventListener('DOMContentLoaded', function() {
    initUniversalSmoothEffects();
});

function initUniversalSmoothEffects() {
    // Header sticky
    initStickyHeader();
    
    // Scroll suave mejorado para toda la web
    initSmoothScrolling();
    
    // Efectos de hover sutiles universales
    initUniversalHoverEffects();
    
    // Asegurar que la sección próximamente esté bien difuminada
    ensureBlurrySection();
}

// Header sticky que se hace más pequeño al hacer scroll
function initStickyHeader() {
    const header = document.querySelector('.header');
    const logo = document.querySelector('.logo');
    let lastScrollTop = 0;
    
    if (!header) return;
    
    // Función para manejar el scroll
    function handleScroll() {
        const scrollTop = window.pageYOffset || document.documentElement.scrollTop;
        const scrollThreshold = 50;
        
        if (scrollTop > scrollThreshold) {
            header.classList.add('scrolled');
            document.body.classList.add('header-scrolled');
            if (logo) logo.classList.add('scrolled');
        } else {
            header.classList.remove('scrolled');
            document.body.classList.remove('header-scrolled');
            if (logo) logo.classList.remove('scrolled');
        }
        
        lastScrollTop = scrollTop;
    }
    
    // Throttle scroll para mejor rendimiento
    let ticking = false;
    
    window.addEventListener('scroll', function() {
        if (!ticking) {
            requestAnimationFrame(function() {
                handleScroll();
                ticking = false;
            });
            ticking = true;
        }
    });
    
    // Llamar una vez al cargar para el estado inicial
    handleScroll();
}

// Scroll suave mejorado
function initSmoothScrolling() {
    // Asegurar scroll suave en toda la página
    document.documentElement.style.scrollBehavior = 'smooth';
    document.body.style.scrollBehavior = 'smooth';
    
    // Mejorar scroll en enlaces internos
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            e.preventDefault();
            const target = document.querySelector(this.getAttribute('href'));
            if (target) {
                target.scrollIntoView({
                    behavior: 'smooth',
                    block: 'start'
                });
            }
        });
    });
    
    // Scroll suave al volver atrás/adelante en el navegador
    window.addEventListener('popstate', function() {
        setTimeout(() => {
            window.scrollTo({
                top: window.pageYOffset,
                behavior: 'smooth'
            });
        }, 50);
    });
}

// Efectos de hover sutiles universales
function initUniversalHoverEffects() {
    // Para todas las tarjetas en cualquier página
    const allCards = document.querySelectorAll('.project-card, .card-ltl, .card-instalables, .btn');
    
    allCards.forEach(card => {
        card.addEventListener('mouseenter', () => {
            if (!card.closest('.blurry-overlay') && !card.style.pointerEvents === 'none') {
                card.style.borderColor = 'rgba(59, 180, 252, 0.3)';
                card.style.transform = 'translateY(-5px)';
            }
        });
        
        card.addEventListener('mouseleave', () => {
            card.style.borderColor = '';
            card.style.transform = '';
        });
    });
    
    // Enlaces suaves
    const allLinks = document.querySelectorAll('a');
    allLinks.forEach(link => {
        link.style.transition = 'all 0.3s ease';
    });
}

// Asegurar que la sección próximamente esté difuminada
function ensureBlurrySection() {
    const blurryContainers = document.querySelectorAll('.container[style*="position: relative"]');
    
    blurryContainers.forEach(container => {
        const overlay = container.querySelector('.blurry-overlay');
        if (overlay) {
            // Asegurar que el overlay funcione correctamente
            overlay.style.position = 'absolute';
            overlay.style.top = '0';
            overlay.style.left = '0';
            overlay.style.width = '100%';
            overlay.style.height = '100%';
            overlay.style.backgroundColor = 'rgba(0, 0, 0, 0.4)';
            overlay.style.backdropFilter = 'blur(8px)';
            overlay.style.webkitBackdropFilter = 'blur(8px)';
            overlay.style.zIndex = '10';
            overlay.style.borderRadius = '20px';
            overlay.style.pointerEvents = 'none';
            
            // Hacer el contenido no seleccionable
            const cards = container.querySelectorAll('.project-card');
            cards.forEach(card => {
                card.style.userSelect = 'none';
                card.style.pointerEvents = 'none';
                card.style.position = 'relative';
                card.style.zIndex = '1';
            });
        }
    });
}

// Función para desactivar efectos si el usuario prefiere menos movimiento
if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
    const style = document.createElement('style');
    style.textContent = `
        *, *::before, *::after {
            animation-duration: 0.01ms !important;
            animation-iteration-count: 1 !important;
            transition-duration: 0.01ms !important;
        }
        
        html, body {
            scroll-behavior: auto !important;
        }
    `;
    document.head.appendChild(style);
} else {
    // Añadir CSS para scroll extra suave solo si el usuario no prefiere movimiento reducido
    const smoothScrollCSS = document.createElement('style');
    smoothScrollCSS.textContent = `
        html {
            scroll-behavior: smooth !important;
            scroll-padding-top: 2rem;
        }
        
        body {
            scroll-behavior: smooth !important;
        }
        
        * {
            scroll-behavior: smooth !important;
        }
        
        /* Transiciones suaves universales */
        * {
            transition: all 0.3s ease;
        }
        
        /* Excepciones para elementos que no deben tener transición */
        .wemake, .wemake *, 
        h1.wemake, 
        .welcome-container h2,
        .h1init {
            transition: none !important;
        }
    `;
    document.head.appendChild(smoothScrollCSS);
}