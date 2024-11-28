document.addEventListener('DOMContentLoaded', () => {
    const form = document.getElementById('cadastro');

    // Adiciona evento de envio ao formulário
    form.addEventListener('submit', (e) => {
        e.preventDefault();

        const formData = new FormData(form);
        const dados = Object.fromEntries(formData.entries());

        console.log('Dados capturados:', dados); // Log para verificar os dados


        if (validarFormulario(dados)) {
            enviarCadastro(dados);
        }
    });

    // Aplicar máscara ao CPF ao digitar
    const cpfInput = document.getElementById('cpf');
    if (cpfInput) {
        cpfInput.addEventListener('input', () => mascararCPF(cpfInput));
    }
});

// Função para enviar o cadastro
async function enviarCadastro(dados) {
    console.log('Dados recebidos:', dados); // Verifica o que foi capturado do formulário

    if (!dados.cpf) {
        alert('CPF é obrigatório.');
        return;
    }

    // Remova a máscara antes de enviar
    dados.cpf = dados.cpf.replace(/[^\d]/g, ''); // Remove pontos e traços

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
            window.location.href = '../login.html';
        } else {
            const erro = await response.json();
            alert(`Erro no cadastro: ${erro.message}`);
        }
    } catch (error) {
        console.error('Erro ao enviar os dados:', error);
        alert('Ocorreu um erro ao enviar os dados.');
    }
}



// Máscara para CPF
function mascararCPF(campo) {
    campo.value = campo.value
        .replace(/\D/g, '') // Remove tudo que não é número
        .replace(/(\d{3})(\d)/, '$1.$2') // Adiciona ponto após os 3 primeiros dígitos
        .replace(/(\d{3})(\d)/, '$1.$2') // Adiciona ponto após os 6 primeiros dígitos
        .replace(/(\d{3})(\d{1,2})$/, '$1-$2'); // Adiciona hífen nos últimos 2 dígitos
}

// Validação do CPF
function validarCPF(cpf) {
    cpf = cpf.replace(/[^\d]+/g, '');

    if (cpf.length !== 11 || /^(\d)\1+$/.test(cpf)) {
        return false;
    }

    let soma = 0;
    for (let i = 0; i < 9; i++) {
        soma += parseInt(cpf.charAt(i)) * (10 - i);
    }
    let resto = (soma * 10) % 11;
    if (resto === 10 || resto === 11) resto = 0;
    if (resto !== parseInt(cpf.charAt(9))) return false;

    soma = 0;
    for (let i = 0; i < 10; i++) {
        soma += parseInt(cpf.charAt(i)) * (11 - i);
    }
    resto = (soma * 10) % 11;
    if (resto === 10 || resto === 11) resto = 0;
    return resto === parseInt(cpf.charAt(10));
}

// Validação do formulário
function validarFormulario(dados) {
    try {
        const { nome, senha, cpf, endereco, numero, bairro, cep, cidade, estado, email, telefone, plano } = dados;

        if (!nome || !senha || !cpf || !endereco || !numero || !bairro || !cep || !cidade || !estado || !email || !telefone || !plano) {
            alert('Todos os campos são obrigatórios.');
            return false;
        }

        // Validar CPF
        if (!validarCPF(cpf)) {
            alert('CPF inválido. Verifique os dígitos e tente novamente.');
            return false;
        }

        // Validar CEP
        const regexCep = /^\d{8}$/;
        if (!regexCep.test(cep)) {
            alert('CEP inválido. Use apenas números (8 dígitos).');
            return false;
        }

        // Validar telefone
        const regexTelefone = /^\d{11}$/;
        if (!regexTelefone.test(telefone)) {
            alert('Telefone inválido. Use apenas números (11 dígitos).');
            return false;
        }

        // Validar plano
        if (isNaN(plano) || plano < 1 || plano > 3) {
            alert('Selecione um plano válido.');
            return false;
        }

        return true;
    } catch (error) {
        console.error('Erro na validação do formulário:', error);
        alert('Erro inesperado ao validar o formulário. Tente novamente.');
        return false;
    }
}
