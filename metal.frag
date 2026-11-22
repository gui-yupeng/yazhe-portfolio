precision highp float;
uniform vec2 uResolution;
uniform vec2 uPointer;
uniform float uTime;
uniform float uScroll;
uniform float uHover;
float blend(float a,float b,float k){float h=clamp(.5+.5*(b-a)/k,0.,1.);return mix(b,a,h)-k*h*(1.-h);}
mat2 spin(float a){float c=cos(a),s=sin(a);return mat2(c,-s,s,c);}
vec3 position(){return vec3(.95,.12,0.);}
float surface(vec3 p){
 vec3 q=p-position();q.xz=spin(.28+uScroll*.22)*q.xz;q.xy=spin(-.25+sin(uTime*.2)*.12)*q.xy;
 float fluid=.035*sin(q.x*5.+uTime*1.2)*sin(q.y*4.-uTime*.8)+.022*sin(q.z*7.+q.y*3.+uTime);
 float torus=length(vec2(length(q.xy)-.99,q.z))-.24-fluid;
 vec3 a=position()+vec3(cos(uTime*.48)*.99,sin(uTime*.48)*.99,.04);
 float droplet=length(p-a)-(.3+.035*sin(uTime*.8));
 float d=blend(torus,droplet,.38);
 vec3 pointer=vec3(uPointer,0.);float pulled=length(p-pointer)-.19;
 d=blend(d,mix(10.,pulled,uHover),.46);
 vec3 b=p-vec3(-1.25,.85,-.2);b.xz=spin(uTime*.13+uScroll*.35)*b.xz;b.yz=spin(.7)*b.yz;
 float small=length(vec2(length(b.xy)-.29,b.z))-.075-.01*sin(b.x*12.+uTime*1.4);
 d=min(d,small);
 vec3 c=vec3(-.65,-1.13,-.12)+vec3(sin(uTime*.4)*.08,cos(uTime*.3)*.09,0.);
 d=min(d,length(p-c)-(.14+.015*sin(uTime)));
 return d;
}
vec3 normal(vec3 p){vec2 e=vec2(.002,0.);return normalize(vec3(surface(p+e.xyy)-surface(p-e.xyy),surface(p+e.yxy)-surface(p-e.yxy),surface(p+e.yyx)-surface(p-e.yyx)));}
vec3 environment(vec3 r){
 float sky=.11+.39*smoothstep(-.4,.9,r.y);
 float softbox=pow(max(0.,dot(r,normalize(vec3(-.5,.9,1.)))),13.);
 float strip=exp(-pow((r.x+.28*r.y-.18)*12.,2.))*smoothstep(-.6,.9,r.z);
 float edge=pow(max(0.,dot(r,normalize(vec3(1.,.12,.55)))),45.);
 float darkband=1.-.87*exp(-pow((r.y+.17)*7.,2.));
 return vec3((sky+softbox*1.7+strip*1.6+edge*2.)*darkband);
}
void main(){
 vec2 uv=(gl_FragCoord.xy*2.-uResolution)/uResolution.y;
 vec3 ro=vec3(0.,0.,4.8),rd=normalize(vec3(uv,-3.6));float t=0.;bool hit=false;
 for(int i=0;i<72;i++){vec3 p=ro+rd*t;float d=surface(p);if(d<.0018){hit=true;break;}t+=d*.78;if(t>9.)break;}
 if(!hit){gl_FragColor=vec4(0.);return;}
 vec3 p=ro+rd*t,n=normal(p),r=reflect(rd,n);float facing=max(0.,dot(n,-rd));float fresnel=pow(1.-facing,4.);vec3 chrome=environment(r);
 float ao=clamp(surface(p+n*.12)/.12,.2,1.);chrome*=.75+.25*ao;
 chrome+=vec3(pow(max(0.,dot(reflect(-normalize(vec3(-2.,3.,4.)),n),-rd)),70.)*.8);
 chrome=mix(chrome,vec3(.8),fresnel*.22);chrome=chrome/(chrome+vec3(.55));chrome=pow(chrome,vec3(.95));
 gl_FragColor=vec4(chrome,1.);
}
