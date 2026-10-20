// Every garment shares these anatomical anchors; previews and room use one SVG.
const PLAYER_RIG=Object.freeze({center:48,headY:38,neckY:58,shoulderY:68,waistY:104,hipY:110,ankleY:145});
let avatarHairPaintId=0;
function avatarHair(variant,color){
 const P=artPath,E=artOval,R=artRect;let back='',front='';
 const crown='M29 39V30Q29 12 48 13q20 0 20 18v12l-7-12H36z';
 const backs=[
  P(crown,color),
  P('M27 60V32Q27 11 48 12q23 0 23 22v26q-8 7-13-3H39q-5 10-12 3z',color),
  P('M25 94V33Q26 9 48 12q24-2 25 22l2 62q-10 8-19-2H41q-11 8-16 0z',color),
  P(crown,color)+P('M31 52q-8 18-5 40M65 52q8 18 5 40','none',color,10)+E(27,96,6,8,color)+E(69,96,6,8,color),
  E(49,12,11,10,color)+P(crown,color),
  P('M26 66Q18 53 25 42q-8-19 4-26 12-12 27-3 19-3 20 16 8 11-1 20 7 15-3 20l-13-8H40z',color),
  P('M28 44V28Q30 10 49 14q22 0 20 24l-10-10H36z',color),
  P('M28 42V30Q28 13 48 13q24 0 21 26l-9-12H36z',color)+P('M65 22q31-9 16 41-13-2-10-23z',color),
  P(crown,color)+P('M67 39q25 6 12 35-19 8-17-5 12-3 6-18z',color),
  P(crown,color)+E(27,14,9,9,color)+E(68,14,9,9,color),
  P('M27 78V33Q25 10 48 11q24 1 24 23v44q-9 10-15 0H40q-9 10-13 0z',color),
  P('M27 83q-11-7-2-18-11-10-2-21-7-22 9-29 18-9 31 1 19 1 13 24 10 14 1 24 11 12-2 24l-14-6H42z',color)
 ];
 front=[
  P('M30 31Q38 12 57 20l10 12-10-2-6-5-12 10-7 7z',color),
  P('M29 32q8-17 20-15 12-2 20 15l-13 4-2-12-4 13-7-8-10 10z',color),
  P('M29 33q7-19 21-16 17 2 19 17l-15-9-15 12-7 7z',color),
  P('M29 33q17-23 39 0l-10 3-6-10-5 10-10-3-6 7z',color),
  P('M30 32q16-17 37 0l-15-7-16 12z',color),
  P('M28 35q-3-18 13-16 7-10 14-2 15-1 14 18l-9-6-6 7-7-8-10 8z',color),
  P('M29 28q8-19 28-10l12 13-14 2 1-8-12 10-3-8-10 11z',color),
  P('M30 32q17-20 38 0l-10 5-6-9-7 8-9-5-5 8z',color),
  P('M30 32q16-20 38 0l-14-7-15 11-8 4z',color),
  P('M30 32q15-18 37 0l-10 4-6-9-7 8-8-5-5 8z',color),
  P('M29 32q18-20 40 0l-8 4-2-11-5 10-7-1-3-11-3 12-9-1z',color),
  P('M29 35q-3-19 12-17 10-7 18 2 14 0 11 17l-9-6-6 5-8-8-9 10z',color)
 ][variant];
 // An opaque crown sits in front of the face, so skin cannot show through the scalp.
 const cap=P('M29 33C27 20 35 11 48 12C64 11 71 22 68 34L64 30Q48 20 32 34Z',color);
 const mix=(target,amount)=>'#'+[1,3,5].map(n=>Math.round(parseInt(color.slice(n,n+2),16)*(1-amount)+target*amount).toString(16).padStart(2,'0')).join('');
 const paint=`hair-paint-${++avatarHairPaintId}`;
 const defs=`<defs><linearGradient id="${paint}" gradientUnits="userSpaceOnUse" x1="27" y1="14" x2="72" y2="88"><stop stop-color="${mix(255,.16)}"/><stop offset=".38" stop-color="${color}"/><stop offset="1" stop-color="${mix(0,.22)}"/></linearGradient></defs>`;
 const shade=svg=>svg.replaceAll(`fill="${color}"`,`fill="url(#${paint})"`).replaceAll(`stroke="${color}"`,`stroke="url(#${paint})"`);
 const strands=P('M33 24Q40 16 52 18M36 25Q43 19 54 21','none','#ffffff26',1.2)+P('M61 22q5 5 5 10','none','#00000018',1.1);
 let lengths='';
 if([1,2,10,11].includes(variant))lengths=P('M28 44q-1 14 1 27M70 44q2 15 0 28','none','#ffffff18',1.3)+P('M66 57v18','none','#00000016',1.1);
 if([7,8].includes(variant))lengths=P('M73 32q6 12 0 23','none','#ffffff22',1.3);
 return {back:defs+shade(backs[variant]||backs[0])+lengths,front:shade(cap+(front||''))+strands};
}
function avatarTop(item){
 const P=artPath,R=artRect,E=artOval,c=item.color||'#83a49a',seam='#5e615538';
 const shirt='M35 64h26l12 16-10 6-2 20H35l-2-20-10-6z';
 const drawings=[
  P(shirt,c)+P('M41 65q7 9 14 0','none','#e9eee5',2),
  P('M34 64h28l12 18-7 19-7-3v11H35V98l-6 3-7-19z',c)+P('M38 64l10 14 10-14M48 79v29','none','#af997c',1.5)+[85,94,103].map(y=>E(50,y,1.4,1.4,'#967e65')).join(''),
  P('M33 63q15-13 30 0l12 16-8 27H29l-8-27z',c)+P('M37 65q11 10 22 0M36 94h24','none','#f0c8cb',2)+P('M43 71v14M54 71v14','none','#eee5dc',1.5),
  P('M35 64h26l12 17-10 5-2 20H35l-2-20-10-5z',c)+P('M35 76h28M35 85h28M35 95h27','none','#f0eee6',3),
  P(shirt,'#efe5d1')+P('M35 64h5v21h16V64h5v43H35z',c)+R(41,87,14,13,'#b8c29d',2),
  P('M34 64h28l13 23-11 3 3 32H30l3-32-11-3z',c)+P('M39 64l9 15 9-15M48 80v41M34 101h9M54 101h9','none','#b7c7bf',1.5),
  P('M33 64h30l12 24-12 3 2 18H31l2-18-12-3z',c)+P('M39 66l9 15 9-15M48 81v27M34 96h9M54 96h9','none','#ebe3d4',2)+E(50,94,1.5,1.5,'#ccc0a7'),
  P('M35 64h26l10 17-9 6-1 20H35l-1-20-9-6z',c)+P('M36 65l12 11 12-11M48 77v29','none','#b8c8c2',1.5)+R(36,83,9,9,'#ffffff40',1),
  P('M32 64h32l14 22-12 7-4 11H34l-5-11-11-7z',c)+P('M36 103h25M33 68l-9 17M62 68l10 17','none','#c6b89e',2)+R(35,104,27,5,'#cec0a8',2),
  P('M35 65h26l11 17-10 6v19H34V88l-10-6z',c)+P('M36 66l12 11 12-11M42 81h12','none','#f0e7d3',2)+P('M44 75l4 9 4-9','none','#af6d77',3),
  P(shirt,'#ede7db')+P('M35 64l13 12 13-12v42H35z',c)+P('M48 76v29M39 96h5M53 96h5','none','#dacdae',1.5),
  P('M34 63h28l12 25-9 4 5 36H27l5-36-10-4z',c)+P('M38 64l10 14 10-14M48 79v47M31 106h11M55 106h10','none','#d7c4a5',2)+R(30,98,36,3,'#9d8269',1)
 ];return drawings[item.variant]||drawings[0];
}
function avatarBottom(item){const P=artPath,R=artRect,c=item.color||'#6f7e87';
 const pants='M34 104h28l2 40H51l-3-25-3 25H32z';
 const drawings=[P(pants,c),P('M34 104h28v22H34z',c)+P('M36 123h10M51 123h10','none','#ddcbb0',2),P('M34 104h28l12 28H23z',c)+P('M35 109h27','none','#e7b4be',1.5),P('M34 104h28l7 40H52l-4-28-4 28H27z',c)+P('M38 112l-2 28M58 112l3 28','none','#bed0d5',1),P(pants,c)+R(32,117,9,10,'#b7c19b',2)+R(57,117,9,10,'#b7c19b',2),P('M34 104h28l16 30H19z',c)+P('M38 108l-8 23M44 108l-3 23M52 108l3 23M58 108l9 23','none','#d1cce1',1.5),P('M34 104h28l4 40H52l-4-27-4 27H30z',c)+P('M36 110l-2 30M60 110l3 30','none','#e4e0d2',1),P('M34 104h28v23H34z',c)+P('M48 111v15M35 120h10M52 120h9','none','#6e6a6445',1),P('M34 104h28l15 39H20z',c)+P('M39 109l-8 26M59 109l6 26','none','#ffffff30',1.5),P('M34 104h28l2 40H51l-3-25-3 25H32z',c)+P('M48 107v11M34 134h10M53 134h10','none','#e5d7c4',2),P('M34 104h28l6 40H53l-5-28-5 28H29z',c)+R(33,104,31,4,'#c6c3b2',1),P('M34 104h28l9 29H26z',c)+P('M36 110q12 9 24 0M30 130h37','none','#d8c5a7',2)];return drawings[item.variant]||drawings[0];}
