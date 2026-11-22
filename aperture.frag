precision highp float;
uniform vec2 uResolution;
uniform vec2 uPointer;
uniform float uTime;
uniform float uScroll;
uniform float uHover;
void main(){
 vec2 uv=(gl_FragCoord.xy*2.-uResolution)/uResolution.y;
 vec2 center=uPointer*(3.6/4.8);
 vec2 p=uv-center;
 float a=atan(p.y,p.x);
 float radius=.19+sin(a*3.+uTime*1.8)*.004+sin(a*5.-uTime)*.002;
 float d=length(p),r=d/radius;
 if(r>1.65||uHover<.002){gl_FragColor=vec4(0.);return;}
 // A dark recessed well surrounded by a narrow reflective liquid lip.
 float lip=exp(-pow((r-1.)/.095,2.));
 float highlight=pow(max(0.,cos(a-2.1)),8.)*.82+pow(max(0.,cos(a+.8)),16.)*.52;
 float edge=exp(-pow((r-.96)/.014,2.))*.15;
 float sheen=lip*(.045+highlight)+edge;
 float inside=1.-smoothstep(.89,.98,r);
 float shadow=exp(-pow((r-.83)/.12,2.))*.55;
 float alpha=max(inside*.9,max(lip*.85,shadow))*uHover;
 vec3 colour=vec3(.015+sheen);
 gl_FragColor=vec4(colour,alpha);
}
