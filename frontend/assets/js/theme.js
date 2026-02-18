document.addEventListener('DOMContentLoaded', () => {
    // 1. Pega o elemento do Checkbox e o HTML
    // Note que o ID agora é 'theme-toggle-input' conforme o HTML novo
    const themeCheckbox = document.getElementById('theme-toggle-input');
    const html = document.documentElement;

    // 2. Lógica para aplicar o tema e sincronizar o checkbox
    function applyTheme(isDark) {
        if (isDark) {
            html.setAttribute('data-theme', 'dark');
            localStorage.setItem('theme', 'dark');
            if (themeCheckbox) themeCheckbox.checked = true; // Marca a caixinha
        } else {
            html.removeAttribute('data-theme'); // Remove para voltar ao padrão (light)
            localStorage.setItem('theme', 'light');
            if (themeCheckbox) themeCheckbox.checked = false; // Desmarca a caixinha
        }
    }

    // 3. Verificação Inicial (Ao carregar a página)
    const savedTheme = localStorage.getItem('theme');
    const systemPrefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;

    // Se tiver salvo 'dark' OU (se não tiver nada salvo E o sistema for dark)
    if (savedTheme === 'dark' || (!savedTheme && systemPrefersDark)) {
        applyTheme(true);
    } else {
        applyTheme(false);
    }

    // 4. Ouvinte de Evento (Quando o usuário clica no switch)
    if (themeCheckbox) {
        themeCheckbox.addEventListener('change', (e) => {
            // Se estiver marcado (checked) = Modo Escuro
            applyTheme(e.target.checked);
        });
    }
});