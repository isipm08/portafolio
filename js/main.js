const bg=document.getElementById('bg'),mn=document.getElementById('mn');
const tog=o=>{bg.classList.toggle('open',o);mn.classList.toggle('open',o)};
bg.onclick=()=>tog(!mn.classList.contains('open'));
mn.querySelectorAll('a').forEach(a=>a.onclick=()=>tog(false));
const st=document.getElementById('stage'),ls=document.getElementById('lines'),fl=document.getElementById('flower');
const nodes=[...st.querySelectorAll('.node')];
const base=[[.2,.2],[.78,.1],[.92,.42],[.8,.74],[.45,.9],[.1,.7]];
const ns='http://www.w3.org/2000/svg';
const lines=nodes.slice(1).map(()=>{const l=document.createElementNS(ns,'line');ls.appendChild(l);return l});
function draw(){
  const w=st.clientWidth,h=st.clientHeight,y=Math.min(1,scrollY/innerHeight),s=nodes[0].offsetWidth/2,P=[],k=Math.min(y*2,1);
  nodes.forEach((n,i)=>{
    const x=Math.max(s,Math.min(w-s,base[i][0]*w+Math.sin(y*3.2+i*1.7)*30*k)),yy=Math.max(s,Math.min(h-s,base[i][1]*h+Math.cos(y*3+i*1.3)*34*k-y*40*(i%2?1:-1)));
    n.style.left=(x-s)+'px';n.style.top=(yy-s)+'px';P.push([x,yy]);
  });
  lines.forEach((l,i)=>{l.setAttribute('x1',P[i][0]);l.setAttribute('y1',P[i][1]);l.setAttribute('x2',P[i+1][0]);l.setAttribute('y2',P[i+1][1])});
  fl.style.transform=`translate(-50%,-50%) rotate(${Math.sin(y*2)*6}deg) scale(${1+Math.min(y,1)*.1})`;
}
addEventListener('scroll',draw,{passive:true});addEventListener('resize',draw);
const projs=[...document.querySelectorAll('.proj')],home=['inicio','proyectos','about'].map(i=>document.getElementById(i));
function route(){
  const id=location.hash.slice(1),p=projs.find(x=>x.id===id);
  document.querySelectorAll('.vbox video').forEach(v=>v.pause());
  home.forEach(s=>s.style.display=p?'none':'');
  projs.forEach(x=>x.classList.toggle('show',x===p));
  if(p)scrollTo(0,0);else if(id){const el=document.getElementById(id);el&&el.scrollIntoView()}
  draw();
}
addEventListener('hashchange',route);route();
document.querySelectorAll('.gal').forEach(g=>g.querySelectorAll('.th').forEach(t=>t.onclick=()=>{
  const m=g.querySelector('.main');m.src=t.src;m.style.objectFit=t.dataset.fit;g.querySelectorAll('.th').forEach(x=>x.classList.toggle('on',x===t));
}));
document.addEventListener('click',e=>{const b=e.target.closest('.vid');if(!b)return;const v=b.closest('section').querySelector('video');v.scrollIntoView({block:'center'});v.play().catch(()=>{})});
const SC='abcdefghijklmnopqrstuvwxyz';
function scramble(el,dur=1800,speed=70){
  if(el._r)return;const t=el.dataset.t||(el.dataset.t=el.textContent);el._r=1;
  el.style.minWidth=el.offsetWidth+'px';let i=0;const n=Math.floor(dur/speed);
  const id=setInterval(()=>{i++;el.textContent=[...t].map((c,j)=>c===' '||i/n>(j+1)/t.length?c:SC[Math.random()*26|0]).join('');
    if(i>=n){clearInterval(id);el.textContent=t;el._r=0}},speed);
}
(document.fonts?document.fonts.ready:Promise.resolve()).then(()=>document.querySelectorAll('h1 .sc').forEach((el,i)=>setTimeout(()=>scramble(el),i*250)));
document.querySelectorAll('h1 .sc').forEach(el=>el.addEventListener('pointerenter',()=>scramble(el)));
const io=new IntersectionObserver(e=>e.forEach(x=>{if(x.isIntersecting){x.target.classList.add('in');if(x.target.tagName==='H2')scramble(x.target)}}),{threshold:.15});
document.querySelectorAll('.rv').forEach(r=>io.observe(r));
