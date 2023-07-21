// 주문 내역 불러오기
window.addEventListener('DOMContentLoaded', async function () {
  fetch(`/api/users/orders`)
    .then((response) => response.json())
    .then((data) => {
      const rows = data.data;
      const orderList = document.getElementById('orderList');
      rows.forEach((order) => {
        const orderId = order.orderId;
        const storeName = order.Store.storeName;
        const menus = order.OrderMenus.map((orderMenu) => orderMenu.Menu.menuName).join(', ');

        const temp_html = `<li class="solo-card" data-orderId="${orderId}">
                            <div class="isDelivered">배달중</div>
                            <div class="order-number">주문번호 : ${orderId}</div>
                            <div class="storeName">${storeName}</div>
                            <div class="menuName">${menus}</div>
                            <div class="btn-container">
                              <button class="detail-btn">주문상세보기</button>
                              <button class="reviewBtn">리뷰쓰기</button>
                            </div>
                          </li>`;
        orderList.insertAdjacentHTML('beforeend', temp_html);
      });

      // 리뷰 쓰기 버튼 클릭 시 이벤트 핸들러 추가
      const reviewButtons = document.querySelectorAll('.reviewBtn');
      reviewButtons.forEach((button) => {
        button.addEventListener('click', function () {
          const orderId = this.parentNode.parentNode.getAttribute('data-orderId');
          window.location.href = `/reviewWrite?orderId=${orderId}`;
        });
      });

      // 주문상세보기 버튼 클릭시 order-complete 페이지로 이동
      const orderCompleteButtons = document.querySelectorAll('.detail-btn');
      orderCompleteButtons.forEach((button) => {
        button.addEventListener('click', function () {
          const orderId = this.parentNode.parentNode.getAttribute('data-orderId');
          window.location.href = `/orders/complete?orderId=${orderId}`;
        });
      });
    });
});

// 리뷰 조회 버튼 클릭 시 리뷰 조회 페이지로 이동
const reviewListButtons = document.querySelectorAll('.reviewListBtn');
reviewListButtons.forEach((button) => {
  button.addEventListener('click', function () {
    window.location.href = '/reviewList';
  });
});
