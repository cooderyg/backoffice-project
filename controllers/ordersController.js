const OrdersService = require('../services/ordersService');

const ordersService = new OrdersService();

async function createOrder(req, res) {
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
    // 주문 생성
    const order = await ordersService.createOrder(user_id, {
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

    return res.status(201).json({ message: '주문서 작성에 성공하였습니다.', order });
  } catch (error) {
    console.error(error);
    return res.status(400).json({ errorMessage: error.message });
  }
}

async function getOrder(req, res) {
  const { orderId } = req.params;

  try {
    // 주문 조회
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

async function updateOrder(req, res) {
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
    // 주문 수정
    const order = await ordersService.updateOrder(orderId, {
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
    return res.status(400).json({ errorMessage: '주문서 수정에 실패하였습니다.' });
  }
}

async function deleteOrder(req, res) {
  const { orderId } = req.params;
  const { user_id } = res.locals.user;

  try {
    // 주문 삭제
    await ordersService.deleteOrder(orderId);

    return res.status(200).json({ message: '주문서가 삭제되었습니다.' });
  } catch (error) {
    console.error(error);
    return res.status(400).json({ errorMessage: '주문서 삭제에 실패하였습니다.' });
  }
}

module.exports = {
  createOrder,
  getOrder,
  updateOrder,
  deleteOrder,
};
