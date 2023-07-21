const StoreRepository = require('../repositories/stores.repository');

class StoreService {
  storeRepository = new StoreRepository();

  findStoreByOwnerId = async (ownerId) => {
    if (!ownerId) throw { errorCode: 412, message: 'Invalid data' };
    const store = await this.storeRepository.findStoreByOwnerId(ownerId);

    if (!store) throw { errorCode: 404, message: 'Store not exist' };
    return store;
  };

  findStoreByStoreId = async (storeId) => {
    if (!storeId) throw { errorCode: 412, message: 'Invalid data' };

    const store = await this.storeRepository.findStoreByStoreId(storeId);
    if (!store) throw { errorCode: 404, message: 'Store not exist' };
    return store;
  };

  createStore = async (ownerId, categoryId, storeName, address, imageUrl, isOpen) => {
    const existStore = await this.storeRepository.findStoreByOwnerId(ownerId);
    if (existStore) {
      throw { errorCode: 400, message: 'Store already exist' };
    }

    if (!ownerId || !categoryId || !storeName || !address || !imageUrl || !isOpen)
      throw { errorCode: 412, message: 'Invalid data' };

    await this.storeRepository.createStore(
      ownerId,
      categoryId,
      storeName,
      address,
      imageUrl,
      isOpen,
    );
  };

  updateStore = async (ownerId, storeId, storeName, CategoryId, address, imageUrl, isOpen) => {
    const store = await this.storeRepository.findStoreByStoreId(storeId);
    if (!store) {
      throw { errorCode: 404, message: 'Store not exist' };
    }

    if (!ownerId || !storeId || !storeName || !CategoryId || !address || !imageUrl || !isOpen) {
      throw { errorCode: 412, message: 'Invalid data' };
    }

    if (ownerId !== store.OwnerId) {
      throw { errorCode: 403, message: 'Unauthorized' };
    }

    await this.storeRepository.updateStore(
      storeId,
      storeName,
      CategoryId,
      address,
      imageUrl,
      isOpen,
    );
  };

  deleteStore = async (ownerId, storeId) => {
    const store = await this.storeRepository.findStoreByStoreId(storeId);
    if (!store) {
      throw { errorCode: 404, message: 'Store not exist' };
    }

    if (!ownerId || !storeId) {
      throw { errorCode: 412, message: 'Invalid data' };
    }

    if (ownerId !== store.OwnerId) {
      throw { errorCode: 403, message: 'Unauthorized' };
    }

    await this.storeRepository.deleteStore(storeId);
  };

  findStores = async (searchString) => {
    const stores = await this.storeRepository.findAllStoresByString(searchString);
    if (!stores) throw { errorCode: 404, message: 'Store not exist' };
    return stores;
  };

  findStoresByCategoryId = async (categoryId) => {
    const stores = await this.storeRepository.findStoresByCategoryId(categoryId);
    if (!stores) throw { errorCode: 404, message: 'Store not exist' };
    return stores;
  };
}
module.exports = StoreService;
