const express = require('express');
const router = express.Router();
const authMiddleware = require('../../middlewares/auth-middleware');

router.get(
  '/',
  (req, res, next) => {
    // 토큰 존재하면 미들웨어를 실행
    if (req.cookies.accessToken && req.cookies.refreshToken) {
      authMiddleware(req, res, next);
    } else {
      next();
    }
  },
  (req, res) => {
    return res.render('index');
  },
);

router.get('/search', (req, res) => {
  const searchString = req.query.searchString;
  const searchStringByCategoryId = req.query.searchStringByCategoryId;

  return res.render('search', { searchString, searchStringByCategoryId });
});

router.get('/login', (req, res) => {
  return res.render('auth');
});

router.get('/payment', (req, res) => {
  return res.render('payment');
});

router.get('/detail/:storeId', (req, res) => {
  return res.render('detail');
});

// 가게 관리
router.get('/store_management', (req, res) => {
  return res.render('store_management');
});

// 주문 확인
router.get('/order_check', (req, res) => {
  return res.render('order_check');
});

// 메뉴 관리
router.get('/menu_management/stores/:storeId', (req, res) => {
  return res.render('menu_management');
});

// 메뉴 관리 - 메뉴 추가
router.get('/menu_management/stores/:storeId/menu_registration', (req, res) => {
  return res.render(`menu_registration`);
});
// 메뉴 관리 - 메뉴 수정
router.get('/menu_management/stores/:storeId/menu_modification/menus/:menuId', (req, res) => {
  return res.render(`menu_modification`);
});

// 가게 등록
router.get('/store_registration', (req, res) => {
  return res.render('store_registration');
});

// 가게 정보 수정
router.get(`/store_modification/stores/:storeId`, (req, res) => {
  return res.render('store_modification');
});

// 리뷰 작성
router.get('/reviewWrite', (req, res) => {
  // const { orderNumber, storeName, menuName } = req.query;
  return res.render('reviewWrite');
});

// 사용자 리뷰 조회
router.get('/reviewList', (req, res) => {
  return res.render('reviewList');
});

// 장바구니
router.get('/cart', (req, res) => {
  return res.render('cart');
});

router.get('/categories/:categoryId', (req, res) => {
  return res.render('category');
});

router.get('/owners/orders/:ownerId', (req, res) => {
  return res.render('owner-order');
});

// 사용자 주문 목록 조회
router.get('/user/orders', (req, res) => {
  return res.render('user-orders-check');
});
router.get('/orders/complete/:orderId', (req, res) => {
  return res.render('order-complete');
});

module.exports = router;
