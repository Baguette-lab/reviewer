import {COURSE} from './course.mjs';
import './anemia.mjs';
import './thyroid.mjs';
import './seizures.mjs';
import './hiv.mjs';
import {MEMORY_DECKS} from './flashcards.mjs';
import {questionsForLesson} from './question-bank.mjs';
import {legacyConcepts} from './concept-tags.mjs';
import './questions-shock.mjs';
import './questions-anemia.mjs';
import './questions-thyroid.mjs';
import './questions-seizures.mjs';
import './questions-hiv.mjs';
import {casesForLesson} from './case-bank.mjs';
import './cases-shock.mjs';
import './cases-anemia.mjs';
import './cases-thyroid.mjs';
import './cases-seizures.mjs';
import './cases-hiv.mjs';
for (const topic of COURSE) {
 topic.lessons.forEach((lesson,li)=>{
  lesson.topicId=topic.id;
  lesson.questions.forEach((question,qi)=>{
   question.id=lesson.id+'-q'+(qi+1);
   question.lessonId=lesson.id;
   question.topicId=topic.id;
   question.kind=qi<3?'mastery':'quiz';
   question.format='mcq';
   question.conceptId=lesson.id+'-legacy-'+(qi%3);
   const tagged=legacyConcepts(lesson.id,question);
   question.conceptIds=tagged.length?tagged:[question.conceptId];
   question.conceptLabel=lesson.title;
   question.difficulty=/case|apply|application/i.test(question.level)?2:1;
  });
  lesson.questions.push(...questionsForLesson(lesson.id,topic.id));
  lesson.questions.push(...casesForLesson(lesson.id,topic.id));
  const deck=MEMORY_DECKS[lesson.id];
  const cards=lesson.terms.map(([term,answer,why],ci)=>({front:deck.terms[ci],answer:term+' — '+answer,why}));
  cards.push(...deck.facts.map(([front,answer,section])=>({front,answer,why:lesson.sections[section].text})));
  lesson.cards=cards.map((card,ci)=>({...card,id:lesson.id+'-f'+ci,lessonId:lesson.id,topicId:topic.id}));
 });
}
export {COURSE};
