const express = require('express');
const router = express.Router();
const verifyToken = require('../middlewares/authMiddleware');

//Importando edl controlador de usuarios
const { getUsers, createUser, updateUser, deleteUser, getUserWithOrders, createUserWithOrder, getUsersWithOrdersHtml, getUsersWithOrders, loginUser} = require('../controllers/userController');
router.post('/login', loginUser);
router.post('/usuarios', createUser);
//Ruta GET /usuarios
router.get('/usuarios', verifyToken, getUsers);
router.put('/usuarios/:id', verifyToken, updateUser);
router.delete('/usuarios/:id', verifyToken, deleteUser);
router.get('/usuarios/:id/pedidos', verifyToken, getUserWithOrders);
router.post('/usuarios-con-pedidos', verifyToken, createUserWithOrder);
router.get('/usuarios/:id/pedidos-html', verifyToken, getUsersWithOrdersHtml);
router.get('/usuarios-con-pedidos', verifyToken, getUsersWithOrders);

module.exports = router;