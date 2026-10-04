import {CIRCULATION_STEPS,CARDIAC_PHASES,SHOCK_EFFECTS} from './organ-content.mjs';
import {svg,part,text,flow,note,stats} from './organ-ui.mjs';

const positions=[[190,275],[358,291],[325,328],[356,474],[298,205],[360,146],[500,185],[515,291],[480,328],[454,474],[602,245],[668,407]];
function valve(x,y,open,label){
 return `<circle class="organ-outline" cx="${x}" cy="${y}" r="17" fill="${open?'#fff7cf':'#fff'}" stroke="#778e9b" stroke-width="2"/>`+
 `<path d="${open===null?`M${x-10} ${y-7}L${x} ${y+2}L${x+10} ${y-7}`:open?`M${x-10} ${y-8}L${x-4} ${y+8}M${x+10} ${y-8}L${x+4} ${y+8}`:`M${x-12} ${y}H${x+12}`}" stroke="#576c7a" stroke-width="4" fill="none" stroke-linecap="round"/>`+text(x,y+34,label,15);
}
export function heartDiagram(s){
 const t='shock',phase=CARDIAC_PHASES[s.organStep%4],cycle=s.heartView==='cycle',signals=s.heartView==='signals';
 const avOpen=cycle?phase.av==='Open':null,outOpen=cycle?phase.out==='Open':null;
 const pulmonaryCongestion=s.shockCase==='cardiogenic';
 let art=`<rect x="12" y="12" width="776" height="603" rx="24" fill="#f6fafc" stroke="#d6e5ec"/>`;
 art+=part(t,'lungs',s,`<path class="organ-outline" d="M389 65C350 51 320 80 316 133C313 171 347 180 383 166L393 96Z M411 65C450 51 480 80 484 133C487 171 453 180 417 166L407 96Z" fill="${pulmonaryCongestion?'#dedaf1':'#e5eef6'}" stroke="#9aafbf" stroke-width="2"/><path d="M400 39V83M400 76L352 127M400 76L448 127" stroke="#8498a8" stroke-width="7" fill="none"/>`+text(400,29,'LUNGS',18)+text(609,78,'O₂ enters blood',17)+text(609,104,'CO₂ leaves blood',17));
 art+=part(t,'body',s,`<rect class="organ-outline" x="613" y="345" width="150" height="137" rx="22" fill="#f4e9ee" stroke="#d3aebc" stroke-width="2"/>`+text(688,374,'BODY TISSUES',17)+`<path d="M625 395H750M625 427H750M640 395V427M662 395V427M684 395V427M706 395V427M728 395V427" fill="none" stroke="#bd6680" stroke-width="5"/>`+text(688,455,'O₂ to cells',16));
 const faded=signals?' opacity=".18"':'';
 art+=`<g${faded||cycle?' opacity=".35"':''}>`+flow(t,'M625 439V563H188V276H266','blue',8)+flow(t,'M302 353V204Q302 151 319 132','blue',8)+flow(t,'M482 131H501V243','red',8)+flow(t,'M539 364V245H689V340','red',8)+`</g>`;
 art+=text(116,304,'Venae cavae',16)+text(179,170,'Pulmonary artery',16)+text(591,156,'Pulmonary veins',16)+text(671,228,'Aorta',18);
 art+=`<path d="M245 274C236 192 297 177 343 194C368 169 417 167 446 198C503 169 571 203 579 268C602 384 543 494 415 550C283 489 239 384 245 274Z" fill="#fff" stroke="#c28d9d" stroke-width="9"/>`;
 art+=part(t,'ra',s,`<rect class="organ-outline" x="267" y="238" width="113" height="78" rx="28" fill="#dcecf8" stroke="#8db8d7" stroke-width="2"/>`+(signals?text(317,274,'RA',21):text(324,270,'Right atrium',17)+text(324,294,'RA',21)));
 art+=part(t,'rv',s,`<path class="organ-outline" d="M268 351Q260 411 287 453L391 514V351Z" fill="#dcecf8" stroke="#8db8d7" stroke-width="2"/>`+(signals?text(320,396,'RV',21):text(327,397,'Right',21)+text(327,423,'ventricle',19)+text(327,450,'RV',21)));
 art+=part(t,'la',s,`<rect class="organ-outline" x="423" y="238" width="115" height="78" rx="28" fill="#f7dfe6" stroke="#d69bae" stroke-width="2"/>`+(signals?text(481,280,'LA',21):text(481,270,'Left atrium',17)+text(481,294,'LA',21)));
 art+=part(t,'lv',s,`<path class="organ-outline" d="M420 351V514Q529 479 548 351Z" fill="${s.shockCase==='cardiogenic'?'#eadff2':'#f7dfe6'}" stroke="#c7889d" stroke-width="4"/>`+(signals?text(500,382,'LV',21):text(482,396,'Left',21)+text(482,422,'ventricle',19)+text(482,449,'LV',21)));
 art+=`<path d="M402 224V502" stroke="#dcb8c2" stroke-width="15"/>`;
 if(!signals){
  art+=flow(t,'M235 276H266','blue',5)+flow(t,'M502 211V237','red',5);
  if(!cycle||avOpen)art+=flow(t,'M324 312V350','blue',5)+flow(t,'M480 312V350','red',5);
  if(!cycle||outOpen)art+=flow(t,'M281 354H253V226L286 209','blue',5)+flow(t,'M531 367V282L546 253','red',5);
 }
 art+=part(t,'tricuspid',s,valve(325,330,avOpen,'Tricuspid'))+part(t,'mitral',s,valve(480,330,avOpen,'Mitral'));
 art+=part(t,'pulmonary',s,valve(301,207,outOpen,'Pulmonary'))+part(t,'aorta',s,valve(552,248,outOpen,'Aortic'));
 art+=part(t,'vena',s,`<rect class="organ-outline" x="163" y="252" width="68" height="47" rx="20" fill="#dcecf8" stroke="#8db8d7" stroke-width="2"/>`+text(197,281,'RETURN',13));
 art+=part(t,'veins',s,`<rect class="organ-outline" x="485" y="172" width="43" height="41" rx="13" fill="#f7dfe6" stroke="#d69bae" stroke-width="2"/>`+text(507,199,'PV',15));
 art+=part(t,'coronary',s,`<path class="organ-outline" d="M565 266C602 329 572 386 568 421L527 469M568 402L558 446" stroke="#b64560" stroke-width="5" fill="none"/><rect x="573" y="491" width="171" height="43" rx="12" fill="#fff" stroke="#d1b1bb"/>`+text(658,518,'Coronary supply',16));
 const dilated=['neurogenic','anaphylactic','septic'].includes(s.shockCase),constricted=['hypovolemic','cardiogenic'].includes(s.shockCase);
 art+=part(t,'tone',s,`<circle class="organ-outline" cx="109" cy="441" r="33" fill="#e0cbd5" stroke="#ad8596" stroke-width="2"/><circle cx="109" cy="441" r="${dilated?27:constricted?13:20}" fill="#fff7f9" stroke="#c6a2b0" stroke-width="2"/>`+text(109,395,'VESSEL ZOOM',15)+text(109,494,dilated?'Dilated example':constricted?'Often constricted':s.shockCase==='baseline'?'Usual tone':'Tone varies',15));
 if(['baseline','hypovolemic'].includes(s.shockCase))art+=Array.from({length:s.shockCase==='hypovolemic'?2:6},(_,i)=>`<circle cx="${67+i*16}" cy="518" r="5" fill="#317bb4"/>`).join('')+text(109,545,'Available blood',14);
 if(signals){
  const on=s.organStep,wire=(d,index)=>`<path d="${d}" fill="none" stroke="${on>=index?'#b36c11':'#d0c7a9'}" stroke-width="${on===index?7:4}" stroke-linecap="round"/>`;
  art+=wire('M355 244Q309 243 291 271Q309 294 385 319',1)+wire('M355 244Q405 219 493 258',1)+wire('M389 326L409 386L409 484',3)+wire('M409 396L365 456L290 428M409 396L473 458L537 409',4);
  art+=part(t,'sa',s,`<circle class="organ-outline" cx="355" cy="244" r="13" fill="#ffda82" stroke="#aa6812" stroke-width="2"/>`+text(343,222,'SA',16));
  art+=part(t,'av',s,`<circle class="organ-outline" cx="389" cy="322" r="13" fill="#ffda82" stroke="#aa6812" stroke-width="2"/>`+text(397,308,'AV',16));
  art+=part(t,'his',s,`<circle class="organ-outline" cx="409" cy="386" r="12" fill="#ffda82" stroke="#aa6812" stroke-width="2"/>`+text(435,379,'His',15));
  art+=part(t,'purkinje',s,`<circle class="organ-outline" cx="365" cy="456" r="12" fill="#ffda82" stroke="#aa6812" stroke-width="2"/>`+text(332,486,'Purkinje',15));
 }else if(!cycle){
  const [x,y]=positions[s.organStep],oxygen=s.organStep>=6&&s.organStep<=10;
  art+=`<circle cx="${x}" cy="${y}" r="20" fill="none" stroke="#b58120" stroke-width="3" stroke-dasharray="5 4"/><circle cx="${x}" cy="${y}" r="9" fill="${oxygen?'#b64560':'#317bb4'}" stroke="#fff" stroke-width="3"/>`;
 }
 if(s.shockCase==='hypovolemic')art+=text(115,349,'↓ Available volume',17,'#985a19');
 if(s.shockCase==='cardiogenic')art+=text(482,481,'↓ Ejection',16,'#805585')+text(152,87,'Lung backup',17,'#805585');
 if(s.shockCase==='obstructive')art+=`<rect x="278" y="161" width="45" height="25" rx="4" fill="#ffe1aa" stroke="#a56a16"/><path d="M286 166L315 181M315 166L286 181" stroke="#a56a16" stroke-width="4"/>`+text(158,144,'PE example',17,'#985a19');
 if(['neurogenic','anaphylactic','septic'].includes(s.shockCase))art+=text(679,328,'Tone disrupted',17,'#985a19');
 if(['anaphylactic','septic'].includes(s.shockCase))art+=`<g fill="#8bbddd">${[636,668,700,731].map((x,i)=>`<path d="M${x} ${490+i%2*7}q-13 18 0 22q13-4 0-22Z"/>`).join('')}</g>`+text(680,563,'Capillary leakage',16,'#4c7f99');
 if(s.shockCase==='anaphylactic')art+=text(137,54,'Airway at risk',17,'#985a19');
 art+=text(400,598,'Person’s RIGHT is on the diagram’s LEFT',16,'#526d7e');
 return svg(t,signals?'Heart electrical conduction':cycle?'Heart chambers and valve states':'Follow blood through the heart, lungs, and body',630,art);
}
export function heartMeaning(s){
 const effect=SHOCK_EFFECTS[s.shockCase];
 let html='';
 if(s.heartView==='flow')html=stats([['Blood at this step',CIRCULATION_STEPS[s.organStep][3]],['One complete circuit','Body → right heart → lungs → left heart → body']]);
 if(s.heartView==='cycle'){
  const p=CARDIAC_PHASES[s.organStep];
  html=stats([['Tricuspid + mitral',p.av],['Pulmonary + aortic',p.out],['Sound / timing',p.sound]])+note('Remember the phase',p.meaning)+note('Follow the valve crossings','Strong arrows at valve openings show filling or ejection in the selected phase. Faint vessel arrows show the overall route. The model does not calculate chamber pressures or continuous flow in the rest of the circuit.');
 }
 if(s.heartView==='signals')html=note('Electrical signal versus blood flow','Gold paths represent the electrical conduction sequence. The impulse coordinates muscle contraction; it is not a stream of blood. The simplified routes do not show every conduction fiber.');
 html+=note(effect.label,effect.change+' '+effect.result,'organ-change')+note('What to notice',effect.clue);
 if(s.compensation&&s.shockCase!=='baseline')html+=note('Compensation',s.shockCase==='neurogenic'?'The usual sympathetic response may be interrupted by a high cord injury. Bradycardia can coexist with hypotension.':'Sympathetic activation may increase heart rate and constrict vessels. Reduced kidney perfusion can activate RAAS to retain sodium and water. These responses support circulation but do not repair a weak pump, replace lost blood, remove an obstruction, or control the source.');
 return html;
}
