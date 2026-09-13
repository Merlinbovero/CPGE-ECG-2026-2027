(function () {
  'use strict';
  var corrections = Array.from(document.querySelectorAll('details.td-correction'));
  document.querySelectorAll('[data-corrections]').forEach(function (button) {
    button.addEventListener('click', function () {
      var open = button.dataset.corrections === 'open';
      corrections.forEach(function (details) { details.open = open; });
    });
  });
  var printState;
  window.addEventListener('beforeprint', function () {
    if (printState) return;
    printState = corrections.map(function (details) { return details.open; });
    corrections.forEach(function (details) { details.open = true; });
  });
  window.addEventListener('afterprint', function () {
    if (!printState) return;
    corrections.forEach(function (details, index) { details.open = printState[index]; });
    printState = null;
  });
})();
