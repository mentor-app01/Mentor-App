// Verifica se é admin
const userStr = localStorage.getItem('user');
if (!userStr) {
    window.location.href = 'login.html';
}
const userData = JSON.parse(userStr);
if (userData.role !== 'admin') {
    window.location.href = 'login.html';
}

// Preenche dados do Admin no cabeçalho
document.getElementById('adminName').innerText = userData.name;
document.getElementById('adminAvatar').innerText = userData.name.charAt(0).toUpperCase();

// Botão de Logout
document.getElementById('logoutBtn').addEventListener('click', () => {
    localStorage.clear();
    window.location.href = 'login.html';
});

const API_URL = 'https://mentor-app-rdwc.onrender.com/api/admin';

document.addEventListener('DOMContentLoaded', loadPendingUsers);

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
                        <span class="badge ${user.role}">
                            ${user.role === 'teacher' ? 'Professor' : 'Aluno'}
                        </span>
                    </div>
                </div>
                <div class="actions">
                    <button class="btn-icon btn-approve" onclick="updateStatus('${user._id}', 'approved')">
                        <i class="ph ph-check"></i> Aprovar
                    </button>
                    <button class="btn-icon btn-reject" onclick="updateStatus('${user._id}', 'rejected')">
                        <i class="ph ph-x"></i> Recusar
                    </button>
                </div>
            </div>
        `).join('');
    } catch (error) {
        document.getElementById('usersList').innerHTML = `<p style="color:red; padding: 20px;">Erro ao carregar usuários.</p>`;
    }
}

async function updateStatus(id, status) {
    const acao = status === 'approved' ? 'aprovar' : 'recusar';
    if (!confirm(`Tem certeza que deseja ${acao} este usuário?`)) return;

    try {
        await fetch(`${API_URL}/status/${id}`, {
            method: 'PUT',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ status })
        });
        
        loadPendingUsers(); 
    } catch (error) {
        alert("Erro ao atualizar status!");
    }
}