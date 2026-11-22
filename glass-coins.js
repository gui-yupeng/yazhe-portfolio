import * as T from './ocean/three.module.js';
import {ALLOYS,createMintGeometry,addMintDetails} from './coin-mint.js';
// Original beveled glass geometry and interaction; no paid component source.
const host=document.getElementById('coinViewport'),labels=document.getElementById('coinLabels'),links=document.getElementById('coinCategories');
const reduce=matchMedia('(prefers-reduced-motion: reduce)');
const categories=window.portfolioCategories,counts=window.portfolioCategoryCounts;
const choose=id=>window.selectPortfolioCategory(id);
const coins=categories.map((g,i)=>{
 const button=document.createElement('button');button.type='button';button.className='coin-hit';button.dataset.category=g.id;
 button.setAttribute('aria-label',`${g.en}, ${counts[g.id]} ${counts[g.id]===1?'project':'projects'}`);
 button.innerHTML=`<span class="coin-number">${g.num}</span><span class="coin-label"><strong>${g.en}</strong><small>${String(counts[g.id]).padStart(2,'0')} ${counts[g.id]===1?'PROJECT':'PROJECTS'} ↗</small></span>`;
 button.addEventListener('click',()=>choose(g.id));labels.append(button);
 const link=document.createElement('button');link.type='button';link.textContent=g.en;link.addEventListener('click',()=>choose(g.id));links.append(link);
 return {button,index:i,hover:false,flip:0,x:0,y:0};
});
let renderer,scene,camera,environment,geometry,rimGeometry,bodyMaterial,rimMaterial,glowMaterial,glowTexture,engravingGeometry;
const engravingMaterials=[],engravingTextures=[];
const mintMaterials=[],mintTextures=[],mintGeometries=[];
let frame=0,time=9,flow=9,flowTarget=9,manualUntil=0,last=0,visible=false,paused=false,disposed=false,focused=false,width=1,height=1,halfWidth=4,halfHeight=2.8;
let initialized=false;
function initialize(){if(initialized||disposed)return;initialized=true;
try{
 renderer=new T.WebGLRenderer({alpha:true,antialias:true,powerPreference:'low-power'});
 renderer.setPixelRatio(Math.min(devicePixelRatio||1,1));renderer.setClearColor(0x000000,0);renderer.outputEncoding=T.sRGBEncoding;renderer.toneMapping=T.ACESFilmicToneMapping;renderer.toneMappingExposure=.95;
 renderer.domElement.className='coin-canvas';renderer.domElement.setAttribute('aria-hidden','true');host.prepend(renderer.domElement);
 scene=new T.Scene();camera=new T.OrthographicCamera(-4,4,2.8,-2.8,.1,30);camera.position.set(0,0,10);
 const env=document.createElement('canvas');env.width=1024;env.height=512;const brush=env.getContext('2d');
 const wash=brush.createLinearGradient(0,0,0,512);wash.addColorStop(0,'#160d10');wash.addColorStop(.48,'#4a2025');wash.addColorStop(1,'#080405');brush.fillStyle=wash;brush.fillRect(0,0,1024,512);
 for(const [x,w,color] of [[38,38,'#bfa39b'],[200,130,'#6b3037'],[460,58,'#84625c'],[715,180,'#201215'],[950,25,'#c8ada0']]){brush.fillStyle=color;brush.fillRect(x,0,w,512);}
 brush.fillStyle='#87615d';brush.fillRect(0,35,1024,18);brush.fillStyle='#0e080a';brush.fillRect(0,375,1024,80);
 const texture=new T.CanvasTexture(env);texture.mapping=T.EquirectangularReflectionMapping;texture.encoding=T.sRGBEncoding;
 const pmrem=new T.PMREMGenerator(renderer);environment=pmrem.fromEquirectangular(texture);scene.environment=environment.texture;texture.dispose();pmrem.dispose();
 scene.add(new T.HemisphereLight(0xffd0a0,0x240300,1));
 const key=new T.DirectionalLight(0xd0b3a5,1.3);key.position.set(-3,5,7);scene.add(key);
 const fill=new T.DirectionalLight(0x70464a,.7);fill.position.set(4,-2,3);scene.add(fill);
 const minted=createMintGeometry();geometry=minted.body;mintGeometries.push(minted.reed,minted.bead,minted.innerRim);rimGeometry=new T.TorusGeometry(.945,.009,8,96);
 const surfaceLoader=new T.TextureLoader();const surfaceBump=surfaceLoader.load('assets/coin-metal-reference/surface-bump.png'),surfaceRoughness=surfaceLoader.load('assets/coin-metal-reference/surface-roughness.png'),surfacePatina=surfaceLoader.load('assets/coin-metal-reference/surface-patina.png');mintTextures.push(surfaceBump,surfaceRoughness,surfacePatina);
 bodyMaterial=new T.MeshPhysicalMaterial({color:0x965137,metalness:.96,roughness:.36,transmission:0,clearcoat:.18,clearcoatRoughness:.3,envMapIntensity:1.25,map:surfacePatina,bumpMap:surfaceBump,bumpScale:.009,roughnessMap:surfaceRoughness,side:T.DoubleSide});
 rimMaterial=new T.MeshStandardMaterial({color:0xb47a54,metalness:.98,roughness:.3,envMapIntensity:1.4,bumpMap:surfaceBump,bumpScale:.004});
 // A smooth falloff avoids the bright, sharply defined ring around each coin.
 const glowCanvas=document.createElement('canvas');glowCanvas.width=glowCanvas.height=256;const glowBrush=glowCanvas.getContext('2d'),glow=glowBrush.createRadialGradient(128,128,0,128,128,128);
 for(let step=0;step<=32;step++){const radius=step/32,alpha=.62*(Math.exp(-4*radius*radius)-Math.exp(-4))/(1-Math.exp(-4));glow.addColorStop(radius,`rgba(255,250,242,${alpha})`);}
 glowBrush.fillStyle=glow;glowBrush.fillRect(0,0,256,256);glowTexture=new T.CanvasTexture(glowCanvas);glowMaterial=new T.SpriteMaterial({map:glowTexture,transparent:true,opacity:.85,blending:T.AdditiveBlending,depthTest:true,depthWrite:false});
 const engravingNames={'2d':'Octopus','3d':'Dolphin',aigc:'Seahorse',film:'Sea_turtle'};
 engravingGeometry=new T.PlaneGeometry(1.45,1.45,96,96);const engravingLoader=new T.TextureLoader();
 coins.forEach(c=>{
  const alloy=ALLOYS[c.index%ALLOYS.length],currencyBody=bodyMaterial.clone(),currencyEdge=rimMaterial.clone();currencyBody.color.setHex(alloy.color);currencyBody.roughness=alloy.roughness;currencyEdge.color.setHex(alloy.edge);mintMaterials.push(currencyBody,currencyEdge);
  const group=new T.Group();group.userData.alloy=alloy.name;group.add(new T.Mesh(geometry,currencyBody));addMintDetails(group,minted,currencyEdge);
  for(const z of [-.072,.072]){const rim=new T.Mesh(rimGeometry,currencyEdge);rim.position.z=z;group.add(rim);}group.scale.setScalar(.67);scene.add(group);c.group=group;
  // Keep the halo in world space, behind the entire rotating coin. It follows
  // the coin's center and size without inheriting its flip or tilted depth.
  const halo=new T.Sprite(glowMaterial);halo.renderOrder=-1;scene.add(halo);c.halo=halo;
  const legendCanvas=document.createElement('canvas');legendCanvas.width=legendCanvas.height=512;const legendBrush=legendCanvas.getContext('2d');legendBrush.font='600 13px Arial';legendBrush.textAlign='center';legendBrush.textBaseline='middle';legendBrush.fillStyle='#fff';
  const inscription='YAZHE GAO · FIELD '+categories[c.index].num+' · 2026 ·';
  for(let letter=0;letter<inscription.length;letter++){const angle=-Math.PI/2+letter/inscription.length*Math.PI*2;legendBrush.save();legendBrush.translate(256+Math.cos(angle)*230,256+Math.sin(angle)*230);legendBrush.rotate(angle+Math.PI/2);legendBrush.fillText(inscription[letter],0,0);legendBrush.restore();}
  const legendTexture=new T.CanvasTexture(legendCanvas),legendMaterial=new T.MeshStandardMaterial({map:legendTexture,color:alloy.relief,metalness:.94,roughness:.42,transparent:true,alphaTest:.08,depthWrite:false,bumpMap:legendTexture,bumpScale:.004});const legendGeometry=new T.PlaneGeometry(1.9,1.9);mintTextures.push(legendTexture);mintMaterials.push(legendMaterial);mintGeometries.push(legendGeometry);
  for(const side of [1,-1]){const legend=new T.Mesh(legendGeometry,legendMaterial);legend.position.z=side*.073;if(side<0)legend.rotation.y=Math.PI;group.add(legend);}
  let engravingMaterial;
  const engraving=engravingLoader.load('assets/coin-engraving/'+engravingNames[categories[c.index].id]+'-engraving.svg',()=>{if(disposed){engraving.dispose();return;}const relief=document.createElement('canvas');relief.width=relief.height=512;const reliefBrush=relief.getContext('2d');reliefBrush.fillStyle='#000';reliefBrush.fillRect(0,0,512,512);reliefBrush.drawImage(engraving.image,0,0,512,512);const reliefHeight=new T.CanvasTexture(relief);engravingTextures.push(reliefHeight);engravingMaterial.displacementMap=reliefHeight;engravingMaterial.displacementScale=.018;engravingMaterial.bumpMap=reliefHeight;engravingMaterial.bumpScale=.015;engravingMaterial.needsUpdate=true;engravingMaterial.visible=true;draw(0);},undefined,error=>console.error('Coin engraving:',error));
  engraving.encoding=T.sRGBEncoding;engraving.anisotropy=Math.min(4,renderer.capabilities.getMaxAnisotropy());
  engravingMaterial=new T.MeshStandardMaterial({map:engraving,color:alloy.relief,metalness:.92,roughness:.34,envMapIntensity:1.4,transparent:true,alphaTest:.08,depthWrite:false,polygonOffset:true,polygonOffsetFactor:-1,polygonOffsetUnits:-1,visible:false});
  engravingTextures.push(engraving);engravingMaterials.push(engravingMaterial);
  for(const side of [1,-1]){const etching=new T.Mesh(engravingGeometry,engravingMaterial);etching.position.z=side*.071;if(side<0)etching.rotation.y=Math.PI;group.add(etching);}
  c.button.addEventListener('pointerenter',()=>{c.hover=true;start();});c.button.addEventListener('pointerleave',()=>{c.hover=false;start();});
  c.button.addEventListener('focus',()=>{focused=true;c.hover=true;start();});c.button.addEventListener('blur',()=>{focused=false;c.hover=false;start();});
 });host.classList.add('coins-ready');
}catch(error){console.error('Glass coin renderer unavailable:',error);host.classList.add('coins-fallback');renderer?.dispose();renderer=null;}
layout();
}
const point=new T.Vector3();
function layout(){width=Math.max(1,host.clientWidth);height=Math.max(1,host.clientHeight);halfHeight=2.8;halfWidth=halfHeight*width/height;if(!renderer)return;renderer.setSize(width,height,false);camera.left=-halfWidth;camera.right=halfWidth;camera.top=halfHeight;camera.bottom=-halfHeight;camera.updateProjectionMatrix();draw(0);}
function draw(dt){
 if(!renderer||disposed)return;const mobile=width<680,size=mobile?.72:.95,span=halfHeight*2+size*3.6;
 coins.forEach((c,i)=>{
  const phase=((flow/48+i/categories.length)%1+1)%1;
  const targetX=reduce.matches?(i%2-.5)*halfWidth*.95:(halfWidth+size*1.8)*(1-2*phase);
  const targetY=reduce.matches?(i<2?1.15:-1.15):(halfHeight+size*1.8)*(2*phase-1);
  if(performance.now()<manualUntil||!focused&&!c.hover||reduce.matches){c.x=targetX;c.y=targetY;}
  else if(Math.abs(c.y)>halfHeight-size)c.y=Math.max(-halfHeight+size*1.8,Math.min(halfHeight-size*1.8,c.y));
  c.flip+=(Number(c.hover)-c.flip)*Math.min(1,dt*5);
  const turn=reduce.matches?-.22+i*.09:time*.2+i*.65;
  c.group.position.set(c.x,c.y,Math.sin(i*1.3)*.16);
  c.group.rotation.set((reduce.matches?-.15:Math.sin(time*.18+i)*.3)-c.flip*.2,turn+c.flip*Math.PI,-.13+Math.sin(i)*.12);c.group.scale.setScalar(size*(1+c.flip*.06));
  c.halo.position.set(c.x,c.y,-2);c.halo.scale.set(3.6*c.group.scale.x,3.6*c.group.scale.y,1);
  point.copy(c.group.position).project(camera);const x=(point.x*.5+.5)*width,y=(-point.y*.5+.5)*height,diameter=size*2/(halfHeight*2)*height;
  c.button.style.width=`${diameter*1.2}px`;c.button.style.height=`${diameter*1.35}px`;c.button.style.transform=`translate(${x}px,${y}px) translate(-50%,-44%)`;c.button.style.visibility=Math.abs(c.y)<halfHeight+size*.6?'visible':'hidden';
 });renderer.render(scene,camera);
}
function tick(now){frame=0;if(!active())return;const dt=Math.min((now-(last||now))/1000,.07);if(last&&now-last<32){frame=requestAnimationFrame(tick);return;}last=now;const manual=performance.now()<manualUntil;if(!focused||manual)time+=dt;if(!focused&&!coins.some(c=>c.hover))flowTarget+=dt;flow+=(flowTarget-flow)*(1-Math.exp(-9*dt));draw(dt);frame=requestAnimationFrame(tick);}
function active(){return renderer&&visible&&!document.hidden&&!paused&&!disposed&&!reduce.matches;}
function start(){if(active()&&!frame){last=0;frame=requestAnimationFrame(tick);}else if(!active()){cancelAnimationFrame(frame);frame=0;draw(0);}}
const resize=new ResizeObserver(layout);resize.observe(host);
const intersection=new IntersectionObserver(entries=>{visible=entries[0]?.isIntersecting??false;if(visible)initialize();window.dispatchEvent(new CustomEvent('portfolio-coins-visible',{detail:{visible}}));start();},{rootMargin:'100px'});intersection.observe(host);
document.addEventListener('visibilitychange',start);reduce.addEventListener('change',()=>{draw(0);start();});
window.addEventListener('portfolio-video-open',()=>{paused=true;start();});window.addEventListener('portfolio-video-close',()=>{paused=false;start();});
window.addEventListener('pagehide',()=>{disposed=true;cancelAnimationFrame(frame);resize.disconnect();intersection.disconnect();geometry?.dispose();rimGeometry?.dispose();bodyMaterial?.dispose();rimMaterial?.dispose();glowMaterial?.dispose();glowTexture?.dispose();mintMaterials.forEach(m=>m.dispose());mintTextures.forEach(t=>t.dispose());mintGeometries.forEach(g=>g.dispose());engravingGeometry?.dispose();engravingMaterials.forEach(m=>m.dispose());engravingTextures.forEach(t=>t.dispose());environment?.dispose();renderer?.dispose();},{once:true});
layout();

