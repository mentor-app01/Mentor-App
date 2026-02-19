document.addEventListener('DOMContentLoaded', () => {
    
    // ==========================================
    // LÓGICA DE REGISTRO (CRIAR CONTA)
    // ==========================================
    const registerForm = document.getElementById('registerForm');

    if (registerForm) {
        let isTeacher = false;

        const tabs = document.querySelectorAll('.tab-btn');
        tabs.forEach(tab => {
            tab.addEventListener('click', (e) => {
                e.preventDefault(); 
                tabs.forEach(t => t.classList.remove('active'));
                tab.classList.add('active');
                isTeacher = tab.dataset.type === 'teacher';
            });
        });

        registerForm.addEventListener('submit', async (e) => {
            e.preventDefault();
            
            const name = document.getElementById('name').value;
            const email = document.getElementById('email').value;
            const password = document.getElementById('password').value;
            const confirmPassword = document.getElementById('confirmPassword').value;
            const btn = registerForm.querySelector('button[type="submit"]');
            
            if (password !== confirmPassword) {
                alert('As senhas não coincidem!');
                return;
            }

            const originalText = btn.innerText;
            btn.innerText = 'Criando conta...';
            btn.disabled = true;

            const userRole = isTeacher ? 'teacher' : 'student';

            try {
                // 👇 URL NOVA DA API
                const response = await fetch('https://mentor-app-rdwc.onrender.com/api/auth/register', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ name, email, password, role: userRole })
                });

                const data = await response.json();

                if (response.ok) {
                    alert('Conta criada! Faça login.');
                    window.location.href = 'login.html';
                } else {
                    throw new Error(data.message);
                }

            } catch (error) {
                alert(error.message);
                btn.innerText = originalText;
                btn.disabled = false;
            }
        });
    }

    // ==========================================
    // LÓGICA DE LOGIN (ACESSAR CONTA)
    // ==========================================
    const loginForm = document.getElementById('loginForm');

    if (loginForm) {
        const tabs = document.querySelectorAll('.tab-btn');
        const submitBtn = document.getElementById('submitBtn');

        tabs.forEach(tab => {
            tab.addEventListener('click', (e) => {
                e.preventDefault(); 
                
                tabs.forEach(t => t.classList.remove('active'));
                tab.classList.add('active');

                const type = tab.dataset.type;
                if (type === 'teacher') {
                    submitBtn.innerText = 'Acessar como Professor';
                } else {
                    submitBtn.innerText = 'Acessar como Aluno';
                }
            });
        });

        loginForm.addEventListener('submit', async (e) => {
            e.preventDefault();

            const email = document.getElementById('email').value;
            const password = document.getElementById('password').value;
            const originalText = submitBtn.innerText;

            submitBtn.innerText = 'Entrando...';
            submitBtn.disabled = true;

            try {
                // 👇 URL NOVA DA API
                const response = await fetch('https://mentor-app-rdwc.onrender.com/api/auth/login', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ email, password })
                });

                const data = await response.json();

                if (response.ok) {
                    localStorage.setItem('token', data.token);
                    localStorage.setItem('user', JSON.stringify(data.user));

                    // 👇 Nova lógica de redirecionamento automático
                    if (data.user.role === 'admin') {
                        window.location.href = 'admin.html'; 
                    } else if (data.user.role === 'teacher') {
                        window.location.href = 'dashboard.html'; 
                    } else {
                        window.location.href = 'biblioteca.html'; 
                    }
                } else {
                    throw new Error(data.message || 'Erro ao fazer login');
                }

            } catch (error) {
                alert(error.message);
                submitBtn.innerText = originalText;
                submitBtn.disabled = false;
            }
        });
    }
});