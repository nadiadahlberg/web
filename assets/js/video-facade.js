/*
 * Visar YouTube-klipp som miniatyrbild (en vanlig länk, så din egen handpekare
 * fungerar) och byter ut den mot spelaren först när man klickar.
 * Utan JavaScript öppnas klippet på YouTube i stället.
 */
document.querySelectorAll(".video-facade").forEach(function (a) {
  a.addEventListener("click", function (event) {
    event.preventDefault();
    var iframe = document.createElement("iframe");
    iframe.src = "https://www.youtube.com/embed/" + a.dataset.id + "?autoplay=1";
    iframe.title = "YouTube video";
    iframe.allow = "autoplay; fullscreen; picture-in-picture";
    iframe.allowFullscreen = true;
    a.replaceWith(iframe);
  });
});
