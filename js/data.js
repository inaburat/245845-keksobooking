'use strict';

(function () {
  var titles = ['Большая уютная квартира', 'Маленькая неуютная квартира', 'Огромный прекрасный дворец', 'Маленький ужасный дворец', 'Красивый гостевой домик', 'Некрасивый негостеприимный домик', 'Уютное бунгало далеко от моря', 'Неуютное бунгало по колено в воде'];
  var types = ['flat', 'house', 'bungalo'];
  var times = ['12:00', '13:00', '14:00'];
  var additions = ['wifi', 'dishwasher', 'parking', 'washer', 'elevator', 'conditioner'];

  var randomInteger = function (min, max) {
    var rand = min - 0.5 + Math.random() * (max - min + 1);
    rand = Math.round(rand);
    return rand;
  };
  var randomArrayValue = function (arrayName) {
    var rnd = Math.floor(Math.random() * arrayName.length);
    return arrayName[rnd];
  };
  var singleArrayValue = function (arrayName) {
    var rnd = Math.floor(Math.random() * arrayName.length);
    var curent = arrayName[rnd];
    arrayName.splice(rnd, 1);
    return curent;
  };
  var multipleArrayValue = function (arrayName) {
    var rnd = Math.floor(Math.random() * arrayName.length);
    var rndArr = [];
    for (var i = 0; i < rnd; i++) {
      rndArr.push(arrayName[i]);
    }
    return rndArr;
  };
  var generateAuthorData = function (id) {
    return {avatar: 'img/avatars/user' + ((id <= 9) ? '0' : '') + (id + 1) + '.png'};
  };

  var generateOfferData = function (location) {
    return {
      title: singleArrayValue(titles),
      address: location.x + ', ' + location.y,
      price: randomInteger(1000, 1000000),
      type: randomArrayValue(types),
      rooms: randomInteger(1, 5),
      guests: randomInteger(1, 10),
      checkin: randomArrayValue(times),
      checkout: randomArrayValue(times),
      features: multipleArrayValue(additions),
      description: '',
      photos: []
    };
  };
  var generateLocationData = function () {
    return {
      x: randomInteger(300, 900),
      y: randomInteger(100, 500)
    };
  };
  var generateData = function (id) {
    var locationData = generateLocationData();
    return {
      author: generateAuthorData(id),
      offer: generateOfferData(locationData),
      location: locationData
    };
  };
  window.data = {
    getData: function (count) {
      var dataArray = [];
      for (var i = 0; i < count; i++) {
        dataArray.push(generateData(i));
      }
      return dataArray;
    }
  };
})();
