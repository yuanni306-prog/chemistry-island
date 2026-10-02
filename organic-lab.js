// 淀粉鉴别：教学预设现象，不模拟实际浓度或动力学。
const starchSteps = [
  {title:'设置空白对照',q:'比较淀粉液和葡萄糖溶液时，哪种样品适合作空白对照？',choices:['蒸馏水','再取一份淀粉液'],a:0,why:'蒸馏水可帮助观察碘试剂本身的颜色，区分试剂颜色与淀粉显色。'},
  {title:'加入同一种试剂',q:'要比较三个样品是否含淀粉，应该怎样处理？',choices:['分别加入不同试剂','向等体积样品中加入相同少量的碘试剂'],a:1,why:'保持样品体积与试剂加入量相同，便于比较。此处使用预设教学现象。'},
  {title:'观察并记录',q:'样品 A 呈蓝黑色，B 和水对照保持碘试剂的黄棕色，哪项解释正确？',choices:['B 一定是葡萄糖','A 出现淀粉的特征显色，B 未出现该显色'],a:1,why:'在本案例中，A 为淀粉液。B 的阴性结果不能唯一证明它是葡萄糖。'},
  {title:'完成实验结论',q:'淀粉与碘的显色现象，适合用于？',choices:['在合适条件下辅助鉴别淀粉','检出所有种类的糖'],a:0,why:'这是淀粉的特征显色教学案例；不能用于检出所有糖类。'}
];
function drawStarch(){
 const step=starchSteps[labSession.step],added=labSession.step>=2;
 modal(`<span class="eyebrow">有机实验 · 糖类鉴别</span><h2>${step.title}</h2><p>目标：设置对照、观察现象，再解释证据。仅在虚拟实验台操作。</p><div class="lab-stage starch-stage">${[['A · 淀粉液','#46557c'],['B · 葡萄糖溶液','#c49349'],['空白 · 蒸馏水','#c49349']].map(([name,color])=>`<div><div class="beaker" style="--liquid:${added?color:'#d7e6df'}"></div><p>${name}</p><small>${added?(name.startsWith('A')?'蓝黑色':'黄棕色'):'未加入碘试剂'}</small></div>`).join('')}</div><div class="quiz-top"><span>${added?'已模拟加入碘试剂':'准备实验'}</span><span>${labSession.step+1} / 4</span></div><h3>${step.q}</h3><div class="options">${step.choices.map((c,i)=>`<button class="option" data-starch-step="${i}">${c}</button>`).join('')}</div><div id="lab-feedback" aria-live="polite"></div>`);
}
function answerStarch(n){
 if(labSession?.id!=='starch')return;
 const step=starchSteps[labSession.step];
 if(n!==step.a){$('#lab-feedback').innerHTML=`<div class="feedback">${step.why} 再想一想。</div>`;return}
 document.querySelectorAll('[data-starch-step]').forEach(b=>b.disabled=true);
 $('#lab-feedback').innerHTML=`<div class="feedback">${step.why}</div><button class="btn" style="margin-top:15px" data-labnext>${labSession.step===3?'完成实验':'下一步 →'}</button>`;
}
