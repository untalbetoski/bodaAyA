// pinterest-dresscode.js — add a subtle Pinterest inspiration link to day-one men's dress code
(function addMensPinterestBoard(){
  if (window.__AA_PINTEREST_DRESSCODE__) return;
  window.__AA_PINTEREST_DRESSCODE__ = true;

  const BOARD_URL = 'https://pin.it/5BABCMNG5';

  const style = document.createElement('style');
  style.textContent = `
    .aa-pinterest-men{
      margin-top:18px;
      display:flex;
      align-items:center;
      justify-content:space-between;
      gap:14px;
      padding:12px 14px;
      border:1px solid var(--line);
      background:rgba(255,255,255,.38);
    }
    .aa-pinterest-men-copy{
      display:flex;
      flex-direction:column;
      gap:3px;
      min-width:0;
    }
    .aa-pinterest-men-title{
      font-family:var(--sans);
      font-size:9px;
      letter-spacing:.2em;
      text-transform:uppercase;
      color:var(--sage-deep);
    }
    .aa-pinterest-men-note{
      font-family:var(--serif);
      font-size:13px;
      line-height:1.35;
      color:var(--ink-soft);
      font-style:italic;
    }
    .aa-pinterest-men-link{
      flex-shrink:0;
      display:inline-flex;
      align-items:center;
      justify-content:center;
      padding:9px 11px;
      border:1px solid var(--sage-deep);
      color:var(--sage-deep);
      text-decoration:none;
      font-family:var(--sans);
      font-size:8.5px;
      letter-spacing:.16em;
      text-transform:uppercase;
      transition:background .2s ease,color .2s ease;
    }
    .aa-pinterest-men-link:hover{
      background:var(--sage-deep);
      color:var(--paper);
    }
    @media(max-width:720px){
      .aa-pinterest-men{align-items:flex-start;flex-direction:column;}
      .aa-pinterest-men-link{width:100%;}
    }
  `;
  document.head.appendChild(style);

  function mount(){
    const firstCard = document.querySelector('#dress .dr-grid > :first-child > div');
    if (!firstCard || firstCard.querySelector('.aa-pinterest-men')) return false;

    const box = document.createElement('div');
    box.className = 'aa-pinterest-men';
    box.innerHTML = `
      <div class="aa-pinterest-men-copy">
        <div class="aa-pinterest-men-title">Inspiración para hombres</div>
        <div class="aa-pinterest-men-note">Ideas de atuendo para el primer día</div>
      </div>
      <a class="aa-pinterest-men-link" href="${BOARD_URL}" target="_blank" rel="noopener noreferrer">Ver Pinterest</a>
    `;

    const avoidBox = firstCard.querySelector('div[style*="border: 1px dashed"], div[style*="border:1px dashed"]');
    if (avoidBox) avoidBox.insertAdjacentElement('beforebegin', box);
    else firstCard.appendChild(box);
    return true;
  }

  if (!mount()) {
    const observer = new MutationObserver(() => {
      if (mount()) observer.disconnect();
    });
    observer.observe(document.documentElement, { childList:true, subtree:true });
    window.setTimeout(() => observer.disconnect(), 15000);
  }
})();