// Topic-specific guidance shared by the notebook and individual retry dialogs.
const arenaKnowledgeGuides={
 intro:[['先看组成，再检查分类中的常见例外。CO、CO₂和碳酸盐虽然含碳，通常仍归入无机物。','“含碳”不是判断有机物的充分条件；乙醇、乙酸等可结合其完整结构判断。'],['碳通常形成四个共价键。数键时，单键计一个、双键计两个，不能只数与碳相邻的原子。','读结构简式时先沿碳链找骨架，再补充支链和官能团；碳骨架既可以成链，也可以成环。'],['应把 —COOH 作为完整羧基识别，不能把其中的 —OH 误认成独立的醇羟基。','先定位官能团，再看它连接的原子及周围结构；官能团的相似性不等于分子的所有性质都相同。']],
 hydrocarbon:[['烃只含碳、氢两种元素，出现氧、氮或卤素时就不能归入烃。','CₙH₂ₙ₊₂ 只用于链状饱和烷烃。先确认适用范围，再代入碳原子数计算氢原子数。'],['加成反应的判断依据是双键转为单键，两端碳原子分别连接加入的原子或原子团。','比较反应前后结构：乙烯加氢得到乙烷，碳骨架没有拆开，也不是用氢替代原来已有的原子。'],['苯只含碳和氢，属于芳香烃。分类看组成，反应性质还必须看结构。','苯环具有特殊的稳定结构，不能因为画出了交替双键，就直接套用普通烯烃的反应规律。']],
 naming:[['选最长的连续碳链作主链，不要受结构画在纸面上的横竖方向影响。','确定主链后，从使取代基位次尽可能小的一端编号，再写出位次、取代基和主链名称。'],['名称中的“丙、丁”等反映主链碳数；支链甲基的碳也要计入分子的总碳数。','例如 CH₃CH(CH₃)CH₃ 的主链为三个碳，总碳数为四个，2 号碳带甲基，称为 2-甲基丙烷。'],['同分异构体必须同时满足“分子式相同”和“结构不同”。只核对分子式是不够的。','应比较原子的实际连接方式；同一结构换一个方向画，并不会变成新的同分异构体。']],
 halogen:[['识别卤素符号：F 为氟、Cl 为氯、Br 为溴、I 为碘。卤代烃可看作烃中的氢被卤素替代。','看清被替换的是氢，不能误认为碳骨架中的碳被卤素替代。'],['溴乙烷在适当的 NaOH 水溶液条件下转为乙醇，结构变化是 Br 被 —OH 替代。','判断取代反应时应比较反应前后的连接：原有原子或原子团被另一个替换，与双键加成不同。'],['有机反应应同时记录反应物、反应条件、产物和反应类型。相同反应物并不保证产物相同。','溶剂、温度和催化剂等条件都会影响反应，不能只凭试剂名称套用结果。']],
 alcohol:[['醇羟基连接在饱和碳原子上；酚羟基直接连接在芳香环的碳上。','含苯环不等于属于酚。例如 C₆H₅CH₂OH 的羟基连在 CH₂ 上，仍属于醇。'],['醚具有 C—O—C 连接，氧原子两侧连接有机基团；醇则有 O—H 连接。','CH₃OCH₃ 与 CH₃CH₂OH 虽有相同分子式，却有不同连接方式，不能据组成把它们当成同一类。'],['乙醇可在一定条件下氧化为乙醛，进一步氧化可得到乙酸。应连同条件理解产物。','官能团带来一类物质的特征性质，但分子其余部分也会影响性质，不能把“相似”理解为“完全相同”。']],
 carbonyl:[['羰基是 C=O，而醛基是 —CHO。看到羰基后，还要继续检查羰基碳连接了什么。','醛、酮、羧酸和酯都可能含羰基，不能把所有含 C=O 的物质都归为醛。'],['醛的羰基碳至少连接一个氢；酮的羰基碳连接两个碳原子。','CH₃CHO 是乙醛，CH₃COCH₃ 是丙酮。区分它们应依据连接方式，而不是仅看是否含氧。'],['醛通常较易氧化为相应羧酸。例如乙醛中的 —CHO 可转变为乙酸中的 —COOH。','普通酮在温和条件下不易发生同样的氧化；不要把醛的氧化规律直接用于所有酮。']],
 carboxyl:[['羧酸以 —COOH 为特征官能团。乙酸在水中表现弱酸性，不等同于强酸或碱。','判断时把羧基看作整体，它与独立醇羟基的性质不同。'],['乙酸与乙醇在适当催化、加热条件下生成乙酸乙酯和水，应同时识别两种产物。','酯化反应可逆，催化与加热不意味着反应物必定完全转化；不能省略关键反应条件。'],['酯的特征连接为 —C(=O)—O—，其中单键氧还连接有机基团。','气味不是唯一鉴别依据，不能凭“有香味”确定是酯，更不能直接闻未知试剂来判断。']],
 stereo:[['构造异构的原子连接方式不同；空间异构的连接顺序相同，差异在空间排列。','正丁烷与 2-甲基丙烷属于构造异构，不能仅因分子式相同就称为空间异构。'],['判断顺反异构时，要分别检查双键两端每个碳所连的两个原子或原子团。','两端各自都必须连接两个不同的基团；乙烯、丙烯有一端连两个相同的氢，因此不满足条件。'],['本课常见手性碳的判断条件是：四面体碳连接四个不同的原子或原子团。','先列出四个基团再逐一比较。若出现两个相同基团，就不满足这个判断条件。']],
 nitrogen:[['胺可看作氨中的氢被烃基替代后的衍生物，例如甲基替代一个氢得到甲胺 CH₃NH₂。','甲胺含氮，不属于只含碳、氢的烃；应区分“烃”和“烃的衍生物”。'],['许多胺中的氮可以接受质子，因此表现碱性。判断依据是其接受质子的能力。','分子结构会影响碱性的强弱，不能说所有胺的碱性完全相同。'],['杂原子必须位于环骨架中，才使该环成为杂环；侧链上的氮、氧等不算环骨架中的杂原子。','生物碱是天然含氮有机化合物的一类，多数具有碱性；“多数”不能改成“全部且碱性相同”。']],
 nutrition:[['葡萄糖是单糖，蔗糖是二糖，淀粉和纤维素是多糖。分类依据不是是否有甜味。','同为多糖并不表示结构和性质完全相同，应把分类与具体物质性质分开判断。'],['淀粉遇碘试剂通常呈蓝色或蓝黑色，这一显色可作为含淀粉的判断依据。','不显蓝色不能唯一确定是葡萄糖，因为水等不含淀粉的样品也不会出现该现象。'],['油脂主要是甘油与高级脂肪酸形成的酯，学习性质时要联系酯的结构。','油脂的碱性水解称为皂化，主要生成甘油和高级脂肪酸盐，不能漏掉“盐”这一条件相关的产物。']],
 protein:[['氨基酸通常同时含氨基和羧基。常见 α-氨基酸的氨基位于与羧基相邻的碳上。','识别时先定位 —COOH，再找相邻碳与氨基，不能把醛基或醚键当作这两个基团。'],['肽键的典型结构是 —CO—NH—，连接氨基酸残基；应与 C—O—C 醚键区分。','两个氨基酸形成肽键，通常由一个氨基与一个羧基参与并脱去水，蛋白质由氨基酸残基组成。'],['蛋白质变性主要涉及空间结构改变，水解则涉及肽键断裂。两者不能等同。','发生变性并不代表肽键已全部断裂，更不能断言蛋白质已全部成为游离氨基酸。']],
 polymer:[['乙烯通过碳碳双键打开并彼此连接，形成聚乙烯长链，这一过程属于加聚。','乙烯加聚不脱去水等小分子，应与会脱去小分子的某些缩聚过程区别。'],['聚合物的性质与其结构有关，判断材料不能只看颜色、形状或手感。','外观相似的塑料可能成分不同，需要标签、成分或结构等更可靠的依据。'],['有机实验应先核对试剂标签与危险性，再按教师指导选择器材和加热方式。','不能一律用明火加热有机物；废液应按成分和实验室规定分类收集，避免不相容物混合。']]
};
let arenaMistakeFilter='pending',arenaMistakePage=0,arenaReviewSession=null;
function arenaMistakeStore(){const a=arenaState();if(!Array.isArray(a.mistakes))a.mistakes=[];return a.mistakes}
function arenaRecordMistake(course,q,chosen=null){
 const lesson=lessons.find(l=>l.id===course),records=arenaMistakeStore();
 const key=q.key||`${course}:course:${q.courseIndex}`;
 let record=records.find(r=>r.key===key);
 const snapshot={key,course,courseTitle:lesson?.title||course,q:q.q,options:[...q.options],a:q.a,why:q.why,topic:q.topic,topicName:q.topicName||arenaTopics[course]?.[q.topic]||lesson?.title||'知识点辨析',concept:lesson?.lines[q.topic]||q.why,chosen,courseIndex:q.courseIndex,mastered:false,lastWrong:Date.now()};
 if(record)Object.assign(record,snapshot,{count:(record.count||1)+1});else{record={...snapshot,count:1};records.push(record)}
 return record;
}
function arenaImportCourseMistakes(){
 const records=arenaMistakeStore();let changed=false;
 for(const key of state.mistakes){const split=key.lastIndexOf(':'),course=key.slice(0,split),index=Number(key.slice(split+1)),lesson=lessons.find(l=>l.id===course);if(!lesson||!lesson.questions[index])continue;
  const questionKey=`${course}:course:${index}`;
  if(!records.some(r=>r.key===questionKey)){const q=lesson.questions[index];arenaRecordMistake(course,{...q,key:questionKey,courseIndex:index,topic:typeof arenaOriginalTopics!=='undefined'?arenaOriginalTopics[course]?.[index]??index:index});changed=true}
 }
 if(changed)save();
}
function arenaMistakeExplanation(r){
 const guide=arenaKnowledgeGuides[r.course]?.[r.topic]||[r.concept,r.why];
 return `<div class="arena-mistake-explanation"><h4>考察知识点</h4><p>${arenaEscape(r.topicName)}</p><h4>正确答案与理由</h4><p><b>${arenaEscape(r.options[r.a])}</b></p><p>${arenaEscape(r.why)}</p><h4>判断步骤与易错点</h4><ol>${guide.filter(Boolean).map(step=>`<li>${arenaEscape(step)}</li>`).join('')}</ol>${r.chosen!==null&&r.chosen!==undefined?`<p class="arena-mistake-choice">上次误选：${arenaEscape(r.options[r.chosen])}。请对照上述结构、适用条件和判断依据，区分它与正确答案。</p>`:''}</div>`;
}
function arenaMistakesHTML(){
 arenaImportCourseMistakes();const records=arenaMistakeStore(),pending=records.filter(r=>!r.mastered).length;
 const filtered=records.filter(r=>arenaMistakeFilter==='all'||(arenaMistakeFilter==='mastered'?r.mastered:!r.mastered)).sort((a,b)=>b.lastWrong-a.lastWrong),pages=Math.max(1,Math.ceil(filtered.length/6));arenaMistakePage=Math.min(arenaMistakePage,pages-1);
 return `<section class="arena-notebook" id="arena-notebook"><div class="section-head"><h2>错题集 <small>${records.length} 题</small></h2><span class="arena-notebook-reward">🪙 每题首次重做答对 +5</span></div><div class="arena-mistake-filters" role="group" aria-label="筛选错题">${[['pending',`待巩固 ${pending}`],['mastered',`已掌握 ${records.length-pending}`],['all',`全部 ${records.length}`]].map(([id,label])=>`<button data-arena-mistake-filter="${id}" aria-pressed="${arenaMistakeFilter===id}">${label}</button>`).join('')}</div><div class="arena-mistake-list">${filtered.slice(arenaMistakePage*6,arenaMistakePage*6+6).map(r=>`<article class="arena-mistake-card"><div class="arena-mistake-meta"><span>${arenaEscape(r.courseTitle)} · ${arenaEscape(r.topicName)}</span><span>${r.mastered?'✓ 已掌握':`答错 ${r.count} 次`}</span></div><h3>${arenaEscape(r.q)}</h3><div class="arena-mistake-actions"><span>${state.rewards.includes('arena-mistake:'+r.key)?'首次答对奖励已领取':'🪙 首次重做答对 +5 金币'}</span><button class="btn light" data-arena-review="${arenaEscape(r.key)}">${r.mastered?'再练一次':'重做这题'} →</button></div><details><summary>查看详细解析</summary>${arenaMistakeExplanation(r)}</details></article>`).join('')||`<div class="arena-empty">${records.length?'这个分类暂时没有错题。':'答错的题会自动收录在这里，可以查看知识点与解析，再单独重做。'}</div>`}</div>${pages>1?`<div class="arena-mistake-pagination"><button class="btn light" data-arena-mistake-page="${arenaMistakePage-1}" ${arenaMistakePage===0?'disabled':''}>上一页</button><span>${arenaMistakePage+1} / ${pages}</span><button class="btn light" data-arena-mistake-page="${arenaMistakePage+1}" ${arenaMistakePage===pages-1?'disabled':''}>下一页</button></div>`:''}</section>`;
}
function startArenaMistakeReview(key){
 const record=arenaMistakeStore().find(r=>r.key===key);if(!record)return;
 const order=arenaShuffle(record.options.map((_,i)=>i));arenaReviewSession={key,options:order.map(i=>record.options[i]),answer:order.indexOf(record.a),selected:null,answered:false,earned:false};drawArenaMistakeReview();$('#modal').scrollTop=0;
}
function drawArenaMistakeReview(){
 const s=arenaReviewSession,r=arenaMistakeStore().find(r=>r.key===s.key),right=s.selected===s.answer;
 arenaOpen(`<section class="arena-review-quiz"><div class="arena-retry-head"><b>错题重做</b><span>🪙 首次答对 +5 金币</span></div><div class="arena-question"><p class="sub">${arenaEscape(r.courseTitle)} · ${arenaEscape(r.topicName)}</p><h2>${arenaEscape(r.q)}</h2><div class="arena-options">${s.options.map((option,i)=>`<button class="option ${s.answered?(i===s.answer?'correct':i===s.selected?'wrong':''):i===s.selected?'selected':''}" data-arena-review-answer="${i}" aria-pressed="${s.selected===i}" ${s.answered?'disabled':''}><span>${String.fromCharCode(65+i)}</span>${arenaEscape(option)}</button>`).join('')}</div>${s.answered?`<div class="arena-feedback ${right?'correct':'wrong'}" role="status"><b>${right?(s.earned?'答对了！获得 5 金币':'答对了！本题奖励已领取'):'还没答对，看看解析再试试。'}</b></div>${arenaMistakeExplanation(r)}<div class="arena-result-actions"><button class="btn light" data-arena-review="${arenaEscape(r.key)}">再做一次</button><button class="btn" data-arena-review-return>返回错题集</button></div>`:`<div class="arena-confirm-row"><p class="arena-think">选好后确认，提交前可以改选。</p><button class="btn" data-arena-review-confirm ${s.selected===null?'disabled':''}>确认答案</button></div>`}</div></section>`);
}
function submitArenaMistakeReview(){
 const s=arenaReviewSession;if(!s||s.answered||s.selected===null)return;
 const r=arenaMistakeStore().find(r=>r.key===s.key);if(!r)return;s.answered=true;
 if(s.selected===s.answer){r.mastered=true;if(r.courseIndex!==undefined)state.mistakes=state.mistakes.filter(key=>key!==`${r.course}:${r.courseIndex}`);s.earned=reward('arena-mistake:'+r.key,5,0)}else{r.mastered=false;r.count++;r.lastWrong=Date.now();r.chosen=r.options.indexOf(s.options[s.selected])}
 save();drawArenaMistakeReview();render();
}
document.addEventListener('click',e=>{
 const b=e.target.closest('button');if(!b)return;const d=b.dataset;
 if(d.arenaMistakeFilter){arenaMistakeFilter=d.arenaMistakeFilter;arenaMistakePage=0;render();document.querySelector('#arena-notebook')?.scrollIntoView({block:'start'})}
 if(d.arenaMistakePage!==undefined){arenaMistakePage=Math.max(0,Number(d.arenaMistakePage));render();document.querySelector('#arena-notebook')?.scrollIntoView({block:'start'})}
 if(d.arenaReview)startArenaMistakeReview(d.arenaReview);
 if(d.arenaReviewAnswer!==undefined&&arenaReviewSession&&!arenaReviewSession.answered){const selected=Number(d.arenaReviewAnswer);if(Number.isInteger(selected)&&selected>=0&&selected<arenaReviewSession.options.length){arenaReviewSession.selected=selected;document.querySelectorAll('[data-arena-review-answer]').forEach(el=>{const active=Number(el.dataset.arenaReviewAnswer)===selected;el.classList.toggle('selected',active);el.setAttribute('aria-pressed',String(active))});document.querySelector('[data-arena-review-confirm]').disabled=false}}
 if(d.arenaReviewConfirm!==undefined)submitArenaMistakeReview();
 if(d.arenaReviewReturn!==undefined){$('#modal').close();render();document.querySelector('#arena-notebook')?.scrollIntoView({block:'start'})}
});
