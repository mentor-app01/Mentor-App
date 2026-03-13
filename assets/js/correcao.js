// Verifica se está logado
const token = localStorage.getItem('token');
if (!token) {
    alert("Você precisa estar logado para usar o Corretor IA.");
    window.location.href = 'login.html';
}

const docInput = document.getElementById('docInput');
const fileName = document.getElementById('fileName');
const aiForm = document.getElementById('aiForm');
const btnSubmit = document.getElementById('btnSubmit');
const resultBox = document.getElementById('resultBox');
const feedbackText = document.getElementById('feedbackText');

// Mostra o nome do arquivo selecionado
docInput.addEventListener('change', (e) => {
    if (e.target.files[0]) {
        fileName.textContent = e.target.files[0].name;
        fileName.style.color = "var(--accent-color)";
    } else {
        fileName.textContent = 'Nenhum arquivo selecionado.';
        fileName.style.color = "var(--text-color)";
    }
});

// Envia para a IA
aiForm.addEventListener('submit', async (e) => {
    e.preventDefault();
    const file = docInput.files[0];
    if (!file) return alert("Por favor, selecione um arquivo!");

    // Estado de carregamento
    btnSubmit.innerHTML = '<i class="ph ph-spinner ph-spin"></i> Analisando redação (isso leva alguns segundos)...';
    btnSubmit.disabled = true;
    resultBox.style.display = 'none';

    const formData = new FormData();
    formData.append('documento', file);

    try {
        const res = await fetch('https://mentor-app-rdwc.onrender.com/api/ia/corrigir', {
            method: 'POST',
            headers: { 'Authorization': `Bearer ${token}` },
            body: formData
        });

        const data = await res.json();

        if (res.ok) {
            // Limpa formatação de negrito Markdown do Gemini para HTML
            let formattedText = data.feedback.replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>');
            
            feedbackText.innerHTML = formattedText;
            resultBox.style.display = 'block';
            
            // Rola a página suavemente para o resultado
            resultBox.scrollIntoView({ behavior: 'smooth' });
        } else {
            alert("Erro: " + data.message);
        }
    } catch (error) {
        console.error(error);
        alert("Falha ao conectar com o Corretor IA.");
    } finally {
        btnSubmit.innerText = "Analisar Redação";
        btnSubmit.disabled = false;
    }
});