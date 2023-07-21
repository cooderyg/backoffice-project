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
