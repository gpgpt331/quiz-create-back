const express = require('express');
const bcrypt = require('bcryptjs');
const User = require('../models/User');
const jwt = require('jsonwebtoken');
require('dotenv').config();

const router = express.Router();

// Rota de login
router.post('/login', async (req, res) => {
    const { email, password } = req.body;

    try {
        // Verifique se o usuário existe
        const user = await User.findOne({ email });
        if (!user) {
            return res.status(400).json({ message: 'Credenciais inválidas' });
        }

        // Verifique a senha
        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) {
            return res.status(400).json({ message: 'Credenciais inválidas' });
        }

        // Gere um token JWT
        const payload = { userId: user._id, username: user.username };
        const token = jwt.sign(payload, 'secrettoken', { expiresIn: '1h' });

        // Envie o token e o userId na resposta
        res.json({ token, userId: user._id });
    } catch (err) {
        console.error(err.message);
        res.status(500).json({ message: 'Erro no servidor' });
    }
});


// Rota de registro
router.post('/api/auth/register', async (req, res) => {
    const { username, email, password } = req.body;

    if (!username || !email || !password) {
        return res.status(400).json({ message: 'Todos os campos são obrigatórios' });
    }

    try {
        // Verifique se o usuário já existe
        let user = await User.findOne({ email });
        if (user) {
            return res.status(400).json({ message: 'Usuário já existe' });
        }

        // Crie uma nova instância de usuário
        user = new User({
            username,
            email,
            password
        });

        // Criptografe a senha
        const salt = await bcrypt.genSalt(10);
        user.password = await bcrypt.hash(password, salt);

        // Salve o usuário no banco de dados
        await user.save();

        res.status(201).json({ message: 'Usuário registrado com sucesso!' });
    } catch (err) {
        console.error(err.message);
        res.status(500).json({ message: 'Erro no servidor' });
    }
});

module.exports = router;
