let paintedSpriteId=0;
const PAINTED_ROOM_URL='assets/cottage/room.png';
// coverFrom (0..1) keeps only the part of the sprite below that fraction of its height: the blanket of a bed drawn in front of a lying player.
function paintedSprite(item,coverFrom=0){
 if(item.id==='rug')return starterRugArt();
 const record=typeof COTTAGE_ART!=='undefined'?COTTAGE_ART.items[item.id]||COTTAGE_ART.items[`${item.base||item.id}-${item.variant||0}`]:null;
 if(!record)return null;
 const sheet=COTTAGE_ART.sheets[record.sheet],box=record.box;
 const clip=`painted-clip-${++paintedSpriteId}`;
 // Rugs are the largest sprites and the smallest source art; a mild sharpen keeps the weave readable when upscaled.
 const sharpen=item.base==='rug'?`<filter id="${clip}-sharp"><feConvolveMatrix order="3" kernelMatrix="0 -0.35 0 -0.35 2.4 -0.35 0 -0.35 0" preserveAlpha="true"/></filter>`:'';
 const cover=coverFrom?`<clipPath id="${clip}-cover"><rect x="${box[0]}" y="${box[1]+box[3]*coverFrom}" width="${box[2]}" height="${box[3]*(1-coverFrom)}"/></clipPath>`:'';
 const image=`<image ${coverFrom?`clip-path="url(#${clip}-cover)"`:`clip-path="url(#${clip})"`} ${sharpen?`filter="url(#${clip}-sharp)"`:''} href="${sheet.url}" x="0" y="0" width="${sheet.width}" height="${sheet.height}"/>`;
 return `<svg class="painted-art" data-painted-item="${item.id}" viewBox="${box.join(' ')}" preserveAspectRatio="xMidYMax meet" aria-hidden="true"><defs><clipPath id="${clip}"><polygon points="${record.outline.map(p=>p.join(',')).join(' ')}"/></clipPath>${cover}${sharpen}</defs>${coverFrom?`<g clip-path="url(#${clip})">${image}</g>`:image}</svg>`;
}
// The starter rug is the one sprite drawn as vector art: it is displayed at more than twice the width of a painted rug's source, so it is drawn in the atlas idiom (cinnamon contour, wobbled edges, paper grain, gouache wash) with the furniture's slight top-down view, a trapezoid whose top edge is 93% of the bottom. Stripe widths and fringe come from a fixed seed so every render is identical.
function starterRugArt(){
 const id=`rug-${++paintedSpriteId}`,rnd=mulberry32(17),ink='#8a5c3b',greens=['#8c9b70','#a3ae88','#7a8a5f'];
 const q=(u,w)=>[150+(u-.5)*256*(.93+.07*w),14+w*172],f=p=>p.map(n=>n.toFixed(1)).join(' ');
 const P=(pts,attrs)=>`<polygon points="${pts.map(p=>f(q(...p)).replace(' ',',')).join(' ')}" ${attrs}/>`,band=(u0,u1,w0,w1,attrs)=>P([[u0,w0],[u1,w0],[u1,w1],[u0,w1]],attrs),rect=[[0,0],[1,0],[1,1],[0,1]];
 const line=(x,y,dx,dy,color,width,opacity=1)=>`<path d="M${f([x,y])}l${f([dx,dy])}" stroke="${color}" stroke-width="${width}" stroke-opacity="${opacity}" stroke-linecap="round"/>`;
 let u=0,k=0,stripes='';while(u<1){const green=k%2===0,u1=Math.min(1,u+(green?.045+rnd()*.05:.02+rnd()*.045));stripes+=band(u,u1,0,1,`fill="${green?greens[(k>>1)%3]:rnd()<.5?'#efe3c6':'#ddd0ad'}"`);u=u1;k++}
 const fringe=[-1,1].flatMap(side=>Array.from({length:20},(_,i)=>{const [x,y]=q(side<0?0:1,.03+(i+.2+rnd()*.6)/20*.94),len=(7+rnd()*4)*side,tilt=(rnd()-.5)*5;return line(x,y,len,tilt,'#dac7a0',2.8)+line(x,y+.8,len*.9,tilt,ink,.6,.5)})).join('');
 const rug=fringe+P(rect,'fill="#efe3c6"')+stripes+P(rect,`fill="url(#${id}-weave)"`)+band(0,1,.985,1,'fill="#000" opacity=".16"')+P([[.02,.03],[.98,.03],[.98,.97],[.02,.97]],`fill="none" stroke="${ink}" stroke-width=".8" stroke-opacity=".35" stroke-dasharray="3 2.5"`)+P(rect,`fill="none" stroke="${ink}" stroke-width="1.5" stroke-opacity=".7"`);
 return `<svg class="painted-art" data-painted-item="rug" viewBox="0 0 300 200" preserveAspectRatio="xMidYMax meet" aria-hidden="true"><defs><pattern id="${id}-weave" width="6" height="4" patternUnits="userSpaceOnUse"><path d="M.5 1h2M3.5 3h2" stroke="#3b2a17" stroke-opacity=".13" stroke-width=".8" stroke-linecap="round"/></pattern><filter id="${id}-paint" x="-5%" y="-6%" width="110%" height="112%"><feTurbulence type="fractalNoise" baseFrequency=".04" numOctaves="2" seed="3" result="wave"/><feDisplacementMap in="SourceGraphic" in2="wave" scale="2.4" xChannelSelector="R" yChannelSelector="G" result="shape"/><feTurbulence type="fractalNoise" baseFrequency=".9" numOctaves="2" seed="7" result="paper"/><feColorMatrix in="paper" type="saturate" values="0"/><feComponentTransfer result="grain"><feFuncA type="linear" slope=".09"/></feComponentTransfer><feComposite in="grain" in2="shape" operator="in" result="grain"/><feBlend in="shape" in2="grain" mode="soft-light" result="papered"/><feTurbulence type="fractalNoise" baseFrequency=".05" numOctaves="3" seed="11" result="wash"/><feColorMatrix in="wash" type="saturate" values="0"/><feComponentTransfer result="wash"><feFuncA type="linear" slope=".2"/></feComponentTransfer><feComposite in="wash" in2="shape" operator="in" result="wash"/><feBlend in="papered" in2="wash" mode="multiply"/></filter></defs><g filter="url(#${id}-paint)">${rug}</g></svg>`;
}
// Each style is its own 1536×1024 painting, drawn to the default room's camera. `wall` is the fraction of the picture's height at which the floor starts (the bottom of the baseboard), read off enlarged strips of each painting; the split wall/floor mapping puts that line on the playable grid's wall line.
const PAINTED_ROOMS={
 'theme-cream':{url:'assets/cottage/room-cream.jpg',wall:.456,label:'奶油拱窗 · 亚麻半帘 · 人字木地板'},
 'theme-rose':{url:'assets/cottage/room-rose.jpg',wall:.472,label:'莓果花墙 · 格纹窗帘 · 陶砖'},
 'theme-sea':{url:'assets/cottage/room-sea.jpg',wall:.427,label:'海景舷窗 · 百叶窗 · 漂木'},
 'theme-forest':{url:'assets/cottage/room-forest.jpg',wall:.43,label:'原木墙 · 林间窗景 · 松木地板'},
 'theme-moon':{url:'assets/cottage/room-moon.jpg',wall:.422,label:'月夜窗景 · 壁灯 · 橡木地板'},
 'space':{url:'assets/cottage/room-space.jpg',wall:.458,label:'阁楼星空窗 · 串灯 · 胡桃木地板'}
};
function paintedRoomArt(theme,preview=false){const record=PAINTED_ROOMS[theme?.id]||(theme?.month?PAINTED_ROOMS[['theme-moon','theme-rose','theme-forest','theme-sea','theme-forest','theme-sea','theme-cream','space','theme-cream','theme-forest','theme-cream','theme-moon'][Number(theme.month.slice(5))-1]]:null);if(!record)return `<img class="painted-room-image" src="${PAINTED_ROOM_URL}" alt="" draggable="false">`;const wall=1024*record.wall,image=`<image href="${record.url}" width="1536" height="1024"/>`;return `<svg class="painted-room-image" data-room-style="${theme.id}" viewBox="0 0 1200 800" preserveAspectRatio="none" aria-hidden="true"><svg x="0" y="0" width="1200" height="336" viewBox="0 0 1536 ${wall}" preserveAspectRatio="none" overflow="hidden">${image}</svg><svg x="0" y="336" width="1200" height="464" viewBox="0 ${wall} 1536 ${1024-wall}" preserveAspectRatio="none" overflow="hidden">${image}</svg></svg>`}
function paintedRoom(){return `<div class="painted-room-background" aria-hidden="true">${paintedRoomArt(activeCottageTheme())}</div>`}
function paintedThemePreview(item){return `<div class="painted-theme-preview" title="${PAINTED_ROOMS[item.id]?.label||item.name}">${paintedRoomArt(item,true)}</div>`}

