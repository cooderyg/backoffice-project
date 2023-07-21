let url;
const imageContainerEl = document.querySelector('#image-container');

// 등록 버튼 클릭시 리뷰 생성 처리
document.getElementById('reviewSave').addEventListener('click', async function () {
  const rating = document.getElementById('ratingSelect').value;
  const comment = document.getElementById('comment').value;
  const reviewImg = url;
  console.log(`reviewImg: ${reviewImg}`);

  fetch(`/api/orders/${orderId}/reviews`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      imageUrl: reviewImg,
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

// 이미지 업로드 버튼
const reviewImageEl = document.querySelector('#inputGroupFile02');
reviewImageEl.addEventListener('change', async (e) => {
  console.log(e.target.files[0].type);
  const file = e.target.files[0];
  if (file.size > 1 * 1024 * 1024) {
    alert('파일용량은 최대 1mb입니다.');
    return;
  }
  if (!file.type.includes('jpeg') && !file.type.includes('png')) {
    alert('jpeg 또는 png 파일만 업로드 가능합니다!');
    return;
  }
  let formData = new FormData();
  formData.append('photo', file);
  const response = await fetch('/api/files', {
    method: 'POST',
    body: formData,
  });
  const data = await response.json();
  url = data.data;
  console.log(url);
  imageContainerEl.innerHTML = `
  <img src="${url}" /><br />
  <button type="button" class="img-update-btn btn btn-secondary">이미지 수정</button>
  <button type="button" class="img-delete-btn btn btn-secondary">이미지 삭제</button>
  `;

  const deleteTemp = `
  <button type="button" class="image-upload">이미지 업로드</button>
  `;
  const imgUpdateBtnEl = document.querySelector('.img-update-btn');
  const imgdeleteBtnEl = document.querySelector('.img-delete-btn');
  imgUpdateBtnEl.addEventListener('click', () => {
    reviewImageEl.click();
  });
  imgdeleteBtnEl.addEventListener('click', () => {
    url = '';
    imageContainerEl.innerHTML = deleteTemp;
    const imageUploadEl = document.querySelector('.image-upload');
    imageUploadEl.addEventListener('click', () => {
      menuImageEl.click();
    });
  });
});

// 취소버튼 클릭 시 이전화면 로드
document.getElementById('cancelBtn').addEventListener('click', () => {
  window.history.back();
});

// 로그아웃 버튼 클릭 시 로그아웃
