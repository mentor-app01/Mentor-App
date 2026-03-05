const Ad = require('../models/Ad');

// Pegar todos os anúncios (Slide)
exports.getAds = async (req, res) => {
    try {
        const ads = await Ad.find().sort({ createdAt: -1 });
        res.json(ads);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// Criar novo anúncio
exports.createAd = async (req, res) => {
    try {
        if (!req.file) return res.status(400).json({ message: "Nenhuma imagem enviada" });
        
        const newAd = new Ad({ imageUrl: req.file.path });
        await newAd.save();
        res.status(201).json(newAd);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// Deletar anúncio
exports.deleteAd = async (req, res) => {
    try {
        await Ad.findByIdAndDelete(req.params.id);
        res.json({ message: "Anúncio removido" });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};