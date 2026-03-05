// Verifica se é admin
const userStr = localStorage.getItem('user');
if (!userStr || JSON.parse(userStr).role !== 'admin') window.location.href = 'login.html';

const userData = JSON.parse(userStr);
document.getElementById('adminName').innerText = userData.name;
document.getElementById('adminAvatar').innerText = userData.name.charAt(0).toUpperCase();

document.getElementById('logoutBtn').addEventListener('click', () => {
    localStorage.clear();
    window.location.href = 'login.html';
});

const API_URL = 'https://mentor-app-rdwc.onrender.com/api/admin';
const ADS_API = 'https://mentor-app-rdwc.onrender.com/api/ads';

document.addEventListener('DOMContentLoaded', loadPendingUsers);

// ==========================================
// LÓGICA DE ABAS (TABS)
// ==========================================
window.switchTab = function(tab) {
    document.getElementById('tab-approvals').classList.remove('active');
    document.getElementById('tab-ads').classList.remove('active');
    
    document.getElementById('section-approvals').style.display = 'none';
    document.getElementById('section-ads').style.display = 'none';

    document.getElementById(`tab-${tab}`).classList.add('active');
    document.getElementById(`section-${tab}`).style.display = 'block';

    if (tab === 'ads') loadAds();
};

// ==========================================
// LÓGICA DE APROVAÇÕES
// ==========================================
async function loadPendingUsers() {
    try {
        const res = await fetch(`${API_URL}/pending`);
        const users = await res.json();
        const container = document.getElementById('usersList');
        
        if (users.length === 0) {
            return container.innerHTML = `
                <div class="empty-state">
                    <i class="ph ph-check-circle" style="font-size: 3rem; color: #2ecc71; margin-bottom: 10px;"></i>
                    <p>Tudo limpo! Nenhum usuário aguardando aprovação no momento.</p>
                </div>
            `;
        }

        container.innerHTML = users.map(user => `
            <div class="user-row">
                <div class="user-info">
                    <span class="user-name">${user.name}</span>
                    <span class="user-email">${user.email}</span>
                    <div style="margin-top: 5px;">
                        <span class="badge ${user.role}">${user.role === 'teacher' ? 'Professor' : 'Aluno'}</span>
                    </div>
                </div>
                <div class="actions">
                    <button class="btn-icon btn-approve" onclick="updateStatus('${user._id}', 'approved')"><i class="ph ph-check"></i> Aprovar</button>
                    <button class="btn-icon btn-reject" onclick="updateStatus('${user._id}', 'rejected')"><i class="ph ph-x"></i> Recusar</button>
                </div>
            </div>
        `).join('');
    } catch (error) {
        document.getElementById('usersList').innerHTML = `<p style="color:red; padding: 20px;">Erro ao carregar usuários.</p>`;
    }
}

window.updateStatus = async function(id, status) {
    if (!confirm(`Tem certeza que deseja ${status === 'approved' ? 'aprovar' : 'recusar'} este usuário?`)) return;
    try {
        await fetch(`${API_URL}/status/${id}`, {
            method: 'PUT',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ status })
        });
        loadPendingUsers(); 
    } catch (error) { alert("Erro ao atualizar status!"); }
};

// ==========================================
// LÓGICA DE ANÚNCIOS (MULTIPLE SLIDES)
// ==========================================

// Mostrar nome do arquivo selecionado
document.getElementById('adImageInput').addEventListener('change', function(e) {
    const file = e.target.files[0];
    const fileNameDisplay = document.getElementById('fileNameDisplay');
    if (file) fileNameDisplay.textContent = file.name;
});

// Carregar vitrine de anúncios
async function loadAds() {
    const container = document.getElementById('adsList');
    try {
        const res = await fetch(ADS_API);
        const ads = await res.json();
        
        if (ads.length === 0) {
            container.innerHTML = '<p style="grid-column: 1/-1; color: #999; text-align: center; padding: 20px;">Nenhum anúncio ativo.</p>';
            return;
        }

        container.innerHTML = ads.map(ad => `
            <div class="ad-card-item" style="position: relative; border-radius: 12px; overflow: hidden; border: 2px solid var(--primary-light); background: #000;">
                <img src="${ad.imageUrl}" style="width: 100%; height: 120px; object-fit: cover; opacity: 0.8;">
                <button onclick="deleteAd('${ad._id}')" style="position: absolute; top: 8px; right: 8px; background: #ef4444; color: white; border: none; border-radius: 50%; width: 30px; height: 30px; cursor: pointer; display: flex; align-items: center; justify-content: center;">
                    <i class="ph ph-trash"></i>
                </button>
            </div>
        `).join('');
    } catch (error) {
        container.innerHTML = '<p style="color:red;">Erro ao carregar vitrine.</p>';
    }
}

// Upload de novo anúncio
window.uploadAd = async function() {
    const fileInput = document.getElementById('adImageInput');
    const btn = document.getElementById('btnUploadAd');
    
    if (!fileInput.files[0]) return alert("Selecione uma imagem!");

    const formData = new FormData();
    formData.append('adImage', fileInput.files[0]);

    btn.innerText = "Enviando...";
    btn.disabled = true;

    try {
        const res = await fetch(ADS_API, {
            method: 'POST',
            headers: { 'Authorization': `Bearer ${localStorage.getItem('token')}` },
            body: formData
        });

        if (res.ok) {
            alert("Imagem adicionada ao slide!");
            fileInput.value = '';
            document.getElementById('fileNameDisplay').innerText = 'Nenhum arquivo...';
            loadAds();
        } else {
            throw new Error("Erro no servidor");
        }
    } catch (error) {
        alert("Erro ao salvar anúncio.");
    } finally {
        btn.innerText = "Adicionar ao Slide";
        btn.disabled = false;
    }
};

// Excluir anúncio
window.deleteAd = async function(id) {
    if (!confirm("Remover do slide?")) return;

    try {
        const res = await fetch(`${ADS_API}/${id}`, {
            method: 'DELETE',
            headers: { 'Authorization': `Bearer ${localStorage.getItem('token')}` }
        });
        if (res.ok) loadAds();
    } catch (error) {
        alert("Erro ao excluir.");
    }
};