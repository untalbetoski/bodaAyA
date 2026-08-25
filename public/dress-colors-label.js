// dress-colors-label.js — add label above dress-code color swatches
(function addDressSuggestedColorsLabel(){
  if (window.__AA_DRESS_COLORS_LABEL__) return;
  window.__AA_DRESS_COLORS_LABEL__ = true;

  var style = document.createElement('style');
  style.id = 'aa-dress-colors-label-style';
  style.textContent = `
    #dress .aa-colores-sugeridos{
      margin-top:auto!important;
      padding-top:30px!important;
      margin-bottom:14px!important;
      text-align:center!important;
      font-family:'Glacial Indifference','GlacialIndifference','Montserrat','Avenir Next','Century Gothic','Helvetica Neue',Arial,sans-serif!important;
      font-size:10px!important;
      letter-spacing:.22em!important;
      text-transform:uppercase!important;
      color:var(--ink,#050505)!important;
      line-height:1.3!important;
    }
    #dress .aa-colores-sugeridos + .dress-swatch-grid{
      margin-top:0!important;
      padding-top:0!important;
    }
  `;
  document.head.appendChild(style);

  function mount(){
    var grids = document.querySelectorAll('#dress .dress-swatch-grid');
    grids.forEach(function(grid){
      if (grid.previousElementSibling && grid.previousElementSibling.classList && grid.previousElementSibling.classList.contains('aa-colores-sugeridos')) return;
      if (grid.previousElementSibling && grid.previousElementSibling.classList && grid.previousElementSibling.classList.contains('aa-dress-colors-label')) return;
      var label = document.createElement('div');
      label.className = 'aa-colores-sugeridos';
      label.textContent = 'Colores sugeridos';
      grid.parentNode.insertBefore(label, grid);
    });
  }

  mount();
  var observer = new MutationObserver(mount);
  observer.observe(document.documentElement, { childList:true, subtree:true });
  setTimeout(mount, 600);
  setTimeout(mount, 1600);
  setTimeout(function(){ observer.disconnect(); }, 12000);
})();

// Load only the current safe editor for Nuevas secciones.
// Older admin-safe-panel.js versions must not be loaded because they used a separate save flow.
(function loadSafeAdminEditorV6(){
  try {
    if (window.__AA_SAFE_ADMIN_EDITOR_LOADER_V6__) return;
    window.__AA_SAFE_ADMIN_EDITOR_LOADER_V6__ = true;
    function load(){
      try {
        if (window.__AA_ADMIN_SAFE_PANEL_V6__) return;
        if (document.querySelector('script[data-aa-admin-safe-panel-v6]')) return;
        document.querySelectorAll('.aa-safe-open-btn').forEach(function(btn){ btn.remove(); });
        var script = document.createElement('script');
        script.src = 'admin-safe-panel-v6.js?v=6';
        script.async = true;
        script.defer = true;
        script.setAttribute('data-aa-admin-safe-panel-v6','1');
        script.onerror = function(){ console.error('[AdminSafePanelV6] file could not be loaded'); };
        document.body.appendChild(script);
      } catch(e) {
        console.error('[AdminSafePanelV6] loader failed:', e);
      }
    }
    if (document.readyState === 'complete') setTimeout(load, 600);
    else window.addEventListener('load', function(){ setTimeout(load, 600); });
  } catch(e) {}
})();