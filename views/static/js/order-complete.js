const orderId = window.location.pathname.split('/')[3];
console.log(orderId);
const addressEl = document.querySelector('.address');
const phoneEl = document.querySelector('.phone');
const menuListEl = document.querySelector('.menu-list');
const priceEl = document.querySelector('.price');
const storeNameEl = document.querySelector('.store-name');

const getData = async () => {
  try {
    const response = await fetch(`/api/orders/${orderId}`);
    const data = await response.json();
    const { order } = data;
    console.log(data);
    const userInfo = order.User;
    const storeName = order.Store.storeName;
    const orderMenus = order.OrderMenus;
    addressEl.innerText = `주소 : ${order.address}`;
    phoneEl.innerText = `전화번호 : 0${userInfo.phoneNumber}`;
    storeNameEl.innerText = storeName;
    console.log(orderMenus);
    const orderMenuTemp = orderMenus
      .map((menu) => {
        return `
      <li>
        <img class="menu-img" src=${menu.Menu.imageUrl} alt="" />
        <div>
          <div class="menu-name">메뉴명 :${menu.Menu.menuName}</div>
          <div class="quantity">수량 : ${menu.quantity}</div>
        </div>
      </li>
      `;
      })
      .join(' ');
    menuListEl.innerHTML = orderMenuTemp;
    priceEl.innerText = `총 결제금액 ${order.totalPrice} 원`;
    console.log('패칭완료');
  } catch (error) {
    console.error(error);
  }
};

getData();

const popUpEl = document.querySelector('.pop-up');
const socket = io();
socket.on('delivery-complete', (data) => {
  console.log(data);
  popUpEl.classList.add('on');
});
