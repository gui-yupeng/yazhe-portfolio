// Vanilla 3D VHS shelf adapted to the user's real filmography and cover assets.
(() => {
 const shelf=document.getElementById('worksGrid'),all=window.portfolioProjects;
 const reduce=matchMedia('(prefers-reduced-motion: reduce)');
 shelf.innerHTML='<div class="vhs-viewport"><div class="vhs-stage"></div></div><div class="vhs-caption" aria-live="polite" aria-atomic="true"><div class="vhs-title-mask"><h3 class="vhs-title"></h3></div><p class="vhs-meta"></p></div><div class="vhs-navigation"><button type="button" class="vhs-prev" aria-label="Previous film">←</button><button type="button" class="vhs-open">Explore film <span aria-hidden="true">↗</span></button><button type="button" class="vhs-next" aria-label="Next film">→</button></div><p class="vhs-instruction">DRAG TO BROWSE · SELECT A SPINE · OPEN THE COVER</p>';
 const viewport=shelf.querySelector('.vhs-viewport'),stage=shelf.querySelector('.vhs-stage'),caption=shelf.querySelector('.vhs-title'),meta=shelf.querySelector('.vhs-meta');
 const prev=shelf.querySelector('.vhs-prev'),next=shelf.querySelector('.vhs-next'),open=shelf.querySelector('.vhs-open');
 let films=all,tapes=[],s=0,target=0,H=360,ws=60,d=200,gap=10,active=-1,hover=null;
 let frame=0,last=0,viewportWidth=0,visible=false,paused=false,drag=null,suppress=false,tiltX=0,tiltY=0,mouseX=0,mouseY=0;
 let pendingPointer=null,wheelActive=false,snap=0,sliding=false;
 const settleDistance=.002;
 const bookPalette={latch:['#4c3023','#a78562'],migration:['#30343d','#8b929d'],pause:['#254449','#78999b'],'history-titles':['#502d29','#b08a65'],cheng:['#2a4033','#87a080'],'the-hat':['#342d43','#95839f'],'officer-frank':['#3b382d','#a49b7e']};
 const modulo=(v,n)=>((v%n)+n)%n,smooth=x=>x*x*(3-2*x),clamp=(v,a,b)=>Math.max(a,Math.min(b,v));
 function fill(){
  stage.replaceChildren();tapes=[];hover=null;const n=films.length,copies=n===1?1:Math.max(5,Math.ceil(24/n));s=target=n===1?0:n*Math.floor(copies/2);active=-1;
  for(let v=0;v<n*copies;v++){
   const p=films[v%n],button=document.createElement('button');button.type='button';button.className='vhs-tape';button.tabIndex=-1;button.dataset.id=p.id;
   const tones=bookPalette[p.id]||bookPalette.latch;button.style.setProperty('--book-base',tones[0]);button.style.setProperty('--book-trim',tones[1]);
   button.setAttribute('aria-label',`Select ${p.titleEn}`);
   button.innerHTML=`<span class="vhs-spine"><img src="${p.image}" alt="" draggable="false"><span class="vhs-spine-title">${p.titleEn}</span><span class="vhs-spine-foot">YAZHE GAO <b>YG</b></span></span><span class="vhs-cover"><img src="${p.image}" alt="${p.titleEn} cover" draggable="false"><span class="vhs-cover-credit">${window.L('A YAZHE GAO PROJECT','YAZHE GAO 作品')}</span><span class="vhs-cover-title">${p.titleEn}</span><span class="vhs-cover-foot">${p.typeEn}<b>VHS</b></span></span><span class="vhs-top" aria-hidden="true"></span><span class="vhs-bottom" aria-hidden="true"></span><span class="vhs-pages" aria-hidden="true"></span><span class="vhs-back" aria-hidden="true"><i></i></span>`;
   button.querySelectorAll('img').forEach(img=>img.addEventListener('error',()=>{if(img.getAttribute('src')!==p.fallbackImage)img.src=p.fallbackImage;}));
   const tape={button,v,lift:0,shown:null,focused:null,depth:null,openness:null,transform:''};
   button.addEventListener('pointerenter',()=>{hover=v;start();});button.addEventListener('pointerleave',()=>{if(hover===v)hover=null;start();});
   button.addEventListener('click',()=>{if(suppress)return;const r=relative(v);if(Math.abs(r)<.5&&Math.abs(target-s)<.2)showFilm();else{target=Math.round(s+r);start();}});
   stage.append(button);tapes.push(tape);
  }
  prev.disabled=next.disabled=n<=1;layout();start();
 }
 function relative(v){const n=tapes.length;return modulo(v-s+n/2,n)-n/2;}
 function layout(){
  viewportWidth=viewport.clientWidth;
  H=Math.min(420,Math.max(215,viewportWidth*(innerWidth<621?.58:.32)),innerHeight*.53);ws=H*142/840;d=H*474/900;gap=H*.035;
  stage.style.setProperty('--tape-h',`${H}px`);stage.style.setProperty('--spine-w',`${ws}px`);stage.style.setProperty('--cover-w',`${d}px`);viewport.style.height=`${H+95}px`;draw(0);
 }
 function updateCaption(direction){
  const idx=modulo(Math.round(s),films.length);if(idx===active)return;active=idx;const p=films[idx];
  caption.textContent=p.titleEn;meta.textContent=[p.typeEn,p.year].filter(Boolean).join(' / ');open.setAttribute('aria-label',`Explore ${p.titleEn}`);
  if(!reduce.matches){caption.getAnimations().forEach(a=>a.cancel());caption.animate([{transform:`translateY(${direction<0?'-':'+'}110%)`},{transform:'translateY(0)'}],{duration:550,easing:'cubic-bezier(.2,.8,.2,1)'});}
 }
 function draw(dt){
  const blend=reduce.matches?1:1-Math.exp(-7*dt);
  tiltX+=(mouseY*-5-tiltX)*blend;
  tiltY+=(mouseX*7-tiltY)*blend;
  const liftBlend=reduce.matches?1:1-Math.exp(-12*dt);
  const renderLimit=viewportWidth*.5+d*.85;
  let liftMoving=false;
  for(const tape of tapes){
   const r=relative(tape.v),distance=Math.abs(r),openness=smooth(Math.max(0,1-distance));
   const spread=distance<1?(r+Math.sin(Math.PI*r)/Math.PI)/2:Math.sign(r)*.5;
   const x=r*(ws+gap)+(d-ws+1.6*gap)*spread;
   const shown=Math.abs(x)<renderLimit;
   const button=tape.button;
   if(shown!==tape.shown){
    tape.shown=shown;
    button.hidden=!shown;
   }
   if(!shown){tape.lift=0;continue;}

   const liftTarget=hover===tape.v&&distance>.5?1:0;
   tape.lift+=(liftTarget-tape.lift)*liftBlend;
   if(Math.abs(tape.lift-liftTarget)>.001)liftMoving=true;
   const transform=`translate3d(${x.toFixed(3)}px,${(-openness*.025*H-tape.lift*.045*H).toFixed(3)}px,${(openness*.2*H).toFixed(3)}px) rotateZ(${-4.5*openness}deg) rotateX(${(7+tiltX)*openness}deg) rotateY(${(-86+tiltY)*openness}deg)`;
   if(transform!==tape.transform){
    tape.transform=transform;
    button.style.transform=transform;
   }
   const depth=Math.round(100-distance*4);
   if(depth!==tape.depth){
    tape.depth=depth;
    button.style.zIndex=String(depth);
   }
   if(openness!==tape.openness){
    tape.openness=openness;
    button.style.setProperty('--spine-shade',openness*.55);
    button.style.setProperty('--cover-shade',(1-openness)*.5);
   }
   const focused=distance<.5;
   if(focused!==tape.focused){
    tape.focused=focused;
    button.setAttribute('aria-hidden',String(!focused));
    button.tabIndex=focused?0:-1;
   }
  }
  updateCaption(Math.sign(target-s));
  return liftMoving;
 }
 function tick(now){
  frame=0;
  if(!visible||paused||document.hidden){setSliding(false);return;}
  const dt=last?Math.min((now-last)/1000,.05):1/60;
  last=now;
  if(pendingPointer){
   const rect=viewport.getBoundingClientRect();
   mouseX=clamp((pendingPointer.x-rect.left-rect.width/2)/(d*.55),-1,1);
   mouseY=clamp((pendingPointer.y-rect.top-rect.height/2)/(H*.5),-1,1);
   pendingPointer=null;
  }
  if(reduce.matches||drag?.moved)s=target;
  else s+=(target-s)*(1-Math.exp(-(wheelActive?11:6.5)*dt));
  if(Math.abs(s-target)<settleDistance)s=target;
  const n=films.length;
  if(!drag&&Math.abs(s)>n*8){
   const shift=Math.trunc(s/n)*n;
   s-=shift;
   target-=shift;
  }
  const liftMoving=draw(dt);
  setSliding(!reduce.matches&&(s!==target||!!drag?.moved));
  const unsettled=s!==target||Math.abs(tiltX+mouseY*5)>.01||Math.abs(tiltY-mouseX*7)>.01||liftMoving;
  if(unsettled)frame=requestAnimationFrame(tick);
 }
 function setSliding(next){
  if(next===sliding)return;
  sliding=next;
  window.dispatchEvent(new CustomEvent('portfolio-shelf-motion',{detail:{sliding}}));
 }
 function start(){
  if(!visible||paused||document.hidden)return;
  setSliding(!reduce.matches&&(s!==target||!!drag?.moved));
  if(!frame){last=0;frame=requestAnimationFrame(tick);}
 }
 function stop(){
  cancelAnimationFrame(frame);
  frame=0;
  setSliding(false);
 }
 function showFilm(){
  if(Math.abs(s-target)>.25)return;const tape=tapes.find(t=>Math.abs(relative(t.v))<.5);if(!tape)return;
  target=Math.round(s);window.openPortfolioProject(films[modulo(Math.round(s),films.length)].id,tape.button.querySelector('.vhs-cover'));
 }
 prev.addEventListener('click',()=>{target=Math.round(target)-1;start();});next.addEventListener('click',()=>{target=Math.round(target)+1;start();});open.addEventListener('click',showFilm);
 shelf.addEventListener('keydown',e=>{if(e.key==='ArrowLeft'||e.key==='ArrowRight'){e.preventDefault();if(films.length>1){target=Math.round(target)+(e.key==='ArrowLeft'?-1:1);start();}}else if(e.key==='Enter'&&e.target===shelf){e.preventDefault();showFilm();}});
 viewport.addEventListener('pointerdown',e=>{if(e.button!==0||films.length<2)return;drag={x:e.clientX,y:e.clientY,target,id:e.pointerId,moved:false};suppress=false;});
 viewport.addEventListener('pointermove',e=>{
  pendingPointer={x:e.clientX,y:e.clientY};
  if(drag&&drag.id===e.pointerId){
   const dx=e.clientX-drag.x,dy=e.clientY-drag.y;
   if(!drag.moved&&Math.abs(dy)>Math.abs(dx)&&Math.abs(dy)>7){
    drag=null;
    return;
   }
   if(!drag.moved&&Math.abs(dx)>5){
    drag.moved=true;
    suppress=true;
    viewport.setPointerCapture(e.pointerId);
   }
   if(drag.moved)target=drag.target-dx/(ws+gap);
  }
  start();
 });
 function release(e){
  if(drag?.id!==e.pointerId)return;
  const moved=drag.moved;
  drag=null;
  if(viewport.hasPointerCapture(e.pointerId))viewport.releasePointerCapture(e.pointerId);
  if(moved){
   s=target;
   suppress=true;
   setTimeout(()=>suppress=false,100);
  }
  target=Math.round(target);
  start();
 }
 viewport.addEventListener('pointerup',release);
 viewport.addEventListener('pointercancel',release);
 viewport.addEventListener('lostpointercapture',release);
 viewport.addEventListener('pointerleave',()=>{
  pendingPointer=null;
  mouseX=mouseY=0;
  if(drag&&!drag.moved)drag=null;
  start();
 });
 // Horizontal trackpad movement browses the shelf; ordinary vertical wheel input keeps the page scrolling.
 viewport.addEventListener('wheel',e=>{
  if(films.length<2||(Math.abs(e.deltaX)<=Math.abs(e.deltaY)&&!e.shiftKey))return;
  e.preventDefault();
  target+=(e.deltaX||e.deltaY)/(ws+gap)*.5;
  wheelActive=true;
  clearTimeout(snap);
  snap=setTimeout(()=>{
   wheelActive=false;
   target=Math.round(target);
   start();
  },160);
  start();
 },{passive:false});
 window.addEventListener('portfolio-filter',e=>{films=e.detail.group==='all'?all:all.filter(p=>p.group===e.detail.group);if(!films.length)films=all;fill();});
 new ResizeObserver(layout).observe(shelf);
 new IntersectionObserver(entries=>{
  visible=entries[0]?.isIntersecting??false;
  if(visible)start();else stop();
 },{rootMargin:'120px'}).observe(shelf);
 document.addEventListener('visibilitychange',()=>{if(document.hidden)stop();else start();});
 window.addEventListener('portfolio-video-open',()=>{paused=true;stop();});window.addEventListener('portfolio-video-close',()=>{paused=false;start();});
 reduce.addEventListener('change',()=>{s=target;draw(0);start();});fill();
})();
