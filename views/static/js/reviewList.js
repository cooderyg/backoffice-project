const parseCookie = (cookie) => {
  if (!cookie) {
    return {};
  }

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

// 리뷰 정보 조회하여 보여주기
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

  fetch(`/api/users/${userId}/reviews`)
    .then((response) => response.json())
    .then((data) => {
      console.log(data);

      const rows = data.data;
      const cardGroup = document.getElementById('cardGroup');
      rows.forEach((review) => {
        const storeName = review.storeName;
        const menuName = review.menuName;
        const comment = review.comment;
        const rating = review.rating;
        const reviewImg = review.imageUrl;
        const reviewid = review.reviewId;
        const imgTemp = `
        <img src=${reviewImg} class="card-img-top" alt="...">
        `;
        const temp_html = `<div class="solo-card" data-reviewId="${reviewid}">
                              ${reviewImg ? imgTemp : ''}
                              <div class="card-body">
                                <h5 class="card-title">${storeName}</h5>
                                <p class="card-text">${menuName}</p>
                                <!-- 수정그룹: 인풋창과 확인/취소 버튼 -->
                                <div class="edit-group" style="display: none;">
                                  <input type="text" class="card-comment-input">
                                  <div class="btn-group">
                                    <button type="button" class="btn btn-secondary btn-sm btn-confirm">확인</button>
                                    <button type="button" class="btn btn-secondary btn-sm btn-cancel">취소</button>
                                  </div>
                                </div>
                                <p class="card-comment">${comment}</p>
                                <p class="card-text"><small class="text-muted">⭐:${rating}</small></p>
                                <button type="button" class="btn btn-secondary btn-sm" id="reviewEdit">수정</button>
                                <button type="button" class="btn btn-secondary btn-sm" id="reviewDelete">삭제</button>
                              </div>
                            </div>`;
        cardGroup.insertAdjacentHTML('beforeend', temp_html);
      });
    });
});

// 리뷰 수정 버튼 클릭 시 인풋 창과 수정그룹 보이기
document.addEventListener('click', function (event) {
  if (event.target.id === 'reviewEdit') {
    const card = event.target.closest('.solo-card');
    const commentElement = card.querySelector('.card-comment');
    const commentInput = card.querySelector('.card-comment-input');
    const editGroup = card.querySelector('.edit-group');

    // 기존 리뷰 텍스트를 인풋 창에 넣기
    const currentComment = commentElement.textContent;
    commentInput.value = currentComment;

    // 리뷰 텍스트가 보이지 않고, 인풋 창과 수정그룹이 보이도록 스타일을 변경
    commentElement.style.display = 'none';
    commentInput.style.display = 'block';
    editGroup.style.display = 'flex';
    // 확인 버튼 클릭 시 리뷰 수정 API 요청
    const confirmButton = card.querySelector('.btn-confirm');
    confirmButton.addEventListener('click', async () => {
      const { accessToken } = parseCookie(document.cookie);
      const data = await fetch('/api/currentUser', {
        headers: {
          cookie: accessToken,
        },
      });
      const {
        user: { userId },
      } = await data.json();
      const reviewId = card.dataset.reviewid;
      const updatedComment = commentInput.value;

      try {
        const response = await fetch(`/api/users/${userId}/reviews/${reviewId}`, {
          method: 'PUT',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ comment: updatedComment }),
        });
        if (response.ok) {
          const responseData = await response.json();
          // 리뷰 수정 성공
          alert(responseData.message);
          // 수정 완료 후 페이지 리로드
          location.reload();
        } else {
          // 리뷰 수정 실패
          console.log('리뷰 수정에 실패했습니다.');
        }
      } catch (error) {
        console.log('오류가 발생했습니다.', error);
      }
    });
  }
});

// 취소 버튼 클릭 시 수정그룹 안보이게 하고 카드만 보이도록 처리
document.addEventListener('click', function (event) {
  if (event.target.classList.contains('btn-cancel')) {
    const card = event.target.closest('.solo-card');
    const commentElement = card.querySelector('.card-comment');
    const commentInput = card.querySelector('.card-comment-input');
    const editGroup = card.querySelector('.edit-group');

    // 수정그룹 숨기기
    commentInput.style.display = 'none';
    editGroup.style.display = 'none';

    // 기존 리뷰 텍스트
    commentElement.style.display = 'block';
  }
});

// 삭제 버튼 클릭 시 해당 리뷰 삭제
document.addEventListener('click', async function (event) {
  if (event.target.id === 'reviewDelete') {
    const { accessToken } = parseCookie(document.cookie);
    const data = await fetch('/api/currentUser', {
      headers: {
        cookie: accessToken,
      },
    });
    const {
      user: { userId },
    } = await data.json();
    const reviewId = event.target.closest('.solo-card').dataset.reviewid;
    console.log(userId, reviewId);

    try {
      const response = await fetch(`/api/users/${userId}/reviews/${reviewId}`, {
        method: 'DELETE',
      });
      if (response.ok) {
        const data = await response.json();
        // 삭제 성공
        alert(data.message);
        location.reload();
      } else {
        // 삭제 실패
        console.log('삭제에 실패했습니다.');
      }
    } catch (error) {
      console.log('오류가 발생했습니다.', error);
    }
  }
});
