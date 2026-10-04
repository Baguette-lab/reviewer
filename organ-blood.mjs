import {ANEMIA_CASES} from './visual-models.mjs';
import {boundOxygenContent,boundOxygenDelivery} from './organ-models.mjs';
import {svg,part,text,arrow,note,stats} from './organ-ui.mjs';

function cell(x,y,type,zoom=false){
 const r=zoom?66:type==='b12'?22:type==='iron'||type==='thalassemia'?12:17;
 if(type==='sickle')return `<path d="M${x-r} ${y-r/2}Q${x} ${y+r*1.8} ${x+r} ${y-r/2}Q${x+4} ${y+r/2} ${x-r} ${y-r/2}Z" fill="#bd4961" stroke="#953a50" stroke-width="2"/>`;
 if(type==='hemolytic')return `<path d="M${x-r} ${y-5}L${x-r/2} ${y-r}L${x+6} ${y-r/2}L${x+2} ${y+4}L${x+r} ${y+8}L${x+r/2} ${y+r}L${x-r} ${y+6}Z" fill="#c25a70" stroke="#9b3e53" stroke-width="2"/>`;
 const pale=type==='iron'||type==='thalassemia';
 return `<ellipse cx="${x}" cy="${y}" rx="${r}" ry="${r*.7}" fill="${pale?'#eebbc7':'#c8516a'}" stroke="#a7455c" stroke-width="2"/><ellipse cx="${x}" cy="${y}" rx="${r*(pale?.63:.42)}" ry="${r*.31}" fill="${pale?'#fff3f5':'#e8a8b8'}"/>`;
}
export function bloodDiagram(s){
 const t='anemia',type=s.anemiaCase,p=ANEMIA_CASES[type];
 let art=`<rect x="12" y="12" width="776" height="650" rx="24" fill="#f8fbfc" stroke="#d6e5ec"/>`;
 art+=part(t,'kidney',s,`<path class="organ-outline" d="M133 64C66 48 49 110 59 171C66 220 112 247 152 219C180 198 151 178 130 173C101 165 103 134 131 123C164 108 168 73 133 64Z" fill="#c78e99" stroke="#a56373" stroke-width="3"/><path d="M133 145L182 172V230" fill="none" stroke="#dca96e" stroke-width="6"/>`+text(114,269,'KIDNEY',19)+text(114,294,'EPO signal',17));
 art+=arrow(t,'M169 112H249')+text(210,99,'EPO',17);
 art+=part(t,'marrow',s,`<path class="organ-outline" d="M294 74C279 44 240 53 242 84C243 107 276 105 288 123V216C276 231 244 227 242 251C241 282 279 291 295 259C309 278 343 276 347 251C351 227 321 231 311 213V123C325 108 350 110 347 85C345 55 310 50 294 74Z" fill="#f5e8cc" stroke="#c7b28e" stroke-width="3"/><rect x="288" y="122" width="24" height="91" rx="11" fill="${type==='aplastic'?'#d9c8c0':'#c98188'}"/>${[139,161,182,200].map(y=>`<circle cx="300" cy="${y}" r="5" fill="${type==='aplastic'?'#ad9c91':'#a94458'}"/>`).join('')}`+text(299,327,'BONE MARROW',17));
 art+=part(t,'lines',s,`<rect class="organ-outline" x="350" y="145" width="158" height="159" rx="16" fill="#fff" stroke="#d5e0e7"/>`+text(429,172,'Three cell lines',16)+cell(373,199,'reference')+text(402,205,'RBC: oxygen',15,'#485f70','start')+`<circle cx="373" cy="239" r="15" fill="#ece5f5" stroke="#9381b4"/><circle cx="373" cy="239" r="7" fill="#ac94c2"/>`+text(402,244,'WBC: defense',15,'#485f70','start')+`<circle cx="373" cy="276" r="5" fill="#b990be"/><circle cx="380" cy="269" r="4" fill="#b990be"/>`+text(402,281,'Platelet: clotting',14,'#485f70','start'));
 art+=arrow(t,'M334 87H533')+text(440,69,'Production',17);
 art+=part(t,'rbc',s,`<rect class="organ-outline" x="536" y="42" width="230" height="266" rx="23" fill="#fff2f5" stroke="#d4a6b4"/>`+text(651,72,'RED-CELL ZOOM',18)+cell(651,148,type,true)+text(651,221,p.size,16)+text(651,247,'Shape / size are schematic',14));
 art+=part(t,'hemoglobin',s,`<rect class="organ-outline" x="553" y="264" width="194" height="31" rx="10" fill="#fff" stroke="#d1a4b0"/>`+text(650,285,'Hb binds oxygen',16));
 art+=arrow(t,'M299 337V354H73V390')+text(173,348,'New cells enter blood',15);
 art+=part(t,'vessel',s,`<rect class="organ-outline" x="45" y="387" width="528" height="101" rx="45" fill="#fff2f4" stroke="#cca6b1" stroke-width="5"/><path d="M74 437H553" stroke="#bd6680" stroke-width="3" stroke-dasharray="8 6"/><path d="M540 429L554 437L540 445" fill="none" stroke="#bd6680" stroke-width="3"/>`+text(280,373,'SMALL VESSEL · flow toward tissue',18));
 // These cells illustrate morphology and flow; their count is not a blood count.
 const xs=type==='aplastic'?[137,369]:[100,174,247,324,402,493];
 art+=xs.map((x,i)=>cell(x,430+(i%2?18:-14),type)).join('');
 if(type==='sickle')art+=`<path d="M334 392V405M334 470V484" stroke="#b48122" stroke-width="9"/>`+text(405,519,'Rigid cells can impair flow',17,'#956115');
 art+=part(t,'tissue',s,`<rect class="organ-outline" x="594" y="366" width="170" height="166" rx="21" fill="#e9f4ef" stroke="#90b5a5" stroke-width="2"/>`+text(679,395,'TISSUE CELLS',17)+[623,676,729].map((x,i)=>`<circle cx="${x}" cy="445" r="20" fill="#c5e3d7" stroke="#80ad99"/><circle cx="${x}" cy="445" r="6" fill="#8fb7a4"/>`).join('')+text(679,496,'O₂ used for energy',16));
 art+=arrow(t,'M567 437H591')+text(576,411,'O₂',15);
 art+=part(t,'spleen',s,`<path class="organ-outline" d="M95 588C104 548 166 550 195 574C213 593 198 629 166 637C126 648 89 629 95 588Z" fill="#b9a0c5" stroke="#8d739c" stroke-width="3"/>`+text(146,608,'SPLEEN',16,'#fff')+text(368,586,'Aging / damaged cells removed',18)+text(368,613,'Hemoglobin breakdown → bilirubin',16));
 art+=arrow(t,'M97 489V546');
 if(type==='aplastic')art+=text(447,119,'All three lines may fall',16,'#966018');
 if(type==='hemolytic'||type==='sickle')art+=text(562,642,'Shorter survival → more breakdown',15,'#80558c');
 return svg(t,'Red-cell production, oxygen transport, and removal',680,art);
}
function oxygenSites(s){
 const total=Math.round(24*s.hb/18),filled=Math.round(total*s.saturation/100);
 return `<div class="organ-oxygen-sites" aria-label="Symbolic hemoglobin sites: ${total} available units, about ${filled} occupied"><div class="organ-site-grid">${Array.from({length:24},(_,i)=>`<span class="organ-site ${i>=total?'missing':i<filled?'occupied':'available'}">${i>=total?'×':i<filled?'O₂':'○'}</span>`).join('')}</div><p class="organ-caption"><strong>Symbols in a fixed blood sample:</strong> filled = oxygen bound; hollow = available but unfilled; × = less Hb capacity than the 18 g/dL display maximum. Units are rounded teaching symbols, not cell or molecular counts.</p></div>`;
}
export function bloodMeaning(s){
 const p=ANEMIA_CASES[s.anemiaCase],content=boundOxygenContent(s.hb,s.saturation),delivery=boundOxygenDelivery(s.hb,s.saturation,s.bloodFlow);
 return stats([['Hb-bound oxygen content',`${content.toFixed(2)} mL O₂/dL`],['Hb-bound delivery at chosen flow',`${delivery.toFixed(0)} mL O₂/min`],['Production pattern',p.production],['Cell survival pattern',p.survival]])+
 `<p class="organ-equation">Content = 1.34 × ${s.hb} g/dL × ${(s.saturation/100).toFixed(2)} = ${content.toFixed(2)} mL O₂/dL<br>Delivery = content × ${s.bloodFlow} L/min × 10 dL/L = ${delivery.toFixed(0)} mL O₂/min</p>`+
 oxygenSites(s)+note('Why saturation and amount are different','Saturation describes the fraction of available hemoglobin binding sites occupied by oxygen. Anemia reduces total Hb capacity. A 98% saturation can coexist with less oxygen carried per deciliter of blood.')+
 note(p.label,p.explanation,'organ-change')+note('Read the model correctly','The Hb, saturation, and flow sliders are independent assumptions. Selecting a cell pattern does not set a patient’s measurements. The calculation includes Hb-bound oxygen only, excludes dissolved oxygen, and does not calculate tissue extraction or predict symptoms.');
}
