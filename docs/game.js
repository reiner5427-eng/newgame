'use strict';
const canvas = document.querySelector('#ocean'), ctx = canvas.getContext('2d');
const $ = id => document.getElementById(id);
let W=1200,H=510,time=0,last=0,mode='welcome',distance=0,speed=0,energy=100,pearls=0,hits=0,elapsed=0,player=0,objects=[],spawn=0,flash=0,sound=false,audio;
let feedbackTime=0;
const keys=new Set();
function feedback(message){$('feedback').textContent=message;feedbackTime=1.1}
$('fullscreen').onclick=async()=>{try{if(document.fullscreenElement)await document.exitFullscreen();else await document.querySelector('.game').requestFullscreen()}catch{feedback('전체 화면을 지원하지 않는 브라우저입니다')}};
function resize(){const r=canvas.getBoundingClientRect();W=r.width;H=r.height;canvas.width=W*devicePixelRatio;canvas.height=H*devicePixelRatio;ctx.setTransform(devicePixelRatio,0,0,devicePixelRatio,0,0)}
window.addEventListener('resize',resize);resize();
function ellipse(x,y,rx,ry,color){ctx.fillStyle=color;ctx.beginPath();ctx.ellipse(x,y,rx,ry,0,0,Math.PI*2);ctx.fill()}
function path(points,color){ctx.fillStyle=color;ctx.beginPath();points.forEach((p,i)=>i?ctx.lineTo(...p):ctx.moveTo(...p));ctx.closePath();ctx.fill()}
function tone(freq,duration=.12){if(!sound)return;audio ||= new (window.AudioContext||window.webkitAudioContext)();audio.resume();const o=audio.createOscillator(),g=audio.createGain();o.connect(g);g.connect(audio.destination);o.frequency.value=freq;o.type='sine';g.gain.setValueAtTime(.07,audio.currentTime);g.gain.exponentialRampToValueAtTime(.001,audio.currentTime+duration);o.start();o.stop(audio.currentTime+duration)}
$('sound').onclick=()=>{sound=!sound;$('sound').textContent=sound?'SOUND ON ↗':'SOUND OFF ↗';$('sound').setAttribute('aria-label',sound?'소리 끄기':'소리 켜기');tone(500)};
function start(){mode='race';distance=0;speed=0;energy=100;pearls=0;hits=0;elapsed=0;player=0;objects=[];spawn=.5;flash=0;feedbackTime=0;$('feedback').textContent='';keys.clear();canvas.focus();$('welcome').classList.add('hidden');$('result').classList.add('hidden');$('pause-label').classList.add('hidden');$('pause').disabled=false;tone(660)}
$('start').onclick=start;$('restart').onclick=start;
function pause(){if(mode==='race'){mode='paused';keys.clear()}else if(mode==='paused')mode='race';$('pause-label').classList.toggle('hidden',mode!=='paused');$('pause').setAttribute('aria-label',mode==='paused'?'계속하기':'일시 정지')}
$('pause').onclick=pause;
window.addEventListener('keydown',e=>{if(['ArrowUp','ArrowDown','ArrowLeft','ArrowRight','Space','KeyW','KeyS','KeyA','KeyD','KeyP'].includes(e.code)){e.preventDefault();if(e.code==='KeyP'&&!e.repeat)pause();else keys.add(e.code)}});
window.addEventListener('keyup',e=>keys.delete(e.code));window.addEventListener('blur',()=>{keys.clear();if(mode==='race')pause()});
for(const [id,key] of [['left','ArrowUp'],['right','ArrowDown'],['boost-button','Space']]){const b=$(id);b.addEventListener('pointerdown',e=>{e.preventDefault();b.setPointerCapture(e.pointerId);keys.add(key)});for(const event of ['pointerup','pointercancel','lostpointercapture'])b.addEventListener(event,()=>keys.delete(key))}
let flipWhale=false;
const whaleImage=new Image(), oceanImage=new Image();
whaleImage.src='assets/whale.png';oceanImage.src='assets/ocean.png';
function useImage(input,image,key){input.addEventListener('change',()=>{const file=input.files[0];if(!file)return;const reader=new FileReader();reader.onload=()=>{image.src=reader.result;if(key==='whale-picture')flipWhale=true;try{localStorage.setItem(key,reader.result)}catch{};feedback('사진이 적용되었어요')};reader.readAsDataURL(file)})}
for(const [id,image,key] of [['whale-file',whaleImage,'whale-picture'],['ocean-file',oceanImage,'ocean-picture']]){try{const saved=localStorage.getItem(key);if(saved){image.src=saved;if(key==='whale-picture')flipWhale=true}}catch{}useImage($(id),image,key)}
function project(x,z){return{x:W+80-z*(W+160),y:H*.5+x*H*.34,s:1}}
function whale(x,y,s,t){ctx.save();ctx.translate(x,y);ctx.rotate(Math.sin(t*3)*.035);const w=Math.min(190,W*.28)*s;if(whaleImage.complete&&whaleImage.naturalWidth){const h=w*whaleImage.naturalHeight/whaleImage.naturalWidth;ctx.save();if(flipWhale)ctx.scale(-1,1);ctx.drawImage(whaleImage,-w/2,-h/2,w,h);ctx.restore()}else{ellipse(0,0,w*.43,w*.23,'#3cbcf2');path([[-w*.35,0],[-w*.65,-w*.25],[-w*.58,0],[-w*.65,w*.2]],'#3cbcf2');ellipse(w*.2,-w*.05,w*.035,w*.045,'#15135a');ellipse(w*.21,-w*.06,w*.012,w*.012,'white')}ctx.restore()}
function background(){const g=ctx.createLinearGradient(0,0,0,H);g.addColorStop(0,'#047c9d');g.addColorStop(.5,'#03415b');g.addColorStop(1,'#052b42');ctx.fillStyle=g;ctx.fillRect(0,0,W,H);
if(oceanImage.complete&&oceanImage.naturalWidth){const iw=oceanImage.naturalWidth,ih=oceanImage.naturalHeight;const scale=Math.max(W/iw,H/ih)*1.08;const dw=iw*scale,dh=ih*scale;const drift=Math.sin(distance/180)*Math.max(0,(dw-W)/2);ctx.drawImage(oceanImage,(W-dw)/2+drift,(H-dh)/2,dw,dh);ctx.fillStyle='#00263b25';ctx.fillRect(0,0,W,H)}
for(let i=0;i<30;i++){const x=((i*127.3-distance*(1+i%3))%(W+60)+W+60)%(W+60)-30;const y=H-((time*(12+i%4*6)+i*97)%H);ctx.strokeStyle='#a6f5ff50';ctx.lineWidth=1;ctx.beginPath();ctx.arc(x,y,2+i%4,0,Math.PI*2);ctx.stroke()}}
function drawObject(o){const p=project(o.x,o.z);ctx.save();ctx.translate(p.x,p.y);ctx.scale(p.s,p.s);if(o.kind==='pearl'){ellipse(0,4,15,7,'#d8f9bb20');ellipse(0,0,13+Math.sin(time*4)*2,13+Math.sin(time*4)*2,'#e4fbc725');ellipse(0,0,7,7,'#ecf6d4');ellipse(-2,-2,2,2,'#fff');}else{ellipse(0,12,34,10,'#073d5550');path([[-32,10],[-25,-13],[-8,-26],[13,-24],[30,-4],[34,12],[5,17]],'#567d83');path([[-25,-13],[-8,-26],[13,-24],[4,-5]],'#87a5a1');ctx.strokeStyle='#f0a48e';ctx.lineWidth=5;ctx.lineCap='round';ctx.beginPath();ctx.moveTo(12,-7);ctx.lineTo(12,-34);ctx.moveTo(12,-18);ctx.lineTo(22,-25);ctx.moveTo(12,-23);ctx.lineTo(3,-30);ctx.stroke()}ctx.restore()}
function update(dt){if(mode!=='race')return;elapsed+=dt;const boosting=keys.has('Space')&&energy>1;speed+=((boosting?112:66)-speed)*dt*2;energy=Math.max(0,Math.min(100,energy+(boosting?-30:13)*dt));player+=((keys.has('ArrowDown')||keys.has('KeyS')||keys.has('ArrowRight')||keys.has('KeyD')?1:0)-(keys.has('ArrowUp')||keys.has('KeyW')||keys.has('ArrowLeft')||keys.has('KeyA')?1:0))*dt*1.45;player=Math.max(-.83,Math.min(.83,player));distance+=speed/3.6*dt;flash=Math.max(0,flash-dt);spawn-=dt;
if(spawn<=0){objects.push({kind:Math.random()<.56?'pearl':'rock',x:(Math.floor(Math.random()*5)-2)*.34,z:0});spawn=.65+Math.random()*.55}
for(const o of objects){o.z+=dt*speed/210;if(o.z>=(W+80-W*.24)/(W+160)&&!o.checked){o.checked=true;if(Math.abs(o.x-player)<(o.kind==='pearl'?.18:.21)){if(o.kind==='pearl'){pearls++;feedback('✦ 진주 +1 · 부스트 충전');energy=Math.min(100,energy+15);tone(880,.18)}else{hits++;feedback('산호 조심! 속도가 줄었어요');speed*=.35;flash=.4;tone(130,.2)}}}}
objects=objects.filter(o=>o.z<1.15);if(distance>=1500){distance=1500;mode='finished';$('pause').disabled=true;$('result').classList.remove('hidden');$('result-title').textContent='바다를 달린 당신!';$('result-copy').textContent=`${Math.floor(elapsed/60)}분 ${Math.floor(elapsed%60)}초 · 진주 ${pearls}개 · 충돌 ${hits}회`;tone(990,.4)}
}
function render(dt){if(mode==='race'){feedbackTime=Math.max(0,feedbackTime-dt);if(!feedbackTime)$('feedback').textContent=''}time+=dt;update(dt);background();const active=mode!=='welcome';if(active)objects.forEach(drawObject);
const px=W*.24, py=H*.5+(active?player:0)*H*.34;
if(mode==='race'){ctx.strokeStyle='#d1f6ed70';ctx.lineWidth=2;for(let i=0;i<5;i++){const offset=(time*100+i*23)%120;ctx.beginPath();ctx.moveTo(px-80-offset,py-22+i*11);ctx.lineTo(px-100-offset,py-22+i*11);ctx.stroke()}}
whale(px,py+Math.sin(time*3)*3,1,time);if(flash){ctx.fillStyle=`rgba(255,140,110,${flash*.5})`;ctx.fillRect(0,0,W,H)}
$('pearls').textContent=pearls;$('timer').textContent=`${Math.floor(elapsed/60)}:${String(Math.floor(elapsed%60)).padStart(2,'0')}`;$('speed').textContent=Math.round(speed);$('distance').textContent=`${Math.floor(distance).toLocaleString()} m`;$('progress').style.width=`${distance/15}%`;$('boost-bar').style.width=`${energy}%`;$('boost-value').textContent=`${Math.round(energy)}%`;
}
function frame(now){const dt=Math.min((now-last)/1000,.05);last=now;render(dt);requestAnimationFrame(frame)}requestAnimationFrame(frame);
