const storeName = document.querySelector('#storeName');
const storeImage = document.querySelector('#storeImage');
const storeCategory = document.querySelector('#categorySelect');
const storeAddress = document.querySelector('#address');

const storeRegisterForm = document.querySelector('#store-register-form');
storeRegisterForm.addEventListener('submit', async (e) => {
  e.preventDefault();

  const data = {
    categoryId: storeCategory.value,
    storeName: storeName.value,
    // TODO: 이미지를 s3에 저장하고 이미지 주소를 body에 보낸다.
    imageUrl:
      'https://i.namu.wiki/i/wr-UKPub5BAEyeEsxzszuMRFRxlwxUAopqBBN3Hak5Ui-f5BYcyjdDPSksbJks4HVoA53jCY1sbjLe1Qztamrw.webp',
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