function avatarHeadwear(item){const P=artPath,E=artOval,R=artRect,c=item.color||'#b7a78b';const headX=48;
 const drawings=['',P('M59 24l-7-7v13zM62 24l8-7v13z',c)+E(60,24,2,3,c),Array.from({length:5},(_,n)=>E(64+Math.cos(n*1.26)*4,26+Math.sin(n*1.26)*4,3,3,c)).join('')+E(64,26,2,2,'#efd698'),E(headX,21,22,9,c)+R(28,24,37,3,c,2),P('M28 24q20-10 40 0','none',c,3)+P('M32 21l3-5M44 19l2-5M58 20l5-4','none',c,4),P('M65 18l2 5 6 1-4 4 1 5-5-2-4 2 1-5-4-4 6-1z',c),P('M28 22L48 2l20 20z',c)+R(25,22,46,4,c,2),P('M29 27q19-13 38 0','none',c,6),P('M27 24h42v8H27z',c)+E(69,28,4,4,c),R(59,24,12,3,c,1)+R(58,28,11,3,'#c5ae80',1),E(44,18,21,6,c)+R(29,18,36,10,c,3)+P('M26 29h48','none',c,4),Array.from({length:5},(_,n)=>E(64+n*.4,23+n*3,2,2,c)).join('')];return drawings[item.variant]||'';}
