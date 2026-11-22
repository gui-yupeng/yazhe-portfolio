// Scroll depth and work entrances; glass-coins.js owns the live collection.
(() => {
  const root=document.documentElement;
  const reduce=matchMedia('(prefers-reduced-motion: reduce)');
  const clamp=(v,a=0,b=1)=>Math.max(a,Math.min(b,v));
  const ease=t=>t*t*(3-2*t);
  let frame=0,depthEnd=1,lastDepth=-1,lastLife=-1,lastShade=-1;
  function measure(){
    depthEnd=Math.max(innerHeight*3,document.getElementById('about').offsetTop-innerHeight*.3);
    request();
  }
  function render(){
    frame=0;
    const depth=ease(clamp((scrollY-innerHeight*.3)/Math.max(1,depthEnd-innerHeight*.3)));
    root.style.setProperty('--depth','0');
    root.style.setProperty('--abyss','0');
    root.style.setProperty('--ocean-light','1');
    root.style.setProperty('--ocean-saturation','1');
    root.style.setProperty('--ocean-opacity','1');
    window.portfolioCurrentDepth=depth;
    const depthLabel=document.getElementById('depthLabel');if(depthLabel)depthLabel.textContent=depth<.58?window.L('THE TWILIGHT ZONE','暮光水域'):window.L('INTO THE DEEP','深海');
    const depthMeters=document.getElementById('depthMeters');if(depthMeters)depthMeters.textContent=`${Math.round(depth*1200).toLocaleString()} M`;
    const life=1;
    window.portfolioAnimalVisibility=life;
    const contactTop=document.getElementById('contact').getBoundingClientRect().top;
    const shade=ease(clamp((innerHeight*.9-contactTop)/(innerHeight*.8)));
    window.portfolioBottomShade=shade;
    if(Math.abs(depth-lastDepth)>.006||Math.abs(life-lastLife)>.006||Math.abs(shade-lastShade)>.006){window.dispatchEvent(new CustomEvent('ocean-depth',{detail:{depth,life,shade}}));lastDepth=depth;lastLife=life;lastShade=shade;}
  }
  function request(){if(!frame)frame=requestAnimationFrame(render);}
  addEventListener('scroll',request,{passive:true});
  addEventListener('resize',measure,{passive:true});
  reduce.addEventListener('change',request);window.addEventListener('portfolio-language',request);
  const observer=new IntersectionObserver(entries=>entries.forEach(entry=>{if(entry.isIntersecting)entry.target.classList.add('work-entered');else if(entry.boundingClientRect.top>innerHeight)entry.target.classList.remove('work-entered');}),{threshold:.08});
  document.querySelectorAll('#worksGrid>.project').forEach(card=>observer.observe(card));
  document.body.classList.add('motion-enabled');
  // Filtering changes document height, so refresh depth endpoints as well.
  new MutationObserver(measure).observe(document.getElementById('worksGrid'),{attributes:true,subtree:true,attributeFilter:['hidden']});
  window.addEventListener('portfolio-filter',()=>requestAnimationFrame(measure));
  new ResizeObserver(measure).observe(document.querySelector('.site'));
  measure();
})();
