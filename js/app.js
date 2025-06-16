// Bring clicked window to front & highlight
let zIndexCounter = 200;
document.querySelectorAll('.window').forEach(win => {
  win.addEventListener('mousedown', ()=>{
    document.querySelectorAll('.window').forEach(w=>w.classList.remove('active'));
    win.classList.add('active');
    win.style.zIndex = ++zIndexCounter;
  });
  win.addEventListener('touchstart', ()=>{
    document.querySelectorAll('.window').forEach(w=>w.classList.remove('active'));
    win.classList.add('active');
    win.style.zIndex = ++zIndexCounter;
  }, {passive:true});
});

// DRAG: only from .winbar, updating left/top
interact('.window').draggable({
  inertia: false,
  allowFrom: '.winbar',    // only start drag on the title bar
  modifiers: [
    interact.modifiers.restrictRect({
      restriction: 'parent',
      endOnly: true
    })
  ],
  listeners: {
    move(event) {
      const win = event.target;
      const curL = parseFloat(win.style.left) || 0;
      const curT = parseFloat(win.style.top)  || 0;
      win.style.left = curL + event.dx + 'px';
      win.style.top  = curT + event.dy + 'px';
    }
  }
});

// RESIZE: only from edges – no margin, no inertia, ignore .winbar
interact('.window').resizable({
  edges: { left:true, right:true, top:true, bottom:true },
  inertia: false,
  ignoreFrom: '.winbar',   // never resize when starting on the title bar
  modifiers: [
    interact.modifiers.restrictSize({
      min: { width: 170, height: 110 },
      max: { width: 900, height: 500 }
    })
  ],
  listeners: {
    move(event) {
      const win = event.target;
      let left = parseFloat(win.style.left) || 0;
      let top  = parseFloat(win.style.top)  || 0;

      // if dragging left/top edge, adjust position
      if (event.edges.left)  left += event.deltaRect.left;
      if (event.edges.top)   top  += event.deltaRect.top;

      // apply size
      win.style.width  = event.rect.width  + 'px';
      win.style.height = event.rect.height + 'px';
      // apply position
      win.style.left   = left + 'px';
      win.style.top    = top  + 'px';
    }
  }
// --- 채널14 source switcher ---
const ch14Select = document.getElementById('ch14-source');
const ch14Player = document.getElementById('ch14-player');

ch14Select.addEventListener('change', () => {
  // clear current player
  ch14Player.innerHTML = '';

  if (ch14Select.value === 'embed') {
    // re-insert the original iframe
    const iframe = document.createElement('iframe');
    iframe.src = 'https://www.livehdtv.com/embed/channel-14-isreal-live/';
    iframe.allowFullscreen = true;
    iframe.style.cssText = 'width:100%; height:100%; border:none; display:block;';
    ch14Player.appendChild(iframe);

  } else {
    // create an HLS.js-backed <video>
    const video = document.createElement('video');
    video.id = 'ch14-video';
    video.controls = true;
    video.autoplay = true;
    video.muted = true;
    video.style.cssText = 'width:100%; height:100%; background:#000;';
    ch14Player.appendChild(video);

    // initialize HLS
    if (Hls.isSupported()) {
      const hls = new Hls();
      hls.loadSource('https://ch14channel14contentb-ioriver-cdn.encoders.immergo.tv/master_3.m3u8');
      hls.attachMedia(video);
    } else if (video.canPlayType('application/vnd.apple.mpegurl')) {
      // Safari fallback
      video.src = 'https://ch14channel14contentb-ioriver-cdn.encoders.immergo.tv/master_3.m3u8';
    }
  }
});

