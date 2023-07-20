const express = require('express');
const router = express.Router();
const authMiddleware = require('../middlewares/auth-middleware');
// const { Users, PointTransactions, sequelize } = require('../models');

const PaymentsController = require('../controllers/payments.controller');

const paymentController = new PaymentsController();

router.post('/point-transaction', paymentController.createPointTransaction);
router.put('/point-transaction', paymentController.cancelPointTransaction);

// router.get('/point-transaction', authMiddleware, async (req, res) => {
//   const { userId } = res.locals.user;
//   await Users.increment(
//     { point: 1000000 }, //
//     { where: { userId } },
//   );
// });
module.exports = router;
