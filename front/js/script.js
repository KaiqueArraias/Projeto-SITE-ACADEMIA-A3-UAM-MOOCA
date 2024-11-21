window.addEventListener('scroll', () => {

    const scrollPosition = window.scrollY;
    const element = document.querySelector('.imagem'); // O elemento


    if (scrollPosition > 630) {
        element.classList.add('animate');
    } else {
        element.classList.remove('animate');
    }
});


window.addEventListener('scroll', () => {

    const scrollPosition = window.scrollY;
    const element = document.querySelector('.img-why');


    if (scrollPosition > 1200) {
        element.classList.add('animate');
    } else {
        element.classList.remove('animate');
    }
});

// Create
async function criarCliente(cliente) {
    try {
        const response = await fetch('http://localhost:3000/api/clientes', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(cliente),
        });

        const data = await response.json();
        console.log(data);
    } catch (err) {
        console.error('Erro ao criar cliente:', err);
    }
}

//  Read

async function listarClientes() {
    try {
        const response = await fetch('http://localhost:3000/api/clientes');
        const clientes = await response.json();
        console.log(clientes);
    } catch (err) {
        console.error('Erro ao listar clientes:', err);
    }
}

// Update

async function atualizarCliente(id, clienteAtualizado) {
    try {
        const response = await fetch(`http://localhost:3000/api/clientes/${id}`, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(clienteAtualizado),
        });

        const data = await response.json();
        console.log(data);
    } catch (err) {
        console.error('Erro ao atualizar cliente:', err);
    }
}

// Delete

async function excluirCliente(id) {
    try {
        const response = await fetch(`http://localhost:3000/api/clientes/${id}`, {
            method: 'DELETE',
        });

        const data = await response.json();
        console.log(data);
    } catch (err) {
        console.error('Erro ao excluir cliente:', err);
    }
}