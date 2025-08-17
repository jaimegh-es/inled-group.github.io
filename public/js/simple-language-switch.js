/**
 * Switch de idiomas simple para Inled.es
 * Usa Google Translate para la traducción
 */

(function() {
    // Función para crear el switch
    function createLanguageSwitch() {
        // Evitar duplicados
        if (document.getElementById('language-switch')) {
            return;
        }
        
        const currentLanguage = localStorage.getItem('inled-language') || 'es';
        
        const switchHTML = `
            <div class="language-switch" id="language-switch">
                <div class="language-option ${currentLanguage === 'es' ? 'active' : ''}" data-lang="es">
                    🇪🇸 ES
                </div>
                <div class="language-option ${currentLanguage === 'en' ? 'active' : ''}" data-lang="en">
                    🇬🇧 EN
                </div>
            </div>
        `;
        
        // Intentar añadir al header
        const headerRight = document.querySelector('.header-right');
        const header = document.querySelector('.header');
        
        if (headerRight) {
            headerRight.insertAdjacentHTML('afterbegin', switchHTML);
            console.log('Switch añadido al header-right');
        } else if (header) {
            header.insertAdjacentHTML('beforeend', switchHTML);
            console.log('Switch añadido al header');
        } else {
            // Fallback: crear como elemento fijo con estilos inline
            document.body.insertAdjacentHTML('afterbegin', `
                <div class="language-switch" id="language-switch" style="
                    position: fixed; 
                    top: 20px; 
                    right: 20px; 
                    z-index: 10000;
                    display: flex;
                    align-items: center;
                    gap: 0.5rem;
                    background: rgba(59, 180, 252, 0.1);
                    border: 1px solid rgba(59, 180, 252, 0.3);
                    border-radius: 25px;
                    padding: 0.3rem;
                    backdrop-filter: blur(10px);
                ">
                    <div class="language-option ${currentLanguage === 'es' ? 'active' : ''}" data-lang="es" style="
                        padding: 0.4rem 0.8rem;
                        border-radius: 20px;
                        font-size: 0.9rem;
                        font-weight: 500;
                        cursor: pointer;
                        color: ${currentLanguage === 'es' ? 'white' : 'rgba(255, 255, 255, 0.7)'};
                        background: ${currentLanguage === 'es' ? '#3bb4fc' : 'transparent'};
                        user-select: none;
                        transition: all 0.3s ease;
                    ">
                        🇪🇸 ES
                    </div>
                    <div class="language-option ${currentLanguage === 'en' ? 'active' : ''}" data-lang="en" style="
                        padding: 0.4rem 0.8rem;
                        border-radius: 20px;
                        font-size: 0.9rem;
                        font-weight: 500;
                        cursor: pointer;
                        color: ${currentLanguage === 'en' ? 'white' : 'rgba(255, 255, 255, 0.7)'};
                        background: ${currentLanguage === 'en' ? '#3bb4fc' : 'transparent'};
                        user-select: none;
                        transition: all 0.3s ease;
                    ">
                        🇬🇧 EN
                    </div>
                </div>
            `);
            console.log('Switch añadido como fallback al body');
        }
        
        bindEvents();
    }
    
    // Función para vincular eventos
    function bindEvents() {
        document.addEventListener('click', function(e) {
            if (e.target.classList.contains('language-option')) {
                const targetLang = e.target.dataset.lang;
                const currentLang = localStorage.getItem('inled-language') || 'es';
                
                if (targetLang !== currentLang) {
                    // Guardar preferencia
                    localStorage.setItem('inled-language', targetLang);
                    
                    // Efecto visual
                    e.target.style.transform = 'scale(0.95)';
                    setTimeout(() => {
                        e.target.style.transform = 'scale(1)';
                    }, 150);
                    
                    // Cambiar idioma usando Google Translate URL
                    setTimeout(() => {
                        if (targetLang === 'es') {
                            // Volver al español original
                            const currentUrl = window.location.href;
                            const cleanUrl = currentUrl.split('#googtrans')[0].split('?googtrans')[0];
                            if (currentUrl !== cleanUrl) {
                                window.location.href = cleanUrl;
                            } else {
                                window.location.reload();
                            }
                        } else if (targetLang === 'en') {
                            // Ir a la versión en inglés
                            const currentUrl = window.location.href.split('#googtrans')[0].split('?googtrans')[0];
                            window.location.href = currentUrl + '#googtrans(es|en)';
                        }
                    }, 200);
                }
            }
        });
    }
    
    // Detectar idioma automáticamente en la primera visita
    function detectAndSetInitialLanguage() {
        if (!localStorage.getItem('inled-language')) {
            const browserLang = navigator.language || navigator.userLanguage;
            const langCode = browserLang.substring(0, 2).toLowerCase();
            
            // Si no es español, establecer inglés
            if (langCode !== 'es') {
                localStorage.setItem('inled-language', 'en');
                // Redirigir automáticamente al inglés
                setTimeout(() => {
                    window.location.href = window.location.href + '#googtrans(es|en)';
                }, 1000);
            } else {
                localStorage.setItem('inled-language', 'es');
            }
        }
    }
    
    // Inicializar
    function init() {
        detectAndSetInitialLanguage();
        createLanguageSwitch();
    }
    
    // Ejecutar cuando el DOM esté listo
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', init);
    } else {
        init();
    }
    
    // También intentar después de un delay para asegurar que el header esté cargado
    setTimeout(init, 100);
    setTimeout(init, 500);
    setTimeout(init, 1000);
    
})();