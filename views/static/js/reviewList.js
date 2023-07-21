// 백엔드->프론트엔드 api/currentUser생성
// fetch 요청
// 돌려받은 userId를 7줄 userId에 넣기
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
  // .then((response) => response.json())
  // .then(({ user: { userId } }) => userId);

  console.log(userId);

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

        const temp_html = `<div class="solo-card" data-reviewId="${reviewid}>
                              <img
                                src="${reviewImg}"
                                class="card-img-top" alt="...">
                              <div class="card-body">
                                <h5 class="card-title">${storeName}</h5>
                                <p class="card-text">${menuName}</p>
                                <p class="card-text">${comment}</p>
                                <p class="card-text"><small class="text-muted">⭐:${rating}</small></p>
                                <button type="button" class="btn btn-secondary btn-sm">수정</button>
                                <button type="button" class="btn btn-secondary btn-sm">삭제</button>
                                <!-- 수정 창 -->
                                <div id="commentEditBox" style="display: none;">
                                  <div class="modal-body">
                                    <input id="editContent" type="text" placeholder="내용">
                                    <button id="editCancel" type="button">취소</button>
                                    <button id="editSubmit" type="button">확인</button>
                                  </div>
                                </div>
                              </div>
                            </div>`;
        cardGroup.insertAdjacentHTML('beforeend', temp_html);
      });
    });
});

// 수정 버튼 클릭 시 수정창 띄우기
document.addEventListener('click', function (event) {
  if (event.target.id === 'reviewEdit') {
    const commentEditBox = event.target.parentNode.nextElementSibling;
    commentEditBox.style.display = 'block';

    // 기존 리뷰 내용 가져오기
    const cardBody = event.target.parentNode;
    const commentElement = cardBody.querySelector('.card-text');
    const commentContent = commentElement.textContent;

    // 인풋 요소에 기존 리뷰 내용 설정
    const editContentInput = commentEditBox.querySelector('#editContent');
    editContentInput.value = commentContent;
  }
});

// 수정 창의 취소버튼 클릭 시 창 숨기기
document.addEventListener('click', function (event) {
  if (event.target.id === 'editCancel') {
    const commentEditBox = event.target.closest('#commentEditBox');
    commentEditBox.style.display = 'none';
  }
});

// 수정 확인 버튼 클릭 시 수정 처리
document.addEventListener('click', async function (event) {
  if (event.target.id === 'editSubmit') {
    const reviewId = event.target.closest('.solo-card').dataset.reviewid;
    const editedContent = event.target.previousElementSibling.previousElementSibling.value;
    try {
      const response = await fetch(`/api/users/${userId}/reviews/${reviewId}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ content: editedContent }),
      });
      if (response.ok) {
        const data = await response.json();
        // 수정 성공
        alert(data.message);
        location.reload();
      } else {
        // 수정 실패
        console.log('수정에 실패했습니다.');
      }
    } catch (error) {
      console.log('오류가 발생했습니다.', error);
    }
  }
});

// 삭제 버튼 클릭 시 해당 리뷰 삭제
document.addEventListener('click', async function (event) {
  if (event.target.id === 'reviewDelete') {
    const reviewId = event.target.closest('.solo-card').dataset.reviewid;
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

// 로그아웃 버튼 클릭 시 로그아웃
