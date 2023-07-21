// require('dotenv');
// const env = process.env;
const pointEl = document.querySelector('.point');
const amountEl = document.querySelector('.amount');
let amountValue = 10000;
const selectChange = () => {
  amountValue = Number(amountEl.options[amountEl.selectedIndex].value);
};
amountEl.addEventListener('change', selectChange);

const requestPay = () => {
  const IMP = window.IMP; // 생략 가능
  IMP.init('imp05076841'); // 예: imp00000000a

  IMP.request_pay(
    {
      pg: 'kakaopay',
      pay_method: 'card',
      name: '오기요 포인트 결제',
      amount: amountValue, // 숫자 타입
      buyer_email: 'gildong@gmail.com',
      buyer_name: '홍길동',
      buyer_tel: '010-4242-4242',
      buyer_addr: '서울특별시 강남구 신사동',
      buyer_postcode: '01181',
    },
    function (rsp) {
      console.log(rsp);
      // callback
      //rsp.imp_uid 값으로 결제 단건조회 API를 호출하여 결제결과를 판단합니다.
      if (rsp.success) {
        //결제 성공 시 로직

        //백엔드에 데이터 보내주기
        try {
          fetch('/api/point-transaction', {
            headers: { 'Content-Type': 'application/json' },
            method: 'POST',
            body: JSON.stringify({
              impUid: rsp.imp_uid,
              amount: rsp.paid_amount,
            }),
          })
            .then((res) => res.json())
            .then((data) => {
              console.log(data);
              alert('결제가 성공적으로 완료되었습니다.');
              getDate();
            });
        } catch (error) {
          console.log(error.message);
        }
      } else {
        //결제 실패 시 로직
        alert('결제에 실패했습니다!! 다시 시도해 주세요!!');
      }
    },
  );
};

const paymentBtnEl = document.querySelector('.payment-btn');
paymentBtnEl.addEventListener('click', requestPay);

const getDate = async () => {
  const response = await fetch('/api/users-info');
  const data = await response.json();
  console.log(data);
  pointEl.innerText = `잔여포인트 : ${data.user.point} 원`;
};
getDate();
