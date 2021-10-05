// Definir las rutas para responder a diferentes metodos HTTP
const express = require('express');
const router = express.Router();

// TODO: importar controlador de usuarios

router.get('/', (req, res) => {
    res.json({ msg: 'test' });
});

module.exports = router;