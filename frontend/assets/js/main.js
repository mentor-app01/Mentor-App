/* =========================================
   MAIN.JS - Lógica da Biblioteca
   ========================================= */

document.addEventListener('DOMContentLoaded', () => {
    fetchVideos(); // Busca os vídeos no Banco de Dados
    handleLibraryAdsDisplay(); // Verifica e exibe/oculta o anúncio
});

const API_URL = 'https://mentor-app-rdwc.onrender.com/api/videos';
let allVideos = []; // Guarda os vídeos na memória para filtrar na busca

// 1. BUSCAR VÍDEOS
async function fetchVideos() {
    try {
        const response = await fetch(API_URL);
        
        if (!response.ok) {
            throw new Error('Falha na conexão com a API');
        }

        const videos = await response.json();
        
        allVideos = videos; // Salva para a busca
        renderVideos(videos); // Mostra na tela

    } catch (error) {
        console.error('Erro ao buscar vídeos:', error);
        const grid = document.getElementById('videoGrid');
        if (grid) {
            grid.innerHTML = `
                <div style="grid-column: 1/-1; text-align: center; padding: 40px;">
                    <p style="color: var(--text-color); margin-bottom: 10px;">Não foi possível carregar as aulas.</p>
                    <small style="color: #ef4444;">Verifique se o backend está rodando.</small>
                </div>
            `;
        }
    }
}

// 2. RENDERIZAR VÍDEOS NA TELA
function renderVideos(videos) {
    const grid = document.getElementById('videoGrid');
    if (!grid) return; 

    grid.innerHTML = ''; 

    if (videos.length === 0) {
        grid.innerHTML = '<p style="grid-column: 1/-1; text-align: center; color: var(--text-color);">Nenhuma aula encontrada.</p>';
        return;
    }

    videos.forEach(video => {
        const videoId = video._id || video.id;

        const card = document.createElement('article');
        card.className = 'video-card';
        
        const isPremium = video.isPremium ? '<span class="badge premium">Premium</span>' : '';

        card.innerHTML = `
            <a href="video.html?id=${videoId}" class="video-thumbnail">
                <img src="${video.image}" alt="${video.title}" onerror="this.src='https://via.placeholder.com/300x170?text=Sem+Imagem'">
                ${isPremium}
                <div class="play-icon"><i class="ph ph-play-circle"></i></div>
            </a>
            <div class="video-content">
                <div class="video-meta">
                    <span class="category">${video.tag || 'Geral'}</span>
                    <span class="views">${video.views || 0} views</span>
                </div>
                <h3 class="video-title">
                    <a href="video.html?id=${videoId}">${video.title}</a>
                </h3>
                <p class="video-author">Por ${video.author || 'MentorApp'}</p>
            </div>
        `;
        
        // INTERCEPTADOR DE CLIQUE PREMIUM (O NOVO SISTEMA DE BLOQUEIO)
        const thumbLink = card.querySelector('.video-thumbnail');
        const titleLink = card.querySelector('.video-title a');
        
        const clickHandler = (e) => {
            if (video.isPremium) {
                e.preventDefault(); // Impede de abrir o link direto
                const userStr = localStorage.getItem('user');
                
                if (userStr) {
                    const user = JSON.parse(userStr);
                    // O novo backend usa plan e role
                    if (user.plan === 'premium' || user.role === 'teacher' || user.role === 'admin') {
                         window.location.href = `video.html?id=${videoId}`;
                    } else {
                        alert('🔒 Conteúdo exclusivo para assinantes Premium! Faça o upgrade para assistir.');
                    }
                } else {
                    alert('🔒 Faça login para assistir conteúdos Premium!');
                    window.location.href = 'login.html';
                }
            }
        };

        thumbLink.addEventListener('click', clickHandler);
        titleLink.addEventListener('click', clickHandler);

        grid.appendChild(card);
    });
}

// 3. BARRA DE PESQUISA EM TEMPO REAL
const searchInput = document.getElementById('searchInput');

if (searchInput) {
    searchInput.addEventListener('input', (e) => {
        const term = e.target.value.toLowerCase();
        
        const filtered = allVideos.filter(video => 
            video.title.toLowerCase().includes(term) || 
            (video.tag && video.tag.toLowerCase().includes(term))
        );
        
        renderVideos(filtered);
    });
}

// 4. FILTROS (Botões Todos / Gratuitos / Premium)
const filterBtns = document.querySelectorAll('.filter-btn');

filterBtns.forEach(btn => {
    btn.addEventListener('click', () => {
        filterBtns.forEach(b => b.classList.remove('active'));
        btn.classList.add('active');

        const filterType = btn.dataset.filter;

        if (filterType === 'all') {
            renderVideos(allVideos);
        } else if (filterType === 'free') {
            const freeVideos = allVideos.filter(v => !v.isPremium);
            renderVideos(freeVideos);
        } else if (filterType === 'premium') {
            const premiumVideos = allVideos.filter(v => v.isPremium);
            renderVideos(premiumVideos);
        }
    });
});

// 5. LÓGICA DE EXIBIÇÃO DO ANÚNCIO (Banner)
async function handleLibraryAdsDisplay() {
    const token = localStorage.getItem('token');
    const userStr = localStorage.getItem('user');
    const adBox = document.getElementById('libraryAdBox');
    
    // 1. SE ESTIVER LOGADO: Esconde a propaganda e encerra
    if (token && userStr) {
        if (adBox) adBox.style.display = 'none';
        return; 
    }

    // 2. SE NÃO ESTIVER LOGADO: Busca a imagem
    try {
        const response = await fetch('https://mentor-app-rdwc.onrender.com/api/admin/ad');
        if (!response.ok) return;
        
        const adData = await response.json();
        
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