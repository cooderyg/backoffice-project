const express = require('express');
const router = express.Router();

router.get('/', (req, res) => {
  return res.render('index');
});

router.get('/payment', (req, res) => {
  return res.render('payment');
});

router.get('/login', (req, res) => {
  return res.render('login');
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

module.exports = router;
