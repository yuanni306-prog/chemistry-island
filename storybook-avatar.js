// One anatomical rig drives portraits, shop try-on, walking and furniture poses.
const STORY_RIG=Object.freeze({center:48,headTop:10,shoulder:70,waist:128,knee:163,ankle:190,waistWidth:30,calfWidth:11.5});
function storyPart(key,x,y,w,h,attrs=''){return paintedAvatarPart('story-'+key,x,y,w,h,attrs)}
function storyLegSlice(item,side,x,y,w,h,sourceTop=0,sourceHeight=1){
 const r=COTTAGE_ART.items['story-bottom-'+item.variant];if(!r)return '';const clip=`story-leg-${++avatarHairPaintId}`,sheet=COTTAGE_ART.sheets[r.sheet],[bx,by,bw,bh]=r.box;
 return `<svg x="${x}" y="${y}" width="${w}" height="${h}" viewBox="${bx+side*bw/2} ${by+sourceTop*bh} ${bw/2} ${bh*sourceHeight}" preserveAspectRatio="none" overflow="hidden"><defs><clipPath id="${clip}"><polygon points="${r.outline.map(p=>p.join(',')).join(' ')}"/></clipPath></defs><image href="${sheet.url}" width="${sheet.width}" height="${sheet.height}" clip-path="url(#${clip})"/></svg>`;
}
function designedPlayer(override=null,pose='stand'){
 if(!COTTAGE_ART.items['story-face-open'])return legacyDesignedPlayer(override,pose);
 const a=state.avatar,get=slot=>(override?.slot===slot?override:cottageItems.find(i=>i.id===a[slot]))||cottageItems.find(i=>i.id===`wear-${slot}-0`),top=get('top'),bottom=get('bottom'),hair=get('hair'),head=get('headwear'),accessory=get('accessory');
 const uid=++avatarHairPaintId,isSit=pose==='sit',isSleep=pose==='lie',P=artPath,E=artOval,R=artRect,layer=(name,content,extra='')=>`<g data-avatar-layer="${name}" ${extra}>${content}</g>`;
 const skinId=`story-skin-${uid}`,skinPaint=`story-skin-paint-${uid}`;
 const skinRGB=[1,3,5].map(n=>parseInt(a.skin.slice(n,n+2),16));
 const monthFilter=item=>{if(!item.month)return '';const rgb=[1,3,5].map(n=>parseInt(item.color.slice(n,n+2),16)/255);return `<filter id="story-month-${item.slot}-${uid}" color-interpolation-filters="sRGB"><feColorMatrix values="${rgb.map(c=>[.2126*c*2,.7152*c*2,.0722*c*2,0,0].join(' ')).join(' ')} 0 0 0 1 0"/></filter>`},monthPaint=item=>item.month?`filter="url(#story-month-${item.slot}-${uid})"`:'';
 const defs=`<defs><filter id="${skinId}" color-interpolation-filters="sRGB"><feComponentTransfer><feFuncR type="linear" slope="${skinRGB[0]/246}"/><feFuncG type="linear" slope="${skinRGB[1]/183}"/><feFuncB type="linear" slope="${skinRGB[2]/128}"/></feComponentTransfer></filter><linearGradient id="${skinPaint}" x1="0" x2="1"><stop stop-color="${a.skin}"/><stop offset=".48" stop-color="${a.skin}"/><stop offset="1" stop-color="${a.skin}" stop-opacity=".84"/></linearGradient>${[top,head,accessory].map(monthFilter).join('')}</defs>`;
 const gameHair=gameAvatarHair(hair.variant,a.hairColor);
 const skinAttr=`filter="url(#${skinId})"`,skinFill=`url(#${skinPaint})`,face=storyPart(isSleep?'face-sleep':isSit?'face-read':'face-open',25,10,46,66,skinAttr);
 const arms=isSit?P('M24 96Q18 116 34 132M72 96Q79 116 61 132','none',skinFill,8):P('M26 88Q20 108 20 126M70 88Q75 106 74 126','none',skinFill,8);
 const hands=isSit?storyPart('hand-lap-left',31,125,12,11,skinAttr)+storyPart('hand-lap-right',54,125,12,11,skinAttr):layer('hand-left',storyPart('hand-left',14,122,10,18,skinAttr),'class="avatar-arm-left"')+layer('hand-right',storyPart('hand-right',70,122,10,18,skinAttr),'class="avatar-arm-right"');
 const bottomWidths=[50,58,84,70,54,81,57,56,61,54,71,72],bw=bottomWidths[bottom.variant]||54,half=bw/2,calfWidth=Math.min(24,bw*.43);
 const short=[1,7].includes(bottom.variant),skirt=[2,5,8,11].includes(bottom.variant),longSkirt=bottom.variant===8;
 const legs=P(isSit?'M37 151Q33 168 35 182M59 151Q63 168 61 182':'M38 153Q33 173 35 192M58 153Q63 173 61 192','none',skinFill,11.5);
 let bottomArt='';
 if(isSit){bottomArt=storyPart('bottom-'+bottom.variant,48-bw/2,128,bw,skirt?43:28);if(!short&&!skirt)bottomArt+=storyLegSlice(bottom,0,35-calfWidth/2,150,calfWidth,34,.43,.57)+storyLegSlice(bottom,1,61-calfWidth/2,150,calfWidth,34,.43,.57)}
 else if(skirt)bottomArt=storyPart('bottom-'+bottom.variant,48-bw/2,128,bw,longSkirt?75:66);
 else bottomArt=layer('leg-left',storyLegSlice(bottom,0,48-half,128,half,short?41:67),'class="avatar-leg-left"')+layer('leg-right',storyLegSlice(bottom,1,48,128,half,short?41:67),'class="avatar-leg-right"');
 const shoes=(short||bottom.variant===4?['boot-left','boot-right']:['shoe-left','shoe-right']).map((key,n)=>layer('shoe-'+n,storyPart(key,n?52:26,isSit?178:187,18,25),`class="avatar-foot-${n?'right':'left'}"`)).join('');
 const topArt=storyPart('top-'+top.variant,[2,4,11].includes(top.variant)?7:10,70,[2,4,11].includes(top.variant)?82:76,top.variant===11?94:top.variant===4?77:65,monthPaint(top));
 const hm=[[0,0,0,0],[59,15,19,15],[59,22,17,14],[16,3,64,27],[15,7,66,28],[60,24,16,8],[13,-10,70,45],[16,8,64,27],[15,19,66,14],[60,24,15,9],[14,-1,68,36],[60,24,17,6]],am=[[0,0,0,0],[31,37,35,15],[29,64,38,31],[30,74,49,76],[21,75,54,62],[38,74,21,29],[12,132,23,35],[18,48,60,10],[30,37,37,16],[70,129,6,13],[37,75,23,29],[30,126,36,8]];
 const headArt=head.variant?paintedAvatarPart('headwear-'+head.variant,...hm[head.variant],monthPaint(head)):'',accessoryFull=accessory.variant===7?paintedAvatarPart('earring-left',25,48,4.5,8)+paintedAvatarPart('earring-right',66.5,48,4.5,8):accessory.variant?paintedAvatarPart('accessory-'+accessory.variant,...am[accessory.variant],monthPaint(accessory)):'';
 const accessoryArt=accessory.variant===4?P('M31 77l4 31M65 77l-4 31','none','#79866b',3):accessoryFull;
 return `<svg viewBox="0 0 96 216" aria-hidden="true" preserveAspectRatio="xMidYMid meet" data-avatar-rig="v4" data-avatar-pose="${pose}">${defs}${layer('hair-back',gameHair.back)}${layer('backpack',accessory.variant===4?accessoryFull:'')}${layer('skin',arms+(!isSleep?legs:''))}${!isSleep?layer('shoes',shoes)+layer('bottom',bottomArt):''}${layer('top',topArt)}${layer('face',face)}${layer('hair-front',gameHair.front)}${layer('hands',hands)}${layer('headwear',headArt)}${layer('accessory',isSleep?'':accessoryArt)}</svg>`;
}
