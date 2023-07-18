const express = require('express');
const router = express.Router();
const { users, orders, ordermenus, menus, stores } = require('../models');
const authMiddleware = require('../middlewares/validations/signup.validation.js');

// 게시글 작성 api (authMiddleware: 사용자 인증)
router.post('/orders/:user_id', authMiddleware, async (req, res) => {
  //게시글을 생성하는 사용자의 정보를 가지고 올 것.
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
  const Orders = await orders.findOne({ where: user_id });

  try {
    //유효성 검사
    //인증된 사용자인지
    if (!res.locals.user) {
      return res.status(403).json({ errorMessage: '로그인이 필요한 기능입니다.' });
    }

    // 새로운 게시물 생성
    const createOrders = await Orders.create({
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
    });

    return res.status(201).json({ data: '주문서 작성에 성공하였습니다.' });
  } catch (error) {
    console.error(error);

    // 예외 종류에 따라 에러 메시지 설정
    if (error.name === 'JsonWebTokenError' || error.name === 'TokenExpiredError') {
      return res.status(403).json({ errorMessage: '전달된 쿠키에서 오류가 발생하였습니다.' });
    }

    return res.status(400).json({ errorMessage: '주문서 작성에 실패하였습니다.' });
  }
});

// 주문서 상세 조회 api
router.get('/orders/:user_id', async (req, res) => {
  try {
    const { orders_id } = req.params;
    const orders = await orders.findOne({
      attributes: [
        address,
        phone_number,
        isDelivered,
        storeName,
        menuName,
        price,
        quantity,
        total_price,
        createdAt,
      ],
      where: { orders_id },
    });
    if (orders.length !== 0) {
      const results = orders;
      res.status(200).json({ results });
    }
    // return res.status(200).json({ message: "주문서 조회에 성공하였습니다." });
  } catch (error) {
    console.error(error);
    return res.status(400).json({ errorMessage: '주문서 조회에 실패하였습니다.' });
  }
});

// 주문서 수정 api
router.put('/orders/:user_id', authMiddleware, async (req, res) => {
  const { orders_id } = req.params;
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
    // 수정할 게시글 조회
    const Orders = await orders.findOne({ where: { orders_id } });
    // 게시글이 존재하지 않을 경우 또는 유저아이디가 맞지 않을 경우 에러 메시지를 보냄
    if (!Orders) {
      return res.status(404).json({ message: '게시글이 존재하지 않습니다.' });
    } else if (post.User_id !== user_id) {
      return res.status(401).json({ message: '권한이 없습니다.' });
    }
    // 게시글의 권한을 확인, 게시글을 수정
    await orders.update(
      { address, phone_number, isDelivered, storeName, menuName, price, quantity, total_price },
      {
        where: {
          [Op.and]: [{ orders_id }, { User_id: user_id }],
        },
      },
    );
    return res.status(200).json({ message: '게시글이 수정되었습니다.' });
  } catch (error) {
    console.error(error);
    if (error.name === 'JsonWebTokenError' || error.name === 'TokenExpiredError') {
      return res.status(403).json({ errorMessage: '전달된 쿠키에서 오류가 발생하였습니다.' });
    }

    return res.status(400).json({ errorMessage: '게시글 작성에 실패하였습니다.' });
  }
});

// 주문서 삭제
router.delete('/orders/:user_id', authMiddleware, async (req, res) => {
  const { orders_id } = req.params;
  const { user_id } = res.locals.user;
  try {
    // 삭제할 게시글 조회
    const order = await orders.findOne({ where: { orders_id } });

    if (!order) {
      return res.status(404).json({ message: '게시글이 존재하지 않습니다.' });
    } else if (post.User_id !== user_id) {
      return res.status(401).json({ message: '권한이 없습니다.' });
    }

    // 게시글 삭제 권한을 확인, 게시글 삭제
    await orders.destroy({
      where: {
        [Op.and]: [{ orders_id }, { User_id: user_id }],
      },
    });
    return res.status(200).json({ data: '게시글이 삭제되었습니다.' });
  } catch (error) {
    console.error(error);
    if (error.name === 'JsonWebTokenError' || error.name === 'TokenExpiredError') {
      return res.status(403).json({ errorMessage: '전달된 쿠키에서 오류가 발생하였습니다.' });
    }

    return res.status(400).json({ errorMessage: '게시글 삭제에 실패하였습니다.' });
  }
});

module.exports = router;
