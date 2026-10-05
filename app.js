import {team,publications,pilotLab} from './content.js';
import {initMolecular} from './molecular.js';
const $ = (s)=>document.querySelector(s);
const escapeHTML=(value)=>String(value).replace(/[&<>"']/g,(c)=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
$('#team-grid').innerHTML=team.map((p)=>`<article class="team-card reveal"><div class="team-photo ${p.photo?'':'team-initial'}">${p.photo?`<img src="${escapeHTML(p.photo)}" alt="${escapeHTML(p.name)}" width="400" height="500" loading="lazy">`:`<span aria-hidden="true">${escapeHTML(p.initials||p.name.charAt(0))}</span>`}</div><h3>${escapeHTML(p.name)}</h3><p>${escapeHTML(p.role)}</p></article>`).join('');
function renderPublications(category='All'){
 const papers=publications.filter((p)=>category==='All'||p.category===category);
 $('#publication-list').innerHTML=papers.map((p)=>`<article class="publication-row"><span class="publication-year">${p.year}</span><div><p class="publication-journal">${escapeHTML(p.journal)}</p><h3 class="publication-title"><a href="https://doi.org/${encodeURI(p.doi)}" target="_blank" rel="noopener noreferrer">${escapeHTML(p.title)}</a></h3><p class="publication-details">${escapeHTML(p.detail)} · ${escapeHTML(p.category)}</p></div><a class="doi-link" href="https://doi.org/${encodeURI(p.doi)}" target="_blank" rel="noopener noreferrer" aria-label="Read ${escapeHTML(p.title)} via DOI">DOI</a></article>`).join('');
 $('#publication-count').textContent=`${papers.length} ${papers.length===1?'paper':'papers'}`;
}
renderPublications();
document.querySelectorAll('[data-category]').forEach((button)=>button.addEventListener('click',()=>{document.querySelectorAll('[data-category]').forEach((b)=>{b.classList.toggle('active',b===button);b.setAttribute('aria-pressed',String(b===button));});renderPublications(button.dataset.category);}));
$('.menu-toggle').addEventListener('click',()=>{const expanded=$('.menu-toggle').getAttribute('aria-expanded')==='true';$('.menu-toggle').setAttribute('aria-expanded',String(!expanded));$('.menu-toggle').setAttribute('aria-label',expanded?'Open navigation':'Close navigation');$('#mobile-menu').hidden=expanded;});
$('#mobile-menu').querySelectorAll('a').forEach((link)=>link.addEventListener('click',()=>{$('#mobile-menu').hidden=true;$('.menu-toggle').setAttribute('aria-expanded','false');$('.menu-toggle').setAttribute('aria-label','Open navigation');}));
document.addEventListener('keydown',(event)=>{if(event.key==='Escape'&&!$('#mobile-menu').hidden){$('#mobile-menu').hidden=true;$('.menu-toggle').setAttribute('aria-expanded','false');$('.menu-toggle').setAttribute('aria-label','Open navigation');$('.menu-toggle').focus();}});
const reducedMotion=window.matchMedia('(prefers-reduced-motion: reduce)');
let motion=!reducedMotion.matches;
const observer=new IntersectionObserver((entries)=>entries.forEach((entry)=>{if(entry.isIntersecting){entry.target.classList.add('visible');observer.unobserve(entry.target);}}),{threshold:.06});
if(motion)document.body.classList.add('has-motion');
document.querySelectorAll('.reveal').forEach((el)=>observer.observe(el));
let molecular;
try{molecular=initMolecular($('#molecular-canvas'));}catch(error){console.warn('Molecular rendering unavailable:',error);$('#motion-toggle').hidden=true;}
let scheduled=false;
function updateScene(){scheduled=false;if(molecular){const range=Math.max(1,$('.molecular-story').offsetHeight-window.innerHeight);const progress=motion?Math.min(1,Math.max(0,(window.scrollY-50)/range)):.42;molecular.setProgress(progress);}}
function scheduleScene(){if(!scheduled){scheduled=true;requestAnimationFrame(updateScene);}}
window.addEventListener('scroll',scheduleScene,{passive:true});
window.addEventListener('resize',()=>{molecular?.resize();scheduleScene();},{passive:true});
function updateMotion(){document.body.classList.toggle('has-motion',motion);$('#motion-toggle').textContent=motion?'Motion on':'Motion off';$('#motion-toggle').setAttribute('aria-pressed',String(motion));$('#motion-toggle').setAttribute('aria-label','Scroll animation');$('#motion-toggle').title=motion?'Turn off scroll animation':'Turn on scroll animation';scheduleScene();}
$('#motion-toggle').addEventListener('click',()=>{motion=!motion;updateMotion();});
reducedMotion.addEventListener('change',()=>{motion=!reducedMotion.matches;updateMotion();});
updateMotion();
if(pilotLab.enabled&&pilotLab.description&&pilotLab.status){const el=$('#pilot-lab');el.hidden=false;el.innerHTML=`<p class="eyebrow">Research infrastructure</p><h2>${escapeHTML(pilotLab.title)}</h2><p>${escapeHTML(pilotLab.status)}</p><p>${escapeHTML(pilotLab.description)}</p>${pilotLab.photo?`<img src="${escapeHTML(pilotLab.photo)}" alt="CELF pilot laboratory" loading="lazy">`:''}`;}
$('#year').textContent=new Date().getFullYear();
