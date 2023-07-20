const storeId = window.location.pathname.split('/')[3];
const menuId = window.location.pathname.split('/')[6];
const menuNameEl = document.querySelector('#menu-name');
const menuImageEl = document.querySelector('#menuImage');
const menuPriceEl = document.querySelector('#menu-price');

const imageContainerEl = document.querySelector('#image-container');
const imageUploadEl = document.querySelector('.image-upload');
let url;
let originUrl;

const getMenuInfo = async () => {
  const response = await fetch(`/api/stores/${storeId}/menus/${menuId}`);
  const { menu } = await response.json();
  const { menuName, price, imageUrl } = menu;

  menuNameEl.value = menuName;
  menuPriceEl.value = price;
  imageContainerEl.innerHTML = `<img src="${imageUrl}" /><br />
  <button type="button" class="image-upload btn btn-outline-danger">이미지 업로드</button>`;
  const imageUploadEl = document.querySelector('.image-upload');
  originUrl = imageUrl;
  imageUploadEl.addEventListener('click', () => {
    menuImageEl.click();
  });
};
getMenuInfo();

imageUploadEl.addEventListener('click', () => {
  menuImageEl.click();
});

menuImageEl.addEventListener('change', async (e) => {
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
    menuImageEl.click();
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

const menuRegisterForm = document.querySelector('#menu-register-form');
menuRegisterForm.addEventListener('submit', async (e) => {
  e.preventDefault();

  const imageUrl = url ? url : originUrl;
  const data = {
    menuName: menuNameEl.value,
    imageUrl, // 만약 사용자가 이미지를 업로드 하지 않았을 경우에, 원래의 이미지 주소를 넣어줘야한다.
    price: menuPriceEl.value,
  };

  // 메뉴 수정 api
  const response = await fetch(`/api/stores/${storeId}/menus/${menuId}`, {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(data),
  });

  const result = await response.json();
  // 메뉴가 추가
  if (result.message === '메뉴가 수정되었습니다.') {
    // 성공 시 메뉴 관리 페이지로
    location.href = `/menu_management/stores/${storeId}`;
  } else {
    alert(result.message);
  }
});
