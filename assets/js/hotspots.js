/*
 * Gör om <area>-ytor i en bildkarta till vanliga <a>-länkar som ligger över bilden.
 *
 * Varför: Chrome kraschar när <area> får en egen cursor-bild (cursor:url(...)).
 * Vanliga länkar har inte det problemet, så handpekaren fungerar på dem.
 * Skriptet ersätter också image-map-resizer, eftersom länkarna skalas med bilden.
 *
 * <map>-elementet i HTML:en får ligga kvar. Om skriptet inte körs fungerar
 * bildkartan som vanligt.
 */
(function () {
  "use strict";

  var layers = [];

  function build(img) {
    var mapName = (img.getAttribute("usemap") || "").replace("#", "");
    var map = mapName && document.querySelector('map[name="' + mapName + '"]');
    if (!map || !img.naturalWidth) return;

    var layer = document.createElement("div");
    layer.className = "hotspot-layer";
    layer.style.cssText = "position:absolute;left:0;top:0;width:0;height:0;z-index:50;";

    var areas = map.querySelectorAll("area");
    var items = [];

    areas.forEach(function (area) {
      var c = (area.getAttribute("coords") || "").split(",").map(Number);
      var shape = (area.getAttribute("shape") || "rect").toLowerCase();
      var box;

      if (shape === "circle" && c.length >= 3) {
        box = { x: c[0] - c[2], y: c[1] - c[2], w: c[2] * 2, h: c[2] * 2, round: true };
      } else if (c.length >= 4) {
        box = {
          x: Math.min(c[0], c[2]), y: Math.min(c[1], c[3]),
          w: Math.abs(c[2] - c[0]), h: Math.abs(c[3] - c[1])
        };
      } else {
        return;
      }

      var a = document.createElement("a");
      a.href = area.getAttribute("href") || "#";
      a.setAttribute("aria-label", area.getAttribute("alt") || "");
      a.draggable = false;
      a.style.cssText = "position:absolute;display:block;" + (box.round ? "border-radius:50%;" : "");
      layer.appendChild(a);
      items.push({ el: a, box: box });
    });

    document.body.appendChild(layer);
    // Området styrs nu av länkarna, inte av bildkartan.
    img.removeAttribute("usemap");

    var entry = { img: img, layer: layer, items: items };
    layers.push(entry);
    position(entry);

    if (window.ResizeObserver) {
      new ResizeObserver(function () { position(entry); }).observe(img);
    }
  }

  function position(entry) {
    var r = entry.img.getBoundingClientRect();
    var sx = r.width / entry.img.naturalWidth;
    var sy = r.height / entry.img.naturalHeight;
    var ox = r.left + window.pageXOffset;
    var oy = r.top + window.pageYOffset;

    entry.items.forEach(function (it) {
      var s = it.el.style;
      s.left = (ox + it.box.x * sx) + "px";
      s.top = (oy + it.box.y * sy) + "px";
      s.width = (it.box.w * sx) + "px";
      s.height = (it.box.h * sy) + "px";
    });
  }

  function positionAll() {
    layers.forEach(position);
  }

  function init() {
    document.querySelectorAll("img[usemap]").forEach(function (img) {
      if (img.complete && img.naturalWidth) {
        build(img);
      } else {
        img.addEventListener("load", function () { build(img); }, { once: true });
      }
    });
    window.addEventListener("resize", positionAll);
    window.addEventListener("load", positionAll);
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", init);
  } else {
    init();
  }
})();
