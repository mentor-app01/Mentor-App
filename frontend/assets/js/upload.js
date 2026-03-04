// ==========================================
// 1. SEGURANÇA (O GUARDA-COSTAS)
// ==========================================
const token = localStorage.getItem('token');
const userStr = localStorage.getItem('user');
let user = null;

if (userStr) {
    user = JSON.parse(userStr);
}

// NOVA REGRA DE SEGURANÇA: Verifica se é professor ou admin
if (!token || !user || (user.role !== 'teacher' && user.role !== 'admin')) {
    alert('Acesso restrito a professores.');
    window.location.href = '../pages/login.html';
}

const API_URL = 'https://mentor-app-rdwc.onrender.com/api/videos';

document.addEventListener('DOMContentLoaded', () => {
    const form = document.getElementById('uploadForm');
    const videoUrlInput = document.getElementById('videoUrl');
    const thumbPreview = document.getElementById('thumbPreview');
    const dropZoneContent = document.querySelector('.drop-content');
    const submitBtn = form.querySelector('button[type="submit"]');
    const pageTitle = document.querySelector('.page-title');

    // Elementos da Categoria
    const categorySelect = document.getElementById('category');
    const newCategoryInput = document.getElementById('newCategoryInput'); 
    const pdfFileInput = document.getElementById('pdfFile'); // NOVO CAMPO PDF

    // --- 1. LÓGICA DE CATEGORIA (MOSTRAR/ESCONDER) ---
    if (categorySelect && newCategoryInput) {
        categorySelect.addEventListener('change', () => {
            if (categorySelect.value === 'new_category') {
                newCategoryInput.classList.remove('hidden');
                newCategoryInput.required = true; 
                newCategoryInput.focus();
            } else {
                newCategoryInput.classList.add('hidden');
                newCategoryInput.required = false;
                newCategoryInput.value = '';
            }
        });
    }

    // --- 2. VERIFICA SE ESTAMOS EM MODO EDIÇÃO ---
    const urlParams = new URLSearchParams(window.location.search);
    const videoId = urlParams.get('id');

    if (videoId) {
        setupEditMode();
        loadVideoData(videoId);
    }

    // --- 3. PREVIEW DA THUMBNAIL ---
    if (videoUrlInput) {
        videoUrlInput.addEventListener('input', (e) => {
            updateThumbnailPreview(e.target.value);
        });
    }

    // --- 4. ENVIAR FORMULÁRIO COM ARQUIVO ---
    if (form) {
        form.addEventListener('submit', async (e) => {
            e.preventDefault();

            const originalText = submitBtn.innerText;
            submitBtn.innerText = 'Salvando Aula e Arquivo...';
            submitBtn.disabled = true;

            // Pegar valores
            const title = document.getElementById('title').value;
            const description = document.getElementById('description').value;
            const visibility = document.getElementById('visibility').value;
            const videoUrl = videoUrlInput.value;

            // DECIDIR QUAL CATEGORIA USAR
            let finalCategory = categorySelect.value;
            if (finalCategory === 'new_category') {
                finalCategory = newCategoryInput.value.trim(); 
                if (!finalCategory) {
                    alert("Por favor, digite o nome da nova categoria.");
                    submitBtn.innerText = originalText;
                    submitBtn.disabled = false;
                    return;
                }
            }

            // Gerar Thumbnail
            const ytId = extractYouTubeID(videoUrl);
            const imageUrl = ytId 
                ? `https://img.youtube.com/vi/${ytId}/maxresdefault.jpg`
                : 'https://via.placeholder.com/1280x720?text=Sem+Capa';

            // MONTAR FORMDATA PARA ENVIAR ARQUIVO + TEXTO
            const formData = new FormData();
            formData.append('title', title);
            formData.append('tag', formatCategory(finalCategory));
            formData.append('isPremium', visibility === 'premium');
            formData.append('image', imageUrl);
            formData.append('videoUrl', videoUrl);
            formData.append('description', description);
            formData.append('author', user.name);

            if (pdfFileInput && pdfFileInput.files[0]) {
                formData.append('pdfFile', pdfFileInput.files[0]);
            }

            const method = videoId ? 'PUT' : 'POST';
            const url = videoId ? `${API_URL}/${videoId}` : API_URL;

            try {
                const response = await fetch(url, {
                    method: method,
                    headers: {
                        'Authorization': `Bearer ${token}`
                        // NOTA: 'Content-Type' não é definido ao enviar FormData, o navegador cuida disso.
                    },
                    body: formData
                });

                const responseText = await response.text();
                let data;
                try {
                    data = JSON.parse(responseText);
                } catch (err) {
                    console.error("Resposta do servidor não é JSON:", responseText);
                    throw new Error(`Erro no servidor (${response.status}). Verifique o console.`);
                }

                if (response.ok) {
                    alert(videoId ? 'Aula atualizada com sucesso! ✨' : 'Aula publicada com sucesso! 🚀');
                    window.location.href = 'dashboard.html';
                } else {
                    throw new Error(data.message || 'Erro ao salvar');
                }

            } catch (error) {
                console.error(error);
                alert(`Erro: ${error.message}`);
            } finally {
                submitBtn.innerText = originalText;
                submitBtn.disabled = false;
            }
        });
    }

    // --- FUNÇÕES AUXILIARES ---

    function setupEditMode() {
        if (pageTitle) pageTitle.innerText = "Editar Aula";
        if (submitBtn) submitBtn.innerText = "Salvar Alterações";
    }

    async function loadVideoData(id) {
        try {
            const res = await fetch(`${API_URL}/${id}`);
            if (!res.ok) throw new Error("Erro ao buscar aula");
            
            const video = await res.json();

            // Preenche campos básicos
            document.getElementById('title').value = video.title;
            document.getElementById('description').value = video.description || '';
            document.getElementById('videoUrl').value = video.videoUrl || video.link || '';
            document.getElementById('visibility').value = video.isPremium ? 'premium' : 'free';

            // Lógica inteligente para Categoria na Edição
            const videoTag = video.tag.toLowerCase();
            let foundInSelect = false;

            // Tenta achar a categoria no Select
            Array.from(categorySelect.options).forEach(opt => {
                if (opt.value.toLowerCase() === videoTag) {
                    categorySelect.value = opt.value;
                    foundInSelect = true;
                }
            });

            // Se a categoria da aula NÃO existe no select, ativa o modo manual
            if (!foundInSelect) {
                categorySelect.value = 'new_category';
                newCategoryInput.classList.remove('hidden');
                newCategoryInput.value = video.tag;
            }

            if (video.videoUrl || video.link) {
                updateThumbnailPreview(video.videoUrl || video.link);
            }

        } catch (error) {
            console.error(error);
            alert("Erro ao carregar dados.");
            window.location.href = 'dashboard.html';
        }
    }

    function updateThumbnailPreview(url) {
        const id = extractYouTubeID(url);
        if (id && thumbPreview) {
            thumbPreview.src = `https://img.youtube.com/vi/${id}/maxresdefault.jpg`;
            thumbPreview.classList.remove('hidden');
            if(dropZoneContent) dropZoneContent.style.display = 'none';
        }
    }
});

function extractYouTubeID(url) {
    if (!url) return null;
    const regExp = /^.*(youtu.be\/|v\/|u\/\w\/|embed\/|watch\?v=|&v=)([^#&?]*).*/;
    const match = url.match(regExp);
    return (match && match[2].length === 11) ? match[2] : null;
}

function formatCategory(cat) {
    if (!cat) return "Geral";
    return cat.charAt(0).toUpperCase() + cat.slice(1).toLowerCase();
}