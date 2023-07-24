const orderId = window.location.pathname.split('/')[3];

document.addEventListener('DOMContentLoaded', () => {
  const orderList = document.querySelector('.orders-list');

  fetch(`/api/owner/orders/${orderId}`)
    .then((response) => response.json())
    .then((data) => {
      const { order } = data; //

      if (order) {
        const {
          isDelivered,
          orderId,
          address,
          User: { userName, phoneNumber },
          OrderMenus: [
            {
              quantity,
              Menu: { menuName, price },
            },
          ],
          totalPrice,
        } = order; // More destructuring

        const listItem = document.createElement('li');
        listItem.innerHTML = `
          <div class="isDelivered">${isDelivered ? '배달완료' : '배달중'}</div>
          <div class="order-number">주문번호 : ${orderId}</div>
          <div class="total-quantity-divider"></div> <!-- 이 부분 추가 -->
          <div class="address">성함 : ${userName}</div>
          <div class="address">주소 : ${address}</div>
          <div class="phone">전화번호 : ${phoneNumber}</div>
          <div class="total-quantity-divider"></div> <!-- 이 부분 추가 -->
          <div class="menu-name">메뉴 이름 : ${menuName}</div>
          <div class="order-number"> 수량 : ${quantity}</div>
          <div class="order-number"> 가격 : ${price}</div>
          <div class="total-quantity-divider"></div> <!-- 이 부분 추가 -->
          <div class="total-price">총 가격 : ${totalPrice}원</div>
        `;

        orderList.appendChild(listItem);
      }
    });
});
