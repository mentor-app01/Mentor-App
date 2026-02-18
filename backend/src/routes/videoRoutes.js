const express = require('express');
const router = express.Router();
const videoController = require('../controllers/videoController');

const { protect, adminOnly } = require('../middlewares/authMiddleware');

// Rotas Públicas 
router.get('/', videoController.getAllVideos);
router.get('/:id', videoController.getVideoById);

//  Contabilizar Visualização
router.put('/:id/view', videoController.incrementViews);

// Rotas Admin (Protegidas)
router.post('/', protect, adminOnly, videoController.createVideo);

// Rota de Atualização
router.put('/:id', protect, adminOnly, videoController.updateVideo);

// Rota de Exclusão
router.delete('/:id', protect, adminOnly, videoController.deleteVideo);

module.exports = router;