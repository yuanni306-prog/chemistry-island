const cottageItems = expandCottageCatalog([
 {id:'bed',name:'松木床',category:'furniture',type:'room',price:0,starter:true,w:2,h:2,desc:'初始家具'},
 {id:'table',name:'圆木餐桌',category:'furniture',type:'room',price:0,starter:true,w:2,h:1,desc:'初始家具'},
 {id:'chair',name:'木椅',category:'furniture',type:'room',price:0,starter:true,w:1,h:1,desc:'初始家具'},
 {id:'sofa',name:'苔绿沙发',category:'furniture',type:'room',price:90,w:3,h:1,desc:'靠窗休息的角落'},
 {id:'bookshelf',name:'橡木书柜',category:'furniture',type:'room',price:80,w:2,h:1,desc:'收好书籍与标本'},
 {id:'desk',name:'实验书桌',category:'furniture',type:'room',price:110,w:2,h:1,desc:'带试管架的工作台'},
 {id:'fireplace',name:'砖砌壁炉',category:'furniture',type:'room',price:140,w:2,h:1,desc:'温暖的砖红色壁炉'},
 {id:'rug',name:'编织地毯',category:'decor',type:'room',price:0,starter:true,w:3,h:2,desc:'初始装饰 · 可放在家具下'},
 {id:'plant',name:'窗边绿植',icon:'🪴',category:'decor',type:'room',price:60,w:1,h:1,desc:'一盆茂盛的绿叶'},
 {id:'flowers',name:'野花花盆',category:'decor',type:'room',price:35,w:1,h:1,desc:'粉色与黄色的小花'},
 {id:'lamp',name:'暖光落地灯',category:'decor',type:'room',price:55,w:1,h:1,desc:'为小屋添一盏暖灯'},
 {id:'petbed',name:'小动物软窝',category:'decor',type:'room',price:45,w:2,h:1,desc:'柔软的睡觉角落'},
 {id:'hat',name:'星星魔法帽',icon:'🧙🏻‍♀️',category:'decor',type:'avatar',price:100,desc:'角色帽子装扮'},
 {id:'space',name:'星空小屋',icon:'🌌',category:'decor',type:'theme',price:160,desc:'星空穹顶 · 黄铜星图 · 胡桃木地板'},
 {id:'cat',name:'橘子猫',category:'pets',type:'pet',price:80,w:1,h:1,desc:'爱散步，也爱被摸摸'},
 {id:'dog',name:'奶油小狗',category:'pets',type:'pet',price:100,w:1,h:1,desc:'摇着尾巴陪你学习'},
 {id:'rabbit',name:'棉花兔',category:'pets',type:'pet',price:65,w:1,h:1,desc:'喜欢在木地板上蹦跳'},
 {id:'chicken',name:'小黄鸡',category:'pets',type:'pet',price:50,w:1,h:1,desc:'小屋里的散步搭子'},
 {id:'meter',name:'数字 pH 计',icon:'🔬',category:'tools',type:'tool',price:120,desc:'解锁实验中的模拟 pH 读数'}
]);
const cottageCategories=[['all','全部'],['furniture','家具'],['decor','装饰'],['pets','小动物'],['petcare','宠物用品'],['tools','实验器材'],['wardrobe','人物装扮'],['limited','当月限定'],['inventory','已购 / 回售']];
let cottageCategory='furniture',cottageEdit=false,cottageSelected=null,cottageDrag=null,cottageTimer=null;
const cottagePetPositions={};
const cottageDefaults={bed:{x:1,y:3},table:{x:6,y:4},chair:{x:8,y:5},rug:{x:5,y:4},plant:{x:10,y:3},sofa:{x:1,y:6},bookshelf:{x:4,y:3},desk:{x:8,y:3},fireplace:{x:5,y:3},flowers:{x:10,y:6},lamp:{x:4,y:6},petbed:{x:8,y:6}};
function initCottage(){
 if(!state.cottageInitialized){for(const item of cottageItems.filter(i=>i.starter)){if(!state.owned.includes(item.id))state.owned.push(item.id);if(item.type==='room'&&!state.equipped.includes(item.id))state.equipped.push(item.id)}state.cottageInitialized=true}
 refreshMonthlyCatalog();
 initCottagePlayer();
 state.layout=state.layout&&typeof state.layout==='object'?state.layout:{};
 state.pets=state.pets&&typeof state.pets==='object'?state.pets:{};
 for(const id of state.owned){const item=cottageItems.find(i=>i.id===id);if(item?.type==='pet'&&!state.pets[id])state.pets[id]={bond:0,lastFed:null,lastPetted:null}}
 initPetLife();
 for(const id of state.equipped){const item=cottageItems.find(i=>i.id===id);if(item?.type==='room'&&!validCottagePosition(item,state.layout[id],id))state.layout[id]=findCottageSpot(item,id)}
 for(const [id,p] of Object.entries(state.layout))if(p?.surface){const item=cottageItems.find(i=>i.id===id);if(item)state.layout[id]=cottageSurfacePosition(item,p.surface,p.slot)||findCottageSpot(item,id)}
 if(state.avatar.interaction&&!state.equipped.includes(state.avatar.interaction.furniture))cottageStandUp();
}
function cottageSize(item,pos){return pos?.rotated?{w:item.h,h:item.w}:{w:item.w,h:item.h}}
function validCottagePosition(item,pos,id,layout=state.layout){
 if(!pos||!Number.isInteger(pos.x)||!Number.isInteger(pos.y))return false;
 if(pos.surface){const table=cottageItems.find(i=>i.id===pos.surface),owner=layout[pos.surface];if(!cottageCanTop(item)||!cottageIsSurface(table)||!owner||!state.equipped.includes(pos.surface)||!Number.isInteger(pos.slot)||pos.slot<0||pos.slot>=cottageSurfaceSlots(table,owner))return false;return !state.equipped.some(other=>other!==id&&layout[other]?.surface===pos.surface&&layout[other]?.slot===pos.slot)}
 const size=cottageSize(item,pos);
 if(pos.x<0||pos.y<3||pos.x+size.w>12||pos.y+size.h>8)return false;
 if(item.base==='rug')return true;
 return !state.equipped.some(other=>{const i=cottageItems.find(i=>i.id===other),p=layout[other];if(other===id||i?.base==='rug'||i?.type!=='room'||!p||p.surface)return false;const s=cottageSize(i,p);return pos.x<p.x+s.w&&pos.x+size.w>p.x&&pos.y<p.y+s.h&&pos.y+size.h>p.y});
}
function findCottageSpot(item,id,layout=state.layout){
 const preferred=cottageDefaults[id];if(validCottagePosition(item,preferred,id,layout))return {...preferred};
 for(let y=3;y<8;y++)for(let x=0;x<12;x++){const p={x,y};if(validCottagePosition(item,p,id,layout))return p}return null;
}
function cottageSprite(id){
 const item=cottageItems.find(i=>i.id===id);if(item?.type==='room'){const painted=paintedSprite(item);if(painted)return painted;const art=supplySprite(item)||designedFurniture(item);if(art)return art}if(item?.type==='pet')return petLifeSprite(id);if(item?.type==='feed')return foodSprite(item);
 const shapes={
 bed:'<path fill="#70513f" d="M5 4h22v27H5z"/><path fill="#b98855" d="M7 2h18v7H7zM7 26h18v4H7z"/><path fill="#f5e9d0" d="M7 8h18v18H7z"/><path fill="#759c87" d="M7 15h18v11H7z"/><path fill="#9eb9a0" d="M9 15h3v11H9zM20 15h3v11h-3z"/><path fill="#fff6e3" d="M10 9h12v5H10z"/>',
 table:'<path fill="#70513f" d="M7 19h4v11H7zM22 19h4v11h-4z"/><path fill="#765337" d="M3 9h26v13H3z"/><path fill="#c99a65" d="M3 7h26v12H3z"/><path fill="#ddb37c" d="M5 9h22v2H5z"/><path fill="#8e6544" d="M7 15h18v1H7z"/><path fill="#e6dbc5" d="M12 9h8v6h-8z"/><path fill="#c27b61" d="M14 10h4v4h-4z"/>',
 chair:'<path fill="#71513d" d="M8 4h16v16H8zM8 23h3v8H8zM21 23h3v8h-3z"/><path fill="#c79a63" d="M10 6h12v10H10zM6 18h20v6H6z"/><path fill="#997143" d="M6 24h20v3H6zM13 7h2v8h-2zM18 7h2v8h-2z"/>',
 sofa:'<path fill="#496957" d="M2 10h28v18H2zM4 28h3v3H4zM25 28h3v3h-3z"/><path fill="#7b9c71" d="M4 7h24v13H4z"/><path fill="#a3b58a" d="M5 9h10v9H5zM17 9h10v9H17z"/><path fill="#89a477" d="M5 20h22v6H5z"/><path fill="#547551" d="M1 15h4v13H1zM27 15h4v13h-4z"/>',
 bookshelf:'<path fill="#664b38" d="M4 2h24v29H4z"/><path fill="#ae7e4c" d="M6 4h20v25H6z"/><path fill="#765538" d="M6 12h20v2H6zM6 22h20v2H6z"/><path fill="#749590" d="M8 5h3v7H8zM19 15h3v7h-3z"/><path fill="#d7b86d" d="M12 6h3v6h-3zM8 16h3v6H8z"/><path fill="#bc7765" d="M17 5h3v7h-3zM12 15h4v7h-4z"/><path fill="#f0d3a7" d="M21 7h3v5h-3zM23 17h2v5h-2z"/>',
 desk:'<path fill="#755238" d="M3 14h26v5H3zM5 19h4v12H5zM23 19h4v12h-4z"/><path fill="#d1a474" d="M2 11h28v5H2z"/><path fill="#8b6445" d="M19 19h8v8h-8z"/><path fill="#e5d8ac" d="M6 9h9v3H6z"/><path fill="#5d918b" d="M19 5h3v7h-3zM24 3h3v9h-3z"/><path fill="#b0d5c4" d="M19 4h3v3h-3zM24 2h3v3h-3z"/>',
 fireplace:'<path fill="#985d47" d="M5 3h22v25H5z"/><path fill="#ba7b58" d="M3 5h26v4H3zM3 25h26v4H3z"/><path fill="#68473b" d="M10 13h12v12H10z"/><path fill="#e7a85c" d="M12 20h8v4h-8zM14 16h4v4h-4z"/><path fill="#f4d48a" d="M15 20h3v4h-3z"/><path fill="#d7a078" d="M6 10h8v1H6zM17 10h8v1h-8zM6 17h3v1H6zM23 17h3v1h-3z"/>',
 rug:'<path fill="#9e6751" d="M1 7h30v22H1z"/><path fill="#dfb783" d="M3 9h26v18H3z"/><path fill="#bb8267" d="M5 11h22v14H5z"/><path fill="#edcf97" d="M7 13h18v10H7z"/><path fill="#7f9883" d="M12 15h8v6h-8z"/>',
 plant:'<path fill="#a97151" d="M9 21h14l-2 10H11z"/><path fill="#d39d70" d="M8 20h16v4H8z"/><path fill="#527752" d="M14 6h4v15h-4zM5 9h9v6H5zM18 11h9v6h-9z"/><path fill="#88a768" d="M7 5h7v7H7zM18 3h7v8h-7zM10 14h5v5h-5z"/>',
 flowers:'<path fill="#a47555" d="M9 22h14l-2 9H11z"/><path fill="#668452" d="M12 9h2v13h-2zM20 12h2v10h-2zM8 17h7v3H8z"/><path fill="#d296a0" d="M8 7h10v6H8zM11 4h4v12h-4z"/><path fill="#e7bf6e" d="M17 10h10v5H17zM20 7h4v11h-4z"/><path fill="#f4dd9c" d="M12 8h3v3h-3zM21 11h3v3h-3z"/>',
 lamp:'<path fill="#715d47" d="M15 11h2v18h-2zM10 29h12v2H10z"/><path fill="#e8c985" d="M10 3h12l5 10H5z"/><path fill="#f4dfa5" d="M12 4h8v7h-8z"/>',
 petbed:'<path fill="#9d725b" d="M2 15h28v14H2z"/><path fill="#bc9580" d="M4 12h24v15H4z"/><path fill="#e4c6a1" d="M7 17h18v8H7z"/><path fill="#ccaa85" d="M10 19h12v4H10z"/>',
 cat:'<path fill="#b37942" d="M7 12h19v15H7zM6 8h5v7H6zM22 8h5v7h-5zM9 27h4v3H9zM21 26h4v4h-4zM27 18h4v7h-4z"/><path fill="#deb076" d="M9 12h15v12H9z"/><path fill="#eac697" d="M12 22h9v5h-9z"/><path fill="#76533e" d="M11 16h2v2h-2zM20 16h2v2h-2zM16 20h2v2h-2z"/><path fill="#c68551" d="M14 12h2v4h-2zM18 12h2v4h-2z"/>',
 dog:'<path fill="#c6a171" d="M6 11h21v15H6zM3 11h5v10H3zM25 11h5v10h-5zM8 26h4v4H8zM21 26h4v4h-4z"/><path fill="#ebd3a6" d="M9 9h15v16H9zM12 24h10v4H12z"/><path fill="#75543f" d="M12 15h2v2h-2zM20 15h2v2h-2zM15 20h5v3h-5z"/><path fill="#ad7352" d="M5 12h3v8H5zM25 12h3v8h-3z"/>',
 rabbit:'<path fill="#eee1c8" d="M9 3h5v12H9zM20 2h5v13h-5zM7 13h20v14H7zM9 27h6v3H9zM21 26h6v4h-6z"/><path fill="#dca8a4" d="M10 5h2v7h-2zM21 4h2v8h-2zM16 22h3v2h-3z"/><path fill="#7b6753" d="M11 17h2v2h-2zM22 17h2v2h-2z"/><path fill="#fff3df" d="M10 13h13v3H10z"/>',
 chicken:'<path fill="#e5bd68" d="M6 12h20v14H6zM10 7h12v8H10z"/><path fill="#f5d98a" d="M8 13h16v10H8z"/><path fill="#ae7950" d="M11 26h3v4h-3zM21 26h3v4h-3zM25 14h5v4h-5z"/><path fill="#7d6043" d="M20 11h2v2h-2z"/><path fill="#d99663" d="M8 16h7v5H8z"/>'
 };
 if(!shapes[id])return `<span class="cottage-emoji">${cottageItems.find(i=>i.id===id)?.icon||'⚗'}</span>`;
 return `<svg viewBox="0 0 32 32" aria-hidden="true" shape-rendering="crispEdges" preserveAspectRatio="none">${shapes[id]}</svg>`;
}
function cottageBackground(){return paintedRoom()}
function cottageObject(item,editable){const p=state.layout[item.id];if(!p)return '';const s=cottageSize(item,p),owner=p.surface?state.layout[p.surface]:null,table=owner?cottageItems.find(i=>i.id===p.surface):null,ts=table?cottageSize(table,owner):null;const left=owner?(owner.x+(p.slot+.5)/cottageSurfaceSlots(table,owner)*ts.w)/12*100:(p.x+s.w/2)/12*100,top=owner?(owner.y+ts.h-.58)/8*100:(p.y+s.h)/8*100;const interact=['bed','sofa','chair'].includes(item.base);return `<button class="cottage-object ${item.base==='rug'?'cottage-rug':''} ${owner?'on-table':''} ${cottageSelected===item.id&&editable?'selected':''}" data-furniture="${item.id}" data-base="${item.base||item.id}" ${owner?`data-on-table="${p.surface}"`:''} aria-label="${item.name}${owner?'，摆在桌上':''}${editable&&cottageEdit?'，可拖动或用方向键移动':interact?'，点击'+(item.base==='bed'?'躺下':'坐下'):''}" style="left:${left}%;top:${top}%;width:${(owner ? .65 : s.w)/12*100}%;height:${(owner ? .85 : s.h)/8*100}%;z-index:${owner?11+owner.y+ts.h:item.base==='rug'?1:10+p.y+s.h}"><span class="object-art ${p.rotated?'rotated':''}">${cottageSprite(item.id)}</span>${item.id==='plant'?'<span class="plant sr">🪴</span>':''}</button>`}
function cottageHTML(editable=false){return `<div class="cottage-scene ${editable?'full-room':''} ${cottageEdit&&editable?'editing':''}" data-cottage ${editable?'':'aria-label="我的小屋预览"'}>${cottageBackground()}<div class="cottage-grid" aria-hidden="true"></div>${cottageItems.filter(i=>i.type==='room'&&state.equipped.includes(i.id)).map(i=>cottageObject(i,editable)).join('')}${cottagePlayerHTML()}${cottageItems.filter(i=>i.type==='pet'&&state.owned.includes(i.id)).map((i,n)=>`<button class="cottage-pet" data-pet="${i.id}" aria-label="照顾${i.name}" style="left:${cottagePetPositions[i.id]?(cottagePetPositions[i.id].x+.5)/12*100:56+n*2}%;top:${cottagePetPositions[i.id]?(cottagePetPositions[i.id].y+1)/8*100:85}%;z-index:24">${petLifeSprite(i.id,currentPetAction(i.id))}</button>`).join('')}</div>`}
function petStatus(id){const p=state.pets[id];const hungry=!p?.lastFed||Date.now()-p.lastFed>24*60*60*1000;return hungry?'等你喂食':'吃饱了，在散步'}
function cottagePage(){refreshMonthlyCatalog();const pets=cottageItems.filter(i=>i.type==='pet'&&state.owned.includes(i.id));const selected=cottageItems.find(i=>i.id===cottageSelected&&state.equipped.includes(i.id));return `<div class="cottage-heading"><div><h1>我的小屋</h1><p class="sub">布置房间，照顾小动物。</p></div><span class="cottage-wallet">🪙 ${state.coins} 金币</span></div><section class="cottage-panel"><div class="cottage-toolbar"><span class="cottage-tag">${activeCottageTheme()?.name||'松木小屋'}</span><div><button class="btn ${cottageEdit?'':'light'}" data-room-edit aria-pressed="${cottageEdit}">${cottageEdit?'完成布置':'布置小屋'}</button></div></div>${cottageHTML(true)}<div class="cottage-controls"><p class="sub">${cottageEdit?'拖动家具；绿植、花盆和灯具可放到桌面。':'点击空地移动，点击床躺下，点击沙发或椅子坐下。'}</p>${cottageEdit?`<div class="placement-tools"><span>${selected?selected.name:'选择一件家具'}</span>${[['left','←','向左移动'],['up','↑','向上移动'],['down','↓','向下移动'],['right','→','向右移动'],['rotate','↻','旋转家具'],['store','收起','收起家具']].map(([action,label,aria])=>`<button data-room-action="${action}" aria-label="${aria}" ${selected?'':'disabled'}>${label}</button>`).join('')}</div>`:''}${cottageEdit?cottageSurfaceControls(selected):cottageRestControls()}<span id="room-message" role="status"></span></div></section>${playerPanel()}${petLifePanel()}${cottageShopHTML()}`}
function purchaseCottageItem(id){const item=cottageItems.find(i=>i.id===id);if(!item)return;
 if(item.type==='feed')return buyPetFood(item);
 const target=cottageItems.find(i=>i.id===petSupplyTarget);if(item.supplyKind&&target&&!compatiblePetSupply(item,target))return toast('这件用品不适合当前动物，请先切换使用对象。');
 if(!state.owned.includes(id)&&item.month&&item.month!==cottageMonthKey())return toast('这件限定已下架。');
 if(state.owned.includes(id)){
  if(item.type==='tool')return;
  if(item.supplyKind&&petSupplyTarget){const message=assignPetSupply(id);if(!state.equipped.includes(id)){const spot=findCottageSpot(item,id);if(spot){state.layout[id]=spot;state.equipped.push(id)}}save();render();toast(message);return}
  if(item.type==='wear'){state.avatar[item.slot]=id;save();render();return}
  if(item.type==='pet')return showCottagePet(id);
  if(state.equipped.includes(id)){cottageStoreItem(id);if(cottageSelected===id)cottageSelected=null}
  else {if(item.type==='room'){const spot=validCottagePosition(item,state.layout[id],id)?{...state.layout[id]}:findCottageSpot(item,id);if(!spot)return toast('小屋已满，请先收起一件家具。');state.layout[id]=spot}if(item.type==='theme')state.equipped=state.equipped.filter(other=>cottageItems.find(i=>i.id===other)?.type!=='theme');state.equipped.push(id)}
 }else{
  if(state.coins<item.price)return toast('金币还差 '+(item.price-state.coins)+' 枚，完成课程或实验可获得金币。');
  const spot=item.type==='room'?findCottageSpot(item,id):null;

  state.coins-=item.price;state.owned.push(id);state.paidPrices[id]=item.price;if(item.month)state.purchasedCatalog[id]={...item};
  if(item.type==='pet')state.pets[id]={bond:0,lastFed:null,lastPetted:null};
  else if(item.type==='wear')state.avatar[item.slot]=id;
  else if(item.type!=='tool'){if(item.type==='theme')state.equipped=state.equipped.filter(other=>cottageItems.find(i=>i.id===other)?.type!=='theme');if(item.type!=='room'||spot)state.equipped.push(id);if(spot)state.layout[id]=spot}
  initPetLife();
  const notice=item.supplyKind&&petSupplyTarget?assignPetSupply(id):'';
  toast(notice|| (item.type==='pet'?'领养成功，记得购买专用饲料。':'购买成功'));
 }
 save();render();
}
function showCottagePet(id){showPetLifeDialog(id)}
function careCottagePet(id,action){carePetLife(id,action)}
function moveCottageItem(id,action){const item=cottageItems.find(i=>i.id===id),old=state.layout[id];if(!item||!old||!cottageEdit)return;if(action==='store'){cottageStoreItem(id);cottageSelected=null;save();render();return}const pos={...old};if(action==='rotate')pos.rotated=!pos.rotated;else{const delta={left:[-1,0],right:[1,0],up:[0,-1],down:[0,1]}[action];if(!delta)return;pos.x+=delta[0];pos.y+=delta[1]}const target=cottageDropPosition(item,pos);if(!validCottagePosition(item,target,id))return toast('这里放不下，试试旁边的空位。');cottageCommitPosition(id,target);save();render()}
function cottagePetCellFree(x,y){return !cottageItems.some(i=>{const p=state.layout[i.id],s=cottageSize(i,p);return i.type==='room'&&i.base!=='rug'&&state.equipped.includes(i.id)&&p&&!p.surface&&x>=p.x&&x<p.x+s.w&&y>=p.y&&y<p.y+s.h})}
function startCottagePets(){clearInterval(cottageTimer);const scene=document.querySelector('[data-cottage]');if(!scene)return;const step=()=>{if(cottageEdit&&route==='room')return;scene.querySelectorAll('[data-pet]').forEach(el=>{const id=el.dataset.pet,p=state.pets[id];if(p.actionUntil<=Date.now()){p.action='idle';if(Math.random()<.08){p.action='sleep';p.actionUntil=Date.now()+18000}}const action=currentPetAction(id);el.dataset.petAction=action;el.innerHTML=petLifeSprite(id,action);if(action!=='idle')return;let pos=cottagePetPositions[id];if(!pos||!cottagePetCellFree(pos.x,pos.y)){const cells=[];for(let y=3;y<7;y++)for(let x=1;x<11;x++)if(cottagePetCellFree(x,y))cells.push({x,y});pos=cells[Math.floor(Math.random()*cells.length)]||{x:5,y:6}}else{const neighbors=[[0,1],[0,-1],[1,0],[-1,0]].map(([dx,dy])=>({x:pos.x+dx,y:pos.y+dy})).filter(p=>p.x>=1&&p.x<11&&p.y>=3&&p.y<7&&cottagePetCellFree(p.x,p.y));if(neighbors.length)pos=neighbors[Math.floor(Math.random()*neighbors.length)]}cottagePetPositions[id]=pos;el.style.left=(pos.x+.5)/12*100+'%';el.style.top=(pos.y+1)/8*100+'%';el.style.zIndex=20+pos.y;})};step();cottageTimer=setInterval(step,2400)}
document.addEventListener('click',e=>{const b=e.target.closest('button');if(!b)return;const d=b.dataset;
 if(d.category){cottageCategory=d.category;cottageGroup=({furniture:'bed',decor:'rug',wardrobe:'top',petcare:'feed'})[d.category]||'all';render();document.querySelector(`[data-category="${d.category}"]`)?.focus()}
 if(d.roomEdit!==undefined){cancelCottageWalk();cottageEdit=!cottageEdit;cottageSelected=null;render()}
 if(d.roomAction)moveCottageItem(cottageSelected,d.roomAction);
 if(d.furniture&&cottageEdit){cottageSelected=d.furniture;render()}
 if(d.pet)showCottagePet(d.pet);
 if(d.petCare)careCottagePet(d.petId,d.petCare);
});
document.addEventListener('keydown',e=>{const furniture=e.target.closest('[data-furniture]');if(furniture&&cottageEdit){const action={ArrowLeft:'left',ArrowRight:'right',ArrowUp:'up',ArrowDown:'down'}[e.key];if(action){e.preventDefault();cottageSelected=furniture.dataset.furniture;moveCottageItem(cottageSelected,action);document.querySelector(`[data-furniture="${cottageSelected}"]`)?.focus()}}const tab=e.target.closest('[data-category]');if(tab&&['ArrowLeft','ArrowRight','Home','End'].includes(e.key)){e.preventDefault();const index=cottageCategories.findIndex(c=>c[0]===tab.dataset.category);cottageCategory=cottageCategories[e.key==='Home'?0:e.key==='End'?cottageCategories.length-1:(index+(e.key==='ArrowRight'?1:cottageCategories.length-1))%cottageCategories.length][0];cottageGroup=({furniture:'bed',decor:'rug',wardrobe:'top',petcare:'feed'})[cottageCategory]||'all';render();document.querySelector(`[data-category="${cottageCategory}"]`)?.focus()}});
document.addEventListener('pointerdown',e=>{const el=e.target.closest('[data-furniture]');if(!el||!cottageEdit||route!=='room'||e.button!==0)return;e.preventDefault();const scene=el.closest('[data-cottage]');cottageDrag={el,id:el.dataset.furniture,rect:scene.getBoundingClientRect(),old:{...state.layout[el.dataset.furniture]},x:e.clientX,y:e.clientY,moved:false};el.setPointerCapture(e.pointerId);el.classList.add('dragging')});
document.addEventListener('pointermove',e=>{if(!cottageDrag)return;const d=cottageDrag;const pos=cottageDropPosition(cottageItems.find(i=>i.id===d.id),{x:d.old.x+Math.round((e.clientX-d.x)/d.rect.width*12),y:d.old.y+Math.round((e.clientY-d.y)/d.rect.height*8),rotated:d.old.rotated});d.moved=d.moved||Math.abs(e.clientX-d.x)+Math.abs(e.clientY-d.y)>6;d.pos=pos;const item=cottageItems.find(i=>i.id===d.id),size=cottageSize(item,pos);d.el.style.left=(pos.x+size.w/2)/12*100+'%';d.el.style.top=(pos.y+size.h)/8*100+'%';d.el.classList.toggle('invalid',!validCottagePosition(item,pos,d.id))});
function finishCottageDrag(cancel=false){if(!cottageDrag)return;const d=cottageDrag;cottageDrag=null;cottageSelected=d.id;if(!cancel&&d.pos&&validCottagePosition(cottageItems.find(i=>i.id===d.id),d.pos,d.id)){cottageCommitPosition(d.id,d.pos);save()}else if(d.moved&&!cancel)toast('这里放不下，家具已回到原位。');render()}
document.addEventListener('pointerup',()=>finishCottageDrag());
document.addEventListener('pointercancel',()=>finishCottageDrag(true));
