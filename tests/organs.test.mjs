import assert from 'node:assert/strict';
import fs from 'node:fs';
import {COURSE} from '../data.mjs';
import {initialVisualState,updateVisualState,SHOCK_CASES,ANEMIA_CASES,SEIZURE_PATTERNS,HIV_TARGETS,thyroidPattern} from '../visual-models.mjs';
import {ORGAN_PARTS,CIRCULATION_STEPS} from '../organ-content.mjs';
import {journey,valveState,neuralExtent,boundOxygenContent,boundOxygenDelivery} from '../organ-models.mjs';
import {visualLabHTML} from '../visuals.mjs';
import {organSceneHTML} from '../organ-explorer.mjs';

const lessons=Object.fromEntries(COURSE.map(t=>[t.id,t.lessons[0]]));
const set=(state,key,value)=>updateVisualState(state,key,value,lessons[state.topicId]);
const initial=id=>initialVisualState(id,lessons[id].id);
const approx=(actual,expected)=>assert(Math.abs(actual-expected)<1e-9,`${actual} != ${expected}`);
approx(boundOxygenContent(15,98),19.698);
approx(boundOxygenDelivery(15,98,5),984.9);
approx(boundOxygenContent(7.5,98),boundOxygenContent(15,98)/2);
approx(boundOxygenDelivery(15,98,10),boundOxygenDelivery(15,98,5)*2);
assert(boundOxygenContent(7.5,100)<boundOxygenContent(15,98),'high saturation must not replace missing Hb');
assert.deepEqual([0,1,2,3].map(i=>[valveState(i).av,valveState(i).out]),[['Open','Closed'],['Closed','Closed'],['Closed','Open'],['Closed','Closed']]);
assert.deepEqual(CIRCULATION_STEPS.map(x=>x[1]),['vena','ra','tricuspid','rv','pulmonary','lungs','veins','la','mitral','lv','aorta','body']);

let s=initial('shock');
s=set(s,'organStep',999);assert.equal(s.organStep,11);assert.equal(s.organPart,'body');
s=set(s,'organMove',1);assert.equal(s.organStep,11);
s=set(s,'heartView','cycle');assert.equal(s.organStep,0);assert.equal(journey(s).length,4);
s=set(s,'organStep',2.9);assert.equal(s.organStep,2);
s=set(s,'heartView','signals');assert.equal(s.organPart,'sa');assert.equal(journey(s).length,5);
s=set(s,'organStep',2);assert.equal(s.organPart,'av');
s=set(s,'organPart','bad');assert.equal(s.organPart,'av');
s=set(s,'heartView','invalid');assert.equal(s.heartView,'signals');
s=set(s,'organStep',-9);assert.equal(s.organStep,0);
s=initial('anemia');s=set(s,'saturation',999);assert.equal(s.saturation,100);s=set(s,'saturation',-4);assert.equal(s.saturation,50);
s=set(s,'bloodFlow',99);assert.equal(s.bloodFlow,10);s=set(s,'bloodFlow',1);assert.equal(s.bloodFlow,2);
s=initial('thyroid');s=set(s,'thyroidCause','graves');assert.equal(s.thyroidOutput,2);assert.equal(s.central,false);assert.equal(thyroidPattern(s.thyroidOutput,s.central).tsh,'Low');
s=set(s,'thyroidPreset','bad');assert.equal(s.thyroidCause,'graves');
s=set(s,'thyroidPreset','low');assert.equal(s.thyroidCause,'primary');assert.equal(thyroidPattern(s.thyroidOutput,s.central).tsh,'High');
s=set(s,'thyroidCause','central');assert(s.central);assert.equal(s.thyroidOutput,0);
s=set(s,'showGoiter',true);assert(s.showGoiter);assert.equal(s.thyroidOutput,0,'size cannot change function');
s=set(s,'thyroidOutput',2);assert(!s.central);assert.equal(s.thyroidCause,'primary');
s=initial('seizures');assert.equal(neuralExtent(s),'resting');
s=set(s,'organStep',2);assert.equal(neuralExtent(s),'focal');
s=set(s,'seizureSpread',true);assert.equal(neuralExtent(s),'bilateral spread');
s=set(s,'seizureType','absence');assert(!s.seizureSpread);assert.equal(s.organPart,'bilateral');assert.equal(neuralExtent(s),'distributed example');
s=set(s,'seizureSpread',true);assert(!s.seizureSpread);
s=set(s,'organStep',4);assert.equal(neuralExtent(s),'resting');
s=initialVisualState('hiv','h2');assert.equal(s.organPart,'rna');
s=set(s,'hivStep',3.9);assert.equal(s.hivStep,3);assert.equal(s.organPart,'nucleus');
s=set(s,'hivStep',999);assert.equal(s.hivStep,6);assert.equal(s.organPart,'protease');
s=set(s,'organStep',999);assert.equal(s.organStep,0,'HIV uses its own seven-step sequence');
s=set(s,'showReservoir',true);s=set(s,'hivTarget','integrase');assert(s.showReservoir);

