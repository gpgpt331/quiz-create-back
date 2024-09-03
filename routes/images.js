const express = require('express');
const Image = require('../models/Image');
const auth = require('../middleware/auth'); // Middleware de autenticação

const router = express.Router();

// Configuração do multer para salvar imagens localmente
const storage = multer.diskStorage({
    destination: function (req, file, cb) {
      cb(null, 'uploads/'); // pasta onde os arquivos serão salvos
    },
    filename: function (req, file, cb) {
      cb(null, Date.now() + path.extname(file.originalname)); // nome do arquivo
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

  module.exports = router;