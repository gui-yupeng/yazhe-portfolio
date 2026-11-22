(() => {
 document.querySelector('.profile-trigger')?.addEventListener('click',()=>document.querySelector('.badge-toggle')?.click());
 if(matchMedia('(prefers-reduced-motion: reduce)').matches)return;
 document.querySelectorAll('.hero-name>span').forEach((line,i)=>line.animate([{transform:'translateY(22px)',clipPath:'inset(100% 0 0)'},{transform:'translateY(0)',clipPath:'inset(0)'}],{duration:1000,delay:160+i*140,easing:'cubic-bezier(.16,.8,.2,1)',fill:'backwards'}));
})();
