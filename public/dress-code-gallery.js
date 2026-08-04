// dress-code-gallery.js — add inspiration gallery blocks after each dress code card
(function addDressCodeInspirationGalleries(){
  if (window.__AA_DRESS_CODE_GALLERY__) return;
  window.__AA_DRESS_CODE_GALLERY__ = true;

  var style = document.createElement('style');
  style.id = 'aa-dress-code-gallery-style';
  style.textContent = `
    #dress .aa-dress-gallery{
      margin-top:30px!important;
      padding-top:26px!important;
      border-top:1px solid var(--line,rgba(0,0,0,.16))!important;
    }
    #dress .aa-dress-gallery-title{
      font-family:'Glacial Indifference','GlacialIndifference','Montserrat','Avenir Next','Century Gothic','Helvetica Neue',Arial,sans-serif!important;
      font-size:10px!important;
      letter-spacing:.22em!important;
      text-transform:uppercase!important;
      color:var(--sage-deep,var(--ink,#111))!important;
      margin:0 0 14px!important;
      text-align:center!important;
    }
    #dress .aa-dress-gallery-grid{
      display:grid!important;
      grid-template-columns:1.18fr .82fr!important;
      gap:10px!important;
      min-height:182px!important;
    }
    #dress .aa-dress-gallery-main,
    #dress .aa-dress-gallery-side{
      position:relative!important;
      overflow:hidden!important;
      border:1px solid var(--line,rgba(0,0,0,.16))!important;
      background:rgba(255,255,255,.35)!important;
    }
    #dress .aa-dress-gallery-main{
      min-height:182px!important;
    }
    #dress .aa-dress-gallery-side-wrap{
      display:grid!important;
      grid-template-rows:1fr 1fr!important;
      gap:10px!important;
      min-height:182px!important;
    }
    #dress .aa-dress-gallery-side{
      min-height:86px!important;
    }
    #dress .aa-dress-gallery-main:before,
    #dress .aa-dress-gallery-side:before{
      content:''!important;
      position:absolute!important;
      inset:0!important;
      background-size:cover!important;
      background-position:center!important;
      transform:scale(1.02)!important;
      opacity:.92!important;
    }
    #dress .aa-dress-gallery-main:after,
    #dress .aa-dress-gallery-side:after{
      content:attr(data-label)!important;
      position:absolute!important;
      left:10px!important;
      bottom:9px!important;
      padding:5px 8px!important;
      background:rgba(250,246,238,.78)!important;
      border:1px solid rgba(0,0,0,.08)!important;
      backdrop-filter:blur(6px)!important;
      color:var(--ink,#111)!important;
      font-family:'Glacial Indifference','GlacialIndifference','Montserrat','Avenir Next','Century Gothic','Helvetica Neue',Arial,sans-serif!important;
      font-size:8px!important;
      letter-spacing:.16em!important;
      text-transform:uppercase!important;
      line-height:1.2!important;
    }
    #dress .aa-dress-gallery.day-1 .aa-dress-gallery-main:before{
      background-image:linear-gradient(135deg,rgba(255,187,124,.85),rgba(135,206,235,.68)),radial-gradient(circle at 30% 25%,rgba(255,255,255,.88),transparent 28%),radial-gradient(circle at 70% 72%,rgba(252,108,133,.52),transparent 30%)!important;
    }
    #dress .aa-dress-gallery.day-1 .aa-dress-gallery-side:nth-child(1):before{
      background-image:linear-gradient(145deg,rgba(246,208,180,.88),rgba(255,181,192,.70)),radial-gradient(circle at 68% 35%,rgba(255,255,255,.72),transparent 32%)!important;
    }
    #dress .aa-dress-gallery.day-1 .aa-dress-gallery-side:nth-child(2):before{
      background-image:linear-gradient(145deg,rgba(135,206,235,.82),rgba(252,108,133,.55)),radial-gradient(circle at 30% 65%,rgba(255,255,255,.80),transparent 34%)!important;
    }
    #dress .aa-dress-gallery.day-2 .aa-dress-gallery-main:before{
      background-image:linear-gradient(135deg,rgba(244,237,226,.94),rgba(197,165,114,.58)),radial-gradient(circle at 28% 28%,rgba(255,255,255,.80),transparent 30%),radial-gradient(circle at 70% 76%,rgba(211,211,211,.70),transparent 32%)!important;
    }
    #dress .aa-dress-gallery.day-2 .aa-dress-gallery-side:nth-child(1):before{
      background-image:linear-gradient(145deg,rgba(250,240,230,.95),rgba(224,205,149,.62)),radial-gradient(circle at 72% 30%,rgba(255,255,255,.76),transparent 32%)!important;
    }
    #dress .aa-dress-gallery.day-2 .aa-dress-gallery-side:nth-child(2):before{
      background-image:linear-gradient(145deg,rgba(211,211,211,.75),rgba(197,165,114,.52)),radial-gradient(circle at 36% 70%,rgba(255,255,255,.78),transparent 34%)!important;
    }
    @media(max-width:720px){
      #dress .aa-dress-gallery-grid{grid-template-columns:1fr!important;min-height:auto!important;}
      #dress .aa-dress-gallery-main{min-height:172px!important;}
      #dress .aa-dress-gallery-side-wrap{grid-template-columns:1fr 1fr!important;grid-template-rows:auto!important;min-height:92px!important;}
      #dress .aa-dress-gallery-side{min-height:92px!important;}
    }
  `;
  document.head.appendChild(style);

  function buildGallery(index){
    var dayClass = index === 0 ? 'day-1' : 'day-2';
    var labels = index === 0
      ? ['Inspiración día 1','Texturas cálidas','Azul cielo']
      : ['Inspiración día 2','Tehuana / lino','Neutros claros'];
    var wrap = document.createElement('div');
    wrap.className = 'aa-dress-gallery ' + dayClass;
    wrap.innerHTML = `
      <div class="aa-dress-gallery-title">Galería de inspiración</div>
      <div class="aa-dress-gallery-grid">
        <div class="aa-dress-gallery-main" data-label="${labels[0]}"></div>
        <div class="aa-dress-gallery-side-wrap">
          <div class="aa-dress-gallery-side" data-label="${labels[1]}"></div>
          <div class="aa-dress-gallery-side" data-label="${labels[2]}"></div>
        </div>
      </div>
    `;
    return wrap;
  }

  function updateSkyBlueSwatch(){
    var labels = Array.prototype.slice.call(document.querySelectorAll('#dress .dress-swatch-label'));
    labels.forEach(function(label){
      if ((label.textContent || '').trim().toLowerCase() === 'amarillo') {
        label.textContent = 'Azul cielo';
        var item = label.closest('.dress-swatch-item');
        var dot = item && item.querySelector('.dress-color-dot');
        if (dot) dot.style.background = '#87CEEB';
      }
    });
  }

  function mount(){
    var grids = Array.prototype.slice.call(document.querySelectorAll('#dress .dress-swatch-grid'));
    if (!grids.length) return false;
    updateSkyBlueSwatch();
    grids.forEach(function(grid, index){
      if (grid.parentNode && !grid.parentNode.querySelector('.aa-dress-gallery')) {
        grid.insertAdjacentElement('afterend', buildGallery(index));
      }
    });
    return true;
  }

  if (!mount()) {
    var observer = new MutationObserver(function(){ mount(); });
    observer.observe(document.documentElement, { childList:true, subtree:true });
    setTimeout(function(){ mount(); observer.disconnect(); }, 15000);
  } else {
    var observer2 = new MutationObserver(function(){ mount(); });
    observer2.observe(document.getElementById('dress') || document.documentElement, { childList:true, subtree:true });
    setTimeout(function(){ observer2.disconnect(); }, 15000);
  }
})();