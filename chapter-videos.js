// Five original narrated lessons; all media is served from this website.
function chapterVideoURL(source,version){return source.startsWith('data:')||!version?source:`${source}?v=${version}`}
function chapterVideoTime(seconds){const n=Math.floor(seconds);return `${Math.floor(n/60)}:${String(n%60).padStart(2,'0')}`}
function chapterVideoShelf(){
 const list=Object.entries(CHAPTER_VIDEOS),topics=list.reduce((n,[,v])=>n+v.scenes.length,0);
 return `<section class="chapter-video-shelf"><div class="section-head"><h2>第一章配套视频</h2><small>${list.length} 节 · ${topics} 个知识点</small></div><div class="chapter-video-grid">${list.map(([id,v],i)=>`<button class="chapter-video-card" data-open-chapter-video="${id}"><span class="chapter-video-number">${i+1}</span><span><b>${escapeStudyText(v.title)}</b><small>${chapterVideoTime(v.duration)} · ${v.scenes.length} 个知识点</small></span><span class="chapter-video-play" aria-hidden="true">▶</span></button>`).join('')}</div></section>`;
}
function chapterLessonVideo(lesson){
 const v=CHAPTER_VIDEOS[lesson.id];if(!v)return '';
 const url=type=>chapterVideoURL(v[type],v.version);
 return `<section class="lesson-video" data-lesson-video="${lesson.id}"><div class="lesson-video-heading"><h3>配套视频</h3><span>${chapterVideoTime(v.duration)} · ${v.scenes.length} 个知识点</span></div><video controls playsinline preload="metadata" poster="${url('poster')}" data-chapter-video="${lesson.id}" aria-label="${escapeStudyText(v.title)}配套讲解"><source src="${url('src')}" type="video/mp4"><track kind="subtitles" src="${url('captions')}" srclang="zh-CN" label="中文字幕" default>当前浏览器不支持播放视频。</video><p class="lesson-video-status" role="status" hidden>视频加载失败，请稍后重试，或下载后播放。</p><div class="lesson-video-links"><span>原创配套讲解 · 合成语音 · 按教材知识点编写</span><a href="${url('src')}" download="${lesson.id}.mp4">下载视频</a></div><div class="video-topics" aria-label="按知识点定位视频">${v.scenes.map(s=>`<button data-chapter-video-seek="${s.start}" data-chapter-video-id="${lesson.id}"><time>${chapterVideoTime(s.start)}</time><span>${escapeStudyText(s.title)}</span></button>`).join('')}</div><details class="video-transcript"><summary>查看讲解文字</summary>${v.scenes.map(s=>`<h4>${escapeStudyText(s.title)}</h4><p>${escapeStudyText(s.transcript)}</p>`).join('')}</details></section>`;
}
function persistChapterVideo(video){
 const v=CHAPTER_VIDEOS[video.dataset.chapterVideo];if(!v||!Number.isFinite(video.currentTime)||video.readyState===0)return;
 state.chapterVideoProgress=state.chapterVideoProgress||{};
 state.chapterVideoProgress[video.dataset.chapterVideo]={time:video.currentTime,completed:state.chapterVideoProgress[video.dataset.chapterVideo]?.completed||video.ended||video.currentTime>=v.duration-2,version:v.version||'',updatedAt:Date.now()};
 try{localStorage.setItem(storageKey,JSON.stringify(state))}catch{const message=video.closest('.lesson-video').querySelector('.lesson-video-status');message.textContent='本次观看进度未能保存。';message.hidden=false}
 video.dataset.savedAt=String(Date.now());
}
function pauseChapterVideos(){document.querySelectorAll('video[data-chapter-video]').forEach(video=>{if(!video.paused)video.pause();persistChapterVideo(video)})}
document.addEventListener('click',e=>{
 const open=e.target.closest('[data-open-chapter-video]');if(open){pauseChapterVideos();showTextbookLesson(open.dataset.openChapterVideo);return}
 const jump=e.target.closest('[data-chapter-video-seek]');if(!jump)return;
 const video=document.querySelector(`video[data-chapter-video="${jump.dataset.chapterVideoId}"]`);if(!video)return;
 const seek=()=>{video.currentTime=Number(jump.dataset.chapterVideoSeek);video.play().catch(()=>{});video.scrollIntoView({block:'nearest',behavior:matchMedia('(prefers-reduced-motion: reduce)').matches?'auto':'smooth'})};
 if(video.readyState>=1)seek();else{video.addEventListener('loadedmetadata',seek,{once:true});video.load()}
});
document.addEventListener('loadedmetadata',e=>{
 const video=e.target;if(!video.matches?.('video[data-chapter-video]'))return;
 const v=CHAPTER_VIDEOS[video.dataset.chapterVideo],saved=state.chapterVideoProgress?.[video.dataset.chapterVideo];
 if(saved&&saved.version===(v.version||'')&&saved.time>2&&saved.time<video.duration-2)video.currentTime=saved.time;
},true);
document.addEventListener('timeupdate',e=>{
 const video=e.target;if(!video.matches?.('video[data-chapter-video]'))return;
 const v=CHAPTER_VIDEOS[video.dataset.chapterVideo];video.closest('.lesson-video').querySelectorAll('[data-chapter-video-seek]').forEach((button,i)=>{const active=video.currentTime>=v.scenes[i].start&&video.currentTime<v.scenes[i].end;button.classList.toggle('active',active);if(active)button.setAttribute('aria-current','true');else button.removeAttribute('aria-current')});
 if(Date.now()-Number(video.dataset.savedAt||0)>15000)persistChapterVideo(video);
},true);
for(const event of ['pause','ended'])document.addEventListener(event,e=>{if(e.target.matches?.('video[data-chapter-video]'))persistChapterVideo(e.target)},true);
document.addEventListener('error',e=>{const video=e.target.matches?.('video[data-chapter-video]')?e.target:e.target.closest?.('video[data-chapter-video]');if(video)video.closest('.lesson-video').querySelector('.lesson-video-status').hidden=false},true);
document.querySelector('#modal').addEventListener('close',pauseChapterVideos);
document.addEventListener('click',e=>{if(e.target.closest('[data-practice], [data-lesson], [data-done]'))pauseChapterVideos()},true);
