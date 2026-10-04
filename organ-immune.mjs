import {HIV_STEPS,HIV_TARGETS} from './visual-models.mjs';
import {svg,part,text,arrow,note,stats} from './organ-ui.mjs';

function virus(x,y,r=28,mature=false){
 return `<g transform="translate(${x} ${y})"><circle r="${r}" fill="#dde8d7" stroke="#71955c" stroke-width="3"/>${Array.from({length:10},(_,i)=>{const a=i*Math.PI/5;return `<path d="M${Math.cos(a)*r} ${Math.sin(a)*r}L${Math.cos(a)*(r+8)} ${Math.sin(a)*(r+8)}" stroke="#71955c" stroke-width="4"/>`;}).join('')}${mature?`<path d="M-11-15L14 15H-15Z" fill="#c69453" stroke="#986b32"/>`:`<path d="M-14 0Q-7-13 0 0T14 0" stroke="#bf8351" stroke-width="4" fill="none"/>`}</g>`;
}
const dna=(x,y,color='#ba794e')=>`<path d="M${x} ${y}q13-17 26 0t26 0t26 0M${x} ${y+13}q13 17 26 0t26 0t26 0" fill="none" stroke="${color}" stroke-width="3"/><path d="M${x+13} ${y-7}V${y+20}M${x+39} ${y+5}V${y+9}M${x+65} ${y-7}V${y+20}" stroke="${color}" stroke-width="2"/>`;
export function immuneDiagram(s){
 const t='hiv';let art=`<rect x="12" y="12" width="776" height="641" rx="24" fill="#f8fbfc" stroke="#d6e5ec"/>`;
 art+=text(420,48,'INSIDE A SUSCEPTIBLE CD4 HELPER CELL',20);
 art+=part(t,'membrane',s,`<ellipse class="organ-outline" cx="430" cy="354" rx="280" ry="231" fill="#eef6ea" stroke="#8ba77b" stroke-width="8"/>`+text(419,107,'Cell membrane',17));
 // Dim future stages for a readable sequence; all remain selectable.
 const stage=(n,content)=>`<g opacity="${s.hivStep<n?.78:1}">${content}</g>`;
 art+=part(t,'receptor',s,stage(0,virus(81,169)+`<path class="organ-outline" d="M193 189L212 210L227 190M212 210L229 228" fill="none" stroke="#699054" stroke-width="6"/>`+text(81,112,'1 · BIND',17)+text(91,243,'CD4 + co-receptor',16)));
 art+=arrow(t,'M110 177L194 203')+text(222,169,'2 · FUSE / ENTER',17);
 art+=part(t,'rna',s,stage(2,`<rect class="organ-outline" x="217" y="205" width="170" height="83" rx="17" fill="#fff" stroke="#ceb48d"/><path d="M243 243Q257 222 271 243T299 243T327 243T355 243" fill="none" stroke="#bf8351" stroke-width="5"/>`+text(303,228,'3 · HIV RNA',17)+text(303,279,'Reverse transcriptase',15)));
 art+=arrow(t,'M305 290V319');
 art+=part(t,'dna',s,stage(2,`<rect class="organ-outline" x="244" y="324" width="131" height="76" rx="14" fill="#fff9ed" stroke="#ceb48d"/>`+dna(267,350)+text(310,389,'Viral DNA',16)));
 art+=part(t,'nucleus',s,stage(3,`<ellipse class="organ-outline" cx="421" cy="467" rx="123" ry="99" fill="#e8e0f0" stroke="#ac96c4" stroke-width="3"/>`+text(425,420,'4 · NUCLEUS',18)+dna(358,450,'#9374b1')+`<path d="M395 457H423" stroke="#c57b42" stroke-width="8"/>`+text(421,500,'Host DNA + viral template',16)+text(421,529,'Integrase inserts viral DNA',15)));
 art+=arrow(t,'M373 365L403 390');
 art+=part(t,'proteins',s,stage(4,`<rect class="organ-outline" x="476" y="185" width="164" height="163" rx="19" fill="#fff" stroke="#bacaaa"/>`+text(558,217,'5 · COMPONENTS',16)+`<path d="M500 245Q513 229 525 245T550 245" stroke="#bf8351" stroke-width="4" fill="none"/>${[574,598,620].map((x,i)=>`<circle cx="${x}" cy="${257+i%2*13}" r="7" fill="#9fb98e"/>`).join('')}<path d="M504 289L520 299L540 286L562 299L578 288" stroke="#a584b6" stroke-width="6" fill="none"/>`+text(558,326,'RNA + protein chains',15)));
 art+=arrow(t,'M488 405L528 354')+arrow(t,'M644 282L690 346');
 art+=part(t,'budding',s,stage(5,`<path class="organ-outline" d="M699 341Q746 323 750 360Q752 397 705 381" fill="#dce9d1" stroke="#8ba77b" stroke-width="5"/><path d="M715 361Q726 343 737 361" stroke="#bf8351" stroke-width="4" fill="none"/>`+text(671,411,'6 · ASSEMBLY',17)+text(681,435,'Immature particle',15)));
 art+=arrow(t,'M741 392V473');
 art+=part(t,'protease',s,stage(6,virus(723,532,30,true)+text(626,583,'7 · BUD / MATURE',17)+text(624,608,'Protease processes proteins',15)));
 if(s.showReservoir){
  art+=`<rect x="155" y="514" width="151" height="99" rx="15" fill="#fff7dc" stroke="#c59a3f"/>`+dna(187,543)+text(231,578,'Existing integrated',14,'#835a1e')+text(231,598,'template can persist',14,'#835a1e');
 }
 const locations={entry:[151,181],fusion:[184,244],reverse:[340,307],integrase:[407,370],protease:[735,478]};
 if(locations[s.hivTarget]){
  const [x,y]=locations[s.hivTarget];
  art+=`<circle cx="${x}" cy="${y}" r="16" fill="#fff4d1" stroke="#b48222" stroke-width="3"/><path d="M${x-8} ${y}H${x+8}" stroke="#a36f13" stroke-width="5"/>`;
 }
 art+=text(225,72,'Drug target = amber stop marker',16,'#8c641e');
 return svg(t,'HIV entry, RNA-to-DNA copying, integration, and particle formation',670,art);
}
export function immuneMeaning(s){
 const current=HIV_STEPS[s.hivStep],target=HIV_TARGETS[s.hivTarget];
 return stats([['At this step',current.title],['Starting material',current.input],['What changes',current.output],['Process / enzyme',current.enzyme]])+
 note('Track the genetic material','HIV RNA is copied into DNA by reverse transcriptase. Integrase then inserts the DNA into host DNA. The host machinery can make new viral RNA and proteins from that template. These are separate steps and separate drug targets.','organ-change')+
 note('Selected drug target',target.text+' The marker shows its mechanistic location; later drawing elements remain available to inspect and do not imply the blocked cycle completes normally.')+
 (s.showReservoir?note('Why a reservoir can persist','The inset represents HIV DNA integrated before the selected block. Blocking new copying or integration does not remove every existing integrated template. Reservoir biology helps explain why effective ART suppresses replication without eliminating all HIV.'):note('Compare new infection with an existing template','Turn on the reservoir inset to separate preventing a new integration event from removing DNA that was already integrated.'))+
 (s.art?note('Direction with effective combination ART','Sustained effective ART suppresses ongoing replication and viral load; CD4 function and counts can recover over time. The checkbox represents a direction, not an instantaneous cure or a calculated patient timeline. Drug classes shown separately are learning targets, not a complete treatment regimen.'):note('Particle release is not the whole story','Assembly, budding, and maturation overlap. Newly released immature particles need protein processing to become fully functional. Protease inhibitors act on that late processing.'));
}
