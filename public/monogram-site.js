// monogram-site.js — subtle Andrea & Alberto monogram under hero names
(function addSubtleHeroMonogram(){
  if (window.__AA_MONOGRAM_ACTIVE__) return;
  window.__AA_MONOGRAM_ACTIVE__ = true;

  const style = document.createElement('style');
  style.textContent = `
    .aa-hero-monogram{
      display:block;
      width:min(168px,34vw);
      height:auto;
      margin:20px auto 0;
      opacity:.075;
      pointer-events:none;
      user-select:none;
      filter:grayscale(1);
      mix-blend-mode:multiply;
      transition:opacity .35s ease;
    }
    body[data-mode="editorial"] .aa-hero-monogram{
      margin-left:0;
      margin-right:0;
      width:min(150px,30vw);
      opacity:.065;
    }
    @media(max-width:720px){
      .aa-hero-monogram{
        width:min(142px,40vw);
        margin-top:16px;
        opacity:.07;
      }
    }
  `;
  document.head.appendChild(style);

  function mount(){
    const heroTitle = document.querySelector('#home .hero-title');
    if (!heroTitle || document.querySelector('.aa-hero-monogram')) return false;

    const img = document.createElement('img');
    img.src = 'monograma-aa.svg';
    img.alt = '';
    img.setAttribute('aria-hidden','true');
    img.className = 'aa-hero-monogram';
    heroTitle.insertAdjacentElement('afterend', img);
    return true;
  }

  if (!mount()) {
    const observer = new MutationObserver(() => {
      if (mount()) observer.disconnect();
    });
    observer.observe(document.documentElement, { childList:true, subtree:true });
    window.setTimeout(() => observer.disconnect(), 12000);
  }
})();