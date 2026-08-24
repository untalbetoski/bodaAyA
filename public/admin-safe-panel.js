// admin-safe-panel.js — isolated modal editor for extra wedding sections
(function adminSafePanel(){
  try {
    if (window.__AA_ADMIN_SAFE_PANEL_V4__) return;
    window.__AA_ADMIN_SAFE_PANEL_V4__ = true;

    const DEFAULTS = {
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

    let state = null;
    let dirty = false;
    let saving = false;
    let injected = false;

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
    function normalize(data){
      const next = clone(data || {});
      next.welcome = merge(DEFAULTS.welcome, next.welcome || {});
      next.dressAdmin = merge(DEFAULTS.dressAdmin, next.dressAdmin || {});
      ['day1','day2'].forEach(function(day){
        if (!Array.isArray(next.dressAdmin[day].swatches) || !next.dressAdmin[day].swatches.length) next.dressAdmin[day].swatches = clone(DEFAULTS.dressAdmin[day].swatches);
        if (!Array.isArray(next.dressAdmin[day].images) || !next.dressAdmin[day].images.length) next.dressAdmin[day].images = clone(DEFAULTS.dressAdmin[day].images);
      });
      return next;
    }
    function esc(v){ return String(v == null ? '' : v).replace(/[&<>"']/g, function(ch){ return {'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[ch]; }); }
    function getAt(path){
      const parts = path.split('.');
      let cur = state;
      parts.forEach(function(p){ cur = cur == null ? '' : cur[/^\d+$/.test(p) ? Number(p) : p]; });
      return cur == null ? '' : cur;
    }
    function setAt(path, value){
      if (!state) state = normalize(window.__AA_SITE_DATA || window.DEFAULT_DATA || {});
      const parts = path.split('.');
      let cur = state;
      for (let i=0;i<parts.length-1;i++){
        const key = /^\d+$/.test(parts[i]) ? Number(parts[i]) : parts[i];
        if (cur[key] == null) cur[key] = /^\d+$/.test(parts[i+1]) ? [] : {};
        cur = cur[key];
      }
      cur[/^\d+$/.test(parts[parts.length-1]) ? Number(parts[parts.length-1]) : parts[parts.length-1]] = value;
      dirty = true;
      publishPreview();
      setStatus('Cambios sin guardar');
    }

    function ensureStyle(){
      if (document.getElementById('aa-admin-safe-style-v4')) return;
      const style = document.createElement('style');
      style.id = 'aa-admin-safe-style-v4';
      style.textContent = `
        .aa-safe-open-btn{appearance:none;border:1px solid var(--line);background:rgba(255,255,255,.45);color:var(--ink-soft);font-family:var(--sans);font-size:9.5px;letter-spacing:.16em;text-transform:uppercase;padding:8px 10px;border-radius:999px;cursor:pointer;margin-left:auto;margin-right:10px;white-space:nowrap;}
        .aa-safe-open-btn:hover{background:var(--ink);color:var(--paper);border-color:var(--ink);}
        .aa-safe-back{position:fixed;inset:0;z-index:420;background:rgba(34,26,14,.46);backdrop-filter:blur(7px);display:flex;align-items:center;justify-content:center;padding:22px;}
        .aa-safe-modal{width:min(920px,100%);max-height:88vh;overflow:hidden;background:#fffdf8;border:1px solid var(--line);box-shadow:0 28px 90px -32px rgba(0,0,0,.45);display:grid;grid-template-rows:auto 1fr auto;}
        .aa-safe-hd{display:flex;align-items:center;gap:12px;justify-content:space-between;padding:18px 22px;border-bottom:1px solid var(--line);}
        .aa-safe-hd h3{margin:0;font-family:var(--display);font-size:18px;letter-spacing:.08em;color:var(--ink);font-weight:400;}
        .aa-safe-close{appearance:none;border:0;background:transparent;cursor:pointer;font-size:20px;color:var(--ink-soft);}
        .aa-safe-body{overflow:auto;padding:22px;display:grid;gap:16px;}
        .aa-safe-note{padding:12px 14px;border:1px dashed var(--line);background:rgba(255,250,241,.78);border-radius:8px;font-size:12px;line-height:1.5;color:var(--ink-soft);}
        .aa-safe-card{padding:14px;border:1px solid var(--line);border-radius:10px;background:#fff;display:grid;gap:10px;}
        .aa-safe-card-title{font-family:var(--sans);font-size:10px;letter-spacing:.2em;text-transform:uppercase;color:var(--sage-deep);}
        .aa-safe-row{display:grid;gap:4px;}
        .aa-safe-row label{font-family:var(--sans);font-size:10px;letter-spacing:.18em;text-transform:uppercase;color:var(--ink-soft);}
        .aa-safe-row input,.aa-safe-row textarea{width:100%;border:1px solid var(--line);background:#fff;font-family:var(--serif);font-size:14px;padding:8px 10px;color:var(--ink);border-radius:5px;}
        .aa-safe-row textarea{resize:vertical;min-height:76px;}
        .aa-safe-two{display:grid;grid-template-columns:1fr 1fr;gap:12px;}
        .aa-safe-swatch{display:grid;grid-template-columns:52px 1fr;gap:9px;align-items:end;padding:8px;border:1px solid var(--line);border-radius:7px;background:#fff;}
        .aa-safe-swatch input[type=color]{width:44px;height:36px;padding:0;border:1px solid var(--line);background:#fff;border-radius:5px;}
        .aa-safe-img-card{display:grid;grid-template-columns:112px 1fr;gap:12px;align-items:start;padding:12px;border:1px solid var(--line);border-radius:8px;background:#fff;}
        .aa-safe-img-preview{height:112px;border:1px solid var(--line);border-radius:6px;overflow:hidden;background:var(--paper-2);display:flex;align-items:center;justify-content:center;color:var(--ink-mute);font-size:10px;text-align:center;}
        .aa-safe-img-preview img{width:100%;height:100%;object-fit:cover;display:block;}
        .aa-safe-actions{display:flex;gap:8px;flex-wrap:wrap;align-items:center;}
        .aa-safe-btn{appearance:none;border:1px solid var(--line);background:transparent;color:var(--ink-soft);font-family:var(--sans);font-size:10px;letter-spacing:.16em;text-transform:uppercase;padding:9px 11px;cursor:pointer;border-radius:5px;}
        .aa-safe-btn.primary{border-color:var(--sage-deep);color:var(--sage-deep);background:rgba(168,184,160,.14);}
        .aa-safe-ft{display:flex;align-items:center;justify-content:space-between;gap:10px;padding:14px 22px;border-top:1px solid var(--line);background:#fffdf8;}
        .aa-safe-status{font-family:var(--sans);font-size:10px;letter-spacing:.14em;text-transform:uppercase;color:var(--ink-mute);}
        @media(max-width:720px){.aa-safe-modal{max-height:92vh}.aa-safe-two{grid-template-columns:1fr}.aa-safe-img-card{grid-template-columns:1fr}.aa-safe-img-preview{height:160px}.aa-safe-open-btn{font-size:8.5px;padding:7px 8px;}}
      `;
      document.head.appendChild(style);
    }

    async function loadContent(){
      try {
        if (window.MockServer && typeof window.MockServer.getContent === 'function') {
          const r = await window.MockServer.getContent();
          state = normalize((r && r.data) || window.__AA_SITE_DATA || window.DEFAULT_DATA || {});
        } else {
          const res = await fetch('/api/content', { cache:'no-store' });
          const json = await res.json().catch(function(){ return {}; });
          state = normalize(json.data || window.__AA_SITE_DATA || window.DEFAULT_DATA || {});
        }
      } catch(e) {
        state = normalize(window.__AA_SITE_DATA || window.DEFAULT_DATA || {});
      }
      dirty = false;
      publishPreview();
      return state;
    }

    async function saveContent(){
      if (!state || saving) return;
      saving = true;
      setStatus('Guardando…');
      try {
        const normalized = normalize(state);
        let ok = false;
        try {
          const res = await fetch('/api/content', { method:'POST', headers:{ 'Content-Type':'application/json' }, body:JSON.stringify({ data:normalized }) });
          const json = await res.json().catch(function(){ return {}; });
          ok = !!(res.ok && json.ok);
        } catch(e) { ok = false; }
        if (!ok && window.MockServer && typeof window.MockServer.saveContent === 'function') {
          const r = await window.MockServer.saveContent(normalized);
          ok = !!(r && r.ok);
        }
        if (!ok) throw new Error('save_failed');
        state = normalized;
        dirty = false;
        publishPreview();
        setStatus('Guardado correctamente');
      } catch(e) {
        console.error('[AdminSafePanel] save failed:', e);
        setStatus('Error al guardar');
        alert('No se pudo guardar. Revisa la conexión e intenta nuevamente.');
      } finally { saving = false; }
    }

    function publishPreview(){
      const normalized = normalize(state || {});
      window.__AA_SITE_DATA = normalized;
      try { window.dispatchEvent(new CustomEvent('aa:content-updated', { detail:{ data:normalized } })); } catch(e) {}
      applyWelcome(normalized);
    }

    function applyWelcome(data){
      const w = normalize(data || {}).welcome;
      const section = document.getElementById('aa-welcome-message');
      if (!section) return;
      const setText = function(sel, text){ const el = section.querySelector(sel); if (el) el.textContent = text || ''; };
      setText('.aa-welcome-title', w.title_es);
      setText('.aa-section-sub', w.subtitle_es);
      setText('.aa-small-label', w.aside_label);
      setText('.aa-side-script', w.aside_title_es);
      const date = section.querySelector('.aa-date-line');
      if (date) date.innerHTML = esc(w.aside_date_es) + '<br/>' + esc(w.aside_place_es);
      const copy = section.querySelector('.aa-welcome-copy');
      if (copy) {
        const pieces = [w.greeting_es].concat(String(w.body_es || '').split(/\n\s*\n/)).filter(Boolean);
        copy.innerHTML = pieces.map(function(p){ return '<p>' + esc(p) + '</p>'; }).join('');
      }
      setText('.aa-with-love', w.sign_label_es);
      setText('.aa-names', w.signature);
    }

    async function uploadImage(file){
      const dataUrl = await new Promise(function(resolve, reject){
        const reader = new FileReader();
        reader.onload = function(){ resolve(reader.result); };
        reader.onerror = reject;
        reader.readAsDataURL(file);
      });
      const res = await fetch('/api/gallery/upload', { method:'POST', headers:{ 'Content-Type':'application/json' }, body:JSON.stringify({ filename:file.name, dataUrl:dataUrl }) });
      const json = await res.json().catch(function(){ return {}; });
      if (!res.ok || !json.ok || !json.url) throw new Error('upload_failed');
      return json.url;
    }

    function setStatus(text){ document.querySelectorAll('.aa-safe-status').forEach(function(el){ el.textContent = text; }); }

    function field(label, path, rows, type){
      const val = getAt(path);
      if (rows) return '<div class="aa-safe-row"><label>'+esc(label)+'</label><textarea rows="'+rows+'" data-aa-safe-path="'+esc(path)+'">'+esc(val)+'</textarea></div>';
      return '<div class="aa-safe-row"><label>'+esc(label)+'</label><input type="'+(type || 'text')+'" data-aa-safe-path="'+esc(path)+'" value="'+esc(val)+'"></div>';
    }
    function swatch(day, i){
      const sw = getAt('dressAdmin.'+day+'.swatches.'+i) || { c:'#ffffff', l:'' };
      return '<div class="aa-safe-swatch"><input type="color" data-aa-safe-path="dressAdmin.'+day+'.swatches.'+i+'.c" value="'+esc(sw.c || '#ffffff')+'">'+field('Nombre','dressAdmin.'+day+'.swatches.'+i+'.l')+'</div>';
    }
    function imageCard(day, i){
      const item = getAt('dressAdmin.'+day+'.images.'+i) || { label:'', img:'' };
      return '<div class="aa-safe-img-card">'+
        '<div class="aa-safe-img-preview">'+(item.img ? '<img src="'+esc(item.img)+'" alt="">' : 'Sin imagen')+'</div>'+
        '<div style="display:grid;gap:8px">'+
          '<div class="aa-safe-card-title">Imagen '+(i+1)+'</div>'+field('Etiqueta','dressAdmin.'+day+'.images.'+i+'.label')+field('URL','dressAdmin.'+day+'.images.'+i+'.img',0,'url')+
          '<div class="aa-safe-actions"><input type="file" accept="image/*" data-aa-safe-file="dressAdmin.'+day+'.images.'+i+'.img"><button type="button" class="aa-safe-btn" data-aa-safe-clear="dressAdmin.'+day+'.images.'+i+'.img">Quitar</button></div>'+ 
        '</div></div>';
    }
    function dayBlock(day, title){
      const swatches = getAt('dressAdmin.'+day+'.swatches') || [];
      const images = getAt('dressAdmin.'+day+'.images') || [];
      let html = '<div class="aa-safe-card"><div class="aa-safe-card-title">'+title+' · colores</div>';
      for (let i=0;i<swatches.length;i++) html += swatch(day, i);
      html += '</div><div class="aa-safe-card"><div class="aa-safe-card-title">'+title+' · galería</div>'+field('Título galería','dressAdmin.'+day+'.title_es');
      for (let j=0;j<images.length;j++) html += imageCard(day, j);
      html += '<button type="button" class="aa-safe-btn primary" data-aa-safe-add="'+day+'">+ Agregar imagen</button></div>';
      return html;
    }

    function editorHtml(){
      return '<div class="aa-safe-note">Este editor ya no modifica las pestañas del panel principal. Edita, revisa la vista previa y presiona “Guardar cambios”.</div>'+ 
        '<div class="aa-safe-card"><div class="aa-safe-card-title">Bienvenida después del contador</div>'+
          field('Título','welcome.title_es')+field('Subtítulo','welcome.subtitle_es',2)+
          '<div class="aa-safe-two">'+field('Etiqueta lateral','welcome.aside_label')+field('Frase lateral','welcome.aside_title_es')+'</div>'+ 
          '<div class="aa-safe-two">'+field('Fecha lateral','welcome.aside_date_es')+field('Lugar','welcome.aside_place_es')+'</div>'+ 
          field('Saludo','welcome.greeting_es')+field('Mensaje','welcome.body_es',8)+
          '<div class="aa-safe-two">'+field('Firma intro','welcome.sign_label_es')+field('Firma nombres','welcome.signature')+'</div>'+ 
        '</div>'+ 
        '<div class="aa-safe-card"><div class="aa-safe-card-title">Código de vestimenta</div>'+field('Texto sobre colores','dressAdmin.colorsLabel_es')+'</div>'+ 
        dayBlock('day1','Día 1')+dayBlock('day2','Día 2');
    }

    function bindEditor(root){
      root.querySelectorAll('[data-aa-safe-path]').forEach(function(el){
        const handler = function(){ setAt(el.getAttribute('data-aa-safe-path'), el.value); };
        el.addEventListener('input', handler);
        el.addEventListener('change', handler);
      });
      root.querySelectorAll('[data-aa-safe-clear]').forEach(function(btn){
        btn.addEventListener('click', function(){ setAt(btn.getAttribute('data-aa-safe-clear'), ''); renderEditor(); });
      });
      root.querySelectorAll('[data-aa-safe-add]').forEach(function(btn){
        btn.addEventListener('click', function(){
          const day = btn.getAttribute('data-aa-safe-add');
          const arr = (getAt('dressAdmin.'+day+'.images') || []).slice();
          arr.push({ label:'Nueva inspiración', img:'' });
          setAt('dressAdmin.'+day+'.images', arr);
          renderEditor();
        });
      });
      root.querySelectorAll('[data-aa-safe-file]').forEach(function(input){
        input.addEventListener('change', async function(){
          const file = input.files && input.files[0];
          if (!file) return;
          setStatus('Subiendo imagen…');
          try {
            const url = await uploadImage(file);
            setAt(input.getAttribute('data-aa-safe-file'), url);
            renderEditor();
            setStatus('Imagen subida · cambios sin guardar');
          } catch(e) {
            console.error('[AdminSafePanel] upload failed:', e);
            setStatus('Error al subir imagen');
            alert('No se pudo subir la imagen.');
          } finally { input.value = ''; }
        });
      });
    }

    function renderEditor(){
      const body = document.querySelector('.aa-safe-body');
      if (!body) return;
      body.innerHTML = editorHtml();
      bindEditor(body);
      setStatus(dirty ? 'Cambios sin guardar' : 'Listo');
    }

    async function openEditor(){
      ensureStyle();
      closeEditor();
      const back = document.createElement('div');
      back.className = 'aa-safe-back';
      back.innerHTML = '<div class="aa-safe-modal" role="dialog" aria-modal="true"><div class="aa-safe-hd"><h3>Nuevas secciones</h3><button type="button" class="aa-safe-close" aria-label="Cerrar">×</button></div><div class="aa-safe-body"><div class="aa-safe-note">Cargando datos guardados…</div></div><div class="aa-safe-ft"><span class="aa-safe-status">Cargando…</span><div class="aa-safe-actions"><button type="button" class="aa-safe-btn" data-aa-safe-reload>Recargar datos</button><button type="button" class="aa-safe-btn primary" data-aa-safe-save>Guardar cambios</button></div></div></div>';
      document.body.appendChild(back);
      back.addEventListener('click', function(e){ if (e.target === back) closeWithPrompt(); });
      back.querySelector('.aa-safe-close').addEventListener('click', closeWithPrompt);
      back.querySelector('[data-aa-safe-save]').addEventListener('click', saveContent);
      back.querySelector('[data-aa-safe-reload]').addEventListener('click', async function(){ setStatus('Recargando…'); await loadContent(); renderEditor(); });
      await loadContent();
      renderEditor();
    }

    function closeEditor(){ const old = document.querySelector('.aa-safe-back'); if (old) old.remove(); }
    function closeWithPrompt(){
      if (dirty && !confirm('Hay cambios sin guardar. ¿Cerrar de todos modos?')) return;
      closeEditor();
    }

    function injectButton(){
      ensureStyle();
      const panel = document.querySelector('.admin-panel');
      const hd = panel && panel.querySelector('.hd');
      if (!hd) return false;
      if (hd.querySelector('.aa-safe-open-btn')) return true;
      const btn = document.createElement('button');
      btn.type = 'button';
      btn.className = 'aa-safe-open-btn';
      btn.textContent = 'Nuevas secciones';
      btn.addEventListener('click', function(e){ e.preventDefault(); e.stopPropagation(); openEditor(); });
      const close = hd.querySelector('button');
      if (close && close.parentNode === hd) hd.insertBefore(btn, close);
      else hd.appendChild(btn);
      injected = true;
      return true;
    }

    function start(){
      let tries = 0;
      const timer = setInterval(function(){
        tries += 1;
        if (injectButton() || tries > 40) clearInterval(timer);
      }, 300);
      setTimeout(injectButton, 1500);
      document.addEventListener('keydown', function(e){
        if ((e.ctrlKey || e.metaKey) && e.shiftKey && e.key.toLowerCase() === 'n') {
          const panelOpen = document.querySelector('.admin-panel.open');
          if (panelOpen) { e.preventDefault(); openEditor(); }
        }
      });
    }

    if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', start, { once:true });
    else start();
  } catch(err) {
    console.error('[AdminSafePanel] disabled after error:', err);
  }
})();