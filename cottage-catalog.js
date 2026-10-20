const furnitureGroups=[['bed','床'],['table','餐桌'],['chair','椅子'],['sofa','沙发'],['bookshelf','书柜'],['desk','书桌'],['fireplace','壁炉']];
const decorationGroups=[['rug','地毯'],['plant','绿植'],['flowers','花盆'],['lamp','灯具'],['petbed','动物窝'],['theme','小屋风格']];
const wardrobeSlots=[['top','上衣'],['bottom','下装'],['hair','头发'],['headwear','发饰'],['accessory','配饰']];
const furnitureVariantNames={
 bed:['弧形软包床','复古铁艺床','松木双层床','亚麻四柱床','抽屉储物床'],
 table:['圆形独脚餐桌','低矮椭圆茶几','玻璃金属餐桌','长条支架餐桌','折叠翼板餐桌'],
 chair:['温莎木椅','布艺软包椅','金属悬臂椅','圆弧扶手椅','藤编餐椅'],
 sofa:['弧形羊羔绒沙发','拉扣绒面沙发','L 形转角沙发','原木藤编沙发','滚枕日间床'],
 bookshelf:['梯形开放书架','玻璃双门书柜','横向矮书柜','书架储物组合柜','错层陈列书架'],
 desk:['支架写字台','圆镜梳妆台','金属升降书桌','卷帘秘书书桌','L 形抽屉书桌'],
 fireplace:['石雕拱门壁炉','红砖嵌入壁炉','陶瓷独立炉','铸铁柴火炉','圆柱金属炉'],
 rug:['奶油菱纹地毯','莓果花边地毯','海盐条纹地毯','森林编织地毯','月光星纹地毯'],
 plant:['龟背竹','小仙人掌','垂叶榕','琴叶榕','月光蕨'],
 flowers:['雏菊花盆','玫瑰花盆','绣球花盆','向日葵花盆','铃兰花盆'],
 lamp:['奶油蘑菇灯','莓果花瓣灯','海盐玻璃灯','森林阅读灯','月光星灯'],
 petbed:['奶油圆软窝','莓果小帐篷','海盐条纹窝','森林藤编窝','月光星星窝']
};
const cottagePalettes=[['#bb9870','#ede0b9','#a5b59b'],['#aa6972','#efd0c9','#cb909d'],['#71979d','#d2e3de','#8cb8c4'],['#695247','#c5ac82','#8b9b6d'],['#777495','#d2cce5','#a1a4cf']];
function expandCottageCatalog(items){
 for(const [base,names] of Object.entries(furnitureVariantNames)){
  const original=items.find(i=>i.id===base);original.group=base;original.base=base;
  names.forEach((name,index)=>items.push({...original,id:`${base}-${index+1}`,name,starter:false,price:(original.price||45)+20+index*15,desc:`${decorationGroups.some(g=>g[0]===base)?'装饰':'家具'} · ${name}`,variant:index+1,palette:cottagePalettes[index]}));
 }
 for(const item of items){if(item.id==='space')item.group='theme';if(item.type==='pet')item.group='pets';if(item.type==='tool')item.group='tools'}
 const themes=[['cream','奶油小屋','#efe1bc','#ceac82'],['rose','莓果小屋','#e6c3ca','#bc8c80'],['sea','海盐小屋','#c2dde0','#a4bcb5'],['forest','森林小屋','#b6c6a4','#9da878'],['moon','月光小屋','#9396b8','#ada4c6']];
 for(const [id,name,wall,floor] of themes)items.push({id:`theme-${id}`,name,category:'decor',group:'theme',type:'theme',price:140,wall,floor,desc:({cream:'奶油拱窗 · 人字木地板',rose:'莓果花墙 · 格纹窗帘 · 陶砖',sea:'海景舷窗 · 百叶窗 · 漂木',forest:'树干拱梁 · 林间窗景',moon:'月景花窗 · 云纹石地板'})[id]});
 const clothes={
 top:[['基础衬衫',0,'#83a49a'],['奶油针织衫',45,'#dac49a'],['莓果连帽衫',55,'#bc7c89'],['海盐条纹衫',50,'#7ea7b4'],['森林背带上衣',65,'#718d69'],['研究员白大褂',80,'#ece7dc']],
 bottom:[['基础长裤',0,'#6f7e87'],['奶油短裤',35,'#c7ad81'],['莓果半裙',45,'#a86c7c'],['海盐阔腿裤',50,'#718ea3'],['森林工装裤',55,'#7c8965'],['月光百褶裙',60,'#9990b2']],
 hair:[['基础短发',0],['齐肩短发',35],['柔软长发',45],['双麻花辫',50],['高丸子头',45],['蓬松卷发',55]],
 headwear:[['无发饰',0],['奶油蝴蝶结',25,'#d5ba87'],['莓果花发夹',30,'#c17e8a'],['海盐贝雷帽',40,'#8aabb7'],['森林叶冠',45,'#7e976f'],['月光星发卡',50,'#b6afd3']],
 accessory:[['无配饰',0],['圆框眼镜',25,'#786651'],['莓果小围巾',35,'#b97280'],['海盐斜挎包',45,'#7f9aa8'],['森林小背包',50,'#82956d'],['月光项链',40,'#c6b98b']]
 };
 for(const [slot,options] of Object.entries(clothes))options.forEach(([name,price,color],variant)=>items.push({id:`wear-${slot}-${variant}`,name,price,color,variant,slot,type:'wear',category:'wardrobe',group:slot,starter:variant===0,desc:variant===0?'免费基础款':`${wardrobeSlots.find(s=>s[0]===slot)[1]} · 可搭配穿着`}));
 const extraClothes={
 top:[['亚麻短西装',68,'#adbaa5'],['立领棉麻衬衫',52,'#bdcccb'],['宽松套头毛衣',62,'#c5b394'],['学院水手领上衣',58,'#8e9bac'],['针织 V 领背心',48,'#ad928c'],['双排扣长风衣',85,'#baa07d']],
 bottom:[['复古直筒牛仔裤',52,'#819aa8'],['高腰百慕大短裤',42,'#b7a58d'],['垂坠长裙',60,'#a28f9e'],['运动束脚裤',46,'#9aafa3'],['棉麻阔腿长裤',55,'#c6b797'],['灯芯绒 A 字裙',48,'#ad8d75']],
 hair:[['轻盈精灵短发',38],['低束自然马尾',45],['低侧麻花辫',40],['半扎公主长发',48],['锁骨层次卷发',52],['慵懒长卷发',58]],
 headwear:[['天鹅绒发箍',32,'#b598a6'],['运动发带',28,'#99b6b4'],['金属双发夹',30,'#b5a179'],['羊毛钟形帽',50,'#b6a081'],['珍珠边发夹',38,'#e3dac7']],
 accessory:[['帆布托特包',45,'#b9ac8d'],['小珍珠耳饰',35,'#e6dac1'],['复古墨镜',40,'#867665'],['简约腕表',45,'#b7aa8b'],['吊坠项链',38,'#c0ab86'],['皮革腰带',35,'#99795f']]
 };
 for(const [slot,options] of Object.entries(extraClothes))options.forEach(([name,price,color],index)=>{const variant=index+(slot==='headwear'?7:6);items.push({id:`wear-${slot}-${variant}`,name,price,color,variant,slot,type:'wear',category:'wardrobe',group:slot,desc:`${wardrobeSlots.find(s=>s[0]===slot)[1]} · 可搭配穿着`})});
 const hairNames=GAME_HAIR_STYLES.map(style=>style.name);for(let n=0;n<12;n++)items.find(i=>i.id===`wear-hair-${n}`).name=hairNames[n];
 const paintedNames={top:['基础卷袖棉麻衬衫','雏菊绣花针织开衫','麦黄连帽短斗篷','海盐条纹水手衫','森林刺绣园艺围裙','赤陶色灯笼袖衬衫','苔绿工装外套','花卉刺绣蕾丝衬衫','燕麦麻花针织毛衣','学院蝴蝶结水手衫','森林绣花针织背心','双排扣长风衣'],bottom:['基础鼠尾草长裤','苔绿腰带翻边短裤','莓果刺绣双层半裙','巧克力阔腿长裤','芥黄拼布工装裤','月光百褶裙','奶油棉麻长裤','橄榄绿高腰短裤','森林花草刺绣围裙裙','复古翻边牛仔裤','炭灰阔腿长裤','灯芯绒口袋半裙']};for(const [slot,names]of Object.entries(paintedNames))for(let n=0;n<12;n++)items.find(i=>i.id===`wear-${slot}-${n}`).name=names[n];
 const bottomColors=['#8d9674','#757b4d','#ad694b','#6f5943','#c39b4f','#a296b5','#d4c3a0','#858464','#788361','#6b8392','#68675f','#ad8350'];for(let n=0;n<12;n++)items.find(i=>i.id===`wear-bottom-${n}`).color=bottomColors[n];
 const hat=items.find(i=>i.id==='hat');Object.assign(hat,{category:'wardrobe',type:'wear',slot:'headwear',group:'headwear',variant:6,color:'#7778ac',desc:'星纹尖顶魔法帽'});
 return expandPetCatalog(items);
}
const monthlyCollections=[['雪松', '#a7b8c3','#e0e6eb'],['玫瑰','#bd8297','#ead1dc'],['春芽','#91ab7b','#dce8c9'],['雨晴','#819da9','#d0e4e7'],['铃兰','#9cbaa0','#e0ede0'],['海风','#76a9b5','#c6e5e6'],['夏柠','#b5b06a','#efe8b0'],['星野','#8788b8','#d0cdee'],['桂香','#c1a364','#efe0b9'],['秋枫','#b67c58','#eed1aa'],['暖栗','#9a7d68','#deccba'],['冬灯','#8c9ba9','#dde3e8']];
function cottageMonthKey(date=new Date()){return `${date.getFullYear()}-${String(date.getMonth()+1).padStart(2,'0')}`}
function monthlyCottageItems(date=new Date()){
 const month=cottageMonthKey(date),[name,color,light]=monthlyCollections[date.getMonth()];
 return [
  {id:`limited-${month}-house`,name:`${name}小屋`,type:'theme',category:'limited',group:'house',price:180,wall:light,floor:color,month,desc:`${Number(month.slice(5))} 月限定 · 墙纸与地板`},
  {id:`limited-${month}-bed`,name:`${name}限定床`,base:'bed',type:'room',category:'limited',group:'house',price:120,w:2,h:2,variant:5,palette:['#967251',light,color],month,desc:'限定家具 · 购买后永久保留'},
  {id:`limited-${month}-lamp`,name:`${name}限定灯`,base:'lamp',type:'room',category:'limited',group:'house',price:70,w:1,h:1,variant:5,palette:['#967251',light,color],month,desc:'限定灯具 · 购买后永久保留'},
  {id:`limited-${month}-top`,name:`${name}限定上衣`,type:'wear',category:'limited',group:'outfit',slot:'top',variant:3,color,price:65,month,desc:'限定人物装扮'},
  {id:`limited-${month}-headwear`,name:`${name}限定发饰`,type:'wear',category:'limited',group:'outfit',slot:'headwear',variant:5,color,price:40,month,desc:'限定人物装扮'},
  {id:`limited-${month}-accessory`,name:`${name}限定配饰`,type:'wear',category:'limited',group:'outfit',slot:'accessory',variant:2,color,price:50,month,desc:'限定人物装扮'}
 ];
}
