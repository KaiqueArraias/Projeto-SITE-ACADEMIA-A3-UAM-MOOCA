const db = require('../models/db');

// Criar cliente com endereço e assinatura
exports.createCliente = async (req, res) => {
    const { nome, senha, cpf, endereco, numero, complemento, bairro, cep, cidade, estado, email, telefone, plano } = req.body;

    try {
        // Verificar se o CPF já existe
        const [existingCliente] = await db.query('SELECT CLI_STR_CPF FROM CLIENTE WHERE CLI_STR_CPF = ?', [cpf]);
        if (existingCliente.length > 0) {
            return res.status(400).json({ message: 'CPF já cadastrado. Use outro CPF ou faça login.' });
        }

        // Inserir estado (ou reutilizar se já existir)
        const [estadoResult] = await db.query(
            'INSERT INTO ESTADO (EST_STR_DESC, EST_STR_SIGLA) VALUES (?, ?) ON DUPLICATE KEY UPDATE EST_INT_ID=LAST_INSERT_ID(EST_INT_ID)',
            [estado, estado]
        );
        const estadoId = estadoResult.insertId;

        // Inserir cidade (ou reutilizar se já existir)
        const [cidadeResult] = await db.query(
            'INSERT INTO CIDADE (CID_STR_DESCRICAO, EST_INT_ID) VALUES (?, ?) ON DUPLICATE KEY UPDATE CID_INT_ID=LAST_INSERT_ID(CID_INT_ID)',
            [cidade, estadoId]
        );
        const cidadeId = cidadeResult.insertId;

        // Inserir endereço
        const [enderecoResult] = await db.query(
            'INSERT INTO ENDERECO (END_STR_LOGRADOURO, END_STR_NUMERO, END_STR_COMPLEMENTO, END_STR_BAIRRO, END_STR_CEP, CID_INT_ID) VALUES (?, ?, ?, ?, ?, ?)',
            [endereco, numero, complemento, bairro, cep, cidadeId]
        );
        const enderecoId = enderecoResult.insertId;

        // Inserir cliente
        const [clienteResult] = await db.query(
            'INSERT INTO CLIENTE (CLI_STR_NOME, CLI_STR_SENHA, CLI_STR_CPF, END_INT_ID, CLI_STR_EMAIL, CLI_STR_TELEFONE) VALUES (?, ?, ?, ?, ?, ?)',
            [nome, senha, cpf, enderecoId, email, telefone]
        );
        const clienteId = clienteResult.insertId;

        // Inserir assinatura vinculada ao cliente e plano
        await db.query(
            'INSERT INTO ASSINATURA (CLI_INT_ID, PLA_INT_ID, ASS_STR_DATA_INICIO, ASS_STR_STATUS) VALUES (?, ?, NOW(), ?)',
            [clienteId, plano, 'Ativo']
        );

        res.status(201).json({ message: 'Cliente, endereço e plano cadastrados com sucesso!' });
    } catch (error) {
        console.error('Erro ao cadastrar cliente:', error);
        res.status(500).json({ message: 'Erro ao cadastrar cliente.' });
    }
};



// Buscar todos os clientes
exports.getClientes = async (req, res) => {
    try {
        console.log('Executando query: SELECT * FROM CLIENTE');
        const [clientes] = await db.query('SELECT * FROM CLIENTE');
        console.log('Resultado:', clientes);
        res.status(200).json(clientes);
    } catch (error) {
        console.error('Erro ao buscar clientes:', error); // Mostra o erro detalhado no console
        res.status(500).json({ message: 'Erro ao buscar clientes.' });
    }
};

// Buscar cliente por ID
exports.getClienteById = async (req, res) => {
    const { id } = req.params;

    try {
        const [cliente] = await db.query('SELECT * FROM CLIENTE WHERE CLI_INT_ID = ?', [id]);
        if (cliente.length === 0) {
            return res.status(404).json({ message: 'Cliente não encontrado.' });
        }
        res.status(200).json(cliente[0]);
    } catch (err) {
        console.error('Erro ao buscar cliente:', err);
        res.status(500).json({ message: 'Erro ao buscar cliente.' });
    }
};

// Atualizar cliente
exports.updateCliente = async (req, res) => {
    const { id } = req.params;
    const { nome, email, senha, telefone } = req.body;

    try {
        const [result] = await db.query(
            'UPDATE CLIENTE SET CLI_STR_NOME = ?, CLI_STR_EMAIL = ?, CLI_STR_SENHA = ?, CLI_STR_TELEFONE = ? WHERE CLI_INT_ID = ?',
            [nome, email, senha, telefone, id]
        );

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
        const [result] = await db.query('DELETE FROM CLIENTE WHERE CLI_INT_ID = ?', [id]);

        if (result.affectedRows === 0) {
            return res.status(404).json({ message: 'Cliente não encontrado.' });
        }

        res.status(200).json({ message: 'Cliente excluído com sucesso.' });
    } catch (err) {
        console.error('Erro ao excluir cliente:', err);
        res.status(500).json({ message: 'Erro ao excluir cliente.' });
    }
};
