import assert from 'node:assert/strict';
import fs from 'node:fs';
import {COURSE} from '../data.mjs';
import {STORAGE_KEY,QUESTION_MAP,LESSON_MAP,normalizeState,topicUnlocked} from '../engine.mjs';
// DOM event harness: drives the actual app event handlers and checks rendered states.
// This verifies behavior and markup; it does not replace a native browser visual review.
const values=new Map();
const captures=[];
const tools=new Map();
const nodes=new Map();
class FakeNode{
 constructor(id=''){this.id=id;this.innerHTML='';this.listeners={};this.disabled=false;this.dataset={};this.children=[];}
 addEventListener(name,fn){this.listeners[name]=fn;}
 setAttribute(){}
 append(child){this.children.push(child);}
 remove(){}
 focus(){this.focused=true;}
 showModal(){this.open=true;}
 close(){this.open=false;}
 querySelector(selector){if(selector.includes('data-action="answer"'))return new FakeNode('answer');return null;}
}
const root=new FakeNode('app');nodes.set('app',root);
nodes.set('main',new FakeNode('main'));nodes.set('confirm-dialog',new FakeNode('confirm-dialog'));
globalThis.document={getElementById:id=>nodes.get(id)||null,querySelector:()=>null,createElement:()=>new FakeNode(),body:new FakeNode('body'),modelContext:{registerTool(tool){tools.set(tool.name,tool);}}};
globalThis.window={scrollTo(){},addEventListener(){}};
globalThis.localStorage={getItem:key=>values.get(key)||null,setItem:(key,value)=>values.set(key,value),removeItem:key=>values.delete(key)};
const originalTimeout=globalThis.setTimeout;globalThis.setTimeout=(fn)=>0;
await import('../app.mjs');
function click(action,data={}){
 const element={dataset:{action,...data},disabled:false};
 root.listeners.click({target:{closest:()=>element}});
}
function changeAnswer(text){root.listeners.change({target:{value:text,matches:s=>s==='input[name="answer"]'}});}
function changedSelect(id,value){root.listeners.change({target:{id,value,matches:()=>false}});}
function saved(){return JSON.parse(values.get(STORAGE_KEY)||'null');}
function session(){return saved()?.session;}
function fillAnswer(correct=true){
 const s=session();assert(s,'expected active saved activity');const q=QUESTION_MAP[s.ids[s.index]];
 if(q.format==='mcq')changeAnswer(correct?q.answer:q.wrong[0][0]);
 else if(q.format==='match')q.pairs.forEach((p,i)=>root.listeners.change({target:{id:'match-'+p.id,dataset:{matchId:p.id},value:correct?p.answer:q.pairs[(i+1)%q.pairs.length].answer,matches:()=>false}}));
 else root.listeners.input({target:{id:'written-answer',value:correct?q.answer:'I do not know',dataset:{}}});
}
function respond(correct=true){
 const s=session();fillAnswer(correct);click('answer');
 if(s.mode!=='exam')click('next-question');
}
assert(root.innerHTML.includes('Blood flow &amp; oxygen delivery'));
click('tab',{tab:'visuals'});
assert(root.innerHTML.includes('Visual Lab'));assert(root.innerHTML.includes('5.60'));
const beforeExploring=JSON.stringify(saved());
click('viz',{key:'heartView',value:'cycle'});click('viz',{key:'organStep',value:'2'});
assert(root.innerHTML.includes('Eject blood')&&root.innerHTML.includes('Tricuspid + mitral'));
click('viz',{key:'heartView',value:'signals'});
const avNode=new FakeNode('organ-part-shock-av');avNode.dataset={value:'av'};nodes.set(avNode.id,avNode);
let prevented=false;
root.listeners.keydown({key:'Enter',target:{closest:selector=>selector==='.organ-hotspot'?avNode:null},preventDefault(){prevented=true;}});
assert(prevented&&avNode.focused);assert(root.innerHTML.includes('organ-part-shock-av" class="organ-hotspot organ-selected'));
root.listeners.keydown({key:' ',target:{closest:()=>avNode},preventDefault(){}});
click('viz',{key:'exploreReveal',value:'true'});assert(root.innerHTML.includes('An electrical signal.'));
assert.equal(JSON.stringify(saved()),beforeExploring,'exploration must not change mastery or saved answers');
nodes.delete(avNode.id);click('viz',{key:'heartView',value:'flow'});
root.listeners.input({target:{id:'viz-hr',value:'120',dataset:{vizKey:'hr'},type:'range'}});
assert(root.innerHTML.includes('8.40'));assert.equal(Object.keys(saved().mastered).length,0);
click('viz',{key:'mode',value:'pressure'});assert(root.innerHTML.includes('80.0'));
click('viz',{key:'mode',value:'compare'});click('viz',{key:'shockCase',value:'obstructive'});
assert(root.innerHTML.includes('mechanical obstacle'));
click('viz',{key:'lessonStep',value:'3'});assert(root.innerHTML.includes('hemoglobin carries its oxygen'));
click('tab',{tab:'review'});
assert(root.innerHTML.includes('disabled aria-label="Anemia locked'));
click('tab',{tab:'quiz'});
assert(root.innerHTML.includes('Build mastery before the quiz'));
click('start-quiz');assert(!session());
click('topic',{topic:'anemia'});assert(root.innerHTML.includes('Shock'));
click('review-lesson',{lesson:'s1'});
click('start-mastery',{lesson:'s1'});assert(!session());
click('reviewed',{lesson:'s1'});assert(saved().reviewed.s1);
click('start-mastery',{lesson:'s1'});assert(session().mode==='mastery');
respond(false);respond(true);respond(true);
assert(root.innerHTML.includes('Review, then try the checks again'));
assert(!saved().mastered.s1);
click('review-lesson',{lesson:'s1'});click('reviewed',{lesson:'s1'});click('start-mastery',{lesson:'s1'});
respond();respond();respond();assert(saved().mastered.s1);assert(root.innerHTML.includes('Concept mastered'));
captures.push(['review-result',root.innerHTML]);
click('tab',{tab:'flashcards'});assert(root.innerHTML.includes('Show answer'));assert(!root.innerHTML.includes('flash-answer'));
assert(!root.innerHTML.includes('own words'));assert(!root.innerHTML.includes('data-action="card-known"'));
click('card-known');assert(!Object.values(saved().knownCards).some(Boolean));
click('reveal');assert(root.innerHTML.includes('flash-answer'));
assert(root.innerHTML.includes('Answer to memorize'));assert(root.innerHTML.includes('<details class="flash-detail">'));
assert(!root.innerHTML.includes('<details class="flash-detail" open'));
click('card-again');assert(root.innerHTML.includes('Show answer'));
click('reveal');click('card-known');assert(Object.values(saved().knownCards).some(Boolean));
changedSelect('card-filter','lesson');assert(root.innerHTML.includes('6 remaining'));
// Written drafts and matching use the real delegated handlers and preserve the gates.
click('tab',{tab:'practice'});changedSelect('practice-format','short');changedSelect('practice-size','5');click('start-practice');
assert(session().ids.length>0&&session().ids.every(id=>QUESTION_MAP[id].format==='short'));
const draftQuestion=QUESTION_MAP[session().ids[0]];
root.listeners.input({target:{id:'written-answer',value:draftQuestion.answer,dataset:{}}});
assert.equal(session().drafts[draftQuestion.id],draftQuestion.answer);
click('pause-session');click('resume');assert(root.innerHTML.includes(draftQuestion.answer.replace(/&/g,'&amp;')));
for(let i=0,n=session().ids.length;i<n;i++)respond();
assert(root.innerHTML.includes('Practice round complete'));assert(!topicUnlocked(normalizeState(saved()),'anemia'));
click('tab',{tab:'practice'});changedSelect('practice-format','match');click('start-practice');
assert(root.innerHTML.includes('matching-row'));
const mq=QUESTION_MAP[session().ids[0]];
for(const p of mq.pairs)root.listeners.change({target:{dataset:{matchId:p.id},value:mq.pairs[0].answer,matches:()=>false}});
click('answer');assert.equal(session().answers.length,0,'duplicate matching values must not submit');
fillAnswer(true);click('answer');assert(root.innerHTML.includes('Every pair fits'));click('next-question');
for(let i=0,n=session()?.ids.length||0;i<n&&session();i++)respond();
assert(root.innerHTML.includes('Practice round complete'));
captures.push(['written-and-matching-result',root.innerHTML]);
// Patient presentations and reasoning use the same real quiz handlers.
click('tab',{tab:'practice'});changedSelect('practice-format','case');click('start-practice');
assert(session().ids.every(id=>QUESTION_MAP[id].scenario));
assert(root.innerHTML.includes('Patient presentation')&&root.innerHTML.includes('Findings'));
assert(!root.innerHTML.includes('Key clues in this case'));
const caseBefore=session();captures.push(['patient-case',root.innerHTML]);
fillAnswer(false);click('answer');assert(root.innerHTML.includes('Key clues in this case'));
assert(root.innerHTML.includes('Why the other choices differ'));
captures.push(['patient-case-feedback',root.innerHTML]);
click('pause-session');click('resume');assert.deepEqual(session().choices,caseBefore.choices);
click('next-question');while(session())respond();
assert(!topicUnlocked(normalizeState(saved()),'anemia'));
changedSelect('practice-format','mixed');
click('lesson',{lesson:'s2'});click('tab',{tab:'flashcards'});assert(root.innerHTML.includes('What happens to cells &amp; organs'));
for(const t of COURSE){
 for(const l of t.lessons){
  click('review-lesson',{lesson:l.id});
  click('tab',{tab:'visuals'});assert(root.innerHTML.includes('viz-output'));
  click('viz',{key:'lessonStep',value:String(l.flow.length-1)});assert(!root.innerHTML.includes('undefined'));
  if(l.id==='a1'){
   click('viz',{key:'anemiaCase',value:'b12'});assert(root.innerHTML.includes('DNA synthesis'));
   root.listeners.input({target:{id:'viz-hb',value:'7.5',dataset:{vizKey:'hb'},type:'range'}});assert(root.innerHTML.includes('50<small>%'));
   // The partial-update path replaces result markup while retaining active sliders.
   const oldOutput=new FakeNode('viz-output'),scene=new FakeNode('organ-scene');nodes.set(oldOutput.id,oldOutput);nodes.set(scene.id,scene);
   const hbControl={id:'organ-hb',type:'range',dataset:{vizKey:'hb',unit:'g/dL'},value:'7.5'};
   const oldHbControl={id:'viz-hb',type:'range',dataset:{vizKey:'hb',unit:'g/dL'},value:'7.5'};
   const satControl={id:'organ-saturation',type:'range',dataset:{vizKey:'saturation',unit:'%'},value:'75'};
   const satOutput=new FakeNode('organ-value-saturation'),hbOutput=new FakeNode('organ-value-hb');nodes.set(satOutput.id,satOutput);nodes.set(hbOutput.id,hbOutput);
   root.querySelectorAll=selector=>selector==='[data-viz-key]'?[hbControl,oldHbControl,satControl]:[];
   const retainedRoot=root.innerHTML,retainedProgress=JSON.stringify(saved());
   root.listeners.input({target:satControl});assert.equal(root.innerHTML,retainedRoot);assert(scene.innerHTML.includes('7.54 mL O₂/dL'));assert.equal(satOutput.textContent,'75 %');
   hbControl.value='10';root.listeners.input({target:hbControl});assert(scene.innerHTML.includes('10.05 mL O₂/dL'));assert.equal(oldHbControl.value,10);assert.equal(hbOutput.textContent,'10 g/dL');
   assert.equal(JSON.stringify(saved()),retainedProgress);
   delete root.querySelectorAll;for(const id of [oldOutput.id,scene.id,satOutput.id,hbOutput.id])nodes.delete(id);
   click('viz',{key:'organStep',value:'3'});assert(root.innerHTML.includes('10.05 mL O₂/dL'));
  }
  if(l.id==='t1'){
   click('viz',{key:'thyroidPreset',value:'central'});assert(root.innerHTML.includes('inappropriately normal'));
   click('viz',{key:'thyroidPreset',value:'high'});assert(root.innerHTML.includes('Heat intolerance'));
   click('viz',{key:'target',value:'symptoms'});assert(root.innerHTML.includes('beta-blockers')||root.innerHTML.includes('Beta-blockers'));
   root.listeners.change({target:{id:'organ-thyroidCause',dataset:{vizKey:'thyroidCause'},value:'graves',matches:()=>false}});
   assert(root.innerHTML.includes('Graves antibodies')&&root.innerHTML.includes('TSH: Low'));
   root.listeners.change({target:{id:'organ-showGoiter',dataset:{vizKey:'showGoiter'},type:'checkbox',checked:true,matches:()=>false}});
   assert(root.innerHTML.includes('Enlarged: goiter'));
  }
  if(l.id==='e1'){
   click('viz',{key:'seizureType',value:'tonicClonic'});click('viz',{key:'phase',value:'2'});assert(root.innerHTML.includes('rhythmic jerking'));
   click('viz',{key:'seizureType',value:'focalAware'});click('viz',{key:'organStep',value:'2'});click('viz',{key:'seizureSpread',value:'true'});
   assert(root.innerHTML.includes('Focal onset → bilateral spread')&&root.innerHTML.includes('Lost after bilateral tonic–clonic spread'));
  }
  if(l.id==='h1'){
   click('viz',{key:'hivTarget',value:'integrase'});click('viz',{key:'hivStep',value:'3'});assert(root.innerHTML.includes('Drug target disrupts this step'));
   click('viz',{key:'art',value:'true'});assert(root.innerHTML.includes('Falls with suppression'));
   click('viz',{key:'showReservoir',value:'true'});assert(root.innerHTML.includes('Existing integrated')&&root.innerHTML.includes('integrated before the selected block'));
  }
  click('tab',{tab:'review'});
  click('reviewed',{lesson:l.id});
  click('start-mastery',{lesson:l.id});
  respond();respond();respond();
  assert(saved().mastered[l.id],l.id);
 }
 click('tab',{tab:'quiz'});
 assert(root.innerHTML.includes('Begin topic quiz'));
 if(t.id==='anemia')changedSelect('quiz-format','case');
 click('start-quiz');
 assert.equal(session().ids.length,15);
 const qs=session().ids.map(id=>QUESTION_MAP[id]);
 assert(qs.every(q=>q.topicId===t.id),'wrong topic quiz question');
 if(t.id!=='shock')assert(qs.every(q=>q.scenario));
 if(t.id==='shock'){
  // Verify pause and resume preserve both choice order and completed answers.
  const before=session();respond(true);click('pause-session');
  assert(root.innerHTML.includes('Resume activity'));click('resume');
  assert.equal(session().answers.length,1);
  assert.deepEqual(session().choices,before.choices);
  for(let i=1;i<15;i++)respond(i<11);
  assert(root.innerHTML.includes('A few concepts need more practice'));
  assert(!topicUnlocked(normalizeState(saved()),'anemia'));
  click('tab',{tab:'quiz'});assert(root.innerHTML.includes('A few concepts need another look'));
  const remediation=saved().remediation.shock;
  for(const id of remediation){click('review-lesson',{lesson:id});click('reviewed',{lesson:id});click('start-mastery',{lesson:id});respond();respond();respond();}
  click('tab',{tab:'quiz'});click('start-quiz');
 }
 for(let i=0;i<15;i++)respond();
 assert(root.innerHTML.includes('Topic passed'));
 click('next-topic');
}
click('exam');assert(root.innerHTML.includes('Generate a mixed exam'));changedSelect('exam-format','case');
changedSelect('exam-size','10');click('start-exam');assert.equal(session().ids.length,10);
let s=session();const q=QUESTION_MAP[s.ids[0]];
assert(!root.innerHTML.includes('Why your choice does not fit'));
fillAnswer(false);click('answer');
assert.equal(session().index,1);assert(!root.innerHTML.includes('Why your choice does not fit'));
assert(!root.innerHTML.includes('Key clues in this case'),'exam clues must remain hidden before submission');
captures.push(['exam',root.innerHTML]);
for(let i=1;i<10;i++)respond();
assert(root.innerHTML.includes('90%'));assert(root.innerHTML.includes('Answer review'));assert.equal(saved().examBest,90);
assert(root.innerHTML.includes('Key clues in this case')&&root.innerHTML.includes('Why the other choices differ'));
captures.push(['exam-result',root.innerHTML]);
const attempt=saved().attempts.at(-1);click('missed',{attempt:attempt.id});
assert(session().ids.length>0&&session().ids.length<=10);
assert(session().ids.every(id=>QUESTION_MAP[id].lessonId===q.lessonId));
for(let i=0,n=session().ids.length;i<n;i++)respond();
assert(root.innerHTML.includes('Practice round complete'));
// Mock registry checks exercise the WebMCP handlers; native context is unavailable.
assert.deepEqual([...tools.keys()],['read_study_progress','open_study_lesson','start_topic_quiz']);
assert.equal(tools.get('read_study_progress').execute({}).topics.length,5);
assert.throws(()=>tools.get('read_study_progress').execute([]),/No input/);
assert.throws(()=>tools.get('open_study_lesson').execute({lessonId:'invalid'}),/valid lessonId/);
const read=tools.get('open_study_lesson').execute({lessonId:'t2'});assert.equal(read.lessonId,'t2');assert(root.innerHTML.includes('Hypothyroidism: metabolism slows'));
captures.push(['lesson',root.innerHTML]);
click('reset');assert(nodes.get('confirm-dialog').open);click('cancel-confirm');assert.equal(saved().examBest,90);
click('reset');click('confirm');assert.equal(saved().attempts.length,0);assert.equal(saved().location.topic,'shock');
assert.throws(()=>tools.get('open_study_lesson').execute({lessonId:'t2'}),/previous topic/);
assert.throws(()=>tools.get('start_topic_quiz').execute({topicId:'shock'}),/Complete/);
globalThis.setTimeout=originalTimeout;
const out='./test-output/ui-markup';
fs.mkdirSync(out,{recursive:true});for(const [name,html] of captures)fs.writeFileSync(out+'/'+name+'.html',html);
console.log('PASS: actual UI handlers for locked navigation, read-before-mastery, failed round, flashcard reveal/rating, remediation, all five topics, pause/resume, exam feedback timing, review, and reset.');
console.log('LIMITATION: native browser layout and native WebMCP context are unavailable; registry tests use a DOM harness.');
