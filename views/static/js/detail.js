import { setCookie, getCookie, deleteCookie } from './cookie.js';

const storeId = window.location.pathname.split('/')[2];
const storeTitleEl = document.querySelector('.store-title');
const ratingEl = document.querySelector('.rating');
const storeImgEl = document.querySelector('.store-img');
const menuContainerEl = document.querySelector('.menu-container');

console.log(storeId);
const getDate = async () => {
  const response = await fetch(`/api/stores/${storeId}`);
  const data = await response.json();
  console.log(data);
  const { store } = data;
  const menus = store.Menus;
  storeTitleEl.innerText = store.storeName;
  storeImgEl.setAttribute('src', store.imageUrl);
  const menuTemp = menus.map((menu) => {
    return `
    <li data-menuId=${menu.menuId}>
      <div>
        <h4 class="menu-title" data-title=${menu.menuName}>${menu.menuName}</h4>
        <span class="price" data-price=${menu.price}>${menu.price} 원</span>
        <div class="quantity">
          <input class="quantity-input" type="number" min="1" value="1" />
          <button class="add-basket-btn">장바구니 담기</button>
        </div>
      </div>
      <div class="img-container">
        <img src=${menu.imageUrl} />
      </div>
    </li>
    `;
  });
  menuContainerEl.innerHTML = menuTemp;
};
getDate();

//장바구니 로직
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
  confirm;
  if (cookieMenus) {
    const cookieStoreId = JSON.parse(getCookie('storeId'));

    if (cookieStoreId && storeId !== cookieStoreId) {
      if (!confirm('다른 가게 메뉴가 담겨있습니다. 초기화 후 새로 메뉴를 담으시겠습니까?')) return;
      deleteCookie('menus');
    }

    setCookie('storeId', storeId);

    const findMenu = cookieMenus.find((el) => el.id === menuId);
    if (findMenu) {
      const sumQuantity = +findMenu.quantity + quantity;
      findMenu.quantity = sumQuantity;
      setCookie('menus', JSON.stringify(cookieMenus));
      setTotalPrice(cookieMenus);
    } else {
      cookieMenus.push(newMenu);
      setCookie('menus', JSON.stringify(cookieMenus));
      setTotalPrice(cookieMenus);
    }
  } else {
    setCookie('storeId', storeId);
    const menus = [];
    menus.push(newMenu);
    setCookie('menus', JSON.stringify(menus));
    setTotalPrice(menus);
  }
});
