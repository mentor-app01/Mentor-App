/* =========================================
   MAIN.JS - Lógica da Biblioteca e Slider
   ========================================= */

document.addEventListener('DOMContentLoaded', () => {
    fetchVideos(); 
    handleLibraryAdsSlider(); 
});

const API_URL = 'https://mentor-app-rdwc.onrender.com/api/videos';
let allVideos = [];

// 1. BUSCAR VÍDEOS
async function fetchVideos() {
    try {
        const response = await fetch(API_URL);
        if (!response.ok) throw new Error('Falha na conexão');
        const videos = await response.json();
        allVideos = videos;
        renderVideos(videos);
    } catch (error) {
        console.error('Erro ao buscar vídeos:', error);
    }
}

// 2. RENDERIZAR VÍDEOS
function renderVideos(videos) {
    const grid = document.getElementById('videoGrid');
    if (!grid) return; 
    grid.innerHTML = ''; 

    if (videos.length === 0) {
        grid.innerHTML = '<p style="grid-column: 1/-1; text-align: center;">Nenhuma aula encontrada.</p>';
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
                <h3 class="video-title"><a href="video.html?id=${videoId}">${video.title}</a></h3>
                <p class="video-author">Por ${video.author || 'MentorApp'}</p>
            </div>
        `;

        const clickHandler = (e) => {
            if (video.isPremium) {
                e.preventDefault();
                const userStr = localStorage.getItem('user');
                if (userStr) {
                    const user = JSON.parse(userStr);
                    if (user.plan === 'premium' || user.role === 'teacher' || user.role === 'admin') {
                         window.location.href = `video.html?id=${videoId}`;
                    } else {
                        alert('🔒 Conteúdo exclusivo para assinantes Premium!');
                    }
                } else {
                    alert('🔒 Faça login para assistir conteúdos Premium!');
                    window.location.href = 'login.html';
                }
            }
        };

        card.querySelector('.video-thumbnail').addEventListener('click', clickHandler);
        card.querySelector('.video-title a').addEventListener('click', clickHandler);
        grid.appendChild(card);
    });
}

// 3. PESQUISA E FILTROS (Resumido)
const searchInput = document.getElementById('searchInput');
if (searchInput) {
    searchInput.addEventListener('input', (e) => {
        const term = e.target.value.toLowerCase();
        const filtered = allVideos.filter(v => v.title.toLowerCase().includes(term));
        renderVideos(filtered);
    });
}

// 4. LÓGICA DO SLIDER DE ANÚNCIOS
async function handleLibraryAdsSlider() {
    const token = localStorage.getItem('token');
    const adBox = document.getElementById('libraryAdBox');
    
    if (token) {
        if (adBox) adBox.style.display = 'none';
        return; 
    }

    try {
        const res = await fetch('https://mentor-app-rdwc.onrender.com/api/ads');
        const ads = await res.json();
        if (ads.length === 0) return;

        const adImg = document.getElementById('adImage');
        const adText = document.getElementById('defaultAdText');

        adText.style.display = 'none';
        adImg.style.display = 'block';
        adImg.style.transition = 'opacity 0.5s ease-in-out';

        let currentIndex = 0;
        const showAd = (index) => {
            adImg.style.opacity = '0';
            setTimeout(() => {
                adImg.src = ads[index].imageUrl;
                adImg.style.opacity = '1';
            }, 500);
        };

        showAd(0);
        if (ads.length > 1) {
            setInterval(() => {
                currentIndex = (currentIndex + 1) % ads.length;
                showAd(currentIndex);
            }, 5000);
        }
    } catch (err) {
        console.error(err);
    }
}