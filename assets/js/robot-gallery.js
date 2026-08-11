(function(){
  var btn = document.getElementById('robotGalleryBtn');
  var modal = document.getElementById('robotModal');
  if(!btn || !modal) return;

  var closers = modal.querySelectorAll('[data-robot-close]');
  var lastFocus = null;
  var titleGif = document.getElementById('robotTitleGif');
  var gifTimer = null;
  var GIF_DURATION = 7100;

  function onKeydown(e){
    if(e.key === 'Escape') close();
  }

  function playGifOnce(){
    if(!titleGif) return;
    var animSrc = titleGif.getAttribute('data-anim');
    var stillSrc = titleGif.getAttribute('data-still');
    if(gifTimer) clearTimeout(gifTimer);
    titleGif.src = animSrc + '?t=' + Date.now();
    gifTimer = setTimeout(function(){
      titleGif.src = stillSrc;
    }, GIF_DURATION);
  }

  function open(){
    lastFocus = document.activeElement;
    modal.classList.add('is-open');
    modal.setAttribute('aria-hidden', 'false');
    var closeBtn = modal.querySelector('.robot-modal-close');
    if(closeBtn) closeBtn.focus();
    document.addEventListener('keydown', onKeydown);
    playGifOnce();
  }

  function close(){
    modal.classList.remove('is-open');
    modal.setAttribute('aria-hidden', 'true');
    document.removeEventListener('keydown', onKeydown);
    if(lastFocus && lastFocus.focus) lastFocus.focus();
  }

  btn.addEventListener('click', open);
  closers.forEach(function(el){ el.addEventListener('click', close); });
})();
