/**
 * mobile-menu.js
 * Controle do menu responsivo para dispositivos móveis
 * @version 1.0.1
 */

document.addEventListener('DOMContentLoaded', function() {
    const menuToggle = document.getElementById('menuToggle');
    const mainNav = document.getElementById('mainNav');
    const navLinks = mainNav ? mainNav.querySelectorAll('.nav-link') : [];
    const body = document.body;
    const header = document.querySelector('.main-header');
    
    let isMenuOpen = false;
    
    if (!menuToggle || !mainNav) return;
    
    function openMenu() {
        menuToggle.classList.add('active');
        mainNav.classList.add('active');
        menuToggle.setAttribute('aria-label', 'Fechar menu');
        menuToggle.setAttribute('aria-expanded', 'true');
        body.style.overflow = 'hidden'; 
        isMenuOpen = true;
        
        if (header) header.classList.add('menu-open');
        window.dispatchEvent(new CustomEvent('menuStateChange', { detail: { isOpen: true } }));
    }
    
    function closeMenu() {
        menuToggle.classList.remove('active');
        mainNav.classList.remove('active');
        menuToggle.setAttribute('aria-label', 'Abrir menu');
        menuToggle.setAttribute('aria-expanded', 'false');
        body.style.overflow = ''; 
        isMenuOpen = false;
        
        if (header) header.classList.remove('menu-open');
        window.dispatchEvent(new CustomEvent('menuStateChange', { detail: { isOpen: false } }));
    }
    
    function toggleMenu() {
        isMenuOpen ? closeMenu() : openMenu();
    }
    
    function isMobileScreen() {
        return window.innerWidth <= 768;
    }

    // --- FUNÇÕES NOMEADAS PARA PERMITIR O REMOVEEVENTLISTENER ---
    
    const handleLinkClick = function(e) {
        if (this.getAttribute('href').startsWith('#')) {
            e.preventDefault();
            const targetElement = document.querySelector(this.getAttribute('href'));
            
            if (targetElement) {
                closeMenu();
                setTimeout(() => {
                    targetElement.scrollIntoView({ behavior: 'smooth', block: 'start' });
                }, 300);
            }
        } else if (isMobileScreen()) {
            setTimeout(closeMenu, 300);
        }
    };

    const handleClickOutside = function(e) {
        if (!isMenuOpen || !isMobileScreen()) return;
        if (!mainNav.contains(e.target) && !menuToggle.contains(e.target)) {
            closeMenu();
        }
    };

    const handleEscapeKey = function(e) {
        if (e.key === 'Escape' && isMenuOpen) closeMenu();
    };

    let resizeTimeout;
    const handleResize = function() {
        clearTimeout(resizeTimeout);
        resizeTimeout = setTimeout(function() {
            if (!isMobileScreen() && isMenuOpen) closeMenu();
            
            if (isMobileScreen()) {
                menuToggle.setAttribute('aria-haspopup', 'true');
                menuToggle.setAttribute('aria-controls', 'mainNav');
            } else {
                menuToggle.removeAttribute('aria-haspopup');
                menuToggle.removeAttribute('aria-controls');
                // Remove estilos inline caso volte pro desktop
                mainNav.style.opacity = '';
                mainNav.style.visibility = '';
            }
        }, 100);
    };

    function improveAccessibility() {
        menuToggle.setAttribute('aria-haspopup', 'true');
        menuToggle.setAttribute('aria-controls', 'mainNav');
        menuToggle.setAttribute('aria-expanded', 'false');
        mainNav.setAttribute('role', 'navigation');
        mainNav.setAttribute('aria-label', 'Menu principal');
        
        navLinks.forEach((link, index) => {
            if (!link.getAttribute('aria-label')) {
                link.setAttribute('aria-label', `${link.textContent.trim()}. Item ${index + 1} de ${navLinks.length}`);
            }
        });
    }
    
    function init() {
        menuToggle.addEventListener('click', toggleMenu);
        document.addEventListener('click', handleClickOutside);
        document.addEventListener('keydown', handleEscapeKey);
        window.addEventListener('resize', handleResize);
        
        navLinks.forEach(link => link.addEventListener('click', handleLinkClick));
        
        improveAccessibility();
        
        window.MobileMenu = {
            open: openMenu,
            close: closeMenu,
            toggle: toggleMenu,
            isOpen: () => isMenuOpen
        };
    }
    
    function destroy() {
        menuToggle.removeEventListener('click', toggleMenu);
        document.removeEventListener('click', handleClickOutside);
        document.removeEventListener('keydown', handleEscapeKey);
        window.removeEventListener('resize', handleResize);
        
        navLinks.forEach(link => link.removeEventListener('click', handleLinkClick));
    }
    
    init();
    window.MobileMenuDestroy = destroy;
});