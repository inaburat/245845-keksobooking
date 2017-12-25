'use strict';

(function () {
  var template = document.querySelector('template').content;
  var templateButton = template.querySelector('.map__pin');
  var buttonFragment = document.createDocumentFragment();
  var mapFilterSelects = document.querySelectorAll('select');
  var mapPins = document.querySelector('.map__pins');
  var filterGuests = document.querySelector('#housing-guests');
  var filterType = document.querySelector('#housing-type');
  var filterPrice = document.querySelector('#housing-price');
  var filterRoom = document.querySelector('#housing-rooms');
  var filterFeature = document.querySelector('#housing-features');
  var filterFeaturesAll = filterFeature.querySelectorAll('input');
  var filterKeys = [];
  var dataFeatures = [];
  var BUTTON_HEIGHT = 23 + 18;


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
    dataFeatures = window.map.getDataArray()
        .filter(function (item) {
          return filterKeys[0].type === 'any' || item.offer.type === filterKeys[0].type;
        })
        .filter(function (item) {
          return (filterKeys[0].price === 'low' && item.offer.price <= 10000)
          || (filterKeys[0].price === 'middle' && item.offer.price >= 10000 && item.offer.price <= 50000)
          || (filterKeys[0].price === 'high' && item.offer.price >= 50000)
          || (filterKeys[0].price === 'any');
        })
        .filter(function (item) {
          return (item.offer.rooms).toString() === filterKeys[0].rooms || filterKeys[0].rooms === 'any';
        })
        .filter(function (item) {
          return (item.offer.guests).toString() === filterKeys[0].guests || filterKeys[0].guests === 'any';
        })
        .filter(function (item) {
          return filterKeys[0].features.length === 0
          || filterKeys[0].features.every(function (feature) {
            return item.offer.features.includes(feature);
          });
        });

    removeButtons();
    injectButtons(dataFeatures);
  };
  var getDataFeatures = function () {
    return dataFeatures;
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
    var checkbox = filterFeature.querySelectorAll('input');
    for (var i = 0; i < mapFilterSelects.length; i++) {
      mapFilterSelects[i].addEventListener('change', function () {
        window.card.closePopup();
        renderFilter();
      });
    }
    for (i = 0; i < checkbox.length; i++) {
      checkbox[i].addEventListener('change', function () {
        window.card.closePopup();
        renderFilter();
      });
    }
  };
  init();
  window.pin = {
    renderButton: renderButton,
    getFilterKeys: getFilterKeys,
    getDataFeatures: getDataFeatures,
    renderFilter: renderFilter,
    injectButtons: injectButtons,
    removeButtons: removeButtons
  };
})();
