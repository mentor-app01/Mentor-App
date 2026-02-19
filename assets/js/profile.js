// ==========================================
// 1. SEGURANÇA (O GUARDA-COSTAS)
// ==========================================
const token = localStorage.getItem('token');
const userStr = localStorage.getItem('user');

if (!token || !userStr) {
    window.location.href = '../pages/login.html';
}

const user = JSON.parse(userStr);

document.addEventListener('DOMContentLoaded', () => {
    // --- 2. Preencher Dados Iniciais ---
    const nameInput = document.getElementById('name'); // Ajuste o ID se necessário
    const emailInput = document.getElementById('email'); // Ajuste o ID se necessário
    
    if (nameInput) nameInput.value = user.name || '';
    if (emailInput) {
        emailInput.value = user.email || '';
        emailInput.disabled = true; // Geralmente não se deixa trocar o email direto
    }

    // --- 3. Troca de Avatar (Preview Visual) ---
    const avatarInput = document.getElementById('avatarInput');
    const avatarPreview = document.getElementById('avatarPreview');

    if (avatarInput && avatarPreview) {
        avatarInput.addEventListener('change', (e) => {
            const file = e.target.files[0];
            if (file) {
                const reader = new FileReader();
                reader.onload = (e) => {
                    avatarPreview.src = e.target.result;
                };
                reader.readAsDataURL(file);
            }
        });
    }

    // --- 4. Salvar Dados ---
    const form = document.getElementById('profileForm');
    
    if (form) {
        form.addEventListener('submit', (e) => {
            e.preventDefault();
            const btn = form.querySelector('button[type="submit"]');
            const originalText = btn.textContent;
            
            btn.textContent = 'Salvando...';
            btn.disabled = true;

            // Atualiza o nome no LocalStorage para refletir no menu da aplicação
            const newName = nameInput ? nameInput.value : user.name;

            /* 🚨 IMPORTANTE: Se você criar uma rota no backend futuramente 
              (ex: PUT /api/users/profile), o fetch() entra aqui!
            */
            setTimeout(() => {
                user.name = newName;
                localStorage.setItem('user', JSON.stringify(user));
                
                alert('Perfil atualizado com sucesso!');
                btn.textContent = originalText;
                btn.disabled = false;
                
                // Recarrega para atualizar o "Olá, Nome" no menu
                window.location.reload(); 
            }, 800);
        });
    }
});