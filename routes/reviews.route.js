const express = require('express');
const router = express.Router();
const authMiddleware = require('../middlewares/auth-middleware');

const ReviewsController = require('../controllers/reviews.controller');
const reviewsController = new ReviewsController();

router.post('/orders/:orderId/reviews', reviewsController.createReview);
router.get('/users/:userId/reviews', reviewsController.getReviews);
router.put('/users/:userId/reviews/:reviewId', reviewsController.updateReview);
router.delete('/users/:userId/reviews/:reviewId', reviewsController.deleteReview);

module.exports = router;
