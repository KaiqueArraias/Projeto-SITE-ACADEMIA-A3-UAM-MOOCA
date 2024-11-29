document.addEventListener('DOMContentLoaded', async () => {
    const token = localStorage.getItem('token'); // Recupera o token do localStorage
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

            // Atualiza os elementos com os dados do cliente
            document.getElementById('nomeClienteHeader').textContent = cliente.CLI_STR_NOME;
            document.getElementById('nomeClienteP').textContent = cliente.CLI_STR_NOME;
            document.getElementById('emailCliente').textContent = cliente.CLI_STR_EMAIL;

            document.getElementById('logradouroCliente').textContent = cliente.END_STR_LOGRADOURO;
            document.getElementById('numeroCliente').textContent = cliente.END_STR_NUMERO;
            document.getElementById('complementoCliente').textContent = cliente.END_STR_COMPLEMENTO || 'Sem complemento';
            document.getElementById('bairroCliente').textContent = cliente.END_STR_BAIRRO;
            document.getElementById('cepCliente').textContent = cliente.END_STR_CEP;
            document.getElementById('cidadeCliente').textContent = cliente.cidade;

            document.getElementById('planoCliente').textContent = cliente.plano || 'Plano não encontrado';

            // Salva o ID do endereço no localStorage
            localStorage.setItem('enderecoId', cliente.END_INT_ID);
        } else {
            alert('Erro ao carregar informações do cliente.');
        }
    } catch (error) {
        console.error('Erro ao buscar informações do cliente:', error);
        alert('Erro ao carregar informações. Tente novamente.');
    }
});

// Configuração do modal de edição
const modal = document.getElementById('modalEditar');
const closeModal = document.querySelector('.close-btn');
const editButton = document.getElementById('editarInfo');
const saveButton = document.getElementById('saveButton'); // Certifique-se de que esse ID existe no HTML

// Abre o modal
editButton.addEventListener('click', () => {
    modal.style.display = 'flex';
});

// Fecha o modal
closeModal.addEventListener('click', () => {
    modal.style.display = 'none';
});

// Fecha o modal ao clicar fora do conteúdo
window.addEventListener('click', (event) => {
    if (event.target === modal) {
        modal.style.display = 'none';
    }
});

// Atualização do endereço
saveButton.addEventListener('click', async () => {
    const token = localStorage.getItem('token');
    const clienteId = localStorage.getItem('clienteId');
    const enderecoId = localStorage.getItem('enderecoId');

    const updatedData = {
        nome: document.getElementById('editarNome').value,
        email: document.getElementById('editarEmail').value,
        telefone: document.getElementById('editarTelefone').value,
        endereco: {
            logradouro: document.getElementById('editarLogradouro').value,
            numero: document.getElementById('editarNumero').value,
            complemento: document.getElementById('editarComplemento').value,
            bairro: document.getElementById('editarBairro').value,
            cep: document.getElementById('editarCEP').value,
            cidadeId: document.getElementById('editarCidade').value,
        },
    };

    try {
        const response = await fetch(`http://localhost:3000/api/clientes/${clienteId}/endereco/${enderecoId}`, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json',
                Authorization: `Bearer ${token}`,
            },
            body: JSON.stringify(updatedData),
        });

        if (response.ok) {
            alert('Dados atualizados com sucesso!');
            window.location.reload();
        } else {
            const error = await response.json();
            alert(`Erro ao atualizar informações: ${error.message}`);
        }
    } catch (error) {
        console.error('Erro ao atualizar informações:', error);
    }
});
