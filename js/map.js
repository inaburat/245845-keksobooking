'use strict';

(function () {
  var map = document.querySelector('.map');
  var mapMainPin = document.querySelector('.map__pin--main');
  var mapForm = document.querySelector('.notice__form');
  var allFormElement = mapForm.querySelectorAll('fieldset');
  var dataArray = [];

  var MAIN_PIN_HEIGHT = 84;
  var MIN_CLIENT_Y = 100;
  var MAX_CLIENT_Y = 500;

  var activateMap = function () {
    map.classList.remove('map--faded');
    window.pin.injectButtons(dataArray);
    mapForm.classList.remove('notice__form--disabled');
    mapForm.classList.remove('notice__form--disabled');
    for (var i = 0; i < allFormElement.length; i++) {
      allFormElement[i].disabled = false;
    }
    document.removeEventListener('mouseup', activateMap);
  };

  var dragAndDrop = function (evt) {
    evt.preventDefault();

    var startCoords = {
      x: evt.clientX,
      y: evt.pageY
    };
    var endCoordsX = evt.clientX;
    var endCoordsY = evt.pageY;

    var onMouseMove = function (moveEvt) {
      moveEvt.preventDefault();
      var mouseClientX = moveEvt.clientX;
      var mouseClientY = moveEvt.pageY;
      var mapMinLeft = map.offsetLeft;
      var mapWidth = map.offsetWidth;
      var mainPinWidth = mapMainPin.offsetWidth;
      var centerMainPin = mainPinWidth / 2;
      var minClientX = mapMinLeft + centerMainPin;
      var maxClientX = (mapWidth + mapMinLeft) - centerMainPin;

      var shift = {
        x: startCoords.x - mouseClientX,
        y: startCoords.y - mouseClientY
      };

      startCoords = {
        x: moveEvt.clientX,
        y: moveEvt.pageY
      };

      if (mouseClientX <= minClientX) {
        endCoordsX = centerMainPin;
      } else if (mouseClientX >= maxClientX) {
        endCoordsX = mapWidth - centerMainPin;
      } else {
        endCoordsX = mapMainPin.offsetLeft - shift.x;
      }

      if (mouseClientY <= MIN_CLIENT_Y) {
        endCoordsY = MIN_CLIENT_Y;
      } else if (mouseClientY >= MAX_CLIENT_Y) {
        endCoordsY = MAX_CLIENT_Y;
      } else {
        endCoordsY = mapMainPin.offsetTop - shift.y;
      }

      mapMainPin.style.left = (endCoordsX) + 'px';
      mapMainPin.style.top = (endCoordsY) + 'px';
    };

    var onMouseUp = function (upEvt) {
      upEvt.preventDefault();
      var inputAddress = document.querySelector('#address');

      inputAddress.value = 'x: ' + endCoordsX + ', y: ' + (endCoordsY + MAIN_PIN_HEIGHT);
      document.removeEventListener('mousemove', onMouseMove);
      document.removeEventListener('mouseup', onMouseUp);
    };

    document.addEventListener('mousemove', onMouseMove);
    document.addEventListener('mouseup', onMouseUp);
    document.addEventListener('mouseup', activateMap);
  };

  var getDataById = function (index) {
    return dataArray[index];
  };

  var successHandler = function (data) {
    dataArray = data;
  };
  var getDataArray = function () {
    return dataArray;
  };
  var errorHandler = function (errorMessage) {
    var node = document.createElement('div');
    node.style = 'z-index: 100; margin: 0 auto; text-align: center; background-color: red;';
    node.style.position = 'absolute';
    node.style.left = 0;
    node.style.right = 0;
    node.style.fontSize = '30px';
    node.style.color = '#ffffff';

    node.textContent = errorMessage;
    document.body.insertAdjacentElement('afterbegin', node);
  };

  var init = function () {
    for (var i = 0; i < allFormElement.length; i++) {
      allFormElement[i].disabled = true;
    }
    mapForm.classList.add('notice__form--disabled');
    mapMainPin.addEventListener('mousedown', dragAndDrop);
    window.backend.load(successHandler, errorHandler);
  };
  init();

  window.map = {
    activateMap: activateMap,
    getDataById: getDataById,
    getDataArray: getDataArray,
    MAIN_PIN_HEIGHT: MAIN_PIN_HEIGHT
  };

})();
