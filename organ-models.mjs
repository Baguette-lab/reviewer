import {ORGAN_PARTS,CIRCULATION_STEPS,CARDIAC_PHASES,CONDUCTION_STEPS,BLOOD_STEPS,THYROID_STEPS,NEURAL_STEPS} from './organ-content.mjs';
const integer=(value,min,max)=>Math.min(max,Math.max(min,Math.trunc(Number(value)||0)));
export function initialOrganState(topicId){
 return {organPart:Object.keys(ORGAN_PARTS[topicId])[0],organStep:0,heartView:'flow',flowMotion:false,
  compensation:false,saturation:98,bloodFlow:5,thyroidCause:'primary',showGoiter:false,seizureSpread:false,showReservoir:false,exploreReveal:false};
}
export function journey(state){
 if(state.topicId==='shock'){
  if(state.heartView==='cycle')return CARDIAC_PHASES.map(p=>[p.title,'lv',p.text]);
  if(state.heartView==='signals')return CONDUCTION_STEPS;
  return CIRCULATION_STEPS;
 }
 if(state.topicId==='anemia')return BLOOD_STEPS;
 if(state.topicId==='thyroid')return THYROID_STEPS;
 if(state.topicId==='seizures')return NEURAL_STEPS.map((step,i)=>i===2&&!state.seizureType.startsWith('focal')?[step[0],'bilateral',step[2]]:step);
 return [];
}
export function updateOrganState(next,key,value){
 const parts=ORGAN_PARTS[next.topicId];
 if(key==='heartView'&&['flow','cycle','signals'].includes(value)){next.heartView=value;next.organStep=0;next.organPart=value==='signals'?'sa':value==='cycle'?'lv':'vena';}
 if(key==='organStep'&&journey(next).length){
  next.organStep=integer(value,0,journey(next).length-1);
  next.organPart=journey(next)[next.organStep][1];next.exploreReveal=false;
 }
 if(key==='organMove'&&journey(next).length){
  next.organStep=integer(next.organStep+integer(value,-1,1),0,journey(next).length-1);
  next.organPart=journey(next)[next.organStep][1];next.exploreReveal=false;
 }
 if(key==='organPart'&&Object.hasOwn(parts,value))next.organPart=value;
 if(['flowMotion','compensation','showGoiter','showReservoir','exploreReveal'].includes(key))next[key]=value===true||value==='true';
 if(key==='saturation')next.saturation=integer(value,50,100);
 if(key==='bloodFlow')next.bloodFlow=Math.min(10,Math.max(2,Number(value)||5));
 if(key==='thyroidCause'&&['primary','graves','central'].includes(value)){
  next.thyroidCause=value;next.central=value==='central';
  if(value==='graves')next.thyroidOutput=2;
  if(value==='central')next.thyroidOutput=0;
 }
 if(key==='thyroidPreset'&&['balanced','low','high','central'].includes(value))next.thyroidCause=value==='central'?'central':'primary';
 if(key==='central')next.thyroidCause=next.central?'central':'primary';
 if(key==='thyroidOutput'&&(next.thyroidOutput!==2||next.central||next.thyroidCause!=='graves'))next.thyroidCause=next.central?'central':'primary';
 if(key==='seizureSpread')next.seizureSpread=(value===true||value==='true')&&next.seizureType.startsWith('focal');
 if(key==='seizureType'&&!next.seizureType.startsWith('focal'))next.seizureSpread=false;
 if(key==='seizureType'&&next.organStep===2)next.organPart=next.seizureType.startsWith('focal')?'focal':'bilateral';
 if(key==='hivStep'){next.hivStep=integer(next.hivStep,0,6);next.organPart=['receptor','membrane','rna','nucleus','proteins','budding','protease'][next.hivStep];next.exploreReveal=false;}
 return next;
}
// Approximation for Hb-bound oxygen only, excluding dissolved oxygen.
// Hb: g/dL; saturation: percent; content: mL O2/dL; flow: L/min.
export const boundOxygenContent=(hb,saturation)=>1.34*Number(hb)*Number(saturation)/100;
export const boundOxygenDelivery=(hb,saturation,flow)=>boundOxygenContent(hb,saturation)*Number(flow)*10;
export function valveState(phase){return CARDIAC_PHASES[integer(phase,0,3)];}
export function neuralExtent(state){
 if(state.organStep<2||state.organStep===4)return 'resting';
 if(state.seizureType.startsWith('focal'))return state.seizureSpread?'bilateral spread':'focal';
 return 'distributed example';
}
