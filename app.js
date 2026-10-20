const $=s=>document.querySelector(s);
const initial={coins:100,xp:0,read:[],passed:[],rewards:[],owned:[],equipped:[],lab:[],mistakes:[],videos:{}};
const storageKey='chem-island-organic-v1';
let state;
try {
 const organic=localStorage.getItem(storageKey);
 if(organic)state={...structuredClone(initial),...JSON.parse(organic)};
 else {
  const old=JSON.parse(localStorage.getItem('chem-island-v1')||'{}');
  state={...structuredClone(initial),coins:old.coins??100,xp:old.xp??0,owned:old.owned||[],equipped:old.equipped||[],lab:old.lab||[],rewards:(old.rewards||[]).filter(x=>x.startsWith('lab:'))};
 }
}catch{state=structuredClone(initial)}
migrateTextbookProgress();
const items=cottageItems;
initCottage();
const routes=[['home','⌂','首页'],['learn','▤','学习任务'],['pk','⚔','知识竞技场'],['lab','⚗','实验室'],['room','♧','我的小屋']];
let route='home',quiz=null,labSession=null;
function save(){try{localStorage.setItem(storageKey,JSON.stringify(state))}catch{toast('当前浏览器无法保存进度，请保持页面打开。')}updateHeader();if(typeof updateArenaPlayerAvatar==='function')updateArenaPlayerAvatar()}
function updateHeader(){$('.avatar.small').innerHTML=playerSprite();$('#coins').textContent=state.coins;$('#level').textContent=`Lv.${1+Math.floor(state.xp/100)} · ${state.xp} 经验值`}
function toast(s){$('#toast').textContent=s;$('#toast').classList.add('show');clearTimeout(toast.t);toast.t=setTimeout(()=>$('#toast').classList.remove('show'),3000)}
function reward(id,coins,xp){if(state.rewards.includes(id))return false;state.rewards.push(id);state.coins+=coins;state.xp+=xp;save();return true}
function modal(html){$('#modal-body').innerHTML=html;if(!$('#modal').open)$('#modal').showModal()}
$('.close').onclick=()=>$('#modal').close();$('#modal').addEventListener('click',e=>{if(e.target===$('#modal'))$('#modal').close()});
function roomHTML(){return cottageHTML()}
function heading(title,sub){return `<div class="welcome"><div><h1>${title}</h1><p class="sub">${sub}</p></div></div>`}
function taskHTML(l,i){let done=state.passed.includes(l.id);return `<div class="task"><div class="task-num">${done?'✓':String(i+1).padStart(2,'0')}</div><div><span class="tag">${done?'已掌握':state.read.includes(l.id)?'待练习':'未学习'}</span><span class="reward">+30 金币</span><h3>${l.title}</h3><p>知识卡 / 自备视频 · 3 道巩固练习</p></div><button class="btn ${i?'light':''}" data-lesson="${l.id}">${done?'复习':'去学习'} ↗</button></div>`}
function render(){route=location.hash.slice(1)||'home';if(!routes.some(r=>r[0]===route))route='home';$('nav').innerHTML=routes.map(([id,icon,name])=>`<a href="#${id}" class="${route===id?'active':''}" ${route===id?'aria-current="page"':''}><span class="icon">${icon}</span>${name}</a>`).join('');$('#page-title').textContent=routes.find(r=>r[0]===route)[2];updateHeader();const next=lessons.find(l=>!state.passed.includes(l.id))||lessons[0];let html='';
if(route==='home')html=`<section class="continue-card"><div><h2>${next.title}</h2><p class="sub">${next.chapter} · 3 道练习</p></div><button class="btn" data-lesson="${next.id}">${state.passed.length===lessons.length?'复习课程':'继续学习'} →</button></section><div class="stats"><div class="stat"><div class="stat-icon">▤</div><div><strong>${state.passed.length}</strong><small>/ ${lessons.length} 个任务</small><p>已完成课程</p></div></div><div class="stat"><div class="stat-icon">✧</div><div><strong>${state.xp}</strong><small>EXP</small><p>经验值</p></div></div><div class="stat"><div class="stat-icon">⚗</div><div><strong>${state.lab.length}</strong><small>/ 3 个实验</small><p>已完成实验</p></div></div></div><div class="columns"><section><div class="section-head"><h2>学习任务</h2><a href="#learn">全部课程 →</a></div><div class="tasks">${lessons.slice(0,3).map(taskHTML).join('')}</div></section><section><div class="section-head"><h2>我的科学小屋</h2><small>Lv.${1+Math.floor(state.xp/100)}</small></div><div class="room-card">${roomHTML()}<div class="room-title"><span>小屋预览</span><a href="#room">装扮小屋 ↗</a></div></div></section></div><div class="quick-grid"><a class="quick" href="#pk"><span class="big">⚔️</span><div><h3>知识挑战</h3><p>三档难度 · 每场 10 题</p></div><b>↗</b></a><a class="quick" href="#lab"><span class="big">🧪</span><div><h3>模拟实验</h3><p>淀粉鉴别、酸碱性、过滤</p></div><b>↗</b></a></div>`;
if(route==='learn')html=textbookStudyPage();
if(route==='pk')html=arenaPage();
if(route==='room')html=cottagePage();
if(route==='lab')html=laboratoryPage();
$('#main').innerHTML=html;startCottagePets();}
function openLesson(id){showTextbookLesson(id)}
function playVideo(url){pauseChapterVideos();const container=$('#video-container');container.innerHTML='<video controls playsinline></video><p class="video-label">观看后点击下方按钮进入练习。</p>';container.querySelector('video').src=url;container.querySelector('video').onerror=()=>toast('视频无法加载，请检查链接或改用本地视频。')}
function startQuiz(id){quiz={id,index:0,correct:0,answered:false};if(!state.read.includes(id)){state.read.push(id);save()}drawQuestion()}
function drawQuestion(){const l=lessons.find(x=>x.id===quiz.id),q=l.questions[quiz.index];quiz.answered=false;modal(`<div class="quiz-top"><span>${'知识巩固 · '+l.title}</span><span>${quiz.index+1} / 3</span></div><div class="progress"><span style="width:${quiz.index/3*100}%"></span></div><h2 style="margin-top:25px">${q.q}</h2><div class="options">${q.options.map((s,i)=>`<button class="option" data-answer="${i}">${String.fromCharCode(65+i)}. ${s}</button>`).join('')}</div><div id="answer-feedback" aria-live="polite"></div>`)}
function answer(n){if(!quiz||quiz.answered)return;quiz.answered=true;const q=lessons.find(x=>x.id===quiz.id).questions[quiz.index],ok=n===q.a,key=quiz.id+':'+quiz.index;if(ok){quiz.correct++;state.mistakes=state.mistakes.filter(x=>x!==key)}else if(!state.mistakes.includes(key))state.mistakes.push(key);if(!ok&&typeof arenaRecordMistake==='function')arenaRecordMistake(quiz.id,{...q,key:quiz.id+':course:'+quiz.index,courseIndex:quiz.index,topic:arenaOriginalTopics[quiz.id]?.[quiz.index]??quiz.index},n);save();document.querySelectorAll('[data-answer]').forEach((b,i)=>{b.disabled=true;if(i===q.a)b.classList.add('correct');else if(i===n)b.classList.add('wrong')});$('#answer-feedback').innerHTML=`<div class="feedback"><b>${ok?'答对了！':'回答错误'}</b><br>${q.why}</div><button class="btn" style="margin-top:16px" data-next>${quiz.index===2?'查看结果':'下一题 →'}</button>`}
function finishQuiz(){const {id,correct}=quiz;let earned=false;if(correct===3){if(!state.passed.includes(id))state.passed.push(id);earned=reward('lesson:'+id,30,40);save()}const title=correct===3?'课程完成':'尚未通过',desc=`本次答对 ${correct} / 3 题。${earned?'获得 30 金币和 40 经验。':correct===3?'本课首次奖励已领取。':'全对即可完成任务；错题已收进「错题回顾」。'}`;modal(`<div class="result"><div class="big-icon">${earned?'🏅':'🌱'}</div><h2>${title}</h2><p>${desc}</p><button class="btn" data-retry>再练一次</button> <button class="btn light" data-done>返回</button></div>`);render()}
function buy(id){purchaseCottageItem(id)}
function startLab(id){startBench(id)}
document.addEventListener('click',e=>{const b=e.target.closest('button');if(!b)return;const d=b.dataset;if(d.lesson)openLesson(d.lesson);if(d.practice)startQuiz(d.practice);if(d.answer!==undefined)answer(Number(d.answer));if(d.next!==undefined){if(quiz.index<2){quiz.index++;drawQuestion()}else finishQuiz()}if(d.retry!==undefined)startQuiz(quiz.id);if(d.done!==undefined){$('#modal').close();render()}if(d.buy)buy(d.buy);if(d.video){let url;try{url=new URL($('#video-url').value);if(url.protocol!=='https:')throw Error()}catch{return toast('请填写有效的 HTTPS 视频直链。')}state.videos[d.video]=url.href;save();playVideo(url.href)}if(d.lab)startLab(d.lab);});
window.addEventListener('hashchange',render);save();render();
