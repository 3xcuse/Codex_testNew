window.initRandomVideo = function() {
  const container = document.getElementById('random-video');
  if (!container) return;
  const videoIds = [
    'Jvv3sMaI4H8',
    'eaXs9Szp96I',
    'vdrHYgIKKkc',
    'Khh_5fRGHwE',
    'lm69j-kYFyM'
  ];
  const id = videoIds[Math.floor(Math.random() * videoIds.length)];
  container.innerHTML = `<iframe width="560" height="315" src="https://www.youtube.com/embed/${id}?autoplay=1" title="Random video" frameborder="0" allow="autoplay; encrypted-media" allowfullscreen></iframe>`;
};

window.addEventListener('DOMContentLoaded', () => {
  window.initRandomVideo();
});
