const OrdersService = require('../services/orders.service');
// const { orders } = require('../models');

class OrdersController {
  ordersService = new OrdersService();

  createOrder = async (req, res) => {
    const { userId, address, point } = res.locals.user;
    const { menus, storeId } = req.cookies;
    const { totalPrice } = req.body;

    try {
      const order = await this.ordersService.createOrder({
        userId,
        address,
        menus,
        storeId,
        totalPrice,
        point,
      });
      return res
        .status(200)
        .json({ message: '주문이 성공적으로 완료되었습니다.', orderId: order.orderId });
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
    const { orderId } = req.params;

    try {
      const order = await this.ordersService.getOrderForOwner(orderId);

      if (!order) {
        return res.status(404).json({ message: '주문서를 찾을 수 없습니다.' });
      }

      // const order_results = [
      //   {
      //     isDelivered: orders.isDelivered,
      //     orderId: orders.orderId,
      //     address: orders.address,
      //     phoneNumber: orders.User.phoneNumber,
      //     orderId: orders.orderId,
      //   },
      // ];

      // res.status(200).json({ order_results });

      // 오너를 확인하고, 주문이 해당 오너의 가게에 속해있는지 검사
      const owner = res.locals.owner;
      const storeId = order.StoreId;

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
}

module.exports = OrdersController;
