const arenaDifficulties=[
 {id:'easy',name:'简单',reward:40,min:4,max:6,color:'mint',symbol:'Ⅰ',desc:'熟悉概念，练稳基础'},
 {id:'medium',name:'中等',reward:60,min:5,max:7,color:'blue',symbol:'Ⅱ',desc:'辨析结构，巩固重点'},
 {id:'hard',name:'困难',reward:80,min:7,max:10,color:'amber',symbol:'Ⅲ',desc:'综合判断，挑战高分'}
];
const arenaTopics={intro:['有机物分类','碳骨架与键','官能团辨析'],hydrocarbon:['烃与通式','双键与加成','苯环结构'],naming:['选链与编号','名称与结构','构造异构'],halogen:['卤代烃结构','取代反应','反应条件'],alcohol:['醇与酚','醚的结构','氧化与性质'],carbonyl:['羰基辨析','醛与酮','氧化反应'],carboxyl:['羧酸性质','酯化与条件','酯的辨析'],stereo:['异构分类','顺反异构','手性碳'],nitrogen:['胺的结构','胺的碱性','杂环与生物碱'],nutrition:['糖类分类','淀粉鉴别','油脂与皂化'],protein:['氨基酸结构','肽键','变性与水解'],polymer:['加聚反应','结构与性质','实验规范']};
let arenaCourse=null,arenaSession=null,arenaLastLesson=null;
const arenaEscape=s=>String(s).replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
function arenaState(){
 if(!state.arena)state.arena={history:[],recentNames:[],played:0,wins:0,streak:0,bestStreak:0,coins:0};
 return state.arena;
}
function arenaShuffle(list){const result=[...list];for(let i=result.length-1;i>0;i--){const j=Math.floor(Math.random()*(i+1));[result[i],result[j]]=[result[j],result[i]]}return result}
function arenaSelectedCourse(){if(state.lastLesson!==arenaLastLesson&&lessons.some(l=>l.id===state.lastLesson)){arenaLastLesson=state.lastLesson;arenaCourse=state.lastLesson}return lessons.find(l=>l.id===arenaCourse)||lessons.find(l=>l.id===state.read.at(-1))||lessons[0]}
function arenaPortrait(seed=0,player=false){
 const colors=['#a6cabe','#b7c4e2','#e3be96','#c9b3da','#d8c18d','#9dc4cf'];
 return `<svg viewBox="0 0 100 100" aria-hidden="true"><rect x="1" y="1" width="98" height="98" rx="28" fill="${player?'#97bdad':colors[seed%colors.length]}"/><circle cx="77" cy="22" r="12" fill="#ffffff45"/><path d="M18 99V82Q20 66 50 65Q81 65 83 82V99" fill="#f8faf4"/><path d="M41 68L50 81L60 68V62H41Z" fill="#d5a57e"/><path d="M44 80H56L61 99H39Z" fill="${player?'#387e68':'#64799d'}"/><path d="M29 31Q30 12 51 13Q74 12 74 37V45H28Z" fill="#493c34"/><path d="M32 35V49Q33 68 51 68Q70 66 70 49V32L57 25L46 34Z" fill="#edc6a2"/><path d="M31 36L31 22L44 16H64L74 29L66 30L57 25L44 36Z" fill="#493c34"/><path d="M39 44H46M57 44H64" stroke="#493c34" stroke-width="3" stroke-linecap="round"/>${seed%2===0?'<g fill="none" stroke="#536965" stroke-width="2"><rect x="35" y="39" width="15" height="13" rx="4"/><rect x="54" y="39" width="15" height="13" rx="4"/><path d="M50 44H54"/></g>':''}<path d="M46 57Q52 62 58 57" fill="none" stroke="#b27560" stroke-width="2" stroke-linecap="round"/><path d="M29 83V97M73 83V97" stroke="#d3dfd8" stroke-width="2"/><rect x="64" y="80" width="9" height="6" rx="1" fill="#91bfae"/></svg>`;
}
function arenaPage(){
 const a=arenaState(),lesson=arenaSelectedCourse();arenaCourse=lesson.id;
 return `<section class="arena-lobby"><div class="arena-intro"><div><h1>知识竞技场</h1><p class="sub">选择课程与难度，比虚拟对手答对更多题即可获胜。</p></div><span class="arena-label">虚拟玩家挑战</span></div>
 <div class="arena-overview"><div><span>获胜场次</span><b>${a.wins}<small> / ${a.played} 场</small></b></div><div><span>最佳连胜</span><b>${a.bestStreak}<small> 场</small></b></div><div class="arena-earned"><span>挑战累计奖励</span><b><span aria-hidden="true">🪙</span> ${a.coins}<small> 金币</small></b></div></div>
 <div class="arena-course"><label for="arena-course">挑战课程</label><select id="arena-course">${lessons.map(l=>`<option value="${l.id}" ${l.id===lesson.id?'selected':''}>${arenaEscape(l.title)}</option>`).join('')}</select><span>10 道题 · 3 个知识点 · 重难点加强</span></div>
 <div class="arena-tiers">${arenaDifficulties.map(d=>`<article class="arena-tier ${d.color}"><div class="arena-tier-top"><span class="arena-tier-symbol">${d.symbol}</span><span>10 题 / 场</span></div><h2>${d.name}</h2><p>${d.desc}</p><div class="arena-reward"><span class="arena-coin" aria-hidden="true">¤</span><strong>${d.reward}</strong><span>金币<small>每次获胜奖励</small></span></div><div class="arena-tier-rule">对手答对 <b>${d.min}–${d.max}</b> 题<br>你的答对数 <b>超过对手</b> 即获胜</div><button class="btn" data-arena-start="${d.id}">开始挑战 <span aria-hidden="true">→</span></button></article>`).join('')}</div>
 ${arenaMistakesHTML()}
 <section class="arena-history"><div class="section-head"><h2>最近战绩</h2><small>保留最近 20 场</small></div>${a.history.length?`<div class="arena-history-list">${a.history.slice(0,6).map(h=>{const d=arenaDifficulties.find(d=>d.id===h.difficulty);return `<div class="arena-history-row"><span class="arena-outcome ${h.won?'win':''}">${h.won?'获胜':h.correct===h.opponentCorrect?'平局':'未获胜'}</span><div><b>${arenaEscape(lessons.find(l=>l.id===h.course)?.title||'课程挑战')}</b><small>${arenaEscape(h.name)} · ${d?.name||''} · ${new Date(h.time).toLocaleDateString('zh-CN')}</small></div><strong>${h.correct}<span> : </span>${h.opponentCorrect}</strong><span class="arena-history-gold">${h.won?'🪙 +'+h.reward:'—'}</span></div>`}).join('')}</div>`:'<div class="arena-empty">完成第一场挑战后，比分和奖励会记录在这里。</div>'}</section></section>`;
}
function arenaNewOpponent(){
 const first=['林','陈','周','许','沈','夏','苏','江','唐','陆','顾','宋','叶','程','何','温','徐','方','白','李'];
 const last=['星禾','知远','沐言','予安','以宁','清越','思齐','若溪','景行','书遥','南初','嘉树','亦辰','云舒','时雨','闻舟','可昕','子墨','雨桐','念一','泽宇','语棠','安澜','竹青','晨曦','明川','浅夏','梓宁','望舒','乐然'];
 const recent=arenaState().recentNames;const available=first.flatMap(f=>last.map(l=>f+l)).filter(n=>!recent.includes(n));
 const name=available[Math.floor(Math.random()*available.length)];recent.unshift(name);recent.splice(40);
 return {name,seed:Math.floor(Math.random()*100)};
}
function startArena(difficulty){
 const d=arenaDifficulties.find(d=>d.id===difficulty);if(!d)return;
 const lesson=arenaSelectedCourse(),opponent=arenaNewOpponent();
 // Ten distinct questions cover all three points; five or more target the focus areas.
 const questions=arenaShuffle(arenaQuestionBank(lesson)).map(q=>{const order=arenaShuffle(q.options.map((_,i)=>i));return {...q,options:order.map(i=>q.options[i]),a:order.indexOf(q.a)}});
 const score=d.min+Math.floor(Math.random()*(d.max-d.min+1));
 arenaSession={id:crypto.randomUUID(),course:lesson.id,difficulty:d.id,opponent,questions,opponentAnswers:arenaShuffle(Array.from({length:questions.length},(_,i)=>i<score)),answers:[],index:0,selected:null,completed:false};
 save();drawArenaQuestion();$('#modal').scrollTop=0;
}
function arenaScores(){return {you:arenaSession.answers.filter(a=>a.correct).length,opponent:arenaSession.opponentAnswers.slice(0,arenaSession.answers.length).filter(Boolean).length}}
function arenaScene(final=false){
 const s=arenaSession,d=arenaDifficulties.find(d=>d.id===s.difficulty),score=arenaScores();
 return `<div class="arena-battle-scene ${d.color}"><svg class="arena-scene-art" viewBox="0 0 900 220" preserveAspectRatio="xMidYMid slice" aria-hidden="true"><defs><pattern id="arena-grid" width="40" height="40" patternUnits="userSpaceOnUse"><path d="M40 0H0V40" fill="none" stroke="#fff" stroke-opacity=".08"/></pattern></defs><rect width="900" height="220" fill="url(#arena-grid)"/><g fill="none" stroke="#d3e5cb" stroke-opacity=".3" stroke-width="2"><path d="M40 30L100 60L100 125L42 158L0 133M790 30L850 65L850 128L790 165L730 129L730 65Z"/><circle cx="100" cy="60" r="9"/><circle cx="100" cy="125" r="6"/><circle cx="730" cy="129" r="8"/><circle cx="850" cy="65" r="6"/><ellipse cx="450" cy="210" rx="360" ry="30"/><ellipse cx="450" cy="210" rx="265" ry="18"/></g></svg><div class="arena-battle-meta"><span>${d.name}挑战 · ${final?'最终比分':`第 ${s.index+1} / ${s.questions.length} 题`}</span><span class="arena-prize">🪙 获胜 +${d.reward}</span></div><div class="arena-fighters"><div class="arena-fighter">${arenaPlayerPortrait()}<b>你</b><span>挑战者</span></div><div class="arena-scoreboard" aria-live="polite" aria-atomic="true"><div><strong>${score.you}</strong><span>:</span><strong>${score.opponent}</strong></div><small>${final?'答对题数':'实时答对题数'}</small></div><div class="arena-fighter">${arenaPortrait(s.opponent.seed)}<b>${arenaEscape(s.opponent.name)}</b><span>系统虚拟玩家</span></div></div><div class="arena-rounds" aria-label="你的答题记录">${s.questions.map((_,i)=>`<span class="${s.answers[i]?(s.answers[i].correct?'hit':'miss'):i===s.index&&!final?'current':''}" title="第 ${i+1} 题${s.answers[i]?(s.answers[i].correct?'：正确':'：错误'):'：未作答'}">${s.answers[i]?(s.answers[i].correct?'✓':'×'):i+1}</span>`).join('')}</div></div>`;
}
function arenaOpen(html){modal(html);$('#modal').classList.add('arena-dialog')}
function drawArenaQuestion(){
 const s=arenaSession,q=s.questions[s.index],a=s.answers[s.index];
 arenaOpen(`<div class="arena-battle">${arenaScene()}<div class="arena-question"><div class="arena-question-meta"><span>${arenaEscape(lessons.find(l=>l.id===s.course).title)}</span><span>${q.focus?'重点辨析':'知识巩固'}</span></div><h2>${arenaEscape(q.q)}</h2><div class="arena-options">${q.options.map((option,i)=>`<button class="option ${a?(i===q.a?'correct':i===a.chosen?'wrong':''):s.selected===i?'selected':''}" data-arena-answer="${i}" aria-pressed="${a?a.chosen===i:s.selected===i}" ${a?'disabled':''}><span>${String.fromCharCode(65+i)}</span>${arenaEscape(option)}</button>`).join('')}</div><div id="arena-feedback" role="status">${a?`<div class="arena-feedback ${a.correct?'correct':'wrong'}"><b>${a.correct?'回答正确':'回答错误'}</b><p>${arenaEscape(q.why)}</p><small>虚拟对手本题：${s.opponentAnswers[s.index]?'答对':'答错'}</small></div><button class="btn arena-next" data-arena-next>${s.index===s.questions.length-1?'查看结果':'下一题 →'}</button>`:`<div class="arena-confirm-row"><p class="arena-think">选好后点击确认，可在提交前改选。</p><button class="btn" data-arena-confirm ${s.selected===null?'disabled':''}>确认答案</button></div>`}</div></div></div>`);
}
function selectArena(chosen){
 const s=arenaSession;if(!s||s.completed||s.answers[s.index]||!Number.isInteger(chosen)||chosen<0||chosen>=s.questions[s.index].options.length)return;
 s.selected=chosen;
 document.querySelectorAll('[data-arena-answer]').forEach(b=>{const selected=Number(b.dataset.arenaAnswer)===chosen;b.classList.toggle('selected',selected);b.setAttribute('aria-pressed',String(selected))});
 $('[data-arena-confirm]').disabled=false;
}
function answerArena(chosen){
 const s=arenaSession;if(!s||s.completed||s.answers[s.index]||!Number.isInteger(chosen))return;
 const q=s.questions[s.index];if(chosen<0||chosen>=q.options.length)return;
 s.answers.push({key:q.key,chosen,correct:chosen===q.a});
 if(chosen!==q.a)arenaRecordMistake(s.course,q,chosen);
 // Existing course exercises continue to participate in the shared wrong-answer review.
 if(q.courseIndex!==undefined){const key=s.course+':'+q.courseIndex;if(chosen===q.a)state.mistakes=state.mistakes.filter(k=>k!==key);else if(!state.mistakes.includes(key))state.mistakes.push(key);save()}
 save();drawArenaQuestion();$('#arena-feedback').scrollIntoView({block:'nearest'});$('[data-arena-next]').focus({preventScroll:true});
}
function finishArena(){
 const s=arenaSession;if(!s||s.completed||s.answers.length!==s.questions.length)return;
 s.completed=true;const a=arenaState(),scores=arenaScores(),d=arenaDifficulties.find(d=>d.id===s.difficulty),won=scores.you>scores.opponent;
 // Unique match IDs award every win exactly once. Ties and losses never pay out.
 if(won){state.coins+=d.reward;a.wins++;a.coins+=d.reward;a.streak++;a.bestStreak=Math.max(a.bestStreak,a.streak)}else a.streak=0;
 a.played++;a.history.unshift({id:s.id,course:s.course,difficulty:s.difficulty,name:s.opponent.name,correct:scores.you,opponentCorrect:scores.opponent,won,reward:won?d.reward:0,time:Date.now()});a.history.splice(20);save();
 arenaOpen(`<div class="arena-battle">${arenaScene(true)}<div class="arena-final"><span class="arena-result-icon" aria-hidden="true">${won?'🏆':scores.you===scores.opponent?'🤝':'📖'}</span><h2>${won?'挑战获胜':scores.you===scores.opponent?'本场平局':'本场未获胜'}</h2><p>${won?'你的答对题数超过了对手。':'获胜需要答对题数超过对手，本场没有金币奖励。'}</p>${won?`<div class="arena-win-reward">🪙 <strong>+${d.reward}</strong> 金币<span>已存入余额</span></div>`:''}<div class="arena-result-actions"><button class="btn" data-arena-retry>再挑战一次</button><button class="btn light" data-arena-return>返回竞技场</button></div></div><section class="arena-review"><h3>本场解析 <small>${s.answers.filter(a=>!a.correct).length} 道错题</small></h3>${s.questions.map((q,i)=>`<details ${s.answers[i].correct?'':'open'}><summary><span class="${s.answers[i].correct?'hit':'miss'}">${s.answers[i].correct?'✓':'×'}</span> ${i+1}. ${arenaEscape(q.q)}</summary><p>你的答案：${arenaEscape(q.options[s.answers[i].chosen])}<br><b>正确答案：${arenaEscape(q.options[q.a])}</b></p><p>${arenaEscape(q.why)}</p></details>`).join('')}<button class="btn light" data-lesson="${s.course}">查看本课知识卡 →</button></section></div>`);render();$('#modal').scrollTop=0;
}
document.addEventListener('change',e=>{if(e.target.id==='arena-course'){arenaCourse=e.target.value;render()}});
document.addEventListener('click',e=>{const b=e.target.closest('button');if(!b)return;const d=b.dataset;if(d.arenaStart)startArena(d.arenaStart);if(d.arenaAnswer!==undefined)selectArena(Number(d.arenaAnswer));if(d.arenaConfirm!==undefined&&arenaSession?.selected!==null)answerArena(arenaSession?.selected);if(d.arenaNext!==undefined&&arenaSession&&!arenaSession.completed&&arenaSession.answers[arenaSession.index]){if(arenaSession.index<arenaSession.questions.length-1){arenaSession.index++;arenaSession.selected=null;drawArenaQuestion();$('#modal').scrollTop=0}else finishArena()}if(d.arenaRetry!==undefined&&arenaSession?.completed)startArena(arenaSession.difficulty);if(d.arenaReturn!==undefined){$('#modal').close();render()}if(d.lesson&&$('#modal').classList.contains('arena-dialog'))$('#modal').classList.remove('arena-dialog')});
document.querySelector('#modal').addEventListener('close',()=>{document.querySelector('#modal').classList.remove('arena-dialog')});

function arenaPlayerPortrait(){return `<div class="arena-player-avatar" data-arena-player-avatar>${playerSprite().replace(/viewBox="0 0 96 (160|216)"/,'viewBox="8 0 80 80"')}</div>`}
function updateArenaPlayerAvatar(){document.querySelectorAll('[data-arena-player-avatar]').forEach(el=>{el.innerHTML=playerSprite().replace(/viewBox="0 0 96 (160|216)"/,'viewBox="8 0 80 80"')})}
