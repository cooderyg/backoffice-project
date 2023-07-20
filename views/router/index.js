const express = require('express');
const router = express.Router();
const authMiddleware = require('../../middlewares/auth-middleware');

router.get(
  '/',
  (req, res, next) => {
    // 토큰 존재하면 미들웨어를 실행
    if (req.cookies.accessToken && req.cookies.refreshToken) {
      authMiddleware(req, res, next); // authMiddleware 실행
    } else {
      next();
    }
  },
  (req, res) => {
    return res.render('index');
  },
);

router.get('/login', (req, res) => {
  return res.render('auth');
});

router.get('/payment', (req, res) => {
  return res.render('payment');
});

router.get('/detail', (req, res) => {
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
router.get('/menu_management/store=:storeId', (req, res) => {
  const { storeId } = req.params;
  return res.render('menu_management', { storeId });
});

// 가게 등록
router.get('/store_registration', (req, res) => {
  const { storeId } = req.params;
  return res.render('store_registration', { storeId });
});

// 가게 정보 수정
router.get('/store_modification', (req, res) => {
  const { storeId } = req.params;
  return res.render('store_modification', { storeId });
});

// 리뷰 작성
router.get('/reviewWrite', (req, res) => {
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
module.exports = router;
