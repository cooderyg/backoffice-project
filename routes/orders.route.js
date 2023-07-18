const express = require('express');
const router = express.Router();
const OrdersController = require('../controllers/ordersController');
const authMiddleware = require('../middlewares/validations/signup.validation');

const ordersController = new OrdersController();

router.post('/orders', authMiddleware, ordersController.createOrder.bind(ordersController));
router.get('/orders/:orderId', ordersController.getOrder.bind(ordersController));
router.put('/orders/:orderId', authMiddleware, ordersController.updateOrder.bind(ordersController));
router.delete(
  '/orders/:orderId',
  authMiddleware,
  ordersController.deleteOrder.bind(ordersController),
);

module.exports = router;
