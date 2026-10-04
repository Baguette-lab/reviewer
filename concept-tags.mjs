// Conservative tags connect existing course questions to the new concept packets.
// Unmatched questions keep their own stable family rather than guessing a mechanism.
const TAGS={
 s1:[['output','cardiac output|stroke volume|\\bco\\b|\\bhr\\b'],['map','\\bmap\\b|systolic|diastolic'],['resistance','arteriole|vascular resistance|\\bsvr\\b']],
 s2:[['energy','\\batp\\b|cell.*swell|sodium.*water|ion pump'],['compensation','progressive|compensat|falling bp'],['lactate','lactate|anaerob']],
 s3:[['sns','sympathetic|clammy|cool.*skin'],['raas','aldosterone|angiotensin|raas|urine output|kidney perfusion'],['afterload','afterload|workload|harmful.*cardiogenic']],
 s4:[['preload','venous return|preload|hypovolemic|vomiting|diarrhea'],['thirdspace','third spac|burn|tissue.*fluid'],['bleeding','vasopressor|bleed|blood loss|control the loss']],
 s5:[['pump','cardiogenic|pump failure|\\bmi\\b'],['barrier','obstruct|tamponade|pneumothorax'],['lungfluid','pulmonary edema|fluid load|congestion']],
 s6:[['neuro','neurogenic|spinal|bradycard|sympathetic tone'],['allergy','anaphyl|epinephrine|antihistamine|medication.*wheez'],['airway','bronchospasm|angioedema|tongue.*swell']],
 s7:[['sepsis','septic|sepsis|inflammation|pneumonia'],['source','source control|focus of infection'],['reassess','urine output|mental status|trends|organ perfusion']],
 a1:[['size','mcv|mchc|microcyt|rbc size'],['erythropoietin','erythropoietin|kidney|\\bepo\\b'],['oxygen','oxygen.*capacity|tachycardia|oxygen delivery']],
 a2:[['stores','ferritin|iron stores'],['hemoglobin','microcyt|hypochrom|hemoglobin'],['cause','blood loss|bleeding|cause of']],
 a3:[['factor','intrinsic factor|pernicious|absorption|injection'],['dna','macrocyt|megaloblastic|dna'],['nerves','numbness|tingling|neurolog|nerve']],
 a4:[['alllines','pancytopenia|three cell lines|low rbcs'],['marrow','marrow|stem.cell'],['platelets','platelet|petechiae|bleeding']],
 a5:[['breakdown','hemolysis|bilirubin|jaundice|rbc destruction'],['retics','reticulocyte|marrow response'],['dat','coombs|antibodies|complement']],
 a6:[['hbs','hbs|polymer|alleles|stiffen'],['occlusion','vaso.occlusion|pain|acute chest'],['hbf','hydroxyurea|fetal hemoglobin|hbf']],
 a7:[['globin','globin|chain|bone changes|marrow expansion'],['chelation','chelation|transfus|overload'],['microcytic','microcyt|mcv|hypochrom']],
 t1:[['tsh','where.*tsh|pituitary gland'],['feedback','negative feedback|suppressed|hyperthyroid|t3 and t4 rise'],['central','central|upstream|non.elevated']],
 t2:[['primary','primary hypothyroid|hashimoto|high tsh'],['replacement','levothyroxine|replace|absorption|calcium'],['slow','cold|constipat|slow|non.pitting|myxedematous']],
 t3:[['size','goiter|enlarg'],['newborn','newborn|infant|congenital|brain development'],['iodine','iodine|stimulating drive']],
 t4:[['graves','graves|tsh receptor|exophthalmos'],['excess','thyrotoxicosis|levothyroxine'],['fast','heat|tremor|weight|metabolic|rapid pulse']],
 t5:[['symptom','beta.blocker|pulse|tremor'],['synthesis','ptu|methimazole|synthesis|radioactive iodine'],['nodule','needle|biopsy|nodule']],
 t6:[['storm','thyroid storm|thyrotoxic|high free t4|clinical decompensation'],['myxedema','myxedema|hypothermia|hypothyroid'],['trigger','precipitate|infection|stressor|different targets']],
 e1:[['event','electrical|brain networks|inhibitory'],['provoked','provok|hypoglycemia|electrolyte|acute symptomatic|acute trigger'],['tendency','epilepsy|unprovoked']],
 e2:[['focal','focal onset|hemisphere|bilateral spread|remains focal'],['aura','aura|odd smell|subjective'],['automatisms','automatism|lip.smacking|hand movements']],
 e3:[['absence','absence|stare|stares|resumes a sentence'],['atonic','atonic|loss of.*tone|loses posture'],['myoclonic','myoclon|brief.*jerk|shock.like']],
 e4:[['tonic','tonic phase|sustained.*stiffen'],['clonic','clonic phase|rhythmic|movement pattern'],['recovery','postictal|sleepy|confused|recovery|incontinence']],
 e5:[['electrical','eeg|electrical'],['metabolic','glucose|electrolyte|metabolic'],['control','medicine|withdrawal|seizure type']],
 e6:[['time','minute|without recovery|before.*regains'],['safety','mouth|water|safely|injury'],['sudep','sudep|unexpected death']],
 h1:[['cd4','cd4|t.helper'],['exposure','hug|contact|precaution|exposure|appearance'],['uu','u=u|undetectable|suppression']],
 h2:[['reverse','reverse transcript|rna into dna'],['integration','integrase|integration|host dna|genomes'],['protease','protease|polyprotein']],
 h3:[['load','viral load|amount of hiv'],['latency','latency|continues replicating|progression'],['aids','200|150|aids|cd4 depletion|opportunistic']],
 h4:[['window','window|one day|negative|confirmatory'],['nat','nucleic|antibody test|rna|genetic'],['infant','infant|maternal']],
 h5:[['art','art stand|antiretroviral|undetect|suppression|promptly|viral load'],['resistance','resistance|adherence|different drug'],['iris','iris|reconstitution']],
 h6:[['prep','prep|before potential'],['pep','pep|needlestick|72 hours'],['pregnancy','perinatal|maternal|pregnancy|respectful']]
};
export function legacyConcepts(lessonId,question){
 const text=question.prompt+' '+question.answer;
 return (TAGS[lessonId]||[]).filter(([,pattern])=>new RegExp(pattern,'i').test(text)).map(([slug])=>lessonId+'-'+slug);
}
