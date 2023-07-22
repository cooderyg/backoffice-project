const { Op } = require('sequelize');
const { Orders, Users, Stores, Menus, OrderMenus, Owners, sequelize } = require('../models');

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
      console.log(order.orderId);
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
      const store = await Stores.findOne({
        where: { storeId: order.StoreId },
      });
      // 포인트 차감
      await Users.update({ point: point - totalPrice }, { where: { userId }, transaction: t });
      // 트랜잭션 커밋
      await t.commit();
      return { order, store };
    } catch (error) {
      // 트랜잭션 롤백
      await t.rollback();
      throw error;
    }
  };

  getOrder = async (orderId) => {
    const order = await Orders.findOne({
      where: {
        orderId,
      },
      include: [
        {
          model: Users,
          attributes: ['userName', 'address', 'phoneNumber'],
        },
        {
          model: Stores,
          attributes: ['storeName', 'OwnerId'],
        },
        {
          model: OrderMenus,
          attributes: ['quantity'],
          include: [
            {
              model: Menus,
            },
          ],
        },
      ],
    });

    if (!order) {
      throw new Error('주문서를 찾을 수 없습니다.');
    }
    return order;
  };

  async softDeleteOrder(orderId) {
    // 트랜잭션 시작
    const t = await sequelize.transaction();

    try {
      const order = await this.getOrder(orderId);

      if (!order) {
        throw new Error('주문서를 찾을 수 없습니다.');
      }

      // 주문을 소프트 딜리트로 표시
      await order.update({ deleted: true }, { transaction: t });

      // 트랜잭션 커밋
      await t.commit();
    } catch (error) {
      // 트랜잭션 롤백
      await t.rollback();
      throw error;
    }
  }

  //오너 검색
  async getOrder(orderId) {
    const order = await Orders.findByPk(orderId, {
      include: [
        {
          model: Users,
          attributes: ['userName', 'address', 'phoneNumber'],
        },
        {
          model: Stores,
          attributes: ['storeName'],
        },
        {
          model: Menus,
          attributes: ['menuName', 'price'],
          through: { attributes: ['quantity'] },
        },
      ],
    });

    if (!order) {
      throw new Error('주문서를 찾을 수 없습니다.');
    }

    return order;
  }

  getOrderForUser = async ({ userId }) => {
    return await Orders.findAll({
      where: { UserId: userId },
      attributes: ['orderId'],
      include: [
        {
          model: OrderMenus,
          attributes: ['quantity'],
          include: [
            {
              model: Menus,
              attributes: ['menuName'],
            },
          ],
        },
        {
          model: Stores,
          attributes: ['storeName'],
        },
      ],
    });
  };
}

module.exports = OrdersService;
