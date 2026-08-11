(function(){
  var map = document.getElementById('journeyMap');
  var section = document.getElementById('programs');
  var pathEl = document.getElementById('journeyPathFill');
  var vehicle = document.getElementById('journeyVehicle');
  var stops = Array.prototype.slice.call(document.querySelectorAll('.journey-stop'));
  var sceneMeta = document.getElementById('journeySceneMeta');
  var sceneTitle = document.getElementById('journeySceneTitle');
  var sceneDesc = document.getElementById('journeySceneDesc');
  if(!map || !section || !pathEl || !vehicle || !stops.length) return;

  var VB_W = 1200, VB_H = 300;
  var totalLen = pathEl.getTotalLength();
  var N = stops.length;

  /* Smoothly shift from one accent to another across the stages, instead of
     cycling through several unrelated colors. */
  function gradientColor(idx){
    var pct = Math.round((idx / (N - 1)) * 100);
    return 'color-mix(in srgb, var(--mint) ' + (100 - pct) + '%, var(--rose) ' + pct + '%)';
  }
  stops.forEach(function(stop, idx){
    stop.style.setProperty('--stop-color', gradientColor(idx));
  });

  /* Sample the path once so we can go from an x-position back to the
     nearest arc-length (path x is monotonic across all three segments). */
  var SAMPLE_COUNT = 400;
  var samples = [];
  for(var i = 0; i <= SAMPLE_COUNT; i++){
    var len = (totalLen * i) / SAMPLE_COUNT;
    var pt = pathEl.getPointAtLength(len);
    samples.push({ len: len, x: pt.x, y: pt.y });
  }

  function lengthForX(targetX){
    var lo = 0, hi = samples.length - 1;
    while(lo < hi){
      var mid = (lo + hi) >> 1;
      if(samples[mid].x < targetX){ lo = mid + 1; } else { hi = mid; }
    }
    return samples[lo].len;
  }

  function lenAtIndex(idx){ return (totalLen * idx) / (N - 1); }

  function placeVehicleAtLength(len){
    var pt = pathEl.getPointAtLength(len);
    vehicle.style.left = (pt.x / VB_W * 100) + '%';
    vehicle.style.top = (pt.y / VB_H * 100) + '%';
  }

  var activeIndex = N - 1;

  function setActive(idx, opts){
    idx = Math.max(0, Math.min(N - 1, idx));
    opts = opts || {};
    activeIndex = idx;
    var stop = stops[idx];

    stops.forEach(function(s){ s.classList.remove('is-active'); s.setAttribute('aria-pressed', 'false'); });
    stop.classList.add('is-active');
    stop.setAttribute('aria-pressed', 'true');

    section.style.setProperty('--journey-accent', gradientColor(idx));

    sceneMeta.innerHTML = stop.dataset.meta;
    sceneTitle.textContent = stop.dataset.title;
    sceneDesc.innerHTML = stop.dataset.desc;

    if(!opts.skipVehicle){
      placeVehicleAtLength(lenAtIndex(idx));
    }
  }

  function nearestIndexForLength(len){
    return Math.round((len / totalLen) * (N - 1));
  }

  stops.forEach(function(stop){
    stop.addEventListener('click', function(){ setActive(parseInt(stop.dataset.index, 10)); });
  });

  /* ---------- Drag the car ---------- */
  var dragging = false;

  function pointerToLength(clientX, clientY){
    var rect = map.getBoundingClientRect();
    var px = Math.max(0, Math.min(1, (clientX - rect.left) / rect.width));
    var targetX = px * VB_W;
    return lengthForX(targetX);
  }

  vehicle.addEventListener('pointerdown', function(e){
    dragging = true;
    vehicle.classList.add('is-dragging');
    vehicle.setPointerCapture(e.pointerId);
  });

  vehicle.addEventListener('pointermove', function(e){
    if(!dragging) return;
    var len = pointerToLength(e.clientX, e.clientY);
    placeVehicleAtLength(len);
    var idx = nearestIndexForLength(len);
    if(idx !== activeIndex){ setActive(idx, { skipVehicle: true }); }
  });

  function endDrag(e){
    if(!dragging) return;
    dragging = false;
    vehicle.classList.remove('is-dragging');
    try { vehicle.releasePointerCapture(e.pointerId); } catch(err){}
    placeVehicleAtLength(lenAtIndex(activeIndex));
  }
  vehicle.addEventListener('pointerup', endDrag);
  vehicle.addEventListener('pointercancel', endDrag);

  /* ---------- Keyboard: arrow keys move between stops ---------- */
  vehicle.addEventListener('keydown', function(e){
    if(e.key === 'ArrowRight' || e.key === 'ArrowDown'){ e.preventDefault(); setActive(activeIndex + 1); }
    else if(e.key === 'ArrowLeft' || e.key === 'ArrowUp'){ e.preventDefault(); setActive(activeIndex - 1); }
  });

  /* Start at the most recent stop; dragging/tabbing backwards rewinds the journey. */
  setActive(N - 1, { skipVehicle: true });
  placeVehicleAtLength(lenAtIndex(N - 1));
})();

/* ---------- View toggle: interactive map vs. simplified list ---------- */
(function(){
  var toggleBtns = Array.prototype.slice.call(document.querySelectorAll('.journey-toggle-btn'));
  var viewMap = document.getElementById('journeyViewMap');
  var viewList = document.getElementById('journeyViewList');
  if(!toggleBtns.length || !viewMap || !viewList) return;

  toggleBtns.forEach(function(btn){
    btn.addEventListener('click', function(){
      var view = btn.dataset.view;
      toggleBtns.forEach(function(b){
        var active = b === btn;
        b.classList.toggle('is-active', active);
        b.setAttribute('aria-pressed', active ? 'true' : 'false');
      });
      viewMap.classList.toggle('is-hidden', view !== 'map');
      viewList.classList.toggle('is-hidden', view !== 'list');
    });
  });
})();
