// friday-program-close.js — safely add Friday 2:00 am closing item to program section
(function addFridayClosingProgramItem(){
  try {
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
      title.setAttribute('data-aa-friday-close-title', '1');
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
      if (!existing) friday.appendChild(buildRow());
      return true;
    }

    var tries = 0;
    var observer = null;
    function run(){
      tries += 1;
      var done = false;
      try { done = mount(); } catch(e) { console.error('[FridayProgramClose] mount failed:', e); }
      if (done || tries > 40) {
        if (observer) observer.disconnect();
        observer = null;
        return true;
      }
      return false;
    }

    run();
    var interval = setInterval(function(){
      if (run()) clearInterval(interval);
    }, 300);
    setTimeout(function(){
      clearInterval(interval);
      if (observer) observer.disconnect();
    }, 12000);

    observer = new MutationObserver(function(){ run(); });
    observer.observe(document.documentElement, { childList:true, subtree:true });
  } catch(err) {
    console.error('[FridayProgramClose] disabled after error:', err);
  }
})();