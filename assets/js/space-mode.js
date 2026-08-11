(function(){
  var triggers = document.querySelectorAll('.space-hover');
  if(!triggers.length) return;
  var reduceMotion = window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  var root = document.documentElement;
  var originalTheme = root.dataset.theme || 'light';
  var overlay = null;
  var activeCount = 0;
  var leaveTimer = null;

  function buildOverlay(){
    var el = document.createElement('div');
    el.className = 'space-overlay';
    el.setAttribute('aria-hidden', 'true');

    if(!reduceMotion){
      for(var i = 0; i < 70; i++){
        var star = document.createElement('div');
        star.className = 'space-star';
        star.style.left = (Math.random() * 100) + 'vw';
        star.style.top = (Math.random() * 100) + 'vh';
        star.style.setProperty('--size', (1 + Math.random() * 2).toFixed(1) + 'px');
        star.style.animationDelay = (Math.random() * 3) + 's';
        star.style.animationDuration = (1.6 + Math.random() * 2.2) + 's';
        el.appendChild(star);
      }
      for(var s = 0; s < 3; s++){
        var shoot = document.createElement('div');
        shoot.className = 'space-shooting-star';
        shoot.style.top = (Math.random() * 50) + 'vh';
        shoot.style.left = (55 + Math.random() * 40) + 'vw';
        shoot.style.animationDelay = (s * 1.3 + Math.random()) + 's';
        el.appendChild(shoot);
      }
    }
    return el;
  }

  function enter(){
    activeCount++;
    clearTimeout(leaveTimer);
    if(activeCount > 1) return;
    root.dataset.theme = 'dark';
    document.body.classList.add('space-active');
    overlay = buildOverlay();
    document.body.appendChild(overlay);
  }

  function leave(){
    activeCount = Math.max(0, activeCount - 1);
    if(activeCount > 0) return;
    clearTimeout(leaveTimer);
    leaveTimer = setTimeout(function(){
      root.dataset.theme = originalTheme;
      document.body.classList.remove('space-active');
      if(overlay && overlay.parentNode){ overlay.parentNode.removeChild(overlay); }
      overlay = null;
    }, 120);
  }

  triggers.forEach(function(t){
    t.addEventListener('mouseenter', enter);
    t.addEventListener('mouseleave', leave);
    t.addEventListener('focus', enter);
    t.addEventListener('blur', leave);
  });
})();
