/* Conceptual biomass visualization: cellulose, lignin and hemicellulose.
   All coordinates are illustrative. This is not simulation data.
   Native WebGL, no dependencies, normalized progress [0, 1].
   The caller owns reduced-motion and animation preference. */
const clampProgress = value => Math.max(0, Math.min(1, Number(value) || 0));
const ease = value => { const t = clampProgress(value); return t*t*(3-2*t); };

function createBiomassModel() {
  let seed = 84143;
  const random = () => { seed=(1664525*seed+1013904223)>>>0; return seed/4294967296; };
  const atoms=[], clusters=[], fragments=[], links=[], cuts=[];
  const cellulose=[0.52,0.67,0.45], lignin=[0.60,0.35,0.22], hemicellulose=[0.65,0.53,0.19];
  // An ordered, hexagonally packed fibril; every cellulose bead has the
  // same material color. Lighting supplies its apparent tonal variation.
  for(let q=-3;q<=3;q++) for(let r=-3;r<=3;r++) {
    if(Math.abs(q+r)>3)continue;
    const cy=.88*(q+r*.5),cz=.88*.8660254*r;
    for(let k=0;k<32;k++) {
      const x=(k-15.5)*.76, phase=k*Math.PI+(q+r)*.35;
      atoms.push({kind:0,x,y:cy+Math.sin(phase)*.09,z:cz+Math.cos(phase)*.09,
        radius:.49+random()*.055,color:cellulose});
      if(k%3===0)atoms.push({kind:0,x:x+.26,y:cy+.36*Math.cos(phase),z:cz+.36*Math.sin(phase),radius:.28,color:cellulose});
    }
  }
  // Each aggregate retains the same beads and connectivity. Its relaxed
  // pose only loosens the existing coil by a few percent, with a small
  // internal twist, rather than extending branches into a new silhouette.
  function relaxedPoint(point) {
    const [x,y,z]=point, twist=x*.06, c=Math.cos(twist), ss=Math.sin(twist);
    return [x*1.06,(y*c-z*ss)*1.035,(z*c+y*ss)*1.035];
  }
  function trunk(t) {
    return [(t-.5)*1.72+Math.sin(t*4*Math.PI)*.56,
      Math.sin(t*4*Math.PI)*.78,Math.cos(t*4*Math.PI)*.72];
  }
  function branch(t,b) {
    const dx=b%2?1:-1,dt=b<2?1:-1;
    return [Math.sin(t*2.4*Math.PI+b*.12)*.62-Math.sin(b*.12)*.62+dx*t*.32,
      (Math.sin(t*2.9*Math.PI+b*.2)-Math.sin(b*.2))*.52+dt*t*.22,
      (Math.cos(t*2.4*Math.PI)-1)*.41+t*.31];
  }
  for(let c=0;c<11;c++) {
    const angle=c*2.399963+.2;
    clusters.push({x:-10.4+c*2.08,ny:Math.cos(angle),nz:Math.sin(angle),delay:(c%4)*.045,drift:(random()-.5)*4.5});
    const roots=[],start=atoms.length;
    for(let k=0;k<25;k++) {
      roots.push(atoms.length);
      const closed=trunk(k/24);
      atoms.push({kind:1,cluster:c,closed,open:relaxedPoint(closed),
        radius:.35+random()*.035,color:lignin});
      if(k)links.push([atoms.length-2,atoms.length-1,1]);
    }
    const attach=[4,9,15,20];
    for(let b=0;b<4;b++) {
      const root=attach[b],closedRoot=trunk(root/24);
      let previous=roots[root];
      for(let k=1;k<=15;k++) {
        const closedOffset=branch(k/15,b),closed=closedRoot.map((v,i)=>v+closedOffset[i]);
        atoms.push({kind:1,cluster:c,
          closed,open:relaxedPoint(closed),
          radius:.335+random()*.035,color:lignin});
        links.push([previous,atoms.length-1,1]);previous=atoms.length-1;
      }
    }
    clusters[c].start=start;clusters[c].end=atoms.length;
  }
  // Eight long irregular carbohydrate paths drape over the fibril and bulge
  // around nearby lignin aggregates. Sugar beads are slightly smaller than
  // the main cellulose beads. Arc-length sampling keeps each bead visible
  // while maintaining a continuous, irregular carbohydrate chain.
  function path(t,s) {
    const phase=s*1.731;
    const x=(t-.5)*24+.55*Math.sin(t*3.1*Math.PI+phase);
    const angle=s*2.399963+.38+.82*Math.sin(t*2.1*Math.PI+phase)
      +.34*Math.sin(t*5.7*Math.PI+phase*.3)+t*.19;
    let radius=3.45+.35*Math.sin(t*3.7*Math.PI+phase)+.14*Math.sin(t*11*Math.PI+phase*.7);
    for(const c of clusters) {
      const match=Math.max(0,c.ny*Math.cos(angle)+c.nz*Math.sin(angle));
      const dx=(x-c.x)/1.7;
      radius+=.84*Math.pow(match,8)*Math.exp(-dx*dx);
    }
    return [x,Math.cos(angle)*radius,Math.sin(angle)*radius];
  }
  for(let s=0;s<8;s++) {
    const fine=[],lengths=[0];let length=0;
    for(let k=0;k<=1024;k++) {
      const point=path(k/1024,s);fine.push(point);
      if(k){length+=Math.hypot(...point.map((v,i)=>v-fine[k-1][i]));lengths.push(length);}
    }
    const beadsPerPiece=12,count=beadsPerPiece*4,points=[];let cursor=1;
    for(let k=0;k<count;k++) {
      const target=length*k/(count-1);
      while(cursor<1024&&lengths[cursor]<target)cursor++;
      const ratio=(target-lengths[cursor-1])/(lengths[cursor]-lengths[cursor-1]||1);
      points.push(fine[cursor-1].map((v,i)=>v+(fine[cursor][i]-v)*ratio));
    }
    let previous=-1;
    for(let piece=0;piece<4;piece++) {
      const begin=piece*beadsPerPiece,end=begin+beadsPerPiece,center=points[begin+Math.floor(beadsPerPiece/2)];
      const radial=Math.hypot(center[1],center[2]);
      const ny=center[1]/radial,nz=center[2]/radial;
      const tangent=(piece-1.5)*.78+Math.sin(s*1.33)*.4;
      const distance=3.6+(piece%3)*.76+(s%2)*.45;
      const fragment=fragments.length;
      fragments.push({strand:s,piece,dx:(piece-1.5)*.94+Math.cos(s*1.13)*.54,
        dy:ny*distance-nz*tangent,dz:nz*distance+ny*tangent,delay:(s%3)*.025});
      for(let k=begin;k<end;k++) {
        const point=points[k];
        atoms.push({kind:2,x:point[0],y:point[1],z:point[2],fragment,strand:s,piece,
          radius:.47,color:hemicellulose});
        if(previous>=0) {
          if(k===begin&&piece>0)cuts.push([previous,atoms.length-1]);
          else links.push([previous,atoms.length-1,2]);
        }
        previous=atoms.length-1;
      }
    }
  }
  function position(a,p) {
    if(a.kind===0)return[a.x,a.y,a.z];
    if(a.kind===1) {
      const c=clusters[a.cluster],peel=ease((p-c.delay)/.8),relax=ease((p-.14)/.86);
      const local=a.closed.map((v,i)=>v+(a.open[i]-v)*relax);
      const angular=peel*.18*(a.cluster%2?1:-1),ca=Math.cos(angular),sa=Math.sin(angular);
      const ny=c.ny*ca-c.nz*sa,nz=c.nz*ca+c.ny*sa;
      const radial=3.72+local[2]+peel*(4.8+(a.cluster%3)*.82);
      return[c.x+local[0]+peel*c.drift,ny*radial-nz*local[1],nz*radial+ny*local[1]];
    }
    const f=fragments[a.fragment],split=ease((p-.23-f.delay)/.65);
    // Only chain boundaries separate. Every point within a fragment receives
    // the same displacement, preserving each shorter contiguous chain.
    return[a.x+split*f.dx,a.y+split*f.dy,a.z+split*f.dz];
  }
  return{atoms,clusters,fragments,links,cuts,position};
}

