async function realizarLogin() {
    const email = document.getElementById('username').value;
    const senha = document.getElementById('password').value;

    if (!email || !senha) {
        alert('Por favor, preencha todos os campos.');
        return;
    }

    try {
        const response = await fetch('http://localhost:3000/api/login', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ email, senha }),
        });

        if (response.ok) {
            const { token, clienteId } = await response.json();
            localStorage.setItem('token', token);
            localStorage.setItem('clienteId', clienteId);

            console.log('Login bem-sucedido. Redirecionando...');
            window.location.href = 'clientePagina.html';
        } else {
            const error = await response.json();
            alert(`Erro no login: ${error.message}`);
        }
    } catch (error) {
        console.error('Erro ao fazer login:', error);
        alert('Erro ao fazer login. Verifique sua conexão ou tente novamente.');
    }
}

document.addEventListener('DOMContentLoaded', () => {
    const form = document.getElementById('login-container');
    if (form) {
        form.addEventListener('submit', (e) => {
            e.preventDefault();
            realizarLogin();
        });
    } else {
        console.error('Elemento #login-container não encontrado.');
    }
});
