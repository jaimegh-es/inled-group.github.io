/**
 * Sistema de traducción con Google Translate para Inled.es
 * Detecta el idioma del usuario y configura Google Translate automáticamente
 */

class GoogleTranslateSystem {
    constructor() {
        this.currentLanguage = this.detectUserLanguage();
        this.init();
    }
    
    init() {
        this.createLanguageSwitch();
        this.setupGoogleTranslate();
        this.bindEvents();
        
        // Aplicar idioma inicial si no es español
        if (this.currentLanguage === 'en') {
            this.setInitialLanguage();
        }
    }
    
    // Detectar idioma del usuario
    detectUserLanguage() {
        // 1. Verificar localStorage
        const savedLang = localStorage.getItem('inled-language');
        if (savedLang && (savedLang === 'es' || savedLang === 'en')) {
            return savedLang;
        }
        
        // 2. Detectar por navegador
        const browserLang = navigator.language || navigator.userLanguage;
        const langCode = browserLang.substring(0, 2).toLowerCase();
        
        // 3. Lista de países que probablemente hablan español
        const spanishCountries = [
            'es', 'ar', 'bo', 'cl', 'co', 'cr', 'cu', 'do', 
            'ec', 'sv', 'gq', 'gt', 'hn', 'mx', 'ni', 'pa', 
            'py', 'pe', 'pr', 'uy', 've'
        ];
        
        // 4. Si el idioma del navegador es español
        if (spanishCountries.includes(langCode)) {
            return 'es';
        }
        
        // Por defecto inglés para el resto
        return 'en';
    }
    
    // Crear el switch de idioma
    createLanguageSwitch() {
        const switchHTML = `
            <div class="language-switch" id="language-switch">
                <div class="language-option ${this.currentLanguage === 'es' ? 'active' : ''}" data-lang="es">
                    🇪🇸 ES
                </div>
                <div class="language-option ${this.currentLanguage === 'en' ? 'active' : ''}" data-lang="en">
                    🇬🇧 EN
                </div>
            </div>
        `;
        
        // Añadir al header
        const header = document.querySelector('.header');
        if (header) {
            // Buscar el div existente de Google Translate o crear uno nuevo
            let translateContainer = header.querySelector('#google_translate_element').parentElement;
            if (translateContainer) {
                translateContainer.innerHTML = switchHTML + translateContainer.innerHTML;
            } else {
                header.insertAdjacentHTML('beforeend', switchHTML);
            }
        } else {
            // Si no hay header, añadir al body
            document.body.insertAdjacentHTML('afterbegin', switchHTML);
        }
    }
    
    // Configurar Google Translate
    setupGoogleTranslate() {
        // Ocultar el widget original de Google Translate
        const style = document.createElement('style');
        style.textContent = `
            #google_translate_element {
                display: none !important;
            }
            
            .goog-te-banner-frame {
                display: none !important;
            }
            
            .goog-te-menu-frame {
                max-height: 400px !important;
                overflow-y: auto !important;
                background: #000 !important;
                border: 1px solid rgba(59, 180, 252, 0.3) !important;
            }
            
            /* Ocultar el "Powered by Google Translate" */
            .goog-logo-link {
                display: none !important;
            }
            
            .goog-te-gadget {
                color: transparent !important;
            }
            
            .goog-te-gadget > span > a {
                display: none !important;
            }
            
            .goog-te-gadget .goog-te-combo {
                display: none !important;
            }
            
            /* Personalizar el iframe de traducción */
            .skiptranslate iframe {
                visibility: hidden !important;
                height: 0 !important;
            }
            
            body.translated-ltr {
                margin-top: 0px !important;
            }
            
            .goog-text-highlight {
                background: none !important;
                box-shadow: none !important;
            }
        `;
        document.head.appendChild(style);
    }
    
    // Establecer idioma inicial
    setInitialLanguage() {
        // Esperar a que Google Translate esté disponible
        const waitForGoogleTranslate = () => {
            if (typeof google !== 'undefined' && google.translate && google.translate.TranslateElement) {
                setTimeout(() => {
                    this.translateToLanguage('en');
                }, 1000);
            } else {
                setTimeout(waitForGoogleTranslate, 500);
            }
        };
        
        waitForGoogleTranslate();
    }
    
    // Traducir a un idioma específico
    translateToLanguage(targetLang) {
        const googleTranslateCombo = document.querySelector('select.goog-te-combo');
        
        if (googleTranslateCombo) {
            // Valores para Google Translate
            const langValue = targetLang === 'en' ? 'en' : 'es';
            
            // Cambiar el valor del select
            googleTranslateCombo.value = langValue;
            
            // Disparar el evento change
            const event = new Event('change', { bubbles: true });
            googleTranslateCombo.dispatchEvent(event);
            
            this.currentLanguage = targetLang;
            localStorage.setItem('inled-language', targetLang);
            this.updateSwitchVisual();
        }
    }
    
    // Actualizar la apariencia del switch
    updateSwitchVisual() {
        const options = document.querySelectorAll('.language-option');
        options.forEach(option => {
            option.classList.toggle('active', option.dataset.lang === this.currentLanguage);
        });
    }
    
    // Vincular eventos
    bindEvents() {
        document.addEventListener('click', (e) => {
            if (e.target.classList.contains('language-option')) {
                const targetLang = e.target.dataset.lang;
                if (targetLang !== this.currentLanguage) {
                    // Efecto visual
                    e.target.style.transform = 'scale(0.95)';
                    setTimeout(() => {
                        e.target.style.transform = 'scale(1)';
                    }, 150);
                    
                    // Cambiar idioma
                    if (targetLang === 'es') {
                        // Volver al español original (recargar página)
                        const currentUrl = window.location.href;
                        if (currentUrl.includes('googtrans')) {
                            // Remover parámetros de Google Translate
                            const cleanUrl = currentUrl.split('#googtrans')[0].split('?googtrans')[0];
                            window.location.href = cleanUrl;
                        } else {
                            // Recargar página
                            window.location.reload();
                        }
                    } else {
                        // Traducir al inglés
                        this.translateToLanguage('en');
                    }
                }
            }
        });
    }
}

// Función global para inicializar Google Translate (requerida por Google)
function googleTranslateElementInit() {
    new google.translate.TranslateElement({
        pageLanguage: 'es',
        includedLanguages: 'en,es',
        layout: google.translate.TranslateElement.InlineLayout.SIMPLE,
        autoDisplay: false
    }, 'google_translate_element');
    
    // Inicializar nuestro sistema después de Google Translate
    setTimeout(() => {
        if (!window.googleTranslateSystem) {
            window.googleTranslateSystem = new GoogleTranslateSystem();
        }
    }, 500);
}

// Si Google Translate ya está cargado, inicializar inmediatamente
document.addEventListener('DOMContentLoaded', function() {
    // Crear el elemento oculto para Google Translate si no existe
    if (!document.getElementById('google_translate_element')) {
        const translateDiv = document.createElement('div');
        translateDiv.id = 'google_translate_element';
        translateDiv.style.display = 'none';
        document.body.appendChild(translateDiv);
    }
    
    // Esperar un poco y inicializar si Google Translate no se ha inicializado
    setTimeout(() => {
        if (typeof google !== 'undefined' && google.translate) {
            googleTranslateElementInit();
        } else {
            // Inicializar solo nuestro switch sin traducción automática
            window.googleTranslateSystem = new GoogleTranslateSystem();
        }
    }, 1000);
});

// Exponer la función globalmente
window.googleTranslateElementInit = googleTranslateElementInit;