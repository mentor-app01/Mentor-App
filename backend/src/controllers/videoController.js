const Video = require('../models/Video');

// Listar todos 
exports.getAllVideos = async (req, res) => {
    try {
        const videos = await Video.find();
        res.json(videos);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// Pegar um por ID
exports.getVideoById = async (req, res) => {
    try {
        const video = await Video.findById(req.params.id);
        if (!video) return res.status(404).json({ message: "Vídeo não encontrado" });
        res.json(video);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// Criar um vídeo
exports.createVideo = async (req, res) => {
    try {
        const newVideo = new Video(req.body);
        const savedVideo = await newVideo.save();
        res.status(201).json(savedVideo);
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
};

// Atualizar vídeo (PUT)
exports.updateVideo = async (req, res) => {
    try {
        const { id } = req.params;
        
        const updatedVideo = await Video.findByIdAndUpdate(id, req.body, { new: true });

        if (!updatedVideo) {
            return res.status(404).json({ message: "Vídeo não encontrado" });
        }

        res.json(updatedVideo);
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
};

// Deletar um vídeo
exports.deleteVideo = async (req, res) => {
    try {
        const { id } = req.params;
        
        const deletedVideo = await Video.findByIdAndDelete(id);

        if (!deletedVideo) {
            return res.status(404).json({ message: "Vídeo não encontrado" });
        }

        res.json({ message: "Vídeo deletado com sucesso" });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

//  Adicionar visualização (+1)

exports.incrementViews = async (req, res) => {
    try {
        const { id } = req.params;
        
        const updatedVideo = await Video.findByIdAndUpdate(
            id, 
            { $inc: { views: 1 } }, 
            { new: true }
        );

        if (!updatedVideo) {
            return res.status(404).json({ message: "Vídeo não encontrado" });
        }

        res.json({ message: "Visualização contabilizada!", views: updatedVideo.views });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};