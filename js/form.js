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

  // var inputTimeInChange = function () {
  //   inputTimeOut[inputTimeIn.selectedIndex].selected = true;
  // };
  // var inputTimeOutChange = function () {
  //   inputTimeIn[inputTimeOut.selectedIndex].selected = true;
  // };
  // var inputTypeChange = function () {
  //   inputPrice.min = TYPES_PRICES[inputType.value];
  // };

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
    // inputTimeIn.addEventListener('change', inputTimeInChange);
    // inputTimeOut.addEventListener('change', inputTimeOutChange);
    // inputType.addEventListener('change', inputTypeChange);
    inputRoomNumber.addEventListener('change', inputRoomNumberChange);
    mapForm.action = 'https://js.dump.academy/keksobooking';
    inputRoomNumberChange();

    var syncValues = function (element, value) {
      element.value = value;
    };
    var syncValueWithMin = function (element, value) {
      element.min = TYPES_PRICES[value];
    };

    window.synchronizeFields(inputTimeIn, inputTimeOut, syncValues);
    window.synchronizeFields(inputType, inputPrice, syncValueWithMin);
  };

  formInit();
})();
