'use strict';

(function () {
  var template = document.querySelector('template').content;
  var templateButton = template.querySelector('.map__pin');
  var buttonFragment = document.createDocumentFragment();
  var mapFilterSelect = document.querySelectorAll('select');
  var mapPins = document.querySelector('.map__pins');
  var filterGuests = document.querySelector('#housing-guests');
  var filterType = document.querySelector('#housing-type');
  var filterPrice = document.querySelector('#housing-price');
  var filterRoom = document.querySelector('#housing-rooms');
  var filterFeatures = document.querySelector('#housing-features');
  var filterFeaturesAll = filterFeatures.querySelectorAll('input');
  var BUTTON_HEIGHT = 64;
  var dataArray = [];
  var filterKeys = [];


  var injectButtons = function (data) {
    for (var i = 0; i < data.length; i++) {
      buttonFragment.appendChild(renderButton(data[i], i));
    }
    mapPins.appendChild(buttonFragment);
  };

  var removeButtons = function () {
    var allPins = mapPins.querySelectorAll('.map__pin');
    var mapMainPin = document.querySelector('.map__pin--main');

    for (var i = 0; i < allPins.length; i++) {
      if (allPins[i] !== mapMainPin) {
        allPins[i].remove();
      }
    }
  };

  var getFilterKeys = function () {
    var getSelectedFeatures = function () {
      var features = [];
      for (var i = 0; i < filterFeaturesAll.length; i++) {
        if (filterFeaturesAll[i].checked === true) {
          features.push(filterFeaturesAll[i].value);
        }
      }
      return features;
    };

    var values = [{
      type: filterType.value,
      price: filterPrice.value,
      rooms: filterRoom.value,
      guests: filterGuests.value,
      features: getSelectedFeatures()
    }];
    return values;
  };


  var renderFilter = function () {
    filterKeys = getFilterKeys();
    dataArray = window.map.getDataArray();
    var dataTypes = [];
    var dataPrice = [];
    var dataRooms = [];
    var dataGuests = [];
    var dataFeatures = [];

    var getData = function () {
      for (var i = 0; i < dataArray.length; i++) {
        if (dataArray[i].offer.type === filterKeys[0].type || filterKeys[0].type === 'any') {
          dataTypes.push(dataArray[i]);
        }
      }
    };
    getData();
    var getPrice = function () {
      for (var i = 0; i < dataTypes.length; i++) {
        if (filterKeys[0].price === 'low' && dataTypes[i].offer.price <= 10000) {
          dataPrice.push(dataTypes[i]);
        } else if (filterKeys[0].price === 'middle' && dataTypes[i].offer.price >= 10000 && dataTypes[i].offer.price <= 50000) {
          dataPrice.push(dataTypes[i]);
        } else if (filterKeys[0].price === 'high' && dataTypes[i].offer.price >= 50000) {
          dataPrice.push(dataTypes[i]);
        } else if (filterKeys[0].price === 'any') {
          dataPrice.push(dataTypes[i]);
        }
      }
    };
    getPrice();
    var getRooms = function () {
      for (var i = 0; i < dataPrice.length; i++) {
        if ((dataPrice[i].offer.rooms).toString() === filterKeys[0].rooms || filterKeys[0].rooms === 'any') {
          dataRooms.push(dataTypes[i]);
        }
      }
    };
    getRooms();
    var getGuests = function () {
      for (var i = 0; i < dataRooms.length; i++) {
        if ((dataRooms[i].offer.guests).toString() === filterKeys[0].guests || filterKeys[0].guests === 'any') {
          dataGuests.push(dataRooms[i]);
        }
      }
    };
    getGuests();
    var getDataFeatures = function () {
      var count = 0;

      for (var i = 0; i < dataGuests.length; i++) {
        count = 0;
        for (var j = 0; j < filterKeys[0].features.length; j++) {
          for (var k = 0; k < dataGuests[i].offer.features.length; k++) {
            if (dataGuests[i].offer.features[k] === filterKeys[0].features[j]) {
              count++;
              if (count === filterKeys[0].features.length) {
                dataFeatures.push(dataGuests[i]);
                count = 0;
              }
            }
          }
        }
      }
    };
    getDataFeatures();
    removeButtons();
    injectButtons(dataFeatures);
  };


  var onPinEnterPress = function (evt) {
    window.util.isEnterEvent(evt, window.card.openPopup);

  };
  var renderButton = function (data, index) {
    var buttonElement = templateButton.cloneNode(true);

    buttonElement.style.left = data.location.x + 'px';
    buttonElement.style.top = data.location.y - BUTTON_HEIGHT + 'px';
    buttonElement.querySelector('img').src = data.author.avatar;
    buttonElement.dataset.index = index;
    buttonElement.addEventListener('click', function (evt) {
      window.card.openPopup(evt);
    });
    buttonElement.addEventListener('keydown', onPinEnterPress);
    return buttonElement;
  };

  var init = function () {
    var checkbox = filterFeatures.querySelectorAll('input');
    for (var i = 0; i < mapFilterSelect.length; i++) {
      mapFilterSelect[i].addEventListener('change', renderFilter);
    }
    for (i = 0; i < checkbox.length; i++) {
      checkbox[i].addEventListener('change', renderFilter);
    }
  };
  init();
  window.pin = {
    renderButton: renderButton,
    getFilterKeys: getFilterKeys,
    renderFilter: renderFilter,
    injectButtons: injectButtons,
    removeButtons: removeButtons
  };
})();
