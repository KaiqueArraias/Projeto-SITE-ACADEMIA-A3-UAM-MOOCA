const jwt = require('jsonwebtoken');

const authMiddleware = (req, res, next) => {
    const authHeader = req.headers.authorization;
    if (!authHeader) {
        return res.status(401).json({ message: 'Token não fornecido.' });
    }

    const token = authHeader.split(' ')[1]; // Divide "Bearer <token>" e pega o token
    if (!token) {
        return res.status(401).json({ message: 'Token inválido.' });
    }

    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        req.user = decoded; // Adiciona o ID do cliente no objeto de requisição
        next();
    } catch (error) {
        return res.status(401).json({ message: 'Token inválido.' });
    }
};

module.exports = authMiddleware;
