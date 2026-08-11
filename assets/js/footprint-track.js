(function(){
  if(window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;
  if(window.matchMedia && !window.matchMedia('(pointer: fine)').matches) return;

  var FOOT_SVG = '<svg viewBox="0 0 20 32" xmlns="http://www.w3.org/2000/svg">' +
    '<ellipse cx="10" cy="21" rx="7" ry="10.5"/>' +
    '<circle cx="4.2" cy="7.2" r="2.1"/>' +
    '<circle cx="8.3" cy="3.6" r="2.3"/>' +
    '<circle cx="12.8" cy="3" r="2.2"/>' +
    '<circle cx="16.6" cy="4.6" r="1.9"/>' +
    '<circle cx="18.8" cy="8" r="1.4"/>' +
    '</svg>';

  var MIN_DIST = 20;
  var LIFETIME = 700;
  var MAX_PRINTS = 14;

  function initTrack(track){
    var layer = document.createElement('div');
    layer.className = 'tile-footprint-layer';
    layer.setAttribute('aria-hidden', 'true');
    track.appendChild(layer);

    var lastX = null, lastY = null, side = 1;
    var active = [];

    function spawn(x, y, thetaRad, stepSide){
      var wrap = document.createElement('div');
      wrap.className = 'tile-footprint';
      var perp = thetaRad + Math.PI / 2;
      var offset = 5;
      var px = Math.cos(perp) * offset * stepSide;
      var py = Math.sin(perp) * offset * stepSide;
      var angleDeg = thetaRad * 180 / Math.PI + 90;
      wrap.style.left = x + 'px';
      wrap.style.top = y + 'px';
      wrap.style.transform = 'translate(-50%,-50%) translate(' + px + 'px,' + py + 'px) rotate(' + angleDeg + 'deg)' + (stepSide < 0 ? ' scaleX(-1)' : '');

      var mark = document.createElement('div');
      mark.className = 'tile-footprint-mark';
      mark.innerHTML = FOOT_SVG;
      wrap.appendChild(mark);
      layer.appendChild(wrap);
      active.push(wrap);

      requestAnimationFrame(function(){ mark.classList.add('fade'); });
      setTimeout(function(){
        if(wrap.parentNode) wrap.parentNode.removeChild(wrap);
        var idx = active.indexOf(wrap);
        if(idx !== -1) active.splice(idx, 1);
      }, LIFETIME);

      if(active.length > MAX_PRINTS){
        var old = active.shift();
        if(old && old.parentNode) old.parentNode.removeChild(old);
      }
    }

    track.addEventListener('mousemove', function(e){
      var rect = track.getBoundingClientRect();
      var x = e.clientX - rect.left, y = e.clientY - rect.top;
      if(lastX === null){ lastX = x; lastY = y; return; }
      var dx = x - lastX, dy = y - lastY;
      var dist = Math.sqrt(dx * dx + dy * dy);
      if(dist < MIN_DIST) return;
      spawn(x, y, Math.atan2(dy, dx), side);
      side *= -1;
      lastX = x; lastY = y;
    }, { passive: true });

    track.addEventListener('mouseleave', function(){ lastX = null; lastY = null; });
  }

  document.querySelectorAll('.tile-footprint-track').forEach(initTrack);
})();
