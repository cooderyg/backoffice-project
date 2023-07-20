const express = require('express');
const router = express.Router();
const authMiddleware = require('../middlewares/auth-middleware');

const MenuController = require('../controllers/menus.controller');
const menuController = new MenuController();

// 메뉴 등록
router.post('/stores/:storeId/menus', authMiddleware, menuController.postMenu);

// 메뉴 목록 조회
router.get('/stores/:storeId/menus', menuController.getMenu);

// 메뉴 하나 조회
router.get('/stores/:storeId/menus/:menuId', menuController.getOneMenu);

// 메뉴 수정
router.put('/stores/:storeId/menus/:menuId', authMiddleware, menuController.updateMenu);

// 메뉴 삭제
router.delete('/stores/:storeId/menus/:menuId', authMiddleware, menuController.deleteMenu);

//🔴 메뉴 id별로 조회
router.get('/carts/menus', menuController.getMenus);

module.exports = router;
