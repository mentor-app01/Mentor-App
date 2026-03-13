const { GoogleGenerativeAI } = require('@google/generative-ai');

// Inicia a IA com a sua chave que ficará no .env
const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

exports.corrigirRedacao = async (req, res) => {
    try {
        if (!req.file) return res.status(400).json({ message: "Envie a imagem ou PDF da redação." });

        const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });
        
        // O comando invisível que a IA vai seguir
        const prompt = "Atue como um corretor do ENEM. Leia esta redação, aponte os erros gramaticais, avalie as competências e dê uma nota final de 0 a 1000. Seja claro e encorajador.";

        const filePart = {
            inlineData: {
                data: req.file.buffer.toString("base64"),
                mimeType: req.file.mimetype
            }
        };

        const result = await model.generateContent([prompt, filePart]);
        const response = await result.response;
        
        res.json({ feedback: response.text() });

    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Erro ao processar redação na IA." });
    }
};