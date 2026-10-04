// Original teaching notes. Each selectable part is tied to the current lesson topic.
export const ORGAN_PARTS={
 shock:{
  vena:{name:'Venae cavae',job:'These large veins return blood from the body to the right atrium.',why:'Tissues have removed some oxygen. The returning blood still contains oxygen, but less than the blood leaving the lungs.'},
  ra:{name:'Right atrium (RA)',job:'The upper right chamber receives returning blood.',why:'The right atrium passes blood through the tricuspid valve into the right ventricle. Right and left refer to the person’s sides.'},
  tricuspid:{name:'Tricuspid valve',job:'A one-way valve between the right atrium and right ventricle.',why:'Pressure differences open and close it. When the ventricle contracts, closure helps prevent blood returning to the atrium.'},
  rv:{name:'Right ventricle (RV)',job:'The lower right chamber pumps blood toward the lungs.',why:'It pushes blood through the pulmonary valve into the pulmonary artery. The pulmonary circuit normally needs less pressure than the systemic circuit.'},
  pulmonary:{name:'Pulmonary valve / artery',job:'The outlet valve and artery carry blood from the right ventricle toward the lungs.',why:'An artery is named for carrying blood away from the heart. The pulmonary artery carries lower-oxygen blood: artery does not always mean oxygen-rich.'},
  lungs:{name:'Lung capillaries',job:'Blood exchanges gases with the air spaces in the lungs.',why:'Oxygen enters blood and carbon dioxide leaves. The lungs oxygenate blood; they do not pump it around the body.'},
  veins:{name:'Pulmonary veins',job:'These veins return oxygenated blood from the lungs to the left atrium.',why:'A vein carries blood toward the heart. Pulmonary veins are a useful exception to the idea that every vein carries low-oxygen blood.'},
  la:{name:'Left atrium (LA)',job:'The upper left chamber receives oxygenated blood from the lungs.',why:'Blood then passes through the mitral valve into the left ventricle.'},
  mitral:{name:'Mitral valve',job:'The one-way valve between the left atrium and left ventricle.',why:'It allows ventricular filling and closes as ventricular pressure rises, helping prevent backflow toward the lungs.'},
  lv:{name:'Left ventricle (LV)',job:'The lower left chamber generates the pressure to send blood around the body.',why:'A strong muscular wall supports systemic pumping. Pump failure can reduce forward flow while pressure backs up toward the lungs.'},
  aorta:{name:'Aortic valve / aorta',job:'The left-ventricular outlet leads into the major systemic artery.',why:'The aortic valve helps prevent blood returning to the ventricle after ejection. The aorta supplies branching arteries throughout the body.'},
  body:{name:'Body capillaries',job:'These tiny vessels bring blood close to tissues for exchange.',why:'Cells use delivered oxygen to help make ATP, their energy supply. Blood then returns through veins to complete the circuit.'},
  tone:{name:'Resistance-vessel tone',job:'Smooth muscle changes the caliber of resistance vessels such as arterioles.',why:'Widening generally lowers vascular resistance; sympathetic constriction often supports pressure during volume loss. The zoom is a qualitative caliber example, not a measured vessel or a prediction of tissue perfusion.'},
  coronary:{name:'Coronary circulation',job:'Coronary arteries supply oxygen to the heart muscle itself.',why:'Blood passing inside a chamber does not by itself adequately nourish its muscular wall. A coronary blockage can injure the pump.'},
  sa:{name:'Sinoatrial (SA) node',job:'The usual pacemaker starts an electrical impulse in the right atrium.',why:'The impulse spreads through the atria, coordinating their contraction. Electrical timing and blood movement are different processes.'},
  av:{name:'Atrioventricular (AV) node',job:'It briefly delays the electrical signal before it reaches the ventricles.',why:'The delay supports coordinated filling before ventricular contraction. It is an electrical relay, not one of the four blood-flow valves.'},
  his:{name:'His bundle and bundle branches',job:'These pathways carry the signal down the septum toward the ventricular apex.',why:'The signal is distributed to both ventricles so contraction can be coordinated.'},
  purkinje:{name:'Purkinje network',job:'It rapidly distributes the electrical impulse through ventricular muscle.',why:'Coordinated ventricular contraction ejects blood. A disruption in timing can interfere with efficient pumping.'}
 },
 anemia:{
  kidney:{name:'Kidney and erythropoietin (EPO)',job:'The kidneys provide an EPO signal that stimulates red-cell production in marrow.',why:'When oxygen availability is low, production signals can rise. Damaged kidneys may not provide enough signal; a signal alone cannot fix a failing marrow.'},
  marrow:{name:'Bone marrow',job:'This is the red-cell production site in an adult.',why:'Developing cells need iron for hemoglobin, B12 for normal DNA synthesis, and appropriate globin chains. Aplastic anemia can reduce red cells, white cells, and platelets.'},
  rbc:{name:'Red blood cell (RBC)',job:'A flexible cell packages hemoglobin and travels through blood vessels.',why:'Its shape and flexibility help it pass through small vessels. Cell number, hemoglobin amount, and survival can each affect oxygen transport.'},
  hemoglobin:{name:'Hemoglobin (Hb)',job:'The iron-containing protein binds oxygen in the lungs and releases it to tissues.',why:'A high saturation means many available sites are filled. It does not mean there is enough total hemoglobin in the blood.'},
  vessel:{name:'Small vessel',job:'A narrow route allows blood to approach tissue cells.',why:'Rigid sickled cells can impair flow. Reduced hemoglobin and obstructed microvascular flow are different problems that can coexist.'},
  tissue:{name:'Tissue oxygen delivery',job:'Cells receive oxygen carried by blood flowing past them.',why:'Delivery depends on both oxygen content and blood flow. Increasing saturation cannot automatically replace missing hemoglobin.'},
  spleen:{name:'Cell removal and bilirubin',job:'The spleen and other sites remove aging or damaged red cells.',why:'Hemoglobin breakdown contributes to bilirubin formation. Accelerated destruction can produce jaundice and stimulate marrow compensation.'},
  lines:{name:'Three marrow cell lines',job:'Marrow produces oxygen-carrying red cells, infection-fighting white cells, and platelets.',why:'Pancytopenia means all three counts are reduced. Anemia, infection risk, and bleeding risk come from different missing functions.'}
 },
 thyroid:{
  hypothalamus:{name:'Hypothalamus',job:'This brain region starts the upstream message with TRH.',why:'TRH means thyrotropin-releasing hormone. It stimulates the pituitary; it is not T3 or T4.'},
  pituitary:{name:'Anterior pituitary',job:'It releases thyroid-stimulating hormone (TSH).',why:'TSH asks the thyroid to make hormone. When thyroid hormone is low, an intact pituitary generally increases the request.'},
  thyroid:{name:'Thyroid gland',job:'The butterfly-shaped neck gland makes T4 and T3 using iodine.',why:'The gland’s function and size are separate. A goiter is an enlarged gland and can coexist with low, high, or normal hormone output.'},
  receptor:{name:'TSH receptor',job:'This receiving site lets thyroid cells respond to a stimulation signal.',why:'In Graves disease, stimulating antibodies activate the receptor even when the pituitary reduces TSH. This is a second source of stimulation.'},
  body:{name:'Body responses',job:'Thyroid hormones influence energy use, heat production, heart activity, and bowel function.',why:'Too little often produces a slower, colder pattern; excess often produces a faster, hotter pattern. These symptoms need interpretation with testing.'},
  feedback:{name:'Negative feedback',job:'Thyroid hormones reduce upstream TRH and TSH stimulation.',why:'Primary low hormone usually pairs with high TSH. With central dysfunction, the expected rise can be missing, so TSH must be interpreted with free T4.'}
 },
 seizures:{
  dendrite:{name:'Dendrites: incoming messages',job:'These branches receive signals from other neurons.',why:'Some incoming signals promote activity and others reduce it. Normal brain function requires regulated communication, not silence.'},
  soma:{name:'Cell body: signal integration',job:'The neuron combines incoming signals and regulates whether it fires.',why:'Disturbed excitability and network interactions can contribute to abnormal excessive activity. The diagram simplifies many cellular mechanisms.'},
  axon:{name:'Axon: outgoing impulse',job:'An electrical impulse travels along the neuron’s output pathway.',why:'Signals reach connections with other neurons. A seizure involves networks, not simply one isolated cell drawing.'},
  synapse:{name:'Synapse: communication point',job:'Neurons pass messages at these junctions.',why:'Excitatory and inhibitory influences help regulate network activity. This is a concept model, not an EEG or a measure of neurotransmitter concentration.'},
  focal:{name:'A focal brain network',job:'A focal seizure begins in a network within one hemisphere.',why:'Effects depend on the network: movement, sensation, and awareness can be affected differently. Preserved awareness does not rule out a focal seizure.'},
  bilateral:{name:'Bilateral networks',job:'Seizure activity may involve networks on both sides of the brain.',why:'A focal event can evolve into bilateral tonic–clonic activity. Later bilateral movements do not erase a documented focal onset.'},
  body:{name:'Observable effects',job:'The affected networks determine the visible or felt manifestations.',why:'Stiffening, jerking, staring, unusual sensations, and loss of tone are different patterns. Seizures do not all look the same.'},
  recovery:{name:'Recovery / postictal period',job:'Brain and body function return toward baseline after the event.',why:'Recovery varies by seizure type. Persistent breathing difficulty, prolonged activity, or repeated events without recovery require urgent help.'}
 },
 hiv:{
  receptor:{name:'Cell-surface receptors',job:'HIV attaches to a susceptible cell using surface receptors.',why:'CD4 is a helper-cell surface marker, and entry also involves co-receptors. Attachment is the first step in this simplified sequence.'},
  membrane:{name:'Cell membrane',job:'The viral envelope fuses with the cell boundary to allow entry.',why:'Binding and fusion are related but distinct steps. Entry and fusion drug classes target parts of this early process.'},
  rna:{name:'Viral RNA',job:'HIV carries its genetic instructions as RNA.',why:'Reverse transcriptase makes a DNA copy. Do not reverse the direction: this copying step is RNA to DNA.'},
  dna:{name:'New viral DNA',job:'The DNA copy can be used for insertion into the host genome.',why:'Integrase performs the insertion step. Making DNA and inserting DNA are two different enzyme targets.'},
  nucleus:{name:'Host-cell nucleus',job:'The nucleus contains the cell’s DNA.',why:'Integrated HIV DNA becomes a persistent template. Suppressing replication does not remove every existing infected-cell reservoir.'},
  proteins:{name:'Viral components',job:'Host-cell machinery produces viral RNA and protein components.',why:'The virus uses an infected cell’s resources to build new particles; it does not reproduce independently outside a host cell.'},
  budding:{name:'Assembly and budding',job:'Components assemble near the cell surface, and immature particles leave the cell.',why:'Late stages overlap in biology. Leaving the cell and becoming fully infectious are not exactly the same event.'},
  protease:{name:'Maturation: protease',job:'Protease processes viral protein chains into functional components.',why:'A protease inhibitor impairs maturation. It targets protein processing, rather than RNA-to-DNA copying or genome insertion.'}
 }
};

