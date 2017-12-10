'use strict';

(function () {
  var template = document.querySelector('template').content; // объект с шаблонами
  var templateArticle = template.querySelector('article.map__card'); // article для клонирования

  var map = document.querySelector('.map');
  var articleFragment = document.createDocumentFragment();
  var articleFlag = document.querySelector('.map__filters-container');
  var HOUSE_TYPES = {flat: 'Квартира', bungalo: 'Бунгало', house: 'Дом'};

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
    articleElement.querySelector('.popup__features').innerHTML = window.card.renderFeuteres(data);
    articleElement.querySelector('.popup__features').nextElementSibling.textContent = data.offer.description;
    articleElement.querySelector('img').src = data.author.avatar;
    popUpClose.addEventListener('click', closePopup);
    popUpClose.addEventListener('keydown', onPopupEnterPress);
    return articleElement;
  };
  var onPopupEnterPress = function (evt) {
    window.util.isEnterEvent(evt, closePopup);
  };
  var onPopupEscPress = function (evt) {
    window.util.isEscEvent(evt, closePopup);
  };
  var openPopup = function (evt) {
    var popUp = document.querySelector('.map__card');
    if (popUp) {
      closePopup();
    }
    evt.currentTarget.classList.add('map__pin--active');
    articleFragment.appendChild(window.card.renderArticle(window.map.getDataById(evt.currentTarget.dataset.index)));
    map.insertBefore(articleFragment, articleFlag);
    document.addEventListener('keydown', onPopupEscPress);
  };
  var closePopup = function () {
    var activePin = document.querySelector('.map__pin--active');
    var popUp = document.querySelector('.map__card');

    map.removeChild(popUp);
    activePin.classList.remove('map__pin--active');
    document.removeEventListener('keydown', onPopupEscPress);
  };
  window.card = {
    renderFeuteres: renderFeuteres,
    renderArticle: renderArticle,
    openPopup: openPopup,
    closePopup: closePopup
  };
})();
