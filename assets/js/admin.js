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

document.addEventListener('DOMContentLoaded', loadPendingUsers);

// ==========================================
// LÓGICA DE ABAS (TABS)
// ==========================================
function switchTab(tab) {
    // Reseta botões do menu
    document.getElementById('tab-approvals').classList.remove('active');
    document.getElementById('tab-ads').classList.remove('active');
    // Esconde todas as seções
    document.getElementById('section-approvals').style.display = 'none';
    document.getElementById('section-ads').style.display = 'none';

    // Ativa apenas a escolhida
    document.getElementById(`tab-${tab}`).classList.add('active');
    document.getElementById(`section-${tab}`).style.display = 'block';
}

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

async function updateStatus(id, status) {
    if (!confirm(`Tem certeza que deseja ${status === 'approved' ? 'aprovar' : 'recusar'} este usuário?`)) return;
    try {
        await fetch(`${API_URL}/status/${id}`, {
            method: 'PUT',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ status })
        });
        loadPendingUsers(); 
    } catch (error) { alert("Erro ao atualizar status!"); }
}

// ==========================================
// LÓGICA DE ANÚNCIOS (UPLOAD DE IMAGEM)
// ==========================================
// Exibe preview da imagem ao selecionar
document.getElementById('adImageInput').addEventListener('change', function(e) {
    const file = e.target.files[0];
    if (file) {
        const reader = new FileReader();
        reader.onload = function(event) {
            document.getElementById('adPreview').src = event.target.result;
            document.getElementById('adPreviewContainer').style.display = 'block';
        }
        reader.readAsDataURL(file); // Converte para Base64
    }
});

// Envia para a API
async function uploadAd() {
    const imgSrc = document.getElementById('adPreview').src;
    if (!imgSrc || imgSrc === "") return alert("Selecione uma imagem primeiro!");

    const btn = document.querySelector('#section-ads .btn-primary');
    btn.innerText = "Salvando...";
    btn.disabled = true;

    try {
        await fetch(`${API_URL}/ad`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ imageBase64: imgSrc })
        });
        alert("Anúncio atualizado com sucesso!");
    } catch (error) {
        alert("Erro ao salvar anúncio.");
    } finally {
        btn.innerText = "Salvar Anúncio";
        btn.disabled = false;
    }
}