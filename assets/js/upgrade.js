(function(){'use strict';
 const nav=document.getElementById('nav'),toggle=document.getElementById('navToggle');
 if(nav&&toggle){toggle.setAttribute('aria-controls','navMenu');toggle.setAttribute('aria-expanded','false');
 const sync=()=>toggle.setAttribute('aria-expanded',String(nav.classList.contains('open')));
 toggle.addEventListener('click',sync);
 const close=()=>{nav.classList.remove('open');toggle.classList.remove('open');sync()};
 nav.querySelectorAll('a').forEach(a=>a.addEventListener('click',close));
 document.addEventListener('keydown',e=>{if(e.key==='Escape'&&nav.classList.contains('open')){close();toggle.focus()}});
 }
 document.querySelectorAll('img:not([fetchpriority="high"]):not(.brand-logo)').forEach(img=>{img.loading='lazy';img.decoding='async'});
 document.querySelectorAll('.tf-mobile-nav').forEach(menu=>{
   menu.querySelectorAll('a').forEach(link=>link.addEventListener('click',()=>{menu.open=false;}));
   document.addEventListener('keydown',event=>{if(event.key==='Escape'&&menu.open){menu.open=false;menu.querySelector('summary').focus();}});
 });
})();
