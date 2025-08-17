// Banner móvil SIMPLE que se auto-oculta a los 6 segundos

(function() {
    'use strict';

    let bannerDismissed = false;

    // Detectar móvil simple
    function isMobile() {
        return window.innerWidth <= 768 || window.screen.width <= 768;
    }

    // Verificar si ya se ocultó
    function wasAlreadyDismissed() {
        try {
            if (localStorage.getItem('mobile-banner-dismissed') === 'yes') {
                return true;
            }
        } catch(e) {}
        return bannerDismissed;
    }

    // Marcar como ocultado para siempre
    function dismissForever() {
        bannerDismissed = true;
        try {
            localStorage.setItem('mobile-banner-dismissed', 'yes');
        } catch(e) {}
        console.log('Banner dismissed forever');
    }

    // Mostrar banner
    function showBanner() {
        console.log('📢 showBanner() called');
        const banner = document.getElementById('mobile-warning-banner');
        if (!banner) {
            console.error('❌ Banner element not found!');
            return;
        }
        
        console.log('📢 Banner element found, showing...');
        
        // Ajustar padding del body
        document.body.classList.add('body-with-banner');
        
        // Mostrar banner
        banner.style.display = 'block';
        setTimeout(() => {
            banner.classList.add('show');
            console.log('📢 Banner should be visible now');
        }, 100);
        
        // Auto-ocultar a los 6 segundos
        setTimeout(() => {
            console.log('⏰ 6 seconds passed, hiding banner');
            hideBanner();
        }, 6000);
    }

    // Ocultar banner
    function hideBanner() {
        const banner = document.getElementById('mobile-warning-banner');
        if (!banner) return;
        
        dismissForever();
        
        // Animar salida
        banner.classList.remove('show');
        banner.classList.add('hide');
        
        // Quitar padding del body
        setTimeout(() => {
            document.body.classList.remove('body-with-banner');
            banner.style.display = 'none';
        }, 300);
    }

    // Verificar si mostrar
    function shouldShow() {
        console.log('=== CHECKING IF SHOULD SHOW BANNER ===');
        
        // Solo en página de inicio (simplificado)
        const path = window.location.pathname;
        const isHomePage = path === '/' || path === '/index.html' || path === '' || path.endsWith('/');
        console.log('Is home page:', isHomePage, 'Path:', path, 'Full URL:', window.location.href);
        if (!isHomePage) {
            console.log('❌ Not on home page');
            // TEMPORALMENTE: mostrar en cualquier página para testing
            console.log('⚠️ TESTING: Ignoring home page check');
            // return false;
        }
        
        // Solo en móvil
        const mobileCheck = isMobile();
        console.log('Is mobile:', mobileCheck, 'Width:', window.innerWidth, 'Screen:', window.screen.width);
        if (!mobileCheck) {
            console.log('❌ Not mobile device');
            return false;
        }
        
        // No si ya se ocultó
        const dismissed = wasAlreadyDismissed();
        console.log('Was dismissed:', dismissed);
        if (dismissed) {
            console.log('❌ Already dismissed');
            return false;
        }
        
        console.log('✅ SHOULD SHOW BANNER');
        return true;
    }

    // Configurar eventos
    function setupEvents() {
        document.addEventListener('DOMContentLoaded', function() {
            const banner = document.getElementById('mobile-warning-banner');
            if (!banner) return;

            const closeBtn = document.getElementById('close-banner-btn');

            // Botón cerrar
            if (closeBtn) {
                closeBtn.onclick = function(e) {
                    e.preventDefault();
                    hideBanner();
                };
            }

            // Click en el banner para cerrarlo
            banner.onclick = function(e) {
                if (e.target === banner || e.target.classList.contains('mobile-banner-content')) {
                    hideBanner();
                }
            };
        });
    }

    // Inicializar
    function init() {
        console.log('🚀 Initializing mobile banner...');
        if (shouldShow()) {
            console.log('✅ Showing mobile banner for 6 seconds');
            setTimeout(showBanner, 500);
        } else {
            console.log('❌ Not showing mobile banner');
        }
    }

    // Ejecutar inmediatamente Y cuando DOM esté listo
    console.log('🚀 Mobile banner script loaded');
    console.log('Document ready state:', document.readyState);
    
    setupEvents();
    
    // Ejecutar ahora si el DOM ya está listo
    if (document.readyState === 'loading') {
        console.log('🔄 DOM still loading, waiting...');
        document.addEventListener('DOMContentLoaded', init);
    } else {
        console.log('✅ DOM already ready, initializing now');
        init();
    }
    
    // Fallback: ejecutar tras un delay por si acaso
    setTimeout(() => {
        console.log('🔄 Fallback init after 2 seconds');
        init();
    }, 2000);

    // Exponer funciones para debug
    window.MobileBanner = {
        show: showBanner,
        hide: hideBanner,
        reset: function() {
            bannerDismissed = false;
            try {
                localStorage.removeItem('mobile-banner-dismissed');
            } catch(e) {}
            console.log('Banner reset');
        }
    };

})();