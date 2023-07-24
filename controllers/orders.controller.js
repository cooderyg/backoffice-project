const OrdersService = require('../services/orders.service');
// const { orders } = require('../models');

class OrdersController {
  ordersService = new OrdersService();

  createOrder = async (req, res) => {
    const { userId, address, point } = res.locals.user;
    const { menus, storeId } = req.cookies;
    const { totalPrice } = req.body;

    try {
      const { order, store } = await this.ordersService.createOrder({
        userId,
        address,
        menus,
        storeId,
        totalPrice,
        point,
      });
      return res.status(200).json({
        message: '주문이 성공적으로 완료되었습니다.',
        order,
        ownerId: store.OwnerId,
      });
    } catch (error) {
      console.error(error);
      return res.status(400).json({ errorMessage: error.message });
    }
  };

  //유저 주문서 확인
  getOrder = async (req, res) => {
    const orderId = +req.params.orderId;

    try {
      const order = await this.ordersService.getOrder(orderId);

      if (!order) {
        return res.status(404).json({ message: '주문서를 찾을 수 없습니다.' });
      }

      return res.status(200).json({ order });
    } catch (error) {
      console.error(error);
      return res.status(400).json({ errorMessage: '주문서 조회에 실패하였습니다.' });
    }
  };

  //소프트 딜리트
  deleteOrder = async (req, res) => {
    const { orderId } = req.params;

    try {
      const order = await this.ordersService.getOrder(orderId);

      if (!order) {
        return res.status(404).json({ message: '주문서를 찾을 수 없습니다.' });
      }

      await this.ordersService.softDeleteOrder(orderId);

      return res.status(200).json({ message: '주문서가 성공적으로 삭제되었습니다.' });
    } catch (error) {
      console.error(error);
      return res.status(400).json({ errorMessage: '주문서 삭제에 실패하였습니다.' });
    }
  };

  //오너 주문서 확인
  getOrderForOwner = async (req, res) => {
    // const { orderId } = req.params;
    const { ownerId } = res.locals.owner;
    try {
      const order = await this.ordersService.getOrderForOwner(ownerId);

      if (!order) {
        return res.status(404).json({ message: '주문서를 찾을 수 없습니다.' });
      }

      // 오너를 확인하고, 주문이 해당 오너의 가게에 속해있는지 검사
      // const storeId = order.StoreId;

      // if (owner.ownerId !== ownerId) {
      //   return res.status(403).json({ message: '해당 주문서에 접근할 수 없습니다.' });
      // }

      return res.status(200).json({ order });
    } catch (error) {
      console.error(error);
      console.log(error);
      return res.status(400).json({ errorMessage: '주문서 조회에 실패하였습니다.' });
    }
  };

  getOrderForUser = async (req, res) => {
    const { userId } = res.locals.user;
    try {
      const data = await this.ordersService.getOrderForUser({ userId });
      res.status(200).json({ data });
    } catch (error) {
      console.log(error.message);
      return res.status(500).json({ message: error.message });
    }
  };

  //오너 주문서 상세조회
  getOwnerOrderDetails = async (req, res) => {
    const { orderId } = req.params;

    try {
      // 오더 서비스를 통해 오더와 오너 정보를 조회합니다
      const order = await orderService.getOrderForOwner(orderId);

      if (!order) {
        return res.status(404).json({ message: '주문서를 찾을 수 없습니다.' });
      }

      // 주문서에 포함된 가게의 ownerId를 기반으로 오너 정보를 조회합니다
      const owner = await orderService.getOwnerById(order.Store.OwnerId);

      // 주문서와 오너 정보를 합쳐서 응답 객체를 생성합니다
      const orderResult = {
        orderId: order.orderId,
        isDelivered: order.isDelivered,
        orderAddress: order.address,
        orderPhoneNumber: order.User.phoneNumber,
        storeName: order.Store.storeName,
        owner: owner,
      };

      return res.status(200).json({ order: orderResult });
    } catch (error) {
      console.error(error);
      return res.status(400).json({ errorMessage: '오너의 상세정보 조회에 실패하였습니다.' });
    }
  };
}

module.exports = OrdersController;
