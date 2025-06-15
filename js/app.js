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
  },{passive:true});
});

// DRAG: only from .winbar → updates left/top
let dragWin = null, offsetX, offsetY;
document.querySelectorAll('.winbar').forEach(bar => {
  bar.addEventListener('mousedown', e=>{
    dragWin = bar.parentElement;
    offsetX = e.clientX - dragWin.offsetLeft;
    offsetY = e.clientY - dragWin.offsetTop;
    document.body.style.userSelect = 'none';
  });
});
window.addEventListener('mousemove', e=>{
  if (dragWin) {
    dragWin.style.left = (e.clientX - offsetX) + 'px';
    dragWin.style.top  = (e.clientY - offsetY) + 'px';
  }
});
window.addEventListener('mouseup', ()=> {
  dragWin = null;
  document.body.style.userSelect = '';
});

// RESIZE: only from edges → updates width/height and left/top for left/top edges
let resizeWin=null, resizeEdge, startX, startY, startW, startH, startL, startT;
function detectEdge(e, win){
  const r = win.getBoundingClientRect(), edge=8;
  const x=e.clientX-r.left, y=e.clientY-r.top;
  if(y<edge) return 'n';
  if(y>r.height-edge) return 's';
  if(x<edge) return 'w';
  if(x>r.width-edge) return 'e';
  return null;
}
document.querySelectorAll('.window').forEach(win=>{
  win.addEventListener('mousedown', e=>{
    const edge = detectEdge(e, win);
    if(!edge) return;
    resizeWin=win; resizeEdge=edge;
    startX=e.clientX; startY=e.clientY;
    startW=win.offsetWidth; startH=win.offsetHeight;
    startL=win.offsetLeft; startT=win.offsetTop;
    win.classList.add('resizing','resize-'+edge);
    document.body.style.userSelect='none';
    e.preventDefault();
  });
});
window.addEventListener('mousemove', e=>{
  document.querySelectorAll('.window').forEach(w=>{
    w.classList.remove('resize-n','resize-s','resize-e','resize-w');
    if(!resizeWin){
      const ed=detectEdge(e,w);
      if(ed) w.classList.add('resize-'+ed);
    }
  });
  if(!resizeWin) return;
  let dx=e.clientX-startX, dy=e.clientY-startY;
  let w=startW, h=startH, l=startL, t=startT;
  const minW=170, minH=110, maxW=900, maxH=500;
  if(resizeEdge==='e') w=Math.min(maxW,Math.max(minW,startW+dx));
  if(resizeEdge==='s') h=Math.min(maxH,Math.max(minH,startH+dy));
  if(resizeEdge==='w'){ w=Math.min(maxW,Math.max(minW,startW-dx)); l=startL+startW-w; }
  if(resizeEdge==='n'){ h=Math.min(maxH,Math.max(minH,startH-dy)); t=startT+startH-h; }
  resizeWin.style.width = w+'px';
  resizeWin.style.height= h+'px';
  resizeWin.style.left  = l+'px';
  resizeWin.style.top   = t+'px';
});
window.addEventListener('mouseup', ()=>{
  if(resizeWin){
    resizeWin.classList.remove('resizing','resize-n','resize-s','resize-e','resize-w');
    resizeWin=null;
    document.body.style.userSelect='';
  }
});

// Activate first window on load
window.addEventListener('DOMContentLoaded', ()=>{
  const first = document.querySelector('.window');
  if(first) first.classList.add('active');
});
