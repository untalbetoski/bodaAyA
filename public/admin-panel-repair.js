// admin-panel-repair.js — non-blocking safety layer for the admin panel
(function repairAdminPanel(){
  try {
    if (window.__AA_ADMIN_PANEL_REPAIR__) return;
    window.__AA_ADMIN_PANEL_REPAIR__ = true;

    function addStyle(){
      if (document.getElementById('aa-admin-panel-repair-style')) return;
      var style = document.createElement('style');
      style.id = 'aa-admin-panel-repair-style';
      style.textContent = `
        .admin-fab,.admin-link,.modal-back,.modal,.admin-panel,.admin-panel *{
          pointer-events:auto!important;
        }
        .modal-back{z-index:320!important;}
        .modal{z-index:321!important;}
        .admin-panel{z-index:330!important;visibility:visible!important;}
        .admin-panel.open{
          transform:translateX(0)!important;
          opacity:1!important;
          visibility:visible!important;
        }
        .admin-panel .tabs button,
        .admin-panel .ft button,
        .admin-panel .body button,
        .modal button{
          cursor:pointer!important;
          pointer-events:auto!important;
        }
        .admin-panel .body input,
        .admin-panel .body textarea,
        .admin-panel .body select,
        .modal input{
          pointer-events:auto!important;
          user-select:text!important;
        }
      `;
      document.head.appendChild(style);
    }

    function loadSafeSectionsEditor(){
      try {
        if (window.__AA_ADMIN_SAFE_PANEL__) return;
        if (document.querySelector('script[data-aa-admin-safe-panel]')) return;
        var s = document.createElement('script');
        s.src = 'admin-safe-panel.js?v=2';
        s.async = true;
        s.defer = true;
        s.setAttribute('data-aa-admin-safe-panel','1');
        s.onerror = function(){ console.error('[AdminRepair] safe sections editor could not load'); };
        document.body.appendChild(s);
      } catch(e) {
        console.error('[AdminRepair] safe editor loader failed:', e);
      }
    }

    function ensureAdminAccessHints(){
      try {
        var fab = document.querySelector('.admin-fab');
        var footer = document.querySelector('.admin-link');
        [fab, footer].forEach(function(btn){
          if (!btn || btn.getAttribute('data-aa-admin-repaired')) return;
          btn.setAttribute('data-aa-admin-repaired','1');
          btn.setAttribute('title','Abrir panel de administración');
        });
      } catch(e) {}
    }

    addStyle();
    setTimeout(loadSafeSectionsEditor, 1400);
    setTimeout(ensureAdminAccessHints, 600);
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