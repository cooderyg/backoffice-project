// 등록 버튼 클릭시 리뷰 생성 처리
document.getElementById('reviewSave').addEventListener('click', async function () {
  const ratingSelect = document.getElementById('ratingSelect');
  const rating = parseInt(ratingSelect.options[ratingSelect.selectedIndex].value, 10);
  const comment = document.getElementById('comment').value;

  fetch('/orders/:orderId/reviews', {
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
      alert(data.message);
    })
    .catch(console.error(data.message));
});
