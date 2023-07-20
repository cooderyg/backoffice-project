const express = require('express');
const router = express.Router();
const authMiddleware = require('../middlewares/auth-middleware');
const OrdersController = require('../controllers/orders.controller');
const ordersController = new OrdersController();

// 주문 생성 API
router.post('/orders', authMiddleware, ordersController.createOrder);

// 주문서 상세 조회 API
router.get('/:userId/orders', ordersController.getOrder);

// 주문서 수정 API
router.put('/:userId/orders/:orderId', authMiddleware, ordersController.updateOrder);

// 주문서 삭제 API
router.delete('/:userId/orders/:orderId', authMiddleware, ordersController.deleteOrder);

module.exports = router;
