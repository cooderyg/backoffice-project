const express = require('express');
const router = express.Router();

const PaymentsController = require('../controllers/payments.controller');

const paymentController = new PaymentsController();

router.post('/point-transaction', paymentController.pointTransaction);
module.exports = router;
