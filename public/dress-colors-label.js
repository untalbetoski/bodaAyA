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
})();
