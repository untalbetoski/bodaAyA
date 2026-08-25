// dress-code-gallery.js — reliable admin-driven dress swatches and inspiration galleries
(function dressCodeAdminDrivenGalleryV4(){
  try {
    if (window.__AA_DRESS_CODE_GALLERY_V4__) return;
    window.__AA_DRESS_CODE_GALLERY_V4__ = true;

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
    let pending = false;
    let lastServerLoad = 0;

    function clone(obj){
      try { return JSON.parse(JSON.stringify(obj || {})); }
      catch(e) { return Array.isArray(obj) ? obj.slice() : Object.assign({}, obj || {}); }
    }

    function merge(base, patch){
      const out = Array.isArray(base) ? base.slice() : Object.assign({}, base || {});
      Object.keys(patch || {}).forEach(function(k){
        const v = patch[k];
        if (v && typeof v === 'object' && !Array.isArray(v)) out[k] = merge(out[k] || {}, v);
        else if (Array.isArray(v)) out[k] = v.map(function(x){ return x && typeof x === 'object' ? clone(x) : x; });
        else out[k] = v;
      });
      return out;
    }

    function esc(v){
      return String(v == null ? '' : v).replace(/[&<>"']/g, function(ch){
        return {'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[ch];
      });
    }

    function normalizeDressAdmin(data){
      const next = merge(DEFAULT_CONFIG, (data && data.dressAdmin) || {});
      ['day1','day2'].forEach(function(day){
        if (!next[day]) next[day] = clone(DEFAULT_CONFIG[day]);
        if (!Array.isArray(next[day].swatches) || !next[day].swatches.length) next[day].swatches = clone(DEFAULT_CONFIG[day].swatches);
        if (!Array.isArray(next[day].images) || !next[day].images.length) next[day].images = clone(DEFAULT_CONFIG[day].images);
      });
      return next;
    }

    function galleryKey(day){
      try { return day + ':' + JSON.stringify(config[day] || {}) + ':' + (config.colorsLabel_es || ''); }
      catch(e) { return day + ':' + Date.now(); }
    }

    function addStyle(){
      if (document.getElementById('aa-dress-code-gallery-style-v4')) return;
      ['aa-dress-code-gallery-style','aa-dress-code-gallery-style-v3'].forEach(function(id){
        const old = document.getElementById(id);
        if (old) old.remove();
      });
      const style = document.createElement('style');
      style.id = 'aa-dress-code-gallery-style-v4';
      style.textContent = `
        #dress .dress-swatch-grid{display:grid!important;grid-template-columns:repeat(5,minmax(0,1fr))!important;gap:10px!important;align-items:start!important;}
        #dress .dress-swatch-item{min-width:0!important;display:flex!important;flex-direction:column!important;align-items:center!important;gap:6px!important;}
        #dress .dress-color-dot{width:44px!important;height:44px!important;min-width:44px!important;max-width:44px!important;flex:0 0 44px!important;border-radius:50%!important;aspect-ratio:1/1!important;margin:0 auto!important;display:block!important;}
        #dress .dress-swatch-label{width:100%!important;text-align:center!important;white-space:normal!important;overflow-wrap:anywhere!important;line-height:1.15!important;}
        #dress .aa-colores-sugeridos{margin-top:auto!important;padding-top:30px!important;margin-bottom:14px!important;text-align:center!important;font-family:var(--button-font,'Montserrat',sans-serif)!important;font-size:10px!important;letter-spacing:.22em!important;text-transform:uppercase!important;color:var(--leaf,var(--sage-deep,#111))!important;line-height:1.3!important;}
        #dress .aa-dress-gallery{margin-top:30px!important;padding-top:26px!important;border-top:1px solid var(--line,rgba(0,0,0,.16))!important;width:100%!important;}
        #dress .aa-dress-gallery-title{font-family:var(--button-font,'Montserrat',sans-serif)!important;font-size:10px!important;letter-spacing:.22em!important;text-transform:uppercase!important;color:var(--leaf,var(--sage-deep,#111))!important;margin:0 0 14px!important;text-align:center!important;}
        #dress .aa-dress-gallery-grid{display:grid!important;grid-template-columns:repeat(auto-fit,minmax(132px,1fr))!important;gap:10px!important;align-items:stretch!important;}
        #dress .aa-dress-gallery-tile{position:relative!important;overflow:hidden!important;border:1px solid var(--line,rgba(0,0,0,.16))!important;background:rgba(255,250,241,.55)!important;min-height:150px!important;display:block!important;}
        #dress .aa-dress-gallery-tile:first-child{grid-column:span 2!important;min-height:204px!important;}
        #dress .aa-dress-gallery-tile img{width:100%!important;height:100%!important;min-height:inherit!important;object-fit:cover!important;display:block!important;}
        #dress .aa-dress-gallery-placeholder{width:100%!important;height:100%!important;min-height:inherit!important;display:block!important;background-size:cover!important;background-position:center!important;}
        #dress .aa-dress-gallery-tile::after{content:attr(data-label)!important;position:absolute!important;left:10px!important;right:auto!important;bottom:9px!important;max-width:calc(100% - 20px)!important;padding:5px 8px!important;background:rgba(250,246,238,.86)!important;border:1px solid rgba(0,0,0,.08)!important;backdrop-filter:blur(6px)!important;color:var(--citrus-deep,var(--ink,#111))!important;font-family:var(--button-font,'Montserrat',sans-serif)!important;font-size:8px!important;letter-spacing:.16em!important;text-transform:uppercase!important;line-height:1.2!important;white-space:normal!important;}
        @media(max-width:720px){#dress .dress-color-dot{width:40px!important;height:40px!important;min-width:40px!important;max-width:40px!important;flex-basis:40px!important;}#dress .aa-dress-gallery-grid{grid-template-columns:1fr 1fr!important;}#dress .aa-dress-gallery-tile,#dress .aa-dress-gallery-tile:first-child{grid-column:auto!important;min-height:128px!important;}}
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

    function tile(item, day){
      const el = document.createElement('div');
      const url = item && item.img ? String(item.img).trim() : '';
      el.className = 'aa-dress-gallery-tile';
      el.setAttribute('data-label', (item && item.label) || 'Inspiración');
      if (url) {
        const img = document.createElement('img');
        img.src = url;
        img.alt = (item && item.label) || 'Inspiración';
        img.loading = 'lazy';
        img.decoding = 'async';
        img.onerror = function(){
          img.remove();
          const ph = document.createElement('span');
          ph.className = 'aa-dress-gallery-placeholder';
          ph.style.backgroundImage = fallbackBackground(day);
          el.appendChild(ph);
        };
        el.appendChild(img);
      } else {
        const ph = document.createElement('span');
        ph.className = 'aa-dress-gallery-placeholder';
        ph.style.backgroundImage = fallbackBackground(day);
        el.appendChild(ph);
      }
      return el;
    }

    function buildGallery(day){
      const dayConfig = config[day] || DEFAULT_CONFIG[day];
      const images = Array.isArray(dayConfig.images) ? dayConfig.images.slice() : [];
      while (images.length < 3) images.push({ label:'Inspiración', img:'' });
      const wrap = document.createElement('div');
      wrap.className = 'aa-dress-gallery ' + day;
      wrap.setAttribute('data-aa-dress-gallery-key', galleryKey(day));
      wrap.setAttribute('data-aa-dress-gallery-version', '4');
      wrap.innerHTML = '<div class="aa-dress-gallery-title">' + esc(dayConfig.title_es || 'Galería de inspiración') + '</div><div class="aa-dress-gallery-grid"></div>';
      const grid = wrap.querySelector('.aa-dress-gallery-grid');
      images.forEach(function(item){ grid.appendChild(tile(item, day)); });
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
      addStyle();
      applySwatches();
      grids.forEach(function(grid, index){
        const day = index === 0 ? 'day1' : 'day2';
        const card = grid.parentNode;
        if (!card) return;
        const key = galleryKey(day);
        const old = card.querySelector('.aa-dress-gallery');
        if (old && old.getAttribute('data-aa-dress-gallery-key') === key && old.getAttribute('data-aa-dress-gallery-version') === '4') return;
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

    async function refreshFromServer(){
      try {
        lastServerLoad = Date.now();
        let data = window.__AA_SITE_DATA || window.DEFAULT_DATA || {};
        const res = await fetch('/api/content?ts=' + Date.now(), { cache:'no-store' });
        const json = await res.json().catch(function(){ return {}; });
        if (res.ok && json.ok && json.data) {
          data = json.data;
          window.__AA_SITE_DATA = data;
        }
        config = normalizeDressAdmin(data);
      } catch(e) {
        config = normalizeDressAdmin(window.__AA_SITE_DATA || window.DEFAULT_DATA || {});
      }
      scheduleMount();
    }

    addStyle();
    refreshFromServer();
    window.__AA_REFRESH_DRESS_GALLERY__ = refreshFromServer;

    window.addEventListener('aa:content-updated', function(e){
      config = normalizeDressAdmin((e && e.detail && e.detail.data) || window.__AA_SITE_DATA || window.DEFAULT_DATA || {});
      scheduleMount();
      setTimeout(refreshFromServer, 450);
    });

    ['load','focus','pageshow'].forEach(function(evt){
      window.addEventListener(evt, function(){ setTimeout(refreshFromServer, 400); });
    });

    document.addEventListener('visibilitychange', function(){
      if (!document.hidden && Date.now() - lastServerLoad > 2500) refreshFromServer();
    });

    const observer = new MutationObserver(function(){ scheduleMount(); });
    observer.observe(document.documentElement, { childList:true, subtree:true });
    setTimeout(scheduleMount, 800);
    setTimeout(refreshFromServer, 1800);
    setTimeout(refreshFromServer, 4200);
  } catch(err) {
    console.error('[DressGallery] disabled after error:', err);
  }
})();