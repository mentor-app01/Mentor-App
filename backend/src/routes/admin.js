const express = require('express');
const router = express.Router();
const User = require('../models/User');

// Buscar usuários pendentes
router.get('/pending', async (req, res) => {
    try {
        const users = await User.find({ status: 'pending' }, '-password');
        res.json(users);
    } catch (error) { res.status(500).json({ error: error.message }); }
});

// Aprovar ou Recusar
router.put('/status/:id', async (req, res) => {
    try {
        await User.findByIdAndUpdate(req.params.id, { status: req.body.status });
        res.json({ message: "Status atualizado com sucesso!" });
    } catch (error) { res.status(500).json({ error: error.message }); }
});

module.exports = router;