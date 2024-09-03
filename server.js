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

// Configuração do multer para salvar imagens localmente
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, 'uploads/'); // pasta onde os arquivos serão salvos
  },
  filename: function (req, file, cb) {
    cb(null, Date.now() + path.extname(file.originalname)); // nome do arquivo
  }
});


  const upload = multer({ storage: storage });

// Rota de upload de imagem
router.post('/upload', auth, upload.single('image'), async (req, res) => {
  try {
    // Cria um novo documento de imagem com o ID do usuário logado
    const image = new Image({
      filename: req.file.filename,
      url: `/uploads/${req.file.filename}`,
      userId: req.user._id // Pega o ID do usuário logado do middleware de autenticação
    });

    await image.save();
    res.status(201).json({ message: 'Imagem enviada com sucesso!', image });
  } catch (error) {
    res.status(500).json({ message: 'Erro ao enviar a imagem', error });
  }
});

// Rota para obter as imagens do usuário logado
router.get('/my-images', auth, async (req, res) => {
  try {
    // Busca as imagens associadas ao usuário logado
    const images = await Image.find({ userId: req.user._id });

    res.status(200).json(images);
  } catch (error) {
    res.status(500).json({ message: 'Erro ao buscar imagens', error });
  }
});

app.use(cors()); // Habilita o CORS para todas as requisições

 //app.use(cors({
  //origin: '*', // Permite requisições apenas dessa origem
//}));

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
