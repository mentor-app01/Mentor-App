document.addEventListener('DOMContentLoaded', () => {
    checkHomeLogin();
});

function checkHomeLogin() {
    const token = localStorage.getItem('token');
    const userStr = localStorage.getItem('user');

    if (token && userStr) {
        try {
            const user = JSON.parse(userStr);
            
            // Encontra o botão de destaque no menu (Sou Premium)
            const navBtn = document.querySelector('.btn-nav-highlight');
            
            if (navBtn) {
                // 1. Atualiza o Botão Principal (Olá, Nome)
                navBtn.textContent = `Olá, ${user.name.split(' ')[0]}`;
                
                // Define o destino baseado no tipo de usuário
                if (user.isAdmin) {
                    navBtn.href = 'pages/dashboard.html'; // Professor
                } else {
                    navBtn.href = 'pages/biblioteca.html'; // Aluno
                }

                // 2. Cria o botão de Sair ao lado (Dinâmico)
                const li = navBtn.parentElement;

                // Evita duplicar o botão se a função rodar mais de uma vez
                if (document.getElementById('dynamicLogoutBtn')) return;
                
                const logoutLink = document.createElement('a');
                logoutLink.id = 'dynamicLogoutBtn'; // ID para controle
                logoutLink.href = "#";
                logoutLink.innerHTML = '<i class="ph ph-sign-out"></i>';
                
                // Estilos para ficar bonito ao lado do botão
                logoutLink.style.marginLeft = "15px";
                logoutLink.style.color = "var(--text-color)";
                logoutLink.style.fontSize = "1.4rem"; // Um pouco maior
                logoutLink.style.display = "flex";
                logoutLink.style.alignItems = "center";
                logoutLink.title = "Sair";
                
                // Lógica de Logout
                logoutLink.addEventListener('click', (e) => {
                    e.preventDefault();
                    // Limpa a sessão
                    localStorage.removeItem('token');
                    localStorage.removeItem('user');
                    // Recarrega a página inicial (voltando ao estado original)
                    window.location.reload();
                });

                li.appendChild(logoutLink);
                
                // Ajusta o container (li) para os itens ficarem lado a lado
                li.style.display = "flex";
                li.style.alignItems = "center";
            }
        } catch (e) {
            console.error("Erro ao processar usuário:", e);
            // Se os dados estiverem corrompidos, limpa tudo
            localStorage.removeItem('token');
            localStorage.removeItem('user');
        }
    }
}