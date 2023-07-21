const ReviewsService = require('../services/reviews.service');

class ReviewsController {
  reviewsService = new ReviewsService();

  createReview = async (req, res, next) => {
    const { orderId } = req.params;
    const { rating, comment } = req.body;
    const { userId } = res.locals.user;

    try {
      const createReviewData = await this.reviewsService.createReview(
        orderId,
        rating,
        comment,
        userId,
      );

      res.status(201).json({ data: createReviewData });
    } catch (error) {
      res.status(401).json({ message: error.message });
    }
  };
  getReviews = async (req, res, next) => {
    const { userId } = req.params;
    const reviews = await this.reviewsService.findAllReview(userId);

    res.status(200).json({ data: reviews });
  };

  updateReview = async (req, res, next) => {
    try {
      const { reviewId } = req.params;
      const { comment } = req.body;

      const updateReview = await this.reviewsService.updateReview(reviewId, comment);

      res.status(200).json({ data: updateReview });
    } catch (error) {
      res.status(401).json({ message: error.message });
    }
  };

  deleteReview = async (req, res, next) => {
    const { reviewId } = req.params;

    const deleteReview = await this.reviewsService.deleteReview(reviewId);

    res.status(200).json({ message: '리뷰가 삭제되었습니다.' });
  };
}

module.exports = ReviewsController;
