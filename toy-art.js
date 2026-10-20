function extraToySprite(item){const P=artPath,R=artRect,E=artOval;const shapes={
 'play-tunnel':P('M12 37q35-19 66-2v38q-29-15-66 1z','#bca591')+E(14,56,13,20,'#cdb9a3')+E(14,56,8,15,'#655b51')+P('M33 31v40M52 30v40M71 32v37','none','#e5d5bc',2),
 'puzzle-board':R(9,30,78,49,'#b2c0aa',8)+[25,48,71].map(x=>E(x,49,9,8,'#7e957b')+R(x-8,61,16,8,'#eadcc5',3)).join('')+P('M24 48h5M48 48h5M70 48h5','none','#dac19a',3),
 'crinkle-fish':P('M12 53q33-29 57 0-21 32-57 0z','#c4a48c')+P('M65 53l21-18v37z','#a7b6b4')+E(28,48,3,3,'#746858')+P('M37 37q-10 16 0 30M51 39q-10 14 0 25','none','#e8d4bd',2),
 'rope-knot':P('M18 70l52-43M14 64l51-43M23 77l53-43','none','#bba184',6)+E(29,63,12,11,'#98aa9a')+E(64,32,12,12,'#98aa9a')+P('M12 63l-7-4M16 70l-9 2M22 78l-4 9M73 20l4-6M77 26l10-3M78 33l9 3','none','#cdb795',3),
 'flying-disc':E(48,53,39,24,'#b2bacc')+E(48,50,31,18,'#d4d8e4')+E(48,50,23,13,'#9da9be')+P('M25 43q23-15 44 0','none','#e9ebf0',2),
 'treat-ball':E(48,50,31,31,'#bba383')+E(44,36,9,8,'#e6d1ad')+E(62,56,9,9,'#a7bca9')+E(31,62,7,8,'#9daec0')+E(48,48,6,5,'#695d4c'),
 'hamster-wheel':R(24,81,51,5,'#a49885',3)+P('M48 52v28','none','#a49885',4)+E(48,46,32,34,'#c1b399')+E(48,46,26,28,'#f1e8d6')+P('M48 20v51M22 45h52M30 27l35 38M28 65l37-38','none','#b6a586',3)+E(48,46,5,5,'#8f806b'),
 'bird-swing':P('M48 6L19 65h58L48 6z','none','#b39b78',3)+R(16,63,65,7,'#9a7a58',4)+[22,34,63,76].map((x,n)=>E(x,31+n%2*8,5,5,['#b3c3a1','#cfaf9f'][n%2])).join('')
 };return shapes[item.id]?`<svg viewBox="0 0 96 96" aria-hidden="true">${shapes[item.id]}</svg>`:null;}
