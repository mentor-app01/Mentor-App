document.addEventListener('DOMContentLoaded', () => {
    handleAdsSlider();
});

async function handleAdsSlider() {
    const token = localStorage.getItem('token');
    const userStr = localStorage.getItem('user');
    const adBox = document.getElementById('homeAdBox');
    
    // 1. SE ESTIVER LOGADO: Esconde a propaganda
    if (token && userStr) {
        if (adBox) adBox.style.display = 'none';
        return; 
    }

    // 2. SE NÃO ESTIVER LOGADO: Inicia o Slide
    try {
        const response = await fetch('https://mentor-app-rdwc.onrender.com/api/ads');
        if (!response.ok) return;
        
        const ads = await response.json();
        
        if (ads.length === 0) return;

        const adImg = document.getElementById('adImage');
        const adText = document.getElementById('defaultAdText');
        
        if (!adImg) return;

        // Esconde o texto padrão e mostra a tag de imagem
        adText.style.display = 'none';
        adImg.style.display = 'block';
        adImg.style.transition = 'opacity 0.5s ease-in-out';

        let currentIndex = 0;

        // Função para trocar a imagem com efeito
        const showAd = (index) => {
            adImg.style.opacity = '0';
            setTimeout(() => {
                adImg.src = ads[index].imageUrl;
                adImg.style.opacity = '1';
            }, 500);
        };

        // Mostra o primeiro anúncio imediatamente
        showAd(0);

        // Se houver mais de um, inicia o intervalo de 5 segundos
        if (ads.length > 1) {
            setInterval(() => {
                currentIndex = (currentIndex + 1) % ads.length;
                showAd(currentIndex);
            }, 5000);
        }

    } catch (error) {
        console.error("Erro ao carregar slide de anúncios:", error);
    }
}