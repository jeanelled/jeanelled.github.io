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
