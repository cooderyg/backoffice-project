const OrdersService = require('../services/orders.service');

class OrdersController {
  ordersService = new OrdersService();

  async createOrder(req, res) {
    const { userId } = res.locals.user;
    const { storeId, orderData } = req.body;

    try {
      const order = await ordersService.createOrder(userId, storeId, orderData);
      return res.status(201).json({ message: '주문서 작성에 성공하였습니다.', order });
    } catch (error) {
      console.error(error);
      return res.status(400).json({ errorMessage: error.message });
    }
  }

  async getOrder(req, res) {
    const { orderId } = req.params;

    try {
      const order = await ordersService.getOrder(orderId);

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
    const { userId } = res.locals.user;
    const { orderData } = req.body;

    try {
      const order = await ordersService.updateOrder(orderId, orderData);

      if (!order) {
        return res.status(404).json({ message: '주문서를 찾을 수 없습니다.' });
      }

      return res.status(200).json({ message: '주문서가 수정되었습니다.', order });
    } catch (error) {
      console.error(error);
      return res.status(400).json({ errorMessage: '주문서 수정에 실패하였습니다.' });
    }
  }

  async deleteOrder(req, res) {
    const { orderId } = req.params;
    const { userId } = res.locals.user;

    try {
      const success = await ordersService.deleteOrder(orderId);

      if (!success) {
        return res.status(404).json({ message: '주문서를 찾을 수 없습니다.' });
      }

      return res.status(200).json({ message: '주문서가 삭제되었습니다.' });
    } catch (error) {
      console.error(error);
      return res.status(400).json({ errorMessage: '주문서 삭제에 실패하였습니다.' });
    }
  }
}

module.exports = OrdersController;
