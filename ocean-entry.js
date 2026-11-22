import {createScene} from './ocean/scene.js';
const target=document.getElementById('ocean-background');
const canvas=document.createElement('canvas');
const status=document.getElementById('ocean-status');
const controls=document.querySelector('.ocean-controls');
let saved={};try{saved=JSON.parse(localStorage.getItem('yazhe:ocean:v1')||'{}');}catch{}
const settings={...saved,silverCount:40,reefCount:10,clownCount:6,turtleCount:0,performanceMode:0,defaultCreaturesEnabled:1,eventsEnabled:1,introEnabled:1};
const scene=createScene(target,canvas,settings,message=>{
  status.hidden=false;status.textContent='The ocean needs WebGL. Your portfolio is still available.';console.error(message);
},values=>{try{localStorage.setItem('yazhe:ocean:v1',JSON.stringify({...values,turtleCount:0}));}catch{}},{included:()=>['school','storm','meteor','duo'],started:()=>{}});
scene.api?.setAnimalVisibility(1);
scene.api?.setDiveDepth((window.portfolioBottomShade??0)*.9);
scene.ready.then(()=>{status.hidden=true;controls.querySelectorAll('button').forEach(b=>b.disabled=false);}).catch(()=>{});
controls.querySelectorAll('button').forEach(b=>b.disabled=true);
// Forward only the exposed water area; cards, text panels and controls own their input.
const excluded='a,button,input,textarea,select,video,.modal,.identity-badge,.badge-rig,.ability,.project,.hero-copy,.eyebrow,.hero h2,.section-head,.statement,.contact-box,.filterbar';
for(const type of ['pointermove','pointerdown','pointerup','pointercancel']) {
  window.addEventListener(type,event=>{
    if(scene.disposed||event.target===canvas||document.body.classList.contains('play-open'))return;
    const blocked=event.target.closest?.(excluded);
    if(blocked&&type!=='pointerup'&&type!=='pointercancel')return;
    canvas.dispatchEvent(new PointerEvent(type,{clientX:event.clientX,clientY:event.clientY,pointerId:event.pointerId,pointerType:event.pointerType,button:event.button,buttons:event.buttons}));
  },{passive:true});
}
function sync(){
  const state=scene.api?.stats.state;if(!state)return;
  const sound=controls.querySelector('[data-ocean="sound"]');sound.setAttribute('aria-pressed',String(state.sound));sound.textContent=state.sound?window.L('Sound on','声音开启'):window.L('Sound off','声音关闭');
  controls.querySelector('[data-ocean="whirl"]').setAttribute('aria-pressed',String(state.whirl));
}
controls.addEventListener('click',e=>{
  const button=e.target.closest('[data-ocean]');if(!button||!scene.api)return;
  const action=button.dataset.ocean;
  if(['jelly','manta'].includes(action)){
    try{scene.api.addCreature(action==='jelly'?'moon':action,.35+Math.random()*.3,.4+Math.random()*.2);}catch(error){status.hidden=false;status.textContent=String(error.message).includes('48')?'The ocean is full of life (48 creatures).':'Could not add this creature. Please try again.';setTimeout(()=>status.hidden=true,3000);}
  }else scene.api.action(action);
  sync();
});
const explore=document.getElementById('explore-ocean');
explore.addEventListener('click',()=>{
  const active=document.body.classList.toggle('ocean-exploring');explore.setAttribute('aria-pressed',String(active));explore.textContent=active?window.L('Back to portfolio ↙','返回作品集 ↙'):window.L('Explore the ocean ↗','自由探索海洋 ↗');
  document.querySelector('.site').inert=active;document.querySelector('.nav').inert=active;
});
document.addEventListener('keydown',e=>{if(e.key==='Escape'&&document.body.classList.contains('ocean-exploring'))explore.click();});
let videoOpen=false;
const refreshPause=()=>scene.setPaused(videoOpen);
window.addEventListener('portfolio-video-open',()=>{videoOpen=true;refreshPause();scene.api?.audioSuspend();});
window.addEventListener('portfolio-video-close',()=>{videoOpen=false;refreshPause();});

// Shift the existing water's lighting as the page descends; never rebuild the seabed per scroll.
window.addEventListener('ocean-depth',event=>{
  scene.api?.setAnimalVisibility(1);
  scene.api?.setDiveDepth((event.detail.shade??0)*.9);
});
window.addEventListener('portfolio-coins-visible',event=>{scene.api?.setParameter('performanceMode',event.detail.visible?1:0,false);});
window.addEventListener('pagehide',()=>scene.dispose(),{once:true});
// Read-only preview diagnostics for frame, creature and quality verification.
window.portfolioOcean={snapshot:()=>scene.snapshot()};

window.addEventListener('portfolio-language',()=>{sync();explore.textContent=document.body.classList.contains('ocean-exploring')?window.L('Back to portfolio ↙','返回作品集 ↙'):window.L('Explore the ocean ↗','自由探索海洋 ↗');});
