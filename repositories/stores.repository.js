const { Stores } = require('../models');

class StoreRepository {
  findStoreByOwnerId = async (OwnerId) => {
    const store = await Stores.findOne({ where: { OwnerId } });
  };

  createStore = async (OwnerId, CategoryId, storeName, address, storeImageUrl, isOpen) => {
    const store = await Stores.create({
      OwnerId,
      CategoryId,
      storeName,
      address,
      storeImageUrl,
      isOpen,
    });
    return store;
  };

  updateStore = async (req, res) => {};

  deleteStore = async (req, res) => {};
}
module.exports = StoreRepository;
