// models/Quiz.js
const mongoose = require('mongoose');

const answerSchema = new mongoose.Schema({
    text: { type: String, required: true }
});

const questionSchema = new mongoose.Schema({
    text: { type: String, required: true },
    answers: [answerSchema] // Usando o esquema `answerSchema` para a propriedade `answers`
});

const quizSchema = new mongoose.Schema({
    title: { type: String, required: true },
    questions: [questionSchema],
    user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    thankYouTitle: { type: String },
    thankYouMessage: { type: String },
    thankYouLink: { type: String }
    
});

const Quiz = mongoose.model('Quiz', quizSchema);
module.exports = Quiz;