// Pure, optional inspection helper for checking p=0, .5 and 1 without a DOM.
// maxLinkRatio <= 1 means adjacent shaded beads continue to overlap.
export function inspectMolecularGeometry(value=0,{includePoints=false}={}) {
  const p=clampProgress(value),model=createBiomassModel();
  const positions=model.atoms.map(a=>model.position(a,p));
  const counts={cellulose:0,lignin:0,hemicellulose:0};
  const names=['cellulose','lignin','hemicellulose'];
  for(const a of model.atoms)counts[names[a.kind]]++;
  const maxLinkRatio={lignin:0,hemicellulose:0};
  for(const [a,b,kind] of model.links) {
    const ratio=Math.hypot(...positions[a].map((v,i)=>v-positions[b][i]))/(model.atoms[a].radius+model.atoms[b].radius);
    maxLinkRatio[names[kind]]=Math.max(maxLinkRatio[names[kind]],ratio);
  }
  const fragmentGaps=model.cuts.map(([a,b])=>Math.hypot(...positions[a].map((v,i)=>v-positions[b][i])));
  const bounds=[[Infinity,-Infinity],[Infinity,-Infinity],[Infinity,-Infinity]];
  for(const point of positions)point.forEach((v,i)=>{bounds[i][0]=Math.min(bounds[i][0],v);bounds[i][1]=Math.max(bounds[i][1],v);});
  const result={progress:p,pointCount:model.atoms.length,counts,ligninClusters:model.clusters.length,
    hemicelluloseStrands:8,hemicellulosePieces:model.fragments.length,maxLinkRatio,
    fragmentGaps,bounds,celluloseColor:[...model.atoms[0].color]};
  if(includePoints)result.points=model.atoms.map((a,i)=>[...positions[i],a.radius,...a.color,a.kind]);
  return result;
}

