'use strict';

(function () {
  var template = document.querySelector('template').content; // объект с шаблонами
  var templateButton = template.querySelector('.map__pin'); // кнопка для клонирования
  var mapFilter = document.querySelector('.map__filters');
  var mapFilterSelect = document.querySelectorAll('select');
  var BUTTON_HEIGHT = 64;
  var dataArray = [];
  var filterKeys = [];

  var getFilterKeys = function () {
    var filterType = document.querySelector('#housing-type');
    var filterPrice = document.querySelector('#housing-price');
    var filterRoom = document.querySelector('#housing-rooms');
    var filterGuests = document.querySelector('#housing-guests');
    var filterFeatures = document.querySelector('#housing-features');
    var filterFeaturesAll = filterFeatures.querySelectorAll('input');

    var getSelectedFeatures = function () {
      var features = []
      for (var i = 0; i < filterFeaturesAll.length; i++) {
        if (filterFeaturesAll[i].checked === true){
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

    var dataTypes = dataArray.filter(function (it) {
        return it.offer.type === filterKeys[0].type;
    });
    var dataPrice = dataArray.sort(function (dataArray)
    getDataPrice();
    var dataRooms = dataArray.filter(function (it) {
        return (it.offer.rooms).toString() === filterKeys[0].rooms;
    });
    var dataGuests = dataArray.filter(function (it) {
        return (it.offer.guests).toString() === filterKeys[0].guests;
    });
    var dataFeatures = [];
    var getDataFeatures = function () {
      var count = 0;

      for (var i = 0; i < dataArray.length; i++) {
        count = 0;
        for (var j = 0; j < filterKeys[0].features.length; j++) {
          for (var k = 0; k < dataArray[i].offer.features.length; k++) {
            if (dataArray[i].offer.features[k] === filterKeys[0].features[j]) {
              count++;
              if(count === filterKeys[0].features.length) {
                dataFeatures.push(dataArray[i]);
                count = 0;
              }
            }
          }
        }
      }
    };
    getDataFeatures();
    console.log(dataTypes.length, dataPrice.length, dataRooms.length, dataGuests.length, dataFeatures.length, )
  };


  var onPinEnterPress = function (evt) {
    window.util.isEnterEvent(evt, window.card.openPopup);

  };
  var renderButton = function (data, index) {
    var buttonElement = templateButton.cloneNode(true); // определяем элемен для возврата из функции

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
    for (var i = 0; i < mapFilterSelect.length; i++) {
      mapFilterSelect[i].addEventListener('change', renderFilter);
    }
  };
  init();
  window.pin = {
    renderButton: renderButton,
    getFilterKeys: getFilterKeys,
    renderFilter: renderFilter
  };
})();
