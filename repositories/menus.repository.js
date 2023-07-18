const { Menus } = require('../models');

class MenuRepository {
  createMenu = async (StoreId, menuName, menuImageUrl, price) => {
    await Menus.create({ StoreId, menuName, menuImageUrl, price });
  };
}
module.exports = MenuRepository;
