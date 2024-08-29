// models/Plan.js

const mongoose = require('mongoose');

const PlanSchema = new mongoose.Schema({
    nome: { type: String, required: true },
    descricao: { type: String },
    preco: { type: Number, required: true },
    duracao: { type: Number, required: true }, // Ex: 1 para mensal, 12 para anual, etc.
    createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('Plan', PlanSchema);
