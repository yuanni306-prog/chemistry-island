// Growth loop data: tunable numbers, NPC roster, bosses, relics, potions, museum molecules.
const GROWTH_RULES={
 reviewCorrect:2,reviewSession:5,reviewSize:5,intervals:[1,3,7,14,30],
 fightClear:8,eliteClear:12,bossClear:30,hitBase:1,maxMultiplier:3,lossShare:.5,chestFallback:15,
 treeFeed:10,petFeed:10,treeStages:[0,40,120,240,400,600],petForms:[0,60,180],
 heartsBase:3,heartsMax:5,masteryHeart:.5,masteryRelic:.8,
 questions:{fight:4,elite:6,boss:8},bossHp:10,npcAccuracy:{strong:.8,other:.55,elite:.15},
 affinity:{fightWin:4,fightLoss:2,review:2,arena:1},affinityLevels:[0,10,25,50,90,150],
 badgeCoins:60,badgeXp:80,museumSetCoins:40,museumSetXp:40
};
const TREE_STAGES=['星尘种子','破土幼苗','抽枝小树','繁叶之树','初绽星花','星光满树'];
const PET_FORMS=['初识','闪耀','星辉'];
const NPCS=[
 {id:'xiaoya',name:'小芽',seed:1,strong:0,title:'命名小能手',review:'我陪你复习，错了也没关系，名字多念几遍就记住了。',fight:'报上名来，分子！',win:'名字我都记下了，下次换我赢。',lose:'回去把主链和编号再数一遍，我等你。'},
 {id:'ayun',name:'阿云',seed:4,strong:1,title:'反应条件达人',review:'今天的复习由我盯着火候，条件看清楚再答。',fight:'先看条件，再出手。',win:'条件对了，结果自然就对了。',lose:'别急，回去看看是水溶液还是醇溶液。'},
 {id:'zisu',name:'紫苏',seed:9,strong:2,title:'易错点猎人',review:'错题是我的收藏，也是你的地图。',fight:'我在等你犯错，然后记下来。',win:'这次没抓到新错题，真可惜。',lose:'错题本又厚了一页，这是好事。'}
];
const NPC_LINES={
 xiaoya:['我是小芽，负责给岛上每个新来的分子登记名字。名字起对了，它们就不会迷路。','昨晚我整理了一箱旧标签，「2-氯-3-甲基丁烷」和「3-氯-2-甲基丁烷」只差一个数字，却是两个完全不同的住址。','岛北边的灯塔是用最长的碳链当主链建起来的。站在上面从离取代基最近的一头数起，永远不会数错。','送你一枚我亲手做的发夹，别在远征的背包上。它提醒我：先找主链，再看编号，最后才写取代基。','元素树开花的那天，我想把所有分子的名字都挂在树上。到时候，你来念第一个好不好？'],
 ayun:['我叫阿云，管着实验室的火和水。同一个溴乙烷，放进水里和放进乙醇里，走的是两条完全不同的路。','岛上流传一句话：条件不同，断键不同。我把它刻在了实验台边上，每天开工前看一眼。','有一次我忘了先用硝酸酸化就加硝酸银，沉淀糊成一团，什么都看不清。从那以后，“顺序”两个字我再也没忘过。','这是我的旧护目镜，送你。远征路上遇到看不清的现象，先想条件，再下结论。','等你拿齐徽章，我带你去看岛心那口喷泉。据说里面的水能让任何反应停在你想停的那一步。'],
 zisu:['我是紫苏。别人收集贝壳，我收集错题。每一道错题背后都藏着一个没被看清的规律。','你的错题本我偷偷看过了，别紧张。错得越具体，复习的时候越容易抓住它。','岛上的雾每隔几天就会回来一次，像那些以为记住了的知识点。所以我在第 1、3、7 天各敲一次钟。','送你一本我用了很久的错题笔记。远征时第一次答错不会掉心，算是我陪你一起扛。','等元素树满树星光，我会把错题本里最后一页撕下来贴在树下。那一页，一直是空的。']
};
const BOSSES=[
 {chapter:1,name:'碳骨架守卫',molecule:'urea',hue:150},
 {chapter:2,name:'烃之灵',molecule:'naphthalene',hue:200},
 {chapter:3,name:'卤素幻影',molecule:'ddt',hue:270},
 {chapter:4,name:'含氧之影',molecule:'ethyl-acetate',hue:20},
 {chapter:5,name:'镜像双子',molecule:'tartaric-acid',hue:320},
 {chapter:6,name:'氮雾',molecule:'aniline',hue:230},
 {chapter:7,name:'环上旅人',molecule:'quinine',hue:95},
 {chapter:8,name:'生命织者',molecule:'dna',hue:0},
 {chapter:9,name:'高分子巨像',molecule:'ptfe',hue:45}
];
const RELICS=[
 {id:'lens',name:'放大镜',icon:'🔍',desc:'每场战斗可排除一个错误选项一次。'},
 {id:'mirror',name:'护心镜',icon:'🛡',desc:'心数上限 +1，并立即恢复 1 颗心。'},
 {id:'glove',name:'连击手套',icon:'🧤',desc:'每场开始时连击已为 1，首题答对即 ×2。'},
 {id:'pouch',name:'星尘袋',icon:'👝',desc:'本局获得的星尘 +25%。'},
 {id:'notes',name:'错题笔记',icon:'📒',desc:'每场第一次答错不掉心。'},
 {id:'letter',name:'导师的信',icon:'✉️',desc:'boss 的血量 −2。'},
 {id:'npc-xiaoya',npc:'xiaoya',name:'小芽的发夹',icon:'🎀',desc:'心数上限 +1，本局星尘 +10%。'},
 {id:'npc-ayun',npc:'ayun',name:'阿云的护目镜',icon:'🥽',desc:'每场可排除一个错误选项一次，boss 血量 −1。'},
 {id:'npc-zisu',npc:'zisu',name:'紫苏的错题本',icon:'📘',desc:'每场第一次答错不掉心，并立即恢复 1 颗心。'}
];
const POTIONS=[
 {id:'heal',name:'治疗药水',icon:'🧪',price:50,desc:'立即恢复 1 颗心。'},
 {id:'hint',name:'提示卡',icon:'💡',price:40,desc:'战斗中排除一个错误选项，一次性。'},
 {id:'charm',name:'星尘护符',icon:'✨',price:60,desc:'下一场战斗获得的星尘翻倍。'}
];
// Museum entries: lesson molecules light up when the lesson is passed; the rest come from expedition chests, boss molecules from the chapter boss.
const MOLECULES=[
 {id:'methane',chapter:1,lesson:'t4-01-01',name:'甲烷',formula:'CH₄',structure:'CH₄',note:'最简单的烃，只含碳和氢两种元素。'},
 {id:'octane',chapter:1,lesson:'t4-01-02',name:'辛烷',formula:'C₈H₁₈',structure:'CH₃(CH₂)₆CH₃',note:'汽油的主要成分之一，易燃、难溶于水、密度比水小。'},
 {id:'ethane',chapter:1,lesson:'t4-01-03',name:'乙烷',formula:'C₂H₆',structure:'CH₃CH₃',note:'两个碳以单键相连，每个碳都满足四价。'},
 {id:'nitrobenzene',chapter:1,lesson:'t4-01-04',name:'硝基苯',formula:'C₆H₅NO₂',structure:'C₆H₅—NO₂',note:'苯环上的氢被硝基取代，官能团是 —NO₂。'},
 {id:'insulin',chapter:1,lesson:'t4-01-05',name:'结晶牛胰岛素',formula:'C₂₅₄H₃₇₇N₆₅O₇₅S₆',structure:'51 个氨基酸残基组成的蛋白质',note:'1965 年我国首次人工全合成的蛋白质。'},
 {id:'propane',chapter:1,name:'丙烷',formula:'C₃H₈',structure:'CH₃CH₂CH₃',note:'液化石油气的成分之一。'},
 {id:'carbon-dioxide',chapter:1,name:'二氧化碳',formula:'CO₂',structure:'O=C=O',note:'虽然含碳，教材仍把它归入无机物研究。'},
 {id:'urea',chapter:1,boss:true,name:'尿素',formula:'CH₄N₂O',structure:'(NH₂)₂CO',note:'第一个由无机物人工合成的有机物，有机化学由此起步。'},
 {id:'butane',chapter:2,lesson:'t4-02-01',name:'丁烷',formula:'C₄H₁₀',structure:'CH₃CH₂CH₂CH₃',note:'与异丁烷互为碳链异构。'},
 {id:'acetylene',chapter:2,lesson:'t4-02-02',name:'乙炔',formula:'C₂H₂',structure:'HC≡CH',note:'四原子共直线，含一个三键。'},
 {id:'benzene',chapter:2,lesson:'t4-02-03',name:'苯',formula:'C₆H₆',structure:'平面正六边形',note:'六条碳碳键完全相同，有离域大 π 键。'},
 {id:'ethylene',chapter:2,name:'乙烯',formula:'C₂H₄',structure:'CH₂=CH₂',note:'六原子共平面，能使溴水褪色。'},
 {id:'propene',chapter:2,name:'丙烯',formula:'C₃H₆',structure:'CH₃CH=CH₂',note:'与 HBr 加成时遵循马氏规则。'},
 {id:'toluene',chapter:2,name:'甲苯',formula:'C₇H₈',structure:'C₆H₅—CH₃',note:'光照下氯化在侧链，铁催化下取代在环上。'},
 {id:'cyclohexane',chapter:2,name:'环己烷',formula:'C₆H₁₂',structure:'六元碳环',note:'苯催化加氢后得到的环烷烃。'},
 {id:'naphthalene',chapter:2,boss:true,name:'萘',formula:'C₁₀H₈',structure:'两个苯环稠合',note:'最简单的稠环芳香烃，有 α、β 两种位置。'},
 {id:'2-chloropropane',chapter:3,lesson:'t4-03-01',name:'2-氯丙烷',formula:'C₃H₇Cl',structure:'CH₃CHClCH₃',note:'主链 3 个碳，氯在 2 位。'},
 {id:'bromoethane',chapter:3,lesson:'t4-03-02',name:'溴乙烷',formula:'C₂H₅Br',structure:'CH₃CH₂Br',note:'沸点 38.4 ℃；水溶液中水解，醇溶液中消去。'},
 {id:'cfc-12',chapter:3,lesson:'t4-03-03',name:'二氯二氟甲烷',formula:'CCl₂F₂',structure:'CCl₂F₂',note:'常用氟利昂，沸点 −29.8 ℃，破坏臭氧层。'},
 {id:'heptafluoropropane',chapter:3,name:'七氟丙烷',formula:'C₃HF₇',structure:'CF₃CHFCF₃',note:'不破坏臭氧层的气体灭火剂。'},
 {id:'chloroform',chapter:3,name:'氯仿',formula:'CHCl₃',structure:'CHCl₃',note:'很好的有机溶剂，蒸气有毒。'},
 {id:'tetrachloromethane',chapter:3,name:'四氯化碳',formula:'CCl₄',structure:'CCl₄',note:'密度比水大的卤代烃溶剂。'},
 {id:'iodoform',chapter:3,name:'碘仿',formula:'CHI₃',structure:'CHI₃',note:'一个碳上连着三个碘原子。'},
 {id:'ddt',chapter:3,boss:true,name:'滴滴涕',formula:'C₁₄H₉Cl₅',structure:'(ClC₆H₄)₂CH—CCl₃',note:'广谱杀虫剂，相当稳定，经食物链富集。'},
 {id:'ethanol',chapter:4,lesson:'t4-04-01',name:'乙醇',formula:'C₂H₆O',structure:'CH₃CH₂OH',note:'含羟基的醇，能与钠反应放出氢气。'},
 {id:'acetaldehyde',chapter:4,lesson:'t4-04-02',name:'乙醛',formula:'C₂H₄O',structure:'CH₃CHO',note:'含醛基，能发生银镜反应。'},
 {id:'acetic-acid',chapter:4,lesson:'t4-04-03',name:'乙酸',formula:'C₂H₄O₂',structure:'CH₃COOH',note:'食醋的主要成分，含羧基。'},
 {id:'pyruvic-acid',chapter:4,lesson:'t4-04-04',name:'丙酮酸',formula:'C₃H₄O₃',structure:'CH₃COCOOH',note:'同时含酮基和羧基的酮酸。'},
 {id:'phenol',chapter:4,name:'苯酚',formula:'C₆H₆O',structure:'C₆H₅—OH',note:'羟基直接连在苯环上，有弱酸性。'},
 {id:'diethyl-ether',chapter:4,name:'乙醚',formula:'C₄H₁₀O',structure:'CH₃CH₂OCH₂CH₃',note:'易挥发、易燃的醚类溶剂。'},
 {id:'acetone',chapter:4,name:'丙酮',formula:'C₃H₆O',structure:'CH₃COCH₃',note:'最简单的酮，常用溶剂。'},
 {id:'formaldehyde',chapter:4,name:'甲醛',formula:'CH₂O',structure:'HCHO',note:'最简单的醛，水溶液叫福尔马林。'},
 {id:'ethyl-acetate',chapter:4,boss:true,name:'乙酸乙酯',formula:'C₄H₈O₂',structure:'CH₃COOCH₂CH₃',note:'乙酸与乙醇酯化的产物，有香味。'},
 {id:'cis-2-butene',chapter:5,lesson:'t4-05-01',name:'顺-2-丁烯',formula:'C₄H₈',structure:'两个甲基在双键同侧',note:'双键不能旋转，于是产生顺反异构。'},
 {id:'lactic-acid',chapter:5,lesson:'t4-05-02',name:'乳酸',formula:'C₃H₆O₃',structure:'CH₃CH(OH)COOH',note:'含一个手性碳，有一对对映异构体。'},
 {id:'trans-2-butene',chapter:5,name:'反-2-丁烯',formula:'C₄H₈',structure:'两个甲基在双键异侧',note:'与顺-2-丁烯互为顺反异构。'},
 {id:'2-butanol',chapter:5,name:'2-丁醇',formula:'C₄H₁₀O',structure:'CH₃CH(OH)CH₂CH₃',note:'第 2 个碳连着四个不同基团，是手性碳。'},
 {id:'tartaric-acid',chapter:5,boss:true,name:'酒石酸',formula:'C₄H₆O₆',structure:'HOOC(CHOH)₂COOH',note:'巴斯德在它的盐里第一次分出对映异构体。'},
 {id:'methylamine',chapter:6,lesson:'t4-06-01',name:'甲胺',formula:'CH₅N',structure:'CH₃NH₂',note:'氨的一个氢被甲基取代，显碱性。'},
 {id:'acetamide',chapter:6,lesson:'t4-06-02',name:'乙酰胺',formula:'C₂H₅NO',structure:'CH₃CONH₂',note:'含酰胺基 —CONH₂。'},
 {id:'trimethylamine',chapter:6,name:'三甲胺',formula:'C₃H₉N',structure:'(CH₃)₃N',note:'叔胺，有鱼腥味。'},
 {id:'ethylenediamine',chapter:6,name:'乙二胺',formula:'C₂H₈N₂',structure:'H₂NCH₂CH₂NH₂',note:'含两个氨基的二元胺。'},
 {id:'aniline',chapter:6,boss:true,name:'苯胺',formula:'C₆H₇N',structure:'C₆H₅—NH₂',note:'最简单的芳香胺，染料工业的原料。'},
 {id:'pyridine',chapter:7,lesson:'t4-07-01',name:'吡啶',formula:'C₅H₅N',structure:'六元含氮杂环',note:'有芳香性的含氮杂环。'},
 {id:'caffeine',chapter:7,lesson:'t4-07-02',name:'咖啡因',formula:'C₈H₁₀N₄O₂',structure:'嘌呤类生物碱',note:'茶和咖啡中的生物碱。'},
 {id:'furan',chapter:7,name:'呋喃',formula:'C₄H₄O',structure:'五元含氧杂环',note:'五元含氧杂环。'},
 {id:'pyrrole',chapter:7,name:'吡咯',formula:'C₄H₅N',structure:'五元含氮杂环',note:'血红素的组成单元之一。'},
 {id:'thiophene',chapter:7,name:'噻吩',formula:'C₄H₄S',structure:'五元含硫杂环',note:'五元含硫杂环。'},
 {id:'quinine',chapter:7,boss:true,name:'奎宁',formula:'C₂₀H₂₄N₂O₂',structure:'喹啉类生物碱',note:'金鸡纳树皮中的生物碱，曾用于治疗疟疾。'},
 {id:'tristearin',chapter:8,lesson:'t4-08-01',name:'三硬脂酸甘油酯',formula:'C₅₇H₁₁₀O₆',structure:'(C₁₇H₃₅COO)₃C₃H₅',note:'饱和脂肪酸形成的甘油酯，常温下为固态。'},
 {id:'cholesterol',chapter:8,lesson:'t4-08-02',name:'胆固醇',formula:'C₂₇H₄₆O',structure:'环戊烷多氢菲骨架',note:'类脂，细胞膜的成分之一。'},
 {id:'glucose',chapter:8,lesson:'t4-08-03',name:'葡萄糖',formula:'C₆H₁₂O₆',structure:'CH₂OH(CHOH)₄CHO',note:'单糖，有还原性。'},
 {id:'glycine',chapter:8,lesson:'t4-08-04',name:'甘氨酸',formula:'C₂H₅NO₂',structure:'H₂NCH₂COOH',note:'最简单的氨基酸。'},
 {id:'adenine',chapter:8,lesson:'t4-08-05',name:'腺嘌呤',formula:'C₅H₅N₅',structure:'嘌呤碱基',note:'核酸中的碱基之一。'},
 {id:'sucrose',chapter:8,name:'蔗糖',formula:'C₁₂H₂₂O₁₁',structure:'葡萄糖与果糖缩合',note:'二糖，水解得葡萄糖和果糖。'},
 {id:'starch',chapter:8,name:'淀粉',formula:'(C₆H₁₀O₅)ₙ',structure:'葡萄糖单元连成的多糖',note:'遇碘显蓝色。'},
 {id:'oleic-acid',chapter:8,name:'油酸',formula:'C₁₈H₃₄O₂',structure:'C₁₇H₃₃COOH',note:'含一个双键的不饱和脂肪酸。'},
 {id:'dna',chapter:8,boss:true,name:'脱氧核糖核酸',formula:'(脱氧核苷酸)ₙ',structure:'双螺旋',note:'遗传的物质基础。'},
 {id:'polyethylene',chapter:9,lesson:'t4-09-01',name:'聚乙烯',formula:'(C₂H₄)ₙ',structure:'[—CH₂—CH₂—]ₙ',note:'乙烯加聚得到的高分子。'},
 {id:'polystyrene',chapter:9,lesson:'t4-09-02',name:'聚苯乙烯',formula:'(C₈H₈)ₙ',structure:'[—CH₂—CH(C₆H₅)—]ₙ',note:'质轻、绝热，用于泡沫包装。'},
 {id:'pvc',chapter:9,lesson:'t4-09-03',name:'聚氯乙烯',formula:'(C₂H₃Cl)ₙ',structure:'[—CH₂—CHCl—]ₙ',note:'氯乙烯加聚的产物，常见塑料。'},
 {id:'polypropylene',chapter:9,name:'聚丙烯',formula:'(C₃H₆)ₙ',structure:'[—CH₂—CH(CH₃)—]ₙ',note:'丙烯加聚，用于容器和纤维。'},
 {id:'nylon-66',chapter:9,name:'尼龙-66',formula:'(C₁₂H₂₂N₂O₂)ₙ',structure:'[—NH(CH₂)₆NH—CO(CH₂)₄CO—]ₙ',note:'己二胺与己二酸缩聚的产物。'},
 {id:'phenolic-resin',chapter:9,name:'酚醛树脂',formula:'(C₇H₆O)ₙ',structure:'苯酚与甲醛缩聚',note:'最早的合成树脂之一。'},
 {id:'ptfe',chapter:9,boss:true,name:'聚四氟乙烯',formula:'(C₂F₄)ₙ',structure:'[—CF₂—CF₂—]ₙ',note:'耐高温、耐腐蚀的“塑料王”。'}
];
