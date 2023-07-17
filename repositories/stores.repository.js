const { Stores } = require('../models');

class StoreRepository {
  findStoreByOwnerId = async (OwnerId) => {
    const store = await Stores.findOne({ where: { OwnerId } });
    return store;
  };

  createStore = async (OwnerId, CategoryId, storeName, address, storeImageUrl, isOpen) => {
    await Stores.create({
      OwnerId,
      CategoryId,
      storeName,
      address,
      storeImageUrl,
      isOpen,
    });
  };

  updateStore = async (req, res) => {};

  deleteStore = async (req, res) => {};
}
module.exports = StoreRepository;
