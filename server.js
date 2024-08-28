require('dotenv').config(); 
const express = require('express');
const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');  
const authRoutes = require('./routes/auth');  
const User = require('./models/User'); 
const quizRoutes = require('./routes/quiz');
const planos = require('./models/Plan')
const webhook = require('./routes/webhook')
const planRoutes = require('./routes/plans');
const multer = require('multer');
const fs = require('fs');
const path = require('path');



const app = express();


// Importar o controlador
const quizController = require('./controllers/quiz');


// Verifica se o diretório 'uploads' existe, se não, cria ele
const uploadsDir = path.join(__dirname, 'uploads');
if (!fs.existsSync(uploadsDir)) {
  fs.mkdirSync(uploadsDir);
}

// Configuração do multer para salvar imagens localmente
const storage = multer.diskStorage({
    destination: function (req, file, cb) {
      cb(null, 'uploads/');
    },
    filename: function (req, file, cb) {
      cb(null, Date.now() + '-' + file.originalname);
    }
  });

  // Crie um modelo para armazenar as informações da imagem
const ImageSchema = new mongoose.Schema({
    imageUrl: String,
    userId: String,
  });

  const Image = mongoose.model('Image', ImageSchema);

  const upload = multer({ storage: storage });

// Endpoint para upload de imagem
app.post('/upload', upload.single('image'), async (req, res) => {
  try {
    const { userId } = req.body; // Receba o userId do corpo da requisição
    const newImage = new Image({
      imageUrl: req.file.path, // Caminho da imagem salva
      userId: userId, // Associe o userId à imagem
    });
    await newImage.save();
    res.status(201).json({ message: 'Imagem enviada com sucesso!', imageUrl: req.file.path });
  } catch (error) {
    res.status(500).json({ error: 'Erro ao salvar a imagem' });
  }
});

// Middleware
app.use(express.json());



app.use(authRoutes);
app.use('/api/quiz', quizRoutes);
app.use('/api', quizRoutes);
app.use('/api/auth', authRoutes);
app.use('/api/webhook', webhook);
app.use('/api/plans', planRoutes);

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
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
    console.log(`Servidor rodando na porta ${PORT}`);
});
