const express = require('express');
const router = express.Router();
const authMiddleware = require('../../middlewares/auth-middleware');

const tokenMiddleware = (req, res, next) => {
  // 토큰 존재하면 미들웨어를 실행
  if (req.cookies.accessToken && req.cookies.refreshToken) {
    authMiddleware(req, res, next);
  } else {
    next();
  }
};

router.use('/', tokenMiddleware);

router.get('/', (req, res) => {
  return res.render('index');
});

router.get('/search', (req, res) => {
  const searchString = req.query.searchString;
  const searchStringByCategoryId = req.query.searchStringByCategoryId;

  return res.render('search', { searchString, searchStringByCategoryId });
});

router.get('/login', (req, res) => {
  return res.render('auth');
});

router.get('/point-payment', (req, res) => {
  return res.render('point-payment');
});

router.get('/detail/:storeId', (req, res) => {
  return res.render('detail');
});

// 가게 관리
router.get('/store_management', tokenMiddleware, (req, res) => {
  return res.render('store_management');
});

// 주문 확인
router.get('/order_check', (req, res) => {
  return res.render('order_check');
});

// 메뉴 관리
router.get('/menu_management/stores/:storeId', (req, res) => {
  const { ownerId } = res.locals.owner;
  return res.render('menu_management', { ownerId });
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

// 리뷰 작성 페이지
router.get('/reviewWrite', (req, res) => {
  const { orderId } = req.query;
  return res.render('reviewWrite', { orderId });
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

//사장 조회
router.get('/owners/orders/:ownerId', (req, res) => {
  return res.render('owner-order');
});

//사장 상세 조회
router.get('/owner/orders/:orderId', (req, res) => {
  return res.render('order-check');
});

// 사용자 주문 목록 조회
router.get('/user/orders', (req, res) => {
  return res.render('user-orders-check');
});
router.get('/orders/complete/:orderId', (req, res) => {
  const { orderId } = req.query;
  return res.render('order-complete', { orderId });
});

module.exports = router;
