// dress-label-patch.js — tiny DOM-only patch: second dress label A EVITAR -> Nota
(function patchTraditionalDressLabel(){
  if (window.__AA_DRESS_LABEL_PATCH_V1__) return;
  window.__AA_DRESS_LABEL_PATCH_V1__ = true;

  function norm(text) {
    return String(text || '')
      .normalize('NFD')
      .replace(/[\u0300-\u036f]/g, '')
      .replace(/\s+/g, ' ')
      .trim()
      .toUpperCase();
  }

  function applyPatch() {
    var section = document.querySelector('#dress');
    if (!section) return false;
    var labels = Array.prototype.slice.call(section.querySelectorAll('.micro'))
      .filter(function(el){
        var t = norm(el.textContent);
        return t === 'A EVITAR' || t === 'AVOID';
      });
    if (labels.length >= 2) {
      labels[1].textContent = norm(labels[1].textContent) === 'AVOID' ? 'Note' : 'Nota';
      return true;
    }
    return false;
  }

  function start() {
    applyPatch();
    var tries = 0;
    var timer = setInterval(function(){
      tries += 1;
      if (applyPatch() || tries > 80) clearInterval(timer);
    }, 250);

    var root = document.getElementById('root') || document.body;
    if (window.MutationObserver && root) {
      var obs = new MutationObserver(function(){ applyPatch(); });
      obs.observe(root, { childList:true, subtree:true, characterData:true });
      setTimeout(function(){ try { obs.disconnect(); } catch(e) {} }, 30000);
    }
  }

  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', start);
  else start();
})();
