const db = require('../models/db');

// Criar um novo plano
exports.createPlano = async (req, res) => {
    const { nome, preco, descricao, duracao } = req.body;

    try {
        await db.query('INSERT INTO PLANO (PLA_STR_NOME, PLA_STR_PRECO, PLA_STR_DESC, PLA_STR_DURACAO) VALUES (?, ?, ?, ?)', [nome, preco, descricao, duracao]);
        res.status(201).json({ message: 'Plano criado com sucesso!' });
    } catch (error) {
        console.error('Erro ao criar plano:', error);
        res.status(500).json({ message: 'Erro ao criar plano.' });
    }
};

// Listar todos os planos
exports.getPlanos = async (req, res) => {
    try {
        const [planos] = await db.query('SELECT * FROM PLANO');
        res.status(200).json(planos);
    } catch (error) {
        console.error('Erro ao buscar planos:', error);
        res.status(500).json({ message: 'Erro ao buscar planos.' });
    }
};

// Buscar um plano por ID
exports.getPlanoById = async (req, res) => {
    const { id } = req.params;

    try {
        const [plano] = await db.query('SELECT * FROM PLANO WHERE PLA_INT_ID = ?', [id]);
        if (plano.length === 0) {
            return res.status(404).json({ message: 'Plano não encontrado.' });
        }
        res.status(200).json(plano[0]);
    } catch (error) {
        console.error('Erro ao buscar plano:', error);
        res.status(500).json({ message: 'Erro ao buscar plano.' });
    }
};

// Atualizar um plano existente
exports.updatePlano = async (req, res) => {
    const { id } = req.params;
    const { nome, preco, descricao, duracao } = req.body;

    try {
        const [result] = await db.query('UPDATE PLANO SET PLA_STR_NOME = ?, PLA_STR_PRECO = ?, PLA_STR_DESC = ?, PLA_STR_DURACAO = ? WHERE PLA_INT_ID = ?', [nome, preco, descricao, duracao, id]);
        if (result.affectedRows === 0) {
            return res.status(404).json({ message: 'Plano não encontrado.' });
        }
        res.status(200).json({ message: 'Plano atualizado com sucesso!' });
    } catch (error) {
        console.error('Erro ao atualizar plano:', error);
        res.status(500).json({ message: 'Erro ao atualizar plano.' });
    }
};

// Excluir um plano
exports.deletePlano = async (req, res) => {
    const { id } = req.params;

    try {
        const [result] = await db.query('DELETE FROM PLANO WHERE PLA_INT_ID = ?', [id]);
        if (result.affectedRows === 0) {
            return res.status(404).json({ message: 'Plano não encontrado.' });
        }
        res.status(200).json({ message: 'Plano excluído com sucesso!' });
    } catch (error) {
        console.error('Erro ao excluir plano:', error);
        res.status(500).json({ message: 'Erro ao excluir plano.' });
    }
};
