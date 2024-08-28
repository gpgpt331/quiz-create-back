// routes/quizRoutes.js

const express = require('express');
const router = express.Router();
const Quiz = require('../models/Quiz'); // Verifique se o caminho está correto
const multer = require('multer');
const path = require('path');


// Configuração do multer para salvar as imagens na pasta "uploads"
const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, 'uploads/');
    },
    filename: (req, file, cb) => {
        cb(null, Date.now() + path.extname(file.originalname)); // Nomeia o arquivo com a data atual para evitar duplicatas
    }
});

const upload = multer({ storage });

// Middleware para autenticação JWT
const authenticate = require('../middleware/auth'); // Exemplo de middleware para autenticação

// Rota para criar um novo quiz
router.post('/', authenticate, upload.single('image'), async (req, res) => {
    const { title, questions, thankYouTitle, thankYouMessage, thankYouLink } = req.body;

    if (!questions || questions.length === 0) {
        return res.status(400).json({ message: 'O campo questions é obrigatório' });
    }

    try {
        const imageUrl = req.file ? req.file.path : null; // Salva o caminho da imagem, se houver

        const newQuiz = new Quiz({ 
            title, 
            questions: JSON.parse(questions), // Lembre-se de fazer o parse das perguntas, pois elas foram enviadas como string
            user: req.userId, // Usa o userId extraído do token JWT
            thankYouTitle,
            thankYouMessage,
            thankYouLink,
            imageUrl, // Adiciona a URL da imagem ao documento do quiz
        });
        await newQuiz.save();
        res.status(201).json(newQuiz);
    } catch (error) {
        res.status(500).json({ message: 'Erro ao salvar'})
    }
});


// Rota para buscar um quiz pelo ID
router.get('/quiz/:id', async (req, res) => {
    console.log('Rota acessada com ID:', req.params.id);
    try {
        const quiz = await Quiz.findById(req.params.id);
        if (!quiz) {
            console.log('Quiz não encontrado');
            return res.status(404).json({ message: 'Quiz não encontrado' });
        }
        res.json(quiz);
    } catch (err) {
        console.error('Erro ao buscar quiz:', err);
        res.status(500).json({ message: 'Erro ao buscar quiz' });
    }
});


// Exemplo de rota DELETE
router.delete('/quiz/:id', async (req, res) => {
    try {
        const quizId = req.params.id;
        await Quiz.findByIdAndDelete(quizId);
        res.status(200).send({ message: 'Quiz deletado com sucesso!' });
    } catch (err) {
        res.status(500).send({ error: 'Erro ao deletar o quiz' });
    }
});

// Exemplo de rota PUT para atualizar o quiz
router.put('/quiz/:id', async (req, res) => {
    try {
        const quizId = req.params.id;
        const updatedData = req.body; // Novos dados do quiz
        const updatedQuiz = await Quiz.findByIdAndUpdate(quizId, updatedData, { new: true });
        res.status(200).send(updatedQuiz);
    } catch (err) {
        res.status(500).send({ error: 'Erro ao atualizar o quiz' });
    }
});





// Middleware para autenticação
const authenticateToken = require('../middleware/auth');
// Rota para buscar todos os quizzes
router.get('/all', async (req, res) => {
    try {
        const quizzes = await Quiz.find(); // Ajuste a consulta conforme necessário
        res.json(quizzes);
    } catch (err) {
        res.status(500).json({ message: 'Erro ao buscar quizzes', error: err.message });
    }
});

module.exports = router;
