const express = require('express');
const router = express.Router();
const videoController = require('../controllers/videoController');
const { protect, adminOnly } = require('../middlewares/authMiddleware');

// Configuração Cloudinary e Multer
const multer = require('multer');
const { CloudinaryStorage } = require('multer-storage-cloudinary');
const cloudinary = require('cloudinary').v2;

cloudinary.config({
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET
});

const storage = new CloudinaryStorage({
    cloudinary: cloudinary,
    params: {
        folder: 'mentorapp_pdfs',
        resource_type: 'raw', 
        format: 'pdf'
    },
});
const upload = multer({ storage: storage });

// Rotas Públicas 
router.get('/', videoController.getAllVideos);
router.get('/:id', videoController.getVideoById);

// Contabilizar Visualização
router.put('/:id/view', videoController.incrementViews);

// Rotas Admin (Protegidas com Upload de PDF)
router.post('/', protect, adminOnly, upload.single('pdfFile'), videoController.createVideo);

// Rota de Atualização (com Upload de PDF)
router.put('/:id', protect, adminOnly, upload.single('pdfFile'), videoController.updateVideo);

// Rota de Exclusão
router.delete('/:id', protect, adminOnly, videoController.deleteVideo);

module.exports = router;