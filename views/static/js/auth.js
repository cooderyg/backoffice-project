document.addEventListener('DOMContentLoaded', function () {
  const wrapper = document.querySelector('.wrapper');
  const loginLink = document.querySelector('.login-link');
  const registerLink = document.querySelector('.register-link');

  registerLink.addEventListener('click', () => {
    wrapper.classList.add('active');
  });

  loginLink.addEventListener('click', () => {
    wrapper.classList.remove('active');
  });

  const ownerRadio = document.querySelector('#radio-register-owner input[name="radio-register"]');
  const userRadio = document.querySelector('#radio-register-user input[name="radio-register"]');
  const ownerElements = document.querySelectorAll('.register-form .input-box');
  const agegenderInputbox = document.querySelector('.age-gender-input-box');

  for (let i = 2; i < ownerElements.length; i++) {
    if (i === 4) {
      agegenderInputbox.style.display = 'none';
    } else {
      const element = ownerElements[i];
      element.style.display = 'none';
    }
  }

  ownerRadio.addEventListener('click', function () {
    wrapper.classList.add('owner');
    for (let i = 0; i < ownerElements.length; i++) {
      if (i === 4) {
        agegenderInputbox.style.display = 'flex';
      } else {
        const element = ownerElements[i];
        element.style.display = 'block';
      }
    }
  });

  userRadio.addEventListener('click', function () {
    wrapper.classList.remove('owner');

    for (let i = 2; i < ownerElements.length; i++) {
      if (i === 4) {
        agegenderInputbox.style.display = 'none';
      } else {
        const element = ownerElements[i];
        element.style.display = 'none';
      }
    }
  });
});
