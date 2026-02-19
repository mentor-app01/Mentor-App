document.addEventListener('DOMContentLoaded', () => {
    
    // ============================================================
    // 1. LÓGICA DE MENU ATIVO (Visual - Deixa o link clicado sublinhado)
    // ============================================================
    const links = document.querySelectorAll('.nav-link');
    const currentUrl = window.location.href;

    links.forEach(link => {
        // Verifica se a URL do link bate com a URL do navegador
        if (link.href === currentUrl) {
            link.classList.add('active');
        } else {
            link.classList.remove('active');
        }
    });

    // ============================================================
    // 2. LÓGICA DE LOGOUT DOS DASHBOARDS (Painel interno)
    // ============================================================
    // Procura por qualquer botão/link que tenha o id="logoutBtn"
    const logoutBtn = document.getElementById('logoutBtn');

    if (logoutBtn) {
        logoutBtn.addEventListener('click', (e) => {
            e.preventDefault(); 
            localStorage.removeItem('token');
            localStorage.removeItem('user');

            // Redirecionamento Inteligente
            if (window.location.pathname.includes('/pages/')) {
                window.location.href = '../index.html';
            } else {
                window.location.reload();
            }
        });
    }

    // ============================================================
    // 3. MENU DINÂMICO GLOBAL (Troca "Sou Premium" por "Olá, Nome")
    // ============================================================
    const userStr = localStorage.getItem('user');
    
    // Busca o botão diretamente pelas classes CSS (Garante que acha em qualquer tela)
    const authBtn = document.querySelector('.nav-premium .btn-nav-highlight');

    if (userStr && authBtn) {
        const user = JSON.parse(userStr);
        
        // Pega apenas o primeiro nome (ex: Viviane)
        const firstName = user.name.split(' ')[0];

        // Descobre se estamos na página principal ou dentro da pasta /pages/
        const isRootPage = !window.location.pathname.includes('/pages/');
        const pathPrefix = isRootPage ? 'pages/' : '';

        // Define a rota correta baseada na role do usuário
        let targetUrl = 'dashboard.html'; // Padrão para admin e teacher
        
        if (user.role === 'student') {
            targetUrl = 'biblioteca.html'; // Alunos sempre vão para a biblioteca
        }

        // 🎯 MÁGICA 1: Altera apenas o texto e o link do botão dourado! (Preserva o CSS inteiro)
        authBtn.textContent = `Olá, ${firstName}`;
        authBtn.href = `${pathPrefix}${targetUrl}`;

        // 🎯 MÁGICA 2: Cria um pequeno botão "Sair" do lado, sem quebrar o layout
        const liParent = authBtn.closest('.nav-premium');
        
        // Verifica se o botão de sair global já não existe para não duplicar
        if (liParent && !document.getElementById('logoutBtnGlobal')) {
            // Ajusta o LI para os dois botões ficarem lado a lado alinhados
            liParent.style.display = 'flex';
            liParent.style.alignItems = 'center';
            liParent.style.gap = '15px';
            
            // Cria o botão de sair dinamicamente
            const sairLink = document.createElement('a');
            sairLink.href = '#';
            sairLink.id = 'logoutBtnGlobal';
            sairLink.className = 'nav-link';
            sairLink.style.padding = '0'; // Remove padding extra
            sairLink.style.fontSize = '0.85rem';
            sairLink.textContent = 'Sair';
            
            // Adiciona a função de clique no novo botão de Sair
            sairLink.addEventListener('click', (e) => {
                e.preventDefault();
                localStorage.removeItem('token');
                localStorage.removeItem('user');
                
                // Volta para a página inicial deslogado
                window.location.href = isRootPage ? 'index.html' : '../index.html';
            });

            // Adiciona o botão de sair na tela, logo depois do botão dourado
            liParent.appendChild(sairLink);
        }
    }
});