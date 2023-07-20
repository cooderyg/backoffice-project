document.addEventListener('DOMContentLoaded', function () {
  const wrapper = document.querySelector('.wrapper');
  const loginLink = document.querySelector('.login-link');
  const registerLink = document.querySelector('.register-link');
  const textLogo = document.querySelector('.text-logo');

  textLogo.addEventListener('click', () => {
    window.location.href = '/';
  });

  registerLink.addEventListener('click', () => {
    wrapper.classList.add('active');
    if (ownerRadio.checked) {
      wrapper.classList.add('owner');
    }
  });

  loginLink.addEventListener('click', () => {
    wrapper.classList.remove('owner');
    wrapper.classList.remove('active');
  });

  const userRadio = document
    .getElementById('radio-register-user')
    .querySelector('input[type=radio]');
  const ownerRadio = document
    .getElementById('radio-register-owner')
    .querySelector('input[type=radio]');

  const ownerElements = document.querySelectorAll('.register-form .input-box');
  const agegenderInputbox = document.querySelector('.age-gender-input-box');

  ownerRadio.addEventListener('click', function () {
    wrapper.classList.add('owner');

    for (let i = 2; i < ownerElements.length; i++) {
      if (i === 4) {
        agegenderInputbox.style.display = 'none';
      } else {
        const element = ownerElements[i];
        element.style.display = 'none';
      }
    }
  });

  userRadio.addEventListener('click', function () {
    ownerRadio.checked = false;
    wrapper.classList.remove('owner');
    for (let i = 0; i < ownerElements.length; i++) {
      if (i === 4) {
        agegenderInputbox.style.display = 'flex';
      } else {
        const element = ownerElements[i];
        element.style.display = 'block';
      }
    }
  });

  const registerForm = document.querySelector('.register-form');
  registerForm.addEventListener('submit', async (event) => {
    event.preventDefault();

    const email = registerForm.querySelector('input[type=email]').value;
    const password = registerForm.querySelector('input[type=password]').value;
    const userName = registerForm.querySelector('#name input').value;
    const nickname = registerForm.querySelector('#nickname input').value;
    const age = registerForm.querySelector('#age-box input').value;
    const gender = registerForm.querySelector('input[name=radio-gender]:checked').value;
    const address = registerForm.querySelector('#address input').value;
    const phoneNumber = registerForm.querySelector('#phonenumber input').value;

    const userType = ownerRadio.checked ? 'owner' : 'user';

    let frontdata = {};

    if (userType === 'owner') {
      frontdata = { email, password };
    } else {
      frontdata = { email, password, userName, nickname, age, gender, address, phoneNumber };
    }

    try {
      // Step 1: 회원가입 요청 보내기
      const response = await fetch(`/api/${userType}/signup`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(frontdata),
      });

      const data = await response.json();
      if (response.ok) {
        // 회원가입 성공시의 동작
        console.log(data.message);
        console.log(data.newUser);
        console.log(data.newOwner);

        // Step 2: 회원가입 성공 시 Verification Code 입력란 추가
        const verificationCodeDiv = document.createElement('div');
        verificationCodeDiv.classList.add('input-box');
        verificationCodeDiv.id = 'verificationcode';

        const verificationCodeInput = document.createElement('input');
        verificationCodeInput.type = 'text';
        verificationCodeInput.required = true;

        const verificationCodeLabel = document.createElement('label');
        verificationCodeLabel.textContent = 'Verification Code';

        verificationCodeDiv.appendChild(verificationCodeInput);
        verificationCodeDiv.appendChild(verificationCodeLabel);

        const phoneNumberInput = document.getElementById('phonenumber');
        phoneNumberInput.parentNode.insertBefore(verificationCodeDiv, phoneNumberInput.nextSibling);

        // Step 3: 인증 번호 확인하기
        registerForm.addEventListener('submit', async (event) => {
          event.preventDefault();
          const verificationCode = verificationCodeInput.value;
          try {
            const response = await fetch(`/api/${userType}/verify`, {
              method: 'POST',
              headers: {
                'Content-Type': 'application/json',
              },
              body: JSON.stringify({
                verificationCode,
              }),
            });

            const data = await response.json();
            if (response.ok) {
              // 인증 번호 확인 성공 시 메인 페이지로 이동
              window.location.href = '/login';
              alert(data.message);
            } else {
              // 인증 번호 오류시
              console.error(data.message);
              alert(data.message);
            }
          } catch (error) {
            // 인증 번호 확인 요청 실패시
            console.error('인증 번호 확인 도중 오류가 발생했습니다.', error);
          }
        });
      } else {
        // 회원가입 실패시
        console.error(data.message);
        alert(data.message);
      }
    } catch (error) {
      console.error('회원가입 도중 오류가 발생했습니다.', error);
    }
  });

  const loginForm = document.querySelector('.login-form');
  loginForm.addEventListener('submit', async (event) => {
    event.preventDefault();

    const email = loginForm.querySelector('input[type=email]').value;
    const password = loginForm.querySelector('input[type=password]').value;

    const userLoginRadio = document
      .getElementById('radio-login-user')
      .querySelector('input[type=radio]');

    const userLoginType = userLoginRadio.checked ? 'user' : 'owner';

    try {
      const response = await fetch(`/api/${userLoginType}/login`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          email,
          password,
        }),
      });

      const data = await response.json();
      if (response.ok) {
        console.log(data.message);
        alert(data.message);
        window.location.href = '/';
      }
    } catch (error) {
      alert(data.message);
      console.error('로그인 도중 오류가 발생했습니다.', error);
    }
  });
});
