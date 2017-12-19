'use strict';

(function () {
  var mapForm = document.querySelector('.notice__form');
  var inputTitle = document.querySelector('#title');
  var inputAdress = document.querySelector('#address');
  var inputPrice = document.querySelector('#price');
  var inputType = document.querySelector('#type');
  var inputTimeIn = document.querySelector('#timein');
  var inputTimeOut = document.querySelector('#timeout');
  var inputRoomNumber = document.querySelector('#room_number');
  var inputCapacity = document.querySelector('#capacity');
  var TYPES_PRICES = {bungalo: 0, flat: 1000, house: 5000, palace: 10000};

  var ROOMS_GUESTS = {
    1: ['1'],
    2: ['1', '2'],
    3: ['1', '2', '3'],
    100: ['0']
  };
  var inputRoomNumberChange = function () {
    var currentValue = inputRoomNumber.value;
    var optionCapacity = inputCapacity.options;
    var guestKey = ROOMS_GUESTS[currentValue];
    optionCapacity[optionCapacity.length - 1].selected = true;

    for (var i = 0; i < optionCapacity.length; i++) {
      optionCapacity[i].disabled = true;
      if (optionCapacity[i].value === currentValue) {
        optionCapacity[i].selected = true;
      }

      for (var j = 0; j < guestKey.length; j++) {
        if (guestKey[j] === optionCapacity[i].value) {
          optionCapacity[i].disabled = false;
        }
      }
    }
  };

  var syncValues = function (element, value) {
    element.value = value;
  };
  var syncValueWithMin = function (element, value) {
    element.min = TYPES_PRICES[value];
  };
  var removeMessage = function () {
    var alertMessage = document.querySelector('.alert-message');
    alertMessage.remove();
  };

  var successHandler = function () {
    var node = document.createElement('div');
    node.style = 'z-index: 100; margin: 0 auto; text-align: center; background-color: green;';
    node.style.position = 'fixed';
    node.style.left = 0;
    node.style.right = 0;
    node.style.fontSize = '30px';
    node.style.color = '#ffffff';
    node.classList.add('alert-message');

    node.textContent = 'Ваше объявление успешно размещено';
    document.body.insertAdjacentElement('afterbegin', node);
    mapForm.reset();
    setTimeout(removeMessage, 3000);
  };
  var errorHandler = function (errorMessage) {
    var node = document.createElement('div');
    node.style = 'z-index: 100; margin: 0 auto; text-align: center; background-color: red;';
    node.style.position = 'fixed';
    node.style.left = 0;
    node.style.right = 0;
    node.style.fontSize = '30px';
    node.style.color = '#ffffff';
    node.classList.add('alert-message');

    node.textContent = errorMessage;
    document.body.insertAdjacentElement('afterbegin', node);
    setTimeout(removeMessage, 3000);
  };

  var formInit = function () {
    inputAdress.required = true;
    inputAdress.readOnly = true;
    inputTitle.required = true;
    inputTitle.minLength = 30;
    inputTitle.maxLength = 100;
    inputPrice.required = true;
    inputPrice.min = 0;
    inputPrice.max = 1000000;
    inputPrice.placeholder = 1000;
    inputRoomNumber.addEventListener('change', inputRoomNumberChange);
    mapForm.action = 'https://js.dump.academy/keksobooking';
    inputRoomNumberChange();

    window.synchronizeFields(inputTimeIn, inputTimeOut, syncValues);
    window.synchronizeFields(inputType, inputPrice, syncValueWithMin);
    mapForm.addEventListener('submit', function (evt) {
      evt.preventDefault();
      window.backend.save(new FormData(mapForm), successHandler, errorHandler);
    });
  };

  formInit();
})();
