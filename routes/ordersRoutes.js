const express = require('express');
const router = express.Router();
const {
  createOrder,
  getOrder,
  updateOrder,
  deleteOrder,
} = require('../controllers/ordersController');
const authMiddleware = require('../middlewares/validations/signup.validation.js');

// 주문 생성 API
router.post('/orders', authMiddleware, createOrder);

// 주문서 상세 조회 API
router.get('/orders/:orderId', getOrder);

// 주문서 수정 API
router.put('/orders/:orderId', authMiddleware, updateOrder);

// 주문서 삭제 API
router.delete('/orders/:orderId', authMiddleware, deleteOrder);

module.exports = router;
