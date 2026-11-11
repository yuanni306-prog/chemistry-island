// Growth loop: stardust economy, spaced-repetition review, element tree, pet forms, museum, badges and NPC affinity.
const GROWTH_DAY_MS=86400000;
function growthToday(){return new Date().toLocaleDateString('sv-SE')}
function growthDayIndex(day=growthToday()){const [y,m,d]=day.split('-').map(Number);return Math.round(Date.UTC(y,m-1,d)/GROWTH_DAY_MS)}
function growthState(){
 const g=state.growth=state.growth&&typeof state.growth==='object'?state.growth:{};
 const number=(v)=>Number.isFinite(v)?v:0,object=v=>v&&typeof v==='object'&&!Array.isArray(v)?v:{};
 g.stardust=number(g.stardust);g.stardustTotal=number(g.stardustTotal);g.claimed=Array.isArray(g.claimed)?g.claimed:[];
 g.streak=object(g.streak);g.streak.days=number(g.streak.days);if(!Number.isFinite(g.streak.last))g.streak.last=null;
 g.review=object(g.review);g.review.schedule=object(g.review.schedule);
 g.tree=object(g.tree);g.tree.fed=number(g.tree.fed);
 g.museum=object(g.museum);g.museum.cards=Array.isArray(g.museum.cards)?g.museum.cards:[];
 g.badges=object(g.badges);g.affinity=object(g.affinity);g.expeditions=Array.isArray(g.expeditions)?g.expeditions:[];
 if(!g.expedition||typeof g.expedition!=='object')g.expedition=null;
 return g;
}
function mulberry32(seed){let a=seed>>>0;return()=>{a=a+0x6D2B79F5|0;let t=Math.imul(a^a>>>15,1|a);t=t+Math.imul(t^t>>>7,61|t)^t;return((t^t>>>14)>>>0)/4294967296}}
function growthShuffle(list,rand){const r=[...list];for(let i=r.length-1;i>0;i--){const j=Math.floor(rand()*(i+1));[r[i],r[j]]=[r[j],r[i]]}return r}
function growthOpen(html){document.querySelector('#modal').classList.remove('arena-dialog');modal(html)}
function growthGainStardust(amount){const g=growthState();amount=Math.max(0,Math.round(amount));g.stardust+=amount;g.stardustTotal+=amount;return amount}
function claimStardust(key,amount){const g=growthState();if(g.claimed.includes(key))return false;g.claimed.push(key);growthGainStardust(amount);return true}
function growthRecordAnswer(key,correct){
 const g=growthState(),today=growthDayIndex(),steps=GROWTH_RULES.intervals,entry=g.review.schedule[key]||{due:today,interval:0,streak:0};
 if(correct){entry.interval=steps.find(n=>n>entry.interval)||steps.at(-1);entry.streak++}else{entry.interval=steps[0];entry.streak=0}
 entry.due=today+entry.interval;g.review.schedule[key]=entry;return entry;
}
function growthDueKeys(today=growthDayIndex()){const s=growthState().review.schedule;return Object.keys(s).filter(k=>s[k].due<=today).sort((a,b)=>s[a].due-s[b].due||a.localeCompare(b))}
function growthLessonKeys(lesson){return [...['course','review','reason'].flatMap(kind=>[0,1,2].map(i=>`${lesson.id}:${kind}:${i}`)),`${lesson.id}:pitfall`]}
function growthChapterLessons(chapter){return lessons.filter(l=>l.kind==='theory'&&l.chapterNo===Number(chapter))}
function chapterMastery(chapter){const s=growthState().review.schedule,keys=growthChapterLessons(chapter).flatMap(growthLessonKeys);return keys.length?keys.filter(k=>(s[k]?.interval||0)>=7).length/keys.length:0}
// Resolves a review key to its question. Only valid from click handlers: the textbook bank is installed on DOMContentLoaded.
function growthQuestionByKey(key){const id=key.slice(0,key.indexOf(':')),lesson=lessons.find(l=>l.id===id);if(!lesson)return null;const q=arenaQuestionBank(lesson).find(q=>q.key===key);return q?{...q,course:lesson.id}:null}
function growthSyncCourseMistake(q,correct){if(q.courseIndex===undefined)return;const key=q.course+':'+q.courseIndex;if(correct)state.mistakes=state.mistakes.filter(k=>k!==key);else if(!state.mistakes.includes(key))state.mistakes.push(key)}
function growthMarkActive(){const g=growthState(),today=growthDayIndex();if(g.streak.last===today)return g.streak.days;g.streak.days=g.streak.last===today-1?g.streak.days+1:1;g.streak.last=today;return g.streak.days}
function growthNpcOfDay(){return NPCS[growthDayIndex()%NPCS.length]}
function growthAffinityLevel(points){return GROWTH_RULES.affinityLevels.filter(t=>points>=t).length-1}
function growthAffinity(id){return growthState().affinity[id]?.points||0}
function increaseAffinity(id,amount){const g=growthState(),a=g.affinity[id]=g.affinity[id]||{points:0},before=growthAffinityLevel(a.points);a.points+=amount;const after=growthAffinityLevel(a.points);if(after<=before)return 0;const npc=NPCS.find(n=>n.id===id);g.lastAffinityNotice=`${npc.name}的好感升到 ${after} 级，解锁了新的对话。`;return after}
function growthTrailingStreak(answers){let n=0;for(let i=answers.length-1;i>=0&&answers[i].correct;i--)n++;return n}
function growthMultiplier(streak){return Math.min(Math.max(streak,1),GROWTH_RULES.maxMultiplier)}
function growthComboBadge(answers,base=0){const streak=growthTrailingStreak(answers)+base;return `<span class="arena-combo ${streak>=2?'hot':''}" data-combo="${streak}">⚡ 连击 ${streak} · ×${growthMultiplier(streak)}</span>`}
function growthArenaHit(correct){if(!correct||!arenaSession)return 0;return growthGainStardust(GROWTH_RULES.hitBase*growthMultiplier(growthTrailingStreak(arenaSession.answers)))}
function growthAfterArena(){growthMarkActive();if(increaseAffinity(growthNpcOfDay().id,GROWTH_RULES.affinity.arena))toast(growthState().lastAffinityNotice)}
// ----- element tree -----
function growthTreeStage(fed){const t=GROWTH_RULES.treeStages,index=t.filter(x=>fed>=x).length-1;return {index,name:TREE_STAGES[index],next:t[index+1]??null,floor:t[index]}}
let growthTreePaintId=0;
// The element tree shares the room's painted language: a terracotta pot cut from the decor atlas, leaves with gradient shading and ink outlines, paper grain on top.
function growthTreeArt(stage){
 const id=`tree-${++growthTreePaintId}`,ink='#5e4634',pot=COTTAGE_ART.items['plant-2'],sheet=COTTAGE_ART.sheets[pot.sheet],[px,py,pw,ph]=pot.box;
 const leaf=(cx,cy,rx,ry,rot=0)=>`<ellipse cx="${cx}" cy="${cy}" rx="${rx}" ry="${ry}" fill="url(#${id}-leaf)" stroke="${ink}" stroke-width=".6" transform="rotate(${rot} ${cx} ${cy})"/><path d="M${cx-rx*.45} ${cy-ry*.35}q${rx*.4} -${ry*.5} ${rx*.85} -${ry*.25}" fill="none" stroke="#e7f3d4" stroke-width=".9" stroke-linecap="round" opacity=".75" transform="rotate(${rot} ${cx} ${cy})"/>`;
 const cluster=(cx,cy,r)=>leaf(cx-r*.45,cy+r*.25,r*.7,r*.55,-20)+leaf(cx+r*.45,cy+r*.25,r*.7,r*.55,20)+leaf(cx,cy-r*.15,r*.85,r*.7);
 const wood=(d,w)=>`<path d="${d}" fill="none" stroke="${ink}" stroke-width="${w+1.2}" stroke-linecap="round" stroke-linejoin="round"/><path d="${d}" fill="none" stroke="url(#${id}-wood)" stroke-width="${w}" stroke-linecap="round" stroke-linejoin="round"/>`;
 const glow=(cx,cy,r,color)=>`<circle cx="${cx}" cy="${cy}" r="${r*2.2}" fill="url(#${id}-glow)" opacity=".55"/><circle cx="${cx}" cy="${cy}" r="${r}" fill="${color}" stroke="${ink}" stroke-width=".5"/><circle cx="${cx-r*.3}" cy="${cy-r*.3}" r="${r*.3}" fill="#fff8e6" opacity=".8"/>`;
 const star=(cx,cy)=>`<path transform="translate(${cx-30} ${cy-24})" d="M30 24l1.6 3.6 3.9.4-2.9 2.6.8 3.9-3.4-2-3.4 2 .8-3.9-2.9-2.6 3.9-.4z" fill="#ffd867" stroke="${ink}" stroke-width=".5"/>`;
 const stages=[
  wood('M40 82q1-8 0-14',2)+leaf(34,66,6,3.4,-38)+leaf(46,66,6,3.4,38)+glow(40,60,2,'#ffe58a'),
  wood('M40 82V60',3)+cluster(40,55,9)+glow(45,47,1.6,'#ffe58a'),
  wood('M40 82V46M40 60l-8-6M40 54l8-6',4)+cluster(31,52,8)+cluster(49,52,8)+cluster(40,42,13),
  wood('M40 82V40M40 60l-11-8M40 52l11-8',5)+cluster(26,49,10)+cluster(54,49,10)+cluster(40,52,9)+cluster(40,35,17),
  wood('M40 82V36M40 60l-12-9M40 50l12-9',5)+cluster(24,48,11)+cluster(57,48,11)+cluster(40,52,9)+cluster(40,32,19)+[[30,30],[48,24],[56,40],[22,46],[40,44]].map(([x,y])=>glow(x,y,2.6,'#f4a9c1')).join(''),
  wood('M40 82V34M40 60l-13-9M40 50l13-9',5)+cluster(23,48,12)+cluster(58,48,12)+cluster(40,52,10)+cluster(40,30,21)+[[30,24],[50,18],[56,40],[22,44],[40,36]].map(([x,y])=>star(x,y)).join('')+glow(40,8,3,'#ffe58a')
 ];
 return `<svg viewBox="0 0 80 110" aria-hidden="true"><defs><radialGradient id="${id}-leaf" cx=".35" cy=".3" r=".85"><stop stop-color="#bfe0a4"/><stop offset=".55" stop-color="#86b876"/><stop offset="1" stop-color="#587f50"/></radialGradient><linearGradient id="${id}-wood" x1="0" x2="1"><stop stop-color="#b08866"/><stop offset=".5" stop-color="#8a6248"/><stop offset="1" stop-color="#5f4231"/></linearGradient><radialGradient id="${id}-glow"><stop stop-color="#fff4bf"/><stop offset=".55" stop-color="#ffdd7a" stop-opacity=".8"/><stop offset="1" stop-color="#ffdd7a" stop-opacity="0"/></radialGradient><filter id="${id}-paper" x="-5%" y="-5%" width="110%" height="110%"><feTurbulence type="fractalNoise" baseFrequency=".9" numOctaves="2" seed="7" result="paper"/><feColorMatrix in="paper" type="saturate" values="0"/><feComponentTransfer result="soft"><feFuncA type="linear" slope=".07"/></feComponentTransfer><feComposite in="soft" in2="SourceGraphic" operator="in" result="grain"/><feBlend in="SourceGraphic" in2="grain" mode="soft-light"/></filter><clipPath id="${id}-pot"><polygon points="${pot.outline.map(p=>p.join(',')).join(' ')}"/></clipPath></defs><ellipse cx="40" cy="107" rx="19" ry="2.8" fill="#5d4a3a" opacity=".16"/><svg x="22" y="78" width="36" height="31" viewBox="${px} ${py+ph*.55} ${pw} ${ph*.45}" preserveAspectRatio="none" overflow="hidden"><image href="${sheet.url}" width="${sheet.width}" height="${sheet.height}" clip-path="url(#${id}-pot)"/></svg><ellipse cx="40" cy="83" rx="15.5" ry="3" fill="#5a3f2d"/><ellipse cx="40" cy="82.3" rx="13.5" ry="1.8" fill="#7a5a41"/><g filter="url(#${id}-paper)">${stages[stage]}</g></svg>`;
}
function growthTreeHTML(){const g=growthState(),s=growthTreeStage(g.tree.fed);return `<button class="cottage-tree" data-growth-tree data-tree-stage="${s.index}" aria-label="元素树 · ${s.name}，点击浇灌星尘">${growthTreeArt(s.index)}</button>`}
function showTreeDialog(){
 const g=growthState(),s=growthTreeStage(g.tree.fed),span=s.next===null?1:s.next-s.floor,progress=s.next===null?100:Math.round((g.tree.fed-s.floor)/span*100);
 growthOpen(`<div class="growth-dialog"><div class="growth-tree-art" data-tree-stage="${s.index}">${growthTreeArt(s.index)}</div><span class="eyebrow">元素树 · 第 ${s.index+1} / ${TREE_STAGES.length} 阶</span><h2>${s.name}</h2><p>已喂 ${g.tree.fed} 星尘${s.next===null?'，已经长满星光。':`，再喂 ${s.next-g.tree.fed} 星尘就会长到「${TREE_STAGES[s.index+1]}」。`}</p><div class="progress"><span style="width:${progress}%"></span></div><p class="growth-wallet">✦ 当前星尘 ${g.stardust}</p><button class="btn gold" data-growth-feed-tree ${g.stardust<GROWTH_RULES.treeFeed?'disabled':''}>浇灌 ${GROWTH_RULES.treeFeed} 星尘</button> <button class="btn light" data-growth-close>返回</button><p class="sub">星尘来自今日复习与章节远征。</p></div>`);
}
function feedTreeStardust(){
 const g=growthState(),cost=GROWTH_RULES.treeFeed;if(g.stardust<cost)return toast(`星尘还差 ${cost-g.stardust}。`);
 const before=growthTreeStage(g.tree.fed).index;g.stardust-=cost;g.tree.fed+=cost;const after=growthTreeStage(g.tree.fed);
 save();render();showTreeDialog();if(after.index>before)toast(`元素树长到了「${after.name}」！`);
}
// ----- pet forms -----
function growthPetForm(stardust){return GROWTH_RULES.petForms.filter(t=>(stardust||0)>=t).length}
function growthPetFeedHTML(id){
 const g=growthState(),p=state.pets[id],fed=p?.stardust||0,form=growthPetForm(fed),thresholds=GROWTH_RULES.petForms,next=thresholds[form]??null;
 return `<div class="growth-pet-feed"><p><b>形态：${PET_FORMS[form-1]}</b>${next===null?' · 已是最高形态':` · 再喂 ${next-fed} 星尘进化为「${PET_FORMS[form]}」`}</p><div class="progress"><span style="width:${next===null?100:Math.round((fed-(thresholds[form-1]||0))/(next-(thresholds[form-1]||0))*100)}%"></span></div><button class="btn gold" data-growth-feed-pet="${id}" ${g.stardust<GROWTH_RULES.petFeed||next===null?'disabled':''}>喂星尘 ${GROWTH_RULES.petFeed}</button><span class="growth-wallet">✦ ${g.stardust}</span></div>`;
}
function feedPetStardust(id){
 const g=growthState(),p=state.pets[id],cost=GROWTH_RULES.petFeed;if(!p)return;if(growthPetForm(p.stardust)>=GROWTH_RULES.petForms.length)return toast('它已经是最高形态了。');if(g.stardust<cost)return toast(`星尘还差 ${cost-g.stardust}。`);
 const before=growthPetForm(p.stardust);g.stardust-=cost;p.stardust=(p.stardust||0)+cost;const after=growthPetForm(p.stardust);
 if(after>before)toast(increasePetBond(id,2,`进化为「${PET_FORMS[after-1]}」`));
 save();render();showPetLifeDialog(id);
}
// ----- museum -----
function growthMoleculeLit(m){return !!(m.lesson&&state.passed.includes(m.lesson))||growthState().museum.cards.includes(m.id)}
function growthMuseumProgress(chapter){const list=MOLECULES.filter(m=>!chapter||m.chapter===Number(chapter));return {lit:list.filter(growthMoleculeLit).length,total:list.length}}
function growthUnlitChestMolecules(chapter){return MOLECULES.filter(m=>m.chapter===Number(chapter)&&!m.lesson&&!m.boss&&!growthMoleculeLit(m))}
function growthCheckMuseumSet(chapter){const list=MOLECULES.filter(m=>m.chapter===Number(chapter));if(!list.length||!list.every(growthMoleculeLit))return false;return reward('museum:set:'+chapter,GROWTH_RULES.museumSetCoins,GROWTH_RULES.museumSetXp)}
function growthMoleculeSource(m){return m.boss?'打败本章 boss 后点亮':m.lesson?`完成「${lessons.find(l=>l.id===m.lesson)?.title||'课程'}」练习后点亮`:'远征宝箱中发现'}
function growthMoleculeArt(m,lit){const size=m.formula.length>12?8:m.formula.length>7?11:15;return `<svg viewBox="0 0 96 96" aria-hidden="true"><circle cx="48" cy="48" r="40" fill="${lit?'#e9f3e5':'#ece9e1'}"/><text x="48" y="${lit?53:56}" text-anchor="middle" font-size="${lit?size:30}" fill="${lit?'#2f5d4d':'#b4ad9f'}" font-family="system-ui">${lit?arenaEscape(m.formula):'？'}</text></svg>`}
function showMuseum(chapter='all'){
 const chapters=textbookChapters.filter(c=>c.id!=='practice'),selected=chapter==='all'?null:Number(chapter),list=MOLECULES.filter(m=>!selected||m.chapter===selected),total=growthMuseumProgress();
 growthOpen(`<div class="growth-dialog museum"><span class="eyebrow">分子博物馆</span><h2>已发现 ${total.lit} / ${total.total} 种分子</h2><p class="sub">课程练习全对、远征宝箱和章节 boss 都会点亮新的分子；集齐一章可获得奖励。</p><div class="arena-mistake-filters museum-filters"><button data-growth-museum="all" aria-pressed="${!selected}">全部</button>${chapters.map(c=>{const p=growthMuseumProgress(c.id);return `<button data-growth-museum="${c.id}" aria-pressed="${selected===Number(c.id)}">第 ${c.id} 章 <small>${p.lit}/${p.total}</small></button>`}).join('')}</div><div class="museum-grid">${list.map(m=>{const lit=growthMoleculeLit(m);return `<article class="shop-item museum-card ${lit?'lit':'locked'}"><div class="shop-item-art">${growthMoleculeArt(m,lit)}</div><div class="shop-item-copy"><span class="shop-item-category">第 ${m.chapter} 章${m.boss?' · boss':''}</span><h3>${lit?m.name:'未发现'}</h3><p>${lit?`${m.structure} · ${m.note}`:growthMoleculeSource(m)}</p></div></article>`}).join('')}</div><button class="btn light" data-growth-close>返回</button></div>`);
}
// ----- badges and companions -----
function growthBadgeArt(chapter,lit){return `<svg viewBox="0 0 80 80" aria-hidden="true"><path d="M40 4l31 18v36L40 76 9 58V22z" fill="${lit?'#f3d57a':'#edeae2'}" stroke="${lit?'#c9992f':'#cfcabd'}" stroke-width="3"/><circle cx="40" cy="40" r="19" fill="${lit?'#fff5d6':'#f7f5ef'}"/><text x="40" y="47" text-anchor="middle" font-size="20" font-weight="700" fill="${lit?'#8b6418':'#bbb5a7'}" font-family="system-ui">${chapter}</text></svg>`}
function showBadges(){
 const g=growthState(),chapters=textbookChapters.filter(c=>c.id!=='practice');
 growthOpen(`<div class="growth-dialog badges"><span class="eyebrow">徽章墙与伙伴</span><h2>章节徽章 ${Object.keys(g.badges).length} / ${chapters.length}</h2><div class="badge-wall">${chapters.map(c=>{const b=g.badges[c.id];return `<div class="badge ${b?'lit':''}" title="${c.title}">${growthBadgeArt(c.id,!!b)}<small>${c.title}</small>${b?`<span>通关 ${b.runs} 次</span>`:'<span>远征通关后获得</span>'}</div>`}).join('')}</div><h3>小岛伙伴</h3><div class="npc-list">${NPCS.map(n=>{const points=growthAffinity(n.id),level=growthAffinityLevel(points),next=GROWTH_RULES.affinityLevels[level+1],lines=NPC_LINES[n.id];return `<article class="npc-card"><div class="npc-portrait">${arenaPortrait(n.seed)}</div><div class="npc-copy"><h4>${n.name} <small>${n.title} · 好感 ${level} 级</small></h4><div class="progress"><span style="width:${next?Math.round((points-GROWTH_RULES.affinityLevels[level])/(next-GROWTH_RULES.affinityLevels[level])*100):100}%"></span></div><p class="sub">${next?`${points} / ${next} 点，远征交手和复习陪练都会增加`:'好感已满'}</p>${level?`<details><summary>已解锁的对话 ${level} / ${lines.length}</summary>${lines.slice(0,level).map(line=>`<p>“${line}”</p>`).join('')}</details>`:`<p class="sub">还没有解锁对话。</p>`}</div></article>`}).join('')}</div><button class="btn light" data-growth-close>返回</button></div>`);
}
// ----- today section on the home page -----
function growthHomeSection(){
 const g=growthState(),due=growthDueKeys().length,run=g.expedition,tree=growthTreeStage(g.tree.fed),museum=growthMuseumProgress(),npc=growthNpcOfDay(),rules=GROWTH_RULES;
 return `<section class="growth-today"><div class="section-head"><h2>今日小岛</h2><small>✦ 星尘 ${g.stardust} · 连续 ${g.streak.days} 天</small></div><div class="tasks">
 <div class="task"><div class="task-num">✦</div><div><span class="tag">今日复习</span><h3>${due?`${due} 题到期`:'今天没有待复习'}</h3><p>${due?`答对每题 +${rules.reviewCorrect} 星尘，完成一组 +${rules.reviewSession}；今天的陪练是${npc.name}`:'做过的题会按 1、3、7、14、30 天回来找你'}</p></div><button class="btn gold" data-review-start ${due?'':'disabled'}>开始复习</button></div>
 <div class="task"><div class="task-num">⚑</div><div><span class="tag">章节远征</span><h3>${run?`第 ${run.chapter} 章 · 进行中`:'选一章出发'}</h3><p>${run?`心 ${run.hearts} / ${run.maxHearts} · 本局星尘 ${run.stardust}`:'走过 5 个节点，打败章节 boss 得到徽章'}</p></div><button class="btn" data-expedition-${run?'resume':'lobby'}>${run?'继续远征':'前往'}</button></div>
 <div class="task"><div class="task-num">🌱</div><div><span class="tag">元素树</span><h3>${tree.name}</h3><p>已喂 ${g.tree.fed} 星尘 · 博物馆 ${museum.lit} / ${museum.total}</p></div><div class="growth-task-actions"><button class="btn light" data-growth-tree>浇灌</button><button class="btn light" data-growth-museum="all">博物馆</button><button class="btn light" data-growth-badges>徽章</button></div></div>
 </div></section>`;
}
// ----- review session -----
let reviewSession=null;
function startReview(){
 const due=growthDueKeys();if(!due.length)return toast('今天没有待复习的题目。');
 const rand=mulberry32(growthDayIndex()*7919+due.length);
 const questions=growthShuffle(due.slice(0,GROWTH_RULES.reviewSize*2),rand).slice(0,GROWTH_RULES.reviewSize).map(growthQuestionByKey).filter(Boolean).map(q=>{const order=growthShuffle(q.options.map((_,i)=>i),rand);return {...q,options:order.map(i=>q.options[i]),a:order.indexOf(q.a)}});
 if(!questions.length)return toast('题目暂时无法加载，请刷新后再试。');
 reviewSession={questions,index:0,answers:[],answered:false,earned:0,npc:growthNpcOfDay()};drawReview();
}
function drawReview(){
 const s=reviewSession,q=s.questions[s.index],a=s.answers[s.index];
 growthOpen(`<div class="quiz-top"><span>今日复习 · ${arenaEscape(lessons.find(l=>l.id===q.course)?.title||'')}</span><span>${s.index+1} / ${s.questions.length}</span></div><div class="progress"><span style="width:${s.index/s.questions.length*100}%"></span></div><p class="review-npc"><span class="npc-portrait small">${arenaPortrait(s.npc.seed)}</span>${s.npc.name}：${s.npc.review}</p><h2>${arenaEscape(q.q)}</h2><div class="options">${q.options.map((o,i)=>`<button class="option ${a?(i===q.a?'correct':i===a.chosen?'wrong':''):''}" data-review-answer="${i}" ${a?'disabled':''}>${String.fromCharCode(65+i)}. ${arenaEscape(o)}</button>`).join('')}</div><div id="review-feedback" aria-live="polite">${a?`<div class="feedback"><b>${a.correct?`答对了！+${GROWTH_RULES.reviewCorrect} 星尘`:'回答错误'}</b><br>${arenaEscape(q.why)}</div><button class="btn" style="margin-top:16px" data-review-next>${s.index===s.questions.length-1?'查看结果':'下一题 →'}</button>`:''}</div>`);
}
function answerReview(n){
 const s=reviewSession;if(!s||s.answered)return;const q=s.questions[s.index];if(!Number.isInteger(n)||n<0||n>=q.options.length)return;
 const correct=n===q.a;s.answered=true;s.answers.push({key:q.key,chosen:n,correct});
 growthRecordAnswer(q.key,correct);growthSyncCourseMistake(q,correct);if(!correct)arenaRecordMistake(q.course,q,n);
 if(correct)s.earned+=growthGainStardust(GROWTH_RULES.reviewCorrect);
 save();drawReview();document.querySelector('[data-review-next]')?.focus({preventScroll:true});
}
function nextReview(){const s=reviewSession;if(!s||!s.answered)return;if(s.index<s.questions.length-1){s.index++;s.answered=false;drawReview()}else finishReview()}
function finishReview(){
 const s=reviewSession,g=growthState(),bonus=claimStardust('review:'+growthToday(),GROWTH_RULES.reviewSession)?GROWTH_RULES.reviewSession:0,days=growthMarkActive(),leveled=increaseAffinity(s.npc.id,GROWTH_RULES.affinity.review),correct=s.answers.filter(a=>a.correct).length,remaining=growthDueKeys().length;
 save();render();reviewSession=null;
 growthOpen(`<div class="result"><div class="big-icon">${correct===s.questions.length?'🌟':'📘'}</div><h2>复习完成</h2><p>答对 ${correct} / ${s.questions.length} 题，获得 ✦ ${s.earned+bonus} 星尘${bonus?`（含今日首组 +${bonus}）`:''}。连续学习 ${days} 天。</p><p class="review-npc"><span class="npc-portrait small">${arenaPortrait(s.npc.seed)}</span>${s.npc.name}：${correct===s.questions.length?s.npc.win:s.npc.lose}</p>${remaining?`<button class="btn" data-review-start>再来一组（还有 ${remaining} 题）</button> `:''}<button class="btn light" data-growth-close>返回</button></div>`);
 if(leveled)toast(g.lastAffinityNotice);
}
document.addEventListener('click',e=>{const b=e.target.closest('button');if(!b)return;const d=b.dataset;
 if(d.reviewStart!==undefined)startReview();
 if(d.reviewAnswer!==undefined)answerReview(Number(d.reviewAnswer));
 if(d.reviewNext!==undefined)nextReview();
 if(d.growthClose!==undefined){document.querySelector('#modal').close();render()}
 if(d.growthTree!==undefined)showTreeDialog();
 if(d.growthFeedTree!==undefined)feedTreeStardust();
 if(d.growthFeedPet)feedPetStardust(d.growthFeedPet);
 if(d.growthMuseum!==undefined)showMuseum(d.growthMuseum||'all');
 if(d.growthBadges!==undefined)showBadges();
});
