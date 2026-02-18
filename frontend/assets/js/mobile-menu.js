/**
 * mobile-menu.js
 * Controle do menu responsivo para dispositivos móveis
 * @version 1.0.0
 */

document.addEventListener('DOMContentLoaded', function() {
    // Elementos do DOM
    const menuToggle = document.getElementById('menuToggle');
    const mainNav = document.getElementById('mainNav');
    const navLinks = mainNav ? mainNav.querySelectorAll('.nav-link') : [];
    const body = document.body;
    const header = document.querySelector('.main-header');
    
    // Estado do menu
    let isMenuOpen = false;
    
    // Verificar se os elementos existem
    if (!menuToggle || !mainNav) {
        console.warn('Elementos do menu não encontrados. Verifique os IDs no HTML.');
        return;
    }
    
    /**
     * Abrir o menu mobile
     */
    function openMenu() {
        menuToggle.classList.add('active');
        mainNav.classList.add('active');
        menuToggle.setAttribute('aria-label', 'Fechar menu');
        menuToggle.setAttribute('aria-expanded', 'true');
        body.style.overflow = 'hidden'; // Bloquear scroll do body
        isMenuOpen = true;
        
        // Adicionar classe ao header para melhor estilização
        if (header) {
            header.classList.add('menu-open');
        }
        
        // Disparar evento customizado
        window.dispatchEvent(new CustomEvent('menuStateChange', { 
            detail: { isOpen: true } 
        }));
        
        console.log('Menu aberto');
    }
    
    /**
     * Fechar o menu mobile
     */
    function closeMenu() {
        menuToggle.classList.remove('active');
        mainNav.classList.remove('active');
        menuToggle.setAttribute('aria-label', 'Abrir menu');
        menuToggle.setAttribute('aria-expanded', 'false');
        body.style.overflow = ''; // Restaurar scroll do body
        isMenuOpen = false;
        
        // Remover classe do header
        if (header) {
            header.classList.remove('menu-open');
        }
        
        // Disparar evento customizado
        window.dispatchEvent(new CustomEvent('menuStateChange', { 
            detail: { isOpen: false } 
        }));
        
        console.log('Menu fechado');
    }
    
    /**
     * Alternar estado do menu (abrir/fechar)
     */
    function toggleMenu() {
        if (isMenuOpen) {
            closeMenu();
        } else {
            openMenu();
        }
    }
    
    /**
     * Verificar se a tela é mobile
     * @returns {boolean}
     */
    function isMobileScreen() {
        return window.innerWidth <= 768;
    }
    
    /**
     * Fechar menu ao clicar em um link
     */
    function setupNavLinks() {
        navLinks.forEach(link => {
            link.addEventListener('click', function(e) {
                // Se for um link âncora, deixar rolar suavemente
                if (this.getAttribute('href').startsWith('#')) {
                    e.preventDefault();
                    const targetId = this.getAttribute('href');
                    const targetElement = document.querySelector(targetId);
                    
                    if (targetElement) {
                        // Fechar menu primeiro
                        closeMenu();
                        
                        // Scroll suave após a transição do menu
                        setTimeout(() => {
                            targetElement.scrollIntoView({
                                behavior: 'smooth',
                                block: 'start'
                            });
                        }, 300);
                    }
                } else if (isMobileScreen()) {
                    // Para outros links, fechar menu no mobile
                    setTimeout(closeMenu, 300);
                }
            });
        });
    }
    
    /**
     * Fechar menu ao clicar fora
     */
    function setupClickOutside() {
        document.addEventListener('click', function(e) {
            if (!isMenuOpen || !isMobileScreen()) return;
            
            const isClickInsideMenu = mainNav.contains(e.target);
            const isClickOnToggle = menuToggle.contains(e.target);
            
            if (!isClickInsideMenu && !isClickOnToggle) {
                closeMenu();
            }
        });
    }
    
    /**
     * Fechar menu ao pressionar ESC
     */
    function setupEscapeKey() {
        document.addEventListener('keydown', function(e) {
            if (e.key === 'Escape' && isMenuOpen) {
                closeMenu();
            }
        });
    }
    
    /**
     * Fechar menu ao redimensionar para desktop
     */
    function setupResizeListener() {
        let resizeTimeout;
        
        window.addEventListener('resize', function() {
            clearTimeout(resizeTimeout);
            
            resizeTimeout = setTimeout(function() {
                if (!isMobileScreen() && isMenuOpen) {
                    closeMenu();
                }
                
                // Atualizar atributo ARIA baseado no tamanho da tela
                if (isMobileScreen()) {
                    menuToggle.setAttribute('aria-haspopup', 'true');
                    menuToggle.setAttribute('aria-controls', 'mainNav');
                } else {
                    menuToggle.removeAttribute('aria-haspopup');
                    menuToggle.removeAttribute('aria-controls');
                }
            }, 100);
        });
    }
    
    /**
     * Melhorar acessibilidade para leitores de tela
     */
    function improveAccessibility() {
        // Adicionar atributos ARIA
        menuToggle.setAttribute('aria-haspopup', 'true');
        menuToggle.setAttribute('aria-controls', 'mainNav');
        menuToggle.setAttribute('aria-expanded', 'false');
        
        // Adicionar role ao menu
        mainNav.setAttribute('role', 'navigation');
        mainNav.setAttribute('aria-label', 'Menu principal');
        
        // Adicionar labels aos links se necessário
        navLinks.forEach((link, index) => {
            if (!link.getAttribute('aria-label')) {
                const text = link.textContent.trim();
                link.setAttribute('aria-label', `${text}. Item ${index + 1} de ${navLinks.length}`);
            }
        });
    }
    
    /**
     * Adicionar animação suave ao fechar menu
     */
    function setupMenuAnimations() {
        // Adicionar transição CSS via JS para melhor controle
        mainNav.style.transition = 'max-height 0.3s ease, opacity 0.3s ease';
        
        // Observar mudanças no menu para animações
        const observer = new MutationObserver(function(mutations) {
            mutations.forEach(function(mutation) {
                if (mutation.attributeName === 'class') {
                    if (mainNav.classList.contains('active')) {
                        mainNav.style.opacity = '1';
                        mainNav.style.visibility = 'visible';
                    } else {
                        mainNav.style.opacity = '0';
                        setTimeout(() => {
                            if (!mainNav.classList.contains('active')) {
                                mainNav.style.visibility = 'hidden';
                            }
                        }, 300);
                    }
                }
            });
        });
        
        observer.observe(mainNav, { attributes: true });
    }
    
    /**
     * Prevenir scroll quando menu está aberto
     */
    function preventScrollWhenOpen() {
        // Usar passive: false para poder prevenir o comportamento padrão
        mainNav.addEventListener('touchmove', function(e) {
            if (isMenuOpen) {
                e.preventDefault();
            }
        }, { passive: false });
        
        mainNav.addEventListener('wheel', function(e) {
            if (isMenuOpen && isMobileScreen()) {
                e.preventDefault();
            }
        }, { passive: false });
    }
    
    /**
     * Inicializar todas as funcionalidades
     */
    function init() {
        console.log('Inicializando menu mobile...');
        
        // Configurar atributos iniciais
        if (isMobileScreen()) {
            mainNav.style.visibility = 'hidden';
            mainNav.style.opacity = '0';
        }
        
        // Configurar eventos
        menuToggle.addEventListener('click', toggleMenu);
        setupNavLinks();
        setupClickOutside();
        setupEscapeKey();
        setupResizeListener();
        setupMenuAnimations();
        preventScrollWhenOpen();
        improveAccessibility();
        
        // Expor funções para uso externo se necessário
        window.MobileMenu = {
            open: openMenu,
            close: closeMenu,
            toggle: toggleMenu,
            isOpen: () => isMenuOpen
        };
        
        console.log('Menu mobile inicializado com sucesso!');
    }
    
    /**
     * Destruir eventos (para SPA ou quando necessário)
     */
    function destroy() {
        menuToggle.removeEventListener('click', toggleMenu);
        window.removeEventListener('resize', setupResizeListener);
        document.removeEventListener('keydown', setupEscapeKey);
        document.removeEventListener('click', setupClickOutside);
        
        navLinks.forEach(link => {
            link.removeEventListener('click', setupNavLinks);
        });
        
        console.log('Eventos do menu mobile removidos');
    }
    
    // Inicializar
    init();
    
    // Expor função de destruição para uso externo
    window.MobileMenuDestroy = destroy;
    
    // Debug: Log do estado inicial
    console.log('Estado inicial do menu:', {
        isMobile: isMobileScreen(),
        menuToggleExists: !!menuToggle,
        mainNavExists: !!mainNav,
        navLinksCount: navLinks.length
    });
});

/**
 * Fallback para caso o DOMContentLoaded já tenha acontecido
 * (útil quando este script é carregado dinamicamente)
 */
if (document.readyState === 'complete' || document.readyState === 'interactive') {
    setTimeout(() => {
        if (typeof MobileMenu === 'undefined') {
            console.log('Executando fallback do menu mobile...');
            document.dispatchEvent(new Event('DOMContentLoaded'));
        }
    }, 100);
}

/**
 * Suporte para módulos ES6 (opcional)
 */
if (typeof module !== 'undefined' && module.exports) {
    module.exports = { 
        init: function() {
            document.dispatchEvent(new Event('DOMContentLoaded'));
        }
    };
}