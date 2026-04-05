//Importando express
const express = require('express');

//Se crea el rouer para separar rutas en archivos
const router = express.Router();

//Se importa el middleware de atenticación (JWT)
const verifyToken = require('../middlewares/authMiddleware');

//Importando las funciones del controlador de upload
const { uploadFile, deleteFile } = require('../controllers/uploadController');

//Ruta para subir el archivo
router.post('/upload', verifyToken, uploadFile);

//Ruta para eliminar el archivo
router.delete('/upload/:nombre', verifyToken, deleteFile);

module.exports = router;