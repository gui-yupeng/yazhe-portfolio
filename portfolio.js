const filters = document.getElementById('filters');
const worksGrid = document.getElementById('worksGrid');
const modal = document.getElementById('modal');
const close = document.getElementById('close');
const cover = document.getElementById('modalCover');
const video = document.getElementById('modalVideo');
const title = document.getElementById('modalTitle');
const desc = document.getElementById('modalDesc');
const meta = document.getElementById('modalMeta');
const note = document.getElementById('modalNote');
let activeProject = null;
let returnFocus = null;
window.portfolioCategories=GROUPS;
window.portfolioProjects=PROJECTS;
window.portfolioCategoryCounts=Object.fromEntries(GROUPS.map(g=>[g.id,PROJECTS.filter(p=>p.group===g.id).length]));
window.selectPortfolioCategory=group=>{setFilter(group);document.getElementById('worksHeading').focus({preventScroll:true});document.getElementById('works').scrollIntoView({behavior:matchMedia('(prefers-reduced-motion: reduce)').matches?'instant':'smooth'});};
filters.innerHTML = [{id:'all',en:window.L('All works','全部作品')},...GROUPS].map((g,i)=>`<button class="filter ${i===0?'active':''}" data-filter="${g.id}" aria-pressed="${i===0}">${g.en}</button>`).join('');
function setFilter(group) {
  filters.querySelectorAll('button').forEach(b=>{b.classList.toggle('active',b.dataset.filter===group);b.setAttribute('aria-pressed',String(b.dataset.filter===group));});
  window.dispatchEvent(new CustomEvent('portfolio-filter',{detail:{group}}));
  const category=GROUPS.find(g=>g.id===group);
  const count=PROJECTS.filter(p=>group==='all'||p.group===group).length;
  document.getElementById('worksSelection').textContent=`${category?.en||window.L('All works','全部作品')} · ${count} ${window.L(count===1?'project':'projects','个作品')}`;
}
document.addEventListener('click',e=>{const filter=e.target.closest('[data-filter]');if(filter)setFilter(filter.dataset.filter);});
function openProject(id, trigger) {
  const p=PROJECTS.find(p=>p.id===id);if(!p)return;
  activeProject=id;returnFocus=trigger?.closest('button')||trigger;showProjectCover(p);
  cover.onerror=()=>{cover.onerror=null;cover.src=p.fallbackImage;};
  cover.src=p.image;cover.alt=p.titleEn;
  title.textContent=p.titleEn;desc.textContent=p.descEn;meta.textContent=`${p.typeEn} / ${p.meta}`;note.textContent=p.processEn||'';note.hidden=!p.processEn;
  modal.classList.add('open');modal.setAttribute('aria-hidden','false');
  document.querySelector('.site').inert=true;document.querySelector('.nav').inert=true;document.querySelector('.ocean-controls').inert=true;
  document.body.classList.add('modal-open');window.dispatchEvent(new Event('portfolio-video-open'));close.focus();
  if(trigger?.getBoundingClientRect&&!matchMedia('(prefers-reduced-motion: reduce)').matches){
    const r=trigger.getBoundingClientRect();
    if(r.width>0&&r.height>0){
      modal.getAnimations().forEach(animation=>animation.cancel());
      modal.animate([{clipPath:`inset(${Math.max(0,r.top)}px ${Math.max(0,innerWidth-r.right)}px ${Math.max(0,innerHeight-r.bottom)}px ${Math.max(0,r.left)}px round 3px)`,transform:'rotate(-4.5deg)'},{clipPath:'inset(0px 0px 0px 0px round 0px)',transform:'rotate(0deg)'}],{duration:760,easing:'cubic-bezier(.76,0,.18,1)'});
    }
  }
}
function closeModal() {
  if(!modal.classList.contains('open'))return;
  showProjectCover();modal.classList.remove('open');modal.setAttribute('aria-hidden','true');document.body.classList.remove('modal-open');
  document.querySelector('.site').inert=false;document.querySelector('.nav').inert=false;document.querySelector('.ocean-controls').inert=false;
  window.dispatchEvent(new Event('portfolio-video-close'));returnFocus?.focus({preventScroll:true});
}
close.addEventListener('click',closeModal);modal.addEventListener('click',e=>{if(e.target===modal)closeModal();});
document.addEventListener('keydown',e=>{
  if(!modal.classList.contains('open'))return;
  if(e.key==='Escape')closeModal();
  if(e.key==='Tab'){
    const items=[...modal.querySelectorAll('button,video,a[href],[tabindex="0"]')].filter(el=>!el.hidden&&el.getClientRects().length);
    const first=items[0],last=items.at(-1);
    if(e.shiftKey&&document.activeElement===first){e.preventDefault();last.focus();}
    else if(!e.shiftKey&&document.activeElement===last){e.preventDefault();first.focus();}
  }
});

window.openPortfolioProject=(id,trigger)=>openProject(id,trigger);

window.addEventListener('portfolio-language',()=>{
 const selected=filters.querySelector('.active')?.dataset.filter||'all';
 filters.innerHTML=[{id:'all',en:window.L('All works','全部作品')},...GROUPS].map(g=>`<button class="filter ${g.id===selected?'active':''}" data-filter="${g.id}" aria-pressed="${g.id===selected}">${g.en}</button>`).join('');
 setFilter(selected);
 if(activeProject&&modal.classList.contains('open')){const p=PROJECTS.find(p=>p.id===activeProject);title.textContent=p.titleEn;desc.textContent=p.descEn;meta.textContent=`${p.typeEn} / ${p.meta}`;note.textContent=p.processEn||'';videoToggle.textContent=typeof activePlayback!=='undefined'&&activePlayback?window.L('View cover','查看封面'):(p.videoLabel||window.L('Play film','播放作品'));}
});
