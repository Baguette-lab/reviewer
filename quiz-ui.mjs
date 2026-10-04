import {FORMAT_LABELS} from './adaptive.mjs';
const esc=v=>String(v??'').replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
export function formatPicker(id,value){
 return '<label class="quiz-control" for="'+id+'">Quiz type<select id="'+id+'">'+Object.entries(FORMAT_LABELS).map(([key,label])=>'<option value="'+key+'" '+(value===key?'selected':'')+'>'+label+'</option>').join('')+'</select></label>';
}
export function formatHelp(format){
 return {case:'Apply the lesson to patient symptoms, observations, and laboratory findings. Choose the best answer, then study the key clues and the reasoning for every choice.',mcq:'Choose the best answer. Read the explanation after checking.',short:'Recall a term, formula, number, or short phrase. Common accepted forms are checked.',explain:'Use a few connected sentences. The check looks for the lesson’s expected key ideas; compare your reasoning with the model answer afterward.',match:'Match each description to one answer. Use every answer once. All pairs must fit for the set to count as correct.',mixed:'Combines choices, short answers, concept explanations, and matching. Written explanations use key-idea rubrics, and matching sets require all pairs.'}[format];
}
export function responseReady(q,response){
 if(q.format==='match')return response&&typeof response==='object'&&q.pairs.every(p=>typeof response[p.id]==='string'&&response[p.id])&&new Set(q.pairs.map(p=>response[p.id])).size===q.pairs.length;
 return typeof response==='string'&&response.trim().length>0;
}
export function questionStemHTML(q){
 if(!q.scenario)return '<h2 id="question-title" class="question-title">'+esc(q.prompt)+'</h2>';
 return '<section class="patient-case" id="case-details" aria-label="Patient presentation"><div class="case-label">Patient presentation</div><p>'+esc(q.case.presentation)+'</p>'+
 (q.case.findings.length?'<div class="case-label">Findings</div><ul>'+q.case.findings.map(f=>'<li>'+esc(f)+'</li>').join('')+'</ul>':'')+
 '</section><h2 id="question-title" class="question-title">'+esc(q.case.ask)+'</h2>';
}
export function caseCluesHTML(q){
 return q.scenario?'<div class="case-clues"><h4>Key clues in this case</h4><ul>'+q.clues.map(clue=>'<li>'+esc(clue)+'</li>').join('')+'</ul></div>':'';
}
export function choiceRationalesHTML(q){
 return '<details class="compare"><summary>Why the other choices differ</summary>'+q.wrong.map(([text,why])=>'<p><strong>'+esc(text)+':</strong> '+esc(why)+'</p>').join('')+'</details>';
}
export function questionInputHTML(q,s,a,response,isExam){
 if(q.format==='mcq')return '<fieldset class="options" aria-labelledby="question-title" '+(q.scenario?'aria-describedby="case-details"':'')+'><legend class="sr-only">Select one answer</legend>'+s.choices[q.id].map((text,i)=>'<label class="option '+(a?'locked ':'')+(a&&!isExam&&text===q.answer?'correct ':'')+(a&&!isExam&&text===a.selected&&!a.correct?'incorrect':'')+'"><input type="radio" name="answer" value="'+esc(text)+'" '+((a?.selected??response)===text?'checked':'')+' '+(a?'disabled':'')+'><span class="option-letter">'+String.fromCharCode(65+i)+'</span><span>'+esc(text)+'</span></label>').join('')+'</fieldset>';
 if(q.format==='match'){
  const values=a?.response||response||{};
  return '<fieldset class="matching-input" aria-labelledby="question-title"><legend class="sr-only">Match each description</legend>'+q.pairs.map((p,i)=>'<label class="matching-row" for="match-'+p.id+'"><span><strong>'+String.fromCharCode(65+i)+'.</strong> '+esc(p.prompt)+'</span><select id="match-'+p.id+'" data-match-id="'+p.id+'" '+(a?'disabled':'')+'><option value="">Choose a match</option>'+s.choices[q.id].map(text=>'<option value="'+esc(text)+'" '+(values[p.id]===text?'selected':'')+' '+(Object.entries(values).some(([key,v])=>key!==p.id&&v===text)?'disabled':'')+'>'+esc(text)+'</option>').join('')+'</select></label>').join('')+'</fieldset>';
 }
 const isExplain=q.format==='explain',value=a?.selected??response??'';
 return '<div class="written-input"><label for="written-answer">'+(isExplain?'Your explanation':'Your short answer')+'</label><textarea id="written-answer" rows="'+(isExplain?6:3)+'" maxlength="'+(isExplain?1800:300)+'" aria-describedby="written-help" '+(a?'disabled':'')+'>'+esc(value)+'</textarea><p id="written-help" class="small muted">'+(isExplain?'Connect the cause with its effects in a few sentences. The expected ideas are shown after you check your answer.':'Use the requested term, formula, or short phrase. Include units or a direction such as “below” when the question asks for them.')+'</p></div>';
}
export function writtenFeedbackHTML(q,a){
 const label=q.format==='explain'?(a.correct?'Expected ideas recognized':'Compare the key ideas'):q.format==='short'?(a.correct?'Answer recognized':'Check the expected answer'):(a.correct?'Every pair fits':'Some pairs need another look');
 return '<div class="feedback '+(a.correct?'':'bad')+'" role="status"><h3>'+label+'</h3>'+
 (a.checks?'<ul class="rubric-checks">'+a.checks.map(c=>'<li class="'+(c.matched?'met':'missing')+'"><span aria-hidden="true">'+(c.matched?'✓':'○')+'</span><div><strong>'+esc(c.label)+'</strong><small>'+(q.format==='match'?'Your match: '+esc(c.selected)+' · Expected: '+esc(c.expected):c.matched?'Recognized in your answer':'Expected idea not recognized')+'</small></div></li>').join('')+'</ul>':'')+
 (a.wordingNote?'<p class="small">'+esc(a.wordingNote)+'</p>':'')+
 '<div class="explain-label">'+(q.format==='explain'?'Model explanation':q.format==='match'?'Correct matches':'Expected answer')+'</div><p class="model-answer"><strong>'+esc(q.answer)+'</strong></p><p>'+esc(q.explanation)+'</p>'+
 (q.format==='short'&&!a.correct?'<p class="small">Your wording may differ from the accepted phrase. Compare it with this answer and review any missing fact.</p>':'')+
 '<button type="button" class="feedback-link" data-action="review-lesson" data-lesson="'+q.lessonId+'">Revisit the lesson</button></div>';
}
