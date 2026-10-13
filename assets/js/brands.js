(function(){'use strict';
  const root=document.querySelector('[data-brands]');if(!root)return;
  const rail=root.querySelector('.brands__slider'),track=root.querySelector('.brands__track'),group=root.querySelector('.brands__group'),toggle=root.querySelector('[data-brands-toggle]');
  if(!rail||!track||!group||!toggle)return;
  const media=window.matchMedia?window.matchMedia('(prefers-reduced-motion: reduce)'):{matches:false};
  const clone=group.cloneNode(true);clone.setAttribute('aria-hidden','true');clone.querySelectorAll('button').forEach(b=>b.tabIndex=-1);track.appendChild(clone);
  let playing=!media.matches,visible=true,hovering=false,frame=0,last=0,position=rail.scrollLeft;
  function sync(){toggle.textContent=playing?'Lauf pausieren':'Lauf starten';toggle.setAttribute('aria-pressed',String(playing));}
  function tick(now){frame=0;if(!playing||!visible||hovering||document.hidden){last=0;return;}if(last){position+=(Math.min(50,now-last))*.023;const width=group.getBoundingClientRect().width;if(width>0){if(position>=width)position-=width;rail.scrollLeft=position;}}last=now;frame=requestAnimationFrame(tick);}
  function start(){position=rail.scrollLeft;last=0;if(!frame&&playing&&visible&&!hovering&&!document.hidden)frame=requestAnimationFrame(tick);}
  function stop(){if(frame)cancelAnimationFrame(frame);frame=0;last=0;}
  function pause(){playing=false;stop();sync();}
  function touched(target){rail.querySelectorAll('.is-touched').forEach(n=>n.classList.remove('is-touched'));const item=target&&target.closest('.brand-logo-box');if(item&&rail.contains(item))item.classList.add('is-touched');}
  toggle.addEventListener('click',()=>{playing=!playing;sync();if(playing)start();else stop();});
  rail.addEventListener('pointerdown',e=>{pause();touched(e.target);},{passive:true});
  rail.addEventListener('touchmove',e=>{if(e.touches.length===1){const p=e.touches[0];touched(document.elementFromPoint(p.clientX,p.clientY));}},{passive:true});
  rail.addEventListener('pointermove',e=>{if(e.pointerType==='mouse')touched(e.target);},{passive:true});
  rail.addEventListener('pointerenter',e=>{if(e.pointerType==='mouse'){hovering=true;stop();}});
  rail.addEventListener('pointerleave',()=>{hovering=false;rail.querySelectorAll('.is-touched').forEach(n=>n.classList.remove('is-touched'));start();});
  rail.addEventListener('wheel',pause,{passive:true});
  rail.addEventListener('focusin',pause);
  rail.addEventListener('keydown',e=>{if(e.key==='ArrowRight'||e.key==='ArrowLeft'){e.preventDefault();pause();rail.scrollLeft+=e.key==='ArrowRight'?154:-154;}});
  if(window.IntersectionObserver){const observer=new IntersectionObserver(entries=>{visible=entries.some(e=>e.isIntersecting);if(visible)start();else stop();});observer.observe(rail);}
  document.addEventListener('visibilitychange',()=>document.hidden?stop():start());
  if(media.addEventListener)media.addEventListener('change',()=>{if(media.matches)pause();});
  root.dataset.brandsReady='true';sync();start();
})();
