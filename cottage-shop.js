let cottageGroup='bed';
function refreshMonthlyCatalog(){
 const month=cottageMonthKey();
 for(let n=cottageItems.length-1;n>=0;n--){const i=cottageItems[n];if(i.month&&i.month!==month&&!state.owned.includes(i.id))cottageItems.splice(n,1)}
 for(const item of Object.values(state.purchasedCatalog||{}))if(state.owned.includes(item.id)&&!cottageItems.some(i=>i.id===item.id))cottageItems.push(item);
 for(const item of monthlyCottageItems())if(!cottageItems.some(i=>i.id===item.id))cottageItems.push(item);
}
function activeCottageTheme(){return cottageItems.find(i=>i.type==='theme'&&state.equipped.includes(i.id))||null}
function cottageShopGroups(){return cottageCategory==='furniture'?furnitureGroups:cottageCategory==='decor'?decorationGroups:cottageCategory==='wardrobe'?wardrobeSlots:cottageCategory==='petcare'?[['feed','饲料'],['house','小屋'],['bed','窝与睡篮'],['bowl','食盆'],['bath','浴盆'],['toy','玩具']]:cottageCategory==='limited'?[['house','小屋限定'],['outfit','人物限定']]:[]}
function cottageShopSelection(){return cottageItems.filter(i=>{
 if(cottageCategory==='inventory'){return state.owned.includes(i.id)||(i.type==='feed'&&petFoodUnits(i.species)>0)}
 if(i.month&&i.month!==cottageMonthKey())return false;
 if(cottageCategory!=='all'&&i.category!==cottageCategory&&!(cottageCategory==='petcare'&&i.supplyKind))return false;
 return cottageGroup==='all'||i.group===cottageGroup;
})}
function cottageItemArt(item){
 if(item.type==='wear'){let sprite=playerSprite(item);if(item.slot==='hair')sprite=sprite.replace(/viewBox="0 0 96 (160|216)"/,'viewBox="10 -8 80 134"');if(item.slot==='headwear')sprite=sprite.replace(/viewBox="0 0 96 (160|216)"/,'viewBox="12 -14 76 92"');return `<div class="wear-preview preview-${item.slot}">${sprite}</div>`;}
 if(item.type==='theme')return paintedThemePreview(item);
 return cottageSprite(item.id);
}
function cottageSaleValue(id){return Math.floor((state.paidPrices[id]||0)*.25)}
function cottageShopHTML(){
 const groups=cottageShopGroups(),month=cottageMonthKey(),selected=cottageShopSelection();
 return `<section class="cottage-shop"><div class="section-head"><h2>${cottageCategory==='wardrobe'?'人物衣橱':cottageCategory==='inventory'?'我的仓库':'小屋商店'}</h2><small>回售返还实付金币的 25%</small></div><div class="shop-tabs" role="tablist" aria-label="商店分类">${cottageCategories.map(([id,name])=>`<button role="tab" data-category="${id}" aria-selected="${cottageCategory===id}" aria-controls="shop-products" id="category-${id}" ${cottageCategory===id?'class="active"':''}>${name}</button>`).join('')}</div>${groups.length?`<div class="shop-groups" aria-label="商品类型"><button data-shop-group="all" class="${cottageGroup==='all'?'active':''}">全部</button>${groups.map(([id,name])=>`<button data-shop-group="${id}" class="${cottageGroup===id?'active':''}">${name}</button>`).join('')}</div>`:''}${cottageCategory==='limited'?`<div class="monthly-banner"><div><b>${month.replace('-',' 年 ')} 月 · ${monthlyCollections[new Date().getMonth()][0]}限定</b><p>本月可购买，月底下架；已购商品永久保留在仓库。</p></div><span>每月 6 款</span></div>`:''}${cottageCategory==='petcare'?petSupplySelector():''}<div class="shop-products" id="shop-products" role="tabpanel" aria-labelledby="category-${cottageCategory}">${selected.map(i=>{
 const owned=i.type==='feed'?petFoodUnits(i.species)>0:state.owned.includes(i.id),placed=i.type==='wear'?state.avatar[i.slot]===i.id:state.equipped.includes(i.id),sale=i.type==='feed'?petFoodSaleValue(i.species):cottageSaleValue(i.id);
 const label=i.type==='feed'?'购买一包':i.supplyKind&&owned?'赠给 / 使用':owned?(i.type==='wear'?(placed?'已穿着':'穿上'):i.type==='pet'?'照顾':i.type==='tool'?'已解锁':placed?'收起':'摆放'):i.type==='pet'?'领养':'购买';
 return `<article class="shop-item ${placed?'placed':''}"><div class="shop-item-art"><button class="shop-art-preview" data-preview-item="${i.id}" aria-label="预览${i.name}">${cottageItemArt(i)}</button></div><div class="shop-item-copy"><span class="shop-item-category">${i.month?`${i.month} 限定${i.month!==month?' · 已下架':''}`:i.type==='wear'?wardrobeSlots.find(s=>s[0]===i.slot)?.[1]:cottageCategories.find(c=>c[0]===i.category)?.[1]}</span><h3>${i.name}</h3><p>${i.desc}</p>${i.supplyKind&&state.petSupplies[i.id]?`<p class="feed-stock">正在给 ${cottageItems.find(p=>p.id===state.petSupplies[i.id])?.name||'小动物'} 使用</p>`:''}${i.type==='feed'?`<p class="feed-stock">剩余 ${petFoodUnits(i.species)} 份</p>`:''}<div class="shop-item-bottom"><span class="price">${i.type==='feed'?i.price+' 金币 / 包':owned?'已拥有':i.price?i.price+' 金币':'免费'}</span><div class="shop-item-actions"><button class="btn light shop-preview-button" data-preview-item="${i.id}" aria-label="预览${i.name}">预览</button><button class="btn ${owned?'light':''}" data-buy="${i.id}" ${owned&&(i.type==='tool'||i.type==='wear'&&placed)?'disabled':''}>${label}</button></div></div>${owned&&sale>0?`<button class="sell-item" data-sell="${i.id}">回售 +${sale} 金币</button>`:owned&&i.starter?'<span class="starter-label">免费基础款 · 不可回售</span>':''}</div></article>`
 }).join('')||'<p class="sub">这个分类暂时没有物品。</p>'}</div></section>`;
}
function sellCottageItem(id){const item=cottageItems.find(i=>i.id===id);if(item?.type==='feed')return sellPetFood(item);const value=cottageSaleValue(id);if(!item||!state.owned.includes(id)||value<=0)return;
 cottageStoreItem(id);state.owned=state.owned.filter(x=>x!==id);state.equipped=state.equipped.filter(x=>x!==id);delete state.layout[id];delete state.paidPrices[id];delete state.purchasedCatalog[id];delete state.pets[id];delete cottagePetPositions[id];delete state.petSupplies[id];for(const [supply,pet] of Object.entries(state.petSupplies))if(pet===id)delete state.petSupplies[supply];
 if(item.type==='wear'&&state.avatar[item.slot]===id)state.avatar[item.slot]=`wear-${item.slot}-0`;
 if(cottageSelected===id)cottageSelected=null;
 state.coins+=value;save();render();toast(`已回售，获得 ${value} 金币`);
}
document.addEventListener('click',e=>{const b=e.target.closest('button');if(!b)return;if(b.dataset.shopGroup){cottageGroup=b.dataset.shopGroup;render();document.querySelector(`[data-shop-group="${cottageGroup}"]`)?.focus()}if(b.dataset.sell)sellCottageItem(b.dataset.sell)});
setInterval(()=>{if(typeof state==='undefined')return;if(!cottageItems.some(i=>i.month===cottageMonthKey())){refreshMonthlyCatalog();if(route==='room')render()}},60000);
