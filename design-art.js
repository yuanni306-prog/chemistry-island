// Original vector drawings: structure, upholstery, joinery and garment cuts.
const artRect=(x,y,w,h,c,r=0)=>`<rect x="${x}" y="${y}" width="${w}" height="${h}" rx="${r}" fill="${c}"/>`;
const artPath=(d,c,stroke='',width=2)=>`<path d="${d}" fill="${c}" ${stroke?`stroke="${stroke}" stroke-width="${width}" stroke-linecap="round" stroke-linejoin="round"`:''}/>`;
const artOval=(x,y,rx,ry,c)=>`<ellipse cx="${x}" cy="${y}" rx="${rx}" ry="${ry}" fill="${c}"/>`;
function designedFurniture(item){
 const base=item.base||item.id,v=item.variant||0,wood='#ae8055',dark='#674f3e',ivory='#efe5d1',cloth=item.palette?.[2]||'#8fa58b';
 const R=artRect,P=artPath,E=artOval;let s='';
 const legs=(xs,y=64,end=86,color=dark)=>xs.map(x=>P(`M${x} ${y}l-3 ${end-y}`,'none',color,4)).join('');
 const tuft=(x,y,w,h)=>Array.from({length:3},(_,n)=>P(`M${x+w/6+n*w/3} ${y}v${h}`,'none','#ffffff45',1)).join('');
 if(base==='bed'){
  const head=[R(14,12,68,18,wood,3)+P('M18 17h60M18 23h60','none','#c4a178',2),R(11,9,74,28,cloth,12)+tuft(15,14,66,15),P('M14 31V15Q48-6 82 15v16M22 12v18M36 6v24M59 6v24M73 12v18','none','#6e7575',3),R(8,8,80,9,wood,2)+R(8,38,80,8,wood,2)+P('M11 8v78M85 8v78M72 38v49M78 38v49M71 56h8M71 65h8M71 75h8','none',dark,4),P('M9 86V6h78v80M9 6L20 1h56l11 5','none',dark,4),R(10,11,76,28,'#bda18b',9)][v];
  s=head+R(13,30,70,52,v===2?'#737e7b':wood,5)+R(16,29,64,46,ivory,5)+R(17,45,62,31,cloth,3)+R(20,32,24,12,'#faf6eb',3)+R(51,32,24,12,'#faf6eb',3)+P('M18 51h60M20 53v20M75 53v20','none','#ffffff55',1)+legs([19,78],80,90);
  if(v===3)s+=R(15,18,64,12,ivory,3)+R(18,23,59,12,cloth,3)+R(8,37,80,7,wood,2);
  if(v===4)s+=P('M12 8q9 18 5 37M83 8q-9 18-5 37','none','#ede0c6',6);
  if(v===5)s+=R(16,76,29,10,'#c4a284',2)+R(49,76,29,10,'#c4a284',2)+R(29,80,6,2,dark,1)+R(61,80,6,2,dark,1);
 }else if(base==='table'){
  const tops=[R(7,28,82,28,wood,4),E(48,38,36,22,'#c5a17c'),E(48,51,42,17,'#a47750'),R(9,30,78,24,'#c8dede',5),P('M3 29h90l-5 28H8z','#b88b5a'),E(48,37,27,20,ivory)][v];
  s=v===1?P('M46 44v35M27 84l20-5 22 5','none',dark,6):v===2?legs([15,80],58,77):v===3?P('M20 52v31M77 52v31M20 82h57','none','#869698',3):v===4?P('M26 52L15 86M26 52l17 34M72 52L57 86M72 52l12 34M26 72h45','none',dark,5):legs([15,80],52);
  s+=tops;if(v===3)s+=P('M16 34l25 15M58 34l20 12','none','#fff9',3);else if(v===5)s+=P('M24 20v36M72 20v36','none','#b6a88c',2)+P('M23 17Q1 29 23 57M73 17q22 12 0 40',ivory,dark,1);else s+=P('M14 38h55M27 46h54','none','#ffffff27',1);
 }else if(base==='chair'){
  s=legs([28,70],66,88);
  const backs=[R(23,9,50,42,wood,4)+P('M31 16v27M43 16v27M55 16v27M66 16v27','none','#ddc4a0',3),P('M24 43V16Q48-1 72 16v27M32 12v28M43 8v32M54 8v32M65 12v28','none',dark,3),R(21,8,54,48,cloth,16),R(23,12,50,39,'#baaa97',6)+P('M27 44L19 85h54L67 57','none','#7e8582',4),R(16,13,64,49,cloth,15),P('M22 46V13Q48 2 74 13v33','#cfb690',dark,3)+tuft(27,14,42,26)][v];
  s+=backs+R(20,48,56,17,v===0||v===1?wood:cloth,6)+P('M24 65h48','none',dark,3);
  if(v===4)s+=R(13,43,11,26,cloth,5)+R(72,43,11,26,cloth,5);
  if(v===5)s+=P('M27 22h42M27 29h42M27 36h42','none','#a68c67',1);
 }else if(base==='sofa'){
  s=legs([14,82],76,87);
  const silhouettes=[R(8,20,80,53,cloth,9),R(4,18,88,57,'#e6dfce',23),R(7,19,82,52,'#aa7780',11),R(6,18,67,50,cloth,8)+R(62,47,28,33,cloth,5),P('M8 29h80v42H8z','#bd9c76')+P('M8 20v53M88 20v53M9 70h78','none',dark,5),R(8,48,80,21,cloth,6)+P('M9 48V22M87 48V22','none',dark,5)][v];
  s+=silhouettes;
  if(v===4)s+=R(16,28,30,25,ivory,4)+R(49,28,30,25,ivory,4)+P('M12 56h70M12 61h70','none','#94724e',2);
  else if(v===5)s+=E(21,45,10,10,ivory)+R(12,57,73,8,cloth,4);
  else s+=R(15,29,31,24,v===1?'#f4eddf':cloth,6)+R(49,29,31,24,v===1?'#f4eddf':cloth,6)+R(9,42,10,30,v===1?'#e6dfce':cloth,5)+R(78,42,10,30,v===1?'#e6dfce':cloth,5)+P('M20 58h55M48 53v16','none','#544a3c35',2);
  if(v===2)s+=Array.from({length:7},(_,n)=>E(20+n*9,36,1.6,1.6,'#70544d')).join('');
 }else if(base==='bookshelf'){
  const widths=[60,53,66,86,66,65],x=(96-widths[v])/2,w=widths[v];
  s=v===1?P('M26 9L16 87M69 9l11 78','none',wood,5):R(x,8,w,v===3?63:77,wood,3);
  const shelfYs=v===3?[26,47,66]:[27,49,72];
  for(const [row,y] of shelfYs.entries()){s+=R(x+4,y,w-8,4,dark,1);for(let n=0;n<5;n++)s+=R(x+7+n*(w-15)/5,y-14,5,14,['#7d9b99','#c39a6a','#a5797e'][((n+row)%3)],1)}
  if(v===2)s+=R(x+4,12,(w-10)/2,67,'#d7e9e75c',2)+R(48,12,(w-10)/2,67,'#d7e9e75c',2)+P('M48 12v67','none',dark,2);
  if(v===4)s+=R(x+4,46,w-8,34,'#c09b70',2)+P('M48 46v34','none',dark,2)+E(43,62,1.5,1.5,dark)+E(53,62,1.5,1.5,dark);
  if(v===5)s+=P('M40 8v41M61 49v30M40 49h20','none',wood,5);
 }else if(base==='desk'){
  s=legs([12,82],52,88)+R(6,43,84,14,wood,3);
  if(v===0)s+=R(62,20,24,24,'#9eb8a9',2)+P('M66 16v19M74 13v22M81 19v16','none','#5d928b',4)+R(16,38,23,5,ivory,1);
  if(v===1)s+=P('M24 57l-12 30M24 57l14 30M73 57l-13 30M73 57l13 30','none',dark,4);
  if(v===2)s+=E(48,23,20,22,wood)+E(48,23,16,18,'#c9ddda')+P('M37 15l18 13','none','#fff9',3)+R(31,57,35,13,'#c8aa85',2)+E(48,62,2,2,dark);
  if(v===3)s=P('M19 44v40M76 44v40M9 87h23M64 87h23','none','#777d7d',5)+R(7,38,82,12,'#ddd0b8',2)+R(44,22,27,15,'#485e60',2)+R(55,37,5,5,'#777d7d');
  if(v===4)s+=R(13,15,70,30,wood,8)+P('M16 22h63M16 28h63M16 34h63','none','#d0ad85',2)+R(63,60,21,23,wood,2)+P('M63 68h20M63 75h20','none',dark,1);
  if(v===5)s+=R(61,40,29,40,'#ae8055',3)+R(67,54,20,8,'#c6a37d',2)+R(67,66,20,8,'#c6a37d',2);
 }else if(base==='fireplace'){
  if(v===3||v===5||v===4)s=R(v===4?24:28,v===4?18:26,v===4?48:40,v===4?59:49,v===4?'#a5b9b5':'#525958',v===5?18:v===4?23:6)+R(42,5,12,23,'#666b68',2)+legs([32,64],74,87)+R(34,37,28,25,'#303b39',v===5?12:4);
  else s=R(19,13,58,65,['#b98065','#dfd4b9','#bb7965','#a5b9b5'][v%4],3)+R(13,11,70,8,ivory,2)+R(12,76,72,9,ivory,2)+P('M28 73V43Q48 15 68 43v30z','#55483c')+P('M20 25h54M20 36h8M68 36h8','none','#fff5',2);
  if(v===1)s+=P('M15 74V37Q48 3 81 37v37M23 75V42Q48 15 73 42v33','none','#d2c5a9',6);
  if(v===2)s+=R(32,1,32,10,'#b87963')+P('M22 20h51M22 30h14M65 30h8M22 57h8M69 57h6M25 70h8M62 70h11','none','#e3b6a1',2);
  s+=P('M36 68q-4-12 10-20-3 12 8 8 8 8 5 12z','#dc9652')+P('M45 68q-3-9 6-14-1 7 5 14z','#f7ce72');
 }else if(base==='rug'){
  s=v===1||v===4?E(48,49,43,33,v===4?'#bea579':cloth):R(5,14,86,66,cloth,v===2?19:3);
  if(v===1)s+=E(48,49,34,25,'#d6bf9a')+E(48,49,26,18,cloth);
  else if(v===4)s+=Array.from({length:7},(_,n)=>`<ellipse cx="48" cy="49" rx="${10+n*4.5}" ry="${6+n*3.5}" fill="none" stroke="#977d59" stroke-width="1"/>`).join('');
  else if(v===3)s+=Array.from({length:20},(_,n)=>R(8+(n%5)*16,19+Math.floor(n/5)*14,16,14,n%2?ivory:'#697e75')).join('');
  else s+=P(v===5?'M48 22l18 27-18 23-18-23z':'M10 27h75M10 46h75M10 64h75','none',ivory,v===5?3:2);
 }else if(base==='lamp'){
  if(v===1)s=E(48,77,22,7,'#c6b6a0')+R(43,38,10,37,ivory,5)+P('M13 39Q18-2 48 9q28-3 35 30z','#d2baa0');
  else if(v===2)s=P('M20 82V30Q20-2 71 15','none',dark,4)+E(19,83,18,5,dark)+P('M59 14h26l7 20H53z','#ba867d');
  else if(v===3)s=E(48,73,20,7,'#c0d7d4')+R(38,39,20,33,'#c0d7d4',7)+E(48,39,11,7,'#d4e7df')+P('M24 35l7-27h34l7 27z',ivory);
  else if(v===4)s=P('M25 85V46l29-19M42 18l24 16-12 17-24-16z',dark,dark,3)+E(25,85,16,4,dark);
  else if(v===5)s=P('M48 1v17','none',dark,2)+P('M20 47V31q28-26 56 0v16z','#d6c2a1')+E(48,47,28,9,ivory);
  else s=E(48,84,20,5,dark)+R(46,30,4,52,dark)+P('M20 33l8-23h40l8 23z',ivory)+P('M29 15h38','none','#d6bd90',2);
 }else if(base==='plant'||base==='flowers'){
  s=P('M29 66h38l-6 23H35z',v===3?'#aaa99b':'#b47d58')+E(48,66,21,6,'#cb9970');
  if(base==='plant'&&v===2)s=R(30,63,36,25,'#c0a881',7)+R(40,18,17,47,'#789579',8)+P('M40 38H26V26M56 29h12V20','none','#789579',9)+P('M46 23v37M51 23v37','none','#b4c9a3',1);
  else if(base==='flowers'){
   const fc=['#d2a1a7','#f2e8cb','#be7d89','#9cb5c1','#e0bc6e','#eee9d9'][v];
   const flowers=v===4?[[48,22,16]]:v===3?[[33,29,12],[60,28,12],[47,43,12]]:[[29,29,9],[57,20,10],[63,44,8]];
   for(const [x,y,size] of flowers){s+=P(`M48 66L${x} ${y}`,'none','#71936b',2);if(v===2)s+=E(x,y,size,size,fc)+P(`M${x-5} ${y}q5-9 10 0-3 8-8 3 0-5 5-3`,'none','#e6b4b7',1.5);else if(v===3)s+=Array.from({length:12},(_,n)=>E(x+Math.cos(n)*size*.7,y+Math.sin(n)*size*.7,3,3,fc)).join('');else if(v===5)s+=P(`M${x-5} ${y}q5-12 10 0l3 9q-8 8-16 0z`,fc);else{s+=Array.from({length:v===4?10:v===1?8:6},(_,n)=>E(x+Math.cos(n*6.28/(v===4?10:v===1?8:6))*size*.65,y+Math.sin(n*6.28/(v===4?10:v===1?8:6))*size*.65,size*.45,size*.3,fc)).join('');s+=E(x,y,size*.35,size*.35,v===4?'#8a6c45':'#d2b267')}}
  }else if(v===5){for(let n=0;n<6;n++)s+=P(`M48 66Q${14+n*10} 35 ${12+n*13} 15`,'none','#5f896b',2)+Array.from({length:6},(_,k)=>E(18+n*9,24+k*5,8-k*.7,2,'#779b71')).join('')}
  else if(v===3||v===4){s+=P('M48 66V18','none','#8f7754',5);for(let n=0;n<5;n++)s+=E(32+(n%2)*31,20+n*8,v===4?13:9,v===4?8:13,'#708f67')}
  else {s+=P('M48 68V21','none','#5d7956',3);for(let n=0;n<5;n++){const x=n%2?61:34,y=23+n*8;s+=P(`M48 ${y+9}Q${x-16} ${y-20} ${x} ${y-4}Q${x+13} ${y+6} 48 ${y+9}`,'#74936b');if(v===1)s+=E(x,y,2,3,'#d6c2a1')}}
 }else if(base==='petbed'){
  if(v===2)s=P('M7 78L48 12l41 66z','#b5a293')+P('M26 78l22-42 22 42z','#6d645c')+P('M48 12v22','none',ivory,3);
  else if(v===4)s=E(48,64,40,24,'#ad8e63')+E(48,59,34,18,'#ead9b8')+P('M13 57h70M13 64h70M22 71h52','none','#c0a37a',2);
  else if(v===5)s=P('M6 75Q2 24 48 23q46 1 42 52z','#b1b4c8')+E(48,66,27,17,'#6c7089')+E(48,77,25,7,ivory);
  else if(v===3)s=R(5,37,86,45,'#9cafb4',8)+R(12,43,72,33,ivory,5)+P('M17 49h62M17 58h62M17 67h62','none','#9cafb4',3);
  else if(v===1)s=E(48,52,33,33,ivory)+E(48,52,22,23,'#c8b79c')+P('M20 52q28-30 56 0','none','#f8f2e6',3);
  else s=E(48,64,42,25,cloth)+E(48,58,34,19,'#ede1cb')+E(48,60,26,12,'#c8b79c');
 }else return null;
 return `<svg viewBox="0 0 96 96" aria-hidden="true" preserveAspectRatio="none"><ellipse cx="48" cy="88" rx="36" ry="4" fill="#624b3220"/>${s}</svg>`;
}
