const StoreService = require('../services/stores.service');

class StoreController {
  storeService = new StoreService();

  // 가게 정보 조회
  getStore = async (req, res) => {
    // const { ownerId } = res.locals.owner;
    const ownerId = 1;

    try {
      const store = await this.storeService.findStoreByOwnerId(ownerId);
      res.json({ store });
    } catch (e) {
      if (e.errorCode) return res.status(e.errorCode).json(e.message);

      res.status(500).json({ message: '게시글 조회에 실패했습니다.' });
    }
  };

  // 가게 정보 등록
  postStore = async (req, res) => {
    // const { ownerId } = res.locals.owner;
    const ownerId = 11;
    const { categoryId, storeName, address, storeImageUrl, isOpen } = req.body;

    try {
      const existStore = await this.storeService.findStoreByOwnerId(ownerId);
      if (existStore) {
        return res.status(400).json({ errorMessage: '이미 등록된 가게가 있습니다.' });
      }

      const store = await this.storeService.createStore(
        ownerId,
        categoryId,
        storeName,
        address,
        storeImageUrl,
        isOpen,
      );

      // res.json({ message: '가게가 등록되었습니다.' });
    } catch (error) {
      if (e.errorCode) return res.status(e.errorCode).json(e.message);

      res.status(500).json({ message: '게시글 조회에 실패했습니다.' });
    }
  };

  updateStore = async (req, res) => {};

  deleteStore = async (req, res) => {};
}
module.exports = StoreController;
