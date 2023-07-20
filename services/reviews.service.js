const ReviewsRepository = require('../repositories/reviews.repository');

class ReviewsService {
  reviewsRepository = new ReviewsRepository();

  createReview = async (orderId, comment, userId) => {
    const createReviewData = await this.reviewsRepository.createReview(orderId, comment, userId);
    if (!comment) throw new Error('리뷰 내용을 입력해주세요.');
    return { createReviewData };
  };

  findAllReview = async (userId) => {
    const allReviews = await this.reviewsRepository.findAllReview(userId);

    allReviews.sort((a, b) => {
      return b.createdAt - a.createdAt;
    });

    return allReviews.map((review) => {
      return {
        reviewId: review.id,
        UserId: review.UserId,
        OrderId: review.OrderId,
        rating: review.rating,
        comment: review.comment,
        imageUrl: review.imageUrl,
      };
    });
  };

  updateReview = async (reviewId, comment) => {
    const findReview = await this.reviewsRepository.findReviewById(reviewId);
    if (!findReview) throw new Error("Review doesn't exist");
    if (findReview) {
      if (!comment) throw new Error('리뷰 내용을 입력해주세요.');
    }
    await this.reviewsRepository.updateReview(reviewId, rating, comment);

    const updateReview = await this.reviewsRepository.findReviewById(reviewId);

    return {
      reviewId: updateReview.id,
      UserId: updateReview.UserId,
      OrderId: updateReview.OrderId,
      rating: updateReview.rating,
      comment: updateReview.comment,
      imageUrl: updateReview.imageUrl,
    };
  };

  deleteReview = async (reviewId) => {
    const findReview = await this.reviewsRepository.findReviewById(reviewId);
    if (!findReview) throw new Error("Review doesn't exist");

    await this.reviewsRepository.deleteReview(reviewId);

    return true;
  };
}

module.exports = ReviewsService;
