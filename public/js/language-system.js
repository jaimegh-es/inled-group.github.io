/**
 * Sistema de traducción automático para Inled.es
 * Detecta el idioma del usuario y proporciona traducción ES/EN
 */

// Traducciones
const translations = {
    es: {
        // Página principal
        "We make a better world.": "Hacemos un mundo mejor.",
        "En Inled creamos proyectos que hacen del mundo y tu día a día un lugar mejor": "En Inled creamos proyectos que hacen del mundo y tu día a día un lugar mejor",
        "Próximamente...": "Próximamente...",
        
        // Proyectos
        "Launch the launcher": "Launch the launcher",
        "Tutoriales sobre nuevas tecnologías para profesores. Los primeros tutoriales en español acerca de Bytello": "Tutoriales sobre nuevas tecnologías para profesores. Los primeros tutoriales en español acerca de Bytello",
        "DSIGN": "DSIGN",
        "Diseño web": "Diseño web",
        "TEA Friendly": "TEA Friendly",
        "Certificación para centros educativos que atienden las necesidades de las personas con autismo": "Certificación para centros educativos que atienden las necesidades de las personas con autismo",
        "Swiftinstall": "Swiftinstall",
        "Instala y elimina aplicaciones fuera de la Store de Linux": "Instala y elimina aplicaciones fuera de la Store de Linux",
        "Start": "Start",
        "Busca más rápido, accede al instante. Tu multibuscador y página de inicio": "Busca más rápido, accede al instante. Tu multibuscador y página de inicio",
        "Warp VPN GUI": "Warp VPN GUI",
        "Interfaz gráfica para la VPN de Cloudflare": "Interfaz gráfica para la VPN de Cloudflare",
        
        // Footer y navegación
        "Inicio": "Inicio",
        "Proyectos": "Proyectos",
        "Blog": "Blog",
        "Contacto": "Contacto"
    },
    en: {
        // Página principal
        "Hacemos un mundo mejor.": "We make a better world.",
        "We make a better world.": "We make a better world.",
        "En Inled creamos proyectos que hacen del mundo y tu día a día un lugar mejor": "At Inled we create projects that make the world and your daily life a better place",
        "Próximamente...": "Coming soon...",
        
        // Proyectos
        "Launch the launcher": "Launch the launcher",
        "Tutoriales sobre nuevas tecnologías para profesores. Los primeros tutoriales en español acerca de Bytello": "Tutorials on new technologies for teachers. The first Spanish tutorials about Bytello",
        "DSIGN": "DSIGN",
        "Diseño web": "Web Design",
        "TEA Friendly": "TEA Friendly",
        "Certificación para centros educativos que atienden las necesidades de las personas con autismo": "Certification for educational centers that serve the needs of people with autism",
        "Swiftinstall": "Swiftinstall",
        "Instala y elimina aplicaciones fuera de la Store de Linux": "Install and remove applications outside the Linux Store",
        "Start": "Start",
        "Busca más rápido, accede al instante. Tu multibuscador y página de inicio": "Search faster, access instantly. Your multi-search engine and homepage",
        "Warp VPN GUI": "Warp VPN GUI",
        "Interfaz gráfica para la VPN de Cloudflare": "Graphical interface for Cloudflare's VPN",
        
        // Footer y navegación
        "Inicio": "Home",
        "Proyectos": "Projects",
        "Blog": "Blog",
        "Contacto": "Contact"
    }
};

class LanguageSystem {
    constructor() {
        this.currentLanguage = this.detectUserLanguage();
        this.init();
    }
    
    init() {
        this.createLanguageSwitch();
        this.translatePage(this.currentLanguage);
        this.bindEvents();
    }
    
    // Detectar idioma del usuario
    detectUserLanguage() {
        // 1. Verificar si hay idioma guardado en localStorage
        const savedLang = localStorage.getItem('inled-language');
        if (savedLang && (savedLang === 'es' || savedLang === 'en')) {
            return savedLang;
        }
        
        // 2. Detectar por navegador
        const browserLang = navigator.language || navigator.userLanguage;
        const langCode = browserLang.substring(0, 2).toLowerCase();
        
        // 3. Lista de países que hablan español
        const spanishCountries = [
            'es', 'ar', 'bo', 'cl', 'co', 'cr', 'cu', 'do', 
            'ec', 'sv', 'gq', 'gt', 'hn', 'mx', 'ni', 'pa', 
            'py', 'pe', 'pr', 'uy', 've'
        ];
        
        // 4. Detectar por zona horaria (aproximado)
        const timezone = Intl.DateTimeFormat().resolvedOptions().timeZone;
        const spanishTimezones = [
            'Europe/Madrid', 'America/Mexico_City', 'America/Argentina/Buenos_Aires',
            'America/Bogota', 'America/Santiago', 'America/Lima', 'America/Caracas',
            'America/Guatemala', 'America/Havana', 'America/Santo_Domingo'
        ];
        
        // Si el idioma del navegador es español o está en zona horaria española
        if (spanishCountries.includes(langCode) || spanishTimezones.includes(timezone)) {
            return 'es';
        }
        
        // Por defecto inglés para el resto del mundo
        return 'en';
    }
    
