const petSpecies={cat:['猫咪粮',30],dog:['狗狗粮',32],rabbit:['兔兔牧草粮',24],chicken:['小鸡谷物粮',22],duck:['小鸭配合粮',24],budgie:['鹦鹉种子粮',25],hamster:['仓鼠谷物粮',22],guinea:['豚鼠牧草粮',25],hedgehog:['刺猬专用粮',28],turtle:['乌龟专用粮',24]};
let petSupplyTarget='';
function expandPetCatalog(items){
 for(const i of items.filter(i=>i.type==='pet')){i.species=i.id;i.appetite=1;i.petColor={cat:'#cb965e',dog:'#d2bb91',rabbit:'#eee7dd',chicken:'#e2be65'}[i.id];i.group='animals'}
 const pets=[['tabby','银虎斑猫','cat','#a8a5a0',5,95],['tuxedo','燕尾服猫','cat','#555857',5,95],['calico','三花猫','cat','#eee0c3',5,110],['siamese','暹罗猫','cat','#d5c3aa',5,105],['corgi','柯基犬','dog','#c99261',5,110],['poodle','卷毛贵宾','dog','#b69b83',4,115],['shiba','柴犬','dog','#c68f52',5,110],['retriever','金毛犬','dog','#c5a365',6,120],['lop','垂耳兔','rabbit','#baa99a',4,80],['duck','小白鸭','duck','#eee5d0',5,65],['budgie','虎皮鹦鹉','budgie','#8caa81',4,75],['hamster','金丝熊','hamster','#cfad74',4,60],['guinea','花豚鼠','guinea','#b68f76',5,70],['hedgehog','小刺猬','hedgehog','#917e67',4,85],['turtle','小乌龟','turtle','#879a69',4,75]];
 for(const [id,name,species,petColor,appetite,price] of pets)items.push({id,name,species,petColor,appetite:1,price,type:'pet',category:'pets',group:'animals',w:1,h:1,desc:`${petSpecies[species][0]} · 每天一次 · 每次 1 份`});
 const supplies=[['pet-house','木质宠物小屋','house',75,2,1],['pet-basket','藤编休息篮','bed',50,2,1],['cat-tree','猫爬架','toy',85,2,1],['steel-bowl','不锈钢食盆','bowl',25,1,1],['ceramic-bowl','陶瓷双食盆','bowl',35,2,1],['pet-bath','宠物浴盆','bath',60,2,1],['pet-ball','弹力小球','toy',20,1,1],['feather-toy','羽毛逗猫棒','toy',25,1,1],['chew-toy','啃咬木玩具','toy',20,1,1],['hay-rack','牧草食架','bowl',30,1,1]];
 supplies.push(['play-tunnel','折叠猫咪隧道','toy',45,2,1],['puzzle-board','滑盖益智盘','toy',40,2,1],['crinkle-fish','响纸小鱼','toy',22,1,1],['rope-knot','绳结拉扯玩具','toy',25,1,1],['flying-disc','柔软飞盘','toy',30,1,1],['treat-ball','漏食互动球','toy',35,1,1],['hamster-wheel','安静跑轮','toy',48,2,1],['bird-swing','木珠鹦鹉秋千','toy',32,1,1]);
 for(const [id,name,supplyKind,price,w,h] of supplies)items.push({id,name,supplyKind,price,w,h,type:'room',category:'petcare',group:supplyKind,desc:'给小动物使用 · 首次添置亲密度 +2',speciesAllowed:['play-tunnel','crinkle-fish'].includes(id)?['cat','rabbit','guinea']:['rope-knot','flying-disc'].includes(id)?['dog']:id==='hamster-wheel'?['hamster']:id==='bird-swing'?['budgie']:id==='cat-tree'||id==='feather-toy'?['cat']:id==='hay-rack'||id==='chew-toy'?['rabbit','guinea','hamster']:null});
 for(const i of items.filter(i=>i.base==='petbed')){i.supplyKind='bed';i.desc+=' · 可赠给小动物'}
 for(const [species,[name,price]] of Object.entries(petSpecies))items.push({id:`feed-${species}`,name,price,species,type:'feed',category:'petcare',group:'feed',capacity:24,desc:'一包 24 份 · 每天一次、每次 1 份 · 一包 24 次'});
 return items;
}
function initPetLife(){
 state.foodLots=state.foodLots||{};state.petSupplies=state.petSupplies||{};
 for(const id of state.owned){const i=cottageItems.find(i=>i.id===id);if(i?.type==='pet'){const p=state.pets[id];p.receivedSupplies=p.receivedSupplies||[];p.action=p.action||'idle';p.actionUntil=p.actionUntil||0}}
 const ownedPets=cottageItems.filter(i=>i.type==='pet'&&state.owned.includes(i.id));if(!ownedPets.some(i=>i.id===petSupplyTarget))petSupplyTarget=ownedPets[0]?.id||'';
}
function petFoodUnits(species){return (state.foodLots[species]||[]).reduce((sum,lot)=>sum+lot.remaining,0)}
function petFoodSaleValue(species){return (state.foodLots[species]||[]).reduce((sum,lot)=>sum+Math.floor(lot.paidPrice*.25*lot.remaining/24),0)}
function buyPetFood(item){if(state.coins<item.price)return toast(`金币还差 ${item.price-state.coins} 枚。`);state.coins-=item.price;(state.foodLots[item.species]||= []).push({remaining:24,paidPrice:item.price});save();render();toast(`已购买 ${item.name}，增加 24 份`)}
function sellPetFood(item){const value=petFoodSaleValue(item.species);if(!value)return;state.coins+=value;state.foodLots[item.species]=[];save();render();toast(`剩余饲料已回售，获得 ${value} 金币`)}
function usePetFood(item){let need=1;if(petFoodUnits(item.species)<need)return false;for(const lot of state.foodLots[item.species]){const amount=Math.min(need,lot.remaining);lot.remaining-=amount;need-=amount;if(!need)break}state.foodLots[item.species]=state.foodLots[item.species].filter(l=>l.remaining>0);return true}
function petBondLevel(bond){return bond>=20?'亲密伙伴':bond>=10?'熟悉的朋友':bond>=5?'开始信任': '初次相识'}
function increasePetBond(id,amount,reason){const p=state.pets[id],item=cottageItems.find(i=>i.id===id),before=p.bond||0;p.bond=before+amount;const leveled=petBondLevel(before)!==petBondLevel(p.bond);const message=`${item.name} · ${reason}，亲密度 +${amount}${leveled?' · 升级为「'+petBondLevel(p.bond)+'」':''}`;state.lastPetNotice=message;return message}
function compatiblePetSupply(item,pet){return !item.speciesAllowed||item.speciesAllowed.includes(pet.species)}
function assignPetSupply(id,petId=petSupplyTarget){const item=cottageItems.find(i=>i.id===id),pet=cottageItems.find(i=>i.id===petId);if(!item?.supplyKind||!pet||!state.owned.includes(id)||!state.owned.includes(petId))return '';if(!compatiblePetSupply(item,pet))return `${item.name}适合${item.speciesAllowed.map(s=>petSpecies[s][0].replace('粮','')).join('、')}，请换一个小动物。`;state.petSupplies[id]=petId;const p=state.pets[petId];p.receivedSupplies=p.receivedSupplies||[];if(!p.receivedSupplies.includes(id)){p.receivedSupplies.push(id);return increasePetBond(petId,2,`收到${item.name}`)}return `${item.name}已给${pet.name}使用`}
function petHasSupply(id,kind){return cottageItems.some(i=>i.supplyKind===kind&&state.owned.includes(i.id)&&state.petSupplies[i.id]===id)}
function currentPetAction(id){const p=state.pets[id];return p&&p.actionUntil>Date.now()?p.action:'idle'}
function petFedToday(id){const last=state.pets[id]?.lastFed;return last!=null&&new Date(last).toLocaleDateString('sv-SE')===new Date().toLocaleDateString('sv-SE')}
function newPetStatus(id){const p=state.pets[id],action=currentPetAction(id);return {sleep:'趴着睡觉',eat:'正在吃东西',play:'正在玩耍',bath:'正在洗澡',groom:'正在梳理毛发'}[action]||(!petFedToday(id)?'等你喂食':'吃饱了，四处看看')}
function petCareActions(id){return `<div class="pet-actions">${[['feed','喂食'],['pet','摸摸'],['sleep','睡觉'],['play','玩耍'],['bath','洗澡']].map(([action,name])=>`<button class="btn light" data-pet-care="${action}" data-pet-id="${id}" ${action==='feed'&&petFedToday(id)?'disabled':''}>${action==='feed'&&petFedToday(id)?'今日已喂':name}</button>`).join('')}</div>`}
function petFoodSummary(item){const units=petFoodUnits(item.species);return `${petSpecies[item.species][0]}：${units} 份 · 每天一次，每次 1 份`}
function petLifePanel(){const pets=cottageItems.filter(i=>i.type==='pet'&&state.owned.includes(i.id));if(!pets.length)return '';return `<section class="pet-section"><div class="section-head"><h2>小动物 <small>${pets.length} 只</small></h2><button class="btn light" data-open-petshop>饲料与用品</button></div>${state.lastPetNotice?`<p class="pet-bond-notice" role="status">♥ ${state.lastPetNotice}</p>`:''}<div class="pet-list">${pets.map(i=>`<article class="pet-card"><div class="pet-portrait">${petLifeSprite(i.id,currentPetAction(i.id))}</div><div class="pet-card-copy"><h3>${i.name} <span>${petBondLevel(state.pets[i.id].bond||0)}</span></h3><p>${newPetStatus(i.id)} · 亲密度 ${state.pets[i.id].bond||0}</p><p class="food-summary">${petFoodSummary(i)}</p>${petCareActions(i.id)}</div></article>`).join('')}</div></section>`}
function showPetLifeDialog(id){const item=cottageItems.find(i=>i.id===id);if(!item||!state.owned.includes(id))return;modal(`<div class="pet-dialog-art pet-action-${currentPetAction(id)}">${petLifeSprite(id,currentPetAction(id))}</div><h2>${item.name}</h2><p>${newPetStatus(id)} · 亲密度 ${state.pets[id].bond||0} · ${petBondLevel(state.pets[id].bond||0)}</p><p>${petFoodSummary(item)}</p>${petCareActions(id)}<p class="sub">喂食消耗专用饲料；每日首次互动增加亲密度。</p><button class="btn light" data-open-petshop>购买饲料与用品</button>`)}
function carePetLife(id,action){
 const item=cottageItems.find(i=>i.id===id),p=state.pets[id];if(!p||!state.owned.includes(id)||!['feed','pet','sleep','play','bath'].includes(action))return;
 const today=new Date().toLocaleDateString('sv-SE'),already=key=>p[key]&&new Date(p[key]).toLocaleDateString('sv-SE')===today;let message='';
 if(action==='feed'){
  if(petFedToday(id))return toast('今天已经喂过了，明天再来吧。');
  if(!usePetFood(item))return toast(`需要购买${petSpecies[item.species][0]}，目前饲料不足。`);
  const bowl=cottageItems.find(i=>i.supplyKind==='bowl'&&state.petSupplies[i.id]===id&&state.layout[i.id]);if(bowl){const pos=state.layout[bowl.id];const next={x:Math.min(10,pos.x),y:Math.min(6,pos.y+1)};if(cottagePetCellFree(next.x,next.y))cottagePetPositions[id]=next}
  const first=!already('lastFed');p.lastFed=Date.now();p.action='eat';p.actionUntil=Date.now()+14000;message=first?increasePetBond(id,1,'吃到喜欢的饲料'):`${item.name}正在吃东西，消耗 1 份饲料`;
 }else if(action==='sleep'){p.action='sleep';p.actionUntil=Date.now()+30000;message=`${item.name}趴下睡觉了`}
 else{
  const kind=action==='play'?'toy':action==='bath'?'bath':null;if(kind&&!petHasSupply(id,kind))return toast(`请先给${item.name}添置${kind==='toy'?'玩具':'浴盆'}。`);
  const key=action==='pet'?'lastPetted':action==='play'?'lastPlayed':'lastBathed';const first=!already(key);p[key]=Date.now();p.action=action==='pet'?'groom':action;p.actionUntil=Date.now()+12000;message=first?increasePetBond(id,1,action==='pet'?'受到陪伴':action==='play'?'一起玩耍':'洗澡很开心'):`${item.name}很开心，今天的互动奖励已领取`;
 }
 save();render();if(document.querySelector('#modal').open)showPetLifeDialog(id);toast(message);
}
function petSupplySelector(){const pets=cottageItems.filter(i=>i.type==='pet'&&state.owned.includes(i.id));return `<div class="pet-shop-info"><label>用品给谁用 <select data-supply-target aria-label="选择用品的小动物"><option value="">先存入仓库</option>${pets.map(i=>`<option value="${i.id}" ${petSupplyTarget===i.id?'selected':''}>${i.name}</option>`).join('')}</select></label><p>专用饲料一包 24 份，可喂 24 次，每天一次、每次 1 份；新品首次赠予亲密度 +2。</p></div>`}
function petLifeSprite(id,action='idle'){
 const painted=paintedPetSprite(id,action);if(painted)return painted;const item=cottageItems.find(i=>i.id===id);if(!item)return '';const species=item.species||id,c=item.petColor||'#c5aa83',R=artRect,P=artPath,E=artOval;let s='';const asleep=action==='sleep';
 if(species==='cat'||species==='dog'){
  s=E(36,40,23,13,c)+P('M21 45v11M38 46v10M49 44v12','none',c,6)+P(species==='cat'?'M14 37Q1 18 5 12':'M15 33Q1 27 8 22','none',c,5);
  if(asleep)s=E(35,46,27,12,c)+P('M14 44q8 15 24 7','none','#ffffff65',4);
  s+=E(55,32,12,13,c)+P(species==='cat'?'M45 24l1-14 9 11M57 20l10-9-1 15z':'M45 21q-15-8-9 16l10-5M65 21q15-6 9 15l-10-3z',c)+E(59,39,7,5,'#efe4d0')+E(61,36,2,1.5,'#65574b');
  if(asleep)s+=P('M50 32l5 1M61 31l4-1','none','#66594e',1.4);else s+=E(51,30,1.4,1.7,'#4b4942')+E(63,29,1.4,1.7,'#4b4942');
  if(['tabby','cat'].includes(id))s+=P('M25 30l3 7M35 27l2 7M47 21l4 5','none','#806849',2);
  if(id==='tuxedo')s+=E(50,40,7,7,'#eee9dc')+R(22,50,7,6,'#eee9dc',2);
  if(id==='calico')s+=E(23,35,7,9,'#be8655')+E(39,30,5,6,'#65645a');
  if(id==='siamese')s+=E(56,31,9,10,'#796655')+E(52,29,1.5,1.6,'#91bed2')+E(62,29,1.5,1.6,'#91bed2');
  if(id==='corgi')s+=E(53,36,7,7,'#f3e9d7');if(id==='poodle')s+=Array.from({length:7},(_,n)=>E(17+n*6,30,5,6,c)).join('');
 }else if(species==='rabbit'){
  s=E(33,42,22,16,c)+E(56,35,12,13,c)+E(61,15,4,17,c)+E(49,17,4,17,c)+E(60,15,2,12,'#d4aaa8')+E(49,17,2,12,'#d4aaa8')+E(12,42,6,6,'#f2e9dc')+E(54,47,11,5,c)+E(62,37,2,1.5,'#b48481');if(id==='lop')s+=E(46,39,5,17,c)+E(67,35,4,14,c);s+=asleep?P('M57 31l6 1','none','#675b51',1.5):E(59,31,1.5,1.8,'#675b51');
 }else if(['chicken','duck','budgie'].includes(species)){
  s=E(35,38,23,16,c)+E(54,25,11,12,c)+E(31,36,13,9,item.id==='chicken'?'#d4a55b':'#ffffff55')+P('M27 53v6h8M46 53v6h9','none','#aa8455',2)+P('M62 25l13 3-12 5z','#d8a263')+P('M17 30L5 21l2 15z',c)+E(57,22,1.5,1.5,'#57564c');if(species==='budgie')s+=P('M13 44L5 64l17-12z','#779384')+P('M22 31l18 10M24 28l18 10','none','#4c7164',2);
 }else if(species==='turtle')s=E(38,41,27,17,'#667c55')+E(65,43,9,6,c)+E(23,55,8,4,c)+E(49,55,8,4,c)+P('M23 31l13 9 15-10M36 40v14M17 43h18M39 44h19','none','#a9b688',2)+E(69,41,1.4,1.4,'#3c5140');
 else{
  s=E(34,43,25,16,c)+E(58,39,12,11,'#d8c6a8')+E(57,24,species==='hamster'?7:4,5,c)+E(63,35,1.5,1.8,'#565047')+E(69,42,2,1.5,'#ac8780')+E(20,56,7,3,'#c4b499');if(species==='hedgehog')s+=P('M10 43l1-13 6 3 5-12 6 7 6-13 5 11 10-4 2 13z','#847761');
 }
 if(asleep&&!['cat','dog','rabbit'].includes(species)){const eye=['chicken','duck','budgie'].includes(species)?[57,22]:species==='turtle'?[69,41]:[63,35];s=s.replace(E(eye[0],eye[1],1.5,1.5,'#57564c'),'').replace(E(eye[0],eye[1],1.4,1.4,'#3c5140'),'').replace(E(eye[0],eye[1],1.5,1.8,'#565047'),'')+P(`M${eye[0]-2} ${eye[1]}l4 1`,'none','#66594e',1.3)}
 if(action==='eat')s+=E(62,56,14,5,'#a3b7b5')+E(62,53,12,4,'#6c7670')+E(58,52,2,1.5,'#baa071')+E(66,52,2,1.5,'#baa071');
 if(action==='play')s+=E(67,55,9,9,'#b88383')+P('M61 49l11 11','none','#edd0b4',2);
 if(action==='bath')s=E(39,55,34,11,'#a2bdb9')+s+Array.from({length:5},(_,n)=>E(14+n*12,45,8,6,'#eaf3ee')).join('');
 if(asleep)s+='<text x="4" y="16" font-size="10" fill="#8a999d">z Z</text>';
 return `<svg viewBox="0 0 80 68" aria-hidden="true"><g class="pet-drawing">${s}</g></svg>`;
}
function supplySprite(item){const R=artRect,P=artPath,E=artOval;let s='';switch(item.id){case 'pet-house':s=P('M13 39l35-27 35 27v44H13z','#b99570')+P('M7 39l41-32 41 32','none','#795e49',5)+P('M32 83V58q16-24 32 0v25z','#665648')+P('M18 48h10M18 57h10M72 47h7','none','#d8bd97',2);break;case 'pet-basket':s=E(48,64,40,24,'#ad916c')+E(48,57,31,14,'#ecddbe')+P('M11 58h74M11 66h74M23 76h50','none','#cfb18b',2);break;case 'cat-tree':s=R(13,78,70,7,'#a58a69',3)+R(28,22,6,58,'#d6c8ad')+R(64,35,6,45,'#d6c8ad')+R(15,17,33,10,'#a58a69',4)+R(52,31,32,10,'#a58a69',4)+R(15,48,35,27,'#c7b195',6)+E(32,62,9,10,'#655b50');break;case 'pet-bath':s=P('M6 40h84l-9 35Q48 91 15 75z','#a7c3bf')+E(48,40,43,15,'#dcebe5')+E(48,42,35,9,'#a4c9d2');break;case 'steel-bowl':case 'ceramic-bowl':s=E(48,67,35,14,item.id==='steel-bowl'?'#a3afaf':'#c9aea1')+E(48,60,31,11,'#eef0e8')+E(48,60,24,7,'#7f8d82')+E(40,60,3,2,'#c0a273')+E(55,58,3,2,'#c0a273');if(item.id==='ceramic-bowl')s+=E(76,70,15,8,'#a5bcb9');break;case 'pet-ball':s=E(48,53,29,29,'#bf8f8d')+P('M25 37q24 9 38 35M70 32Q49 42 33 79','none','#efe3cb',5);break;case 'feather-toy':s=P('M15 85L56 23','none','#aa8a60',4)+P('M56 23q26-5 14 23','none','#826f5c',1)+P('M68 39q27 6 5 27-25-7-5-27z','#9eb5a4')+P('M67 40l7 25','none','#657e73',1);break;case 'chew-toy':s=R(22,33,52,31,'#b18e60',9)+E(22,48,9,16,'#d3b790')+E(74,48,8,16,'#aa895f')+P('M30 38h33M32 49h24M31 58h32','none','#86694b',2);break;case 'hay-rack':s=R(22,23,52,53,'#b19973',3)+P('M30 75V22M41 75V22M53 75V22M65 75V22','none','#e1d4aa',3)+P('M28 56l19-27M39 63l19-38M50 58l16-19','none','#aab57c',3);break;default:return extraToySprite(item)}return `<svg viewBox="0 0 96 96" aria-hidden="true">${s}</svg>`}
function foodSprite(item){const pet=cottageItems.find(i=>i.type==='pet'&&i.species===item.species);const icon=pet?petLifeSprite(pet.id).replace('<svg viewBox','<svg x="28" y="27" width="40" height="35" viewBox'):'';return `<svg viewBox="0 0 96 96" aria-hidden="true"><path d="M27 13h43l5 72H22z" fill="#c8b595"/><path d="M27 13h43v8H27z" fill="#8e9c7d"/><rect x="29" y="31" width="38" height="33" rx="5" fill="#f2e7d0"/>${icon}<path d="M28 73h38" stroke="#8e9c7d" stroke-width="3"/></svg>`}
document.addEventListener('change',e=>{if(e.target.dataset.supplyTarget!==undefined)petSupplyTarget=e.target.value});
document.addEventListener('click',e=>{if(e.target.closest('[data-open-petshop]')){document.querySelector('#modal').close();cottageCategory='petcare';cottageGroup='feed';render();document.querySelector('.cottage-shop')?.scrollIntoView({block:'start'})}});

let petDisplayedDay=new Date().toLocaleDateString('sv-SE');setInterval(()=>{const today=new Date().toLocaleDateString('sv-SE');if(today!==petDisplayedDay){petDisplayedDay=today;if(typeof route!=='undefined'&&route==='room')render()}},60000);
