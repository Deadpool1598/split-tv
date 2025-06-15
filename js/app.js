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

// RESIZE: only from edges, updating left/top and width/height
interact('.window').resizable({
  edges: { left:true, right:true, top:true, bottom:true },
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
      let { left, top } = {
        left: parseFloat(win.style.left) || 0,
        top: parseFloat(win.style.top) || 0
      };

      // update position if left/top edge is dragged
      if (event.edges.left)  left += event.deltaRect.left;
      if (event.edges.top)   top  += event.deltaRect.top;

      // apply size
      win.style.width  = event.rect.width  + 'px';
      win.style.height = event.rect.height + 'px';

      // apply position
      win.style.left = left + 'px';
      win.style.top  = top  + 'px';
    }
  }
});