let checked=0;
function check(state,lesson=lessons[state.topicId]){
 const t=COURSE.find(t=>t.id===state.topicId),html=visualLabHTML(t,lesson,state);
 assert(!/undefined|NaN|Infinity/.test(html),`${t.id}: invalid output`);
 const ids=[...html.matchAll(/\bid="([^"]+)"/g)].map(x=>x[1]);
 assert.equal(new Set(ids).size,ids.length,`${t.id}: duplicate IDs`);
 assert(html.includes('Inspect a part')&&html.includes('role="button"')&&html.includes('tabindex="0"'));
 assert(html.includes('What it normally does')&&html.includes('Why it matters'));
 assert(html.includes('Reveal the mechanism')||html.includes('Hide the explanation'));
 for(const [id,p] of Object.entries(ORGAN_PARTS[t.id]))assert(p.job.length>30&&p.why.length>45,id);
 const source=t.source;assert(html.includes(source));
 checked++;
 return html;
}
for(const t of COURSE)for(const l of t.lessons)check(initialVisualState(t.id,l.id),l);
for(const view of ['flow','cycle','signals'])for(const shock of Object.keys(SHOCK_CASES)){
 s=set(set(initial('shock'),'heartView',view),'shockCase',shock);
 for(let step=0;step<journey(s).length;step++)check(set(s,'organStep',step));
}
for(const pattern of Object.keys(ANEMIA_CASES))for(const hb of [3,7.5,18])for(const sat of [50,98,100]){
 s=set(set(set(initial('anemia'),'anemiaCase',pattern),'hb',hb),'saturation',sat);check(set(s,'bloodFlow',10));
}
for(const preset of ['balanced','low','high','central'])for(const goiter of [false,true]){
 s=set(set(initial('thyroid'),'thyroidPreset',preset),'showGoiter',goiter);
 for(const target of ['none','replacement','synthesis','symptoms'])check(set(s,'target',target));
}
check(set(initial('thyroid'),'thyroidCause','graves'));
for(const type of Object.keys(SEIZURE_PATTERNS))for(const step of [0,2,3,4]){
 s=set(set(initial('seizures'),'seizureType',type),'organStep',step);check(s);
 if(type.startsWith('focal'))check(set(s,'seizureSpread',true));
}
for(const target of Object.keys(HIV_TARGETS))for(let step=0;step<7;step++)for(const reservoir of [false,true]){
 s=set(set(set(initial('hiv'),'hivTarget',target),'hivStep',step),'showReservoir',reservoir);check(set(s,'art',true));
}
const out='./test-output/organ-markup';fs.mkdirSync(out,{recursive:true});
const examples={
 'heart-flow':set(initial('shock'),'organStep',9),
 'heart-valves':set(set(initial('shock'),'heartView','cycle'),'organStep',2),
 'heart-signals':set(set(initial('shock'),'heartView','signals'),'organStep',3),
 'blood-iron':set(set(initial('anemia'),'anemiaCase','iron'),'hb',7.5),
 'blood-sickle':set(initial('anemia'),'anemiaCase','sickle'),
 'thyroid-graves':set(set(initial('thyroid'),'thyroidCause','graves'),'organStep',2),
 'thyroid-central':set(set(initial('thyroid'),'thyroidCause','central'),'showGoiter',true),
 'brain-focal':set(initial('seizures'),'organStep',2),
 'brain-spread':set(set(initial('seizures'),'organStep',2),'seizureSpread',true),
 'hiv-reservoir':set(set(set(initial('hiv'),'hivStep',3),'hivTarget','integrase'),'showReservoir',true)
};
for(const [name,state] of Object.entries(examples)){
 const t=COURSE.find(t=>t.id===state.topicId),html=organSceneHTML(t,lessons[t.id],state);
 fs.writeFileSync(`${out}/${name}.html`,html);
 const svg=html.match(/<svg\b[\s\S]*?<\/svg>/)[0].replace('<defs>','<style>.organ-selected .organ-outline {stroke:#007f70;stroke-width:5px;stroke-dasharray:9 4}</style><defs>');
 fs.writeFileSync(`${out}/${name}.svg`,svg);
}
console.log(`PASS: ${checked} organ states; circulation order, valve timing, oxygen amount/saturation/flow, thyroid signal/size independence, network spread, HIV targets/reservoirs, accessibility, and unique control IDs.`);
