const express = require('express');
const router = express.Router();
const { orders, reviews, stores } = require('../models');

router.post('/orders/:orderId/reviews', async (req, res) => {
  try {
    const { orderId } = req.params;
    const { comment } = req.body;
    const { id } = res.locals.user;

    const review = await reviews.create({
      reviewId: id,
      OrderId: orderId,
      comment: comment,
      rating: rate,
    });
    if (!comment) {
      return res.status(400).json({ message: '리뷰 내용을 입력해주세요.' });
    } else {
      res.status(200).json({ message: '리뷰를 생성하였습니다.' });
    }
  } catch (error) {
    res.status(400).json({ errorMessage: error.message });
  }
});

// 리뷰 목록 조회
router.get('/users/:userId/reviews', async (req, res) => {
  const { userId } = req.params;

  try {
    const reviews = await reviews.findAll({
      attributes: ['reviewId', 'UserId', 'OrderId', 'rating', 'comment', 'imageUrl'],
      include: [
        {
          model: orders,
          as: 'orders',
          include: [
            {
              model: stores,
              as: 'stores',
              attributes: ['storeName'],
              include: [{ model: menus, as: 'menus', attributes: ['menuName'] }],
            },
          ],
        },
      ],
      where: { UserId: userId },
      order: [['createdAt', 'DESC']],
    });

    if (!reviews) {
      return res.status(400).json({ message: '작성한 리뷰가 없습니다.' });
    }
    if (reviews) {
      return res.status(200).json({ data: reviews });
    }
  } catch (error) {
    res.status(400).json({ errorMessage: error.message });
  }
});

// 리뷰 수정
router.put('/users/:userId/reviews/:reviewId', async (req, res) => {
  const { reviewId } = req.params;
  const { rating, comment } = req.body;

  try {
    const review = await reviews.findOne({
      where: { reviewId },
    });
    if (!review) {
      return res.status(400).json({ message: '존재하지 않는 리뷰입니다.' });
    }
    if (review) {
      if (!comment) {
        return res.status(412).json({ message: '리뷰 내용을 입력해주세요.' });
      } else {
        await reviews.update({ rating, comment }, { where: { reviewId: reviewId } });
        res.status(201).json({ message: '리뷰가 정상적으로 수정되었습니다.' });
      }
    }
  } catch (error) {
    res.status(400).json({ errorMessage: error.message });
  }
});

// 리뷰 삭제
router.delete('/users/:userId/reviews/:reviewId', async (req, res) => {
  const { reviewId } = req.params;
  const review = await reviews.findOne({
    where: { reviewId },
  });
  if (!review) {
    return res.status(400).json({ message: '존재하지 않는 리뷰입니다.' });
  }
  if (review) {
    await reviews.destroy({ where: { reviewId: reviewId } });
    res.status(201).json({ message: '리뷰가 정상적으로 삭제되었습니다.' });
  }
});

module.exports = router;
