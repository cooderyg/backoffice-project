// 페이지 url에서 storeId 추출
const url = window.location.pathname;
const storeId = url.split('/stores/')[1];
const menuAddButtonEl = document.querySelector('#menu-add');
const menuListEl = document.querySelector('.menu-list');

menuAddButtonEl.addEventListener('click', () => {
  // 메뉴 추가 페이지로 이동
  location.href = `/menu_management/stores/${storeId}/menu_registration`;
});

//storeId에 해당하는 스토어의 메뉴정보목록을 받아온다.

const getMenus = async () => {
  const response = await fetch(`/api/stores/${storeId}/menus`);
  const { menus } = await response.json();
  menuListEl.innerHTML = menus.map((menu) => {
    return `<li >
              <a data-menuId="${menu.menuId}">
                <img
                  src="${menu.imageUrl}"
                  alt=""
                />
                <div>
                  <div class="menu-title">${menu.menuName}</div>
                  <div class="store-review">가격 : ${menu.price}</div> 
                </div>
                <div>
                  <button class="menu-update-button" >수정</button>
                  <button class="menu-delete-button" >삭제</button>
                </div>
              </a>
            </li>`;
  });

  // 수정, 삭제 버튼에 이벤트리스너 추가
  // 수정 버튼을 누르면 수정 페이지로 보낸다.

  const menuUpdateButtonEl = document.querySelector('.menu-update-button');
  const menuDeleteButtonEl = document.querySelector('.menu-delete-button');

  // 메뉴 수정 버튼
  menuUpdateButtonEl.addEventListener('click', (e) => {
    const menuId = e.target.parentNode.parentNode.getAttribute('data-menuId');
    location.href = `/menu_management/stores/${storeId}/menu_modification/menus/${menuId}`;
  });

  // 메뉴 삭제 버튼
  menuDeleteButtonEl.addEventListener('click', async (e) => {
    const menuId = e.target.parentNode.parentNode.getAttribute('data-menuId');
    const isDelete = confirm('정말 삭제하시겠습니까?');
    if (!isDelete) return;

    const response = await fetch(`/api/stores/${storeId}/menus/${menuId}`, {
      method: 'DELETE',
    });
    const result = await response.json();
    if (result.message === '') {
      location.reload();
    } else {
      alert(result.message);
    }
  });
};
getMenus();
