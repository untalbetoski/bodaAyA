// admin-safe-panel.js — safe, isolated editor for custom wedding sections
(function adminSafePanel(){
  try {
    if (window.__AA_ADMIN_SAFE_PANEL__) return;
    window.__AA_ADMIN_SAFE_PANEL__ = true;

    var state = null;
    var dirty = false;
    var saving = false;

    var DEFAULTS = {
      welcome: {
        title_es:'Bienvenidos',
        subtitle_es:'Gracias por formar parte de nuestra historia y de este nuevo comienzo.',
        aside_label:'Andrea & Alberto',
        aside_title_es:'Oaxaca nos espera',
        aside_date_es:'15, 16 y 17 de abril 2027',
        aside_place_es:'Oaxaca, México',
        greeting_es:'Querida familia y queridos amigos:',
        body_es:'Si hoy están aquí, es porque de alguna manera han formado parte de nuestra historia. Algunos nos vieron crecer, otros caminaron junto a nosotros en momentos importantes, y muchos llegaron para recordarnos que las mejores cosas de la vida siempre se construyen en compañía.\n\nEl 16 de abril de 2027, en la maravillosa ciudad de Oaxaca, celebraremos el inicio de una nueva etapa. Más que una boda, será un encuentro de personas que amamos profundamente, un día para agradecer, abrazar, reír, recordar y crear nuevos recuerdos que permanecerán con nosotros para siempre.\n\nCreemos que el amor no une únicamente a dos personas; también entrelaza familias, fortalece amistades y nos recuerda que la verdadera riqueza de la vida está en quienes caminan a nuestro lado. Por eso, su presencia es el regalo más valioso que podríamos recibir.\n\nCada palabra de aliento, cada abrazo, cada sonrisa y cada momento compartido han contribuido, de una u otra forma, a llevarnos hasta este día. Gracias por acompañarnos en nuestro pasado, por estar presentes en este momento tan especial y por ser parte del futuro que comenzamos a escribir juntos.\n\nDeseamos que disfruten cada instante de esta celebración tanto como nosotros hemos disfrutado imaginarla y prepararla. Queremos que Oaxaca, con su historia, su cultura y su calidez, sea el escenario perfecto para reunir a quienes ocupan un lugar especial en nuestro corazón.\n\nGracias por recorrer este camino con nosotros. Que esta celebración esté llena de alegría, amor, esperanza y gratitud, y que cada momento vivido nos recuerde que los mejores recuerdos siempre nacen cuando compartimos la vida con las personas que más queremos.',
        sign_label_es:'Con todo nuestro cariño',
        signature:'Andrea & Alberto'
      },
      dressAdmin: {
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
      }
    };

    function clone(obj){ return JSON.parse(JSON.stringify(obj || {})); }
    function merge(base, patch){
      var out = Array.isArray(base) ? base.slice() : Object.assign({}, base || {});
      Object.keys(patch || {}).forEach(function(k){
        var v = patch[k];
        if (v && typeof v === 'object' && !Array.isArray(v)) out[k] = merge(out[k] || {}, v);
        else if (Array.isArray(v)) out[k] = v.map(function(x){ return x && typeof x === 'object' ? Object.assign({}, x) : x; });
        else out[k] = v;
      });
      return out;
    }
    function normalize(data){
      var next = clone(data || {});
      next.welcome = merge(DEFAULTS.welcome, next.welcome || {});
      next.dressAdmin = merge(DEFAULTS.dressAdmin, next.dressAdmin || {});
      if (!next.dressAdmin.day1) next.dressAdmin.day1 = clone(DEFAULTS.dressAdmin.day1);
      if (!next.dressAdmin.day2) next.dressAdmin.day2 = clone(DEFAULTS.dressAdmin.day2);
      if (!Array.isArray(next.dressAdmin.day1.swatches) || !next.dressAdmin.day1.swatches.length) next.dressAdmin.day1.swatches = clone(DEFAULTS.dressAdmin.day1.swatches);
      if (!Array.isArray(next.dressAdmin.day2.swatches) || !next.dressAdmin.day2.swatches.length) next.dressAdmin.day2.swatches = clone(DEFAULTS.dressAdmin.day2.swatches);
      if (!Array.isArray(next.dressAdmin.day1.images) || !next.dressAdmin.day1.images.length) next.dressAdmin.day1.images = clone(DEFAULTS.dressAdmin.day1.images);
      if (!Array.isArray(next.dressAdmin.day2.images) || !next.dressAdmin.day2.images.length) next.dressAdmin.day2.images = clone(DEFAULTS.dressAdmin.day2.images);
      return next;
    }
    function getAt(path){
      if (!state) state = normalize(window.__AA_SITE_DATA || window.DEFAULT_DATA || {});
      return path.split('.').reduce(function(acc,p){ return acc == null ? '' : acc[/^\d+$/.test(p) ? Number(p) : p]; }, state);
    }
    function setAt(path, value){
      if (!state) state = normalize(window.__AA_SITE_DATA || window.DEFAULT_DATA || {});
      var parts = path.split('.');
      var cur = state;
      for (var i=0; i<parts.length-1; i++){
        var key = /^\d+$/.test(parts[i]) ? Number(parts[i]) : parts[i];
        if (cur[key] == null) cur[key] = /^\d+$/.test(parts[i+1]) ? [] : {};
        cur = cur[key];
      }
      cur[/^\d+$/.test(parts[parts.length-1]) ? Number(parts[parts.length-1]) : parts[parts.length-1]] = value;
      dirty = true;
      publishPreview();
      setStatus('Cambios sin guardar');
    }
    function esc(v){ return String(v == null ? '' : v).replace(/[&<>"']/g, function(ch){ return {'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[ch]; }); }

    function ensureStyle(){
      if (document.getElementById('aa-admin-safe-style')) return;
      var style = document.createElement('style');
      style.id = 'aa-admin-safe-style';
      style.textContent = `
        .aa-safe-editor{display:flex;flex-direction:column;gap:16px;}
        .aa-safe-note{padding:11px 12px;border:1px dashed var(--line);background:rgba(255,255,255,.72);border-radius:6px;font-size:12px;line-height:1.5;color:var(--ink-soft);}
        .aa-safe-card{padding:14px;border:1px solid var(--line);border-radius:8px;background:#fff;display:flex;flex-direction:column;gap:10px;}
        .aa-safe-title{color:var(--sage-deep)!important;}
        .aa-safe-grid{display:grid;grid-template-columns:1fr 1fr;gap:9px;}
        .aa-safe-row{display:flex;flex-direction:column;gap:4px;}
        .aa-safe-row label{font-family:var(--sans);font-size:10px;letter-spacing:.2em;text-transform:uppercase;color:var(--ink-soft);}
        .aa-safe-row input,.aa-safe-row textarea{border:1px solid var(--line);background:#fff;font-family:var(--serif);font-size:14px;padding:8px 10px;color:var(--ink);border-radius:4px;}
        .aa-safe-row textarea{resize:vertical;min-height:70px;}
        .aa-safe-swatch{display:grid;grid-template-columns:48px 1fr;gap:8px;align-items:end;padding:8px;border:1px solid var(--line);border-radius:6px;background:#fff;}
        .aa-safe-swatch input[type=color]{width:42px;height:34px;padding:0;border:1px solid var(--line);background:#fff;border-radius:4px;}
        .aa-safe-img-card{padding:12px;border:1px solid var(--line);border-radius:7px;background:#fff;display:grid;gap:9px;}
        .aa-safe-img-preview{height:104px;border:1px solid var(--line);border-radius:5px;overflow:hidden;background:var(--paper-2);display:flex;align-items:center;justify-content:center;color:var(--ink-mute);font-size:10px;}
        .aa-safe-img-preview img{width:100%;height:100%;object-fit:cover;display:block;}
        .aa-safe-actions{display:flex;gap:8px;flex-wrap:wrap;align-items:center;}
        .aa-safe-btn{appearance:none;border:1px solid var(--line);background:transparent;color:var(--ink-soft);font-family:var(--sans);font-size:10px;letter-spacing:.16em;text-transform:uppercase;padding:9px 11px;cursor:pointer;border-radius:4px;}
        .aa-safe-btn.primary{border-color:var(--sage-deep);color:var(--sage-deep);background:rgba(168,184,160,.14);}
        .aa-safe-status{font-family:var(--sans);font-size:10px;letter-spacing:.16em;text-transform:uppercase;color:var(--ink-mute);}
        @media(max-width:720px){.aa-safe-grid{grid-template-columns:1fr;}}
      `;
      document.head.appendChild(style);
    }

    async function loadContent(){
      try {
        if (window.MockServer && typeof window.MockServer.getContent === 'function') {
          var r = await window.MockServer.getContent();
          state = normalize((r && r.data) || window.__AA_SITE_DATA || window.DEFAULT_DATA || {});
        } else {
          var res = await fetch('/api/content', { cache:'no-store' });
          var json = await res.json().catch(function(){ return {}; });
          state = normalize(json.data || window.__AA_SITE_DATA || window.DEFAULT_DATA || {});
        }
      } catch(e) {
        state = normalize(window.__AA_SITE_DATA || window.DEFAULT_DATA || {});
      }
      publishPreview();
      return state;
    }
    async function saveContent(){
      if (!state || saving) return;
      saving = true;
      setStatus('Guardando…');
      try {
        var normalized = normalize(state);
        var result = null;
        if (window.MockServer && typeof window.MockServer.saveContent === 'function') result = await window.MockServer.saveContent(normalized);
        else {
          var res = await fetch('/api/content', { method:'POST', headers:{ 'Content-Type':'application/json' }, body:JSON.stringify({ data:normalized }) });
          result = await res.json().catch(function(){ return {}; });
          if (!res.ok) result.ok = false;
        }
        if (!result || result.ok === false) throw new Error('save_failed');
        state = normalized;
        dirty = false;
        publishPreview();
        setStatus('Guardado');
      } catch(e) {
        console.error('[AdminSafePanel] save failed:', e);
        setStatus('Error al guardar');
        alert('No se pudo guardar. Revisa la conexión e intenta nuevamente.');
      } finally {
        saving = false;
      }
    }
    async function uploadImage(file){
      var dataUrl = await new Promise(function(resolve, reject){
        var reader = new FileReader();
        reader.onload = function(){ resolve(reader.result); };
        reader.onerror = reject;
        reader.readAsDataURL(file);
      });
      var res = await fetch('/api/gallery/upload', { method:'POST', headers:{ 'Content-Type':'application/json' }, body:JSON.stringify({ filename:file.name, dataUrl:dataUrl }) });
      var json = await res.json().catch(function(){ return {}; });
      if (!res.ok || !json.ok || !json.url) throw new Error('upload_failed');
      return json.url;
    }

    function publishPreview(){
      var normalized = normalize(state || {});
      window.__AA_SITE_DATA = normalized;
      try { window.dispatchEvent(new CustomEvent('aa:content-updated', { detail:{ data:normalized } })); } catch(e) {}
      applyWelcome(normalized);
    }
    function applyWelcome(data){
      var w = normalize(data || {}).welcome;
      var section = document.getElementById('aa-welcome-message');
      if (!section) return;
      var setText = function(sel, text){ var el = section.querySelector(sel); if (el) el.textContent = text || ''; };
      setText('.aa-welcome-title', w.title_es);
      setText('.aa-section-sub', w.subtitle_es);
      setText('.aa-small-label', w.aside_label);
      setText('.aa-side-script', w.aside_title_es);
      var date = section.querySelector('.aa-date-line');
      if (date) date.innerHTML = esc(w.aside_date_es) + '<br/>' + esc(w.aside_place_es);
      var copy = section.querySelector('.aa-welcome-copy');
      if (copy) {
        var pieces = [w.greeting_es].concat(String(w.body_es || '').split(/\n\s*\n/)).filter(Boolean);
        copy.innerHTML = pieces.map(function(p){ return '<p>' + esc(p) + '</p>'; }).join('');
      }
      setText('.aa-with-love', w.sign_label_es);
      setText('.aa-names', w.signature);
    }

    function field(label, path, rows, type){
      var val = getAt(path) || '';
      if (rows) return '<div class="aa-safe-row"><label>'+esc(label)+'</label><textarea rows="'+rows+'" data-aa-safe-path="'+esc(path)+'">'+esc(val)+'</textarea></div>';
      return '<div class="aa-safe-row"><label>'+esc(label)+'</label><input type="'+(type || 'text')+'" data-aa-safe-path="'+esc(path)+'" value="'+esc(val)+'"></div>';
    }
    function swatch(day, i){
      var sw = getAt('dressAdmin.'+day+'.swatches.'+i) || { c:'#ffffff', l:'' };
      return '<div class="aa-safe-swatch"><input type="color" data-aa-safe-path="dressAdmin.'+day+'.swatches.'+i+'.c" value="'+esc(sw.c || '#ffffff')+'">'+field('Nombre','dressAdmin.'+day+'.swatches.'+i+'.l')+'</div>';
    }
    function imageCard(day, i){
      var item = getAt('dressAdmin.'+day+'.images.'+i) || { label:'', img:'' };
      return '<div class="aa-safe-img-card">'+
        '<div class="micro" style="color:var(--ink-mute)">Imagen '+(i+1)+'</div>'+
        '<div class="aa-safe-img-preview">'+(item.img ? '<img src="'+esc(item.img)+'" alt="">' : 'Sin imagen')+'</div>'+
        field('Etiqueta','dressAdmin.'+day+'.images.'+i+'.label')+
        field('URL','dressAdmin.'+day+'.images.'+i+'.img',0,'url')+
        '<div class="aa-safe-actions"><input type="file" accept="image/*" data-aa-safe-file="dressAdmin.'+day+'.images.'+i+'.img"><button type="button" class="aa-safe-btn" data-aa-safe-clear="dressAdmin.'+day+'.images.'+i+'.img">Quitar</button></div>'+
      '</div>';
    }
    function dayBlock(day, title){
      var swatches = getAt('dressAdmin.'+day+'.swatches') || [];
      var images = getAt('dressAdmin.'+day+'.images') || [];
      var html = '<div class="aa-safe-card"><div class="micro aa-safe-title">'+title+' · colores</div>';
      for (var i=0; i<swatches.length; i++) html += swatch(day, i);
      html += '</div>';
      html += '<div class="aa-safe-card"><div class="micro aa-safe-title">'+title+' · galería</div>'+field('Título galería','dressAdmin.'+day+'.title_es');
      for (var j=0; j<images.length; j++) html += imageCard(day, j);
      html += '<button type="button" class="aa-safe-btn primary" data-aa-safe-add="'+day+'">+ Agregar imagen</button></div>';
      return html;
    }
    function renderEditor(){
      ensureStyle();
      if (!state) state = normalize(window.__AA_SITE_DATA || window.DEFAULT_DATA || {});
      var body = document.querySelector('.admin-panel.open .body');
      if (!body) return;
      body.innerHTML = '<div class="aa-safe-editor">'+
        '<div class="micro aa-safe-title">Nuevas secciones</div>'+
        '<div class="aa-safe-note">Editor aislado y seguro para la bienvenida y las galerías de inspiración del código de vestimenta. Los cambios se previsualizan en la página y se publican con el botón Guardar cambios.</div>'+
        '<div class="aa-safe-actions"><button type="button" class="aa-safe-btn primary" data-aa-safe-save>Guardar cambios</button><span class="aa-safe-status">Sin cambios</span></div>'+
        '<div class="aa-safe-card"><div class="micro aa-safe-title">Bienvenida después del contador</div>'+
          field('Título','welcome.title_es')+
          field('Subtítulo','welcome.subtitle_es',2)+
          field('Etiqueta lateral','welcome.aside_label')+
          field('Frase lateral','welcome.aside_title_es')+
          field('Fecha lateral','welcome.aside_date_es')+
          field('Lugar','welcome.aside_place_es')+
          field('Saludo','welcome.greeting_es')+
          field('Mensaje','welcome.body_es',9)+
          field('Firma intro','welcome.sign_label_es')+
          field('Firma nombres','welcome.signature')+
        '</div>'+
        '<div class="aa-safe-card"><div class="micro aa-safe-title">Código de vestimenta</div>'+field('Texto sobre colores','dressAdmin.colorsLabel_es')+'</div>'+
        dayBlock('day1','Día 1')+
        dayBlock('day2','Día 2')+
      '</div>';
      bindEditor(body);
      setStatus(dirty ? 'Cambios sin guardar' : 'Sin cambios');
    }
    function bindEditor(body){
      body.querySelectorAll('[data-aa-safe-path]').forEach(function(el){
        var handler = function(){ setAt(el.getAttribute('data-aa-safe-path'), el.value); };
        el.addEventListener('input', handler);
        el.addEventListener('change', handler);
      });
      body.querySelectorAll('[data-aa-safe-save]').forEach(function(btn){ btn.addEventListener('click', saveContent); });
      body.querySelectorAll('[data-aa-safe-clear]').forEach(function(btn){
        btn.addEventListener('click', function(){ setAt(btn.getAttribute('data-aa-safe-clear'), ''); renderEditor(); });
      });
      body.querySelectorAll('[data-aa-safe-add]').forEach(function(btn){
        btn.addEventListener('click', function(){
          var day = btn.getAttribute('data-aa-safe-add');
          var arr = getAt('dressAdmin.'+day+'.images') || [];
          arr.push({ label:'Nueva inspiración', img:'' });
          setAt('dressAdmin.'+day+'.images', arr);
          renderEditor();
        });
      });
      body.querySelectorAll('[data-aa-safe-file]').forEach(function(input){
        input.addEventListener('change', async function(){
          var file = input.files && input.files[0];
          if (!file) return;
          setStatus('Subiendo imagen…');
          try {
            var url = await uploadImage(file);
            setAt(input.getAttribute('data-aa-safe-file'), url);
            renderEditor();
          } catch(e) {
            console.error('[AdminSafePanel] upload failed:', e);
            setStatus('Error al subir imagen');
            alert('No se pudo subir la imagen.');
          } finally { input.value = ''; }
        });
      });
    }
    function setStatus(text){
      document.querySelectorAll('.aa-safe-status').forEach(function(el){ el.textContent = text; });
    }

    async function activate(){
      var panel = document.querySelector('.admin-panel.open');
      if (!panel) return;
      panel.querySelectorAll('.tabs button').forEach(function(b){ b.classList.remove('on'); });
      var own = panel.querySelector('[data-aa-safe-tab]');
      if (own) own.classList.add('on');
      var body = panel.querySelector('.body');
      if (body) body.innerHTML = '<div class="micro" style="color:var(--ink-mute)">Cargando editor seguro…</div>';
      await loadContent();
      renderEditor();
    }
    function injectTab(){
      ensureStyle();
      var panel = document.querySelector('.admin-panel');
      var tabs = panel && panel.querySelector('.tabs');
      if (!tabs) return false;
      if (!tabs.querySelector('[data-aa-safe-tab]')) {
        var btn = document.createElement('button');
        btn.type = 'button';
        btn.textContent = 'Nuevas secciones';
        btn.setAttribute('data-aa-safe-tab','1');
        btn.addEventListener('click', function(e){ e.preventDefault(); e.stopPropagation(); activate(); });
        tabs.appendChild(btn);
      }
      return true;
    }

    window.AA_ADMIN_SAFE_RELOAD = loadContent;
    window.addEventListener('aa:content-updated', function(e){
      if (e && e.detail && e.detail.data) applyWelcome(e.detail.data);
    });
    setTimeout(function(){ loadContent().catch(function(){}); }, 1200);
    setInterval(injectTab, 900);
    new MutationObserver(injectTab).observe(document.documentElement, { childList:true, subtree:true });
  } catch(err) {
    console.error('[AdminSafePanel] disabled after error:', err);
  }
})();