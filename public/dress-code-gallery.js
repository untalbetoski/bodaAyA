// dress-code-gallery.js — admin-driven dress swatches and inspiration galleries
(function dressCodeAdminDrivenGallery(){
  try {
    if (window.__AA_DRESS_CODE_GALLERY_V2__) return;
    window.__AA_DRESS_CODE_GALLERY_V2__ = true;

    const DEFAULT_CONFIG = {
      colorsLabel_es:'Colores sugeridos',
      day1:{
        title_es:'Galería de inspiración',
        swatches:[
          { c:'#ffbb7c', l:'Naranja Anteado' },
          { c:'#f6d0b4', l:'Durazno' },
          { c:'#87CEEB', l:'Azul cielo' },
          { c:'#fc6c85', l:'Sandía' },
          { c:'#ffb5c0', l:'Rosa' }
        ],
        images:[
          { label:'Inspiración día 1', img:'' },
          { label:'Texturas cálidas', img:'' },
          { label:'Azul cielo', img:'' }
        ]
      },
      day2:{
        title_es:'Galería de inspiración',
        swatches:[
          { c:'#f4ede2', l:'Ivory' },
          { c:'#c5a572', l:'Khaki' },
          { c:'#e0cd95', l:'Crudo' },
          { c:'#faf0e6', l:'Lino' },
          { c:'#d3d3d3', l:'Gris' }
        ],
        images:[
          { label:'Inspiración día 2', img:'' },
          { label:'Tehuana / lino', img:'' },
          { label:'Neutros claros', img:'' }
        ]
      }
    };

    let config = clone(DEFAULT_CONFIG);
    let observer = null;
    let pending = false;

    function clone(obj){ return JSON.parse(JSON.stringify(obj || {})); }
    function merge(base, patch){
      const out = Array.isArray(base) ? base.slice() : Object.assign({}, base || {});
      Object.keys(patch || {}).forEach(function(k){
        const v = patch[k];
        if (v && typeof v === 'object' && !Array.isArray(v)) out[k] = merge(out[k] || {}, v);
        else if (Array.isArray(v)) out[k] = v.map(function(x){ return x && typeof x === 'object' ? Object.assign({}, x) : x; });
        else out[k] = v;
      });
      return out;
    }
    function esc(v){ return String(v == null ? '' : v).replace(/[&<>"']/g, function(ch){ return {'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[ch]; }); }
    function normalizeDressAdmin(data){
      const next = merge(DEFAULT_CONFIG, (data && data.dressAdmin) || {});
      ['day1','day2'].forEach(function(day){
        if (!Array.isArray(next[day].swatches) || !next[day].swatches.length) next[day].swatches = clone(DEFAULT_CONFIG[day].swatches);
        if (!Array.isArray(next[day].images) || !next[day].images.length) next[day].images = clone(DEFAULT_CONFIG[day].images);
      });
      return next;
    }

    function addStyle(){
      if (document.getElementById('aa-dress-code-gallery-style')) return;
      const style = document.createElement('style');
      style.id = 'aa-dress-code-gallery-style';
      style.textContent = `
        #dress .dress-swatch-grid{display:grid!important;grid-template-columns:repeat(5,minmax(0,1fr))!important;gap:10px!important;align-items:start!important;}
        #dress .dress-swatch-item{min-width:0!important;display:flex!important;flex-direction:column!important;align-items:center!important;gap:6px!important;}
        #dress .dress-color-dot{width:44px!important;height:44px!important;min-width:44px!important;max-width:44px!important;flex:0 0 44px!important;border-radius:50%!important;aspect-ratio:1/1!important;margin:0 auto!important;display:block!important;}
        #dress .dress-swatch-label{width:100%!important;text-align:center!important;white-space:normal!important;overflow-wrap:anywhere!important;line-height:1.15!important;}
        #dress .aa-colores-sugeridos{margin-top:auto!important;padding-top:30px!important;margin-bottom:14px!important;text-align:center!important;font-family:var(--button-font,'Montserrat',sans-serif)!important;font-size:10px!important;letter-spacing:.22em!important;text-transform:uppercase!important;color:var(--leaf,var(--sage-deep,#111))!important;line-height:1.3!important;}
        #dress .aa-dress-gallery{margin-top:30px!important;padding-top:26px!important;border-top:1px solid var(--line,rgba(0,0,0,.16))!important;}
        #dress .aa-dress-gallery-title{font-family:var(--button-font,'Montserrat',sans-serif)!important;font-size:10px!important;letter-spacing:.22em!important;text-transform:uppercase!important;color:var(--leaf,var(--sage-deep,#111))!important;margin:0 0 14px!important;text-align:center!important;}
        #dress .aa-dress-gallery-grid{display:grid!important;grid-template-columns:1.18fr .82fr!important;gap:10px!important;min-height:182px!important;}
        #dress .aa-dress-gallery-main,#dress .aa-dress-gallery-side{position:relative!important;overflow:hidden!important;border:1px solid var(--line,rgba(0,0,0,.16))!important;background:rgba(255,250,241,.45)!important;}
        #dress .aa-dress-gallery-main{min-height:182px!important;}
        #dress .aa-dress-gallery-side-wrap{display:grid!important;grid-template-rows:1fr 1fr!important;gap:10px!important;min-height:182px!important;}
        #dress .aa-dress-gallery-side{min-height:86px!important;}
        #dress .aa-dress-gallery-tile{background-size:cover!important;background-position:center!important;}
        #dress .aa-dress-gallery-tile::after{content:attr(data-label)!important;position:absolute!important;left:10px!important;bottom:9px!important;padding:5px 8px!important;background:rgba(250,246,238,.82)!important;border:1px solid rgba(0,0,0,.08)!important;backdrop-filter:blur(6px)!important;color:var(--citrus-deep,var(--ink,#111))!important;font-family:var(--button-font,'Montserrat',sans-serif)!important;font-size:8px!important;letter-spacing:.16em!important;text-transform:uppercase!important;line-height:1.2!important;}
        @media(max-width:720px){#dress .dress-color-dot{width:40px!important;height:40px!important;min-width:40px!important;max-width:40px!important;flex-basis:40px!important;}#dress .aa-dress-gallery-grid{grid-template-columns:1fr!important;min-height:auto!important;}#dress .aa-dress-gallery-main{min-height:172px!important;}#dress .aa-dress-gallery-side-wrap{grid-template-columns:1fr 1fr!important;grid-template-rows:auto!important;min-height:92px!important;}#dress .aa-dress-gallery-side{min-height:92px!important;}}
      `;
      document.head.appendChild(style);
    }

    function fallbackBackground(day){
      const swatches = (config[day] && config[day].swatches) || [];
      const a = (swatches[0] && swatches[0].c) || '#f7d2a7';
      const b = (swatches[1] && swatches[1].c) || '#f9eadb';
      const c = (swatches[2] && swatches[2].c) || '#87CEEB';
      return 'linear-gradient(135deg,' + a + ',' + b + '),radial-gradient(circle at 72% 28%,' + c + ',transparent 34%)';
    }

    function tile(item, cls, day){
      const el = document.createElement('div');
      el.className = cls + ' aa-dress-gallery-tile';
      el.setAttribute('data-label', (item && item.label) || 'Inspiración');
      if (item && item.img) el.style.backgroundImage = 'linear-gradient(0deg,rgba(0,0,0,.05),rgba(0,0,0,.05)),url("' + String(item.img).replace(/"/g, '%22') + '")';
      else el.style.backgroundImage = fallbackBackground(day);
      return el;
    }

    function buildGallery(day){
      const dayConfig = config[day] || DEFAULT_CONFIG[day];
      const images = (dayConfig.images || []).slice(0, 3);
      while (images.length < 3) images.push({ label:'Inspiración', img:'' });
      const wrap = document.createElement('div');
      wrap.className = 'aa-dress-gallery ' + day;
      wrap.innerHTML = '<div class="aa-dress-gallery-title">' + esc(dayConfig.title_es || 'Galería de inspiración') + '</div><div class="aa-dress-gallery-grid"></div>';
      const grid = wrap.querySelector('.aa-dress-gallery-grid');
      grid.appendChild(tile(images[0], 'aa-dress-gallery-main', day));
      const side = document.createElement('div');
      side.className = 'aa-dress-gallery-side-wrap';
      side.appendChild(tile(images[1], 'aa-dress-gallery-side', day));
      side.appendChild(tile(images[2], 'aa-dress-gallery-side', day));
      grid.appendChild(side);
      return wrap;
    }

    function applySwatches(){
      const grids = Array.prototype.slice.call(document.querySelectorAll('#dress .dress-swatch-grid'));
      grids.forEach(function(grid, index){
        const day = index === 0 ? 'day1' : 'day2';
        const swatches = (config[day] && config[day].swatches) || [];
        const items = Array.prototype.slice.call(grid.querySelectorAll('.dress-swatch-item'));
        items.forEach(function(item, i){
          const sw = swatches[i];
          if (!sw) return;
          const dot = item.querySelector('.dress-color-dot');
          const label = item.querySelector('.dress-swatch-label');
          if (dot && sw.c) dot.style.setProperty('background', sw.c, 'important');
          if (label && sw.l) label.textContent = sw.l;
        });
        let label = grid.previousElementSibling;
        if (!label || !label.classList || !label.classList.contains('aa-colores-sugeridos')) {
          label = document.createElement('div');
          label.className = 'aa-colores-sugeridos';
          grid.parentNode.insertBefore(label, grid);
        }
        label.textContent = config.colorsLabel_es || 'Colores sugeridos';
      });
    }

    function mount(){
      const grids = Array.prototype.slice.call(document.querySelectorAll('#dress .dress-swatch-grid'));
      if (!grids.length) return false;
      applySwatches();
      grids.forEach(function(grid, index){
        const day = index === 0 ? 'day1' : 'day2';
        const card = grid.parentNode;
        if (!card) return;
        const old = card.querySelector('.aa-dress-gallery');
        const next = buildGallery(day);
        if (old) old.replaceWith(next);
        else grid.insertAdjacentElement('afterend', next);
      });
      return true;
    }

    function scheduleMount(){
      if (pending) return;
      pending = true;
      requestAnimationFrame(function(){
        pending = false;
        try { mount(); } catch(e) { console.error('[DressGallery] mount failed:', e); }
      });
    }

    async function loadConfig(){
      try {
        let data = window.__AA_SITE_DATA || window.DEFAULT_DATA || {};
        if (window.MockServer && typeof window.MockServer.getContent === 'function') {
          const r = await window.MockServer.getContent();
          if (r && r.data) data = r.data;
        }
        config = normalizeDressAdmin(data);
      } catch(e) {
        config = normalizeDressAdmin(window.__AA_SITE_DATA || window.DEFAULT_DATA || {});
      }
      scheduleMount();
    }

    addStyle();
    loadConfig();
    window.addEventListener('aa:content-updated', function(e){
      config = normalizeDressAdmin((e && e.detail && e.detail.data) || window.__AA_SITE_DATA || window.DEFAULT_DATA || {});
      scheduleMount();
    });

    observer = new MutationObserver(function(){ scheduleMount(); });
    observer.observe(document.documentElement, { childList:true, subtree:true });
    setTimeout(function(){ if (observer) observer.disconnect(); observer = null; scheduleMount(); }, 18000);
  } catch(err) {
    console.error('[DressGallery] disabled after error:', err);
  }
})();