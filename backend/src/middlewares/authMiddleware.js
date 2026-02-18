const jwt = require('jsonwebtoken');

const SECRET_KEY = process.env.JWT_SECRET || 'viva_la_casta';

// Verifica se o usuário está logado
exports.protect = (req, res, next) => {
    const authHeader = req.headers.authorization;

    if (!authHeader) {
        return res.status(401).json({ message: 'Token não fornecido.' });
    }

    const token = authHeader.split(' ')[1]; 

    if (!token) {
        return res.status(401).json({ message: 'Token mal formatado.' });
    }

    try {
        const decoded = jwt.verify(token, SECRET_KEY);
        req.user = decoded; 
        next(); 
    } catch (error) {
        return res.status(403).json({ message: 'Token inválido ou expirado.' });
    }
};


exports.adminOnly = (req, res, next) => {
    if (!req.user || !req.user.isAdmin) {
        return res.status(403).json({ message: 'Acesso negado: Apenas professores.' });
    }
    next();
};