const storeId = window.location.pathname.split('/')[3];
const menuName = document.querySelector('#menu-name');
const menuImage = document.querySelector('#menuImage');
const menuPrice = document.querySelector('#menu-price');

const imageContainerEl = document.querySelector('#image-container');
const imageUploadEl = document.querySelector('.image-upload');
let url;

imageUploadEl.addEventListener('click', () => {
  menuImage.click();
});

menuImage.addEventListener('change', async (e) => {
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
    menuImage.click();
  });
  imgdeleteBtnEl.addEventListener('click', () => {
    url = '';
    imageContainerEl.innerHTML = deleteTemp;
    const imageUploadEl = document.querySelector('.image-upload');
    imageUploadEl.addEventListener('click', () => {
      menuImage.click();
    });
  });
});

const menuRegisterForm = document.querySelector('#menu-register-form');
menuRegisterForm.addEventListener('submit', async (e) => {
  e.preventDefault();

  const data = {
    menuName: menuName.value,
    imageUrl: url,
    price: menuPrice.value,
  };

  // 메뉴 추가 api
  const response = await fetch(`/api/stores/${storeId}/menus`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(data),
  });

  const result = await response.json();
  // 메뉴가 추가
  if (result.message === '메뉴가 추가되었습니다.') {
    // 메뉴 관리
    location.href = `/menu_management/stores/${storeId}`;
  } else {
    alert(result.message);
  }
});
