/* Minuteur d'entraînement khôlle : compte à rebours d'1 heure. */
(function () {
  "use strict";
  var TOTAL = 60 * 60; // 1 heure
  var remaining = TOTAL, timer = null;

  function el(id) { return document.getElementById(id); }
  function fmt(s) {
    var m = Math.floor(s / 60), r = s % 60;
    return (m < 10 ? "0" : "") + m + ":" + (r < 10 ? "0" : "") + r;
  }
  function render() {
    var t = el("kh-time"); if (t) t.textContent = fmt(remaining);
    var bar = el("kh-bar"); if (bar) bar.style.width = (100 * remaining / TOTAL) + "%";
  }
  function tick() {
    remaining--;
    if (remaining <= 0) {
      remaining = 0; render(); stop();
      var t = el("kh-time"); if (t) t.textContent = "Temps écoulé";
      return;
    }
    render();
  }
  function start() { if (timer) return; timer = setInterval(tick, 1000); }
  function stop() { if (timer) { clearInterval(timer); timer = null; } }
  function reset() { stop(); remaining = TOTAL; render(); var t = el("kh-time"); if (t) t.textContent = fmt(remaining); }

  function init() {
    if (!el("kh-time")) return;
    render();
    var b;
    if ((b = el("kh-start"))) b.addEventListener("click", start);
    if ((b = el("kh-pause"))) b.addEventListener("click", stop);
    if ((b = el("kh-reset"))) b.addEventListener("click", reset);
  }
  if (document.readyState === "loading") document.addEventListener("DOMContentLoaded", init);
  else init();
})();
