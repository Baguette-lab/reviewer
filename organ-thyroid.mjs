import {thyroidPattern,THYROID_TARGETS} from './visual-models.mjs';
import {svg,part,text,arrow,note,stats} from './organ-ui.mjs';

export function thyroidDiagram(s){
 const t='thyroid',p=thyroidPattern(s.thyroidOutput,s.central),graves=s.thyroidCause==='graves';
 const hue=s.thyroidOutput===0?'#99bed9':s.thyroidOutput===2?'#e3a0ad':'#b4d7c5';
 let art=`<rect x="12" y="12" width="776" height="614" rx="24" fill="#f8fbfc" stroke="#d6e5ec"/>`;
 art+=`<path d="M58 554V395Q66 351 101 339V282Q62 249 68 169C76 81 199 41 250 136Q266 174 249 227Q246 264 212 282V337Q253 354 273 402V554" fill="#f2e8df" stroke="#c9baad" stroke-width="3"/><path d="M84 171Q89 87 167 98Q244 113 237 184Q223 228 190 239H112Q77 215 84 171Z" fill="#ebe5f2" stroke="#b1a0c2" stroke-width="2"/>`+text(166,69,'HEAD AND NECK',18);
 art+=part(t,'hypothalamus',s,`<ellipse class="organ-outline" cx="164" cy="198" rx="33" ry="19" fill="#b5a0d0" stroke="#7b66a0" stroke-width="2"/>`+text(372,126,'1 · Hypothalamus',18)+text(372,153,'TRH starts the request',16));
 art+=part(t,'pituitary',s,`<path class="organ-outline" d="M164 214V235" stroke="#927fae" stroke-width="7"/><ellipse cx="165" cy="242" rx="18" ry="12" fill="#ad91c4" stroke="#7b66a0" stroke-width="2"/>`+text(372,225,'2 · Anterior pituitary',18)+text(372,251,`TSH: ${s.central?'Low / inadequate':p.tsh}`,16));
 art+=`<path d="M196 196H244L256 149" fill="none" stroke="#9d8db4" stroke-width="2"/><path d="M183 241H243L253 230" fill="none" stroke="#9d8db4" stroke-width="2"/>`;
 art+=arrow(t,'M372 163V198','#9a86b3')+text(415,184,'TRH',15);
 art+=arrow(t,'M372 266V306','#9a86b3')+text(415,288,'TSH',15);
 // A trachea and butterfly-shaped gland connect the axis to its neck location.
 art+=`<rect x="146" y="289" width="37" height="100" rx="14" fill="#d4c5b8" stroke="#b7a394"/>${[300,315,330,345,360,375].map(y=>`<path d="M147 ${y}H181" stroke="#eee4d9" stroke-width="3"/>`).join('')}`;
 const scale=s.showGoiter?1.36:1;
 art+=part(t,'thyroid',s,`<g transform="translate(165 333) scale(${scale})"><path class="organ-outline" d="M-12-9C-43-46-64-34-53 1C-49 27-23 28-12 9H12C24 29 52 23 55-4C62-40 36-44 12-9Z" fill="${hue}" stroke="#9e7180" stroke-width="3"/></g>`+text(366,334,'3 · Thyroid gland',18)+text(353,360,`T3 / T4: ${p.hormone}`,17));
 art+=`<path d="M217 333H243" stroke="#b78997" stroke-width="2"/>`;
 art+=part(t,'receptor',s,`<rect class="organ-outline" x="257" y="384" width="147" height="81" rx="14" fill="#fff" stroke="#bd91a5"/><path d="M300 400V419M285 400L300 408L315 400" stroke="#b86e8c" stroke-width="4" fill="none"/>`+text(330,447,'TSH receptor',17));
 art+=`<path d="M329 373V386" stroke="#a67c8c" stroke-width="2"/>`;
 art+=part(t,'body',s,`<rect class="organ-outline" x="542" y="142" width="215" height="354" rx="23" fill="${s.thyroidOutput===2?'#fff0f1':s.thyroidOutput===0?'#edf5fb':'#eef8f2'}" stroke="#b2c8d4" stroke-width="2"/>`+text(650,175,'4 · BODY RESPONSE',18)+`<path d="M590 213C575 193 551 214 589 247C626 215 604 194 590 213Z" fill="#c76c83"/>`+text(626,233,s.thyroidOutput===2?'Often fast pulse':s.thyroidOutput===0?'Often slow pulse':'Heart effects',16,'#425d6c','start')+`<path d="M581 285V318M575 285V318" stroke="#b78c49" stroke-width="4"/><circle cx="578" cy="324" r="9" fill="#d6ac70"/>`+text(612,312,s.thyroidOutput===2?'Heat intolerance':s.thyroidOutput===0?'Cold intolerance':'Heat / energy use',16,'#425d6c','start')+`<path d="M568 370Q598 348 598 374Q565 385 598 394Q627 407 599 421" fill="none" stroke="#9c83b2" stroke-width="7"/>`+text(622,391,s.thyroidOutput===2?'Frequent stools':s.thyroidOutput===0?'Constipation':'Bowel effects',16,'#425d6c','start')+text(650,468,'Qualitative patterns',15));
 art+=arrow(t,'M440 373H531')+text(484,356,'T3 / T4',16);
 art+=part(t,'feedback',s,`<path class="organ-outline" d="M529 193H486V90H359M487 269H450V257" fill="none" stroke="#8770a4" stroke-width="4"/><path d="M357 77V104M437 257H463" stroke="#8770a4" stroke-width="5"/>`+text(579,61,'5 · NEGATIVE FEEDBACK',18,'#765c94')+text(629,91,'Less TRH / TSH',16,'#765c94'));
 if(s.central)art+=`<path d="M155 234L176 251M176 234L155 251" stroke="#b77e1a" stroke-width="4"/>`+text(397,526,'Inadequate upstream signal',15,'#966018');
 if(graves)art+=`<path d="M470 487V513M470 501L455 487M470 501L485 487" stroke="#b77e1a" stroke-width="6" fill="none"/>`+arrow(t,'M468 520H438V441H410','#b77e1a')+text(613,538,'Graves antibodies',16,'#966018')+text(613,565,'Stimulate despite low TSH',15,'#966018');
 if(s.showGoiter)art+=text(165,421,'Enlarged gland',17,'#956115');
 if(s.target!=='none'){
  const [x,y]=s.target==='symptoms'?[740,217]:[239,333];
  art+=`<circle cx="${x}" cy="${y}" r="15" fill="#fff6df" stroke="#bb8d36" stroke-width="2"/>`+text(x,y+5,'T',16,'#855915');
 }
 art+=text(400,598,'Gland size, hormone amount, and stimulation are separate ideas.',17);
 return svg(t,'Thyroid anatomy, hormone messages, and negative feedback',640,art);
}
export function thyroidMeaning(s){
 const p=thyroidPattern(s.thyroidOutput,s.central),graves=s.thyroidCause==='graves';
 return stats([['Thyroid hormone',p.hormone],['TSH response',p.tsh],['Gland size in this drawing',s.showGoiter?'Enlarged: goiter':'Usual size'],['Signal source',graves?'TSH-receptor antibodies':s.central?'Central signal inadequate':'Pituitary request']])+
 note('Follow the feedback',p.feedback,'organ-change')+
 (graves?note('Why the gland keeps making hormone','High T3/T4 tells the pituitary to lower TSH. Graves antibodies still stimulate the TSH receptor, so reducing the pituitary request does not remove the antibody signal.'):s.central?note('Why TSH is not high here','In central hypothyroidism, the upstream system cannot provide the appropriate TSH response. A low free T4 with a low or inappropriately normal TSH differs from primary gland failure.'):note('Primary gland versus upstream response','With an intact upstream system, lower thyroid hormone usually raises TSH, while excess thyroid hormone suppresses it. Interpret the two measurements together.'))+
 note('Goiter describes size','Enlarging the drawing changes size only. A goiter can occur with low, high, or normal hormone function; the visible size does not select the hormone pattern.')+
 note('Treatment target',THYROID_TARGETS[s.target].text);
}
