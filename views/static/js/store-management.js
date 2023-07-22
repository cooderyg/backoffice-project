const storeImage = document.querySelector('.store-image');
const storeNameEl = document.querySelector('.store-name');
const storeCategory = document.querySelector('.store-category');
const storeAddress = document.querySelector('.store-address');
const storeStatus = document.querySelector('.store-status');
const storeRegisterBtnEl = document.querySelector('#store-register');
const storeUpdate = document.querySelector('#store-update');
const storeDelete = document.querySelector('#store-delete');
let ownerId;
let storeId;

const getStore = async () => {
  const response = await fetch('/api/stores');
  const { store } = await response.json();
  if (!store) {
    storeNameEl.innerText = '등록된 가게를 찾을 수 없습니다';
    return (storeRegisterBtnEl.style = 'display:block');
  }
  const {
    OwnerId,
    storeId: _storeId,
    imageUrl,
    storeName: name,
    Category,
    address,
    isOpen,
  } = store;
  if (imageUrl) {
    storeImage.setAttribute('src', imageUrl);
  }
  ownerId = OwnerId;
  storeId = _storeId;
  storeNameEl.innerText = name;
  storeCategory.innerText = Category.categoryName;
  storeAddress.innerText = address;
  storeStatus.innerText = isOpen ? '영업중' : '준비중';
};

getStore();

// 가게 등록 페이지 이동 버튼
storeRegisterBtnEl.addEventListener('click', () => {
  window.location.href = '/store_registration';
});

// 수정 페이지로 이동
storeUpdate.addEventListener('click', () => {
  window.location.href = `/store_modification/stores/${storeId}`;
});

// 가게 삭제 버튼
storeDelete.addEventListener('click', async () => {
  const isDelete = confirm('정말 삭제하시겠습니까?');
  if (!isDelete) return;

  const response = await fetch(`/api/stores/${storeId}`, {
    method: 'DELETE',
  });
  const result = await response.json();
  if (result.message === '가게 정보가 삭제되었습니다.') {
    location.reload();
  } else {
    alert(result.message);
  }
});