window.addEventListener('portfolio-language',()=>{coins.forEach((c,i)=>{const g=categories[i];c.button.querySelector('.coin-label strong').textContent=g.en;c.button.querySelector('.coin-label small').textContent=String(counts[g.id]).padStart(2,'0')+' '+window.L(counts[g.id]===1?'PROJECT':'PROJECTS','个作品')+' ↗';c.button.setAttribute('aria-label',g.en);links.children[i].textContent=g.en;});});

// Local wheel/keyboard scrubbing: faster input moves the stream faster; arrows step one category.
const coinControls=document.createElement('div');coinControls.className='coin-navigation';
const previous=document.createElement('button'),next=document.createElement('button'),hint=document.createElement('span');
previous.type=next.type='button';previous.textContent='←';next.textContent='→';
coinControls.append(previous,hint,next);host.after(coinControls);host.tabIndex=0;host.setAttribute('role','region');
function describeControls(){previous.setAttribute('aria-label',window.L('Previous category','上一个分类'));next.setAttribute('aria-label',window.L('Next category','下一个分类'));host.setAttribute('aria-label',window.L('Glass categories. Scrolling continues the page; use left/right keys or buttons to browse.','玻璃分类。上下滚动可继续浏览页面，左右方向键或按钮可切换分类。'));hint.textContent=window.L('SCROLL TO CONTINUE · LEFT / RIGHT TO BROWSE','上下滚动继续浏览 · 左右方向键拨动分类');}
function nudge(amount){
 if(reduce.matches){const all=[...links.querySelectorAll('button')];const at=all.indexOf(document.activeElement);all[(at+(amount>0?1:-1)+all.length)%all.length]?.focus();return;}
 if(!initialized)initialize();manualUntil=performance.now()+1400;flowTarget+=Math.max(-24,Math.min(24,amount));start();
}
previous.addEventListener('click',()=>nudge(-48/categories.length));next.addEventListener('click',()=>nudge(48/categories.length));
host.addEventListener('wheel',event=>{if(event.ctrlKey||reduce.matches)return;const delta=Math.abs(event.deltaX)>Math.abs(event.deltaY)?event.deltaX:event.deltaY;const pixels=delta*(event.deltaMode===1?16:event.deltaMode===2?height:1);nudge(pixels*.02);},{passive:true});
host.addEventListener('keydown',event=>{const direction={ArrowLeft:-1,ArrowRight:1}[event.key];if(!direction)return;event.preventDefault();nudge(direction*48/categories.length);});
window.addEventListener('portfolio-language',describeControls);describeControls();
