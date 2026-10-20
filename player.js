function initCottagePlayer(){
 const defaults={top:'wear-top-0',bottom:'wear-bottom-0',hair:'wear-hair-0',headwear:'wear-headwear-0',accessory:'wear-accessory-0',skin:'#e6bb96',hairColor:'#644f41',position:{x:6,y:6}};
 state.avatar={...defaults,...state.avatar};
 for(const [slot] of wardrobeSlots){if(!state.owned.includes(`wear-${slot}-0`))state.owned.push(`wear-${slot}-0`);if(!state.owned.includes(state.avatar[slot]))state.avatar[slot]=`wear-${slot}-0`}
 if(state.equipped.includes('hat')){state.avatar.headwear='hat';state.equipped=state.equipped.filter(id=>id!=='hat')}
 for(const key of ['skin','hairColor'])if(!/^#[0-9a-f]{6}$/i.test(state.avatar[key]))state.avatar[key]=defaults[key];
 state.paidPrices=state.paidPrices||{};state.purchasedCatalog=state.purchasedCatalog||{};
 for(const id of state.owned){const item=cottageItems.find(i=>i.id===id);if(item&&item.price>0&&state.paidPrices[id]===undefined)state.paidPrices[id]=item.price}
}
function playerSprite(override=null,pose='stand'){return designedPlayer(override,pose)}
function playerPanel(){return `<section class="player-panel"><div class="player-portrait">${playerSprite()}</div><div class="player-details"><h2>我的人物</h2><p class="sub">基础款免费，肤色与发色自由选择。</p><div class="player-colors"><label>肤色 <input type="color" data-player-color="skin" value="${state.avatar.skin}" aria-label="选择肤色"></label><label>发色 <input type="color" data-player-color="hairColor" value="${state.avatar.hairColor}" aria-label="选择发色"></label><button class="btn light" data-open-wardrobe>挑选装扮</button></div></div></section>`}
function cottagePlayerHTML(){const p=state.avatar.position||{x:6,y:6},rest=state.avatar.interaction,owner=rest&&state.equipped.includes(rest.furniture)?state.layout[rest.furniture]:null,item=owner?cottageItems.find(i=>i.id===rest.furniture):null,size=item?cottageSize(item,owner):null;const pose=owner?rest.pose:'stand',left=owner?(owner.x+size.w/2)/12*100:(p.x+.5)/12*100,top=owner?(owner.y+size.h-(pose==='lie'?.08:.18))/8*100:(p.y+1)/8*100;return `<button class="cottage-player player-${pose} ${owner?.rotated?'rest-rotated':''}" data-player data-player-pose="${pose}" aria-label="我的人物，${pose==='lie'?'躺在床上':pose==='sit'?'坐着':'方向键移动'}" style="left:${left}%;top:${top}%;z-index:${owner?12+owner.y+size.h:22+p.y}">${playerSprite(null,pose)}${pose==='lie'?'<span class="player-quilt" aria-hidden="true"></span>':''}</button>`}
let cottageWalk=null,cottageWalkTimer=null;
function cottageWalkPath(start,target){
 const key=p=>`${p.x},${p.y}`,queue=[start],parents=new Map([[key(start),null]]);
 for(let n=0;n<queue.length;n++){const p=queue[n];if(p.x===target.x&&p.y===target.y){const path=[];let node=p;while(node){path.push(node);node=parents.get(key(node))}return path.reverse()}for(const [dx,dy]of [[0,1],[1,0],[-1,0],[0,-1]]){const q={x:p.x+dx,y:p.y+dy},k=key(q);if(q.x<0||q.x>11||q.y<3||q.y>7||parents.has(k)||!cottagePetCellFree(q.x,q.y))continue;parents.set(k,p);queue.push(q)}}return null;
}
function cottageApproaches(id){const item=cottageItems.find(i=>i.id===id),p=state.layout[id];if(!item||!p)return [];const s=cottageSize(item,p),out=[];for(let y=p.y-1;y<=p.y+s.h;y++)for(let x=p.x-1;x<=p.x+s.w;x++){const dx=x<p.x?p.x-x:x>=p.x+s.w?x-(p.x+s.w-1):0,dy=y<p.y?p.y-y:y>=p.y+s.h?y-(p.y+s.h-1):0;if(dx+dy===1&&x>=0&&x<12&&y>=3&&y<8&&cottagePetCellFree(x,y))out.push({x,y})}return out}
function refreshCottagePlayer(){document.querySelectorAll('[data-player]').forEach(el=>{const holder=document.createElement('div');holder.innerHTML=cottagePlayerHTML();el.replaceWith(holder.firstElementChild)})}
function cancelCottageWalk(){clearTimeout(cottageWalkTimer);cottageWalkTimer=null;cottageWalk=null;document.querySelectorAll('[data-player]').forEach(el=>{el.classList.remove('walking');el.dataset.playerMotion='idle'})}
function walkCottagePlayer(path,onArrival){
 cancelCottageWalk();delete state.avatar.interaction;document.querySelector('.player-rest-status')?.remove();refreshCottagePlayer();
 const finish=()=>{cottageWalk=null;cottageWalkTimer=null;if(onArrival)onArrival();else{save();refreshCottagePlayer();document.querySelector('[data-player]')?.focus({preventScroll:true})}};
 if(path.length<2){finish();return}
 if(matchMedia('(prefers-reduced-motion: reduce)').matches){state.avatar.position={...path[path.length-1]};finish();return}
 const session={path,index:1,trace:[{...path[0]}]};cottageWalk=session;
 const step=()=>{if(cottageWalk!==session)return;if(cottageEdit||route!=='room'||!document.querySelector('[data-player]')){cancelCottageWalk();save();return}if(session.index>=path.length){finish();return}const p=path[session.index++],previous=state.avatar.position;if(!cottagePetCellFree(p.x,p.y)){cancelCottageWalk();save();refreshCottagePlayer();return}state.avatar.position={...p};session.trace.push({...p});document.querySelectorAll('[data-player]').forEach(el=>{el.classList.add('walking');el.dataset.playerMotion='walk';el.dataset.playerPose='walk';el.style.setProperty('--player-facing',p.x<previous.x?'-1':'1');el.style.left=(p.x+.5)/12*100+'%';el.style.top=(p.y+1)/8*100+'%';el.style.zIndex=22+p.y});cottageWalkTimer=setTimeout(step,190)};
 requestAnimationFrame(()=>{if(cottageWalk===session)step()});
}
function walkCottageToFurniture(id){
 if(state.avatar.interaction?.furniture===id&&!cottageWalk)return;cancelCottageWalk();if(state.avatar.interaction)cottageStandUp();const start=state.avatar.position;
 const paths=cottageApproaches(id).map(p=>cottageWalkPath(start,p)).filter(Boolean).sort((a,b)=>a.length-b.length),path=paths[0];if(!path)return toast('走不过去，请在家具旁留一点空地。');
 walkCottagePlayer(path,()=>{const item=cottageItems.find(i=>i.id===id);if(!state.equipped.includes(id)||!state.layout[id]){save();refreshCottagePlayer();return}state.avatar.interaction={furniture:id,pose:item.base==='bed'?'lie':'sit'};save();render();document.querySelector('[data-player]')?.focus({preventScroll:true})});
}
function moveCottagePlayer(x,y){
 if(x<0||x>11||y<3||y>7||route!=='room'||cottageEdit)return;
 const target=cottageItems.find(i=>{const p=state.layout[i.id],s=cottageSize(i,p);return i.type==='room'&&state.equipped.includes(i.id)&&p&&!p.surface&&['bed','sofa','chair'].includes(i.base)&&x>=p.x&&x<p.x+s.w&&y>=p.y&&y<p.y+s.h});if(target)return cottageInteract(target.id);if(!cottagePetCellFree(x,y))return;
 cancelCottageWalk();if(state.avatar.interaction)cottageStandUp();const path=cottageWalkPath(state.avatar.position,{x,y});if(!path)return toast('这里走不过去，试试留出一条通道。');walkCottagePlayer(path);
}
document.addEventListener('change',e=>{const key=e.target.dataset.playerColor;if(['skin','hairColor'].includes(key)&&/^#[0-9a-f]{6}$/i.test(e.target.value)){state.avatar[key]=e.target.value;save();render()}});
document.addEventListener('click',e=>{if(e.target.closest('[data-open-wardrobe]')){cottageCategory='wardrobe';cottageGroup='top';render();document.querySelector('.cottage-shop')?.scrollIntoView({block:'start'})}const scene=e.target.closest('[data-cottage]');if(scene&&!cottageEdit&&!e.target.closest('button')){const r=scene.getBoundingClientRect();moveCottagePlayer(Math.floor((e.clientX-r.left)/r.width*12),Math.floor((e.clientY-r.top)/r.height*8))}});
document.addEventListener('keydown',e=>{if(!e.target.closest('[data-player]'))return;const delta={ArrowLeft:[-1,0],ArrowRight:[1,0],ArrowUp:[0,-1],ArrowDown:[0,1]}[e.key];if(delta){e.preventDefault();if(state.avatar.interaction){cottageStandUp();save();render();document.querySelector('[data-player]')?.focus({preventScroll:true})}else{const p=state.avatar.position;moveCottagePlayer(p.x+delta[0],p.y+delta[1])}}});
