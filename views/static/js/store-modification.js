const storeNameEl = document.querySelector('#storeName');
const storeImageEl = document.querySelector('#storeImage');
const storeCategoryEl = document.querySelector('#categorySelect');
const storeAddressEl = document.querySelector('#address');
const imageContainerEl = document.querySelector('#image-container');
const isOpenSelectEl = document.querySelector('#isOpenSelect');
let url;
let originUrl;
let storeId;

// 가게 등록 폼에  현재 가게 정보 넣기
const getStoreInfo = async () => {
  const response = await fetch('/api/stores');
  const { store } = await response.json();
  const { storeId: _storeId, imageUrl, storeName, CategoryId, address, isOpen } = store;

  storeNameEl.value = storeName;
  imageContainerEl.innerHTML = `<img src="${imageUrl}" /><br />
  <button type="button" class="image-upload btn btn-outline-danger">이미지 업로드</button>`;

  storeCategoryEl.value = CategoryId;
  storeAddressEl.value = address;
  isOpenSelectEl.value = isOpen ? 1 : 0;
  originUrl = imageUrl;
  storeId = _storeId;
  const imageUploadEl = document.querySelector('.image-upload');
  imageUploadEl.addEventListener('click', () => {
    storeImageEl.click();
  });
};
getStoreInfo();

storeImageEl.addEventListener('change', async (e) => {
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
  <img src="${url}" />
  <button type="button" class="img-update-btn btn btn-secondary">이미지 수정</button>
  <button type="button" class="img-delete-btn btn btn-secondary">이미지 삭제</button>
  `;

  const deleteTemp = `
  <button type="button" class="image-upload">이미지 업로드</button>
  `;
  const imgUpdateBtnEl = document.querySelector('.img-update-btn');
  const imgdeleteBtnEl = document.querySelector('.img-delete-btn');
  imgUpdateBtnEl.addEventListener('click', () => {
    storeImageEl.click();
  });
  imgdeleteBtnEl.addEventListener('click', () => {
    url = '';
    imageContainerEl.innerHTML = deleteTemp;
    const imageUploadEl = document.querySelector('.image-upload');
    imageUploadEl.addEventListener('click', () => {
      storeImageEl.click();
    });
  });
});

const storeRegisterForm = document.querySelector('#store-register-form');
storeRegisterForm.addEventListener('submit', async (e) => {
  e.preventDefault();

  const imageUrl = url ? url : originUrl;
  const data = {
    CategoryId: storeCategoryEl.value,
    storeName: storeNameEl.value,
    imageUrl,
    address: storeAddressEl.value,
    isOpen: isOpenSelectEl.value,
  };

  // 가게 수정 요청
  const response = await fetch(`/api/stores/${storeId}`, {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(data),
  });
  const result = await response.json();
  if (result.message === '가게 정보가 수정되었습니다.') {
    location.href = '/store_management';
  } else {
    alert(result.message);
  }
});
