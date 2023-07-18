const { Menus } = require('../models');

class MenuRepository {
  createMenu = async (StoreId, menuName, imageUrl, price) => {
    await Menus.create({ StoreId, menuName, imageUrl, price });
  };

  findMenuByMenuName = async (menuName) => {
    const menu = await Menus.findOne({ where: { menuName } });
    return menu;
  };

  findAllMenus = async (StoreId) => {
    const menus = await Menus.findAll({ where: { StoreId } });
    return menus;
  };
}
module.exports = MenuRepository;
