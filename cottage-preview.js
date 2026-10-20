// Preview models stay outside the saved game state. Rendering never equips or purchases.
let cottagePreview=null,cottagePreviewOrigin=null;
function cottagePreviewPosition(item){
 const placed=state.equipped.includes(item.id)&&state.layout[item.id];
 if(placed)return {position:{...placed},solo:false};
 const position=findCottageSpot(item,item.id);
 return {position:position||{x:Math.max(0,Math.floor((12-item.w)/2)),y:Math.max(3,Math.floor(6-item.h/2))},solo:!position};
}
function cottagePreviewObject(item,p,highlight=false){
 if(!p)return '';const s=cottageSize(item,p),owner=p.surface?state.layout[p.surface]:null,table=owner?cottageItems.find(i=>i.id===p.surface):null,ts=table?cottageSize(table,owner):null;
 const left=owner?(owner.x+(p.slot+.5)/cottageSurfaceSlots(table,owner)*ts.w)/12*100:(p.x+s.w/2)/12*100,top=owner?(owner.y+ts.h-.58)/8*100:(p.y+s.h)/8*100;
 return `<div class="cottage-object ${item.base==='rug'?'cottage-rug':''} ${owner?'on-table':''} ${highlight?'preview-highlight':''}" data-base="${item.base||item.id}" ${highlight?`data-preview-object="${item.id}"`:''} style="left:${left}%;top:${top}%;width:${(owner ? .65 : s.w)/12*100}%;height:${(owner ? .85 : s.h)/8*100}%;z-index:${owner?11+owner.y+ts.h:item.base==='rug'?1:10+p.y+s.h}"><span class="object-art ${p.rotated?'rotated':''}">${cottageSprite(item.id)}</span></div>`;
}
function cottagePreviewScene(item){
 const room=item.type==='room'?cottagePreviewPosition(item):null,theme=item.type==='theme'?item:activeCottageTheme();
 const furniture=room?.solo?[]:cottageItems.filter(i=>i.type==='room'&&state.equipped.includes(i.id)&&i.id!==item.id);
 return `<div class="cottage-scene preview-room" role="img" aria-label="${item.name}的小屋效果"><div class="painted-room-background">${paintedRoomArt(theme)}</div>${furniture.map(i=>cottagePreviewObject(i,state.layout[i.id])).join('')}${room?cottagePreviewObject(item,room.position,true):''}${item.type==='pet'?`<div class="preview-scene-pet">${petLifeSprite(item.id,cottagePreview.action)}</div>`:''}</div>${room?.solo?'<p class="preview-note">小屋空间已满，当前单独展示这件商品。</p>':''}`;
}
function cottagePreviewModes(item){return item.type==='theme'?[]:item.type==='wear'?[['detail','试穿效果'],['original','当前穿搭']]:['room','theme','pet'].includes(item.type)?[['detail','放大查看'],['room','小屋效果']]:[]}
function cottagePreviewPurchase(item){
 const owned=state.owned.includes(item.id),placed=item.type==='wear'?state.avatar[item.slot]===item.id:state.equipped.includes(item.id);
 if(item.type==='feed')return {label:'购买一包',disabled:false};
 if(owned&&item.type==='pet')return {label:'照顾',disabled:false};
 if(owned&&item.supplyKind&&petSupplyTarget)return {label:'赠给 / 使用',disabled:false};
 if(owned&&(placed||item.type==='tool'))return {label:item.type==='wear'?'已穿着':item.type==='tool'?'已解锁':item.type==='theme'?'已使用':'已摆放',disabled:true};
 return {label:owned?(item.type==='wear'?'穿上':'摆放'):item.type==='pet'?'领养':'购买',disabled:!owned&&item.month&&item.month!==cottageMonthKey()};
}
function cottagePreviewContent(item){
 const mode=cottagePreview.mode;
 if(mode==='room'||item.type==='theme')return cottagePreviewScene(item);
 if(item.type==='wear')return `<div class="preview-character" data-preview-wear="${mode==='original'?'original':item.id}">${playerSprite(mode==='original'?null:item)}</div>`;
 if(item.type==='pet')return `<div class="preview-detail-art preview-animal">${petLifeSprite(item.id,cottagePreview.action)}</div>`;
 if(item.type==='tool')return `<div class="preview-detail-art preview-tool">${cottageItemArt(item)}</div><p class="preview-note">解锁后，可在酸碱实验中查看模拟 pH 读数。</p>`;
 return `<div class="preview-detail-art"><div class="preview-zoom-art" style="--preview-zoom:${cottagePreview.zoom}">${cottageItemArt(item)}</div></div>`;
}
function drawCottagePreview(focusSelector){
 const item=cottageItems.find(i=>i.id===cottagePreview?.id);if(!item)return;
 const modes=cottagePreviewModes(item),purchase=cottagePreviewPurchase(item),owned=state.owned.includes(item.id),price=item.type==='feed'?`${item.price} 金币 / 包`:owned?'已拥有':item.price?`${item.price} 金币`:'免费';
 modal(`<section class="shop-preview" data-preview-item="${item.id}"><div class="preview-heading"><span class="preview-eyebrow">商品预览</span><h2 id="shop-preview-title">${item.name}</h2><p>${item.desc}</p></div>${modes.length?`<div class="preview-tabs" aria-label="预览方式">${modes.map(([mode,label])=>`<button class="${cottagePreview.mode===mode?'active':''}" data-preview-mode="${mode}" aria-pressed="${cottagePreview.mode===mode}">${label}</button>`).join('')}</div>`:''}<div class="preview-stage">${cottagePreviewContent(item)}</div>${item.type==='pet'?`<div class="preview-pet-actions" aria-label="小动物动作演示">${[['idle','日常'],['sleep','睡觉'],['eat','吃东西'],['play','玩耍'],['bath','洗澡'],['groom','梳毛']].map(([action,label])=>`<button data-preview-pet-action="${action}" class="${cottagePreview.action===action?'active':''}" aria-pressed="${cottagePreview.action===action}">${label}</button>`).join('')}</div>`:''}${item.type==='room'&&cottagePreview.mode==='detail'?`<div class="preview-zoom"><button data-preview-zoom="-1" aria-label="缩小商品" ${cottagePreview.zoom<=1?'disabled':''}>−</button><span aria-live="polite">${Math.round(cottagePreview.zoom*100)}%</span><button data-preview-zoom="1" aria-label="放大商品" ${cottagePreview.zoom>=2?'disabled':''}>＋</button></div>`:''}${item.type==='feed'?`<p class="preview-note">适用：${{cat:'猫咪',dog:'狗狗',rabbit:'兔子',chicken:'小鸡',duck:'小鸭',budgie:'鹦鹉',hamster:'仓鼠',guinea:'豚鼠',hedgehog:'刺猬',turtle:'乌龟'}[item.species]} · 每包 24 份 · 每天喂一次，每次 1 份</p>`:''}${item.speciesAllowed?`<p class="preview-note">适合：${item.speciesAllowed.map(s=>petSpecies[s][0].replace('粮','')).join('、')}</p>`:''}<div class="preview-footer"><span class="preview-price">${price}</span><button class="btn light" data-preview-close>返回商店</button><button class="btn" data-preview-buy ${purchase.disabled?'disabled':''}>${purchase.label}</button></div><p class="preview-safe-note">预览不扣金币，不改变小屋和穿搭。</p></section>`);
 const dialog=document.querySelector('#modal');dialog.classList.add('shop-preview-dialog');dialog.setAttribute('aria-labelledby','shop-preview-title');
 if(focusSelector)dialog.querySelector(focusSelector)?.focus({preventScroll:true});
}
function showCottagePreview(id){const item=cottageItems.find(i=>i.id===id);if(!item)return;cottagePreviewOrigin=document.activeElement;cottagePreview={id,mode:item.type==='theme'?'room':'detail',action:'idle',zoom:1};drawCottagePreview();document.querySelector('#modal .close')?.focus({preventScroll:true})}
document.addEventListener('click',e=>{const b=e.target.closest('button');if(!b)return;const d=b.dataset;if(d.previewItem){showCottagePreview(d.previewItem);return}if(!cottagePreview||!b.closest('.shop-preview'))return;
 if(d.previewMode){cottagePreview.mode=d.previewMode;drawCottagePreview(`[data-preview-mode="${d.previewMode}"]`)}
 if(d.previewPetAction){cottagePreview.action=d.previewPetAction;drawCottagePreview(`[data-preview-pet-action="${d.previewPetAction}"]`)}
 if(d.previewZoom){cottagePreview.zoom=Math.max(1,Math.min(2,cottagePreview.zoom+Number(d.previewZoom)*.25));drawCottagePreview(`[data-preview-zoom="${d.previewZoom}"]:not(:disabled)`) }
 if(d.previewClose!==undefined)document.querySelector('#modal').close();
 if(d.previewBuy!==undefined){const id=cottagePreview.id;document.querySelector('#modal').close();purchaseCottageItem(id)}
});
document.querySelector('#modal').addEventListener('close',()=>{if(!cottagePreview)return;cottagePreview=null;const dialog=document.querySelector('#modal');dialog.classList.remove('shop-preview-dialog');dialog.removeAttribute('aria-labelledby');if(cottagePreviewOrigin?.isConnected)cottagePreviewOrigin.focus({preventScroll:true});cottagePreviewOrigin=null});
