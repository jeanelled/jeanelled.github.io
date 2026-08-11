(function(){
  var camera = document.querySelector('.egg-camera');
  if(!camera) return;
  if(window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;

  var CAMERA = '\u{1F4F7}';
  var CAMERA_FLASH = '\u{1F4F8}';

  function flashOnce(delay){
    setTimeout(function(){
      var f = document.createElement('div');
      f.className = 'egg-flash';
      f.setAttribute('aria-hidden', 'true');
      document.body.appendChild(f);
      setTimeout(function(){ if(f.parentNode) f.parentNode.removeChild(f); }, 500);
    }, delay);
  }

  function paparazzi(){
    camera.classList.remove('egg-snap');
    void camera.offsetWidth;
    camera.classList.add('egg-snap');

    camera.textContent = CAMERA_FLASH;
    setTimeout(function(){ camera.textContent = CAMERA; }, 450);

    flashOnce(0);
    flashOnce(180);
    flashOnce(360);
    flashOnce(540);

    var toast = document.createElement('div');
    toast.className = 'egg-toast';
    toast.textContent = 'Smile!!';
    document.body.appendChild(toast);
    setTimeout(function(){ toast.classList.add('egg-toast-in'); }, 620);
    setTimeout(function(){
      toast.classList.remove('egg-toast-in');
      setTimeout(function(){ if(toast.parentNode) toast.parentNode.removeChild(toast); }, 500);
    }, 2800);
  }

  camera.addEventListener('click', paparazzi);
})();
