(function(){
  /* ---------- Flip cards (tap/click to flip, e.g. Seal of Biliteracy) ---------- */
  document.querySelectorAll('.flip').forEach(function(card){
    card.addEventListener('click', function(e){
      e.preventDefault();
      card.classList.toggle('is-flipped');
    });
    card.addEventListener('keydown', function(e){
      if(e.key === 'Enter' || e.key === ' '){
        e.preventDefault();
        card.classList.toggle('is-flipped');
      }
    });
  });

  /* ---------- Copy patent number ---------- */
  document.querySelectorAll('.copy-btn').forEach(function(btn){
    btn.addEventListener('click', function(e){
      e.preventDefault();
      e.stopPropagation();
      var text = btn.dataset.copy || '';
      var done = function(){
        btn.classList.add('copied');
        setTimeout(function(){ btn.classList.remove('copied'); }, 1400);
      };
      if(navigator.clipboard && navigator.clipboard.writeText){
        navigator.clipboard.writeText(text).then(done, done);
      } else {
        done();
      }
    });
  });

  /* ---------- Confetti burst on hover (Broadcom MASTERS award) ---------- */
  var confettiColors = ['#f0a04b', '#e74c3c', '#16a085', '#8e44ad', '#f6c453'];
  document.querySelectorAll('.confetti-trigger').forEach(function(tile){
    var fired = false;
    tile.addEventListener('mouseenter', function(){
      if(fired) return;
      fired = true;
      for(var i = 0; i < 12; i++){
        var dot = document.createElement('span');
        dot.className = 'confetti-dot';
        var angle = Math.random() * Math.PI * 2;
        var dist = 40 + Math.random() * 50;
        dot.style.setProperty('--dx', Math.cos(angle) * dist + 'px');
        dot.style.setProperty('--dy', Math.sin(angle) * dist + 'px');
        dot.style.left = (40 + Math.random() * 20) + '%';
        dot.style.top = (30 + Math.random() * 20) + '%';
        dot.style.background = confettiColors[i % confettiColors.length];
        tile.appendChild(dot);
        (function(d){ setTimeout(function(){ if(d.parentNode) d.parentNode.removeChild(d); }, 750); })(dot);
      }
      setTimeout(function(){ fired = false; }, 900);
    });
  });

  /* ---------- Quote rotator (Media tile) ---------- */
  document.querySelectorAll('.quote-rotator').forEach(function(rotator){
    var quotes = [];
    try { quotes = JSON.parse(rotator.dataset.quotes || '[]'); } catch(err){ quotes = []; }
    if(quotes.length < 2) return;
    var el = rotator.querySelector('blockquote');
    var i = 0;
    setInterval(function(){
      el.classList.add('fading');
      setTimeout(function(){
        i = (i + 1) % quotes.length;
        el.textContent = quotes[i];
        el.classList.remove('fading');
      }, 400);
    }, 3800);
  });

  /* ---------- Rotated cover-fit video (STEM projects tile) ---------- */
  (function(){
    var wrap = document.querySelector('.tile-video-rotate');
    var video = wrap && wrap.querySelector('.tile-photo-video');
    if(!wrap || !video) return;
    function sizeVideo(){
      var rect = wrap.getBoundingClientRect();
      video.style.width = rect.height + 'px';
      video.style.height = rect.width + 'px';
    }
    sizeVideo();
    window.addEventListener('resize', sizeVideo);
    if(video.readyState === 0){ video.addEventListener('loadedmetadata', sizeVideo); }
  })();

  /* ---------- Days-as-patent-holder counter ---------- */
  var counter = document.querySelector('[data-patent-granted]');
  if(counter){
    var granted = new Date(counter.dataset.patentGranted);
    var days = Math.max(0, Math.floor((Date.now() - granted.getTime()) / 86400000));
    counter.textContent = days.toLocaleString();
  }
})();
