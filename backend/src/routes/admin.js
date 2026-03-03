const express = require('express');
const router = express.Router();
const mongoose = require('mongoose');
const User = require('../models/User');

// Cria um modelo simples para o Anúncio direto aqui
const adSchema = new mongoose.Schema({ imageBase64: String });
const Ad = mongoose.models.Ad || mongoose.model('Ad', adSchema);

// ==========================================
// ROTAS DE APROVAÇÃO E USUÁRIOS
// ==========================================

// Buscar usuários pendentes
router.get('/pending', async (req, res) => {
    try {
        const users = await User.find({ status: 'pending' }, '-password');
        res.json(users);
    } catch (error) { res.status(500).json({ error: error.message }); }
});

// Aprovar ou Recusar (Premium automático se aprovado)
router.put('/status/:id', async (req, res) => {
    try {
        const updateFields = { status: req.body.status };
        
        if (req.body.status === 'approved') {
            updateFields.plan = 'premium';
        }

        await User.findByIdAndUpdate(req.params.id, updateFields);
        res.json({ message: "Status atualizado com sucesso!" });
    } catch (error) { res.status(500).json({ error: error.message }); }
});

// ==========================================
// ROTAS DE ANÚNCIOS (BANNER)
// ==========================================

// Salvar/Atualizar o Anúncio
router.post('/ad', async (req, res) => {
    try {
        const { imageBase64 } = req.body;
        
        // Apaga o antigo e salva o novo (garante que só tenha 1 ativo)
        await Ad.deleteMany({});
        await Ad.create({ imageBase64 });
        
        res.json({ message: "Anúncio salvo com sucesso!" });
    } catch (error) { res.status(500).json({ error: error.message }); }
});

// Buscar o Anúncio atual (Para exibir no site)
router.get('/ad', async (req, res) => {
    try {
        const ad = await Ad.findOne();
        res.json(ad || { imageBase64: null });
    } catch (error) { res.status(500).json({ error: error.message }); }
});

module.exports = router;