const express = require('express');
const router = express.Router();
const multer = require('multer');
const aiController = require('../controllers/aiController');
const { protect } = require('../middlewares/authMiddleware'); 

// Salva temporariamente na memória RAM para enviar à IA
const upload = multer({ storage: multer.memoryStorage() });

// Rota para receber o arquivo (pdf ou imagem)
router.post('/corrigir', protect, upload.single('documento'), aiController.corrigirRedacao);

module.exports = router;