const mongoose = require('mongoose');

const planoSchema = new mongoose.Schema({
    title: { type: String, required: true },
    amount: { type: mongoose.Schema.Types.Decimal128, required: true },
    quantity: { type: mongoose.Schema.Types.number, required: true },

});

const Plano = mongoose.model('Plano', planoSchema);
module.exports = Plano;