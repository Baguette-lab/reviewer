import assert from 'node:assert/strict';
import {COURSE} from '../data.mjs';
import {PACKETS} from '../question-bank.mjs';
import {ALL_QUESTIONS,QUESTION_MAP,blankState,normalizeState,buildTopicQuiz,buildPractice,buildMastery,makeSession,submitAnswer,finishSession,topicUnlocked} from '../engine.mjs';
import {gradeResponse,recordLearning,selectQuestions,adaptRound,bankStatus,repeatReason} from '../adaptive.mjs';
const rng=()=>{let n=491;return()=>{n=n*16807%2147483647;return(n-1)/2147483646;};};
const state=blankState();
assert.equal(ALL_QUESTIONS.length,640);assert.equal(PACKETS.length,96);
assert.equal(new Set(ALL_QUESTIONS.map(q=>q.id)).size,640);
const packetIds=new Set(PACKETS.map(p=>p.id));
for(const q of ALL_QUESTIONS){
 for(const id of q.conceptIds)assert(packetIds.has(id)||id.includes('-legacy-'),q.id+': '+id);
 if(['short','explain'].includes(q.format)){
  assert(gradeResponse(q,q.answer).correct,q.id+' model response rejected');
  assert(!gradeResponse(q,'I do not know').correct,q.id+' nonanswer accepted');
  assert(!gradeResponse(q,'completely unrelated response').correct,q.id+' irrelevant response accepted');
 }else if(q.format==='match'){
  const correct=Object.fromEntries(q.pairs.map(p=>[p.id,p.answer]));
  assert(gradeResponse(q,correct).correct);
  const rotated=Object.fromEntries(q.pairs.map((p,i)=>[p.id,q.pairs[(i+1)%3].answer]));
  assert(!gradeResponse(q,rotated).correct);
  assert.throws(()=>gradeResponse(q,Object.fromEntries(q.pairs.map(p=>[p.id,q.pairs[0].answer]))),/once/);
 }
}
// Independent accepted forms and incorrect number/direction boundaries.
assert(gradeResponse(QUESTION_MAP['s1-output-short'],'HR * SV').correct);
assert(!gradeResponse(QUESTION_MAP['s1-output-short'],'HR + SV').correct);
assert(gradeResponse(QUESTION_MAP['a1-erythropoietin-short'],'the erythropoietin').correct);
assert(!gradeResponse(QUESTION_MAP['a1-erythropoietin-short'],'It is not erythropoietin').correct);
assert(gradeResponse(QUESTION_MAP['s1-map-short'],'80 mmHg').correct);
assert(!gradeResponse(QUESTION_MAP['s1-map-short'],'70 mmHg, not 80 mmHg').correct);
assert(gradeResponse(QUESTION_MAP['h3-aids-short'],'less than 200 cells/µL').correct);
assert(!gradeResponse(QUESTION_MAP['h3-aids-short'],'below 2000').correct);
assert(!gradeResponse(QUESTION_MAP['h3-aids-short'],'above 200').correct);
assert(!gradeResponse(QUESTION_MAP['t1-feedback-explain'],'high t4 low tsh negative feedback').correct);
assert(!gradeResponse(QUESTION_MAP['h2-reverse-explain'],'Reverse transcriptase copies DNA to RNA. Integrase inserts viral DNA into host DNA.').correct);
assert.throws(()=>buildPractice(state,'shock'),/review and mastery/);
for(const l of COURSE[0].lessons){state.reviewed[l.id]=true;state.mastered[l.id]=true;}
for(const format of ['mcq','short','explain','match','mixed']){
 const qs=buildTopicQuiz(state,'shock',15,rng(),format);
 assert.equal(new Set(qs.map(q=>q.lessonId)).size,7);
 assert(qs.every(q=>q.topicId==='shock'&&q.kind==='quiz'));
 assert.equal(qs.length,format==='match'?7:15);
 if(format==='mixed')assert.equal(new Set(qs.map(q=>q.format)).size,4);
 else assert(qs.every(q=>q.format===format));
}
const pool=COURSE[0].lessons.flatMap(l=>l.questions.filter(q=>q.kind==='quiz'));
const first=QUESTION_MAP['s1-output-mc'];
const other=selectQuestions(state,pool.filter(q=>!q.conceptIds.includes('s1-output')),9,{format:'mixed',rng:rng()});
const session=makeSession('practice',[first,...other],{topicId:'shock',format:'mixed',scopeLessons:COURSE[0].lessons.map(l=>l.id)},rng());
const wrong=submitAnswer(session,first.wrong[0][0],state);
assert.equal(state.questionHistory[first.id].lastCorrect,false);
const clock=state.questionClock;
assert(adaptRound(state,session,first,wrong,rng()));
const follow=QUESTION_MAP[session.ids[3]];
assert.notEqual(follow.id,first.id);assert(follow.conceptIds.includes('s1-output'));
assert((follow.difficulty||1)<=first.difficulty,'a missed application should get a manageable fresh task');
assert.equal(new Set(session.ids).size,session.ids.length);
assert(session.reasons[follow.id].includes('two other questions'));
// Topic-quiz adaptation keeps the original lesson coverage and round length.
const quizState=blankState();for(const l of COURSE[0].lessons){quizState.mastered[l.id]=true;quizState.reviewed[l.id]=true;}
const quizQuestions=buildTopicQuiz(quizState,'shock',15,rng(),'mixed');
const quizSession=makeSession('quiz',quizQuestions,{topicId:'shock',format:'mixed'},rng());
const counts=ids=>Object.fromEntries(COURSE[0].lessons.map(l=>[l.id,ids.filter(id=>QUESTION_MAP[id].lessonId===l.id).length]));
const before=counts(quizSession.ids);
const index=quizSession.ids.findIndex((id,i)=>i+3<15&&quizSession.ids.some((other,j)=>j>=i+3&&QUESTION_MAP[other].lessonId===QUESTION_MAP[id].lessonId));
assert(index>=0);quizSession.index=index;const quizQ=QUESTION_MAP[quizSession.ids[index]];
const simulatedMiss={id:quizQ.id,selected:'not recognized',correct:false,checks:quizQ.format==='match'?quizQ.pairs.map(p=>({id:p.id,matched:false})):undefined};
quizSession.answers.push(simulatedMiss);recordLearning(quizState,quizQ,simulatedMiss);
assert(adaptRound(quizState,quizSession,quizQ,simulatedMiss,rng()));
assert.deepEqual(counts(quizSession.ids),before);assert.equal(quizSession.ids.length,15);
recordLearning(state,first,wrong);assert.equal(state.questionClock,clock,'tracking must be idempotent');
// Rotation excludes recent successes; it returns to an exact question only for need/due recall.
const right=QUESTION_MAP['a1-size-short'];
recordLearning(state,right,{correct:true},1000);
assert.equal(repeatReason(state,right,1001),null);
assert.equal(selectQuestions(state,[right],1,{format:'short',now:1001}).length,0);
assert.equal(repeatReason(state,right,1000+86400001),'spaced');
assert.equal(selectQuestions(state,[first,QUESTION_MAP['s1-output-short']],1,{format:'mixed',now:Date.now()})[0].id,'s1-output-short');
// Wrong rows in a matching set affect only the relevant concepts.
const m=QUESTION_MAP['a4-matching'];
const values=Object.fromEntries(m.pairs.map(p=>[p.id,p.answer]));
[values[m.pairs[0].id],values[m.pairs[1].id]]=[values[m.pairs[1].id],values[m.pairs[0].id]];
const match=gradeResponse(m,values);recordLearning(state,m,match,2000);
assert.equal(state.conceptHistory[m.pairs[2].id].lastCorrect,true);
assert.equal(state.conceptHistory[m.pairs[0].id].lastCorrect,false);
// Preserve old learner progress, new rotation history, and an unfinished written answer.
state.session=makeSession('practice',[QUESTION_MAP['s1-output-short']],{topicId:'shock',format:'short',scopeLessons:['s1']});
state.session.drafts['s1-output-short']='draft with <markup>';
const restored=normalizeState(JSON.parse(JSON.stringify(state)));
assert.deepEqual(restored.questionHistory,state.questionHistory);
assert.deepEqual(restored.session.drafts,state.session.drafts);
const old=blankState();delete old.questionHistory;delete old.conceptHistory;delete old.questionClock;delete old.quizPreferences;
old.mastered.s1=true;old.reviewed.s1=true;old.attempts=[{type:'practice',score:100,date:1000,answers:[{id:'s1-q1',selected:QUESTION_MAP['s1-q1'].answer,correct:true}]}];
const migrated=normalizeState(old);assert(migrated.mastered.s1);assert.equal(migrated.questionHistory['s1-q1'].seen,1);
assert.equal(migrated.quizPreferences.topic,'mixed');
assert.equal(topicUnlocked(state,'anemia'),false,'practice must not unlock the next topic');
const firstMastery=buildMastery(state,'s1',rng());
for(const q of firstMastery)recordLearning(state,q,{correct:true});
const retry=buildMastery(state,'s1',rng());
assert(retry.some(q=>!firstMastery.some(x=>x.id===q.id)),'mastery retries should use fresh alternatives');
console.log('PASS: 640 questions, all written rubrics, matching, answer boundaries, adaptive follow-ups, fresh-first rotation, spaced review, migration, drafts, and mastery alternatives.');
