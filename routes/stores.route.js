const express = require('express');
const router = express.Router();
const authMiddleware = require('../middlewares/auth-middleware');

const StoreController = require('../controllers/stores.controller');
const storeController = new StoreController();

//auth-middleware 있다 치자.
// 사장님의 ownerId를 전달하는 미들웨어를 등록, 수정 , 삭제에 넣는다.

// 가게 등록
router.post('/stores', authMiddleware, storeController.postStore);

// 가게 정보 조회 in 가게 관리 (for Owner)
router.get('/stores', authMiddleware, storeController.getStoreByOwnerId);

// 가게 정보 수정
router.put('/stores/:storeId', authMiddleware, storeController.updateStore);

// 가게 삭제
router.delete('/stores/:storeId', authMiddleware, storeController.deleteStore);

// 가게 검색
router.get('/stores/search', storeController.searchStores);

router.get('/stores/all', storeController.getAllStores);

// 가게 정보 조회
router.get('/stores/:storeId', storeController.getStoreByStoreId);

// 가게 카테고리로 조회
router.get('/stores/categories/:categoryId', storeController.getStoresByCategoryId);

module.exports = router;
