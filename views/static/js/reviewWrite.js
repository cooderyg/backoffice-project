// 등록 버튼 클릭시 리뷰 생성 처리
document.getElementById('reviewSave').addEventListener('click', async function () {
  const rating = document.getElementById('ratingSelect').value;
  const comment = document.getElementById('comment').value;

  fetch(`/api/orders/${orderId}/reviews`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      rating,
      comment,
    }),
  })
    .then((res) => res.json())
    .then((data) => {
      console.log(data);
      window.location.href = '/reviewList';
    });
});

// 취소버튼 클릭 시 이전화면 로드
document.getElementById('cancelBtn').addEventListener('click', () => {
  window.history.back();
});

// 로그아웃 버튼 클릭 시 로그아웃
