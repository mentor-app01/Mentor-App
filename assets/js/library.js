// URL da API (Backend) - Atualizada para o Render
const API_URL = 'https://mentor-app-rdwc.onrender.com/api/videos';

const grid = document.getElementById('videoGrid');
const searchInput = document.getElementById('searchInput');
const filterBtns = document.querySelectorAll('.filter-btn');

let allVideos = [];

// --- 1. BUSCAR VÍDEOS ---
async function fetchVideos() {
    try {
        if(grid) grid.innerHTML = '<p style="grid-column: 1/-1; text-align: center; color:var(--text-color);">Carregando aulas...</p>';

        const response = await fetch(API_URL);
        if (!response.ok) throw new Error('Erro ao buscar vídeos');

        allVideos = await response.json();
        renderVideos();

    } catch (error) {
        console.error('Erro:', error);
        if(grid) grid.innerHTML = '<p style="grid-column: 1/-1; text-align: center; color: #ef4444;">Erro ao carregar vídeos.</p>';
    }
}

// --- 2. RENDERIZAR NA TELA ---
function renderVideos(filter = 'all', searchTerm = '') {
    if(!grid) return;
    grid.innerHTML = '';

    const filtered = allVideos.filter(video => {
        const matchesFilter = filter === 'all' 
            ? true 
            : filter === 'premium' ? video.isPremium : !video.isPremium;
        
        const matchesSearch = video.title.toLowerCase().includes(searchTerm.toLowerCase()) || 
                              (video.author && video.author.toLowerCase().includes(searchTerm.toLowerCase()));

        return matchesFilter && matchesSearch;
    });

    if (filtered.length === 0) {
        grid.innerHTML = '<p style="grid-column: 1/-1; text-align: center; color:var(--text-color)">Nenhuma aula encontrada.</p>';
        return;
    }

    filtered.forEach(video => {
        const videoId = video._id || video.id;
        const card = document.createElement('article');
        card.className = `video-card`; 
        
        card.innerHTML = `
            <div class="video-thumbnail">
                ${video.isPremium ? '<span class="badge premium"><i class="ph ph-crown"></i> PRO</span>' : ''}
                <img src="${video.image}" alt="${video.title}">
                <div class="play-icon"><i class="ph ph-play-circle"></i></div>
            </div>
            
            <div class="video-content">
                <div class="video-meta">
                    <span class="category">${video.tag || 'Geral'}</span>
                </div>
                
                <h3 class="video-title">${video.title}</h3>
                
                <div class="video-author">
                    <i class="ph ph-user"></i> ${video.author || 'MentorApp'}
                </div>
            </div>
        `;

        // CORREÇÃO: Lógica de Acesso Premium Atualizada
        card.addEventListener('click', () => {
            if (video.isPremium) {
                const userStr = localStorage.getItem('user');
                
                if (userStr) {
                    const user = JSON.parse(userStr);
                    // Agora checa se é Professor OU se é Aluno com plano Premium
                    if (user.role === 'teacher' || user.role === 'admin' || user.plan === 'premium') {
                         window.location.href = `video.html?id=${videoId}`;
                    } else {
                        alert('🔒 Conteúdo exclusivo para assinantes Premium! Faça o upgrade para assistir.');
                    }
                } else {
                    alert('🔒 Faça login para assistir conteúdos Premium!');
                    window.location.href = 'login.html';
                }
            } else {
                // Vídeos gratuitos passam direto
                window.location.href = `video.html?id=${videoId}`;
            }
        });

        grid.appendChild(card);
    });
}

// --- 3. EVENTOS ---
if(filterBtns && searchInput) {
    filterBtns.forEach(btn => {
        btn.addEventListener('click', () => {
            filterBtns.forEach(b => b.classList.remove('active'));
            btn.classList.add('active');
            renderVideos(btn.dataset.filter, searchInput.value);
        });
    });

    searchInput.addEventListener('input', (e) => {
        const activeFilter = document.querySelector('.filter-btn.active').dataset.filter;
        renderVideos(activeFilter, e.target.value);
    });
}

// Inicializa
document.addEventListener('DOMContentLoaded', fetchVideos);