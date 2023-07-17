const StoreRepository = require('../repositories/stores.repository');

class StoreService {
  storeRepository = new StoreRepository();

  // 에러
  /**
   * # 404  조회할 가게가 존재하지 않는경우
      {"errorMessage": "가게가 존재하지 않습니다."}

      # 412 body 데이터가 정상적으로 전달되지 않는 경우
      {"errorMessage": "데이터 형식이 올바르지 않습니다."}

      # 403 Cookie가 존재하지 않을 경우
      {"errorMessage": "로그인이 필요한 기능입니다."}
      # 403 Cookie가 비정상적이거나 만료된 경우
      {"errorMessage": "전달된 쿠키에서 오류가 발생하였습니다."}
   */
  findStoreByOwnerId = async (ownerId) => {
    if (!ownerId) throw { errorCode: 412, message: 'Invalid data' };

    const store = await this.storeRepository.findStoreByOwnerId(ownerId);
    if (!store) throw { errorCode: 404, message: 'Store not exist' };
  };

  /*  
    # 412 body 데이터가 정상적으로 전달되지 않는 경우
    {"errorMessage": "데이터 형식이 올바르지 않습니다."}
    # 403 Cookie가 존재하지 않을 경우
    {"errorMessage": "로그인이 필요한 기능입니다."}
    # 403 Cookie가 비정상적이거나 만료된 경우
    {"errorMessage": "전달된 쿠키에서 오류가 발생하였습니다."}
  */
  createStore = async (ownerId, categoryId, storeName, address, storeImageUrl, isOpen) => {
    if (!ownerId || !categoryId || !storeName || !address || !storeImageUrl || !isOpen)
      throw { errorCode: 412, message: 'Invalid data' };

    const store = await this.storeRepository.createStore(
      ownerId,
      categoryId,
      storeName,
      address,
      storeImageUrl,
      isOpen,
    );
    return store;
  };

  updateStore = async (req, res) => {};

  deleteStore = async (req, res) => {};
}
module.exports = StoreService;
