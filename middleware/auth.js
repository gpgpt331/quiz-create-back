const jwt = require('jsonwebtoken');

module.exports = function (req, res, next) {
    // Verifica se o cabeçalho de autorização contém o token
    const token = req.header('Authorization').replace('Bearer ', '');

    if (!token) {
        return res.status(401).json({ msg: 'Token de autenticação não fornecido' });
    }

    try {
        // Verifica e decodifica o token JWT
        const decoded = jwt.verify(token, 'secrettoken'); // Substitua 'secrettoken' pela sua chave secreta de configuração

        // Passa o ID do usuário (decodificado do token) para as próximas funções
        req.userId = decoded.userId;
        next();
    } catch (err) {
        res.status(401).json({ msg: 'Token inválido' });
    }
};
