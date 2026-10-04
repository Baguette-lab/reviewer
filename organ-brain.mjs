import {SEIZURE_PATTERNS} from './visual-models.mjs';
import {neuralExtent} from './organ-models.mjs';
import {svg,part,text,arrow,note,stats} from './organ-ui.mjs';

export function brainDiagram(s){
 const t='seizures',extent=neuralExtent(s),active=extent!=='resting',focal=extent==='focal';
 let art=`<rect x="12" y="12" width="776" height="638" rx="24" fill="#f8fbfc" stroke="#d6e5ec"/>`;
 art+=text(400,45,'NEURON · regulated messages become network activity',20);
 art+=part(t,'dendrite',s,`<path class="organ-outline" d="M199 148L148 114L126 79M148 114L106 124M194 151L143 175L120 210M143 175L92 175M190 142L188 84" fill="none" stroke="#9780b3" stroke-width="7" stroke-linecap="round"/>`+text(115,250,'Dendrites',18));
 art+=part(t,'soma',s,`<path class="organ-outline" d="M201 113Q249 95 270 133Q291 176 253 193Q220 220 192 180Q175 143 201 113Z" fill="#e6dbf0" stroke="#9780b3" stroke-width="3"/><circle cx="233" cy="154" r="19" fill="#c0a5d5"/>`+text(236,250,'Cell body',18));
 art+=part(t,'axon',s,`<path class="organ-outline" d="M273 153H582" stroke="${active?'#b7616d':'#9480ab'}" stroke-width="8" fill="none"/><path d="M309 153H346M374 153H411M439 153H476M504 153H541" stroke="#d2c2e2" stroke-width="23" stroke-linecap="round"/>`+text(425,126,'Axon',18)+text(425,191,'Impulse travels outward',16));
 art+=part(t,'synapse',s,`<path class="organ-outline" d="M582 153L625 126M582 153L625 177" stroke="#9480ab" stroke-width="7" fill="none"/><circle cx="628" cy="124" r="10" fill="#c0a5d5"/><circle cx="628" cy="179" r="10" fill="#c0a5d5"/><path d="M660 102V203" stroke="#9480ab" stroke-width="9" stroke-linecap="round"/><circle cx="646" cy="130" r="4" fill="#b77d28"/><circle cx="647" cy="174" r="4" fill="#b77d28"/>`+text(653,250,'Synapse',18));
 art+=text(423,222,'Inputs include excitatory and inhibitory influences.',16);
 art+=`<path d="M36 273H762" stroke="#d6e5ec" stroke-width="2"/>`;
 art+=text(242,309,'BRAIN NETWORKS',20)+text(644,309,'OBSERVABLE EFFECTS',18);
 const left=`M235 336C188 304 125 328 109 374C74 398 88 453 104 476C102 527 163 558 229 533Z`,right=`M252 336C300 303 365 329 379 374C412 398 400 453 384 476C387 527 320 558 259 533Z`;
 const net=(rightSide=false)=>{
  const xs=rightSide?[283,327,364]:[133,170,207],color=active&&(!rightSide||!focal)?'#b24e64':'#859fae';
  return `<path d="M${xs[0]} 415L${xs[1]} 379L${xs[2]} 414L${xs[1]} 463L${xs[0]} 415M${xs[1]} 379V463" stroke="${color}" stroke-width="${active?4:2}" fill="none"/>`+xs.map((x,i)=>`<circle cx="${x}" cy="${i===1?379:415}" r="${active&&(!rightSide||!focal)?10:7}" fill="${color}"/>`).join('')+`<circle cx="${xs[1]}" cy="463" r="9" fill="${color}"/>`;
 };
 art+=part(t,'focal',s,`<path class="organ-outline" d="${left}" fill="${active?'#f3d6df':'#e6eef3'}" stroke="#8fa7b5" stroke-width="3"/><path d="M145 352Q160 389 132 419Q130 445 156 469M177 334Q201 372 185 413Q208 451 187 503" stroke="#b4c6d0" stroke-width="3" fill="none"/>`+net(false));
 art+=part(t,'bilateral',s,`<path class="organ-outline" d="${right}" fill="${active&&!focal?'#f3d6df':'#e6eef3'}" stroke="#8fa7b5" stroke-width="3"/><path d="M344 352Q328 389 360 419Q361 445 337 469M304 334Q281 372 297 413Q274 451 316 503" stroke="#b4c6d0" stroke-width="3" fill="none"/>`+net(true));
 if(active&&!focal)art+=`<path d="M210 415H280" fill="none" stroke="#b24e64" stroke-width="5" stroke-dasharray="7 5"/>`;
 art+=text(242,581,!active?s.organStep===4?'Recovering toward baseline':'Regulated activity':focal?'Example: activity in one network':s.seizureSpread?'Focal onset → bilateral spread':'Distributed network example',18,active?'#965164':'#496b7e');
 art+=arrow(t,'M417 422H524');
 const limp=active&&s.seizureType==='atonic',stiff=active&&(s.seizureType==='tonicClonic'||s.seizureSpread);
 const limbs=limp?'M589 408L580 457L599 477M584 433L563 463M584 433L609 467M599 477L581 520M599 477L620 520':stiff?'M596 408V479M596 433L563 422M596 433L629 422M596 479L575 522M596 479L618 522':'M596 408V479M596 433L568 464M596 433L624 464M596 479L575 522M596 479L618 522';
 const effect=active?(s.seizureSpread?'Stiffen / jerk':({atonic:'Tone drops',myoclonic:'Brief jerks',absence:'Brief stare',tonicClonic:'Stiffen / jerk',focalAware:'Local effect',focalImpaired:'Automatisms'})[s.seizureType]):'Movement';
 art+=part(t,'body',s,`<rect class="organ-outline" x="540" y="337" width="221" height="214" rx="22" fill="#f0eaf5" stroke="#b7a8c7"/><circle cx="${limp?582:596}" cy="387" r="21" fill="#d4c4df" stroke="#a38bb8" stroke-width="2"/><path d="${limbs}" stroke="#a38bb8" stroke-width="9" stroke-linecap="round" fill="none"/>`+text(687,389,effect,15)+text(683,420,'Sensation',16)+text(683,451,'Awareness',16)+text(683,482,'Tone',16));
 art+=part(t,'recovery',s,`<rect class="organ-outline" x="532" y="569" width="230" height="48" rx="15" fill="#eef7f2" stroke="#95bca9"/>`+text(647,599,'Recovery varies by type',16));
 art+=text(254,627,'Colored activity is conceptual; this is not an EEG.',16);
 return svg(t,'Neuron anatomy, seizure networks, and observable effects',665,art);
}
export function brainMeaning(s){
 const p=SEIZURE_PATTERNS[s.seizureType],extent=neuralExtent(s),spread=s.seizureSpread&&s.seizureType.startsWith('focal');
 const during=s.organStep===2||s.organStep===3;
 return stats([['Selected onset / pattern',p.label],['Network in this step',extent],['Awareness during event',spread?'Lost after bilateral tonic–clonic spread':p.awareness],['Observable motor pattern',spread?'May evolve to stiffening and rhythmic jerking':p.motor]])+
 note('How the drawing connects to symptoms',during?(spread?'This example starts focally and then recruits bilateral networks. Once it evolves to bilateral tonic–clonic activity, awareness is lost. A known focal beginning still matters for classification.':s.seizureType.startsWith('focal')?'A network within one hemisphere is involved in this example. Effects depend on the network. Focal activity may preserve awareness or impair it; impaired awareness alone does not prove bilateral spread.':'The drawing illustrates distributed activity. Atonic and myoclonic describe movement patterns and can have different onset classifications; visible movements alone do not locate the onset.'):'Normal neurons communicate continuously. A seizure is abnormal excessive activity in networks, and after the event recovery depends on its type. The gray network is regulated activity, not an inactive brain.','organ-change')+
 note('What the chosen pattern looks like',spread?`At focal onset: ${p.phases[1][1]} If the event then becomes bilateral tonic–clonic, awareness is lost and stiffening can be followed by rhythmic jerking. Postictal confusion or sleepiness may follow that bilateral event.`:p.phases.slice(1).map(([label,body])=>`${label}: ${body}`).join(' '))+
 note('Electrical activity versus visible movement','One neuron’s impulse is a teaching inset. The brain diagram shows networks, and the person panel shows possible consequences. It does not measure voltage, diagnose a seizure, or imply every involved network produces convulsions.')+
 note('Connect recognition to safe observation','Time the event, protect from injury, and assess breathing and recovery. Do not restrain the person or put objects in the mouth. Seek emergency help for activity lasting over five minutes, repeated events without recovery, or breathing difficulty.');
}
