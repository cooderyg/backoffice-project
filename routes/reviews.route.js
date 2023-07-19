const express = require('express');
const router = express.Router();
const authMiddleware = require('../middlewares/auth-middleware');

const ReviewsController = require('../controllers/reviews.controller');
const reviewsController = new ReviewsController();

router.post('/orders/:orderId/reviews', authMiddleware, reviewsController.createReview);
router.get('/users/:userId/reviews', authMiddleware, reviewsController.getReviews);
router.put('/users/:userId/reviews/:reviewId', authMiddleware, reviewsController.updateReview);
router.delete('/users/:userId/reviews/:reviewId', authMiddleware, reviewsController.deleteReview);

module.exports = router;