export const CIRCULATION_STEPS=[
 ['Return from the body','vena','Blood returns through the venae cavae after tissues have taken some oxygen.','Lower oxygen'],
 ['Enter the right atrium','ra','The right atrium receives returning venous blood.','Lower oxygen'],
 ['Cross the tricuspid valve','tricuspid','An open tricuspid valve allows blood to fill the right ventricle.','Lower oxygen'],
 ['Fill the right ventricle','rv','The right ventricle fills before pumping toward the lungs.','Lower oxygen'],
 ['Travel through the pulmonary outlet','pulmonary','The right ventricle ejects through the pulmonary valve into the pulmonary artery.','Lower oxygen'],
 ['Exchange gases in the lungs','lungs','Oxygen enters blood at lung capillaries; carbon dioxide leaves.','Oxygen uptake'],
 ['Return through pulmonary veins','veins','Oxygenated blood returns to the heart. Veins are defined by direction, not oxygen level.','Higher oxygen'],
 ['Enter the left atrium','la','The left atrium receives blood from the lungs.','Higher oxygen'],
 ['Cross the mitral valve','mitral','An open mitral valve allows the left ventricle to fill.','Higher oxygen'],
 ['Fill the left ventricle','lv','The left ventricle prepares to eject blood into systemic circulation.','Higher oxygen'],
 ['Eject through the aortic outlet','aorta','The left ventricle pushes blood through the aortic valve into the aorta.','Higher oxygen'],
 ['Deliver oxygen to the body','body','Tissues extract oxygen. Blood returns through veins to begin the circuit again.','Oxygen release']
];
export const CARDIAC_PHASES=[
 {title:'Fill the ventricles',av:'Open',out:'Closed',sound:'Between heart sounds',text:'During ventricular filling, atrioventricular valves are open. Much filling is passive; atrial contraction finishes the filling phase.',meaning:'Diastole = ventricular relaxation and filling.'},
 {title:'Build ventricular pressure',av:'Closed',out:'Closed',sound:'S1: “lub”',text:'Ventricles start contracting. The tricuspid and mitral valves close. For a short interval, all four valves are closed while pressure rises.',meaning:'Isovolumetric contraction = pressure rises before ejection.'},
 {title:'Eject blood',av:'Closed',out:'Open',sound:'After S1',text:'Once ventricular pressure exceeds outlet pressure, the pulmonary and aortic valves open. Blood moves to the lungs and body.',meaning:'Systole = ventricular contraction, including the ejection phase.'},
 {title:'Relax before filling',av:'Closed',out:'Closed',sound:'S2: “dub”',text:'Ventricular pressure falls and the pulmonary and aortic valves close. There is a brief all-valves-closed relaxation phase; filling resumes once atrial pressure exceeds ventricular pressure.',meaning:'Isovolumetric relaxation comes before the next filling phase.'}
];
export const CONDUCTION_STEPS=[
 ['SA node starts the impulse','sa','The usual pacemaker initiates the signal. This is electrical timing, not blood flow.'],
 ['The signal spreads across the atria','ra','Atrial activation coordinates their contraction before the ventricles.'],
 ['The AV node delays the signal','av','A brief relay delay helps the ventricles finish filling.'],
 ['His bundle and branches conduct downward','his','The signal travels down the septal conduction pathways toward the apex.'],
 ['Purkinje fibers coordinate ventricular activation','purkinje','Rapid distribution coordinates ventricular contraction and supports efficient ejection.']
];
export const BLOOD_STEPS=[
 ['Request more cells','kidney','Kidney EPO signaling helps stimulate production when oxygen availability is reduced.'],
 ['Build cells in marrow','marrow','Developing red cells need adequate materials and functioning marrow.'],
 ['Load and carry oxygen','hemoglobin','Hemoglobin binds oxygen in the lungs and carries it in circulating red cells.'],
 ['Reach and supply tissues','tissue','Blood must flow through vessels to deliver its oxygen content.'],
 ['Remove damaged or aging cells','spleen','Cell removal and hemoglobin breakdown contribute to bilirubin production.']
];
export const THYROID_STEPS=[
 ['Start the upstream request','hypothalamus','TRH stimulates the anterior pituitary.'],
 ['Send the TSH message','pituitary','The pituitary signals the thyroid through TSH.'],
 ['Produce thyroid hormones','thyroid','The thyroid produces T4 and T3; receptor stimulation and available materials matter.'],
 ['Act on body tissues','body','Hormones affect energy use, heat, heart activity, and bowel function.'],
 ['Send negative feedback','feedback','Thyroid hormones reduce upstream stimulation; the relationship changes with central dysfunction.']
];
export const NEURAL_STEPS=[
 ['Receive messages','dendrite','Dendrites receive regulated inputs from other neurons.'],
 ['Regulate and combine activity','soma','Excitatory and inhibitory influences help regulate whether neurons fire.'],
 ['Abnormal activity in a network','focal','Excessive coordinated activity can alter the function of the involved brain network.'],
 ['Observe the effects','body','The manifestation depends on the affected network and seizure type.'],
 ['Assess recovery','recovery','After activity ends, recovery patterns vary. Breathing, timing, and return to baseline matter.']
];

