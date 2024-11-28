const jwt = require('jsonwebtoken');
const db = require('../models/db');

exports.login = async (req, res) => {
    const { email, senha } = req.body;
    try {
        console.log('Dados recebidos no login:', { email, senha });

        const [results] = await db.query('SELECT * FROM CLIENTE WHERE CLI_STR_EMAIL = ?', [email]);

        if (results.length === 0) {
            return res.status(404).json({ message: 'Usuário não encontrado.' });
        }

        const cliente = results[0];

        if (cliente.CLI_STR_SENHA !== senha) {
            return res.status(401).json({ message: 'Senha incorreta.' });
        }

        const token = jwt.sign({ id: cliente.CLI_INT_ID }, process.env.JWT_SECRET, { expiresIn: '1h' });
        res.status(200).json({ token, clienteId: cliente.CLI_INT_ID });
    } catch (error) {
        console.error('Erro ao autenticar usuário:', error);
        res.status(500).json({ message: 'Erro interno do servidor.' });
    }
};
