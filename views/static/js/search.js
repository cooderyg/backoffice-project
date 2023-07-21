document.addEventListener('DOMContentLoaded', function () {
  const searchButton = document.querySelector('button');
  const searchInput = document.querySelector('input[type="text"]');
  const searchResults = document.querySelector('.store-list');
  const indexSearchString = document.getElementById('searchString');

  const searchStores = async () => {
    let searchString;
    if (indexSearchString) {
      searchString = indexSearchString.value.trim();
    } else {
      searchString = searchInput.value.trim();
    }

    if (searchString === '') {
      alert('검색어를 입력하세요.');
      return;
    }

    try {
      const response = await fetch(
        `/api/stores/search?searchString=${encodeURIComponent(searchString)}`,
      );

      const data = await response.json();

      if (data.stores && data.stores.length > 0) {
        const storesHTML = data.stores
          .map(
            (store) => `
        <li>
          <a href="/detail/${store.id}">
            <img src="${store.image}" alt="" />
            <div>
              <div class="store-title">${store.storeName}</div>
              <div class="store-rating">
                <i class="fa fa-star" aria-hidden="true"></i> ${store.rating}
              </div>
              <div class="store-review">리뷰 (<span>${store.reviewCount}</span>)</div>
            </div>
          </a>
        </li>
      `,
          )
          .join('');

        searchResults.innerHTML = storesHTML;
      } else {
        searchResults.innerHTML = '<li><p>검색 결과가 없습니다.</p></li>';
      }
    } catch (error) {
      console.error('Error while searching:', error);
      alert('검색에 실패하였습니다.');
    }
  };

  searchButton.addEventListener('click', searchStores);
});
