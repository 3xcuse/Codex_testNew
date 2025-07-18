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
  const pickRandom = () => videoIds[Math.floor(Math.random() * videoIds.length)];

  function createPlayer() {
    const id = pickRandom();
    container.innerHTML = '<div id="yt-player"></div>';
    new YT.Player('yt-player', {
      videoId: id,
      playerVars: { autoplay: 1 },
      events: {
        onStateChange: (evt) => {
          if (evt.data === YT.PlayerState.ENDED) {
            createPlayer();
          }
        }
      }
    });
  }

  if (window.YT && window.YT.Player) {
    createPlayer();
  } else {
    const tag = document.createElement('script');
    tag.src = 'https://www.youtube.com/iframe_api';
    const firstScript = document.getElementsByTagName('script')[0];
    firstScript.parentNode.insertBefore(tag, firstScript);
    window.onYouTubeIframeAPIReady = createPlayer;
  }

};

window.addEventListener('DOMContentLoaded', () => {
  window.initRandomVideo();
});
