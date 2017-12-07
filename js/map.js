'use strict';

var titles = ['Большая уютная квартира', 'Маленькая неуютная квартира', 'Огромный прекрасный дворец', 'Маленький ужасный дворец', 'Красивый гостевой домик', 'Некрасивый негостеприимный домик', 'Уютное бунгало далеко от моря', 'Неуютное бунгало по колено в воде'];
var types = ['flat', 'house', 'bungalo'];
var times = ['12:00', '13:00', '14:00'];
var additions = ['wifi', 'dishwasher', 'parking', 'washer', 'elevator', 'conditioner'];
var dataArray = [];

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
var getData = function (count) {
  for (var i = 0; i < count; i++) {
    dataArray.push(generateData(i));
  }
  return dataArray;
};
getData(8); // вызываем функцию создания массива

var template = document.querySelector('template').content; // объект с шаблонами
var templateButton = template.querySelector('.map__pin'); // кнопка для клонирования
var templateArticle = template.querySelector('article.map__card'); // article для клонирования

var articleFragment = document.createDocumentFragment();
var buttonFragment = document.createDocumentFragment(); // область для клонирования элементов
var articleFlag = document.querySelector('.map__filters-container');

var map = document.querySelector('.map');
var mapPins = document.querySelector('.map__pins'); // область для открисовки новых кнопок
var mapMainPin = document.querySelector('.map__pin--main');
var mapForm = document.querySelector('.notice__form');
var allFormElement = document.querySelectorAll('fieldset');

var HOUSE_TYPES = {flat: 'Квартира', bungalo: 'Бунгало', house: 'Дом'};
var ESC_KEYCODE = 27;
var ENTER_KEYCODE = 13;

var onPopupEscPress = function (evt) {
  if (evt.keyCode === ESC_KEYCODE) {
    closePopup();
  }
};

var closePopup = function () {
  var popUp = document.querySelector('.map__card');
  var popUpParrent = document.querySelector('.map');
  var activePin = document.querySelector('.map__pin--active');

  popUpParrent.removeChild(popUp);
  activePin.classList.remove('map__pin--active');
  document.removeEventListener('keydown', onPopupEscPress);
};

var openPopup = function (evt) {
  var popUp = document.querySelector('.map__card');
  if (popUp) {
    closePopup();
  }
  evt.currentTarget.classList.add('map__pin--active');
  articleFragment.appendChild(renderArticle(dataArray[evt.currentTarget.dataset.index]));
  map.insertBefore(articleFragment, articleFlag);
  document.addEventListener('keydown', onPopupEscPress);
};

var renderButton = function (data, index) {
  var buttonElement = templateButton.cloneNode(true); // определяем элемен для возврата из функции
  var buttonCenterX = 65 / 2;
  var buttonBottomY = 84;

  buttonElement.style.left = data.location.x - buttonCenterX + 'px';
  buttonElement.style.top = data.location.y + buttonBottomY + 'px';
  buttonElement.querySelector('img').src = data.author.avatar;
  buttonElement.dataset.index = index;
  buttonElement.addEventListener('click', function (evt) {
    openPopup(evt);
  });
  buttonElement.addEventListener('keydown', function (evt) {
    if (evt.keyCode === ENTER_KEYCODE) {
      openPopup(evt);
    }
  });
  return buttonElement;
};

var renderFeuteres = function (data) {
  var feuteresList = data.offer.features;
  var feuteresHtml = '';
  if (feuteresList.length) {
    for (var i = 0; i < feuteresList.length; i++) {
      var contetn = '<li class="feature feature--' + feuteresList[i] + '"></li>';
      feuteresHtml += contetn;
    }
  }
  return feuteresHtml;
};

