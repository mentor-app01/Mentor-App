const dns = require('dns');
dns.setServers(['8.8.8.8', '1.1.1.1']); 

require('dotenv').config();

const express = require('express');
const mongoose = require('mongoose'); 
const cors = require('cors');

const User = require('./models/User'); 

const videoRoutes = require('./routes/videoRoutes');
const authRoutes = require('./routes/authRoutes'); 

const app = express();
const PORT = process.env.PORT || 3000;

app.use(cors()); 
app.use(express.json()); 

// Definição das Rotas Principais
app.use('/api/videos', videoRoutes);
app.use('/api/auth', authRoutes);

// --- ROTA DE ESTATÍSTICAS (CORRIGIDA) ---
app.get('/api/stats', async (req, res) => {
    try {
        // Agora conta corretamente baseado na nova estrutura de 'role'
        const studentCount = await User.countDocuments({ role: 'student' });
        
        res.json({ studentCount });
    } catch (error) {
        console.error("Erro ao contar alunos:", error);
        res.json({ studentCount: 0 }); 
    }
});

// --- CONEXÃO COM O BANCO DA CLIENTE ---
// Tenta pegar do .env, mas se falhar, usa a URL oficial direto
const dbURI = process.env.MONGO_URI || 'mongodb+srv://viviane:viviane01mentor@mentorapp.x82rjcn.mongodb.net/MentorApp?retryWrites=true&w=majority';

mongoose.connect(dbURI)
    .then(() => console.log("✅ MongoDB Atlas (Nuveem) Conectado!"))
    .catch((err) => console.error("❌ Erro ao conectar no Mongo:", err));

app.listen(PORT, () => {
    console.log(`🚀 Servidor rodando na porta ${PORT}`);
});