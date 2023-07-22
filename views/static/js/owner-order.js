const orderId = window.location.pathname.split('/')[3];

// const orderId = document.querySelector('order.orderId');
// const UserPhoneNumber = document.querySelector('order.User.phoneNumber');
// const isDelivered = document.querySelector('order.isDelivered');
// const address = document.querySelector('order.address');

// const newdata = JSON.stringify({
//     orderList,
//     orderId,
//     UserPhoneNumber,
//     isDelivered,
//     address,

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
          const completeBtnTemp = `<button class="complete-btn" data-order-id="${order.orderId}">배달완료</button>`;
          listItem.innerHTML = `
                <div class="isDelivered">${order.isDelivered ? '배달완료' : '배달중'}</div>
                <div class="order-number">주문번호 : ${order.orderId}</div>
                <div class="address">주소 : ${order.address}</div>
                <div class="phone">고객 전화번호 : ${order.User.phoneNumber}</div>
                <div class="btn-container">
                  <button class="detail-btn" data-order-id="${order.orderId}">주문상세보기</button>
                  ${order.isDelivered ? '' : completeBtnTemp}
                </div>
              `;

          orderList.appendChild(listItem);
        });

        // 주문 상세보기 버튼과 배달완료 버튼의 클릭 이벤트 처리
        const detailButtons = document.querySelectorAll('.detail-btn');
        const completeButtons = document.querySelectorAll('.complete-btn');

        detailButtons.forEach((button) => {
          button.addEventListener('click', () => {
            const orderId = button.getAttribute('data-order-id');
            // 주문 상세보기 페이지로 이동 (또는 모달 창 등으로 구현)
            window.location.href = `/owner/orders/${orderId}`;
          });
        });

        completeButtons.forEach((button) => {
          button.addEventListener('click', (e) => {
            const isDeliveredEl =
              e.currentTarget.parentNode.parentNode.querySelector('.isDelivered');
            const btn = e.currentTarget;
            const orderId = button.getAttribute('data-order-id');
            // 서버로 배달완료 요청 보내기
            fetch(`/api/orders/delivery-complete/${orderId}`, {
              method: 'PUT',
            })
              .then((response) => response.json())
              .then((data) => {
                console.log(data);
                isDeliveredEl.innerText = '배달완료';
                btn.remove();
                // 성공적으로 배달완료 처리되면 페이지 리로드 또는 갱신 작업 수행
                socket.emit('delivery-complete', {
                  storeName: data.storeName,
                  userId: data.userId,
                });
              })
              .catch((error) => {
                console.error(error);
                // 에러 처리 (예: 알림 메시지 출력)
              });
          });
        });
      } else {
        const listItem = document.createElement('li');
        listItem.textContent = '주문이 없습니다.';
        orderList.appendChild(listItem);
      }
    })
    .catch((error) => {
      console.error(error);
      console.log(error);
      // 에러 처리 (예: 알림 메시지 출력)
    });
});

const popUpEl = document.querySelector('.pop-up');
const socket = io();
socket.on('order-complete', (data) => {
  console.log(data);
  popUpEl.classList.add('on');
});
