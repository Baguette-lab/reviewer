import {COURSE} from './data.mjs';
import {normalizeLearning,recordLearning,selectQuestions,gradeResponse,FORMAT_LABELS} from './adaptive.mjs';
export const STORAGE_KEY='pathwise-course-v1';
export const PASS=80;
export const ALL_LESSONS=COURSE.flatMap(t=>t.lessons);
export const ALL_QUESTIONS=ALL_LESSONS.flatMap(l=>l.questions);
export const QUESTION_MAP=Object.fromEntries(ALL_QUESTIONS.map(q=>[q.id,q]));
export const LESSON_MAP=Object.fromEntries(ALL_LESSONS.map(l=>[l.id,l]));
export function blankState(){return {version:1,reviewed:{},mastered:{},knownCards:{},attempts:[],remediation:{},examBest:0,location:{topic:'shock',tab:'review',lesson:'s1'},session:null,questionHistory:{},conceptHistory:{},questionClock:0,quizPreferences:{topic:'mixed',practice:'mixed',exam:'mixed'}};}
export function normalizeState(value){
 const base=blankState();
 if(!value||value.version!==1)return base;
 for(const key of ['reviewed','mastered','knownCards'])if(value[key]&&typeof value[key]==='object'&&!Array.isArray(value[key]))base[key]={...value[key]};
 base.attempts=Array.isArray(value.attempts)?value.attempts.filter(a=>a&&typeof a.score==='number'&&Array.isArray(a.answers)).slice(-40):[];
 base.remediation=value.remediation&&typeof value.remediation==='object'&&!Array.isArray(value.remediation)?value.remediation:{};
 base.examBest=Number.isFinite(value.examBest)?Math.max(0,Math.min(100,value.examBest)):0;
 if(value.location&&typeof value.location==='object')base.location={...base.location,...value.location};
 Object.assign(base,normalizeLearning(value));
 for(const key of ['topic','practice','exam'])if(Object.hasOwn(FORMAT_LABELS,value.quizPreferences?.[key]))base.quizPreferences[key]=value.quizPreferences[key];
 if(!value.questionHistory)for(const attempt of base.attempts)for(const original of attempt.answers){const q=QUESTION_MAP[original.id];if(q)recordLearning(base,q,{...original,tracked:false},attempt.date||0);}
 if(value.session&&Array.isArray(value.session.ids)&&value.session.ids.length>0&&new Set(value.session.ids).size===value.session.ids.length&&value.session.ids.every(id=>QUESTION_MAP[id])&&Array.isArray(value.session.answers)&&value.session.answers.every(a=>a&&QUESTION_MAP[a.id]&&value.session.ids.includes(a.id)&&typeof a.selected==='string'&&typeof a.correct==='boolean')&&new Set(value.session.answers.map(a=>a.id)).size===value.session.answers.length&&Number.isInteger(value.session.index)&&value.session.index>=0&&value.session.index<value.session.ids.length&&value.session.choices&&value.session.ids.every(id=>{const q=QUESTION_MAP[id],c=value.session.choices[id];return Array.isArray(c)&&(q.format==='mcq'?c.length===4&&new Set(c).size===4&&c.every(x=>[q.answer,...q.wrong.map(w=>w[0])].includes(x)):q.format==='match'?c.length===q.pairs.length&&new Set(c).size===c.length&&c.every(x=>q.pairs.some(p=>p.answer===x)):c.length===0);})&&['mastery','quiz','exam','practice'].includes(value.session.mode))base.session=value.session;
 return base;
}
export const shuffle=(items,rng=Math.random)=>{
 const a=[...items];for(let i=a.length-1;i>0;i--){const j=Math.floor(rng()*(i+1));[a[i],a[j]]=[a[j],a[i]];}return a;
};
export const getTopic=id=>COURSE.find(t=>t.id===id);
export const latestAttempt=(state,type,topicId)=>[...state.attempts].reverse().find(a=>a.type===type&&(!topicId||a.topicId===topicId));
export const topicPassed=(state,id)=>!!state.mastered['quiz:'+id]||state.attempts.some(a=>a.type==='quiz'&&a.topicId===id&&a.passed);
export const topicUnlocked=(state,id)=>{
 const i=COURSE.findIndex(t=>t.id===id);return i>=0&&COURSE.slice(0,i).every(t=>topicPassed(state,t.id));
};
export const pendingRemediation=(state,id)=>(state.remediation[id]||[]).filter(x=>LESSON_MAP[x]);
export const topicReady=(state,id)=>{
 const topic=getTopic(id);return !!topic&&topicUnlocked(state,id)&&topic.lessons.every(l=>state.mastered[l.id])&&pendingRemediation(state,id).length===0;
};
export const examUnlocked=state=>COURSE.every(t=>topicPassed(state,t.id));
export const lessonAvailable=(state,id)=>{
 const lesson=LESSON_MAP[id];if(!lesson||!topicUnlocked(state,lesson.topicId))return false;
 // Reviews and flashcards within the unlocked topic can be revisited freely.
 return true;
};
export function gradeAnswers(answers,total){
 const correct=answers.filter(a=>a.correct===true).length;
 const score=total?Math.round(100*correct/total):0;
 return {correct,total,score,passed:total>0&&correct/total>=PASS/100};
}
export function makeSession(mode,questions,context={},rng=Math.random){
 if(!questions.length)throw new Error('No questions are available for this activity.');
 return {mode,ids:questions.map(q=>q.id),index:0,answers:[],choices:Object.fromEntries(questions.map(q=>[q.id,q.format==='match'?shuffle(q.pairs.map(p=>p.answer),rng):q.format==='mcq'?shuffle([q.answer,...q.wrong.map(w=>w[0])],rng):[]])),drafts:{},...context};
}
export function submitAnswer(session,text,state){
 const question=QUESTION_MAP[session.ids[session.index]];
 if(!question||session.answers.some(a=>a.id===question.id))throw new Error('This question has already been answered.');
 const answer=gradeResponse(question,text);
 session.answers.push(answer);if(state)recordLearning(state,question,answer);delete session.drafts?.[question.id];return answer;
}
export function buildTopicQuiz(state,topicId,count=15,rng=Math.random,format='mcq'){
 if(!topicReady(state,topicId))throw new Error('Complete each lesson’s review and mastery checks before taking this topic quiz.');
 const topic=getTopic(topicId);
 const questions=selectQuestions(state,topic.lessons.flatMap(l=>l.questions.filter(q=>q.kind==='quiz')),count,{format,rng,balanceLessons:true});
 if(!questions.length)throw new Error('Fresh questions in this format have been used. Choose another format or return when a review is due.');
 return shuffle(questions,rng);
}
export function buildExam(state,count=30,rng=Math.random,format='mcq'){
 if(!examUnlocked(state))throw new Error('Pass all five topic quizzes to unlock the mixed exam.');
 if(![10,20,30,50].includes(count))throw new Error('Choose 10, 20, 30, or 50 questions.');
 const groups=COURSE.map(t=>selectQuestions(state,t.lessons.flatMap(l=>l.questions.filter(q=>q.kind==='quiz')),count/5,{format,rng,balanceLessons:true}));
 if(groups.some(g=>g.length<count/5))throw new Error('There are not enough eligible questions for that balanced exam. Choose a shorter exam or another format.');
 const picked=groups.flat();
 return shuffle(picked,rng);
}
export function buildMastery(state,lessonId,rng=Math.random){
 const l=LESSON_MAP[lessonId];if(!l||!topicUnlocked(state,l.topicId)||!state.reviewed[lessonId])throw new Error('Review this lesson before its mastery checks.');
 const pool=l.questions.filter(q=>q.format==='mcq'&&(q.kind==='mastery'||q.id.endsWith('-mc')));
 // A retry follows an identified need; use fresh alternatives before the necessary review.
 const fresh=selectQuestions(state,pool,3,{format:'mcq',rng});
 if(fresh.length===3)return fresh;
 return [...fresh,...shuffle(pool.filter(q=>!fresh.some(x=>x.id===q.id)),rng)].slice(0,3);
}
export function buildPractice(state,topicId,count=10,format='mixed',focusLessons=[],rng=Math.random){
 if(topicId==='all'?!examUnlocked(state):!topicUnlocked(state,topicId))throw new Error('Unlock the requested topics first.');
 const candidates=topicId==='all'?ALL_LESSONS:getTopic(topicId).lessons;
 const lessons=candidates.filter(l=>state.mastered[l.id]&&state.reviewed[l.id]&&!pendingRemediation(state,l.topicId).includes(l.id));
 const scope=focusLessons.length?lessons.filter(l=>focusLessons.includes(l.id)):lessons;
 if(!scope.length)throw new Error('Complete review and mastery for at least one lesson before practice.');
 const questions=selectQuestions(state,scope.flatMap(l=>l.questions.filter(q=>q.kind==='quiz')),count,{format,rng,focusLessons});
 if(!questions.length)throw new Error('No fresh or due questions remain in this format. Try another format or return later for spaced review.');
 return {questions,scopeLessons:scope.map(l=>l.id)};
}
export function finishSession(state,session,now=Date.now()){
 if(session.answers.length!==session.ids.length)throw new Error('Answer every question before completing this activity.');
 const result=gradeAnswers(session.answers,session.ids.length);
 for(const answer of session.answers)recordLearning(state,QUESTION_MAP[answer.id],answer,now);
 if(session.mode==='mastery'){
  result.passed=result.correct===result.total;
  if(result.passed){
   state.mastered[session.lessonId]=true;
   state.remediation[session.topicId]=pendingRemediation(state,session.topicId).filter(id=>id!==session.lessonId);
  }else state.reviewed[session.lessonId]=false;
 }
 if(session.mode==='quiz'&&!result.passed){
  const ids=session.answers.filter(a=>!a.correct).map(a=>QUESTION_MAP[a.id].lessonId);
  state.remediation[session.topicId]=[...new Set([...pendingRemediation(state,session.topicId),...ids])];
  for(const id of ids)state.reviewed[id]=false;
 }
 if(session.mode==='exam')state.examBest=Math.max(state.examBest,result.score);
 const attempt={id:String(now)+'-'+Math.random().toString(36).slice(2,8),date:now,type:session.mode,topicId:session.topicId??null,lessonId:session.lessonId??null,format:session.format||'mcq',answers:[...session.answers],...result};
 state.attempts=[...state.attempts,attempt].slice(-40);
 // Retain quiz completions separately so a long history cannot relock a passed course.
 if(session.mode==='quiz'&&result.passed)state.mastered['quiz:'+session.topicId]=true;
 state.session=null;
 return attempt;
}
export function courseProgress(state){
 return {lessons:ALL_LESSONS.filter(l=>state.mastered[l.id]).length,totalLessons:ALL_LESSONS.length,topics:COURSE.filter(t=>topicPassed(state,t.id)).length,totalTopics:COURSE.length,cards:ALL_LESSONS.flatMap(l=>l.cards).filter(c=>state.knownCards[c.id]).length,totalCards:ALL_LESSONS.reduce((n,l)=>n+l.cards.length,0)};
}
export function answerReason(question,selected){return question.format==='mcq'?(selected===question.answer?question.explanation:question.wrong.find(w=>w[0]===selected)?.[1]||'Review the mechanism in the linked lesson.'):'Compare your response with the expected answer and the lesson mechanism. Written checks recognize key ideas; matching requires every pair to fit.';}
