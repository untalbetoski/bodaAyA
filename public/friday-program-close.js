// friday-program-close.js — safely add Friday 2:00 am closing item to program section
(function addFridayClosingProgramItem(){
  if (window.__AA_FRIDAY_CLOSE_PROGRAM__) return;
  window.__AA_FRIDAY_CLOSE_PROGRAM__ = true;

  function isEnglish(){
    try {
      var program = document.getElementById('program');
      var text = (program && program.textContent || '').toLowerCase();
      return text.indexOf('friday') >= 0 || text.indexOf('schedule') >= 0;
    } catch(e) { return false; }
  }

  function buildRow(){
    var rowWrap = document.createElement('div');
    rowWrap.className = 'reveal in aa-friday-close-row';
    rowWrap.setAttribute('data-aa-friday-close', '1');

    var row = document.createElement('div');
    row.style.display = 'grid';
    row.style.gridTemplateColumns = '100px 36px 1fr';
    row.style.alignItems = 'center';
    row.style.padding = '22px 0';
    row.style.borderBottom = '1px dashed var(--line)';

    var time = document.createElement('div');
    time.className = 'display';
    time.textContent = '2:00 am';
    time.style.fontSize = '24px';
    time.style.color = 'var(--ink)';
    time.style.letterSpacing = '.06em';

    var icon = document.createElement('div');
    icon.textContent = '❋';
    icon.style.textAlign = 'center';
    icon.style.color = 'var(--sage-deep)';

    var title = document.createElement('div');
    title.textContent = isEnglish() ? 'Closing dance' : 'Cierre con baile';
    title.style.fontSize = '18px';
    title.style.color = 'var(--ink-soft)';
    title.style.fontStyle = 'italic';

    row.appendChild(time);
    row.appendChild(icon);
    row.appendChild(title);
    rowWrap.appendChild(row);
    return rowWrap;
  }

  function mount(){
    var grid = document.querySelector('#program .it-grid');
    if (!grid || !grid.children || !grid.children.length) return false;
    var friday = grid.children[0];
    if (!friday) return false;

    var existing = friday.querySelector('[data-aa-friday-close]');
    if (existing) {
      var title = existing.querySelector('div div:last-child');
      if (title) title.textContent = isEnglish() ? 'Closing dance' : 'Cierre con baile';
      return true;
    }

    friday.appendChild(buildRow());
    return true;
  }

  function run(){
    try { mount(); } catch(e) { console.error('[FridayProgramClose] mount failed:', e); }
  }

  run();
  setTimeout(run, 500);
  setTimeout(run, 1500);
  setTimeout(run, 3000);

  var observer = new MutationObserver(function(){ run(); });
  observer.observe(document.documentElement, { childList:true, subtree:true });
})();