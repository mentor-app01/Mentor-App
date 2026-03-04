document.addEventListener('DOMContentLoaded', () => {
    handleAdsDisplay();
});

async function handleAdsDisplay() {
    const token = localStorage.getItem('token');
    const userStr = localStorage.getItem('user');
    const adBox = document.getElementById('homeAdBox');
    
    // 1. SE ESTIVER LOGADO: Esconde a propaganda e encerra a função
    if (token && userStr) {
        if (adBox) adBox.style.display = 'none';
        return; 
    }

    // 2. SE NÃO ESTIVER LOGADO: Busca a imagem do anúncio no Banco de Dados
    try {
        const response = await fetch('https://mentor-app-rdwc.onrender.com/api/admin/ad');
        if (!response.ok) return;
        
        const adData = await response.json();
        
        // Se existir uma imagem salva no banco, esconde o texto padrão e mostra a imagem
        if (adData && adData.imageBase64) {
            document.getElementById('defaultAdText').style.display = 'none';
            const adImg = document.getElementById('adImage');
            adImg.src = adData.imageBase64;
            adImg.style.display = 'block';
        }
    } catch (error) {
        console.error("Erro ao carregar anúncio:", error);
    }
}