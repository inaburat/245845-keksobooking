'use strict';

(function () {
  window.synchronizeFields = function (elem1, elem2, callback) {
    if (typeof callback === 'function') {
      elem1.addEventListener('change', function() {
        callback(elem2, elem1.value);
      });
      elem2.addEventListener('change', function() {
        callback(elem1, elem2.value);
      });
    }
  };
})();
