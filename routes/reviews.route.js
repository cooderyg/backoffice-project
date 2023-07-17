const express = require('express');
const router = express.Router();
const { orders, reviews } = require('../models');

router.post('/api/orders/order_id/review', async (req, res) => {
  try {
    const { order_id } = req.params;
    const { comment } = req.body;
    const { id } = res.locals.user;

    const review = await reviews.create({
      reviewId: id,
      OrderId: order_id,
      comment: comment,
      rating: rate,
    });
  } catch (error) {
    res.status(400).json({ errorMessage: error.message });
  }
});

// 리뷰 사진 첨부

// 리뷰 목록 조회
router.get('/api/users/user_id/review', async (req, res) => {
  const { user_id } = req.params;

  try {
    const reviews = await reviews.findAll({
      attributes: ['reviewId', 'rating', 'comment', 'imageUrl'],
      include: [{}],
      where: { UserId: user_id },
    });
  } catch (error) {
    res.status(400).json({ errorMessage: error.message });
  }
});

module.exports = router;
