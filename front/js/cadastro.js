document.addEventListener('DOMContentLoaded', () => {
    const form = document.getElementById('cadastro');
    form.addEventListener('submit', (e) => {
        e.preventDefault();
        enviarCadastro();
    });
});

async function enviarCadastro() {
    const form = document.getElementById('cadastro');
    const formData = new FormData(form);
    const dados = Object.fromEntries(formData.entries());

    try {
        const response = await fetch('http://localhost:3000/api/clientes', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(dados),
        });

        if (response.ok) {
            alert('Cadastro realizado com sucesso!');
        } else {
            const erro = await response.json();
            alert(`Erro no cadastro: ${erro.message}`);
        }
    } catch (error) {
        console.error('Erro ao enviar os dados:', error);
        alert('Ocorreu um erro ao enviar os dados.');
    }
}


function validarFormulario(dados) {
    const { nome, senha, cpf, endereco, numero, bairro, cep, cidade, estado, email, telefone, plano } = dados;

    // Validar campos obrigatórios
    if (!nome || !senha || !cpf || !endereco || !numero || !bairro || !cep || !cidade || !estado || !email || !telefone || !plano) {
        alert('Todos os campos são obrigatórios, incluindo o plano.');
        return false;
    }

    // Validar CPF (11 dígitos, apenas números)
    const regexCpf = /^\d{11}$/;
    if (!regexCpf.test(cpf)) {
        alert('CPF inválido. Use apenas números (11 dígitos).');
        return false;
    }

    // Validar CEP (8 dígitos, apenas números)
    const regexCep = /^\d{8}$/;
    if (!regexCep.test(cep)) {
        alert('CEP inválido. Use apenas números (8 dígitos).');
        return false;
    }

    // Validar telefone (11 dígitos, apenas números)
    const regexTelefone = /^\d{11}$/;
    if (!regexTelefone.test(telefone)) {
        alert('Telefone inválido. Use apenas números (11 dígitos).');
        return false;
    }

    // Validar seleção do plano
    if (isNaN(plano) || plano < 1 || plano > 3) {
        alert('Selecione um plano válido.');
        return false;
    }

    return true;
}
