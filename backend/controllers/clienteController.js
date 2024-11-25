const db = require('../models/db');

// Função para validar CPF
function validarCPF(cpf) {
    cpf = cpf.replace(/\D/g, ''); // Remove caracteres não numéricos

    if (cpf.length !== 11 || /^(\d)\1+$/.test(cpf)) return false;

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

// Criar cliente
exports.createCliente = async (req, res) => {
    const { nome, senha, cpf, endereco, numero, complemento, bairro, cep, cidade, estado, email, telefone, plano } = req.body;

    if (!nome || !email || !senha || !cpf || !telefone || !endereco || !numero || !bairro || !cep || !cidade || !estado || !plano) {
        return res.status(400).json({ message: 'Todos os campos são obrigatórios.' });
    }
    
    // Validação do CPF
    const cpfRegex = /^\d{11}$/;
    if (!cpfRegex.test(cpf)) {
        return res.status(400).json({ message: 'CPF inválido. Deve conter 11 dígitos numéricos.' });
    }

    const connection = await db.getConnection(); // Iniciar conexão para transação

    try {
        await connection.beginTransaction(); // Iniciar transação

        // Validação de duplicação (CPF e E-mail)
        const [existingCpf] = await connection.query('SELECT CLI_STR_CPF FROM CLIENTE WHERE CLI_STR_CPF = ?', [cpf]);
        if (existingCpf.length > 0) {
            await connection.rollback();
            return res.status(400).json({ message: 'CPF já cadastrado. Use outro CPF ou faça login.' });
        }

        const [existingEmail] = await connection.query('SELECT CLI_STR_EMAIL FROM CLIENTE WHERE CLI_STR_EMAIL = ?', [email]);
        if (existingEmail.length > 0) {
            await connection.rollback();
            return res.status(400).json({ message: 'E-mail já cadastrado. Use outro e-mail ou faça login.' });
        }

        // Inserção no banco: Estado
        const [estadoResult] = await connection.query('CALL SP_CREATE_ESTADO(?, ?)', [estado, estado]);
        const estadoId = estadoResult[0][0].EST_INT_ID;

        // Inserção no banco: Cidade
        const [cidadeResult] = await connection.query('CALL SP_CREATE_CIDADE(?, ?)', [cidade, estadoId]);
        const cidadeId = cidadeResult[0][0].CID_INT_ID;

        // Inserção no banco: Endereço
        const [enderecoResult] = await connection.query(
            'CALL SP_CREATE_ENDERECO(?, ?, ?, ?, ?, ?)',
            [endereco, numero, complemento, bairro, cep, cidadeId]
        );
        const enderecoId = enderecoResult[0][0].END_INT_ID;

        // Inserção no banco: Cliente
        const [clienteResult] = await connection.query(
            'CALL SP_CREATE_CLIENTE(?, ?, ?, ?, ?, ?)',
            [nome, email, senha, cpf, telefone, enderecoId]
        );
        const clienteId = clienteResult[0][0].CLI_INT_ID;

        // Inserção no banco: Assinatura
        await connection.query('CALL SP_CREATE_ASSINATURA(?, ?, NOW(), "ATIVO")', [clienteId, plano]);

        await connection.commit(); // Confirmar transação
        res.status(201).json({ message: 'Cliente, endereço e plano cadastrados com sucesso!' });
    } catch (error) {
        await connection.rollback(); // Reverter mudanças em caso de erro

        // Tratamento de erros duplicados
        if (error.code === 'ER_DUP_ENTRY') {
            if (error.sqlMessage.includes('CLI_STR_CPF')) {
                return res.status(400).json({ message: 'CPF já cadastrado. Use outro CPF ou faça login.' });
            }
            if (error.sqlMessage.includes('CLI_STR_EMAIL')) {
                return res.status(400).json({ message: 'E-mail já cadastrado. Use outro e-mail ou faça login.' });
            }
        }

        console.error('Erro ao cadastrar cliente:', error);
        res.status(500).json({ message: `Erro ao cadastrar cliente: ${error.message}` });
    } finally {
        connection.release(); // Liberar conexão
    }
};



// Buscar todos os clientes
exports.getClientes = async (req, res) => {
    try {
        const [clientes] = await db.query('CALL SP_GET_ALL_CLIENTES()');
        res.status(200).json(clientes[0]); // Retorna os clientes
    } catch (err) {
        console.error('Erro ao buscar clientes:', err);
        res.status(500).json({ message: 'Erro ao buscar clientes.' });
    }
};

// Buscar cliente por ID
exports.getClienteById = async (req, res) => {
    const { id } = req.params;

    try {
        const [cliente] = await db.query('CALL SP_GET_CLIENTE_BY_ID(?)', [id]);
        if (cliente[0].length === 0) {
            return res.status(404).json({ message: 'Cliente não encontrado.' });
        }
        res.status(200).json(cliente[0][0]);
    } catch (err) {
        console.error('Erro ao buscar cliente:', err);
        res.status(500).json({ message: 'Erro ao buscar cliente.' });
    }
};

// Atualizar cliente
exports.updateCliente = async (req, res) => {
    const { id } = req.params;
    const { nome, email, telefone } = req.body;

    try {
        const [result] = await db.query('CALL SP_UPDATE_CLIENTE(?, ?, ?, ?)', [id, nome, email, telefone]);
        if (result.affectedRows === 0) {
            return res.status(404).json({ message: 'Cliente não encontrado.' });
        }
        res.status(200).json({ message: 'Cliente atualizado com sucesso.' });
    } catch (err) {
        console.error('Erro ao atualizar cliente:', err);
        res.status(500).json({ message: 'Erro ao atualizar cliente.' });
    }
};
// Excluir cliente
exports.deleteCliente = async (req, res) => {
    const { id } = req.params;

    try {
        const [result] = await db.query('CALL SP_DELETE_CLIENTE(?)', [id]);
        if (result.affectedRows === 0) {
            return res.status(404).json({ message: 'Cliente não encontrado.' });
        }
        res.status(200).json({ message: 'Cliente excluído com sucesso.' });
    } catch (err) {
        console.error('Erro ao excluir cliente:', err);
        res.status(500).json({ message: 'Erro ao excluir cliente.' });
    }
};

exports.updateEndereco = async (req, res) => {
    const { enderecoId, logradouro, numero, complemento, bairro, cep, cidadeId } = req.body;

    try {
        await db.query(
            'CALL SP_UPDATE_ENDERECO(?, ?, ?, ?, ?, ?, ?)',
            [enderecoId, logradouro, numero, complemento, bairro, cep, cidadeId]
        );
        res.status(200).json({ message: 'Endereço atualizado com sucesso!' });
    } catch (error) {
        console.error('Erro ao atualizar endereço:', error);
        res.status(500).json({ message: 'Erro ao atualizar endereço.' });
    }
};

exports.updateAssinatura = async (req, res) => {
    const { assinaturaId, status, dataFim } = req.body;

    try {
        await db.query(
            'CALL SP_UPDATE_ASSINATURA(?, ?, ?)',
            [assinaturaId, status, dataFim]
        );
        res.status(200).json({ message: 'Assinatura atualizada com sucesso!' });
    } catch (error) {
        console.error('Erro ao atualizar assinatura:', error);
        res.status(500).json({ message: 'Erro ao atualizar assinatura.' });
    }
};

const clienteController = require('../controllers/clienteController');
console.log('Controlador carregado:', clienteController);
