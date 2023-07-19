const { Op } = require('sequelize');
const { orders, users } = require('../models');

class OrdersService {
  async createOrder(userId, orderData) {
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
    } = orderData;

    try {
      // 트랜잭션 시작
      const t = await sequelize.transaction();

      try {
        // 잔여 포인트 조회
        const user = await users.findOne({ where: { user_id: userId } });
        const remainingPoints = user.point;

        // 메뉴 가격과 잔여 포인트 비교
        if (remainingPoints < price) {
          throw new Error('포인트가 부족하여 주문할 수 없습니다.');
        }

        // 주문 생성
        const order = await orders.create(
          {
            User_id: userId,
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
          { where: { user_id: userId }, transaction: t },
        );

        // 트랜잭션 커밋
        await t.commit();

        return order;
      } catch (error) {
        // 트랜잭션 롤백
        await t.rollback();
        throw error;
      }
    } catch (error) {
      console.error(error);
      throw error;
    }
  }

  async getOrder(orderId) {
    try {
      const order = await orders.findOne({ where: { orderId } });
      return order;
    } catch (error) {
      console.error(error);
      throw error;
    }
  }

  async updateOrder(orderId, orderData) {
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
    } = orderData;

    try {
      // 수정할 주문서 조회
      const order = await orders.findOne({ where: { orderId } });

      if (!order) {
        throw new Error('주문서를 찾을 수 없습니다.');
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

      return order;
    } catch (error) {
      console.error(error);
      throw error;
    }
  }

  async deleteOrder(orderId) {
    try {
      // 삭제할 주문서 조회
      const order = await orders.findOne({ where: { orderId } });

      if (!order) {
        throw new Error('주문서를 찾을 수 없습니다.');
      }

      // 주문서 삭제
      await order.destroy();

      return true;
    } catch (error) {
      console.error(error);
      throw error;
    }
  }
}

module.exports = OrdersService;
