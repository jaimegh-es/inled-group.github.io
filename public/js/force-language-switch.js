/**
 * Switch de idiomas forzado - se muestra siempre
 */

// Evitar declaraciones duplicadas con IIFE
(function() {
    'use strict';
    
    // Evitar crear múltiples switches
    if (document.getElementById('forced-language-switch')) {
        return;
    }
    
    // Crear el switch inmediatamente sin esperar
    let userLang = localStorage.getItem('inled-language') || 'es';

    // Crear elemento con estilos inline para garantizar visibilidad
    const switchElement = document.createElement('div');
    switchElement.id = 'forced-language-switch';
    switchElement.style.cssText = `
        position: fixed !important;
        top: 20px !important;
        right: 20px !important;
        z-index: 99999 !important;
        display: flex !important;
        align-items: center !important;
        gap: 0.5rem !important;
        background: rgba(0, 0, 0, 0.8) !important;
        border: 2px solid #3bb4fc !important;
        border-radius: 25px !important;
        padding: 0.3rem !important;
        font-family: Ubuntu, sans-serif !important;
        box-shadow: 0 4px 20px rgba(0, 0, 0, 0.3) !important;
    `;

    switchElement.innerHTML = `
        <div class="lang-btn" data-lang="es" style="
            padding: 0.4rem 0.8rem !important;
            border-radius: 20px !important;
            font-size: 0.9rem !important;
            font-weight: 500 !important;
            cursor: pointer !important;
            color: ${userLang === 'es' ? '#000' : 'rgba(255, 255, 255, 0.8)'} !important;
            background: ${userLang === 'es' ? '#3bb4fc' : 'transparent'} !important;
            user-select: none !important;
            transition: all 0.3s ease !important;
        ">
            🇪🇸 ES
        </div>
        <div class="lang-btn" data-lang="en" style="
            padding: 0.4rem 0.8rem !important;
            border-radius: 20px !important;
            font-size: 0.9rem !important;
            font-weight: 500 !important;
            cursor: pointer !important;
            color: ${userLang === 'en' ? '#000' : 'rgba(255, 255, 255, 0.8)'} !important;
            background: ${userLang === 'en' ? '#3bb4fc' : 'transparent'} !important;
            user-select: none !important;
            transition: all 0.3s ease !important;
        ">
            🇬🇧 EN
        </div>
    `;

    // Añadir al DOM inmediatamente
    document.documentElement.appendChild(switchElement);

    // Función para cambiar idioma de manera más robusta
    function changeLanguage(targetLang) {
        localStorage.setItem('inled-language', targetLang);
        
        if (targetLang === 'es') {
            // Finalizar traducción de Google Translate y volver al español original
            
            // 1. Intentar usar la API de Google Translate si está disponible
            if (typeof google !== 'undefined' && google.translate && google.translate.TranslateElement) {
                const googleTranslateCombo = document.querySelector('select.goog-te-combo');
                if (googleTranslateCombo) {
                    googleTranslateCombo.value = '';
                    googleTranslateCombo.dispatchEvent(new Event('change'));
                }
            }
            
            // 2. Limpiar cookies de Google Translate
            document.cookie = 'googtrans=; expires=Thu, 01 Jan 1970 00:00:00 GMT; path=/; domain=' + window.location.hostname;
            document.cookie = 'googtrans=; expires=Thu, 01 Jan 1970 00:00:00 GMT; path=/; domain=.' + window.location.hostname;
            
            // 3. Limpiar localStorage de Google Translate
            try {
                Object.keys(localStorage).forEach(key => {
                    if (key.includes('google') || key.includes('translate')) {
                        localStorage.removeItem(key);
                    }
                });
            } catch (e) {
                console.log('No se pudo limpiar localStorage');
            }
            
            // 4. Limpiar elementos del DOM añadidos por Google Translate
            const elementsToRemove = [
                '.goog-te-banner-frame',
                '.goog-te-menu-frame', 
                '.skiptranslate',
                'iframe[src*="translate.google"]',
                'iframe[src*="translate.googleapis"]',
                '[class*="goog-te"]',
                '.VIpgJd-ZVi9od-ORHb-OEVmcd'
            ];
            
            elementsToRemove.forEach(selector => {
                const elements = document.querySelectorAll(selector);
                elements.forEach(el => {
                    try {
                        el.remove();
                    } catch (e) {
                        console.log('No se pudo eliminar elemento:', selector);
                    }
                });
            });
            
            // 5. Restaurar clases del body que Google Translate modifica
            document.body.classList.remove('translated-ltr', 'translated-rtl');
            document.documentElement.classList.remove('translated-ltr', 'translated-rtl');
            
            // 6. Redirigir a URL limpia sin fragmentos de traducción
            const cleanUrl = window.location.protocol + '//' + window.location.host + window.location.pathname + window.location.search;
            const currentUrl = window.location.href;
            
            // Si hay fragmentos de traducción o parámetros, limpiar
            if (currentUrl.includes('#googtrans') || currentUrl.includes('googtrans') || currentUrl !== cleanUrl) {
                window.location.replace(cleanUrl);
            } else {
                // Forzar recarga para eliminar cualquier traducción residual
                window.location.reload(true);
            }
            
        } else if (targetLang === 'en') {
            // Ir al inglés usando Google Translate y autorecargar
            const currentUrl = window.location.protocol + '//' + window.location.host + window.location.pathname + window.location.search;
            const translatedUrl = currentUrl + '#googtrans(es|en)';
            
            // Cambiar la URL
            window.location.replace(translatedUrl);
            
            // Forzar recarga automática después de cambiar la URL
            setTimeout(() => {
                window.location.reload(true);
            }, 100);
        }
    }

    // Añadir funcionalidad
    switchElement.addEventListener('click', function(e) {
        if (e.target.classList.contains('lang-btn')) {
            const targetLang = e.target.dataset.lang;
            const currentStoredLang = localStorage.getItem('inled-language') || 'es';
            
            if (targetLang !== currentStoredLang) {
                // Efecto visual
                e.target.style.transform = 'scale(0.9)';
                setTimeout(() => {
                    e.target.style.transform = 'scale(1)';
                }, 150);
                
                // Cambiar idioma después del efecto visual
                setTimeout(() => {
                    changeLanguage(targetLang);
                }, 300);
            }
        }
    });

    // Hover effects
    switchElement.addEventListener('mouseover', function(e) {
        if (e.target.classList.contains('lang-btn')) {
            const isActive = e.target.dataset.lang === userLang;
            if (!isActive) {
                e.target.style.background = 'rgba(59, 180, 252, 0.2)';
                e.target.style.color = 'white';
            }
        }
    });

    switchElement.addEventListener('mouseout', function(e) {
        if (e.target.classList.contains('lang-btn')) {
            const isActive = e.target.dataset.lang === userLang;
            if (!isActive) {
                e.target.style.background = 'transparent';
                e.target.style.color = 'rgba(255, 255, 255, 0.8)';
            }
        }
    });

    console.log('Switch de idiomas mejorado creado y visible');
    
    // Función para eliminar banner de Google Translate periódicamente
    function removeBannerPeriodically() {
        const bannersToRemove = [
            '.goog-te-banner-frame',
            'iframe.goog-te-banner-frame',
            '.VIpgJd-ZVi9od-ORHb-OEVmcd',
            '.skiptranslate iframe',
            '[id*="google_translate"]',
            '[class*="goog-te"]:not(.goog-text-highlight)'
        ];
        
        bannersToRemove.forEach(selector => {
            const elements = document.querySelectorAll(selector);
            elements.forEach(el => {
                try {
                    el.style.display = 'none';
                    el.style.visibility = 'hidden';
                    el.style.opacity = '0';
                    el.style.height = '0';
                    el.style.maxHeight = '0';
                    el.style.overflow = 'hidden';
                    el.style.position = 'absolute';
                    el.style.top = '-9999px';
                    el.style.left = '-9999px';
                } catch (e) {
                    // Si no se puede modificar con estilos, intentar remover
                    try {
                        el.remove();
                    } catch (e2) {
                        console.log('No se pudo ocultar/eliminar banner');
                    }
                }
            });
        });
        
        // Restaurar margin del body si Google Translate lo modifica
        if (document.body.style.marginTop && parseInt(document.body.style.marginTop) > 0) {
            document.body.style.marginTop = '0px';
        }
    }
    
    // Ejecutar inmediatamente y luego periódicamente
    removeBannerPeriodically();
    setInterval(removeBannerPeriodically, 1000);
    
    // Observer para detectar cambios en el DOM y eliminar banners
    const observer = new MutationObserver(function(mutations) {
        mutations.forEach(function(mutation) {
            if (mutation.type === 'childList') {
                mutation.addedNodes.forEach(function(node) {
                    if (node.nodeType === 1) { // Element node
                        // Si el nodo añadido es un banner de Google Translate
                        if (node.classList && (
                            node.classList.contains('goog-te-banner-frame') ||
                            node.classList.contains('skiptranslate') ||
                            node.id === 'goog-gt-'
                        )) {
                            removeBannerPeriodically();
                        }
                    }
                });
            }
        });
    });
    
    // Observar cambios en el documento
    observer.observe(document.body, {
        childList: true,
        subtree: true
    });

})(); // Cerrar IIFE