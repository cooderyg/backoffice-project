import { setCookie, getCookie } from './cookie.js';

const storeId = window.location.pathname.split('/')[2];

// const getDate = async () => {
//   const response = await fetch(`/api/stores/detail/${storeId}`);
//   const data = await response.json();
//   console.log(data);
// };
// getDate();

//장바구니 로직
const menuContainerEl = document.querySelector('.menu-container');
const paymentBtnEl = document.querySelector('.payment-btn');
const setTotalPrice = (arr) => {
  const price = arr.reduce((acc, cur) => acc + Number(cur.price) * Number(cur.quantity), 0);
  paymentBtnEl.innerText = `${price}원 결제하기`;
};

const firstMenu = JSON.parse(getCookie('menus'));
if (firstMenu) setTotalPrice(firstMenu);

menuContainerEl.addEventListener('click', function (e) {
  if (!e.target.classList.contains('add-basket-btn')) return;

  const menuId = +e.target.parentNode.parentNode.parentNode.getAttribute('data-menuId');
  const quantity = +e.target.parentNode.querySelector('.quantity-input').value;
  const price = +e.target.parentNode.parentNode.querySelector('.price').getAttribute('data-price');
  const url = e.target.parentNode.parentNode.parentNode
    .querySelector('.img-container img')
    .getAttribute('src');
  const title = e.target.parentNode.parentNode
    .querySelector('.menu-title')
    .getAttribute('data-title');
  const newMenu = {
    id: menuId,
    quantity,
    title,
    price,
    url,
  };

  const cookieMenus = JSON.parse(getCookie('menus'));

  if (cookieMenus) {
    const cookieStoreId = JSON.parse(getCookie('storeId'));
    if (cookieStoreId) {
    }
    const findMenu = cookieMenus.find((el) => el.id === menuId);
    const sumQuantity = +findMenu.quantity + quantity;

    if (findMenu) {
      findMenu.quantity = sumQuantity;
      setCookie('menus', JSON.stringify(cookieMenus));
      setTotalPrice(cookieMenus);
    } else {
      cookieMenus.push(newMenu);
      setCookie('menus', JSON.stringify(cookieMenus));
      setTotalPrice(cookieMenus);
    }
  } else {
    const menus = [];
    menus.push(newMenu);
    setCookie('menus', JSON.stringify(menus));
    setTotalPrice(menus);
  }
});
