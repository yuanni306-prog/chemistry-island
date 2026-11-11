// Hair is cut from the painted wig atlases (hair.png and storybook-hair-v2.png) and placed with one uniform scale per style. fit is [x, y, width] of the wig's atlas box in rig units, measured against the storybook head: the crown sits above the skull (y 10), bangs end at the brow (y 36) and the face opening is centred on the eyes and clears them; re-measure after replacing a wig atlas. Long loose styles are tucked: below the jaw their lengths are drawn behind the body, and the gap behind the neck is filled with the wig's own side sections shifted inward, underneath the untouched copy. Styles whose painted sides fall over the cheeks are cleared: a window traced just inside the face contour, from the lash line to the chin, is masked out of the front copy so the face reads in front of the hair.
const GAME_HAIR_STYLES=[
 {name:'轻盈侧分短发',art:'story-hair-0',fit:[20.8,4.5,57.3]},
 {name:'圆润法式波波头',art:'hair-1',fit:[20.4,5.6,60.4]},
 {name:'月光柔顺长发',art:'story-hair-2',fit:[16,3.8,71.5],tuck:true,clearFace:true},
 {name:'田园双麻花辫',art:'hair-3',fit:[19.1,5.4,62.4]},
 {name:'松松高丸子头',art:'hair-4',fit:[21.9,-4,56.2]},
 {name:'云朵齐肩波浪发',art:'story-hair-5',fit:[13.2,6,73.6],clearFace:true},
 {name:'清爽蓬松短发',art:'hair-6',fit:[22,5.8,54]},
 {name:'轻盈高马尾',art:'hair-7',fit:[29.1,1,59.9]},
 {name:'花园侧麻花辫',art:'story-hair-8',fit:[19.4,7,58.1]},
 {name:'俏皮双丸子头',art:'hair-9',fit:[21.4,3.8,58.7]},
 {name:'慵懒锁骨层次发',art:'hair-10',fit:[15.6,6,69.2],clearFace:true},
 {name:'森林柔软长波浪',art:'story-hair-11',fit:[7.5,7.5,85.5],tuck:true,clearFace:true}
];
// The wig's luminance is remapped onto the chosen colour: tones below the atlas mean (.34) scale down to the colour, lighter tones lift toward white, so highlights and shadows survive any hair colour; alpha below .25 (edge haze) is dropped.
function gameAvatarHair(variant,color){
 const style=GAME_HAIR_STYLES[variant],box=COTTAGE_ART.items[style.art].box,[x,y,w]=style.fit,h=w*box[3]/box[2],id=`game-hair-${++avatarHairPaintId}`;
 const curve=t=>Array.from({length:13},(_,i)=>{const l=i/12;return (l<=.34?t*(l/.34)**.85:t+(1-t)*((l-.34)/.66)**1.3*.9).toFixed(3)}).join(' ');
 const [r,g,b]=[1,3,5].map(n=>curve(parseInt(color.slice(n,n+2),16)/255));
 const tint=`filter="url(#${id})"`,part=()=>paintedAvatarPart(style.art,x,y,w,h);
 const defs=`<defs><filter id="${id}" color-interpolation-filters="sRGB" x="-5%" y="-5%" width="110%" height="110%"><feColorMatrix values=".2126 .7152 .0722 0 0 .2126 .7152 .0722 0 0 .2126 .7152 .0722 0 0 0 0 0 1 0"/><feComponentTransfer><feFuncR type="table" tableValues="${r}"/><feFuncG type="table" tableValues="${g}"/><feFuncB type="table" tableValues="${b}"/><feFuncA type="table" tableValues="0 0 .5 1 1"/></feComponentTransfer></filter>${style.tuck?`<clipPath id="${id}-jaw"><rect x="-40" y="-40" width="176" height="104"/></clipPath><clipPath id="${id}-nape-left"><rect x="36" y="58" width="12" height="80"/></clipPath><clipPath id="${id}-nape-right"><rect x="48" y="58" width="12" height="80"/></clipPath>`:''}${style.clearFace?`<mask id="${id}-face" maskUnits="userSpaceOnUse" x="-40" y="-40" width="176" height="300"><rect x="-40" y="-40" width="176" height="300" fill="#fff"/><path d="M33 40Q29.5 46 33.5 51Q37 55 42 60Q46 63 49 62.5Q52 63 56 60Q61 55 65 51Q69.5 46 67 40Q50 43.5 33 40Z"/></mask>`:''}</defs>`;
 return {back:style.tuck?`<g ${tint}><g clip-path="url(#${id}-nape-left)"><g transform="translate(12 0)">${part()}</g></g><g clip-path="url(#${id}-nape-right)"><g transform="translate(-12 0)">${part()}</g></g>${part()}</g>`:'',front:defs+`<g data-game-hair="${variant}" data-hair-color="${color}" ${tint} ${style.tuck?`clip-path="url(#${id}-jaw)"`:''} ${style.clearFace?`mask="url(#${id}-face)"`:''}>${part()}</g>`};
}
