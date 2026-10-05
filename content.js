// All visible research content is based on public sources listed in SOURCES.md.
// Team names, roles and supplied portraits are explicitly authorized by the group leader.
// Add records here; the page renders team/publication lists automatically.
export const team = [
  {name:'Xinxin Huang',role:'Postdoctoral researcher',photo:'assets/xinxin.webp'},
  {name:'Uyen Le',role:'Doctoral researcher',photo:'assets/uyen.webp'},
  {name:'Mery Lempinen',role:'Doctoral researcher',photo:'assets/mery.webp'},
  {name:'Amanda Lahtinen',role:'Master’s student',photo:'assets/amanda.webp'},
  {name:'Huy Quang Lê',role:'Staff scientist',photo:'assets/quang.webp'}
];
export const publications = [
  {year:2025,journal:'Chemical Engineering Journal',category:'Materials',title:'Properties and performance of lignin-based polyurethane foams from lignin and castor oil as synergistic bio-polyols',doi:'10.1016/j.cej.2025.166159',detail:'520 · 166159'},
  {year:2024,journal:'Energy & Environmental Science',category:'Fuels',title:'Economics and global warming potential of a commercial-scale delignifying biorefinery based on co-solvent enhanced lignocellulosic fractionation to produce alcohols, sustainable aviation fuels, and co-products from biomass',doi:'10.1039/D3EE02532B',detail:'17 · 1202–1215'},
  {year:2020,journal:'ACS Omega',category:'Materials',title:'Synthesis, Characterization, and Utilization of a Lignin-Based Adsorbent for Effective Removal of Azo Dye from Aqueous Solution',doi:'10.1021/acsomega.9b03717',detail:'5 · 2865–2877'},
  {year:2019,journal:'Journal of the American Chemical Society',category:'Fractionation',title:'A Multifunctional Cosolvent Pair Reveals Molecular Principles of Biomass Deconstruction',doi:'10.1021/jacs.8b10242',detail:'141 · 12545–12557'},
  {year:2017,journal:'Proceedings of the National Academy of Sciences',category:'Fuels',title:'Overcoming factors limiting high-solids fermentation of lignocellulosic biomass to ethanol',doi:'10.1073/pnas.1704652114',detail:'114 · 11673–11678'},
  {year:2017,journal:'ACS Catalysis',category:'Fuels',title:'Support Induced Control of Surface Composition in Cu–Ni/TiO₂ Catalysts Enables High Yield Co-Conversion of HMF and Furfural to Methylated Furans',doi:'10.1021/acscatal.7b01095',detail:'7 · 4070–4082'},
  {year:2013,journal:'Green Chemistry',category:'Fractionation',title:'THF co-solvent enhances hydrocarbon fuel precursor yields from lignocellulosic biomass',doi:'10.1039/C3GC41214H',detail:'15 · 3140–3145'}
];
// Keep unpublished infrastructure out of the public-facing page. Enable when
// approved public details and a real facility photo are ready; never invent status.
export const pilotLab = {enabled:false,title:'CELF pilot lab',capacityLitres:null,status:null,description:null,photo:null};
