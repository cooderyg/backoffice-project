const storeId = window.location.pathname.split('/')[2];

const getDate = async () => {
  const response = await fetch(`/api/stores/${storeId}`);
  const data = await response.json();
  console.log(data);
};

getDate();