function avatarAccessory(item){const P=artPath,E=artOval,R=artRect,c=item.color||'#b7a78b';const drawings=['',`<g fill="none" stroke="${c}" stroke-width="1.8"><ellipse cx="42" cy="40" rx="6" ry="5"/><ellipse cx="55" cy="40" rx="6" ry="5"/><path d="M48 40h1"/></g>`,P('M35 60q13 9 26 0v7H35z',c)+R(57,66,7,22,c,2),P('M35 69l27 44','none',c,2.5)+R(58,104,18,19,c,3),R(24,72,8,30,c,4)+R(64,72,8,30,c,4)+P('M34 69v27M62 69v27','none',c,2),P('M38 69q10 18 20 0','none',c,1.5)+E(48,79,3,4,c),R(17,106,15,21,c,2)+P('M20 108v-9q4-6 9 0v9','none',c,2),E(29,49,1.8,3,c)+E(67,49,1.8,3,c),P('M33 34h14v11H33zM51 34h14v11H51z',c)+P('M47 38h4','none',c,2),R(68,96,4,6,c,1)+R(68,101,4,10,c,1),P('M37 69q11 24 22 0','none',c,1.5)+R(45,83,6,7,c,1),R(32,103,33,4,c,1)+R(46,102,7,6,'#d5bd8c',1)];return drawings[item.variant]||'';}
// Raster clothes and hair share this single rig in the room, wardrobe and portrait.
function paintedAvatarPart(key,x,y,w,h,extra=''){
 const record=COTTAGE_ART.items[key];if(!record)return '';const sheet=COTTAGE_ART.sheets[record.sheet],clip=`avatar-part-${++avatarHairPaintId}`;
 const holeId=`avatar-hole-${++avatarHairPaintId}`;return `<svg x="${x}" y="${y}" width="${w}" height="${h}" viewBox="${record.box.join(' ')}" preserveAspectRatio="none" overflow="hidden" ${extra}><defs><clipPath id="${clip}">${(record.paths||[record.outline]).map(points=>`<polygon points="${points.map(p=>p.join(',')).join(' ')}"/>`).join('')}</clipPath>${record.hole?`<mask id="${holeId}" maskUnits="userSpaceOnUse" x="${record.box[0]}" y="${record.box[1]}" width="${record.box[2]}" height="${record.box[3]}"><rect x="${record.box[0]}" y="${record.box[1]}" width="${record.box[2]}" height="${record.box[3]}" fill="white"/><path d="${record.hole}" fill="black"/></mask>`:''}</defs><image href="${sheet.url}" width="${sheet.width}" height="${sheet.height}" clip-path="url(#${clip})" ${record.hole?`mask="url(#${holeId})"`:''}/></svg>`;
}
function legacyDesignedPlayer(override=null,pose='stand'){
 const a=state.avatar,get=slot=>(override?.slot===slot?override:cottageItems.find(i=>i.id===a[slot]))||cottageItems.find(i=>i.id===`wear-${slot}-0`),top=get('top'),bottom=get('bottom'),hair=get('hair'),head=get('headwear'),accessory=get('accessory'),P=artPath,E=artOval,R=artRect;
 const uid=++avatarHairPaintId,tint=`avatar-tint-${uid}`,skin=`avatar-skin-${uid}`,grain=`avatar-grain-${uid}`,fringe=`avatar-fringe-${uid}`;
 const rgb=[1,3,5].map(n=>parseInt(a.hairColor.slice(n,n+2),16)/255),matrix=rgb.map(c=>[.2126*c*2,.7152*c*2,.0722*c*2,0,0].join(' ')).join(' ')+' 0 0 0 1 0';
 const monthlyFilter=item=>{if(!item.month)return '';const rgb=[1,3,5].map(n=>parseInt(item.color.slice(n,n+2),16)/255),values=rgb.map(c=>[.2126*c*2,.7152*c*2,.0722*c*2,0,0].join(' ')).join(' ')+' 0 0 0 1 0';return `<filter id="month-${item.slot}-${uid}" color-interpolation-filters="sRGB"><feColorMatrix type="matrix" values="${values}"/></filter>`},monthPaint=item=>item.month?`filter="url(#month-${item.slot}-${uid})"`:'';
 const defs=`<defs>${[top,head,accessory].map(monthlyFilter).join('')}<filter id="${tint}" color-interpolation-filters="sRGB"><feColorMatrix type="matrix" values="${matrix}"/></filter><radialGradient id="${skin}" cx="38%" cy="28%" r="75%"><stop stop-color="${a.skin}"/><stop offset="1" stop-color="${a.skin}" stop-opacity=".84"/></radialGradient><filter id="${grain}" x="-8%" y="-8%" width="116%" height="116%"><feTurbulence type="fractalNoise" baseFrequency=".65" numOctaves="3" seed="12" result="paper"/><feColorMatrix in="paper" type="saturate" values="0" result="mono"/><feComponentTransfer in="mono" result="faint"><feFuncA type="linear" slope=".07"/></feComponentTransfer><feComposite in="faint" in2="SourceGraphic" operator="in" result="ink"/><feBlend in="SourceGraphic" in2="ink" mode="multiply"/></filter><clipPath id="${fringe}"><path fill-rule="evenodd" clip-rule="evenodd" d="M0-10H100V160H0Z M30 38Q48 29 66 38V49Q64 61 48 62Q32 61 30 49Z"/></clipPath></defs>`;
 const hairMetrics=[[14,6,68,57],[12,6,72,72],[14,5,68,111],[10,7,76,101],[14,-2,68,86],[10,8,76,74],[14,5,68,57],[15,0,77,110],[13,6,71,113],[8,-1,80,86],[10,8,76,85],[10,6,76,111]],m=hairMetrics[hair.variant]||hairMetrics[0];
 const hairRecord=COTTAGE_ART.items['hair-'+hair.variant],hairCut=[.55,.60,.42,.44,.63,.52,.54,.52,.42,.61,.52,.44][hair.variant]||.5;
 const makeHair=()=>{if(!hairRecord)return '';const [bx,by,bw,bh]=hairRecord.box,cut=bh*hairCut,asset=paintedAvatarPart('hair-'+hair.variant,0,0,bw,bh),topHeight=34-m[1];return `<g filter="url(#${tint})"><svg x="${m[0]}" y="${m[1]}" width="${m[2]}" height="${topHeight}" viewBox="0 0 ${bw} ${cut}" preserveAspectRatio="none" overflow="hidden">${asset}</svg><svg x="${m[0]}" y="34" width="${m[2]}" height="${m[1]+m[3]-34}" viewBox="0 ${cut} ${bw} ${bh-cut}" preserveAspectRatio="none" overflow="hidden">${paintedAvatarPart('hair-'+hair.variant,0,0,bw,bh)}</svg></g>`};
 const hairArt=makeHair(),layer=(name,content)=>`<g data-avatar-layer="${name}">${content}</g>`;
 const isSit=pose==='sit',isSleep=pose==='lie',skinPaint=`url(#${skin})`;
 const skinArt=R(40,55,16,15,skinPaint,5)+P('M29 80l-5 23M67 80l5 23','none',a.skin,9)+E(24,103,5,5,a.skin)+E(72,103,5,5,a.skin)+(!isSit?P('M39 120v25M57 120v25','none',a.skin,9):'')+E(48,39,20,23,skinPaint)+E(27,43,4,6,a.skin)+E(69,43,4,6,a.skin)+P('M32 50q15 16 32 0','none','#b78a7022',1.4);
 const face=(isSleep?P('M36 43q4 3 8 0M53 43q4 3 8 0','none','#6c5144',1.8):E(40,42,2.2,2.8,'#58463b')+E(57,42,2.2,2.8,'#58463b')+E(39.5,41.3,.7,.9,'#fff8e7')+E(56.5,41.3,.7,.9,'#fff8e7'))+E(34,49,4.5,2.5,'#d9867a55')+E(63,49,4.5,2.5,'#d9867a55')+E(48.5,48,1.2,.8,'#b77d6d')+P('M45 53q3 2.5 6 0','none','#ae786e',1.2);
 const topLong=[5,11].includes(top.variant),bottomShort=[1,7].includes(bottom.variant),bottomSkirt=[2,5,8,11].includes(bottom.variant),tw=[0,3].includes(top.variant)?57:63;
 const topArt=paintedAvatarPart('top-'+top.variant,48-tw/2,64,tw,topLong?62:45,monthPaint(top))||avatarTop(top),bottomArt=paintedAvatarPart('bottom-'+bottom.variant,bottomSkirt?24:32,104,bottomSkirt?48:32,isSit?22:bottomShort?23:41)||avatarBottom(bottom);
 const shoes=isSit?P('M34 126l-5 9M62 126l5 9','none',a.skin,7)+R(23,132,14,7,'#7e6955',3)+R(60,132,14,7,'#7e6955',3):R(29,145,16,8,'#7d6957',4)+R(51,145,17,8,'#7d6957',4)+P('M32 148h9M54 148h10','none','#dac5a0',1.4);
 const headMetrics=[[0,0,0,0],[59,17,19,15],[59,22,17,14],[16,5,64,27],[15,8,66,28],[60,24,16,8],[13,-8,70,45],[16,9,64,27],[15,19,66,14],[60,24,15,9],[14,0,68,36],[60,24,17,6]],accessoryMetrics=[[0,0,0,0],[31,37,35,15],[29,58,38,29],[30,66,49,58],[21,67,54,49],[38,66,21,23],[12,97,23,30],[18,45,60,10],[30,37,37,16],[69,98,6,13],[37,67,23,24],[30,102,36,8]];
 const headArt=head.variant?(paintedAvatarPart('headwear-'+head.variant,...headMetrics[head.variant],monthPaint(head))||avatarHeadwear(head)):'',accessoryFull=accessory.variant===7?paintedAvatarPart('earring-left',25,47,4.5,8)+paintedAvatarPart('earring-right',66.5,47,4.5,8):accessory.variant?(paintedAvatarPart('accessory-'+accessory.variant,...accessoryMetrics[accessory.variant],monthPaint(accessory))||avatarAccessory(accessory)):'',accessoryArt=accessory.variant===4?P('M31 69l4 26M65 69l-4 26','none','#79866b',3):accessoryFull;
 const backpack=accessory.variant===4?accessoryFull:'';
 return `<svg viewBox="0 0 96 160" aria-hidden="true" preserveAspectRatio="xMidYMid meet" data-avatar-rig="v3" data-avatar-pose="${pose}">${defs}${layer('hair-back',hairArt)}${layer('backpack',backpack)}<g filter="url(#${grain})">${layer('skin',skinArt)}${layer('shoes',isSleep?'':shoes)}</g>${layer('bottom',isSleep?'':bottomArt)}${layer('top',topArt)}<g filter="url(#${grain})">${layer('face',face)}</g>${layer('hair-front',hair.variant===11?`<g clip-path="url(#${fringe})">${makeHair()}</g>`:makeHair())}<g filter="url(#${grain})">${layer('headwear',headArt)}${layer('accessory',accessoryArt)}</g></svg>`;
}
