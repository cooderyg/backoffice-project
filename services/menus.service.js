const MenuRepository = require('../repositories/menus.repository');
const StoreRepository = require('../repositories/stores.repository');

class MenuService {
  menuRepository = new MenuRepository();
  storeRepository = new StoreRepository();

  createMenu = async (storeId, menuName, imageUrl, price) => {
    const existMenu = await this.menuRepository.findMenuByMenuName(menuName);
    if (existMenu) throw { errorCode: 400, message: 'Menu already exist' };

    if (!storeId || !menuName || !imageUrl || !price)
      throw { errorCode: 412, message: 'Invalid data' };

    await this.menuRepository.createMenu(storeId, menuName, imageUrl, price);
  };

  findAllMenus = async (storeId) => {
    if (!storeId) throw { errorCode: 412, message: 'Invalid data' };

    const store = await this.storeRepository.findStoreByStoreId(storeId);
    if (!store) throw { errorCode: 404, message: 'Store not exist' };

    const menus = await this.menuRepository.findAllMenus(storeId);
    if (!menus) throw { errorCode: 404, message: 'Menu not exist' };

    return menus;
  };

  updateMenu = async (storeId, menuId, ownerId, menuName, imageUrl, price) => {
    if (!ownerId || !storeId || !menuId || !menuName || !imageUrl || !price) {
      throw { errorCode: 412, message: 'Invalid data' };
    }

    const store = await this.storeRepository.findStoreByStoreId(storeId);
    if (!store) throw { errorCode: 404, message: 'Store not exist' };
    const menu = await this.menuRepository.findOneMenu(menuId);
    if (!menu) throw { errorCode: 404, message: 'Menu not exist' };

    if (ownerId !== store.OwnerId) {
      throw { errorCode: 403, message: 'Unauthorized' };
    }

    await this.menuRepository.updateMenu(menuId, menuName, imageUrl, price);
  };

  deleteMenu = async (storeId, menuId, ownerId) => {
    if (!ownerId || !storeId || !menuId) {
      throw { errorCode: 412, message: 'Invalid data' };
    }

    const store = await this.storeRepository.findStoreByStoreId(storeId);
    if (!store) throw { errorCode: 404, message: 'Store not exist' };
    const menu = await this.menuRepository.findOneMenu(menuId);
    if (!menu) throw { errorCode: 404, message: 'Menu not exist' };

    if (ownerId !== store.OwnerId) {
      throw { errorCode: 403, message: 'Unauthorized' };
    }

    await this.menuRepository.deleteMenu(menuId);
  };
}
module.exports = MenuService;
