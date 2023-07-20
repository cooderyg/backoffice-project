import { setCookie, getCookie } from './cookie.js';

const priceSumEl = document.querySelector('#priceSum');
const setTotalPrice = (arr) => {
  const price = arr.reduce((acc, cur) => acc + Number(cur.price) * Number(cur.quantity), 0);
  priceSumEl.innerText = `${price} 원`;
};

const menuCntEls = document.querySelectorAll('.menuCnt');
const cartListEl = document.querySelector('.cartList');
let cookieMenus = JSON.parse(getCookie('menus'));
if (!cookieMenus) {
  const temp = `
  <h2>장바구니가 비어있습니다.</h2>  
  `;
  cartListEl.innerHTML = temp;
} else {
  const temp = cookieMenus.map((menu) => {
    return `
    <div class="card mb-3">
      <div class="row g-0">
        <div class="col-md-4" style="width: 300px; height: 200px">
          <img
            src=${menu.url}
            class="img-fluid rounded-start"
            alt="..."
            style="width: 300px; height: 200px"
          />
        </div>
        <div class="col-md-8" data-menuId=${menu.id} data-price=${menu.price}>
          <div class="card-body">
            <h5 class="menuName">${menu.title}</h5>
            <p class="price">${menu.price} 원</p>
            <div class="quantitySet">
              <input type="number" min="1" value=${menu.quantity} class="menuCnt" />
            </div>
            <button type="button" class="btn btn-light cartDeleteBtn" class="cartDeleteBtn">
              삭제
            </button>
          </div>
        </div>
      </div>
    </div>
    `;
  });
  cartListEl.innerHTML = temp;
  setTotalPrice(cookieMenus);
}

menuCntEls.forEach((el) => {
  el.addEventListener('change', (e) => {
    // 메뉴 수량, id 가져오기
    const menuId = e.target.parentNode.parentNode.parentNode.getAttribute('data-menuId');
    const value = e.target.value;

    cookieMenus = JSON.parse(getCookie('menus'));
    const findMenu = cookieMenus.find((el) => el.id === menuId);
    findMenu.value = value;
    setCookie('menus', JSON.stringify(cookieMenus));
    setTotalPrice(cookieMenus);
  });
});

// 메뉴삭제함수
const deletMenu = (e) => {
  const menuId = e.target.parentNode.parentNode.getAttribute('data-menuId');
  cookieMenus.map((el, index) => {
    if (el.id === menuId) {
      cookieMenus.splice(index, 1);
    }
  });
  setCookie('menus', JSON.stringify(cookieMenus));
  e.target.parentNode.parentNode.parentNode.remove();
};

// 메뉴삭제
const deleteBtns = document.querySelectorAll('.cartDeleteBtn');

deleteBtns.forEach((el) => {
  el.addEventListener('click', (e) => {
    deletMenu(e);
  });
  setTotalPrice(cookieMenus);
});
