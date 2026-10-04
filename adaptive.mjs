import {COURSE} from './data.mjs';
export const FORMAT_LABELS={mcq:'Multiple choice',case:'Situational cases',short:'Short answer',explain:'Explain a concept',match:'Matching',mixed:'Mixed formats'};
export const ACTUAL_FORMATS=['mcq','short','explain','match'];
export const matchesFormat=(q,format)=>format==='mixed'||(format==='case'?q.scenario===true:q.format===format);
const BANK=COURSE.flatMap(t=>t.lessons.flatMap(l=>l.questions));
const BY_ID=Object.fromEntries(BANK.map(q=>[q.id,q]));
const CONCEPTS=new Set(BANK.flatMap(q=>q.conceptIds||[q.conceptId]));
const DAY=24*60*60*1000;
const finite=v=>Number.isFinite(v)?Math.max(0,Math.floor(v)):0;
const stats=()=>({seen:0,correct:0,mistakes:0,streak:0,lastStep:0,lastAt:0,lastCorrect:null});
export function normalizeLearning(value){
 const result={questionHistory:{},conceptHistory:{},questionClock:finite(value?.questionClock)};
 for(const [key,valid] of [['questionHistory',id=>!!BY_ID[id]],['conceptHistory',id=>CONCEPTS.has(id)]]){
  const source=value?.[key];if(!source||typeof source!=='object'||Array.isArray(source))continue;
  for(const [id,h] of Object.entries(source))if(valid(id)&&h&&typeof h==='object'){
   const seen=finite(h.seen);result[key][id]={seen,correct:Math.min(seen,finite(h.correct)),mistakes:Math.min(seen,finite(h.mistakes)),streak:Math.min(seen,finite(h.streak)),lastStep:Math.min(result.questionClock,finite(h.lastStep)),lastAt:finite(h.lastAt),lastCorrect:typeof h.lastCorrect==='boolean'?h.lastCorrect:null};
  }
 }
 return result;
}
export function recordLearning(state,q,answer,now=Date.now()){
 if(answer.tracked)return;
 state.questionHistory??={};state.conceptHistory??={};state.questionClock=(state.questionClock||0)+1;
 const update=(map,id,correct)=>{
  const h=map[id]??stats();h.seen++;if(correct){h.correct++;h.streak++;}else{h.mistakes++;h.streak=0;}
  h.lastCorrect=correct;h.lastAt=now;h.lastStep=state.questionClock;map[id]=h;
 };
 update(state.questionHistory,q.id,answer.correct);
 for(const id of q.conceptIds||[q.conceptId]){
  const matched=q.format==='match'?answer.checks?.find(c=>c.id===id)?.matched===true:answer.correct;
  update(state.conceptHistory,id,matched);
 }
 answer.tracked=true;
}
export function needsReview(h){return !!h?.seen&&(h.lastCorrect===false||(h.mistakes>0&&h.streak<2));}
export function repeatReason(state,q,now=Date.now()){
 const h=state.questionHistory?.[q.id];if(!h?.seen)return 'fresh';
 if(needsReview(h)&&(state.questionClock-h.lastStep>=3))return 'repair';
 if(now-h.lastAt>=DAY||state.questionClock-h.lastStep>=24)return 'spaced';
 return null;
}
export function bankStatus(state,pool,format='mixed',now=Date.now()){
 const qs=pool.filter(q=>matchesFormat(q,format));
 return {total:qs.length,fresh:qs.filter(q=>!state.questionHistory?.[q.id]?.seen).length,repair:qs.filter(q=>repeatReason(state,q,now)==='repair').length,spaced:qs.filter(q=>repeatReason(state,q,now)==='spaced').length,eligible:qs.filter(q=>repeatReason(state,q,now)).length};
}
function weakness(state,q){
 return (q.conceptIds||[q.conceptId]).some(id=>needsReview(state.conceptHistory?.[id]));
}
function preferredDifficulty(state,q){
 const hs=(q.conceptIds||[q.conceptId]).map(id=>state.conceptHistory?.[id]);
 const confident=hs.every(h=>h?.streak>=2);
 return confident?3:hs.some(needsReview)?1:2;
}
export function selectQuestions(state,pool,count,{format='mcq',rng=Math.random,balanceLessons=false,focusLessons=[],focusConcepts=[],now=Date.now()}={}){
 if(!Object.hasOwn(FORMAT_LABELS,format))throw new Error('Choose one of the available quiz formats.');
 const candidates=pool.filter(q=>matchesFormat(q,format)&&repeatReason(state,q,now)).map(q=>({q,tie:rng()}));
 const chosen=[],families=new Set(),lessonUse={},formatUse={};
 for(let i=0;i<count;i++){
  const available=candidates.filter(({q})=>!chosen.some(x=>x.id===q.id)&&!(q.conceptIds||[q.conceptId]).some(id=>families.has(id)));
  if(!available.length)break;
  const wantedFormat=format==='mixed'?ACTUAL_FORMATS.filter(f=>available.some(x=>x.q.format===f)).sort((a,b)=>(formatUse[a]||0)-(formatUse[b]||0))[0]:format;
  const focus=q=>focusConcepts.some(id=>(q.conceptIds||[]).includes(id))||focusLessons.includes(q.lessonId);
  const rank=q=>[
   repeatReason(state,q,now)==='fresh'?0:1,
   balanceLessons?(lessonUse[q.lessonId]||0):0,
   format==='mixed'?(q.format===wantedFormat?0:1):0,
   focus(q)?0:weakness(state,q)?1:2,
   Math.abs((q.difficulty||1)-preferredDifficulty(state,q)),
   repeatReason(state,q,now)==='repair'?0:1
  ];
  available.sort((a,b)=>{const ra=rank(a.q),rb=rank(b.q);for(let k=0;k<ra.length;k++)if(ra[k]!==rb[k])return ra[k]-rb[k];return a.tie-b.tie;});
  const q=available[0].q;chosen.push(q);lessonUse[q.lessonId]=(lessonUse[q.lessonId]||0)+1;formatUse[q.format]=(formatUse[q.format]||0)+1;
  for(const id of q.conceptIds||[q.conceptId])families.add(id);
 }
 return chosen;
}
export function learningSummary(state,pool){
 const lessons=[...new Set(pool.map(q=>q.lessonId))];
 return lessons.map(lessonId=>{
  const qs=pool.filter(q=>q.lessonId===lessonId),ids=[...new Set(qs.flatMap(q=>q.conceptIds||[q.conceptId]))];
  const hs=ids.map(id=>state.conceptHistory?.[id]).filter(Boolean);
  return {lessonId,seen:hs.reduce((n,h)=>n+h.seen,0),weak:hs.filter(needsReview).length,fresh:qs.filter(q=>!state.questionHistory?.[q.id]?.seen).length};
 }).sort((a,b)=>b.weak-a.weak||a.seen-b.seen);
}
export function adaptRound(state,session,q,answer,rng=Math.random){
 if(!['practice','quiz'].includes(session.mode)||answer.correct||session.index+3>=session.ids.length)return false;
 const target=session.index+3;
 const sameLessonSlot=session.mode==='quiz'?session.ids.findIndex((id,i)=>i>=target&&BY_ID[id].lessonId===q.lessonId):target;
 if(sameLessonSlot<0)return false;
 const missed=q.format==='match'?answer.checks.filter(c=>!c.matched).map(c=>c.id):(q.conceptIds||[q.conceptId]);
 const answered=new Set(session.answers.map(a=>a.id));
 const format=session.format||'mcq';
 const scope=session.scopeLessons||(session.mode==='quiz'?COURSE.find(t=>t.id===session.topicId)?.lessons.map(l=>l.id):[]);
 const pool=BANK.filter(x=>x.kind==='quiz'&&scope?.includes(x.lessonId)&&!answered.has(x.id)&&matchesFormat(x,format));
 const relevant=pool.filter(x=>(x.conceptIds||[]).some(id=>missed.includes(id))||x.lessonId===q.lessonId);
 const exact=relevant.filter(x=>(x.conceptIds||[]).some(id=>missed.includes(id))&&repeatReason(state,x));
 const [next]=selectQuestions(state,exact.length?exact:relevant,1,{format:session.format||'mcq',rng,focusConcepts:missed});
 if(!next)return false;
 const previous=session.ids.indexOf(next.id);
 if(previous>=0){session.ids.splice(previous,1);session.ids.splice(target,0,next.id);}
 else if(session.mode==='quiz'){session.ids.splice(sameLessonSlot,1);session.ids.splice(target,0,next.id);}
 else session.ids[target]=next.id;
 session.choices[next.id]=next.format==='mcq'?shuffleValues([next.answer,...next.wrong.map(w=>w[0])],rng):next.format==='match'?shuffleValues(next.pairs.map(p=>p.answer),rng):[];
 session.reasons??={};session.reasons[next.id]=exact.length?'A different question revisits '+q.conceptLabel+' after two other questions.':'A different question from the missed lesson appears after two other questions.';
 return true;
}
function shuffleValues(values,rng){const a=[...values];for(let i=a.length-1;i>0;i--){const j=Math.floor(rng()*(i+1));[a[i],a[j]]=[a[j],a[i]];}return a;}
export function normalizedText(text){
 return String(text??'').normalize('NFKC').toLowerCase().replace(/[×*]/g,' times ').replace(/→/g,' to ').replace(/</g,' less than ').replace(/[=.,;:!?()\/\[\]{}_-]/g,' ').replace(/\s+/g,' ').trim();
}
const has=(text,pattern)=>new RegExp(pattern,'i').test(text);
export function gradeResponse(q,response){
 if(q.format==='mcq'||!q.format){
  if(typeof response!=='string'||![q.answer,...q.wrong.map(w=>w[0])].includes(response))throw new Error('Choose one of the available answers.');
  return {id:q.id,selected:response,correct:response===q.answer};
 }
 if(q.format==='match'){
  if(!response||typeof response!=='object'||Array.isArray(response)||Object.keys(response).length!==q.pairs.length||q.pairs.some(p=>typeof response[p.id]!=='string'||!q.pairs.some(x=>x.answer===response[p.id])))throw new Error('Choose an answer for every matching row.');
  if(new Set(Object.values(response)).size!==q.pairs.length)throw new Error('Use each matching answer once.');
  const checks=q.pairs.map(p=>({id:p.id,label:p.prompt,matched:response[p.id]===p.answer,expected:p.answer,selected:response[p.id]}));
  return {id:q.id,selected:q.pairs.map(p=>p.prompt+' → '+response[p.id]).join('\n'),response:{...response},checks,correct:checks.every(c=>c.matched)};
 }
 if(typeof response!=='string'||!response.trim())throw new Error('Write an answer before checking it.');
 if(response.length>4000)throw new Error('Keep the answer under 4,000 characters.');
 const text=normalizedText(response),rejected=(q.reject||[]).some(pattern=>has(text,pattern))||/^(?:i (?:do not|dont|don t) know|idk|no idea)\b/.test(text);
 if(q.format==='short'){
  const negated=/^(?:not|no|it is not|is not|isn t)\s/.test(text)&&!['no','nope','hindi'].includes(normalizedText(q.answer));
  const phrase=text.replace(/^(?:the answer is|my answer is|it is|it s|this is|the term is|the hormone is|the enzyme is|the gland is|the)\s+/,'');
  const correct=!rejected&&!negated&&(text===normalizedText(q.answer)||q.accept.some(pattern=>has(phrase,'^(?:'+pattern+')$')));
  return {id:q.id,selected:response.trim(),correct,method:'accepted key phrase'};
 }
 if(q.format==='explain'){
  const checks=q.criteria.map(([label,pattern])=>({label,matched:has(text,pattern)}));
  const enough=text.split(' ').length>=8;
  return {id:q.id,selected:response.trim(),correct:!rejected&&enough&&checks.every(c=>c.matched),checks,method:'key-idea rubric',wordingNote:!enough?'Use a few connected sentences, not only a list of terms.':rejected?'A statement conflicts with this lesson’s mechanism.':'This check recognizes expected key ideas. Compare your wording with the model answer; it does not evaluate every nuance of a written explanation.'};
 }
 throw new Error('This question format is not available.');
}
