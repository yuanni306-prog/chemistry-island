let textbookChapter='1',textbookQuery='';
function escapeStudyText(value){return String(value).replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]))}
function migrateTextbookProgress(){
 if(state.curriculumRevision!==textbook.revision){
  const oldKey=state.curriculumRevision||'legacy-organic-12-units';
  state.curriculumArchive=state.curriculumArchive&&typeof state.curriculumArchive==='object'?state.curriculumArchive:{};
  if(!state.curriculumArchive[oldKey])state.curriculumArchive[oldKey]={read:[...state.read],passed:[...state.passed],mistakes:[...state.mistakes],videos:{...state.videos},archivedAt:Date.now()};
  state.read=[];state.passed=[];state.mistakes=[];state.videos={};
  state.curriculumRevision=textbook.revision;
 }
 // Keep completions, videos, currency and reward keys. Old question indices must
 // not silently resolve to different questions after photo-based corrections.
 const revision=textbook.contentRevision;
 if(revision&&state.textbookContentRevision!==revision){
  const changed=new Set(lessons.filter(l=>l.contentRevision===revision).map(l=>l.id));
  const outdated=state.mistakes.filter(key=>changed.has(key.slice(0,key.lastIndexOf(':'))));
  if(outdated.length){
   state.curriculumArchive=state.curriculumArchive||{};
   const key='questions-before-'+revision;
   if(!state.curriculumArchive[key])state.curriculumArchive[key]={mistakes:[...outdated],archivedAt:Date.now(),note:'教材照片核对前的题目索引；仅存档，不映射为新题。'};
   state.mistakes=state.mistakes.filter(key=>!outdated.includes(key));
  }
  state.textbookContentRevision=revision;
 }
}
function textbookVerification(l){return l.verification?.status==='photo-verified'?`已按教材核对 · 第 ${l.verification.pages} 页`:'正文待核对'}
function textbookDetailedLesson(l){
 if(!l.topics)return `<div class="study-lesson-points">${l.lines.map((s,i)=>`<div class="lesson-line ${i===4?'study-example':i===5?'study-pitfall':''}">${s}</div>`).join('')}</div>`;
 const structureTable=l.id==='t4-02-02'?'<div class="study-table-wrap"><table class="study-table"><caption>结构对照</caption><thead><tr><th>分子</th><th>空间结构</th><th>键角</th><th>碳碳成键</th></tr></thead><tbody><tr><td>乙烯 CH₂=CH₂</td><td>六原子共平面</td><td>约 120°</td><td>1σ + 1π</td></tr><tr><td>乙炔 HC≡CH</td><td>四原子共直线</td><td>180°</td><td>1σ + 2π</td></tr></tbody></table></div>':'';
 return `<p class="study-coverage">${textbookVerification(l)} · ${l.topics.length} 个知识点</p>${structureTable}<div class="study-topics">${l.topics.map((t,i)=>`<details class="study-topic" ${i===0?'open':''}><summary><span>${String(i+1).padStart(2,'0')}</span>${escapeStudyText(t.heading)}</summary><p>${escapeStudyText(t.text)}</p></details>`).join('')}</div><section class="study-review"><h3>课后自测</h3><p class="study-review-intro">先自己作答，再展开参考思路。这里不计分。</p>${l.review.map((r,i)=>`<details class="study-review-item"><summary>${i+1}. ${escapeStudyText(r.prompt)}</summary><p>${escapeStudyText(r.answer)}</p></details>`).join('')}</section>`;
}
function textbookLessonCard(l){const done=state.passed.includes(l.id),read=state.read.includes(l.id);return `<article class="study-card"><p class="study-reference">${l.kind==='practice'?l.reference:`第 ${l.chapterNo} 章 · 第 ${l.sectionNo} 节`}</p><h3>${l.title}</h3>${l.titleVerified===false?'<p class="study-title-note">节名待实体目录核对</p>':''}<p class="study-description">${l.desc}</p><p class="study-coverage">${textbookVerification(l)}</p>${CHAPTER_VIDEOS[l.id]?`<span class="study-card-video">配套视频 · ${chapterVideoTime(CHAPTER_VIDEOS[l.id].duration)}</span>`:''}<div class="study-card-bottom"><span class="study-status">${done?'✓ 已完成':read?'已阅读 · 待练习':'未开始'}</span><button class="btn ${done?'light':''}" data-lesson="${l.id}">${done?'复习':'学习'} →</button></div></article>`}
function textbookStudyPage(){
 const query=textbookQuery.trim().toLowerCase();
 const selected=lessons.filter(l=>(textbookChapter==='all'||textbookChapter==='practice'&&l.kind==='practice'||l.kind==='theory'&&String(l.chapterNo)===textbookChapter)&&(!query||[l.title,l.desc,l.chapter,...l.lines,...(l.topics||[]).flatMap(t=>[t.heading,t.text]),...(l.review||[]).flatMap(r=>[r.prompt,r.answer])].join(' ').toLowerCase().includes(query)));
 const complete=lessons.filter(l=>state.passed.includes(l.id)).length;
 const validMistakes=state.mistakes.map(key=>{const split=key.lastIndexOf(':'),id=key.slice(0,split),n=Number(key.slice(split+1));return lessons.find(l=>l.id===id)?.questions[n]}).filter(Boolean);
 return `<div class="study-heading"><div><h1>教材学习</h1><p class="sub">前两章按教材学习，完成自测与巩固练习。</p></div><span>${complete} / ${lessons.length} 已完成</span></div>${textbookChapter==='1'&&!query?chapterVideoShelf():''}<div class="study-controls"><label for="study-chapter">章节<select id="study-chapter" data-study-chapter><option value="all" ${textbookChapter==='all'?'selected':''}>全部章节</option>${textbookChapters.map(c=>`<option value="${c.id}" ${textbookChapter===c.id?'selected':''}>${c.id==='practice'?'':`第 ${c.id} 章 · `}${c.title}</option>`).join('')}</select></label><label for="study-search">查找知识点<input id="study-search" data-study-query type="search" placeholder="例如：核酸、酰胺、萃取" value="${escapeStudyText(textbookQuery)}"></label></div><div class="study-results"><span>${query?`搜索“${escapeStudyText(textbookQuery)}”`:(textbookChapter==='all'?'全部导学':textbookChapter==='practice'?'实训导学':`第 ${textbookChapter} 章`)} · ${selected.length} 个单元</span><small>首次全对 +30 金币、40 经验</small></div><div class="study-grid">${selected.map(textbookLessonCard).join('')||'<p class="study-empty">没有找到相关内容，可以清空搜索或选择其他章节。</p>'}</div><section class="study-mistakes"><div class="section-head"><h2>错题回顾 · ${validMistakes.length} 道</h2></div><div class="tasks">${validMistakes.length?validMistakes.map(q=>`<div class="task"><div><h3>${q.q}</h3><p>正确答案：${q.options[q.a]} · ${q.why}</p></div></div>`).join(''):'<div class="task"><p class="sub">练习中的错题会自动保存在这里。</p></div>'}</div></section>`;
}
function showTextbookLesson(id){
 const l=lessons.find(x=>x.id===id);if(!l)return;
 if(!state.read.includes(id))state.read.push(id);state.lastLesson=id;save();
 modal(`<span class="eyebrow">${l.reference} · 配套导学</span><h2>${l.title}</h2>${l.titleVerified===false?`<p class="study-practice-note">${l.titleNote}</p>`:''}${l.kind==='practice'?'<p class="study-practice-note">这是实训知识导学。具体试剂、用量、装置和操作须以教材正文及教师方案为准。</p>':''}${chapterLessonVideo(l)}${textbookDetailedLesson(l)}<details class="video-box"><summary>添加自己的课程视频</summary><p>使用有权使用的 HTTPS MP4 直链或本地视频；网页链接不是视频源。</p><label for="video-url">视频直链</label><input id="video-url" type="url" placeholder="https://example.com/lesson.mp4"><button class="btn light" data-video="${id}">加载视频</button><label for="video-file">本地视频</label><input id="video-file" type="file" accept="video/*"><div id="video-container"></div></details><p class="study-lesson-source">ISBN ${textbook.isbn} · ${l.sourceStatus}</p><button class="btn" data-practice="${id}">开始 3 道配套练习 →</button>`);
 document.querySelector('#video-url').value=state.videos[id]||'';
 document.querySelector('#video-file').onchange=e=>{const f=e.target.files[0];if(!f)return;if(openLesson.blob)URL.revokeObjectURL(openLesson.blob);openLesson.blob=URL.createObjectURL(f);playVideo(openLesson.blob)};
 render();
}
document.addEventListener('change',e=>{if(e.target.matches('[data-study-chapter]')){textbookChapter=e.target.value;textbookQuery='';render();document.querySelector('[data-study-chapter]')?.focus()}});
document.addEventListener('input',e=>{if(e.target.matches('[data-study-query]')){textbookQuery=e.target.value;textbookChapter='all';render();const input=document.querySelector('[data-study-query]');input?.focus();input?.setSelectionRange(textbookQuery.length,textbookQuery.length)}});