export function initMolecular(canvas) {
  let progress = 0, frame = 0, disposed = false, width = 1, height = 1, dpr = 1;
  const model = createBiomassModel();
  const atoms = model.atoms;
  const data = new Float32Array(atoms.length * 8);
  let gl = canvas.getContext('webgl', {alpha:true, antialias:true, depth:true, premultipliedAlpha:false, powerPreference:'low-power'});
  let ctx = null, program = null, buffer = null, locations = null, depthExtension = null;
  const vertex = `
    precision highp float;
    attribute vec3 aPosition;
    attribute vec3 aColor;
    attribute float aRadius;
    attribute float aAlpha;
    uniform vec2 uViewport;
    uniform vec2 uCenter;
    uniform float uScale;
    varying vec3 vColor;
    varying float vDepth;
    varying float vRadius;
    varying float vAlpha;
    void main() {
      float perspective = 75.0 / (75.0 - aPosition.z);
      vec2 pixel = uCenter + aPosition.xy * uScale * perspective;
      gl_Position = vec4(pixel / uViewport * 2.0 - 1.0, -aPosition.z / 60.0, 1.0);
      gl_PointSize = aRadius * uScale * perspective * 2.0;
      vColor = aColor; vDepth = aPosition.z; vRadius = aRadius; vAlpha = aAlpha;
    }`;
  function fragment(hasDepth) { return `${hasDepth ? '#extension GL_EXT_frag_depth : enable' : ''}
    precision highp float;
    varying vec3 vColor;
    varying float vDepth;
    varying float vRadius;
    varying float vAlpha;
    void main() {
      vec2 p = vec2(gl_PointCoord.x * 2.0 - 1.0, 1.0 - gl_PointCoord.y * 2.0);
      float rr = dot(p, p);
      if (rr > 1.0) discard;
      vec3 n = vec3(p, sqrt(1.0 - rr));
      vec3 light = normalize(vec3(-0.52, 0.69, 0.72));
      float diffuse = max(dot(n, light), 0.0);
      float specular = pow(max(dot(n, normalize(light + vec3(0.0,0.0,1.0))), 0.0), 40.0);
      float rim = pow(1.0 - n.z, 3.0) * max(n.x, 0.0);
      float depthLight = clamp(0.84 + vDepth * 0.017, 0.64, 1.10);
      vec3 color = vColor * (0.29 + diffuse * 0.70) * depthLight;
      color += vec3(0.87,0.91,0.80) * specular * 0.33;
      color += vec3(0.24,0.33,0.27) * rim * 0.25;
      color = mix(vec3(0.063,0.106,0.098), color, clamp(0.92 + vDepth * 0.007,0.71,1.0));
      gl_FragColor = vec4(color, vAlpha * (1.0 - smoothstep(0.93, 1.0, rr)));
      ${hasDepth ? 'gl_FragDepthEXT = gl_FragCoord.z - n.z * vRadius / 120.0;' : ''}
    }`; }
  function shader(type, source) {
    const s = gl.createShader(type); gl.shaderSource(s, source); gl.compileShader(s);
    if (!gl.getShaderParameter(s, gl.COMPILE_STATUS)) { const e = gl.getShaderInfoLog(s); gl.deleteShader(s); throw new Error(e); }
    return s;
  }
  if (gl) {
    try {
      depthExtension = gl.getExtension('EXT_frag_depth');
      program = gl.createProgram();
      const vs = shader(gl.VERTEX_SHADER, vertex), fs = shader(gl.FRAGMENT_SHADER, fragment(!!depthExtension));
      gl.attachShader(program, vs); gl.attachShader(program, fs); gl.linkProgram(program);
      gl.deleteShader(vs); gl.deleteShader(fs);
      if (!gl.getProgramParameter(program, gl.LINK_STATUS)) throw new Error(gl.getProgramInfoLog(program));
      buffer = gl.createBuffer(); gl.bindBuffer(gl.ARRAY_BUFFER, buffer); gl.bufferData(gl.ARRAY_BUFFER, data.byteLength, gl.DYNAMIC_DRAW);
      locations = {position:gl.getAttribLocation(program,'aPosition'),color:gl.getAttribLocation(program,'aColor'),radius:gl.getAttribLocation(program,'aRadius'),alpha:gl.getAttribLocation(program,'aAlpha'),
        viewport:gl.getUniformLocation(program,'uViewport'),center:gl.getUniformLocation(program,'uCenter'),scale:gl.getUniformLocation(program,'uScale')};
    } catch (error) { console.warn('Molecular renderer unavailable:', error); gl = null; }
  }
  if (!gl) {
    ctx = canvas.getContext('2d');
    if (!ctx) {
      // A failed shader setup has already claimed the WebGL context type.
      const fallback = canvas.cloneNode(false);
      ctx = fallback.getContext('2d');
      canvas.replaceWith(fallback);
      canvas = fallback;
    }
  }
  function geometry(p) {
    const roll = -0.62 + p * 0.09, yaw = -0.28 + p * 0.13, spin = 0.19 + p * 0.26;
    const cr = Math.cos(roll), sr = Math.sin(roll), cy = Math.cos(yaw), sy = Math.sin(yaw), cx = Math.cos(spin), sx = Math.sin(spin);
    let index = 0;
    for (const a of atoms) {
      const [x,y,z] = model.position(a,p);
      const yy=y*cx-z*sx, zz=z*cx+y*sx;
      const xx=x*cy+zz*sy, z2=zz*cy-x*sy;
      data[index++]=xx*cr-yy*sr; data[index++]=xx*sr+yy*cr; data[index++]=z2;
      data[index++]=a.color[0];data[index++]=a.color[1];data[index++]=a.color[2];
      data[index++]=a.radius;data[index++]=1;
    }
  }
  function draw() {
    frame=0; if(disposed) return;
    const p=progress;
    geometry(p);
    const mobile=width/height<0.85;
    // On desktop the camera holds the fibril within the right 60% of the hero.
    const scale=Math.min(width*(mobile?0.033:0.0225),height*0.043);
    const centerX=width*(mobile?0.69:0.755), centerY=height*(mobile?0.39:0.53);
    if(gl) {
      gl.viewport(0,0,width,height);gl.clearColor(0.063,0.106,0.098,0);gl.clear(gl.COLOR_BUFFER_BIT|gl.DEPTH_BUFFER_BIT);
      gl.enable(gl.DEPTH_TEST);gl.depthFunc(gl.LEQUAL);gl.enable(gl.BLEND);gl.blendFunc(gl.SRC_ALPHA,gl.ONE_MINUS_SRC_ALPHA);
      gl.useProgram(program);gl.bindBuffer(gl.ARRAY_BUFFER,buffer);gl.bufferSubData(gl.ARRAY_BUFFER,0,data);
      for(const [key,count,offset] of [['position',3,0],['color',3,12],['radius',1,24],['alpha',1,28]]) {
        gl.enableVertexAttribArray(locations[key]);gl.vertexAttribPointer(locations[key],count,gl.FLOAT,false,32,offset);
      }
      gl.uniform2f(locations.viewport,width,height);gl.uniform2f(locations.center,centerX,centerY);gl.uniform1f(locations.scale,scale);
      gl.drawArrays(gl.POINTS,0,atoms.length);
    } else if(ctx) {
      ctx.clearRect(0,0,width,height);
      const sorted=atoms.map((_,i)=>i).sort((a,b)=>data[a*8+2]-data[b*8+2]);
      for(const i of sorted) {
        const j=i*8, perspective=75/(75-data[j+2]), x=centerX+data[j]*scale*perspective, y=height-centerY-data[j+1]*scale*perspective, r=data[j+6]*scale*perspective;
        const rgb=[data[j+3],data[j+4],data[j+5]].map(v=>Math.round(v*255));
        const g=ctx.createRadialGradient(x-r*.33,y-r*.4,r*.02,x,y,r);
        g.addColorStop(0,`rgb(${rgb.map(v=>Math.min(255,v+43)).join(',')})`);g.addColorStop(.28,`rgb(${rgb.join(',')})`);g.addColorStop(1,`rgb(${rgb.map(v=>Math.round(v*.31)).join(',')})`);
        ctx.fillStyle=g;ctx.beginPath();ctx.arc(x,y,r,0,Math.PI*2);ctx.fill();
      }
    }
  }
  function schedule() { if(!frame&&!disposed)frame=requestAnimationFrame(draw); }
  function resize() {
    const box=canvas.getBoundingClientRect();
    const mobile=box.width<700;
    dpr=Math.min(window.devicePixelRatio||1,mobile?1.25:1.65);
    let w=Math.max(1,Math.round(box.width*dpr)),h=Math.max(1,Math.round(box.height*dpr));
    const cap=Math.min(1,1600/w,1000/h);w=Math.round(w*cap);h=Math.round(h*cap);
    if(w!==width||h!==height){width=w;height=h;canvas.width=w;canvas.height=h;}
    schedule();
  }
  window.addEventListener('resize',resize,{passive:true});
  const observer=typeof ResizeObserver!=='undefined'?new ResizeObserver(resize):null;
  observer?.observe(canvas);resize();
  return {
    setProgress(value) {const p=Math.max(0,Math.min(1,Number(value)||0));if(Math.abs(p-progress)>0.0005){progress=p;schedule();}},
    resize,
    destroy() {disposed=true;cancelAnimationFrame(frame);window.removeEventListener('resize',resize);observer?.disconnect();if(gl){gl.deleteBuffer(buffer);gl.deleteProgram(program);}},
  };
}
