// URL da API (Backend)
const API_URL = 'https://mentorapp-api.onrender.com/api/videos';

const grid = document.getElementById('videoGrid');
const searchInput = document.getElementById('searchInput');
const filterBtns = document.querySelectorAll('.filter-btn');

let allVideos = [];

// --- 1. BUSCAR VÍDEOS ---
async function fetchVideos() {
    try {
        grid.innerHTML = '<p style="grid-column: 1/-1; text-align: center; color:var(--text-color);">Carregando aulas...</p>';

        const response = await fetch(API_URL);
        if (!response.ok) throw new Error('Erro ao buscar vídeos');

        allVideos = await response.json();
        renderVideos();

    } catch (error) {
        console.error('Erro:', error);
        grid.innerHTML = '<p style="grid-column: 1/-1; text-align: center; color: #ef4444;">Erro ao carregar vídeos.</p>';
    }
}

// --- 2. RENDERIZAR NA TELA ---
function renderVideos(filter = 'all', searchTerm = '') {
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
        const card = document.createElement('article');
        card.className = `video-card`; // Classe base do CSS
        
        // CORREÇÃO: Agora o HTML gerado bate com as classes do CSS (library.css)
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

        // Clique no Card
        card.addEventListener('click', () => {
            if (video.isPremium) {
                // Se for premium, verifica se usuário é Admin ou algo assim (ou manda logar)
                // Aqui simplifiquei: Premium = Login ou Aviso
                const user = JSON.parse(localStorage.getItem('user'));
                if (user && user.isAdmin) {
                     window.location.href = 'video.html?id=' + (video._id || video.id);
                } else {
                    alert('🔒 Conteúdo exclusivo para assinantes Premium!');
                    window.location.href = 'login.html';
                }
            } else {
                window.location.href = 'video.html?id=' + (video._id || video.id);
            }
        });

        grid.appendChild(card);
    });
}

// --- 3. EVENTOS ---
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

// Inicializa
document.addEventListener('DOMContentLoaded', fetchVideos);