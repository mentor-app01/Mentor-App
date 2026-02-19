// 1. Bloqueia quem não for admin
const userStr = localStorage.getItem('user');
if (!userStr || JSON.parse(userStr).role !== 'admin') {
    window.location.href = 'login.html';
}

const API_URL = 'https://mentor-app-rdwc.onrender.com/api/admin';

document.addEventListener('DOMContentLoaded', loadPendingUsers);

// 2. Busca e exibe os usuários
async function loadPendingUsers() {
    const res = await fetch(`${API_URL}/pending`);
    const users = await res.json();
    
    const container = document.getElementById('usersList');
    
    if (users.length === 0) {
        return container.innerHTML = '<p>Nenhum usuário aguardando aprovação no momento.</p>';
    }

    container.innerHTML = users.map(user => `
        <div style="border: 1px solid var(--border-color); padding: 15px; margin-bottom: 15px; border-radius: 8px;">
            <p><strong>Nome:</strong> ${user.name}</p>
            <p><strong>Email:</strong> ${user.email}</p>
            <p><strong>Tipo:</strong> ${user.role === 'teacher' ? 'Professor' : 'Aluno'}</p>
            <div style="margin-top: 15px; display: flex; gap: 10px;">
                <button onclick="updateStatus('${user._id}', 'approved')" style="background: #22c55e; color: white; padding: 8px 15px; border: none; border-radius: 4px; cursor: pointer;">Aprovar</button>
                <button onclick="updateStatus('${user._id}', 'rejected')" style="background: #ef4444; color: white; padding: 8px 15px; border: none; border-radius: 4px; cursor: pointer;">Recusar</button>
            </div>
        </div>
    `).join('');
}

// 3. Envia a decisão para o banco
async function updateStatus(id, status) {
    const acao = status === 'approved' ? 'aprovar' : 'recusar';
    if (!confirm(`Tem certeza que deseja ${acao} este usuário?`)) return;

    await fetch(`${API_URL}/status/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status })
    });
    
    loadPendingUsers(); // Atualiza a lista na tela
}