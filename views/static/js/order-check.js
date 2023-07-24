const orderId = window.location.pathname.split('/')[3];

document.addEventListener('DOMContentLoaded', () => {
  const orderList = document.querySelector('.order-list');

  fetch(`/api/owners/orders/${orderId}`)
    .then((response) => response.json())
    .then((data) => {
      const Orders = data.order;
      console.log(data);

      if (orderId.length > 0) {
        Orders.forEach((order) => {
          const listItem = document.createElement('li');
          listItem.innerHTML = `
                <div class="isDelivered">${order.isDelivered ? '배달완료' : '배달중'}</div>
                <div class="order-number">주문번호 : ${order.orderId}</div>
                <div class="address">주소 : ${order.address}</div>
                <div class="phone">고객 전화번호 : ${order.User.phoneNumber}</div>
              
              `;

          orderList.appendChild(listItem);
        });
      }
    });
});
