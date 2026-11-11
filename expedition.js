// Chapter expeditions: a seeded five-node run (four layers plus boss) fought with the chapter's question banks.
const EXPEDITION_LAYERS=[2,3,2,2];
const EXPEDITION_NODES={fight:{name:'普通战',icon:'⚔'},elite:{name:'精英战',icon:'🔥'},rest:{name:'休息',icon:'☕'},shop:{name:'商店',icon:'🛒'},chest:{name:'宝箱',icon:'🎁'},boss:{name:'章节 boss',icon:'👑'}};
let expeditionLobbyChapter=null;
function expeditionRun(){return growthState().expedition}
function expeditionChapters(){return textbookChapters.filter(c=>c.id!=='practice').map(c=>Number(c.id))}
function expeditionDefaultChapter(){const l=lessons.find(x=>x.id===state.lastLesson)||lessons.find(x=>x.id===state.read.at(-1));return l&&l.kind==='theory'?l.chapterNo:1}
function expeditionHas(run,relic){return run.relics.includes(relic)}
function expeditionRand(run,salt=0){return mulberry32((run.seed^(run.picked.length*2654435761)^(salt*40503))>>>0)}
function buildExpeditionMap(rand){
 const layers=EXPEDITION_LAYERS.map(n=>Array.from({length:n},()=>({type:'fight'})));
 const eliteLayer=1+Math.floor(rand()*2);layers[eliteLayer][Math.floor(rand()*layers[eliteLayer].length)].type='elite';
 for(const type of growthShuffle(['shop','chest','rest'],rand)){
  const candidates=layers.map((layer,li)=>li).filter(li=>layers[li].some(n=>n.type==='fight')&&layers[li].filter(n=>n.type==='fight'||n.type==='elite').length>=2);
  if(!candidates.length)break;const layer=layers[candidates[Math.floor(rand()*candidates.length)]];layer[layer.findIndex(n=>n.type==='fight')].type=type;
 }
 for(const layer of layers)for(const node of layer)if(node.type==='fight'||node.type==='elite')node.npc=NPCS[Math.floor(rand()*NPCS.length)].id;
 return layers.map(layer=>growthShuffle(layer,rand));
}
function expeditionRelicPool(run){return RELICS.filter(r=>!run.relics.includes(r.id)&&(!r.npc||growthAffinityLevel(growthAffinity(r.npc))>=3))}
function pickRelics(run,count,rand){return growthShuffle(expeditionRelicPool(run),rand).slice(0,count).map(r=>r.id)}
function startExpedition(chapter,seed=Date.now()){
 const g=growthState();if(g.expedition)return drawExpedition();
 chapter=Number(chapter);const lessonsIn=growthChapterLessons(chapter);if(!lessonsIn.length)return toast('这一章还没有可用的题目。');
 const rand=mulberry32(seed),mastery=chapterMastery(chapter),rules=GROWTH_RULES;
 const run={id:crypto.randomUUID(),chapter,seed,startedAt:Date.now(),layers:buildExpeditionMap(rand),picked:[],layer:0,current:null,hearts:rules.heartsBase,maxHearts:rules.heartsBase,relics:[],items:[],stardust:0,cards:[],pool:growthShuffle(lessonsIn.flatMap(growthLessonKeys),rand),cursor:0,fight:null,event:null,pendingRelics:null,charm:false,mastery,bonus:[]};
 if(mastery>=rules.masteryHeart){run.maxHearts++;run.hearts++;run.bonus.push('heart')}
 if(mastery>=rules.masteryRelic){run.pendingRelics=pickRelics(run,3,rand);run.bonus.push('relic')}
 g.expedition=run;save();render();drawExpedition();
}
function abandonExpedition(){if(!expeditionRun())return;finishExpedition(false)}
// ----- lobby -----
function expeditionLobbyHTML(){
 const g=growthState(),run=g.expedition,chapters=expeditionChapters();if(!chapters.includes(expeditionLobbyChapter))expeditionLobbyChapter=expeditionDefaultChapter();
 const ch=expeditionLobbyChapter,mastery=Math.round(chapterMastery(ch)*100),badge=g.badges[ch];
 return `<section class="expedition-card"><div class="section-head"><h2>章节远征</h2><small>5 个节点 · 打败 boss 得徽章</small></div>${run?`<p class="expedition-status">第 ${run.chapter} 章远征进行中：心 ${run.hearts} / ${run.maxHearts}，本局星尘 ${run.stardust}，已走 ${run.layer} / ${run.layers.length} 层。</p><div class="expedition-actions"><button class="btn" data-expedition-resume>继续远征</button><button class="btn light" data-expedition-abandon>放弃本局</button><button class="btn light" data-growth-badges>徽章与伙伴</button></div>`:`<div class="expedition-pick"><label for="expedition-chapter">选择章节<select id="expedition-chapter" data-expedition-chapter>${chapters.map(c=>`<option value="${c}" ${c===ch?'selected':''}>第 ${c} 章 · ${textbookChapters.find(t=>Number(t.id)===c).title}</option>`).join('')}</select></label><p class="sub">本章掌握度 ${mastery}%${mastery>=GROWTH_RULES.masteryHeart*100?' · 开局 +1 心':''}${mastery>=GROWTH_RULES.masteryRelic*100?' · 开局三选一遗物':''} · 徽章${badge?`已获得（通关 ${badge.runs} 次）`:'未获得'}</p><div class="expedition-actions"><button class="btn" data-expedition-start="${ch}">出发</button><button class="btn light" data-growth-badges>徽章与伙伴</button></div></div>`}</section>`;
}
// ----- drawing -----
function drawExpedition(){const run=expeditionRun();if(!run)return;if(run.pendingRelics)drawExpeditionRelics();else if(run.fight)drawExpeditionFight();else if(run.event)drawExpeditionEvent();else drawExpeditionMap();document.querySelector('#modal').scrollTop=0}
function expeditionHeader(run,title){return `<div class="expedition-header"><div><span class="eyebrow">第 ${run.chapter} 章远征</span><h2>${title}</h2></div><div class="expedition-stats"><span class="expedition-hearts" aria-label="心数">${'♥'.repeat(run.hearts)}${'♡'.repeat(Math.max(0,run.maxHearts-run.hearts))}</span><span>✦ ${run.stardust}</span><span>🪙 ${state.coins}</span></div>${run.relics.length?`<div class="expedition-relics">${run.relics.map(id=>{const r=RELICS.find(r=>r.id===id);return `<span title="${r.name}：${r.desc}">${r.icon} ${r.name}</span>`}).join('')}</div>`:''}</div>`}
function drawExpeditionMap(){
 const run=expeditionRun(),boss=BOSSES.find(b=>b.chapter===run.chapter),width=360,height=96*run.layers.length+140;
 const nodes=run.layers.map((layer,li)=>layer.map((node,i)=>({...node,li,i,x:width/(layer.length+1)*(i+1),y:height-70-li*96,state:li<run.layer?(run.picked[li]===i?'done':'skipped'):li===run.layer?'open':'later'}))).flat();
 const bossNode={x:width/2,y:40,state:run.layer>=run.layers.length?'open':'later'};
 const links=nodes.filter(n=>n.li<run.layers.length-1).flatMap(n=>nodes.filter(m=>m.li===n.li+1).map(m=>`<path d="M${n.x} ${n.y}L${m.x} ${m.y}" class="${n.state==='done'&&(m.state==='done'||m.state==='open')?'walked':''}"/>`)).join('')+nodes.filter(n=>n.li===run.layers.length-1).map(n=>`<path d="M${n.x} ${n.y}L${bossNode.x} ${bossNode.y}" class="${n.state==='done'?'walked':''}"/>`).join('');
 arenaOpen(`<div class="expedition">${expeditionHeader(run,run.layer>=run.layers.length?`${boss.name}在前方等你`:`第 ${run.layer+1} 层 · 选择一条路`)}<div class="expedition-map" role="group" aria-label="远征地图" style="aspect-ratio:${width}/${height}"><svg class="expedition-links" viewBox="0 0 ${width} ${height}" preserveAspectRatio="none" aria-hidden="true">${links}</svg><div class="expedition-node-layer">${nodes.map(n=>`<button class="expedition-node ${n.type} ${n.state}" style="left:${n.x/width*100}%;top:${n.y/height*100}%" ${n.state==='open'?`data-expedition-node="${n.i}"`:'disabled'} aria-label="${EXPEDITION_NODES[n.type].name}${n.npc?' · '+NPCS.find(x=>x.id===n.npc).name:''}"><span>${EXPEDITION_NODES[n.type].icon}</span><small>${EXPEDITION_NODES[n.type].name}</small></button>`).join('')}<button class="expedition-node boss ${bossNode.state}" style="left:50%;top:${bossNode.y/height*100}%" ${bossNode.state==='open'?'data-expedition-boss':'disabled'} aria-label="章节 boss ${boss.name}"><span>👑</span><small>${boss.name}</small></button></div></div><div class="expedition-foot"><p class="sub">${run.layer>=run.layers.length?'点击 boss 开始最终战斗。':'点击亮起的节点前进；战斗中答错会失去一颗心。'}</p><button class="btn light" data-expedition-close>稍后继续</button></div></div>`);
}
function expeditionTopic(run,rand){const pool=growthChapterLessons(run.chapter).flatMap(l=>(l.topics||[]).map(t=>({heading:t.heading,text:t.text,lesson:l.title})).concat(l.topics?[]:l.lines.slice(0,4).map(line=>({heading:line.split('：')[0],text:line.slice(line.indexOf('：')+1),lesson:l.title}))));return pool[Math.floor(rand()*pool.length)]}
function enterExpeditionNode(index){
 const run=expeditionRun();if(!run||run.fight||run.event||run.pendingRelics||run.layer>=run.layers.length)return;const node=run.layers[run.layer][index];if(!node)return;
 const rand=expeditionRand(run,run.layer+1);run.current=index;
 if(node.type==='fight'||node.type==='elite')run.fight=makeExpeditionFight(run,node,rand);
 else if(node.type==='rest'){run.hearts=Math.min(run.maxHearts,run.hearts+1);run.event={type:'rest',card:expeditionTopic(run,rand)}}
 else if(node.type==='chest'){const g=growthState(),choices=growthUnlitChestMolecules(run.chapter);if(choices.length){const m=choices[Math.floor(rand()*choices.length)];g.museum.cards.push(m.id);run.cards.push(m.id);run.event={type:'chest',card:m.id}}else{run.stardust+=GROWTH_RULES.chestFallback;run.event={type:'chest',stardust:GROWTH_RULES.chestFallback}}}
 else if(node.type==='shop'){const relic=growthShuffle(expeditionRelicPool(run),rand)[0];run.event={type:'shop',stock:[...growthShuffle(POTIONS,rand).slice(0,2).map(p=>({kind:'potion',id:p.id})),...(relic?[{kind:'relic',id:relic.id}]:[])],bought:[]}}
 save();drawExpedition();
}
function makeExpeditionFight(run,node,rand){
 const rules=GROWTH_RULES,count=rules.questions[node.type==='boss'?'boss':node.type==='elite'?'elite':'fight'],questions=[];
 while(questions.length<count){if(run.cursor>=run.pool.length){run.pool=growthShuffle(run.pool,rand);run.cursor=0}const q=growthQuestionByKey(run.pool[run.cursor++]);if(!q){if(run.pool.every(k=>!growthQuestionByKey(k)))break;continue}const order=growthShuffle(q.options.map((_,i)=>i),rand);questions.push({...q,options:order.map(i=>q.options[i]),a:order.indexOf(q.a)})}
 const npc=node.npc?NPCS.find(n=>n.id===node.npc):null,boss=node.type==='boss'?BOSSES.find(b=>b.chapter===run.chapter):null;
 const oppAnswers=npc?questions.map(q=>rand()<(q.topic===npc.strong?rules.npcAccuracy.strong:rules.npcAccuracy.other)+(node.type==='elite'?rules.npcAccuracy.elite:0)):[];
 const hp=boss?Math.max(3,rules.bossHp-(expeditionHas(run,'letter')?2:0)-(expeditionHas(run,'npc-ayun')?1:0)):0;
 return {type:node.type,npc:npc?.id||null,questions,index:0,answers:[],selected:null,oppAnswers,bossHp:hp,bossMax:hp,hintLeft:expeditionHas(run,'lens')||expeditionHas(run,'npc-ayun')?1:0,shieldLeft:expeditionHas(run,'notes')||expeditionHas(run,'npc-zisu')?1:0,comboBase:expeditionHas(run,'glove')?1:0,excluded:null,charm:run.charm};
}
function expeditionFightScores(f){return {you:f.answers.filter(a=>a.correct).length,opponent:f.oppAnswers.slice(0,f.answers.length).filter(Boolean).length}}
function expeditionBossArt(boss){return `<svg viewBox="0 0 100 100" aria-hidden="true"><rect x="1" y="1" width="98" height="98" rx="28" fill="hsl(${boss.hue} 42% 32%)"/><path d="M50 12l30 20v36L50 90 20 68V32z" fill="hsl(${boss.hue} 60% 62%)" stroke="hsl(${boss.hue} 70% 85%)" stroke-width="3"/><path d="M50 26l16 11v22L50 72 34 59V37z" fill="hsl(${boss.hue} 70% 78%)" opacity=".8"/><circle cx="43" cy="48" r="4" fill="#233e37"/><circle cx="57" cy="48" r="4" fill="#233e37"/><path d="M42 60q8 5 16 0" fill="none" stroke="#233e37" stroke-width="3" stroke-linecap="round"/></svg>`}
function drawExpeditionFight(){
 const run=expeditionRun(),f=run.fight,q=f.questions[f.index],a=f.answers[f.index],boss=f.type==='boss'?BOSSES.find(b=>b.chapter===run.chapter):null,npc=f.npc?NPCS.find(n=>n.id===f.npc):null,score=expeditionFightScores(f);
 const scene=`<div class="arena-battle-scene expedition-scene ${f.type}" style="--boss-hue:${boss?boss.hue:150}"><div class="arena-battle-meta"><span>${EXPEDITION_NODES[f.type].name} · 第 ${f.index+1} / ${f.questions.length} 题</span>${growthComboBadge(f.answers,f.comboBase)}<span class="expedition-hearts" data-expedition-hearts aria-live="polite">${'♥'.repeat(run.hearts)}${'♡'.repeat(Math.max(0,run.maxHearts-run.hearts))}</span></div><div class="arena-fighters"><div class="arena-fighter">${arenaPlayerPortrait()}<b>你</b><span>远征者</span></div>${boss?`<div class="expedition-boss-bar"><b>${boss.name}</b><div class="expedition-hp" role="meter" aria-valuemin="0" aria-valuemax="${f.bossMax}" aria-valuenow="${f.bossHp}"><span data-expedition-hp style="transform:scaleX(${f.bossHp/f.bossMax})"></span></div><small data-expedition-hp-text>${f.bossHp} / ${f.bossMax}</small></div><div class="arena-fighter expedition-opponent" data-expedition-opponent>${expeditionBossArt(boss)}<b>${boss.name}</b><span>章节 boss</span></div>`:`<div class="arena-scoreboard" aria-live="polite" aria-atomic="true"><div><strong data-expedition-you>${score.you}</strong><span>:</span><strong data-expedition-opp>${score.opponent}</strong></div><small>答对数</small></div><div class="arena-fighter expedition-opponent" data-expedition-opponent>${arenaPortrait(npc.seed)}<b>${npc.name}</b><span>${npc.title}</span></div>`}</div><div class="arena-rounds" aria-hidden="true">${f.questions.map((_,i)=>`<span class="${f.answers[i]?(f.answers[i].correct?'hit':'miss'):i===f.index?'current':''}"></span>`).join('')}</div></div>`;
 arenaOpen(`<div class="arena-battle expedition-fight">${scene}<div class="arena-question" id="expedition-question">${expeditionQuestionHTML(run,f,q,a)}</div></div>`);
}
function expeditionQuestionHTML(run,f,q,a){
 const hintAvailable=!a&&f.excluded===null&&(f.hintLeft>0||run.items.includes('hint'));
 return `<div class="arena-question-meta"><span>${arenaEscape(lessons.find(l=>l.id===q.course)?.title||'')}</span><span>${q.focus?'重点辨析':'知识巩固'}</span></div><h2>${arenaEscape(q.q)}</h2><div class="arena-options">${q.options.map((option,i)=>`<button class="option ${a?(i===q.a?'correct':i===a.chosen?'wrong':''):f.selected===i?'selected':''} ${f.excluded===i?'excluded':''}" data-expedition-answer="${i}" aria-pressed="${a?a.chosen===i:f.selected===i}" ${a||f.excluded===i?'disabled':''}><span>${String.fromCharCode(65+i)}</span>${arenaEscape(option)}</button>`).join('')}</div><div id="expedition-feedback" role="status">${a?`<div class="arena-feedback ${a.correct?'correct':'wrong'}"><b>${a.correct?`命中！${a.gain?`+${a.gain} 星尘`:''}`:a.shielded?'答错了，错题笔记替你挡下了这一击':'答错了，失去一颗心'}</b><p>${arenaEscape(q.why)}</p>${f.type!=='boss'?`<small>${NPCS.find(n=>n.id===f.npc).name}本题：${f.oppAnswers[f.index]?'答对':'答错'}</small>`:''}</div><button class="btn arena-next" data-expedition-next>${run.hearts<=0?'查看结算':f.type==='boss'&&f.bossHp<=0?'boss 倒下了 →':f.index===f.questions.length-1?'结束本场':'下一题 →'}</button>`:`<div class="arena-confirm-row"><p class="arena-think">选好后点击确认，可在提交前改选。</p>${hintAvailable?`<button class="btn light" data-expedition-hint>排除一个错误选项</button>`:''}<button class="btn" data-expedition-confirm ${f.selected===null?'disabled':''}>确认答案</button></div>`}</div>`;
}
function selectExpedition(chosen){const f=expeditionRun()?.fight;if(!f||f.answers[f.index]||f.excluded===chosen||!Number.isInteger(chosen)||chosen<0||chosen>=f.questions[f.index].options.length)return;f.selected=chosen;document.querySelectorAll('[data-expedition-answer]').forEach(b=>{const selected=Number(b.dataset.expeditionAnswer)===chosen;b.classList.toggle('selected',selected);b.setAttribute('aria-pressed',String(selected))});document.querySelector('[data-expedition-confirm]').disabled=false}
function useExpeditionHint(){const run=expeditionRun(),f=run?.fight;if(!f||f.answers[f.index]||f.excluded!==null)return;if(f.hintLeft>0)f.hintLeft--;else{const i=run.items.indexOf('hint');if(i<0)return;run.items.splice(i,1)}const q=f.questions[f.index],wrong=q.options.map((_,i)=>i).filter(i=>i!==q.a);f.excluded=wrong[wrong.length-1];if(f.selected===f.excluded)f.selected=null;save();document.querySelector('#expedition-question').innerHTML=expeditionQuestionHTML(run,f,q,null)}
function answerExpedition(chosen){
 const run=expeditionRun(),f=run?.fight;if(!f||f.answers[f.index]||!Number.isInteger(chosen))return;const q=f.questions[f.index];if(chosen<0||chosen>=q.options.length||chosen===f.excluded)return;
 const correct=chosen===q.a,answer={key:q.key,chosen,correct,gain:0,shielded:false};
 f.answers.push(answer);growthRecordAnswer(q.key,correct);growthSyncCourseMistake(q,correct);if(!correct)arenaRecordMistake(q.course,q,chosen);
 if(correct){const mult=growthMultiplier(growthTrailingStreak(f.answers)+f.comboBase);answer.gain=GROWTH_RULES.hitBase*mult*(f.charm?2:1);run.stardust+=answer.gain;if(f.type==='boss')f.bossHp=Math.max(0,f.bossHp-mult)}
 else if(f.shieldLeft>0&&!f.answers.slice(0,-1).some(a=>!a.correct)){f.shieldLeft--;answer.shielded=true}
 else run.hearts=Math.max(0,run.hearts-1);
 save();
 const hearts=document.querySelector('[data-expedition-hearts]');if(hearts)hearts.textContent='♥'.repeat(run.hearts)+'♡'.repeat(Math.max(0,run.maxHearts-run.hearts));
 document.querySelector('.arena-combo')?.outerHTML&&(document.querySelector('.arena-combo').outerHTML=growthComboBadge(f.answers,f.comboBase));
 const you=document.querySelector('[data-expedition-you]'),opp=document.querySelector('[data-expedition-opp]');if(you){const s=expeditionFightScores(f);you.textContent=s.you;opp.textContent=s.opponent}
 const hp=document.querySelector('[data-expedition-hp]');if(hp){hp.style.transform=`scaleX(${f.bossHp/f.bossMax})`;document.querySelector('[data-expedition-hp-text]').textContent=`${f.bossHp} / ${f.bossMax}`}
 const opponent=document.querySelector('[data-expedition-opponent]');if(opponent){opponent.classList.remove('hit','miss');void opponent.offsetWidth;opponent.classList.add(correct?'hit':'miss')}
 document.querySelectorAll('.arena-rounds span')[f.index]?.classList.replace('current',correct?'hit':'miss');
 document.querySelector('#expedition-question').innerHTML=expeditionQuestionHTML(run,f,q,answer);document.querySelector('#expedition-feedback').scrollIntoView({block:'nearest'});document.querySelector('[data-expedition-next]')?.focus({preventScroll:true});
}
function nextExpedition(){
 const run=expeditionRun(),f=run?.fight;if(!f||!f.answers[f.index])return;
 if(run.hearts<=0)return finishExpedition(false);
 if(f.type==='boss'&&f.bossHp<=0)return finishExpedition(true);
 if(f.index<f.questions.length-1){f.index++;f.selected=null;f.excluded=null;save();drawExpeditionFight();return}
 if(f.type==='boss')return finishExpedition(false);
 const score=expeditionFightScores(f),cleared=score.you>score.opponent,npc=NPCS.find(n=>n.id===f.npc),rules=GROWTH_RULES;
 if(cleared)run.stardust+=f.type==='elite'?rules.eliteClear:rules.fightClear;
 if(f.charm)run.charm=false;
 const leveled=increaseAffinity(npc.id,cleared?rules.affinity.fightWin:rules.affinity.fightLoss);
 if(cleared&&f.type==='elite')run.pendingRelics=pickRelics(run,3,expeditionRand(run,99));
 run.event={type:'result',cleared,you:score.you,opponent:score.opponent,npc:npc.id,gain:cleared?(f.type==='elite'?rules.eliteClear:rules.fightClear):0};
 run.fight=null;expeditionAdvance(run);save();drawExpedition();if(leveled)toast(growthState().lastAffinityNotice);
}
function expeditionAdvance(run){if(run.current!==null){run.picked.push(run.current);run.current=null;run.layer++}}
function drawExpeditionRelics(){const run=expeditionRun();arenaOpen(`<div class="expedition">${expeditionHeader(run,'选择一件遗物')}<p class="sub">遗物只在本局远征中生效。</p><div class="relic-choices">${run.pendingRelics.map(id=>{const r=RELICS.find(r=>r.id===id);return `<button class="relic-choice" data-expedition-relic="${id}"><span class="relic-icon">${r.icon}</span><b>${r.name}</b><small>${r.desc}</small></button>`}).join('')}</div></div>`)}
function takeExpeditionRelic(id){const run=expeditionRun();if(!run?.pendingRelics?.includes(id))return;run.relics.push(id);run.pendingRelics=null;if(id==='mirror'||id==='npc-xiaoya')run.maxHearts=Math.min(GROWTH_RULES.heartsMax,run.maxHearts+1);if(id==='mirror'||id==='npc-zisu')run.hearts=Math.min(run.maxHearts,run.hearts+1);save();drawExpedition()}
function drawExpeditionEvent(){
 const run=expeditionRun(),e=run.event;let body='';
 if(e.type==='rest')body=`<h2>☕ 休息一下</h2><p>恢复了 1 颗心。来看一张本章知识卡：</p><div class="expedition-card-note"><span class="eyebrow">${arenaEscape(e.card.lesson)}</span><h3>${arenaEscape(e.card.heading)}</h3><p>${arenaEscape(e.card.text)}</p></div>`;
 else if(e.type==='chest'){const m=e.card?MOLECULES.find(m=>m.id===e.card):null;body=`<h2>🎁 打开宝箱</h2>${m?`<p>发现了新的分子，已送进博物馆：</p><div class="expedition-card-note molecule"><div class="shop-item-art">${growthMoleculeArt(m,true)}</div><h3>${m.name}</h3><p>${m.structure} · ${m.note}</p></div>`:`<p>本章的分子都已发现，宝箱里装着 ✦ ${e.stardust} 星尘。</p>`}`}
 else if(e.type==='result'){const npc=NPCS.find(n=>n.id===e.npc);body=`<h2>${e.cleared?'⚔ 战斗胜利':'⚔ 这一场没有赢'}</h2><p>你 ${e.you} : ${e.opponent} ${npc.name}${e.cleared?`，获得 ✦ ${e.gain} 星尘`:'，没有通关奖励，但路还在继续'}。</p><p class="review-npc"><span class="npc-portrait small">${arenaPortrait(npc.seed)}</span>${npc.name}：${e.cleared?npc.win:npc.lose}</p>`}
 else if(e.type==='shop')body=`<h2>🛒 小岛商店</h2><p class="sub">用金币购买本局道具。治疗药水和星尘护符立即生效，提示卡在战斗中使用。</p><div class="shop-stock">${e.stock.map(s=>{const item=s.kind==='relic'?RELICS.find(r=>r.id===s.id):POTIONS.find(p=>p.id===s.id),price=s.kind==='relic'?80:item.price,bought=e.bought.includes(s.id);return `<article class="shop-item"><div class="shop-item-art"><span class="relic-icon">${item.icon}</span></div><div class="shop-item-copy"><span class="shop-item-category">${s.kind==='relic'?'遗物':'道具'}</span><h3>${item.name}</h3><p>${item.desc}</p><button class="btn ${bought?'light':''}" data-expedition-buy="${s.id}" ${bought||state.coins<price?'disabled':''}>${bought?'已购买':`🪙 ${price}`}</button></div></article>`}).join('')}</div>`;
 arenaOpen(`<div class="expedition">${expeditionHeader(run,EXPEDITION_NODES[e.type==='result'?'fight':e.type].name)}<div class="expedition-event">${body}</div><button class="btn" data-expedition-continue>继续前进 →</button></div>`);
}
function buyExpeditionItem(id){
 const run=expeditionRun(),e=run?.event;if(!e||e.type!=='shop'||e.bought.includes(id))return;const stock=e.stock.find(s=>s.id===id);if(!stock)return;
 const price=stock.kind==='relic'?80:POTIONS.find(p=>p.id===id).price;if(state.coins<price)return toast(`金币还差 ${price-state.coins} 枚。`);
 state.coins-=price;e.bought.push(id);
 if(stock.kind==='relic'){run.relics.push(id);if(id==='mirror'||id==='npc-xiaoya')run.maxHearts=Math.min(GROWTH_RULES.heartsMax,run.maxHearts+1);if(id==='mirror'||id==='npc-zisu')run.hearts=Math.min(run.maxHearts,run.hearts+1)}
 else if(id==='heal')run.hearts=Math.min(run.maxHearts,run.hearts+1);else if(id==='charm')run.charm=true;else run.items.push(id);
 save();drawExpeditionEvent();
}
function continueExpedition(){const run=expeditionRun();if(!run?.event)return;run.event=null;expeditionAdvance(run);save();drawExpedition()}
function finishExpedition(won){
 const g=growthState(),run=g.expedition;if(!run)return;const rules=GROWTH_RULES,boss=BOSSES.find(b=>b.chapter===run.chapter);
 if(won)run.stardust+=rules.bossClear;
 const multiplier=1+(expeditionHas(run,'pouch')?.25:0)+(expeditionHas(run,'npc-xiaoya')?.1:0),earned=Math.round(run.stardust*multiplier),paid=won?earned:Math.floor(earned*rules.lossShare);
 growthGainStardust(paid);growthMarkActive();
 let badgeNew=false,setDone=false;
 if(won){const prev=g.badges[run.chapter];g.badges[run.chapter]={at:Date.now(),runs:(prev?.runs||0)+1};if(!g.museum.cards.includes(boss.molecule))g.museum.cards.push(boss.molecule);badgeNew=reward('badge:'+run.chapter,rules.badgeCoins,rules.badgeXp);setDone=growthCheckMuseumSet(run.chapter)}
 const nodes=run.picked.length+(won?1:0);g.expeditions.unshift({chapter:run.chapter,won,nodes,stardust:paid,at:Date.now()});g.expeditions.splice(20);
 const cards=run.cards.concat(won?[boss.molecule]:[]).map(id=>MOLECULES.find(m=>m.id===id)).filter(Boolean),npc=growthNpcOfDay();
 g.expedition=null;save();render();
 arenaOpen(`<div class="arena-battle expedition"><div class="arena-final"><span class="arena-result-icon" aria-hidden="true">${won?'🏆':'🌙'}</span><h2>${won?`打败了${boss.name}`:'远征结束'}</h2><p>${won?`第 ${run.chapter} 章徽章${badgeNew?'已点亮':'再次通关'}。`:'心数耗尽，这次没能走到最后；错题已收进复习计划，明天会回来找你。'}</p><div class="arena-win-reward">✦ <strong>+${paid}</strong> 星尘<span>${won?'全额结算':'按 50% 结算'}</span></div>${badgeNew?`<div class="arena-win-reward">🪙 <strong>+${rules.badgeCoins}</strong> 金币<span>首次通关奖励，另加 ${rules.badgeXp} 经验</span></div>`:''}${setDone?`<div class="arena-win-reward">🏛 <strong>集齐第 ${run.chapter} 章分子</strong><span>+${rules.museumSetCoins} 金币、+${rules.museumSetXp} 经验</span></div>`:''}${cards.length?`<p>本局发现的分子：${cards.map(m=>`<b>${m.name}</b>`).join('、')}</p>`:''}<p class="review-npc"><span class="npc-portrait small">${arenaPortrait(npc.seed)}</span>${npc.name}：${won?npc.win:npc.lose}</p><div class="arena-result-actions"><button class="btn" data-expedition-start="${run.chapter}">再来一局</button>${growthDueKeys().length?'<button class="btn gold" data-review-start>去复习错题</button>':''}<button class="btn light" data-expedition-close>返回</button></div></div></div>`);
 document.querySelector('#modal').scrollTop=0;
}
document.addEventListener('change',e=>{if(e.target.dataset.expeditionChapter!==undefined){expeditionLobbyChapter=Number(e.target.value);render();document.querySelector('[data-expedition-chapter]')?.focus()}});
document.addEventListener('click',e=>{const b=e.target.closest('button');if(!b)return;const d=b.dataset;
 if(d.expeditionStart)startExpedition(d.expeditionStart);
 if(d.expeditionResume!==undefined)drawExpedition();
 if(d.expeditionLobby!==undefined){location.hash='pk';document.querySelector('.expedition-card')?.scrollIntoView({block:'start'})}
 if(d.expeditionAbandon!==undefined)abandonExpedition();
 if(d.expeditionNode!==undefined)enterExpeditionNode(Number(d.expeditionNode));
 if(d.expeditionBoss!==undefined){const run=expeditionRun();if(run&&!run.fight&&!run.event&&run.layer>=run.layers.length){run.fight=makeExpeditionFight(run,{type:'boss'},expeditionRand(run,7));save();drawExpedition()}}
 if(d.expeditionAnswer!==undefined)selectExpedition(Number(d.expeditionAnswer));
 if(d.expeditionConfirm!==undefined){const f=expeditionRun()?.fight;if(f&&f.selected!==null)answerExpedition(f.selected)}
 if(d.expeditionHint!==undefined)useExpeditionHint();
 if(d.expeditionNext!==undefined)nextExpedition();
 if(d.expeditionRelic)takeExpeditionRelic(d.expeditionRelic);
 if(d.expeditionBuy)buyExpeditionItem(d.expeditionBuy);
 if(d.expeditionContinue!==undefined)continueExpedition();
 if(d.expeditionClose!==undefined){document.querySelector('#modal').close();render()}
});