    // Crear el switch de idioma
    createLanguageSwitch() {
        const switchHTML = `
            <div class="language-switch" id="language-switch">
                <div class="language-option ${this.currentLanguage === 'es' ? 'active' : ''}" data-lang="es">
                    ES
                </div>
                <div class="language-option ${this.currentLanguage === 'en' ? 'active' : ''}" data-lang="en">
                    EN
                </div>
            </div>
        `;
        
        // Añadir al header si existe
        const header = document.querySelector('.header');
        if (header) {
            const headerRight = header.querySelector('.header-right') || document.createElement('div');
            if (!header.querySelector('.header-right')) {
                headerRight.className = 'header-right';
                header.appendChild(headerRight);
            }
            headerRight.innerHTML = switchHTML + headerRight.innerHTML;
        } else {
            // Si no hay header, añadir al body
            document.body.insertAdjacentHTML('afterbegin', switchHTML);
        }
    }
    
    // Traducir la página
    translatePage(targetLang) {
        const targetTranslations = translations[targetLang];
        if (!targetTranslations) return;
        
        // Función recursiva para traducir todos los nodos de texto
        const translateNode = (node) => {
            if (node.nodeType === Node.TEXT_NODE) {
                const text = node.textContent.trim();
                if (text && targetTranslations[text]) {
                    node.textContent = node.textContent.replace(text, targetTranslations[text]);
                }
            } else if (node.nodeType === Node.ELEMENT_NODE) {
                // No traducir scripts, styles, ni el switch de idioma
                if (['SCRIPT', 'STYLE', 'NOSCRIPT'].includes(node.tagName) || 
                    node.classList.contains('language-switch')) {
                    return;
                }
                
                // Traducir atributos específicos
                if (node.hasAttribute('placeholder')) {
                    const placeholder = node.getAttribute('placeholder');
                    if (targetTranslations[placeholder]) {
                        node.setAttribute('placeholder', targetTranslations[placeholder]);
                    }
                }
                
                if (node.hasAttribute('alt')) {
                    const alt = node.getAttribute('alt');
                    if (targetTranslations[alt]) {
                        node.setAttribute('alt', targetTranslations[alt]);
                    }
                }
                
                if (node.hasAttribute('title')) {
                    const title = node.getAttribute('title');
                    if (targetTranslations[title]) {
                        node.setAttribute('title', targetTranslations[title]);
                    }
                }
                
                // Recursivamente traducir hijos
                for (let child of node.childNodes) {
                    translateNode(child);
                }
            }
        };
        
        // Traducir toda la página
        translateNode(document.body);
        
        // Actualizar idioma actual
        this.currentLanguage = targetLang;
        localStorage.setItem('inled-language', targetLang);
        
        // Actualizar el switch visual
        this.updateSwitchVisual();
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
                    this.translatePage(targetLang);
                    
                    // Efecto visual suave
                    e.target.style.transform = 'scale(0.95)';
                    setTimeout(() => {
                        e.target.style.transform = 'scale(1)';
                    }, 150);
                }
            }
        });
    }
}

// Inicializar cuando el DOM esté listo
document.addEventListener('DOMContentLoaded', function() {
    // Pequeño delay para asegurar que otros scripts hayan cargado
    setTimeout(() => {
        window.languageSystem = new LanguageSystem();
    }, 100);
});

// Detectar cambios de página para reinicializar
let currentPath = window.location.pathname;
setInterval(() => {
    if (window.location.pathname !== currentPath) {
        currentPath = window.location.pathname;
        if (window.languageSystem) {
            setTimeout(() => {
                window.languageSystem.translatePage(window.languageSystem.currentLanguage);
            }, 500);
        }
    }
}, 1000);