const storeNameEl = document.querySelector('#storeName');
const storeImage = document.querySelector('#storeImage');
const storeCategoryEl = document.querySelector('#categorySelect');
const storeAddressEl = document.querySelector('#address');
const imageContainerEl = document.querySelector('#image-container');
const isOpenSelectEl = document.querySelector('#isOpenSelect');
let url;

// 가게 등록 폼에  현재 가게 정보 넣기
const getStoreInfo = async () => {
  console.log('getStoreInfo 실행');

  const response = await fetch('/api/stores');
  const { store } = await response.json();
  const { imageUrl, storeName, CategoryId, address, isOpen } = store;

  storeNameEl.value = storeName;
  imageContainerEl.innerHTML = `<img src="${imageUrl}" /><br />
  <button type="button" class="image-upload">이미지 업로드</button>`;

  storeCategoryEl.value = CategoryId;
  storeAddressEl.value = address;
  isOpenSelectEl.value = isOpen ? 1 : 0;

  const imageUploadEl = document.querySelector('.image-upload');

  imageUploadEl.addEventListener('click', () => {
    storeImage.click();
  });
};
getStoreInfo();

storeImage.addEventListener('change', async (e) => {
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
  <button type="button" type class="img-update-btn">이미지 수정</button>
  <button type="button" class="img-delete-btn">이미지 삭제</button>
  `;

  const deleteTemp = `
  <button type="button" class="image-upload">이미지 업로드</button>
  `;
  const imgUpdateBtnEl = document.querySelector('.img-update-btn');
  const imgdeleteBtnEl = document.querySelector('.img-delete-btn');
  imgUpdateBtnEl.addEventListener('click', () => {
    uploadInputEl.click();
  });
  imgdeleteBtnEl.addEventListener('click', () => {
    url = '';
    imageContainerEl.innerHTML = deleteTemp;
    const imageUploadEl = document.querySelector('.image-upload');
    imageUploadEl.addEventListener('click', () => {
      storeImage.click();
    });
  });
});

const storeRegisterForm = document.querySelector('#store-register-form');
storeRegisterForm.addEventListener('submit', async (e) => {
  e.preventDefault();

  const data = {
    categoryId: storeCategory.value,
    storeName: storeName.value,
    // TODO: 이미지를 s3에 저장하고 이미지 주소를 body에 보낸다.
    imageUrl: url,
    address: storeAddress.value,
    isOpen: 'false', // 디폴트로 false를 보냄. 메뉴 등록하기 전이므로.
  };

  const response = await fetch('/api/stores', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(data),
  });
  // 가게 등록 api를 호출할 때, auth-middleware에서  res.locals.owner에 할당된 owner객체를 받을 수 있다.
  // ownerId로 가게를 조회하여 이미 등록된 가게가 있으면 에러를 보내어  alert창이 뜰 것이다.
  const result = await response.json();
  if (result.message === '가게가 등록되었습니다.') {
    location.href = '/store_management';
  } else {
    alert(result.message);
  }
});
