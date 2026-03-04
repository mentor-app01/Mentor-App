document.addEventListener('DOMContentLoaded', () => {
    const urlParams = new URLSearchParams(window.location.search);
    const videoId = urlParams.get('id');

    if (!videoId) {
        window.location.href = 'biblioteca.html';
        return;
    }

    loadVideoDetails(videoId);
    registrarVisualizacao(videoId); 
});

async function loadVideoDetails(id) {
    try {
        const response = await fetch(`https://mentor-app-rdwc.onrender.com/api/videos/${id}`);
        if (!response.ok) throw new Error('Vídeo não encontrado');
        
        const video = await response.json();

        // 🔒 NOVA SEGURANÇA: Bloqueia quem tentar acessar pelo link direto
        if (video.isPremium) {
            const userStr = localStorage.getItem('user');
            if (!userStr) {
                alert('Faça login para assistir a esta aula.');
                window.location.href = 'login.html';
                return;
            }
            
            const user = JSON.parse(userStr);
            if (user.role !== 'teacher' && user.role !== 'admin' && user.plan !== 'premium') {
                alert('🔒 Esta aula é exclusiva para assinantes Premium!');
                window.location.href = 'biblioteca.html';
                return;
            }
        }

        renderVideo(video);
    } catch (error) {
        console.error(error);
    }
}

// --- FUNÇÃO DE CONTAR VIEWS ---
async function registrarVisualizacao(id) {
    try {
        const response = await fetch(`https://mentor-app-rdwc.onrender.com/api/videos/${id}/view`, {
            method: 'PUT'
        });
        if (response.ok) console.log("👁️ Visualização contabilizada!");
    } catch (error) {
        console.error("Erro ao registrar visualização:", error);
    }
}

function renderVideo(video) {
    const iframe = document.querySelector('.video-player-wrapper iframe');
    const embedUrl = getYouTubeEmbedUrl(video.videoUrl);
    if(iframe) iframe.src = embedUrl;

    const titleEl = document.querySelector('.video-info h1');
    const descEl = document.querySelector('.description');
    
    if(titleEl) titleEl.textContent = video.title;
    if(descEl) descEl.textContent = video.description;

    const authorEl = document.querySelector('.author-badge');
    if (authorEl) authorEl.innerHTML = `<i class="ph ph-user"></i> ${video.author}`;

    // --- NOVO: Renderizar botão do PDF se existir ---
    const materialContainer = document.getElementById('materialContainer');
    if (materialContainer) {
        if (video.pdfUrl && video.pdfUrl !== "") {
            materialContainer.innerHTML = `
                <a href="${video.pdfUrl}" target="_blank" class="btn btn-primary" style="display: inline-flex; align-items: center; gap: 8px; text-decoration: none; max-width: max-content;">
                    <i class="ph ph-file-pdf" style="font-size: 1.2rem;"></i> Baixar Material de Apoio
                </a>
            `;
        } else {
            materialContainer.innerHTML = ''; 
        }
    }

    document.title = `${video.title} | MentorApp`;
}

function getYouTubeEmbedUrl(url) {
    if (!url) return '';
    let videoId = null;
    const regExp = /^.*(youtu.be\/|v\/|u\/\w\/|embed\/|watch\?v=|&v=)([^#&?]*).*/;
    const match = url.match(regExp);
    if (match && match[2].length === 11) videoId = match[2];
    
    return videoId ? `https://www.youtube.com/embed/${videoId}` : url; 
}