import assert from 'node:assert/strict';
import {COURSE} from '../data.mjs';
import {PACKETS} from '../question-bank.mjs';
import {ALL_LESSONS,ALL_QUESTIONS,QUESTION_MAP,blankState,normalizeState,buildTopicQuiz,buildExam,buildPractice,makeSession,submitAnswer} from '../engine.mjs';
import {FORMAT_LABELS,selectQuestions,bankStatus,adaptRound,recordLearning,gradeResponse} from '../adaptive.mjs';
import {formatPicker,formatHelp,questionStemHTML,caseCluesHTML,choiceRationalesHTML} from '../quiz-ui.mjs';
const rng=()=>{let n=837;return()=>{n=n*16807%2147483647;return(n-1)/2147483646;};};
const cases=ALL_QUESTIONS.filter(q=>q.scenario);
assert.equal(cases.length,128);assert.equal(ALL_QUESTIONS.length,640);
assert.equal(new Set(cases.map(q=>q.prompt)).size,128,'cases must have distinct presentations and questions');
for(const l of ALL_LESSONS){
 const qs=l.questions.filter(q=>q.scenario);
 assert.equal(qs.length,4,l.id);assert.equal(new Set(qs.map(q=>q.conceptId)).size,3,l.id);
 for(const q of qs){
  assert.equal(q.kind,'quiz');assert.equal(q.format,'mcq');
  assert(PACKETS.some(p=>p.id===q.conceptId&&p.lessonId===l.id));
  assert(q.case.presentation&&q.case.ask&&q.case.findings.length);
  assert.equal(q.clues.length,2);assert(q.clues.every(c=>c.length>20));
  assert(q.wrong.every(w=>w[1].length>40),'choice-specific rationale: '+q.id);
  assert.equal(new Set(q.wrong.map(w=>w[1])).size,3);
  assert(gradeResponse(q,q.answer).correct);
  for(const [wrong] of q.wrong)assert(!gradeResponse(q,wrong).correct);
  const stem=questionStemHTML(q);assert(stem.includes('Patient presentation')&&stem.includes('Findings'));
  assert(!stem.includes('Key clues in this case'),'do not show reasoning before submission');
  assert(caseCluesHTML(q).includes('Key clues in this case'));
  assert(choiceRationalesHTML(q).includes('Why the other choices differ'));
 }
}
const locked=blankState();assert.throws(()=>buildTopicQuiz(locked,'shock',15,rng(),'case'),/Complete/);
assert.throws(()=>buildPractice(locked,'shock',10,'case'),/review and mastery/);
const ready=blankState();
for(const t of COURSE){for(const l of t.lessons){ready.mastered[l.id]=true;ready.reviewed[l.id]=true;}ready.mastered['quiz:'+t.id]=true;}
for(const t of COURSE){
 const qs=buildTopicQuiz(ready,t.id,15,rng(),'case');
 assert.equal(qs.length,15);assert(qs.every(q=>q.scenario&&q.topicId===t.id));
 assert.equal(new Set(qs.map(q=>q.lessonId)).size,t.lessons.length);
 const status=bankStatus(ready,t.lessons.flatMap(l=>l.questions),'case');
 assert.equal(status.total,t.lessons.length*4);assert.equal(status.fresh,status.total);
}
for(const n of [10,20,30,50]){
 const qs=buildExam(ready,n,rng(),'case');assert.equal(qs.length,n);
 assert(qs.every(q=>q.scenario));assert.equal(new Set(qs.map(q=>q.id)).size,n);
 for(const t of COURSE)assert.equal(qs.filter(q=>q.topicId===t.id).length,n/5);
}
// A missed mechanism gets a different patient case after two intervening tasks.
const first=QUESTION_MAP['s3-case-hemorrhage-pulse'];
const scope=COURSE[0].lessons.map(l=>l.id);
const other=selectQuestions(ready,cases.filter(q=>q.topicId==='shock'&&!q.conceptIds.includes(first.conceptId)),9,{format:'case',rng:rng()});
const round=makeSession('practice',[first,...other],{topicId:'shock',format:'case',scopeLessons:scope},rng());
const wrong=submitAnswer(round,first.wrong[0][0],ready);
assert(adaptRound(ready,round,first,wrong,rng()));
const follow=QUESTION_MAP[round.ids[3]];
assert.equal(follow.id,'s3-case-skin-and-brain');assert.equal(follow.conceptId,first.conceptId);
assert(round.ids.every(id=>QUESTION_MAP[id].scenario));assert.equal(new Set(round.ids).size,round.ids.length);
assert(round.reasons[follow.id].includes('two other questions'));
// Newly mastered successes do not immediately return in another situational round.
const rotation=blankState();for(const q of round.ids.map(id=>QUESTION_MAP[id]))recordLearning(rotation,q,{correct:true});
const fresh=selectQuestions(rotation,cases.filter(q=>q.topicId==='shock'),15,{format:'case',rng:rng()});
assert(fresh.every(q=>!round.ids.includes(q.id)),'recently correct cases repeated');
// Topic adaptation must retain both coverage and case-only selection.
const qs=buildTopicQuiz(blankStateWithMastery(),'shock',15,rng(),'case');
const topicRound=makeSession('quiz',qs,{topicId:'shock',format:'case'},rng());
const counts=()=>Object.fromEntries(scope.map(id=>[id,topicRound.ids.filter(qid=>QUESTION_MAP[qid].lessonId===id).length]));
const before=counts();
const index=topicRound.ids.findIndex((id,i)=>i+3<15&&topicRound.ids.some((other,j)=>j>=i+3&&QUESTION_MAP[other].lessonId===QUESTION_MAP[id].lessonId));
assert(index>=0);topicRound.index=index;const q=QUESTION_MAP[topicRound.ids[index]];
const topicState=blankStateWithMastery();const a=submitAnswer(topicRound,q.wrong[0][0],topicState);
assert(adaptRound(topicState,topicRound,q,a,rng()));assert.deepEqual(counts(),before);
assert(topicRound.ids.every(id=>QUESTION_MAP[id].scenario));
function blankStateWithMastery(){const state=blankState();for(const l of COURSE[0].lessons){state.mastered[l.id]=true;state.reviewed[l.id]=true;}return state;}
ready.quizPreferences={topic:'case',practice:'case',exam:'case'};ready.session=round;
const restored=normalizeState(JSON.parse(JSON.stringify(ready)));
assert.deepEqual(restored.quizPreferences,ready.quizPreferences);assert.equal(restored.session.format,'case');
assert.equal(FORMAT_LABELS.case,'Situational cases');assert(formatPicker('quiz-format','case').includes('value="case" selected'));
assert(formatHelp('case').includes('laboratory'));
console.log('PASS: 128 distinct patient cases, lesson/concept relevance, case-only quizzes/exams, balanced coverage, specific distractor feedback, fresh follow-ups, repeat avoidance, and saved case preferences.');
