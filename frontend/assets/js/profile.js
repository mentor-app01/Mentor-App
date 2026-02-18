document.addEventListener('DOMContentLoaded', () => {
    // --- Troca de Avatar ---
    const avatarInput = document.getElementById('avatarInput');
    const avatarPreview = document.getElementById('avatarPreview');

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

    // --- Salvar Dados ---
    const form = document.getElementById('profileForm');
    form.addEventListener('submit', (e) => {
        e.preventDefault();
        const btn = form.querySelector('button[type="submit"]');
        const originalText = btn.textContent;
        
        btn.textContent = 'Salvando...';
        btn.disabled = true;

        setTimeout(() => {
            alert('Perfil atualizado com sucesso!');
            btn.textContent = originalText;
            btn.disabled = false;
        }, 1000);
    });
});