const express = require('express');
const router = express.Router();
const authMiddleware = require('../middlewares/auth-middleware');
const { Orders, Owners, Stores } = require('../models');

// 배달 완료 기능
router.put('/orders/delivery-complete/:orderId', authMiddleware, async (req, res) => {
  const { orderId } = req.params;
  const { ownerId } = res.locals.owner;
  // (사장 미들웨어 정보에서 ownerId 가져오기)
  try {
    const order = await Orders.findOne({
      where: { orderId: +orderId },
      include: [{ model: Stores }],
    });
    if (!order) return res.status(400).json({ message: '주문이 존재하지 않습니다.' });
    if (order) {
      if (!order.isDelivered) {
        order.isDelivered = true; // 주문 배달 상태변경
        await order.save(); // 주문 정보 저장

        // 사장님 포인트로 입금
        const owner = await Owners.findOne({ where: { ownerId: ownerId } });
        if (!owner) return res.status(400).json({ message: '해당하는 사용자가 없습니다.' });

        const totalPrice = order.totalPrice;
        owner.point += totalPrice; // 주문 금액을 사장님 포인트에 추가
        await owner.save(); // 사장 정보 저장

        return res.json({
          message: '배달 완료 처리되었습니다.',
          storeName: order.Store.storeName,
          userId: order.UserId,
        });
      } else {
        return res.status(400).json({ message: '이미 배달이 완료된 주문입니다.' });
      }
    }
  } catch (error) {
    res.status(400).json({ errorMessage: error.message });
  }
});

module.exports = router;
