const fs=require('fs'),path=require('path');
const sharp=require('C:/Program Files/WindowsApps/OpenAI.CodexPrimaryRuntime.v26-1117-835-0_26.1117.835.0_x64__3k8sg7r9htsxt/dependencies/node/node_modules/sharp');
const size=512,height=Buffer.alloc(size*size),roughness=Buffer.alloc(size*size),patina=Buffer.alloc(size*size);
let seed=5831;const random=()=>{seed=(Math.imul(seed,1664525)+1013904223)>>>0;return seed/4294967296;};
for(let y=0;y<size;y++)for(let x=0;x<size;x++){const i=y*size+x,r=Math.hypot(x-256,y-256),grain=random()-.5,age=Math.sin(x*.017+y*.009)*Math.cos(y*.023-x*.011),lathe=Math.sin(r*1.8)*2;height[i]=Math.max(0,Math.min(255,128+grain*19+lathe+age*6));roughness[i]=205+grain*19+age*18;patina[i]=224+age*17+grain*9;}
for(let i=0;i<90;i++){const x=random()*512,y=random()*512,a=random()*Math.PI*2,len=3+random()*25;for(let k=0;k<len;k++){const px=Math.round(x+Math.cos(a)*k),py=Math.round(y+Math.sin(a)*k);if(px>=0&&px<size&&py>=0&&py<size){height[py*size+px]=103;roughness[py*size+px]=240;}}}
Promise.all([['surface-bump.png',height],['surface-roughness.png',roughness],['surface-patina.png',patina]].map(([name,input])=>sharp(input,{raw:{width:size,height:size,channels:1}}).png().toFile(path.join(__dirname,name)))).then(()=>console.log('Mint micrograin, radial tool marks, fine scratches and patina maps generated.'));
