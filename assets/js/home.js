document.addEventListener('DOMContentLoaded', () => {
    checkHomeLogin();
});

function checkHomeLogin() {
    const token = localStorage.getItem('token');
    const userStr = localStorage.getItem('user');

    if (token && userStr) {
        try {
            const user = JSON.parse(userStr);
            
            // Encontra o botão de destaque no menu
            const navBtn = document.querySelector('.btn-nav-highlight');
            
            if (navBtn) {
                // 1. Atualiza o Botão Principal
                navBtn.textContent = `Olá, ${user.name.split(' ')[0]}`;
                
                // CORREÇÃO: Define o destino baseado no 'role' (papel do usuário)
                if (user.role === 'teacher' || user.role === 'admin') {
                    navBtn.href = 'pages/dashboard.html'; 
                } else {
                    navBtn.href = 'pages/biblioteca.html'; 
                }

                // 2. Cria o botão de Sair ao lado (Dinâmico)
                const li = navBtn.parentElement;

                if (document.getElementById('dynamicLogoutBtn')) return;
                
                const logoutLink = document.createElement('a');
                logoutLink.id = 'dynamicLogoutBtn'; 
                logoutLink.href = "#";
                logoutLink.innerHTML = '<i class="ph ph-sign-out"></i>';
                
                // Estilos
                logoutLink.style.marginLeft = "15px";
                logoutLink.style.color = "var(--text-color)";
                logoutLink.style.fontSize = "1.4rem"; 
                logoutLink.style.display = "flex";
                logoutLink.style.alignItems = "center";
                logoutLink.title = "Sair";
                
                // Lógica de Logout
                logoutLink.addEventListener('click', (e) => {
                    e.preventDefault();
                    localStorage.removeItem('token');
                    localStorage.removeItem('user');
                    window.location.reload();
                });

                li.appendChild(logoutLink);
                
                // Ajusta o container
                li.style.display = "flex";
                li.style.alignItems = "center";
            }
        } catch (e) {
            console.error("Erro ao processar usuário:", e);
            localStorage.removeItem('token');
            localStorage.removeItem('user');
        }
    }
}