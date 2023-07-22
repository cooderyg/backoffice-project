import { setCookie, getCookie, deleteCookie } from './cookie.js';

const priceSumEl = document.querySelector('#priceSum');
const setTotalPrice = (arr) => {
  const price = arr.reduce((acc, cur) => acc + Number(cur.price) * Number(cur.quantity), 0);
  priceSumEl.innerText = `${price} 원`;
};
const getTotalPrice = (arr) => {
  const price = arr.reduce((acc, cur) => acc + Number(cur.price) * Number(cur.quantity), 0);
  return +price;
};

const cartListEl = document.querySelector('.cartList');
let cookieMenus = JSON.parse(getCookie('menus'));
if (!cookieMenus) {
  const temp = `
  <h2>장바구니가 비어있습니다.</h2>  
  `;
  cartListEl.innerHTML = temp;
} else {
  const temp = cookieMenus
    .map((menu) => {
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
    })
    .join(' ');
  cartListEl.innerHTML = temp;
  setTotalPrice(cookieMenus);
  const menuCntEls = document.querySelectorAll('.menuCnt');
  menuCntEls.forEach((el, index) => {
    el.addEventListener('click', (e) => {
      console.log(`countValue ${e.currentTarget.value}`);
      // 메뉴 수량, id 가져오기
      const menuId = e.target.parentNode.parentNode.parentNode.getAttribute('data-menuId');
      const value = e.target.value;

      cookieMenus = JSON.parse(getCookie('menus'));
      const findMenu = cookieMenus.find((el) => el.id === +menuId);

      findMenu.quantity = value;
      setCookie('menus', JSON.stringify(cookieMenus));
      setTotalPrice(cookieMenus);
    });
  });

  // 메뉴삭제
  const deleteBtns = document.querySelectorAll('.cartDeleteBtn');

  deleteBtns.forEach((el) => {
    el.addEventListener('click', (e) => {
      deletMenu(e);
    });
  });
}

// 메뉴삭제함수
const deletMenu = (e) => {
  const menuId = e.target.parentNode.parentNode.getAttribute('data-menuId');
  cookieMenus.map((el, index) => {
    if (el.id === +menuId) {
      cookieMenus = cookieMenus.toSpliced(index, 1);
    }
  });
  console.log(cookieMenus);
  setCookie('menus', JSON.stringify(cookieMenus));
  e.target.parentNode.parentNode.parentNode.parentNode.remove();
  setTotalPrice(cookieMenus);
};

// 주문하기

const orderBtn = document.querySelector('.order-btn');

orderBtn.addEventListener('click', async (e) => {
  const btn = e.currentTarget;
  if (btn.classList.contains('active')) return;
  btn.classList.add('active');
  try {
    const response = await fetch('/api/orders', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        totalPrice: getTotalPrice(cookieMenus),
      }),
    });
    const data = await response.json();
    deleteCookie('menus');
    location.href = `/orders/complete/${data.orderId}`;
  } catch (error) {
    console.log(error.message);
    alert('에러가 발생했습니다 다시 시도해주세요!');
    btn.classList.remove('active');
  }
});
