const express = require('express');
const router = express.Router();
const authMiddleware = require('../middlewares/auth-middleware');
const OrdersController = require('../controllers/orders.controller');
const ordersController = new OrdersController();

// 주문 생성 API
router.post('/orders', authMiddleware, ordersController.createOrder);

// 주문서 유저가 조회 API
router.get('/:userId/orders', ordersController.getOrder);

// 주문서 삭제 API
router.delete('/:userId/orders/:orderId', authMiddleware, ordersController.deleteOrder);

// 주문서 사장이 조회 API
router.get('/owner/orders/:orderId', authMiddleware, ordersController.getOrderForOwner);

module.exports = router;
