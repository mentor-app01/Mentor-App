const { GoogleGenAI } = require('@google/genai');

// Inicia com a nova biblioteca oficial
const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });

exports.corrigirRedacao = async (req, res) => {
    try {
        if (!req.file) return res.status(400).json({ message: "Envie a imagem ou PDF da redação." });

        const prompt = "Atue como um corretor do ENEM. Leia esta redação, aponte os erros gramaticais, avalie as competências e dê uma nota final de 0 a 1000. Seja claro e encorajador.";

        // Chamada atualizada para o modelo 2.5
        const response = await ai.models.generateContent({
            model: 'gemini-2.5-flash',
            contents: [
                { text: prompt },
                {
                    inlineData: {
                        data: req.file.buffer.toString("base64"),
                        mimeType: req.file.mimetype
                    }
                }
            ]
        });
        
        res.json({ feedback: response.text });

    } catch (error) {
        console.error("Erro na API da IA:", error);
        res.status(500).json({ message: "Erro ao processar redação na IA." });
    }
};