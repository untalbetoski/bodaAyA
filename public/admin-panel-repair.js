// admin-panel-repair.js — lightweight admin UI safety only
(function repairAdminPanel(){
  try {
    if (window.__AA_ADMIN_PANEL_REPAIR_V7__) return;
    window.__AA_ADMIN_PANEL_REPAIR_V7__ = true;

    function addStyle(){
      if (document.getElementById('aa-admin-panel-repair-style-v7')) return;
      var style = document.createElement('style');
      style.id = 'aa-admin-panel-repair-style-v7';
      style.textContent = `
        .admin-fab,.admin-link,.admin-panel,.admin-panel *{pointer-events:auto!important;}
        .admin-panel{z-index:330!important;visibility:visible!important;}
        .admin-panel.open{transform:translateX(0)!important;opacity:1!important;visibility:visible!important;}
        .admin-panel .tabs button,.admin-panel .ft button,.admin-panel .body button{cursor:pointer!important;pointer-events:auto!important;}
        .admin-panel .body input,.admin-panel .body textarea,.admin-panel .body select{pointer-events:auto!important;user-select:text!important;}
      `;
      document.head.appendChild(style);
    }

    function loadSafeSectionsModal(){
      try {
        if (window.__AA_ADMIN_SAFE_PANEL_V5__) return;
        if (document.querySelector('script[data-aa-admin-safe-panel-v5]')) return;
        var oldButtons = document.querySelectorAll('.aa-safe-open-btn:not([data-aa-safe-v5])');
        oldButtons.forEach(function(btn){ btn.remove(); });
        var s = document.createElement('script');
        s.src = 'admin-safe-panel-v5.js?v=5';
        s.async = true;
        s.defer = true;
        s.setAttribute('data-aa-admin-safe-panel-v5','1');
        s.onerror = function(){ console.error('[AdminRepair] safe sections modal v5 could not load'); };
        document.body.appendChild(s);
      } catch(e) {
        console.error('[AdminRepair] safe modal loader failed:', e);
      }
    }

    function ensureAdminAccessHints(){
      try {
        var buttons = [document.querySelector('.admin-fab'), document.querySelector('.admin-link')];
        buttons.forEach(function(btn){
          if (!btn || btn.getAttribute('data-aa-admin-repaired-v7')) return;
          btn.setAttribute('data-aa-admin-repaired-v7','1');
          btn.setAttribute('title','Abrir panel de administración');
        });
      } catch(e) {}
    }

    addStyle();
    var idle = window.requestIdleCallback || function(fn){ return setTimeout(fn, 700); };
    idle(loadSafeSectionsModal);
    setTimeout(loadSafeSectionsModal, 1200);
    setTimeout(ensureAdminAccessHints, 700);
    setTimeout(ensureAdminAccessHints, 1800);

    document.addEventListener('keydown', function(e){
      try {
        if ((e.ctrlKey || e.metaKey) && e.shiftKey && e.key.toLowerCase() === 'a') {
          e.preventDefault();
          var btn = document.querySelector('.admin-fab') || document.querySelector('.admin-link');
          if (btn) btn.click();
        }
      } catch(err) {}
    }, true);
  } catch(err) {
    console.error('[AdminRepair] disabled after error:', err);
  }
})();