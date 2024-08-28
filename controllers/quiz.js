// controllers/quizController.js

const path = require('path');
const Quiz = require('../models/Quiz');

// Função para criar um novo quiz
exports.createQuiz = async (req, res) => {
    try {
        const { title, questions, thankYouTitle, thankYouMessage, thankYouLink } = req.body;
        const user = req.user._id;

        // Verifica se uma imagem foi enviada
        let logoImage = '';
        if (req.file) {
            logoImage = req.file.filename; // Nome do arquivo da imagem
        }

        const newQuiz = new Quiz({
            title,
            questions,
            user,
            logoImage, // Salva o nome do arquivo no banco de dados
            thankYouTitle,
            thankYouMessage,
            thankYouLink
        });

        await newQuiz.save();
        res.status(201).json(newQuiz);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Erro ao criar o quiz' });
    }
};
