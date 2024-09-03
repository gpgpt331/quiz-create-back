require('dotenv').config(); 
const express = require('express');
const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');  
const authRoutes = require('./routes/auth');  
const User = require('./models/User'); 
const quizRoutes = require('./routes/quiz');
const planos = require('./models/Plan')
const Image = require('./models/Image')
const webhook = require('./routes/webhook')
const planRoutes = require('./routes/plans');
const imageRoutes = require('./routes/images');
const multer = require('multer');
const fs = require('fs');
const path = require('path');
const cors = require('cors');



const app = express();


// Importar o controlador
const quizController = require('./controllers/quiz');


// Verifica se o diretório 'uploads' existe, se não, cria ele
const uploadsDir = path.join(__dirname, 'uploads');
if (!fs.existsSync(uploadsDir)) {
  fs.mkdirSync(uploadsDir);
}



 app.use(cors({
  origin: '*', // Permite requisições apenas dessa origem
}));

app.post('/test', (req, res) => {
  res.json({
    status: 'success',
    message: 'Servidor está online e respondendo!'
  });
});


// Middleware
app.use(express.json());



app.use(authRoutes);
app.use('/api/quiz', quizRoutes);
app.use('/api', quizRoutes);
app.use('/api/auth', authRoutes);
app.use('/api/webhook', webhook);
app.use('/api/plans', planRoutes);
app.use('/api/images', imageRoutes); // Ou o caminho que você configurou

app.use('/uploads', express.static(path.join(__dirname, 'uploads')));



// Conectar ao MongoDB
mongoose.connect('mongodb://mongo:mBIWsLoMfxTuOkmAFMxfJJVHvzLXHtSc@mongodb.railway.internal:27017', {
    useNewUrlParser: true,
    useUnifiedTopology: true,
}).then(() => {
    console.log('Conectado ao mongoDB');
}).catch(err => {
    console.error('Erro ao conectar ao mongoDB', err);
});

// Iniciar o servidor
const PORT = process.env.PORT || 8080;
app.listen(PORT, () => {
    console.log(`Servidor rodando na porta ${PORT}`);
});
