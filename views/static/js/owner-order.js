const orderId = window.location.pathname.split('/')[3];

// const isDeliveredEl = document.querySelector('.isDelivered');
// const orderIdEl = document.querySelector('.orderId');
// const addressEl = document.querySelector('.address');
// const phoneNumberEl = document.querySelector('.phoneNumber');
// const priceEl = document.querySelector('.price');

// const getOrderForOwner = async () => {
//   try {
//     const response = await fetch(`/api/owners/orders/${orderId}`);
//     const data = await response.json();
//     const { order } = data;
//     console.log(order);
//     const userInfo = order.User;
//     const storeName = order.Store.storeName;
//     const orderMenus = order.OrderMenus;
//     addressEl.innerText = `주소 : ${order.address}`;
//     phoneEl.innerText = `전화번호 : 0${userInfo.phoneNumber}`;
//     storeNameEl.innerText = storeName;
//     console.log(orderMenus);
//     const orderMenuTemp = orderMenus
//       .map((menu) => {
//         return `
//         <li>
//         <div class="isDelivered">${order.isDelivered ? '배달완료' : '배달중'}</div>
//         <div class="order-number">주문번호 : ${order.orderId}</div>
//         <div class="address">주소 : ${order.address}</div>
//         <div class="phone">고객 전화번호 : ${order.User.phoneNumber}</div>
//         <div class="btn-container">
//           <button class="detail-btn">주문상세보기</button>
//           <button class="complete-btn">배달완료</button>
//         </div>
//       </li>
//       `;
//       })
//       .join(' ');
//     menuListEl.innerHTML = orderMenuTemp;
//     priceEl.innerText = `총 결제금액 ${order.totalPrice} 원`;
//   } catch (error) {
//     console.error(error);
//   }
// };

document.addEventListener('DOMContentLoaded', () => {
  const orderList = document.querySelector('.order-list');

  // 서버로 주문 목록 요청
  fetch(`/api/owners/orders/${orderId}`)
    .then((response) => response.json())
    .then((data) => {
      const orders = data.order; // 주문 목록은 data.order에 저장됩니다.

      if (orders.length > 0) {
        orders.forEach((order) => {
          const listItem = document.createElement('li');
          listItem.innerHTML = `
                <div class="isDelivered">${order.isDelivered ? '배달완료' : '배달중'}</div>
                <div class="order-number">주문번호 : ${order.orderId}</div>
                <div class="address">주소 : ${order.address}</div>
                <div class="phone">고객 전화번호 : ${order.User.phoneNumber}</div>
                <div class="btn-container">
                  <button class="detail-btn" data-order-id="${order.orderId}">주문상세보기</button>
                  ${
                    order.isDelivered
                      ? ''
                      : '<button class="complete-btn" data-order-id="${order.orderId}">배달완료</button>'
                  }
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
          button.addEventListener('click', () => {
            const orderId = button.getAttribute('data-order-id');
            // 서버로 배달완료 요청 보내기
            fetch(`/api/orders/${orderId}/complete`, {
              method: 'PUT',
            })
              .then((response) => response.json())
              .then((data) => {
                // 성공적으로 배달완료 처리되면 페이지 리로드 또는 갱신 작업 수행
                window.location.reload();
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
      // 에러 처리 (예: 알림 메시지 출력)
    });
});
