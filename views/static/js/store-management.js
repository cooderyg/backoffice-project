// ⭕ 가게 관리 페이지로 이동
const storeManagement = document.querySelector('#store-management');

// ⭕ 주문 확인 페이지로 이동
const orderCheck = document.querySelector('#order-check');

// ⭕메뉴 관리 페이지
// 이동하면 해당 가게의 메뉴 정보를 불러온다.
// 메뉴CRUD를 할 때 params로 storeId, menuId를 줄 수 있다.
// 그냥 메뉴 관리에서 getStore하게 할까?
const menuManagement = document.querySelector('#menu-management');

// 해당 페이지로 이동시키는 버튼은 a태그가 어울리나?

const storeImage = document.querySelector('.store-image');
const storeName = document.querySelector('.store-name');
const storeCategory = document.querySelector('.store-category');
const storeAddress = document.querySelector('.store-address');
const storeStatus = document.querySelector('.store-status');

const storeCreate = document.querySelector('#store-create');
const storeUpdate = document.querySelector('#store-update');
const storeDelete = document.querySelector('#store-delete');

let storeId;

// 현재 로그인 프론트가 없어서 하드코딩으로 api에 ownerId를 넣어놓음. 원래는 auth-middleware지나서 res.locals.owner로 받는다.
const getStore = async () => {
  const response = await fetch('/api/stores');
  const { store } = await response.json();
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
  storeId = _storeId;
  storeName.innerText = name;
  storeCategory.innerText = Category.categoryName;
  storeAddress.innerText = address;
  storeStatus.innerText = isOpen ? '영업중' : '준비중';
};

getStore();

// const imageUrl ='https://cdn.bizwatch.co.kr/news/photo/2020/11/17/19bbef5c61047aa896e499ed81f2f064.jpg';

// 가게 관리 페이지로 이동
storeManagement.addEventListener('click', () => {
  window.location.href = `/store_management`;
});

// 주문 확인 페이지로 이동
orderCheck.addEventListener('click', () => {
  window.location.href = '/order_check';
});

// 메뉴 관리 페이지 이동 버튼
menuManagement.addEventListener('click', () => {
  window.location.href = `/menu_management/store=${storeId}`;
});

// 가게 등록 페이지 이동 버튼
storeCreate.addEventListener('click', () => {
  window.location.href = '/store_registration';
});

// 수정 페이지로 이동
storeUpdate.addEventListener('click', () => {
  window.location.href = '/store_modification';
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
