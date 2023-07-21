const parseCookie = (cookie) => {
  return cookie
    .split(';')
    .map((value) => {
      return value.split('=');
    })
    .reduce((acc, el) => {
      acc[decodeURIComponent(el[0].trim())] = decodeURIComponent(el[1].trim());
      return acc;
    }, {});
};

// 주문 내역 불러오기
window.addEventListener('DOMContentLoaded', async function () {
  const { accessToken } = parseCookie(document.cookie);

  const data = await fetch('/api/currentUser', {
    headers: {
      cookie: accessToken,
    },
  });
  const {
    user: { userId },
  } = await data.json();

  fetch(`/${userId}/orders`).then((response) => response.json());
  console.log(response);
});

// 리뷰 쓰기 버튼 클릭 시 리뷰 작성 페이지로 이동
const reviewButtons = document.querySelectorAll('.reviewBtn');
reviewButtons.forEach((button) => {
  button.addEventListener('click', function () {
    window.location.href = '/reviewWrite';
  });
});

// 리뷰 조회 버튼 클릭 시 리뷰 조회 페이지로 이동
const reviewListButtons = document.querySelectorAll('.reviewListBtn');
reviewListButtons.forEach((button) => {
  button.addEventListener('click', function () {
    window.location.href = '/reviewList';
  });
});
