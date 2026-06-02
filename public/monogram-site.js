// monogram-site.js — subtle bottom-right monogram signature
(function(){
  if (window.__AA_MONOGRAM_ACTIVE__) return;
  window.__AA_MONOGRAM_ACTIVE__ = true;

  const style = document.createElement('style');
  style.textContent = '.aa-corner-monogram{position:fixed;right:16px;bottom:14px;width:58px;height:auto;opacity:.10;pointer-events:none;user-select:none;filter:grayscale(1);mix-blend-mode:multiply;z-index:24}@media(max-width:720px){.aa-corner-monogram{right:10px;bottom:10px;width:48px;opacity:.09}}';
  document.head.appendChild(style);

  function mount(){
    if (!document.body || document.querySelector('.aa-corner-monogram')) return;
    const img = document.createElement('img');
    img.src = '/monograma-aa.svg';
    img.alt = '';
    img.setAttribute('aria-hidden','true');
    img.className = 'aa-corner-monogram';
    document.body.appendChild(img);
  }

  if (document.body) mount();
  else document.addEventListener('DOMContentLoaded', mount, { once:true });
})();