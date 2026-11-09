/*
 * Enkel bildspelare: pilar, prickar, tangentbord (vänster/höger) och svepning.
 * Utan JavaScript syns första bilden.
 */
document.querySelectorAll(".slider").forEach(function (slider) {
  var slides = Array.prototype.slice.call(slider.querySelectorAll(".slide"));
  var dotsBox = slider.querySelector(".slider-dots");
  var index = 0;
  if (slides.length < 2) return;

  var dots = slides.map(function (_, i) {
    var d = document.createElement("a");
    d.href = "#";
    d.className = "slider-dot";
    d.setAttribute("aria-label", "Visa bild " + (i + 1));
    d.addEventListener("click", function (e) { e.preventDefault(); go(i); });
    dotsBox.appendChild(d);
    return d;
  });

  function go(n) {
    index = (n + slides.length) % slides.length;
    slides.forEach(function (s, i) { s.classList.toggle("active", i === index); });
    dots.forEach(function (d, i) { d.classList.toggle("active", i === index); });
  }

  slider.querySelector(".slider-prev").addEventListener("click", function (e) { e.preventDefault(); go(index - 1); });
  slider.querySelector(".slider-next").addEventListener("click", function (e) { e.preventDefault(); go(index + 1); });

  document.addEventListener("keydown", function (e) {
    if (e.key === "ArrowLeft") go(index - 1);
    if (e.key === "ArrowRight") go(index + 1);
  });

  var startX = null;
  slider.addEventListener("touchstart", function (e) { startX = e.touches[0].clientX; }, { passive: true });
  slider.addEventListener("touchend", function (e) {
    if (startX === null) return;
    var dx = e.changedTouches[0].clientX - startX;
    if (Math.abs(dx) > 40) go(index + (dx < 0 ? 1 : -1));
    startX = null;
  });

  go(0);
});
