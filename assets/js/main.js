(function(){
  var revealEls = document.querySelectorAll('.reveal');
  if(!('IntersectionObserver' in window)){
    revealEls.forEach(function(el){ el.classList.add('in'); });
    return;
  }
  var io = new IntersectionObserver(function(entries){
    entries.forEach(function(e){
      if(e.isIntersecting){ e.target.classList.add('in'); io.unobserve(e.target); }
    });
  }, {threshold:0.12});
  revealEls.forEach(function(el){ io.observe(el); });
})();

/* ---------- Center specific hash targets in the viewport ---------- */
(function(){
  function centerHashTarget(){
    var hash = window.location.hash;
    if(!hash) return;
    var el = document.getElementById(hash.slice(1));
    if(!el || !el.hasAttribute('data-scroll-center')) return;
    var reduceMotion = window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    el.scrollIntoView({ block:'center', behavior: reduceMotion ? 'auto' : 'smooth' });
  }
  window.addEventListener('load', centerHashTarget);
  window.addEventListener('hashchange', centerHashTarget);
})();

/* ---------- Easter egg: console note for the curious ---------- */
(function(){
  var style1 = 'font-family:monospace;font-size:13px;color:#100016;';
  var style2 = 'font-family:monospace;font-size:12px;color:#5a9c62;';
  console.log('%cLooking for something?', style1);
  console.log('%cThe patent page has a pattern you can walk. Try the Konami code anywhere on this site: ↑↑↓↓←→←→BA', style2);
  console.log('%cjeanelled.27@gmail.com — always happy to talk robotics.', style2);
})();

/* ---------- Easter egg: Konami code unlocks a confetti rain ---------- */
(function(){
  if(window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;

  var SEQUENCE = ['ArrowUp','ArrowUp','ArrowDown','ArrowDown','ArrowLeft','ArrowRight','ArrowLeft','ArrowRight','b','a'];
  var pos = 0;
  var COLORS = ['#f0a04b', '#e74c3c', '#16a085', '#8e44ad', '#f6c453', '#5a9c62'];

  function unlock(){
    var overlay = document.createElement('div');
    overlay.className = 'egg-overlay';
    overlay.setAttribute('aria-hidden', 'true');
    document.body.appendChild(overlay);

    for(var i = 0; i < 60; i++){
      var f = document.createElement('div');
      f.className = 'egg-confetti';
      f.style.left = (Math.random() * 100) + 'vw';
      f.style.background = COLORS[i % COLORS.length];
      f.style.animationDelay = (Math.random() * 1.4) + 's';
      f.style.animationDuration = (2.2 + Math.random() * 1.4) + 's';
      f.style.setProperty('--spin', (Math.random() < 0.5 ? -1 : 1) * (360 + Math.random() * 360) + 'deg');
      f.style.setProperty('--drift', (Math.random() * 120 - 60) + 'px');
      if(Math.random() < 0.4) f.style.borderRadius = '50%';
      overlay.appendChild(f);
    }

    var toast = document.createElement('div');
    toast.className = 'egg-toast';
    toast.textContent = 'Pattern accepted — you walked right in.';
    overlay.appendChild(toast);

    setTimeout(function(){ toast.classList.add('egg-toast-in'); }, 30);
    setTimeout(function(){
      toast.classList.remove('egg-toast-in');
      setTimeout(function(){ if(overlay.parentNode) overlay.parentNode.removeChild(overlay); }, 500);
    }, 3400);
  }

  window.addEventListener('keydown', function(e){
    var key = e.key.length === 1 ? e.key.toLowerCase() : e.key;
    pos = (key === SEQUENCE[pos]) ? pos + 1 : (key === SEQUENCE[0] ? 1 : 0);
    if(pos === SEQUENCE.length){ pos = 0; unlock(); }
  });
})();

/* ---------- Portfolio / slides viewers ---------- */
(function(){
  document.querySelectorAll('[data-viewer-open]').forEach(function(btn){
    var viewer = document.getElementById(btn.getAttribute('data-viewer-open'));
    if(!viewer || typeof viewer.showModal !== 'function') return;
    btn.addEventListener('click', function(){
      var frame = viewer.querySelector('iframe');
      if(!frame.src) frame.src = frame.getAttribute('data-src');
      viewer.showModal();
    });
  });
  document.querySelectorAll('dialog.portfolio-viewer').forEach(function(viewer){
    viewer.querySelector('[data-viewer-close]').addEventListener('click', function(){ viewer.close(); });
    viewer.addEventListener('click', function(e){ if(e.target === viewer) viewer.close(); });
  });
})();

/* ---------- Home spotlight: first scroll restores tile color, then scrolling resumes ---------- */
(function(){
  var root = document.documentElement;
  if(!root.classList.contains('bento-spotlight')) return;
  var SCROLL_KEYS = { ArrowDown:1, ArrowUp:1, PageDown:1, PageUp:1, End:1, Home:1, ' ':1 };
  function cleanup(){
    window.removeEventListener('wheel', onIntent, { passive:false });
    window.removeEventListener('touchmove', onIntent, { passive:false });
    window.removeEventListener('keydown', onKey);
    window.removeEventListener('scroll', onScroll);
  }
  function release(){
    root.classList.remove('bento-spotlight');
    cleanup();
    // Keep holding the page through the 0.6s fade, then for a little extra scroll distance
    holdStart = Date.now();
    window.addEventListener('wheel', hold, { passive:false });
    window.addEventListener('touchstart', onTouchStart, { passive:true });
    window.addEventListener('touchmove', hold, { passive:false });
  }
  var HOLD_MS = 600, HOLD_EXTRA_PX = 160;
  var holdStart = 0, extra = 0, touchY = null;
  function onTouchStart(e){ touchY = e.touches[0].clientY; }
  function hold(e){
    var d = 0;
    if(e.type === 'wheel'){ d = Math.abs(e.deltaY); }
    else if(e.touches){
      var y = e.touches[0].clientY;
      if(touchY !== null) d = Math.abs(y - touchY);
      touchY = y;
    }
    if(Date.now() - holdStart >= HOLD_MS) extra += d;
    if(extra < HOLD_EXTRA_PX){ e.preventDefault(); return; }
    window.removeEventListener('wheel', hold, { passive:false });
    window.removeEventListener('touchstart', onTouchStart, { passive:true });
    window.removeEventListener('touchmove', hold, { passive:false });
  }
  function onIntent(e){ e.preventDefault(); release(); }
  function onKey(e){
    if(!SCROLL_KEYS[e.key] || /input|textarea|select/i.test(e.target.tagName)) return;
    e.preventDefault(); release();
  }
  function onScroll(){ release(); }
  window.addEventListener('wheel', onIntent, { passive:false });
  window.addEventListener('touchmove', onIntent, { passive:false });
  window.addEventListener('keydown', onKey);
  window.addEventListener('load', function(){
    if(window.scrollY > 0){ release(); return; }
    window.addEventListener('scroll', onScroll);
  });
})();
