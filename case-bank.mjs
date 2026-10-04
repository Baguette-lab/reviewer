import {PACKETS} from './question-bank.mjs';

// Original patient cases. IDs and concept tags stay stable across course updates.
export const CASES=[];
export function S(lessonId,concept,id,presentation,findings,ask,answer,explanation,wrong,clues,difficulty=2){
 CASES.push({lessonId,concept,id,presentation,findings,ask,answer,explanation,wrong,clues,difficulty});
}
export function casesForLesson(lessonId,topicId){
 return CASES.filter(c=>c.lessonId===lessonId).map(c=>{
  const conceptId=lessonId+'-'+c.concept;
  const packet=PACKETS.find(p=>p.id===conceptId);
  if(!packet)throw new Error('Unknown case concept: '+conceptId);
  return {id:lessonId+'-case-'+c.id,lessonId,topicId,kind:'quiz',format:'mcq',scenario:true,
   conceptId,conceptIds:[conceptId],conceptLabel:packet.label,difficulty:c.difficulty,level:'Patient case',
   prompt:[c.presentation,...c.findings,c.ask].join(' '),
   case:{presentation:c.presentation,findings:c.findings,ask:c.ask},
   answer:c.answer,explanation:c.explanation,wrong:c.wrong,clues:c.clues};
 });
}
