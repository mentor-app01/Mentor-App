const express = require('express');
const router = express.Router();
const adController = require('../controllers/adController');
const { protect, adminOnly } = require('../middlewares/authMiddleware');

const multer = require('multer');
const { CloudinaryStorage } = require('multer-storage-cloudinary');
const cloudinary = require('cloudinary').v2;

const storage = new CloudinaryStorage({
    cloudinary: cloudinary,
    params: {
        folder: 'mentorapp_ads',
        allowed_formats: ['jpg', 'jpeg', 'png', 'gif', 'webp'] 
    },
});
const upload = multer({ storage: storage });

// Rotas
router.get('/', adController.getAds); // Público: Listar para o Slide
router.post('/', protect, adminOnly, upload.single('adImage'), adController.createAd); // Admin: Criar
router.delete('/:id', protect, adminOnly, adController.deleteAd); // Admin: Deletar

module.exports = router;