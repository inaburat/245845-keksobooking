'use strict';

(function () {
  var template = document.querySelector('template').content; // объект с шаблонами
  var templateButton = template.querySelector('.map__pin'); // кнопка для клонирования
  var BUTTON_HEIGHT = 64;

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

  window.pin = {
    renderButton: renderButton
  };
})();
