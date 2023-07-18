const MenuService = require('../services/menus.service');

class MenuController {
  menuService = new MenuService();

  postMenu = async (req, res) => {
    const { storeId } = req.params;
    const { menuName, menuImageUrl, price } = req.body;

    try {
      await this.menuService.createMenu(storeId, menuName, menuImageUrl, price);
      res.json({ message: '메뉴가 추가되었습니다.' });
    } catch (e) {
      if (e.errorCode) return res.status(e.errorCode).json(e.message);
      res.status(500).json(e.message);
    }
  };
}
module.exports = MenuController;
