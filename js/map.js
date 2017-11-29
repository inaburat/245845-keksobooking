'use strict';

// 1. Создайте массив, состоящий из 8 сгенерированных JS объектов, которые будут описывать похожие объявления неподалеку. Структура объектов должна быть следующей:
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

// --2. У блока .map уберите класс .map--faded--
var map = document.querySelector('.map');
map.classList.remove('map--faded');

// --3.На основе данных, созданных в первом пункте, создайте DOM-элементы, соответствующие меткам на карте, и заполните их данными из массива. Итоговая разметка метки должна выглядеть следующим образом:--
var template = document.querySelector('template').content; // объект с шаблонами
var templateButton = template.querySelector('.map__pin'); // кнопка для клонирования
var mapPins = document.querySelector('.map__pins'); // область для открисовки новых кнопок

// подставляем значения из массива в кнопку
var renderButton = function (data) {
  var buttonElement = templateButton.cloneNode(true); // определяем элемен для возврата из функции
  var buttonCenterX = 65 / 2;
  var buttonBottomY = 84;

  // подствляем нужные значения
  buttonElement.style.left = data.location.x - buttonCenterX + 'px';
  buttonElement.style.top = data.location.y + buttonBottomY + 'px';
  buttonElement.querySelector('img').src = data.author.avatar;
  return buttonElement;
};

// 4.Отрисуйте сгенерированные DOM-элементы в блок .map__pins. Для вставки элементов используйте DocumentFragment.
var buttonFragment = document.createDocumentFragment(); // область для клонирования элементов
for (var i = 0; i < dataArray.length; i++) {
  buttonFragment.appendChild(renderButton(dataArray[i]));
}
mapPins.appendChild(buttonFragment); // переносим элементы из области клонирования на страницу

// 5. На основе первого по порядку элемента из сгенерированного массива и шаблона template article.map__card создайте DOM-элемент объявления, заполните его данными из объекта и вставьте полученный DOM-элемент в блок .map перед блоком .map__filters-container:

var templateAticle = template.querySelector('article.map__card'); // article для клонирования
var articleFlag = document.querySelector('.map__filters-container');

var HOUSE_TYPES = {flat: 'Квартира', bungalo: 'Бунгало', house: 'Дом'};

var renderFeuteres = function (d) {
  var articleElement = templateAticle.cloneNode(true);
  var feuteresList = d.offer.features;
  var feuteresHtml = '';
  if (feuteresList.length) {
    for (i = 0; i < feuteresList.length; i++) {
      var contetn = '<li class="feature feature--' + feuteresList[i] + '"></li>';
      feuteresHtml += contetn;
    }
  }
  return feuteresHtml;
};

// подставляем значения из массива в 'статью'
var renderArticle = function (data) {
  articleElement.querySelector('h3').textContent = data.offer.title;
  articleElement.querySelector('p small').textContent = data.offer.address;
  articleElement.querySelector('.popup__price').innerHTML = data.offer.price + ' &#8381;/ночь';
  articleElement.querySelector('h4').textContent = HOUSE_TYPES[data.offer.type];
  articleElement.querySelector('h4').nextElementSibling.textContent = data.offer.rooms + ' комнаты для ' + data.offer.guests + ' гостей ';
  articleElement.querySelector('.popup__features').previousElementSibling.textContent = 'Заезд после ' + data.offer.checkin + ', выезд до ' + data.offer.checkout;
  articleElement.querySelector('.popup__features').innerHTML = renderFeuteres(data);
  articleElement.querySelector('.popup__features').nextElementSibling.textContent = data.offer.description;
  articleElement.querySelector('img').src = data.author.avatar;
  return articleElement;
};

var articleFragment = document.createDocumentFragment();
articleFragment.appendChild(renderArticle(dataArray[0]));
map.insertBefore(articleFragment, articleFlag);
