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
  allowFrom: '.winbar',
  modifiers: [
    interact.modifiers.restrictRect({
      restriction: 'parent',
      endOnly: true
    })
  ],
  listeners: {
    move(event) {
      const win = event.target;
      const curLeft = parseFloat(win.style.left) || 0;
      const curTop  = parseFloat(win.style.top)  || 0;
      win.style.left = curLeft + event.dx + 'px';
      win.style.top  = curTop  + event.dy + 'px';
    }
  }
});

// RESIZE: only from edges – bigger hot-zone, no inertia
interact('.window').resizable({
  // which edges to listen on
  edges: { left: true, right: true, top: true, bottom: true },
  // increase the active area by 20px on each edge
  margin: 20,
  inertia: false,
  modifiers: [
    interact.modifiers.restrictSize({
      min: { width: 170, height: 110 },
      max: { width: 900, height: 500 }
    })
  ],
  listeners: {
    move(event) {
      const win = event.target;
      // get current left/top
      let left = parseFloat(win.style.left) || 0;
      let top  = parseFloat(win.style.top)  || 0;

      // if you pull the left/top edges, adjust position
      if (event.edges.left)  left += event.deltaRect.left;
      if (event.edges.top)   top  += event.deltaRect.top;

      // apply new size
      win.style.width  = event.rect.width  + 'px';
      win.style.height = event.rect.height + 'px';
      // apply new position
      win.style.left   = left + 'px';
      win.style.top    = top  + 'px';
    }
    // you can add an end(event) handler here if needed
  }
});

