const { Op } = require('sequelize');
const { orders, users } = require('../models');

class OrdersController {
  async createOrder(req, res) {
    const { user_id } = res.locals.user;
    const {
      address,
      phone_number,
      isDelivered,
      storeName,
      menuName,
      price,
      quantity,
      total_price,
      createdAt,
    } = req.body;

    try {
      // 유효성 검사
      if (!res.locals.user) {
        return res.status(403).json({ errorMessage: '로그인이 필요한 기능입니다.' });
      }

      // 트랜잭션 시작
      const t = await sequelize.transaction();

      try {
        // 잔여 포인트 조회
        const user = await users.findOne({ where: { user_id } });
        const remainingPoints = user.point;

        // 메뉴 가격과 잔여 포인트 비교
        if (remainingPoints < price) {
          throw new Error('포인트가 부족하여 주문할 수 없습니다.');
        }

        // 주문 생성
        const order = await orders.create(
          {
            User_id: user_id,
            address,
            phone_number,
            isDelivered,
            storeName,
            menuName,
            price,
            quantity,
            total_price,
            createdAt,
          },
          { transaction: t },
        );

        // 포인트 차감
        await users.update(
          { point: remainingPoints - price },
          { where: { user_id }, transaction: t },
        );

        // 트랜잭션 커밋
        await t.commit();

        return res.status(201).json({ message: '주문서 작성에 성공하였습니다.', order });
      } catch (error) {
        // 트랜잭션 롤백
        await t.rollback();
        throw error;
      }
    } catch (error) {
      console.error(error);
      if (error.name === 'JsonWebTokenError' || error.name === 'TokenExpiredError') {
        return res.status(403).json({ errorMessage: '전달된 쿠키에서 오류가 발생하였습니다.' });
      }

      return res.status(400).json({ errorMessage: error.message });
    }
  }

  async getOrder(req, res) {
    try {
      const { orderId } = req.params;
      const order = await orders.findOne({ where: { orderId } });

      if (!order) {
        return res.status(404).json({ message: '주문서를 찾을 수 없습니다.' });
      }

      return res.status(200).json({ order });
    } catch (error) {
      console.error(error);
      return res.status(400).json({ errorMessage: '주문서 조회에 실패하였습니다.' });
    }
  }

  async updateOrder(req, res) {
    const { orderId } = req.params;
    const { user_id } = res.locals.user;
    const {
      address,
      phone_number,
      isDelivered,
      storeName,
      menuName,
      price,
      quantity,
      total_price,
      createdAt,
    } = req.body;

    try {
      // 수정할 주문서 조회
      const order = await orders.findOne({ where: { orderId, User_id: user_id } });

      if (!order) {
        return res.status(404).json({ message: '주문서를 찾을 수 없습니다.' });
      }

      // 주문서 수정
      await order.update({
        address,
        phone_number,
        isDelivered,
        storeName,
        menuName,
        price,
        quantity,
        total_price,
        createdAt,
      });

      return res.status(200).json({ message: '주문서가 수정되었습니다.', order });
    } catch (error) {
      console.error(error);
      if (error.name === 'JsonWebTokenError' || error.name === 'TokenExpiredError') {
        return res.status(403).json({ errorMessage: '전달된 쿠키에서 오류가 발생하였습니다.' });
      }

      return res.status(400).json({ errorMessage: '주문서 수정에 실패하였습니다.' });
    }
  }

  async deleteOrder(req, res) {
    const { orderId } = req.params;
    const { user_id } = res.locals.user;

    try {
      // 삭제할 주문서 조회
      const order = await orders.findOne({ where: { orderId, User_id: user_id } });

      if (!order) {
        return res.status(404).json({ message: '주문서를 찾을 수 없습니다.' });
      }

      // 주문서 삭제
      await order.destroy();

      return res.status(200).json({ message: '주문서가 삭제되었습니다.' });
    } catch (error) {
      console.error(error);
      if (error.name === 'JsonWebTokenError' || error.name === 'TokenExpiredError') {
        return res.status(403).json({ errorMessage: '전달된 쿠키에서 오류가 발생하였습니다.' });
      }

      return res.status(400).json({ errorMessage: '주문서 삭제에 실패하였습니다.' });
    }
  }
}

module.exports = OrdersController;
