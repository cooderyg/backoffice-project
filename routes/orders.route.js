const express = require('express');
const router = express.Router();
const authMiddleware = require('../middlewares/auth-middleware');
const OrdersService = require('../controllers/orders.controller');
const ordersService = new OrdersService();

// 주문 생성 API
router.post('/orders', authMiddleware, ordersService.createOrder);

// 주문서 상세 조회 API
router.get('/:userId/orders', ordersService.getOrder);

// 주문서 삭제 API
router.delete('/:userId/orders/:orderId', authMiddleware, ordersService.deleteOrder);

// 주문서 사장이 조회 API
router.get('/owner/orders/:orderId', authMiddleware, ordersService.getOrderForOwner);

module.exports = router;
