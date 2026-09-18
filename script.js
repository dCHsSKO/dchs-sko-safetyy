const items=['Окна защищены блокираторами','Дети не остаются без присмотра','Дымоход очищен','Печь без повреждений','На печи нет вещей','Провода без повреждений','Розетки не перегружены','Дымовой извещатель работает','Батарея извещателя проверена','Все знают 101 и 112'];
const list=document.querySelector('.checklist');
const saved=JSON.parse(localStorage.getItem('safeHomeV2')||'[]');
items.forEach((x,i)=>{const l=document.createElement('label');const c=document.createElement('input');c.type='checkbox';c.checked=!!saved[i];c.setAttribute('aria-label',x);l.append(c,document.createTextNode(x));list.append(l)});
const boxes=[...list.querySelectorAll('input')],bar=document.querySelector('.meter span'),pct=document.getElementById('pct');
function up(){const n=boxes.filter(x=>x.checked).length;bar.style.width=n*10+'%';pct.textContent=n*10+'%';boxes.forEach(x=>x.parentElement.classList.toggle('done',x.checked));localStorage.setItem('safeHomeV2',JSON.stringify(boxes.map(x=>x.checked)))}
boxes.forEach(x=>x.addEventListener('change',up));up();
document.getElementById('reset').addEventListener('click',()=>{boxes.forEach(x=>x.checked=false);up()});
const u=location.href.split('#')[0],url=document.getElementById('url'),qr=document.getElementById('qrimg');
if(u.startsWith('file:')){url.textContent='Адрес появится после публикации';qr.src='https://api.qrserver.com/v1/create-qr-code/?size=700x700&margin=12&data=https%3A%2F%2Fexample.com%2F'}else{url.textContent=u;qr.src='https://api.qrserver.com/v1/create-qr-code/?size=700x700&margin=12&data='+encodeURIComponent(u)}
document.getElementById('copyUrl').addEventListener('click',async()=>{const text=u.startsWith('file:')?'Ссылка появится после публикации':u;try{await navigator.clipboard.writeText(text);document.getElementById('copyUrl').textContent='СКОПИРОВАНО ✓';setTimeout(()=>document.getElementById('copyUrl').textContent='СКОПИРОВАТЬ ССЫЛКУ',1400)}catch(e){}});
const topBtn=document.getElementById('topBtn');window.addEventListener('scroll',()=>topBtn.classList.toggle('show',scrollY>500),{passive:true});topBtn.addEventListener('click',()=>scrollTo({top:0,behavior:'smooth'}));
const links=[...document.querySelectorAll('nav a')], sections=links.map(a=>document.querySelector(a.getAttribute('href'))).filter(Boolean);const io=new IntersectionObserver(es=>es.forEach(e=>{if(e.isIntersecting){links.forEach(a=>a.classList.toggle('active',a.getAttribute('href')==='#'+e.target.id))}}),{rootMargin:'-35% 0px -55%'});sections.forEach(s=>io.observe(s));

// Installable PWA: one app, same safety memo.
let deferredInstall = null;
const installApp = document.getElementById('installApp');
const installMini = document.getElementById('installMini');
const installToast = document.getElementById('installToast');
const toastInstall = document.getElementById('toastInstall');
const toastClose = document.getElementById('toastClose');
const installHint = document.getElementById('installHint');
function isStandalone(){return window.matchMedia('(display-mode: standalone)').matches || window.navigator.standalone === true}
function showInstallUI(){
  if (isStandalone()) return;
  if (installMini) installMini.hidden=false;
  if (installToast) installToast.hidden=false;
}
window.addEventListener('beforeinstallprompt', e => {
  e.preventDefault(); deferredInstall=e; showInstallUI();
  if (installHint) installHint.textContent='Нажмите «Установить» — приложение добавится на экран телефона.';
});
async function installPWA(){
  if (deferredInstall){
    deferredInstall.prompt();
    const result=await deferredInstall.userChoice;
    deferredInstall=null;
    if(result.outcome==='accepted') hideInstallUI();
    return;
  }
  // iOS/Safari does not expose beforeinstallprompt: give the native install path.
  if (installHint) installHint.textContent='В Safari: «Поделиться» → «На экран Домой». В Chrome: меню ⋮ → «Установить приложение». ';
  if (installToast) installToast.hidden=false;
}
function hideInstallUI(){
  if(installMini) installMini.hidden=true;
  if(installToast) installToast.hidden=true;
}
[installApp,installMini,toastInstall].filter(Boolean).forEach(b=>b.addEventListener('click',installPWA));
if(toastClose) toastClose.addEventListener('click',()=>installToast.hidden=true);
window.addEventListener('appinstalled',hideInstallUI);
if(isStandalone()) hideInstallUI();
