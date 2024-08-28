// routes/plans.js

const express = require('express');
const router = express.Router();
const Plan = require('../models/Plan');


// Rota para editar um plano
router.put('/:id', async (req, res) => {
    const { id } = req.params;  // Certifique-se de que o ID está sendo capturado corretamente
    const { nome, descricao, preco, duracao, gatewayId } = req.body;

    try {
        const plano = await Plan.findByIdAndUpdate(
            id,  // Passa o ID diretamente
            { nome, descricao, preco, duracao, gatewayId },
            { new: true, runValidators: true }
        );

        if (!plano) {
            return res.status(404).json({ message: 'Plano não encontrado' });
        }

        res.json({ message: 'Plano atualizado com sucesso', plano });
    } catch (error) {
        console.error('Erro ao atualizar o plano:', error);
        res.status(500).json({ message: 'Erro ao atualizar o plano' });
    }
});

// Rota para deletar um plano
router.delete('/delete/:id', async (req, res) => {
    const { id } = req.params;

    try {
        const plano = await Plan.findByIdAndDelete(id);

        if (!plano) {
            return res.status(404).json({ message: 'Plano não encontrado' });
        }

        res.json({ message: 'Plano deletado com sucesso' });
    } catch (error) {
        console.error('Erro ao deletar o plano:', error);
        res.status(500).json({ message: 'Erro ao deletar o plano' });
    }
});

module.exports = router;



router.post('/create', async (req, res) => {
    try {
        const { nome, descricao, preco, duracao, gatewayId } = req.body;
        const newPlan = new Plan({ nome, descricao, preco, duracao, gatewayId });
        await newPlan.save();
        res.status(201).json(newPlan);
    } catch (error) {
        res.status(500).json({ error: 'Erro ao criar o plano' });
    }
});


// Rota para listar todos os planos
router.get('/', async (req, res) => {
    try {
        const plans = await Plan.find();
        res.status(200).json(plans);
    } catch (error) {
        res.status(500).json({ error: 'Erro ao buscar os planos' });
    }
});

module.exports = router;
