// Optional adapter for feature/knowledge-arena after the original conversation
// merges both branches. It replaces old twelve-unit supplements for new IDs.
function textbookArenaQuestionBank(lesson){
 const result=lesson.questions.map((q,i)=>({...q,key:`${lesson.id}:course:${i}`,topic:i,focus:i===1,courseIndex:i}));
 lesson.questions.forEach((q,i)=>{
  const wrong=q.options.find((_,n)=>n!==q.a);
  result.push({key:`${lesson.id}:review:${i}`,topic:i,focus:true,q:`有同学用“${wrong}”回答“${q.q}”。应怎样判断？`,options:[`这一判断不对。${q.why}`,'这一判断正确，与本节结论一致。','不必看组成、结构或条件，任意答案都一样。'],a:0,why:q.why});
  result.push({key:`${lesson.id}:reason:${i}`,topic:i,focus:i!==0,q:`对于“${q.q}”，为什么选择“${q.options[q.a]}”？`,options:[q.why,'物质名称和外观足以证明，不必分析其他信息。','把这一结论直接套用到所有物质和所有条件即可。'],a:0,why:q.why});
 });
 const reminder=lesson.lines.at(-1).replace(/^易错提醒：/,'');
 result.push({key:`${lesson.id}:pitfall`,topic:2,focus:true,q:`复习“${lesson.title}”时，哪条提醒符合本节内容？`,options:[reminder,'忽略结构、条件和适用范围，不会影响判断。','只背名称，不用分清观察与解释。'],a:0,why:reminder});
 return result;
}
function installTextbookArena(){
 if(typeof arenaQuestionBank!=='function')return false;
 const previous=arenaQuestionBank;
 arenaQuestionBank=function(lesson){return lesson?.id?.startsWith('t4-')?textbookArenaQuestionBank(lesson):previous(lesson)};
 if(typeof arenaTopics!=='undefined')for(const lesson of lessons)arenaTopics[lesson.id]=lesson.questions.map((q,i)=>`知识点 ${i+1} · ${q.q}`);
 return true;
}
document.addEventListener('DOMContentLoaded',installTextbookArena);
