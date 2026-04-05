const express = require('express');
const router = express.Router();
const verifyToken = require('../middlewares/authMiddleware');

const { createOrder, getOrders, getOrdersHtml } = require('../controllers/orderController');

router.post('/pedidos', verifyToken, createOrder);
router.get('/pedidos', verifyToken, getOrders);
router.get('/pedidos-html', verifyToken, getOrdersHtml);

module.exports = router;