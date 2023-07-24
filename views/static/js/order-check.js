const orderId = window.location.pathname.split('/')[3];

document.addEventListener('DOMContentLoaded', () => {
  const orderList = document.querySelector('.orders-list');

  fetch(`/api/owner/orders/${orderId}`)
    .then((response) => response.json())
    .then((data) => {
      const { order } = data; //구조분해할당

      if (order) {
        const {
          isDelivered,
          orderId,
          address,
          createdAt,
          User: { userName, phoneNumber },
          OrderMenus: [
            {
              Menu: { menuName, quantity, price },
            },
          ],
          totalPrice,
        } = order;

        const listItem = document.createElement('li');
        listItem.innerHTML = `
          <div class="isDelivered">${isDelivered ? '배달완료' : '배달중'}</div>
          <div class="order-number">주문번호 : ${orderId}</div>
          <div class="order-number">주문일자 : ${createdAt}</div>
          <div class="address">주소 : ${address}</div>
          <div class="phone">고객 이름 : ${userName}</div>
          <div class="phone">고객 전화번호 : ${phoneNumber}</div>
          <div class="menu-name">메뉴 이름 : ${menuName}</div>
          <div class="menu-name">수량 : ${quantity}</div>
          <div class="menu-name">가격 : ${price}</div>
          <div class="total-price">총 가격 : ${totalPrice}원</div>
        `;

        orderList.appendChild(listItem);
      }
    });
});
