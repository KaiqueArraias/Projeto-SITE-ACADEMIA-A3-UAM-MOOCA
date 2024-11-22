const db = require('../models/db');

exports.createCliente = async (req, res) => {
    const { nome, senha, cpf, endereco, numero, complemento, bairro, cep, cidade, estado, email, telefone, plano } = req.body;

    if (!nome || !email || !senha || !cpf || !telefone || !endereco || !numero || !bairro || !cep || !cidade || !estado || !plano) {
        return res.status(400).json({ message: 'Todos os campos são obrigatórios.' });
    }
    
    // Verificar se o CPF tem 11 dígitos
    const cpfRegex = /^\d{11}$/;
    if (!cpfRegex.test(cpf)) {
        return res.status(400).json({ message: 'CPF inválido. Deve conter 11 dígitos numéricos.' });
    }

    try {
        // Verificar se o CPF já existe
        const [existingCliente] = await db.query('SELECT CLI_STR_CPF FROM CLIENTE WHERE CLI_STR_CPF = ?', [cpf]);
        if (existingCliente.length > 0) {
            return res.status(400).json({ message: 'CPF já cadastrado. Use outro CPF ou faça login.' });
        }

        // Inserir ou reutilizar estado
        const [estadoResult] = await db.query('CALL SP_CREATE_ESTADO(?, ?)', [estado, estado]);
        console.log('Resultado SP_CREATE_ESTADO:', estadoResult); // Para debug
        if (!estadoResult || !estadoResult[0] || !estadoResult[0][0]) {
            throw new Error('Erro: SP_CREATE_ESTADO não retornou um valor válido');
        }
        const estadoId = estadoResult[0][0].EST_INT_ID;

        // Inserir cidade
        const [cidadeResult] = await db.query('CALL SP_CREATE_CIDADE(?, ?)', [cidade, estadoId]);
        console.log('Resultado SP_CREATE_CIDADE:', cidadeResult); // Para debug
        if (!cidadeResult || !cidadeResult[0] || !cidadeResult[0][0]) {
            throw new Error('Erro: SP_CREATE_CIDADE não retornou um valor válido');
        }
        const cidadeId = cidadeResult[0][0].CID_INT_ID;

        // Inserir endereço
        const [enderecoResult] = await db.query(
            'CALL SP_CREATE_ENDERECO(?, ?, ?, ?, ?, ?)',
            [endereco, numero, complemento, bairro, cep, cidadeId]
        );
        console.log('Resultado SP_CREATE_ENDERECO:', enderecoResult); // Para debug
        if (!enderecoResult || !enderecoResult[0] || !enderecoResult[0][0]) {
            throw new Error('Erro: SP_CREATE_ENDERECO não retornou um valor válido');
        }
        const enderecoId = enderecoResult[0][0].END_INT_ID;

        // Inserir cliente
        const [clienteResult] = await db.query(
            'CALL SP_CREATE_CLIENTE(?, ?, ?, ?, ?, ?)',
            [nome, email, senha, cpf, telefone, enderecoId]
        );

        console.log('Verificação de e-mail existente:', existingCliente);

        console.log('Resultado SP_CREATE_CLIENTE:', clienteResult); // Para debug
        if (!clienteResult || !clienteResult[0] || !clienteResult[0][0]) {
            throw new Error('Erro: SP_CREATE_CLIENTE não retornou um valor válido');
        }
        const clienteId = clienteResult[0][0].CLI_INT_ID;

        // Inserir assinatura
        await db.query('CALL SP_CREATE_ASSINATURA(?, ?, NOW(), "ATIVO")', [clienteId, plano]);

        res.status(201).json({ message: 'Cliente, endereço e plano cadastrados com sucesso!' });
    } catch (error) {
        console.error('Erro ao cadastrar cliente:', error);
        res.status(500).json({ message: `Erro ao cadastrar cliente: ${error.message}` });
    }
};

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
