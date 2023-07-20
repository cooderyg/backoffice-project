// 리뷰 쓰기 버튼 클릭 시 리뷰 작성 페이지로 이동
const reviewButtons = document.querySelectorAll('.reviewBtn');
reviewButtons.forEach((button) => {
  button.addEventListener('click', function () {
    // 리뷰 작성 페이지로 이동하는 URL
    const reviewWriteURL = '/reviewWrite';

    // 리뷰 작성 페이지로 이동
    window.location.href = reviewWriteURL;
  });
});
