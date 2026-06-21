const MAX_GALLERY_IMAGES = 80;
const SOURCE_LABEL = 'English';
let activeLang = localStorage.getItem('mts_lang') || 'it';
let currentImages = [];
let currentIndex = 0;
let galleryOffset = 0;
let renderToken = 0;

function getLangData(code){ return LANGUAGES.find(l=>l[0]===code) || LANGUAGES[0]; }
function folderForLang(code){ return getLangData(code)[3] || 'english'; }
function langName(code){ return getLangData(code)[2] || getLangData(code)[1]; }
function t(key){ return (TRANSLATIONS[activeLang] && TRANSLATIONS[activeLang][key]) || TRANSLATIONS.en[key] || key; }

function applyLanguage(){
  document.documentElement.lang = activeLang;
  document.documentElement.dir = activeLang === 'ar' ? 'rtl' : 'ltr';
  document.querySelectorAll('[data-i18n]').forEach(el=>{
    const val = t(el.dataset.i18n);
    if(val.includes('<span>')) el.innerHTML = val; else el.textContent = val;
  });
  document.getElementById('galleryPairLabel').textContent = `${SOURCE_LABEL} → ${langName(activeLang)}`;
  localStorage.setItem('mts_lang', activeLang);
  renderGallery();
}
function setupLanguageSelect(){
  const select=document.getElementById('languageSelect');
  select.innerHTML='';
  LANGUAGES.forEach(([code,label])=>{ const opt=document.createElement('option'); opt.value=code; opt.textContent=label; select.appendChild(opt); });
  select.value=activeLang;
  select.addEventListener('change',()=>{activeLang=select.value; galleryOffset=0; applyLanguage();});
}
function imageExists(src){ return new Promise(resolve=>{ const img=new Image(); img.onload=()=>resolve(src); img.onerror=()=>resolve(null); img.src=src+'?v='+(Date.now()); }); }
function candidates(folder,n){ const two=String(n).padStart(2,'0'); const three=String(n).padStart(3,'0'); const exts=['jpg','jpeg','png','webp']; let arr=[]; exts.forEach(ext=>arr.push(`assets/gallery/${folder}/${two}.${ext}`)); exts.forEach(ext=>arr.push(`assets/gallery/${folder}/${three}.${ext}`)); return arr; }
async function resolveImage(folder,n){ for(const src of candidates(folder,n)){ const ok=await imageExists(src); if(ok) return {thumb:ok,full:ok,n}; } return null; }
async function scanGallery(folder){ const found=[]; for(let i=1;i<=MAX_GALLERY_IMAGES;i++){ const item=await resolveImage(folder,i); if(item) found.push(item); } return found; }
async function renderGallery(){
  const token=++renderToken; const wrap=document.getElementById('translationGallery'); const dots=document.getElementById('galleryDots'); const folder=folderForLang(activeLang);
  wrap.innerHTML='<div class="gallery-loading">Loading gallery...</div>'; dots.innerHTML=''; currentImages=[];
  let images=await scanGallery(folder);
  if(images.length===0 && folder!=='english') images=await scanGallery('english');
  if(token!==renderToken) return;
  wrap.innerHTML=''; currentImages=images.map(x=>x.full);
  if(images.length===0){ wrap.innerHTML=`<div class="gallery-empty">Galleria vuota.<br>Metti le immagini in <b>assets/gallery/${folder}/01.jpg</b>, <b>02.jpg</b>, <b>03.jpg</b>...<br>Supportati: jpg, jpeg, png, webp.</div>`; return; }
  images.forEach((img,index)=>{ const n=String(img.n).padStart(2,'0'); const card=document.createElement('button'); card.className='gallery-card'; card.type='button'; card.innerHTML=`<img loading="lazy" src="${img.thumb}" alt="${langName(activeLang)} translation ${n}"><span>${SOURCE_LABEL} → ${langName(activeLang)} · ${n}</span>`; card.addEventListener('click',()=>openLightbox(index)); wrap.appendChild(card); });
  const pages=Math.ceil(images.length/6); for(let i=0;i<Math.max(1,pages);i++){ const b=document.createElement('button'); if(i===0)b.classList.add('active'); b.addEventListener('click',()=>scrollGalleryPage(i)); dots.appendChild(b); }
}
function scrollGalleryPage(page){ const wrap=document.getElementById('translationGallery'); wrap.scrollTo({left: page * wrap.clientWidth * .86, behavior:'smooth'}); document.querySelectorAll('#galleryDots button').forEach((b,i)=>b.classList.toggle('active',i===page)); }
function galleryMove(dir){ const wrap=document.getElementById('translationGallery'); const max=Math.max(0,wrap.scrollWidth-wrap.clientWidth); const next=Math.min(max,Math.max(0,wrap.scrollLeft + dir * wrap.clientWidth * .78)); wrap.scrollTo({left:next,behavior:'smooth'}); }
function openLightbox(i){ if(!currentImages.length)return; currentIndex=i; updateLightbox(); const lb=document.getElementById('lightbox'); lb.classList.add('active'); lb.setAttribute('aria-hidden','false'); }
function updateLightbox(){ document.getElementById('lightboxImage').src=currentImages[currentIndex]; document.getElementById('lightboxCounter').textContent=`${currentIndex+1} / ${currentImages.length} · ${SOURCE_LABEL} → ${langName(activeLang)}`; }
function closeLightbox(){ const lb=document.getElementById('lightbox'); lb.classList.remove('active'); lb.setAttribute('aria-hidden','true'); document.getElementById('lightboxImage').src=''; }
function nextImage(){ currentIndex=(currentIndex+1)%currentImages.length; updateLightbox(); }
function prevImage(){ currentIndex=(currentIndex-1+currentImages.length)%currentImages.length; updateLightbox(); }
document.addEventListener('DOMContentLoaded',()=>{ setupLanguageSelect(); applyLanguage(); document.getElementById('galleryPrev').onclick=()=>galleryMove(-1); document.getElementById('galleryNext').onclick=()=>galleryMove(1); document.getElementById('closeLightbox').onclick=closeLightbox; document.getElementById('nextImage').onclick=nextImage; document.getElementById('prevImage').onclick=prevImage; document.getElementById('lightbox').addEventListener('click',e=>{ if(e.target.id==='lightbox') closeLightbox(); }); document.addEventListener('keydown',e=>{ if(!document.getElementById('lightbox').classList.contains('active')) return; if(e.key==='Escape')closeLightbox(); if(e.key==='ArrowRight')nextImage(); if(e.key==='ArrowLeft')prevImage(); }); });