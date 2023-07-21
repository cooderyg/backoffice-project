const { Reviews, Orders, Stores, Ordermenus, Menus, sequelize, Sequelize } = require('../models');

class ReviewsRepository {
  createReview = async (orderId, rating, comment, userId) => {
    const createReviewData = await Reviews.create({
      OrderId: orderId,
      rating,
      comment,
      UserId: userId,
    });

    return createReviewData;
  };

  findAllReview = async (userId) => {
    const query = `
      SELECT
        r.reviewId,
        r.UserId,
        r.OrderId,
        r.rating,
        r.comment,
        r.imageUrl,
        s.storeName,
        m.menuName
      FROM Reviews r
      LEFT JOIN Orders o ON r.OrderId = o.orderId
      LEFT JOIN Stores s ON o.StoreId = s.storeId
      LEFT JOIN OrderMenus om ON o.orderId = om.OrderId
      LEFT JOIN Menus m ON om.MenuId = m.menuId
      WHERE r.UserId = :userId
    `;

    const reviews = await sequelize.query(query, {
      type: Sequelize.QueryTypes.SELECT,
      replacements: { userId: userId },
    });

    return reviews;
  };

  findReviewById = async (reviewId) => {
    const review = await Reviews.findByPk(reviewId);

    return review;
  };

  updateReview = async (reviewId, comment) => {
    const updateReviewData = await Reviews.update({ reviewId, comment }, { where: { reviewId } });

    return updateReviewData;
  };

  deleteReview = async (reviewId) => {
    const deleteteReviewData = await Reviews.destroy({
      where: { reviewId },
    });

    return deleteteReviewData;
  };
}

module.exports = ReviewsRepository;
