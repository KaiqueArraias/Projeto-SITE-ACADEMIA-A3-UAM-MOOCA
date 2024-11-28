document.addEventListener('DOMContentLoaded', async () => {
    const token = localStorage.getItem('token');
    const clienteId = localStorage.getItem('clienteId');

    if (!token || !clienteId) {
        alert('Você precisa estar logado para acessar esta página.');
        window.location.href = 'login.html';
        return;
    }

    try {
        const response = await fetch(`http://localhost:3000/api/clientes/info/${clienteId}`, {
            method: 'GET',
            headers: {
                Authorization: `Bearer ${token}`,
            },
        });


        if (response.ok) {
            const cliente = await response.json();

            // Atualiza os dados nos elementos HTML
            document.getElementById('nomeClienteHeader').textContent = cliente.CLI_STR_NOME;
            document.getElementById('nomeClienteP').textContent = cliente.CLI_STR_NOME;
            document.getElementById('emailCliente').textContent = cliente.CLI_STR_EMAIL;
            document.getElementById('planoCliente').textContent = cliente.plano;
            document.getElementById('logradouroCliente').textContent = cliente.END_STR_LOGRADOURO;
            document.getElementById('numeroCliente').textContent = cliente.END_STR_NUMERO;
            document.getElementById('complementoCliente').textContent = cliente.END_STR_COMPLEMENTO || 'Sem complemento';
            document.getElementById('bairroCliente').textContent = cliente.END_STR_BAIRRO;
            document.getElementById('cepCliente').textContent = cliente.END_STR_CEP;
            document.getElementById('cidadeCliente').textContent = cliente.cidade;
            document.getElementById('estadoCliente').textContent = cliente.estado;
        } else {
            alert('Erro ao carregar informações do cliente.');
        }
    } catch (error) {
        console.error('Erro ao buscar informações do cliente:', error);
        alert('Erro ao carregar informações. Tente novamente.');
    }
});
