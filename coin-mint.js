import * as T from './ocean/three.module.js';
export const ALLOYS=Object.freeze([
 {name:'Red copper',color:0x965137,edge:0xb47a54,relief:0xd3ad87,roughness:.36},
 {name:'Aged bronze',color:0x796044,edge:0xa48b65,relief:0xc2ac88,roughness:.43},
 {name:'Rose copper',color:0x8d5141,edge:0xb17b61,relief:0xd2ac91,roughness:.34},
 {name:'Dark brass',color:0x896b40,edge:0xb09463,relief:0xcfb98e,roughness:.39}
]);
export function createMintGeometry(){
 const profile=[[0,-.064],[.83,-.064],[.93,-.068],[.985,-.054],[1,-.03],[1,.03],[.985,.054],[.93,.068],[.83,.064],[0,.064]].map(p=>new T.Vector2(...p));
 const body=new T.LatheGeometry(profile,96);body.rotateX(Math.PI/2);
 return {body,reed:new T.BoxGeometry(.018,.013,.10),bead:new T.SphereGeometry(.008,5,4),innerRim:new T.TorusGeometry(.76,.005,6,96)};
}
export function addMintDetails(group,geometry,material){
 const reeds=new T.InstancedMesh(geometry.reed,material,120),dummy=new T.Object3D();
 for(let i=0;i<120;i++){const a=i/120*Math.PI*2;dummy.position.set(Math.cos(a)*.992,Math.sin(a)*.992,0);dummy.rotation.set(0,0,a);dummy.updateMatrix();reeds.setMatrixAt(i,dummy.matrix);}reeds.instanceMatrix.needsUpdate=true;group.add(reeds);
 const beads=new T.InstancedMesh(geometry.bead,material,144);let index=0;
 for(const z of [-.07,.07]){const ring=new T.Mesh(geometry.innerRim,material);ring.position.z=z;group.add(ring);for(let i=0;i<72;i++){const a=i/72*Math.PI*2;dummy.position.set(Math.cos(a)*.90,Math.sin(a)*.90,z);dummy.rotation.set(0,0,0);dummy.updateMatrix();beads.setMatrixAt(index++,dummy.matrix);}}
 beads.instanceMatrix.needsUpdate=true;group.add(beads);
 return {reedCount:120,beadCount:144};
}
