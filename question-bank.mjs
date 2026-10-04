// Authored concept packets: different tasks assess the same idea in different ways.
// Patterns support a transparent key-idea check; they are not an AI essay grader.
export const PACKETS=[];
export function C(lessonId,slug,label,mc,options,why,short,answer,accept,explain,criteria,sample,clue,reject=[]){
 PACKETS.push({id:lessonId+'-'+slug,lessonId,label,mc,options,why,short,answer,accept,explain,criteria,sample,clue,reject});
}
export function questionsForLesson(lessonId,topicId){
 const packets=PACKETS.filter(p=>p.lessonId===lessonId);
 const base=p=>({lessonId,topicId,conceptId:p.id,conceptIds:[p.id],conceptLabel:p.label,kind:'quiz',explanation:p.why});
 const questions=packets.flatMap(p=>[
  {...base(p),id:p.id+'-mc',format:'mcq',difficulty:2,level:'Apply the mechanism',prompt:p.mc,answer:p.options[0],wrong:p.options.slice(1).map(text=>[text,'This choice does not fit this case. '+p.why])},
  {...base(p),id:p.id+'-short',format:'short',difficulty:1,level:'Recall the key fact',prompt:p.short,answer:p.answer,accept:p.accept,reject:p.reject},
  {...base(p),id:p.id+'-explain',format:'explain',difficulty:3,level:'Connect cause and effect',prompt:p.explain,answer:p.sample,criteria:p.criteria,reject:p.reject}
 ]);
 questions.push({id:lessonId+'-matching',lessonId,topicId,conceptId:lessonId+'-matching',conceptIds:packets.map(p=>p.id),conceptLabel:'Compare the lesson concepts',kind:'quiz',format:'match',difficulty:2,level:'Match and distinguish',prompt:'Match each description to the concept from this lesson. Use each answer once.',pairs:packets.map(p=>({id:p.id,prompt:p.clue,answer:p.label,why:p.why})),answer:packets.map(p=>p.clue+' → '+p.label).join('\n'),explanation:'Distinguish the concepts by what each one does. '+packets.map(p=>p.label+': '+p.why).join(' ')});
 return questions;
}
