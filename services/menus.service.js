const MenuRepository = require('../repositories/menus.repository');

class MenuService {
  menuRepository = new MenuRepository();

  createMenu = async (storeId, menuName, menuImageUrl, price) => {
    const existMenu = await this.menuRepository.findMenuByMenuName(menuName);
    if (existMenu) throw { errorCode: 400, message: 'Menu already exist' };

    await this.menuRepository.createMenu(storeId, menuName, menuImageUrl, price);
  };
}
module.exports = MenuService;
