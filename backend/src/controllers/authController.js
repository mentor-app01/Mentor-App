const User = require('../models/User');
const jwt = require('jsonwebtoken');

const SECRET_KEY = process.env.JWT_SECRET || 'viva_la_casta';

// Registrar Usuário 
exports.register = async (req, res) => {
    try {
        // Recebe o role ('student' ou 'teacher') do frontend
        const { name, email, password, role } = req.body;
        
        const userExists = await User.findOne({ email });
        if (userExists) return res.status(400).json({ message: "E-mail já cadastrado" });

        const user = await User.create({ 
            name, 
            email, 
            password, 
            role: role || 'student',
            status: 'pending' 
        });

        res.status(201).json({ message: "Cadastro realizado! Aguarde a aprovação do administrador." });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// Login
exports.login = async (req, res) => {
    try {
        const { email, password } = req.body;

        const user = await User.findOne({ email });
        if (!user) return res.status(401).json({ message: "E-mail ou senha inválidos" });

        const isMatch = await user.comparePassword(password);
        if (!isMatch) return res.status(401).json({ message: "E-mail ou senha inválidos" });

        // VERIFICAÇÃO DE APROVAÇÃO
        if (user.status === 'pending') {
            return res.status(403).json({ message: "Sua conta ainda está em análise pelo administrador." });
        }
        if (user.status === 'rejected') {
            return res.status(403).json({ message: "Seu cadastro foi recusado." });
        }

        const token = jwt.sign(
            { id: user._id, role: user.role }, 
            SECRET_KEY, 
            { expiresIn: '1d' } 
        );

        res.json({ 
            token, 
            user: { 
                name: user.name, 
                email: user.email, 
                role: user.role, 
                plan: user.plan 
            } 
        });

    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};