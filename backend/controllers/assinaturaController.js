const db = require('../models/db'); // Conexão com o banco de dados

// Criar uma nova assinatura
exports.createAssinatura = async (req, res) => {
    const { clienteId, planoId, dataInicio, status } = req.body;

    // Validação dos dados
    if (!clienteId || !planoId || !status) {
        return res.status(400).json({ message: 'Todos os campos obrigatórios devem ser preenchidos.' });
    }

    try {
        // Inserir a nova assinatura no banco
        const [result] = await db.query(
            'INSERT INTO ASSINATURA (CLI_INT_ID, PLA_INT_ID, ASS_STR_DATA_INICIO, ASS_STR_STATUS) VALUES (?, ?, ?, ?)',
            [clienteId, planoId, dataInicio || new Date(), status]
        );

        res.status(201).json({ message: 'Assinatura criada com sucesso!', assinaturaId: result.insertId });
    } catch (error) {
        console.error('Erro ao criar assinatura:', error);
        res.status(500).json({ message: 'Erro ao criar assinatura.' });
    }
};

// Listar todas as assinaturas
exports.getAssinaturas = async (req, res) => {
    try {
        // Buscar todas as assinaturas no banco
        const [assinaturas] = await db.query(`
            SELECT 
                a.ASS_INT_ID,
                a.ASS_STR_DATA_INICIO,
                a.ASS_STR_DATA_FIM,
                a.ASS_STR_STATUS,
                c.CLI_STR_NOME AS clienteNome,
                p.PLA_STR_NOME AS planoNome
            FROM ASSINATURA a
            INNER JOIN CLIENTE c ON a.CLI_INT_ID = c.CLI_INT_ID
            INNER JOIN PLANO p ON a.PLA_INT_ID = p.PLA_INT_ID
        `);

        res.status(200).json(assinaturas);
    } catch (error) {
        console.error('Erro ao buscar assinaturas:', error);
        res.status(500).json({ message: 'Erro ao buscar assinaturas.' });
    }
};

// Buscar uma assinatura por ID
exports.getAssinaturaById = async (req, res) => {
    const { id } = req.params;

    try {
        // Buscar assinatura específica
        const [assinatura] = await db.query(`
            SELECT 
                a.ASS_INT_ID,
                a.ASS_STR_DATA_INICIO,
                a.ASS_STR_DATA_FIM,
                a.ASS_STR_STATUS,
                c.CLI_STR_NOME AS clienteNome,
                p.PLA_STR_NOME AS planoNome
            FROM ASSINATURA a
            INNER JOIN CLIENTE c ON a.CLI_INT_ID = c.CLI_INT_ID
            INNER JOIN PLANO p ON a.PLA_INT_ID = p.PLA_INT_ID
            WHERE a.ASS_INT_ID = ?
        `, [id]);

        if (assinatura.length === 0) {
            return res.status(404).json({ message: 'Assinatura não encontrada.' });
        }

        res.status(200).json(assinatura[0]);
    } catch (error) {
        console.error('Erro ao buscar assinatura:', error);
        res.status(500).json({ message: 'Erro ao buscar assinatura.' });
    }
};

// Atualizar uma assinatura
exports.updateAssinatura = async (req, res) => {
    const { id } = req.params;
    const { dataFim, status } = req.body;

    // Validação dos dados
    if (!status) {
        return res.status(400).json({ message: 'O campo status é obrigatório.' });
    }

    try {
        // Atualizar a assinatura no banco
        const [result] = await db.query(
            'UPDATE ASSINATURA SET ASS_STR_DATA_FIM = ?, ASS_STR_STATUS = ? WHERE ASS_INT_ID = ?',
            [dataFim, status, id]
        );

        if (result.affectedRows === 0) {
            return res.status(404).json({ message: 'Assinatura não encontrada.' });
        }

        res.status(200).json({ message: 'Assinatura atualizada com sucesso.' });
    } catch (error) {
        console.error('Erro ao atualizar assinatura:', error);
        res.status(500).json({ message: 'Erro ao atualizar assinatura.' });
    }
};

// Excluir uma assinatura
exports.deleteAssinatura = async (req, res) => {
    const { id } = req.params;

    try {
        // Excluir a assinatura do banco
        const [result] = await db.query('DELETE FROM ASSINATURA WHERE ASS_INT_ID = ?', [id]);

        if (result.affectedRows === 0) {
            return res.status(404).json({ message: 'Assinatura não encontrada.' });
        }

        res.status(200).json({ message: 'Assinatura excluída com sucesso.' });
    } catch (error) {
        console.error('Erro ao excluir assinatura:', error);
        res.status(500).json({ message: 'Erro ao excluir assinatura.' });
    }
};
