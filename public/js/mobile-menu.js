/**
 * Menú móvil centrado con animación tipo burbuja para Inled.es
 */

(function() {
    'use strict';
    
    // Variables globales
    let mobileToggle = null;
    let mobileMenu = null;
    
    // Crear y configurar menú móvil
    function initMobileMenu() {
        console.log('🚀 Iniciando menú móvil centrado...');
        
        // Crear elementos
        createMobileElements();
        
        // Configurar eventos
        bindMobileEvents();
        
        console.log('✅ Menú móvil inicializado correctamente');
    }
    
    function createMobileElements() {
        // Crear toggle y menú juntos
        createMobileToggle();
        createMobileMenuContent();
    }
    
    function createMobileToggle() {
        if (mobileToggle) return;
        
        // Crear toggle directamente en el body con posicionamiento fijo centrado
        const toggleHTML = `
            <button class="mobile-menu-toggle" id="mobile-menu-toggle" aria-label="Abrir menú de navegación">
                <span></span>
                <span></span>
                <span></span>
            </button>
        `;
        
        document.body.insertAdjacentHTML('beforeend', toggleHTML);
        mobileToggle = document.getElementById('mobile-menu-toggle');
        
        console.log('🎯 Toggle de menú centrado creado');
    }
    
    function createMobileMenuContent() {
        if (mobileMenu) return;
        
        const menuHTML = `
            <nav class="mobile-menu" id="mobile-menu" role="navigation" aria-label="Menú de navegación móvil">
                <a href="/" class="mobile-menu-item">
                    <img src="/upload/cropped-INLED_simple-removebg-preview.png" alt="Inicio" onerror="this.style.display='none'">
                    🏠 Inicio
                </a>
                <a href="/ltl" class="mobile-menu-item">
                    <img src="/upload/Launchthelauncher-ytlogo__1_-removebg-preview.png" alt="Launch the launcher" onerror="this.style.display='none'">
                    🚀 Launch the launcher
                </a>
                <a href="/dsign" class="mobile-menu-item">
                    <img src="/upload/DSIGN-SIMPLE-WHITE-removebg-preview.png" alt="DSIGN" onerror="this.style.display='none'">
                    🎨 DSIGN
                </a>
                <a href="http://teafriendly.es" class="mobile-menu-item" target="_blank">
                    <img src="/upload/tea-friendly.png" alt="TEA Friendly" onerror="this.style.display='none'">
                    🤝 TEA Friendly
                </a>
                <a href="/blog" class="mobile-menu-item">
                    📝 Blog
                </a>
                <div class="mobile-menu-info">
                    <p>Inled Group - We make a better world</p>
                </div>
            </nav>
        `;
        
        document.body.insertAdjacentHTML('beforeend', menuHTML);
        mobileMenu = document.getElementById('mobile-menu');
        
        console.log('💫 Menú móvil con animación burbuja creado');
    }
    
    function bindMobileEvents() {
        if (!mobileToggle || !mobileMenu) {
            console.error('❌ Elementos del menú no encontrados');
            return;
        }
        
        // Evento principal del toggle
        mobileToggle.addEventListener('click', function(e) {
            e.preventDefault();
            e.stopPropagation();
            
            const isActive = mobileToggle.classList.contains('active');
            console.log(`🔘 Toggle clicked - Estado: ${isActive ? 'activo' : 'inactivo'}`);
            
            if (isActive) {
                closeMobileMenu();
            } else {
                openMobileMenu();
            }
        });
        
        // Cerrar menú al hacer click en enlaces
        const menuItems = document.querySelectorAll('.mobile-menu-item');
        menuItems.forEach(item => {
            item.addEventListener('click', closeMobileMenu);
        });
        
        // Cerrar menú al hacer click fuera
        document.addEventListener('click', function(e) {
            if (!mobileToggle.contains(e.target) && !mobileMenu.contains(e.target)) {
                if (mobileToggle.classList.contains('active')) {
                    closeMobileMenu();
                }
            }
        });
        
        // Cerrar con escape
        document.addEventListener('keydown', function(e) {
            if (e.key === 'Escape' && mobileToggle.classList.contains('active')) {
                closeMobileMenu();
            }
        });
        
        console.log('🎉 Eventos del menú móvil vinculados correctamente');
    }
    
    function openMobileMenu() {
        console.log('📂 Abriendo menú móvil...');
        
        mobileToggle.classList.add('active');
        mobileMenu.classList.add('active');
        mobileToggle.setAttribute('aria-expanded', 'true');
        
        // Prevenir scroll del body
        document.body.style.overflow = 'hidden';
        
        console.log('✅ Menú móvil abierto');
    }
    
    function closeMobileMenu() {
        console.log('📁 Cerrando menú móvil...');
        
        mobileToggle.classList.remove('active');
        mobileMenu.classList.remove('active');
        mobileToggle.setAttribute('aria-expanded', 'false');
        
        // Restaurar scroll del body
        document.body.style.overflow = '';
        
        console.log('✅ Menú móvil cerrado');
    }
    
    // Inicialización simple y directa
    function init() {
        // Solo ejecutar en móvil
        if (window.innerWidth <= 768) {
            console.log('📱 Dispositivo móvil detectado - Inicializando menú...');
            
            try {
                initMobileMenu();
                console.log('🎉 Menú móvil completamente funcional');
            } catch (error) {
                console.error('❌ Error al inicializar menú móvil:', error);
            }
        }
    }
    
    // Ejecutar cuando el DOM esté listo
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', init);
    } else {
        init();
    }
    
    // Cerrar menú al cambiar tamaño de ventana a desktop
    window.addEventListener('resize', function() {
        if (window.innerWidth > 768 && mobileToggle && mobileToggle.classList.contains('active')) {
            closeMobileMenu();
        }
    });
    
})();