// A walking painting covers this multiple of the sitting painting's silhouette area, which keeps the head the same size when a pet stands up and turns. Tuned by eye on a contact sheet of all 19 pets in their four paintings.
const PET_WALK_AREA={front:1,side:1.2,back:.95};
function paintedPetSprite(id,action='idle',view=''){
 const walking=action==='idle'&&view,key=walking?`animal-walk-${view}-${id}`:`animal-${action==='sleep'?'sleep':'awake'}-${id}`,record=typeof COTTAGE_ART!=='undefined'?COTTAGE_ART.items[key]:null;if(!record)return null;
 const sheet=COTTAGE_ART.sheets[record.sheet],clip=`pet-art-${++paintedSpriteId}`,box=record.box;
 // Walking: the legs are strips of the same painting below the belly line, each in its own group so it can shear from that line while staying joined to the body; the body is everything else.
 if(walking){const sit=COTTAGE_ART.items[`animal-awake-${id}`],scale=Math.min(70/sit.box[2],57/sit.box[3])*Math.sqrt(PET_WALK_AREA[view]*sit.area/record.area),[bx,by,bw,bh]=box,w=bw*scale,h=bh*scale,{top,strips}=record.legs,floor=by+bh+20,art=`<use href="#${clip}-art"/>`;
  return `<svg viewBox="0 0 80 68" class="pet-painted pet-action-idle" data-pet-art="${key}" data-pet-view="${view}" aria-hidden="true"><g class="pet-painted-body"><svg x="${(40-w/2).toFixed(2)}" y="${(62-h).toFixed(2)}" width="${w.toFixed(2)}" height="${h.toFixed(2)}" viewBox="${box.join(' ')}" overflow="visible"><defs><clipPath id="${clip}"><polygon points="${record.outline.map(p=>p.join(',')).join(' ')}"/></clipPath><image id="${clip}-art" href="${sheet.url}" width="${sheet.width}" height="${sheet.height}" clip-path="url(#${clip})"/><clipPath id="${clip}-body"><path clip-rule="evenodd" d="M${bx-20} ${by-20}h${bw+40}V${floor}h${-bw-40}Z${strips.map(([x0,x1])=>`M${x0} ${top+2}H${x1}V${floor}H${x0}Z`).join('')}"/></clipPath>${strips.map(([x0,x1],n)=>`<clipPath id="${clip}-leg${n}"><rect x="${x0}" y="${top}" width="${x1-x0}" height="${floor-top}"/></clipPath>`).join('')}</defs>${strips.map((_,n)=>`<g class="pet-leg" clip-path="url(#${clip}-leg${n})" style="transform-origin:0 ${top}px">${art}</g>`).join('')}<g clip-path="url(#${clip}-body)">${art}</g></svg></g></svg>`}
 let extras='';if(action==='eat')extras='<ellipse cx="53" cy="60" rx="17" ry="5" fill="#bdcabe" stroke="#8d9e8a"/><ellipse cx="53" cy="57" rx="15" ry="4" fill="#826a4d"/><path d="M44 57l3-1m6 2 3-1m4 0 2-1" stroke="#d9b782" stroke-width="2"/>';
 if(action==='play')extras='<circle cx="65" cy="57" r="8" fill="#c99c8e" stroke="#936e5c"/><path d="M60 51l10 11" stroke="#ecd5b1" stroke-width="2"/>';
 if(action==='bath')extras='<path d="M8 50h64l-5 14H13Z" fill="#afc5bd" stroke="#829f94"/>'+[14,25,38,51,64].map((x,n)=>`<circle cx="${x}" cy="${48+n%2*5}" r="7" fill="#f1f5e6" stroke="#c3d7c9"/>`).join('');
 if(action==='sleep')extras='<path d="M62 10h5l-5 6h5m3-15h7l-7 9h7" fill="none" stroke="#a69b8a" stroke-width="1.4" stroke-linecap="round"/>';
 const h=action==='sleep'?44:57;
 return `<svg viewBox="0 0 80 68" class="pet-painted pet-action-${action}" data-pet-art="${key}" aria-hidden="true"><g class="pet-painted-body"><svg x="5" y="${62-h}" width="70" height="${h}" viewBox="${box.join(' ')}" preserveAspectRatio="xMidYMax meet" overflow="hidden"><defs><clipPath id="${clip}"><polygon points="${record.outline.map(p=>p.join(',')).join(' ')}"/></clipPath></defs><image href="${sheet.url}" width="${sheet.width}" height="${sheet.height}" clip-path="url(#${clip})"/></svg></g>${extras}</svg>`;
}