export const SHOCK_EFFECTS={
 baseline:{site:'The full circulation',label:'Working together',change:'Filling, pumping, an open route, and suitable vascular tone support perfusion.',result:'Blood can transport oxygen from lungs to body tissues.',clue:'Flow and oxygen content both matter.'},
 hypovolemic:{site:'Venous return and filling',label:'Less blood available',change:'Volume loss leaves less blood returning to the ventricles.',result:'Reduced preload can reduce stroke volume and forward flow.',clue:'An initially maintained pressure does not rule out impaired perfusion.'},
 cardiogenic:{site:'The ventricular pump',label:'Weak ejection',change:'A failing ventricle cannot eject effectively even when volume is present.',result:'Forward output falls; left-sided backward pressure can cause pulmonary congestion.',clue:'An extra fluid load is not an automatic solution to pump failure.'},
 obstructive:{site:'A central filling or flow route',label:'Mechanical obstruction',change:'The illustrated example is a large pulmonary embolus blocking the pulmonary route.',result:'Right-heart outflow is burdened and effective circulation can fall.',clue:'Tamponade and tension pneumothorax obstruct by different mechanisms; the barrier location shown is one example.'},
 neurogenic:{site:'Vessel tone and autonomic control',label:'Sympathetic signals interrupted',change:'Loss of sympathetic control can dilate vessels and reduce effective venous return.',result:'Pressure falls; relative vagal dominance can produce bradycardia.',clue:'The usual tachycardic compensation may be absent.'},
 anaphylactic:{site:'Vessels and airway',label:'Dilation, leakage, airway involvement',change:'Allergic mediators can widen vessels and let fluid escape, while airways narrow or swell.',result:'Effective circulating volume and oxygenation can both be threatened.',clue:'Skin, airway, and circulatory findings can occur together.'},
 septic:{site:'Vessel tone, barrier, and microcirculation',label:'Dysregulated infection response',change:'Infection-related dysfunction can disrupt vascular tone and tissue-level circulation.',result:'Effective perfusion can fail despite a warm appearance or variable cardiac output.',clue:'The cause involves infection with organ dysfunction, beyond fever alone.'}
};
export const ORGAN_SOURCES={
 shock:[['NHLBI: circulation','https://www.nhlbi.nih.gov/health/heart/blood-flow'],['NHLBI: heartbeat','https://www.nhlbi.nih.gov/health/heart/heart-beats']],
 anemia:[['NHLBI: anemia','https://www.nhlbi.nih.gov/health/anemia'],['NIDDK: kidney functions','https://www.niddk.nih.gov/health-information/kidney-disease/kidneys-how-they-work'],['Oxygen-content formula: study methods','https://pmc.ncbi.nlm.nih.gov/articles/PMC5359263/']],
 thyroid:[['NIDDK: thyroid tests','https://www.niddk.nih.gov/health-information/diagnostic-tests/thyroid'],['NIDDK: Graves disease','https://www.niddk.nih.gov/health-information/endocrine-diseases/graves-disease']],
 seizures:[['NINDS: epilepsy and seizures','https://www.ninds.nih.gov/sites/default/files/2025-05/epilepsy-and-seizures.pdf'],['CDC: seizure patterns and safety','https://www.cdc.gov/epilepsy/first-aid-for-seizures/index.html']],
 hiv:[['NIH: HIV life cycle','https://hivinfo.nih.gov/understanding-hiv/fact-sheets/hiv-life-cycle']]
};
