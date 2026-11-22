const videoToggle = document.getElementById('projectVideoToggle');
const videoStatus = document.getElementById('projectVideoStatus');
let activePlayback = null;
let hlsScriptPromise;

function loadHlsPlayer() {
  if (!hlsScriptPromise) {
    hlsScriptPromise = new Promise((resolve, reject) => {
      const script = document.createElement('script');
      script.src = 'assets/hls.light.min.js';
      script.onload = () => resolve(window.Hls);
      script.onerror = () => {
        script.remove();
        hlsScriptPromise = undefined;
        reject(new Error('Could not load the HLS player.'));
      };
      document.head.append(script);
    });
  }
  return hlsScriptPromise;
}

function showProjectCover(project) {
  const previousPlayback = activePlayback;
  activePlayback = null;
  video.pause();
  previousPlayback?.player?.destroy();
  if (video.hasAttribute('src')) {
    video.removeAttribute('src');
    video.load();
  }
  video.hidden = true;
  modal.classList.remove('video-mode');
  videoToggle.hidden = !project?.videoUrl;
  videoToggle.textContent = project?.videoLabel || (
    project?.hlsUrl && location.protocol !== 'file:' ? window.L('Play film in 4K','播放4K版本') : window.L('Play film','播放作品')
  );
  videoStatus.textContent = '';
}

function playProjectVideo(project, preferHighQuality = true) {
  showProjectCover(project);
  const stream = preferHighQuality && location.protocol !== 'file:' ? project.hlsUrl : undefined;
  const original = preferHighQuality && project.originalVideoUrl &&
    video.canPlayType(`video/mp4; codecs="${project.originalVideoCodec}"`);
  const playback = {project, stream, original, player: null};
  activePlayback = playback;
  video.hidden = false;
  video.poster = project.image;
  video.setAttribute('aria-label', project.titleEn);
  modal.classList.add('video-mode');
  videoToggle.textContent = window.L('View cover','查看封面');
  if (project.hlsUrl && !stream) {
    videoStatus.textContent = window.L('Playing the HD version.','正在播放高清版本。');
  }

  function play() {
    if (activePlayback === playback) {
      // Native controls remain available if the browser requires a second gesture.
      video.play().catch(() => {});
    }
  }

  function useMP4() {
    if (activePlayback === playback) {
      playProjectVideo(project, false);
    }
  }

  if (!stream || video.canPlayType('application/vnd.apple.mpegurl')) {
    video.src = stream || (original ? project.originalVideoUrl : project.videoUrl);
    play();
    return;
  }

  loadHlsPlayer().then(Hls => {
    if (activePlayback !== playback) return;
    if (!Hls?.isSupported()) {
      useMP4();
      return;
    }
    const player = new Hls({maxBufferLength: 24, backBufferLength: 30});
    playback.player = player;
    player.on(Hls.Events.MANIFEST_PARSED, play);
    player.on(Hls.Events.ERROR, (_, data) => {
      if (data.fatal) useMP4();
    });
    player.loadSource(stream);
    player.attachMedia(video);
  }).catch(useMP4);
}

videoToggle.addEventListener('click', () => {
  const project = PROJECTS.find(item => item.id === activeProject);
  if (!project?.videoUrl) return;
  if (activePlayback) {
    showProjectCover(project);
  } else {
    playProjectVideo(project);
    video.focus({preventScroll: true});
  }
  video.closest('.modal-card').scrollTop = 0;
});

video.addEventListener('error', () => {
  if (!activePlayback || !video.error) return;
  const {project, stream, original} = activePlayback;
  if (stream || original) {
    playProjectVideo(project, false);
  } else {
    showProjectCover(project);
    videoStatus.textContent = window.L('This video could not be loaded. Try playing it again.','视频暂时无法加载，请重试。');
  }
});
