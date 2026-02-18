document.addEventListener('DOMContentLoaded', () => {
    // 1. Pegar o ID da URL (ex: video.html?id=3)
    const urlParams = new URLSearchParams(window.location.search);
    const videoId = urlParams.get('id');

    // Se não tiver ID, volta pra biblioteca
    if (!videoId) {
        window.location.href = 'biblioteca.html';
        return;
    }

    // 2. Buscar dados no Backend
    loadVideoDetails(videoId);
});

async function loadVideoDetails(id) {
    try {
        const response = await fetch(`https://mentorapp-api.onrender.com/api/videos/${id}`);

        if (!response.ok) {
            throw new Error('Vídeo não encontrado');
        }

        const video = await response.json();
        renderVideo(video);

    } catch (error) {
        console.error(error);
        // Opcional: só redirecionar se for erro fatal
        // window.location.href = 'biblioteca.html';
    }
}

function renderVideo(video) {
    // --- Atualizar Iframe (Player) ---
    const iframe = document.querySelector('.video-player-wrapper iframe');
    
    // AQUI ESTÁ A CORREÇÃO MÁGICA:
    const embedUrl = getYouTubeEmbedUrl(video.videoUrl);
    iframe.src = embedUrl;

    // --- Atualizar Título e Descrição ---
    document.querySelector('.video-info h1').textContent = video.title;
    document.querySelector('.description').textContent = video.description;

    // --- Atualizar Autor (se existir o elemento) ---
    const authorEl = document.querySelector('.author-badge');
    if (authorEl) authorEl.innerHTML = `<i class="ph ph-user"></i> ${video.author}`;

    // Atualiza o título da aba
    document.title = `${video.title} | MentorApp`;
}

// --- FUNÇÃO QUE CONSERTA O LINK ---
function getYouTubeEmbedUrl(url) {
    let videoId = null;

    // Regex que aceita: youtu.be, youtube.com/watch?v=, youtube.com/embed/, etc.
    const regExp = /^.*(youtu.be\/|v\/|u\/\w\/|embed\/|watch\?v=|&v=)([^#&?]*).*/;
    const match = url.match(regExp);

    if (match && match[2].length === 11) {
        videoId = match[2];
    }

    // Se achou o ID, retorna o link embed. Se não, retorna o original (ou uma tela de erro)
    if (videoId) {
        return `https://www.youtube.com/embed/${videoId}`;
    }
    
    return url; 
}