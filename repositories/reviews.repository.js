const { Reviews, Orders, Stores, Ordermenus, Menus } = require('../models');

class ReviewsRepository {
  createReview = async (orderId, comment, userId) => {
    const createReviewData = await Reviews.create({
      orderId,
      comment,
      userId,
    });

    return createReviewData;
  };

  findAllReview = async (userId) => {
    return await Reviews.findAll({
      attributes: ['reviewId', 'UserId', 'OrderId', 'rating', 'comment', 'imageUrl'],
      // include: [
      //   {
      //     model: Orders,
      //     as: 'orders',
      //     include: [
      //       {
      //         model: Stores,
      //         as: 'stores',
      //         attributes: ['storeName'],
      //         include: [
      //           {
      //             model: Ordermenus,
      //             as: 'ordermenus',
      //             include: [{ model: Menus, as: 'menus', attributes: ['menuName'] }],
      //           },
      //         ],
      //       },
      //     ],
      //   },
      // ],
      where: { UserId: userId },
    });
  };

  findReviewById = async (reviewId) => {
    const review = await Reviews.findByPk(reviewId);

    return review;
  };

  updateReview = async (reviewId, rating, comment) => {
    const updateReviewData = await Reviews.update(
      { reviewId, rating, comment },
      { where: { id: reviewId } },
    );

    return updateReviewData;
  };

  deleteReview = async (reviewId) => {
    const deleteteReviewData = await Reviews.destroy({
      where: { id: commentId },
    });

    return deleteteReviewData;
  };
}

module.exports = ReviewsRepository;
