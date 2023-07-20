const { Op } = require('sequelize');
const { Orders, Users, Stores, Menus, OrderMenus, sequelize } = require('../models');

class OrdersService {
  createOrder = async ({
    userId, //
    address,
    menus,
    storeId,
    totalPrice,
    point,
  }) => {
    // 트랜잭션 시작
    const t = await sequelize.transaction();

    try {
      // 메뉴 가격과 잔여 포인트 비교
      if (point < totalPrice) {
        throw new Error('포인트가 부족하여 주문할 수 없습니다.');
      }

      // 주문 생성
      const order = await Orders.create(
        {
          UserId: userId,
          StoreId: +storeId,
          address,
          totalPrice,
        },
        { transaction: t },
      );

      const temp = [];
      JSON.parse(menus).map((menu) => {
        temp.push({
          OrderId: order.orderId,
          MenuId: +menu.id,
          quantity: +menu.quantity,
        });
      });

      // 주문 메뉴 생성
      await OrderMenus.bulkCreate(temp, { transaction: t });

      // 포인트 차감
      await Users.update({ point: point - totalPrice }, { where: { userId }, transaction: t });

      // 트랜잭션 커밋
      await t.commit();

      return order;
    } catch (error) {
      // 트랜잭션 롤백
      await t.rollback();
      throw error;
    }
  };

  async getOrder(orderId) {
    try {
      const order = await Orders.findOne({
        where: { orderId },
        include: [
          {
            model: OrderMenus,
            include: [Menus],
          },
        ],
      });

      return order;
    } catch (error) {
      console.error(error);
      throw error;
    }
  }

  async updateOrder(orderId, orderData) {
    const { address, isDelivered, menuId, price, quantity, total_price } = orderData;

    try {
      // 수정할 주문서 조회
      const order = await Orders.findOne({ where: { orderId } });

      if (!order) {
        throw new Error('주문서를 찾을 수 없습니다.');
      }

      // 주문서 수정
      await order.update({
        address,
        isDelivered,
        totalPrice: total_price,
      });

      // 주문 메뉴 수정
      const orderMenu = await Ordermenus.findOne({ where: { OrderId: orderId } });

      if (!orderMenu) {
        throw new Error('주문 메뉴를 찾을 수 없습니다.');
      }

      await orderMenu.update({
        MenuId: menuId,
        quantity,
        price,
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
      const order = await Orders.findOne({ where: { orderId } });

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
