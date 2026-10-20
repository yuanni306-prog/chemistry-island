let paintedSpriteId=0;
const PAINTED_ROOM_URL='assets/cottage/room.png';
function paintedSprite(item){
 const record=typeof COTTAGE_ART!=='undefined'?COTTAGE_ART.items[item.id]||COTTAGE_ART.items[`${item.base||item.id}-${item.variant||0}`]:null;
 if(!record)return null;
 const sheet=COTTAGE_ART.sheets[record.sheet],box=record.box;
 const clip=`painted-clip-${++paintedSpriteId}`;
 return `<svg class="painted-art" data-painted-item="${item.id}" viewBox="${box.join(' ')}" preserveAspectRatio="xMidYMax meet" aria-hidden="true"><defs><clipPath id="${clip}"><polygon points="${record.outline.map(p=>p.join(',')).join(' ')}"/></clipPath></defs><image clip-path="url(#${clip})" href="${sheet.url}" x="0" y="0" width="${sheet.width}" height="${sheet.height}"/></svg>`;
}
// Each style has its own architecture. Split wall/floor mapping preserves the playable grid.
const PAINTED_ROOMS={
 'theme-cream':{sheet:'day',row:0,wall:.60,label:'奶油拱窗 · 人字木地板'},
 'theme-rose':{sheet:'day',row:1,wall:.59,label:'莓果花墙 · 格纹窗帘 · 陶砖'},
 'theme-sea':{sheet:'day',row:2,wall:.64,label:'海景舷窗 · 百叶窗 · 漂木'},
 'theme-forest':{sheet:'night',row:0,wall:.55,label:'树干拱梁 · 林间窗景'},
 'theme-moon':{sheet:'night',row:1,wall:.52,label:'月景花窗 · 云纹石地板'},
 'space':{sheet:'night',row:2,wall:.55,label:'星空穹顶 · 黄铜星图'}
};
const ROOM_SHEETS={day:{url:'assets/cottage/rooms-day.png',w:1024,h:1536},night:{url:'assets/cottage/rooms-night.png',w:1536,h:1024}};
function paintedRoomArt(theme,preview=false){const record=PAINTED_ROOMS[theme?.id]||(theme?.month?PAINTED_ROOMS[['theme-moon','theme-rose','theme-forest','theme-sea','theme-forest','theme-sea','theme-cream','space','theme-cream','theme-forest','theme-cream','theme-moon'][Number(theme.month.slice(5))-1]]:null);if(!record)return `<img class="painted-room-image" src="${PAINTED_ROOM_URL}" alt="" draggable="false">`;const sheet=ROOM_SHEETS[record.sheet],height=sheet.h/3,y=record.row*height,wall=height*record.wall;const image=`<image href="${sheet.url}" width="${sheet.w}" height="${sheet.h}"/>`;return `<svg class="painted-room-image" data-room-style="${theme.id}" viewBox="0 0 1200 800" preserveAspectRatio="none" aria-hidden="true"><svg x="0" y="0" width="1200" height="336" viewBox="0 ${y} ${sheet.w} ${wall}" preserveAspectRatio="none" overflow="hidden">${image}</svg><svg x="0" y="336" width="1200" height="464" viewBox="0 ${y+wall} ${sheet.w} ${height-wall}" preserveAspectRatio="none" overflow="hidden">${image}</svg></svg>`}
function paintedRoom(){return `<div class="painted-room-background" aria-hidden="true">${paintedRoomArt(activeCottageTheme())}</div>`}
function paintedThemePreview(item){return `<div class="painted-theme-preview" title="${PAINTED_ROOMS[item.id]?.label||item.name}">${paintedRoomArt(item,true)}</div>`}

function paintedPetSprite(id,action='idle'){
 const key=`animal-${action==='sleep'?'sleep':'awake'}-${id}`,record=typeof COTTAGE_ART!=='undefined'?COTTAGE_ART.items[key]:null;if(!record)return null;
 const sheet=COTTAGE_ART.sheets[record.sheet],clip=`pet-art-${++paintedSpriteId}`,box=record.box;
 let extras='';if(action==='eat')extras='<ellipse cx="53" cy="60" rx="17" ry="5" fill="#bdcabe" stroke="#8d9e8a"/><ellipse cx="53" cy="57" rx="15" ry="4" fill="#826a4d"/><path d="M44 57l3-1m6 2 3-1m4 0 2-1" stroke="#d9b782" stroke-width="2"/>';
 if(action==='play')extras='<circle cx="65" cy="57" r="8" fill="#c99c8e" stroke="#936e5c"/><path d="M60 51l10 11" stroke="#ecd5b1" stroke-width="2"/>';
 if(action==='bath')extras='<path d="M8 50h64l-5 14H13Z" fill="#afc5bd" stroke="#829f94"/>'+[14,25,38,51,64].map((x,n)=>`<circle cx="${x}" cy="${48+n%2*5}" r="7" fill="#f1f5e6" stroke="#c3d7c9"/>`).join('');
 if(action==='sleep')extras='<path d="M62 10h5l-5 6h5m3-15h7l-7 9h7" fill="none" stroke="#a69b8a" stroke-width="1.4" stroke-linecap="round"/>';
 const h=action==='sleep'?44:57;
 return `<svg viewBox="0 0 80 68" class="pet-painted pet-action-${action}" data-pet-art="${key}" aria-hidden="true"><g class="pet-painted-body"><svg x="5" y="${62-h}" width="70" height="${h}" viewBox="${box.join(' ')}" preserveAspectRatio="xMidYMax meet" overflow="hidden"><defs><clipPath id="${clip}"><polygon points="${record.outline.map(p=>p.join(',')).join(' ')}"/></clipPath></defs><image href="${sheet.url}" width="${sheet.width}" height="${sheet.height}" clip-path="url(#${clip})"/></svg></g>${extras}</svg>`;
}