// подставляем значения из массива в 'статью'
var renderArticle = function (data) {
  var articleElement = templateArticle.cloneNode(true);
  var popUpClose = articleElement.querySelector('.popup__close');

  articleElement.querySelector('h3').textContent = data.offer.title;
  articleElement.querySelector('p small').textContent = data.offer.address;
  articleElement.querySelector('.popup__price').innerHTML = data.offer.price + ' &#8381;/ночь';
  articleElement.querySelector('h4').textContent = HOUSE_TYPES[data.offer.type];
  articleElement.querySelector('h4').nextElementSibling.textContent = data.offer.rooms + ' комнаты для ' + data.offer.guests + ' гостей ';
  articleElement.querySelector('.popup__features').previousElementSibling.textContent = 'Заезд после ' + data.offer.checkin + ', выезд до ' + data.offer.checkout;
  articleElement.querySelector('.popup__features').innerHTML = renderFeuteres(data);
  articleElement.querySelector('.popup__features').nextElementSibling.textContent = data.offer.description;
  articleElement.querySelector('img').src = data.author.avatar;
  popUpClose.addEventListener('click', closePopup);
  popUpClose.addEventListener('keydown', function (evt) {
    if (evt.keyCode === ENTER_KEYCODE) {
      closePopup();
    }
  });
  return articleElement;
};

var activateMap = function () {
  mapForm.classList.remove('notice__form--disabled');
  map.classList.remove('map--faded');
  mapPins.appendChild(buttonFragment); // переносим элементы из области клонирования на страницу
  mapForm.classList.remove('notice__form--disabled');
  for (var i = 0; i < allFormElement.length; i++) {
    allFormElement[i].disabled = false;
  }
};

var init = function () {
  for (var i = 0; i < dataArray.length; i++) {
    buttonFragment.appendChild(renderButton(dataArray[i], i));
  }
  for (i = 0; i < allFormElement.length; i++) {
    allFormElement[i].disabled = true;
  }
  mapForm.classList.add('notice__form--disabled');
  mapMainPin.addEventListener('mouseup', activateMap);
};
init();


// Валидация формы
var inputTitle = document.querySelector('#title');
var inputAdress = document.querySelector('#address');
var inputPrice = document.querySelector('#price');
var inputType = document.querySelector('#type');
var inputTimeIn = document.querySelector('#timein');
var inputTimeOut = document.querySelector('#timeout');
var inputRoomNumber = document.querySelector('#room_number');
var inputCapacity = document.querySelector('#capacity');
var TYPES_PRICES = {bungalo: 0, flat: 1000, house: 5000, palace: 10000};
// var ROOMS_GUESTS = {
//   1: [true, true, false, true],
//   2: [true, false, false, true],
//   3: [false, false, false, true],
//   100: [true, true, true, false]
// };

var inputTimeInChange = function () {
  inputTimeOut[inputTimeIn.selectedIndex].selected = true;
};
var inputTimeOutChange = function () {
  inputTimeIn[inputTimeOut.selectedIndex].selected = true;
};

var inputTypeChange = function () {
  inputPrice.min = TYPES_PRICES[inputType.value];
};

// var inputRoomNumberChange = function () {
//   var currentValue = inputRoomNumber.value;
//   var optionCapacity = inputCapacity.options;
//   var guestKey = ROOMS_GUESTS[currentValue];
//
//   for (var i = 0; i < guestKey.length; i++) {
//     optionCapacity[i].disabled = guestKey[i];
//   }
//   if (currentValue <= 3) {
//     for (i = 0; i < optionCapacity.length; i++) {
//       if (optionCapacity[i].value === currentValue) {
//         optionCapacity[i].selected = true;
//       }
//     }
//   } else {
//     optionCapacity[optionCapacity.length - 1].selected = true;
//   }
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

  for (var i = 0; i < optionCapacity.length; i++) {
    optionCapacity[i].disabled = true;
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
  inputTimeIn.addEventListener('change', inputTimeInChange);
  inputTimeOut.addEventListener('change', inputTimeOutChange);
  inputType.addEventListener('change', inputTypeChange);
  inputRoomNumber.addEventListener('change', inputRoomNumberChange);
  mapForm.action = 'https://js.dump.academy/keksobooking';
};

formInit();
