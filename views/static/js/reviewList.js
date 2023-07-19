// 리뷰 정보 조회하여 보여주기
window.addEventListener('DOMContentLoaded', async function () {
  fetch('/api/users/:userId/reviews')
    .then((response) => response.json())
    .then((data) => {
      const rows = data['results'];
      const cardGroup = document.getElementById('card-group');
      rows.forEach((review) => {
        const storeName = review.storeName;
        const menuName = review.menuName;
        const comment = review.comment;
        const rating = review.rating;
        const reviewImg = review.imageUrl;
        const temp_html = `<div class="solo-card">
                            <img
                              src="${reviewImg}"
                              class="card-img-top" alt="...">
                            <div class="card-body">
                              <h5 class="card-title">${storeName}</h5>
                              <p class="card-text">${menuName}</p>
                              <p class="card-text">${comment}</p>
                              <p class="card-text"><small class="text-muted">${rating}</small></p>
                              <button type="button" class="btn btn-secondary btn-sm">수정</button>
                              <button type="button" class="btn btn-secondary btn-sm">삭제</button>
                            </div>
                          </div>`;
        cardGroup.insertAdjacentHTML('beforeend', temp_html);
      });
    });
});

// 수정 버튼 클릭 시 해당 리뷰 수정
document.addEventListener('click', function (event) {
  if (event.target.id === 'reviewEdit') {
  }
});

// 삭제 버튼 클릭 시 해당 리뷰 삭제
document.addEventListener('click', async function (event) {
  if (event.target.id === 'commentDelete') {
    const commentId = event.target.closest('.solo-card').dataset.commentid;
    try {
      const response = await fetch(`/api/posts/${postId}/comments/${commentId}`, {
        method: 'DELETE',
      });
      if (response.ok) {
        const data = await response.json();
        // 삭제 성공
        alert(data.message);
        location.reload();
      } else {
        // 삭제 실패
        console.log('댓글 삭제에 실패했습니다.');
      }
    } catch (error) {
      console.log('오류가 발생했습니다.', error);
    }
  }
});

// 로그아웃 버튼 클릭 시 로그아웃
