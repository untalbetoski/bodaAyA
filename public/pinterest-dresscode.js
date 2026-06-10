// pinterest-dresscode.js — add subtle Pinterest inspiration links to first-day dress code
(function addPinterestDressCodeBoards(){
  if (window.__AA_PINTEREST_DRESSCODE__) return;
  window.__AA_PINTEREST_DRESSCODE__ = true;

  const BOARDS = [
    {
      title:'Inspiración para hombres',
      note:'Ideas de atuendo para el primer día',
      url:'https://pin.it/5BABCMNG5'
    },
    {
      title:'Inspiración para damas',
      note:'Ideas de vestido para el primer día',
      url:'https://pin.it/2GLDr4kiR'
    }
  ];

  const style = document.createElement('style');
  style.textContent = `
    .aa-pinterest-group{
      margin-top:18px;
      display:grid;
      gap:10px;
    }
    .aa-pinterest-card{
      display:flex;
      align-items:center;
      justify-content:space-between;
      gap:14px;
      padding:12px 14px;
      border:1px solid var(--line);
      background:rgba(255,255,255,.38);
    }
    .aa-pinterest-copy{
      display:flex;
      flex-direction:column;
      gap:3px;
      min-width:0;
    }
    .aa-pinterest-title{
      font-family:var(--sans);
      font-size:9px;
      letter-spacing:.2em;
      text-transform:uppercase;
      color:var(--sage-deep);
    }
    .aa-pinterest-note{
      font-family:var(--serif);
      font-size:13px;
      line-height:1.35;
      color:var(--ink-soft);
      font-style:italic;
    }
    .aa-pinterest-link{
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
    .aa-pinterest-link:hover{
      background:var(--sage-deep);
      color:var(--paper);
    }
    @media(max-width:720px){
      .aa-pinterest-card{align-items:flex-start;flex-direction:column;}
      .aa-pinterest-link{width:100%;}
    }
  `;
  document.head.appendChild(style);

  function mount(){
    const firstCard = document.querySelector('#dress .dr-grid > :first-child > div');
    if (!firstCard || firstCard.querySelector('.aa-pinterest-group')) return false;

    const group = document.createElement('div');
    group.className = 'aa-pinterest-group';
    group.innerHTML = BOARDS.map((board) => `
      <div class="aa-pinterest-card">
        <div class="aa-pinterest-copy">
          <div class="aa-pinterest-title">${board.title}</div>
          <div class="aa-pinterest-note">${board.note}</div>
        </div>
        <a class="aa-pinterest-link" href="${board.url}" target="_blank" rel="noopener noreferrer">Ver Pinterest</a>
      </div>
    `).join('');

    const avoidBox = firstCard.querySelector('div[style*="border: 1px dashed"], div[style*="border:1px dashed"]');
    if (avoidBox) avoidBox.insertAdjacentElement('beforebegin', group);
    else firstCard.appendChild(group);
    return true;
  }

  if (!mount()) {
    const observer = new MutationObserver(() => mount());
    observer.observe(document.documentElement, { childList:true, subtree:true });
    window.setTimeout(() => observer.disconnect(), 15000);
  }
})();