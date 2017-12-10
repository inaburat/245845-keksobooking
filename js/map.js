'use strict';

(function () {
  var buttonFragment = document.createDocumentFragment(); // область для клонирования элементов


  var map = document.querySelector('.map');
  var mapPins = document.querySelector('.map__pins'); // область для открисовки новых кнопок
  var mapMainPin = document.querySelector('.map__pin--main');
  var mapForm = document.querySelector('.notice__form');
  var allFormElement = document.querySelectorAll('fieldset');
  var dataArray = [];

  var activateMap = function () {
    mapForm.classList.remove('notice__form--disabled');
    map.classList.remove('map--faded');
    mapPins.appendChild(buttonFragment); // переносим элементы из области клонирования на страницу
    mapForm.classList.remove('notice__form--disabled');
    for (var i = 0; i < allFormElement.length; i++) {
      allFormElement[i].disabled = false;
    }
  };

  var getDataById = function (index) {
    return dataArray[index];
  };

  var init = function () {
    dataArray = window.data.getData(8);
    for (var i = 0; i < dataArray.length; i++) {
      buttonFragment.appendChild(window.pin.renderButton(dataArray[i], i));
    }
    for (i = 0; i < allFormElement.length; i++) {
      allFormElement[i].disabled = true;
    }
    mapForm.classList.add('notice__form--disabled');
    mapMainPin.addEventListener('mouseup', activateMap);
  };
  init();

  window.map = {
    activateMap: activateMap,
    getDataById: getDataById
  };

})();
