// ==========================================
// 1. SEGURANÇA (O GUARDA-COSTAS)
// ==========================================
const token = localStorage.getItem('token');
const userStr = localStorage.getItem('user');

// Se não tiver token ou usuário salvo, chuta pro login
if (!token || !userStr) {
    window.location.href = '../pages/login.html';
}

const user = JSON.parse(userStr);

// NOVA REGRA: Se o usuário não for professor nem admin, chuta pra biblioteca
if (user.role !== 'teacher' && user.role !== 'admin') {
    alert('Acesso restrito a professores.');
    window.location.href = '../biblioteca.html';
}

const API_URL = 'https://mentor-app-rdwc.onrender.com/api/videos';
const STATS_URL = 'https://mentor-app-rdwc.onrender.com/api/stats'; 

// ==========================================
// 2. INICIALIZAÇÃO E EVENTOS
// ==========================================
document.addEventListener('DOMContentLoaded', () => {
    
    // A. Personaliza a Saudação 
    const greetingElement = document.getElementById('professorName');
    if (greetingElement) {
        const firstName = user.name.split(' ')[0];
        greetingElement.innerText = `Olá, Professor(a) ${firstName}! 👋`;
    }

    // B. Configura o Botão de Logout
    const logoutBtn = document.getElementById('logoutBtn');
    if (logoutBtn) {
        logoutBtn.addEventListener('click', (e) => {
            e.preventDefault();
            localStorage.removeItem('token');
            localStorage.removeItem('user');
            window.location.href = '../index.html';
        });
    }

    // C. Carrega os dados do Dashboard
    fetchDashboardData();
});

// ==========================================
// 3. FUNÇÕES DE DADOS
// ==========================================
async function fetchDashboardData() {
    try {
        const responseVideos = await fetch(API_URL);
        const videos = await responseVideos.json();

        let studentCount = 0;
        try {
            const responseStats = await fetch(STATS_URL);
            const stats = await responseStats.json();
            studentCount = stats.studentCount;
        } catch (error) {
            console.warn('Não foi possível buscar alunos:', error);
        }

        updateMetrics(videos, studentCount);
        renderTable(videos);

    } catch (error) {
        console.error('Erro ao carregar dashboard:', error);
    }
}

function updateMetrics(videos, realStudentCount) {
    document.getElementById('totalVideos').innerText = videos.length;

    const totalViews = videos.reduce((acc, video) => acc + (video.views || 0), 0);
    document.getElementById('totalViews').innerText = totalViews.toLocaleString('pt-BR');

    document.getElementById('totalStudents').innerText = realStudentCount || 0;
}

function renderTable(videos) {
    const tbody = document.querySelector('.recent-classes tbody');
    tbody.innerHTML = ''; 

    const recentVideos = videos.slice().reverse().slice(0, 5);

    recentVideos.forEach(video => {
        const tr = document.createElement('tr');
        const videoId = video._id || video.id; 

        tr.innerHTML = `
            <td>
                <div class="class-info">
                    <img src="${video.image}" alt="Thumb">
                    <span>${video.title}</span>
                </div>
            </td>
            <td>${video.tag}</td>
            <td>
                <span class="status ${video.isPremium ? 'premium' : 'free'}">
                    ${video.isPremium ? 'Premium' : 'Gratuito'}
                </span>
            </td>
            <td>${video.views || 0}</td>
            <td style="text-align: right;">
                <div class="action-buttons-cell">
                    <button class="action-btn edit-btn" onclick="editVideo('${videoId}')" title="Editar">
                        <i class="ph ph-pencil-simple"></i>
                    </button>

                    <button class="action-btn delete-btn" onclick="deleteVideo('${videoId}')" title="Excluir">
                        <i class="ph ph-trash"></i>
                    </button>
                </div>
            </td>
        `;
        tbody.appendChild(tr);
    });
}

// ==========================================
// 4. AÇÕES (EDITAR E EXCLUIR)
// ==========================================
window.editVideo = (id) => {
    window.location.href = `upload.html?id=${id}`;
};

window.deleteVideo = async (id) => {
    if (confirm('Tem certeza que deseja excluir esta aula?')) {
        try {
            const res = await fetch(`${API_URL}/${id}`, { 
                method: 'DELETE',
                headers: {
                    'Authorization': `Bearer ${token}` 
                }
            });

            if (res.ok) {
                alert('Aula excluída!');
                fetchDashboardData(); 
            } else {
                const data = await res.json();
                alert(`Erro: ${data.message || 'Não autorizado'}`);
            }
        } catch (error) {
            console.error(error);
            alert('Erro de conexão com o servidor.');
        }
    }
};