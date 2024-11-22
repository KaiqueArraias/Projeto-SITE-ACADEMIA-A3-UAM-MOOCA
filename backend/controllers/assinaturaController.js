const db = require('../models/db');

// Criar uma nova assinatura
exports.createAssinatura = async (req, res) => {
    const { clienteId, planoId, dataInicio, status } = req.body;

    try {
        await db.query('CALL SP_CREATE_ASSINATURA(?, ?, ?, ?)', [
            clienteId,
            planoId,
            dataInicio,
            status,
        ]);

        res.status(201).json({ message: 'Assinatura criada com sucesso!' });
    } catch (error) {
        console.error('Erro ao criar assinatura:', error);
        res.status(500).json({ message: 'Erro ao criar assinatura.' });
    }
};

// Listar todas as assinaturas
exports.getAssinaturas = async (req, res) => {
    try {
        const [assinaturas] = await db.query('SELECT * FROM ASSINATURA');
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
        const [assinatura] = await db.query('SELECT * FROM ASSINATURA WHERE ASS_INT_ID = ?', [id]);

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
    const { status, dataFim } = req.body;

    try {
        await db.query('CALL SP_UPDATE_ASSINATURA(?, ?, ?)', [id, status, dataFim]);

        res.status(200).json({ message: 'Assinatura atualizada com sucesso!' });
    } catch (error) {
        console.error('Erro ao atualizar assinatura:', error);
        res.status(500).json({ message: 'Erro ao atualizar assinatura.' });
    }
};

// Excluir uma assinatura
exports.deleteAssinatura = async (req, res) => {
    const { id } = req.params;

    try {
        const [result] = await db.query('DELETE FROM ASSINATURA WHERE ASS_INT_ID = ?', [id]);

        if (result.affectedRows === 0) {
            return res.status(404).json({ message: 'Assinatura não encontrada.' });
        }

        res.status(200).json({ message: 'Assinatura excluída com sucesso!' });
    } catch (error) {
        console.error('Erro ao excluir assinatura:', error);
        res.status(500).json({ message: 'Erro ao excluir assinatura.' });
    }
};
