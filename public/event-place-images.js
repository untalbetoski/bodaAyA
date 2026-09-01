// event-place-images.js — event venue photos on site + admin uploader
(function eventPlaceImages(){
  try {
    if (window.__AA_EVENT_PLACE_IMAGES_V1__) return;
    window.__AA_EVENT_PLACE_IMAGES_V1__ = true;

    var h = React.createElement;
    var EVENT_DEFS = [
      { key:'icebreaker', label_es:'Rompe Hielo', label_en:'Icebreaker' },
      { key:'ceremony', label_es:'Ceremonia', label_en:'Ceremony' },
      { key:'reception', label_es:'Recepción', label_en:'Reception' },
      { key:'traditional', label_es:'Boda Tradicional', label_en:'Traditional Wedding' }
    ];

    function pick(obj, key, lang){
      try { if (window.pickByLang) return window.pickByLang(obj, key, lang); } catch(e) {}
      return (obj && (obj[key + '_' + lang] || obj[key])) || '';
    }

    function clone(obj){
      try { return JSON.parse(JSON.stringify(obj || {})); }
      catch(e) { return Array.isArray(obj) ? obj.slice() : Object.assign({}, obj || {}); }
    }

    function eventImage(ev){
      return String((ev && (ev.image || ev.photo || ev.image_url)) || '').trim();
    }

    function publish(data){
      try {
        window.__AA_SITE_DATA = data;
        window.dispatchEvent(new CustomEvent('aa:content-updated', { detail:{ data:data } }));
      } catch(e) {}
    }

    function calendarHref(ev, title, addr, note){
      try {
        var start = new Date(ev && ev.iso ? ev.iso : '2027-04-16T17:00:00-06:00');
        var fmt = function(d){ return d.toISOString().replace(/[-:]/g,'').replace(/\.\d{3}/, ''); };
        var s = fmt(new Date(start.getTime()));
        var e = fmt(new Date(start.getTime() + 4 * 3600 * 1000));
        var params = new URLSearchParams({
          action:'TEMPLATE',
          text:title + ' — Andrea & Alberto',
          dates:s + '/' + e,
          details:note || '',
          location:((ev && ev.venue) || '') + ', ' + (addr || '')
        });
        return 'https://www.google.com/calendar/render?' + params.toString();
      } catch(e) {
        return 'https://www.google.com/calendar/render';
      }
    }

    function MapFrame(ev){
      return h('div', { className:'img-ph', style:{ aspectRatio:'4/5', borderRadius:0, position:'relative', overflow:'hidden' } },
        h('iframe', {
          title:(ev && ev.venue) || 'Mapa',
          src:(ev && ev.map) || '',
          style:{ position:'absolute', inset:0, width:'100%', height:'100%', border:0, filter:'grayscale(.4) saturate(.6)' },
          loading:'lazy'
        })
      );
    }

    function PlaceImage(ev, lang){
      var src = eventImage(ev);
      if (!src) return null;
      var alt = pick(ev, 'image_alt', lang) || ((ev && ev.venue) ? ('Imagen de ' + ev.venue) : 'Imagen del lugar');
      var caption = pick(ev, 'image_caption', lang);
      return h('figure', {
        className:'aa-event-place-image',
        style:{ margin:'8px 0 24px', border:'1px solid var(--line)', background:'rgba(255,250,241,.62)', overflow:'hidden', boxShadow:'0 18px 42px -32px rgba(47,36,24,.45)' }
      },
        h('img', { src:src, alt:alt, loading:'lazy', decoding:'async', style:{ width:'100%', aspectRatio:'16/10', objectFit:'cover', display:'block' } }),
        caption ? h('figcaption', { className:'micro', style:{ padding:'9px 12px', fontSize:8.5, letterSpacing:'.18em', color:'var(--ink-mute)', textAlign:'center' } }, caption) : null
      );
    }

    function EventCardWithPlaceImage(props){
      var ev = props.ev || {};
      var lang = props.lang || 'es';
      var L = props.L || {};
      var side = props.side || 'left';
      var title = pick(ev, 'title', lang);
      var date = pick(ev, 'date', lang);
      var addr = pick(ev, 'address', lang);
      var note = pick(ev, 'note', lang);
      var calHref = calendarHref(ev, title, addr, note);
      var textCol = h('div', null,
        h('h3', { className:'display', style:{ fontSize:'clamp(28px,3.4vw,44px)', margin:0, color:'var(--ink)' } }, title),
        h('div', { className:'script', style:{ fontSize:34, color:'var(--sage-deep)', margin:'6px 0 18px' } }, ev.venue || ''),
        h('div', { style:{ fontSize:17, color:'var(--ink-soft)', lineHeight:1.6, marginBottom:eventImage(ev) ? 14 : 24 } },
          h('div', { style:{ fontStyle:'italic' } }, date),
          h('div', null, addr)
        ),
        PlaceImage(ev, lang),
        h('p', { style:{ fontSize:14.5, color:'var(--ink-mute)', lineHeight:1.6, marginBottom:24, maxWidth:380 } }, note),
        h('div', { style:{ display:'flex', gap:10, flexWrap:'wrap' } },
          h('a', { className:'btn btn-sage', href:'https://www.google.com/maps/search/?api=1&query=' + encodeURIComponent((ev.venue || '') + ', ' + addr), target:'_blank', rel:'noopener' }, L.open_map || 'Mapa'),
          h('a', { className:'btn', href:calHref, target:'_blank', rel:'noopener' }, L.add_calendar || 'Calendario')
        )
      );

      return h(Reveal, null,
        h('div', { className:'ev-grid', style:{ display:'grid', gridTemplateColumns:'1fr 1fr', gap:48, alignItems:'center' } },
          side === 'left' ? MapFrame(ev) : null,
          textCol,
          side === 'right' ? MapFrame(ev) : null
        )
      );
    }

    try { EventCard = EventCardWithPlaceImage; } catch(e) {}
    window.EventCard = EventCardWithPlaceImage;

    function addStyle(){
      if (document.getElementById('aa-event-place-images-style-v1')) return;
      var style = document.createElement('style');
      style.id = 'aa-event-place-images-style-v1';
      style.textContent = `
        .aa-event-place-image img{transition:transform .55s ease, opacity .3s ease;}
        .aa-event-place-image:hover img{transform:scale(1.025);}
        .aa-event-images-admin{padding:14px;border:1px solid var(--line);border-radius:8px;background:rgba(255,250,241,.88);display:grid;gap:12px;margin-bottom:18px;}
        .aa-event-image-row{display:grid;grid-template-columns:82px 1fr;gap:12px;padding:10px;border:1px solid rgba(95,75,52,.16);border-radius:7px;background:#fff;}
        .aa-event-image-preview{width:82px;height:82px;border:1px solid var(--line);background:var(--paper-2);display:flex;align-items:center;justify-content:center;overflow:hidden;color:var(--ink-mute);font-size:9px;text-align:center;}
        .aa-event-image-preview img{width:100%;height:100%;object-fit:cover;display:block;}
        .aa-event-image-actions{display:flex;gap:6px;flex-wrap:wrap;margin-top:6px;}
        .aa-event-image-actions button{font-size:9px!important;padding:7px 9px!important;letter-spacing:.13em!important;}
        .aa-event-image-url{width:100%;border:1px solid var(--line);border-radius:4px;padding:7px 8px;font-size:12px;color:var(--ink);}
        @media(max-width:720px){.aa-event-image-row{grid-template-columns:68px 1fr}.aa-event-image-preview{width:68px;height:68px}.aa-event-place-image{margin-top:4px!important;}}
      `;
      document.head.appendChild(style);
    }

    async function loadContent(){
      var res = await fetch('/api/content?eventImages=' + Date.now(), { cache:'no-store' });
      var json = await res.json().catch(function(){ return {}; });
      if (!res.ok || !json.ok || !json.data) throw new Error(json.error || 'No se pudo cargar el contenido');
      return json.data;
    }

    async function saveContent(data){
      var res = await fetch('/api/content', {
        method:'POST',
        headers:{ 'Content-Type':'application/json' },
        body:JSON.stringify({ data:data })
      });
      var json = await res.json().catch(function(){ return {}; });
      if (!res.ok || !json.ok) throw new Error(json.error || 'No se pudo guardar');
      return json.data || data;
    }

    function resizeImage(file, maxW){
      maxW = maxW || 1800;
      return new Promise(function(resolve, reject){
        var reader = new FileReader();
        reader.onload = function(){
          var img = new Image();
          img.onload = function(){
            var ratio = Math.min(1, maxW / img.width);
            var canvas = document.createElement('canvas');
            canvas.width = Math.round(img.width * ratio);
            canvas.height = Math.round(img.height * ratio);
            canvas.getContext('2d').drawImage(img, 0, 0, canvas.width, canvas.height);
            resolve(canvas.toDataURL('image/jpeg', 0.86));
          };
          img.onerror = reject;
          img.src = reader.result;
        };
        reader.onerror = reject;
        reader.readAsDataURL(file);
      });
    }

    async function uploadImage(file){
      var dataUrl = await resizeImage(file);
      var res = await fetch('/api/gallery/upload', {
        method:'POST',
        headers:{ 'Content-Type':'application/json' },
        body:JSON.stringify({ filename:file.name, dataUrl:dataUrl })
      });
      var json = await res.json().catch(function(){ return {}; });
      if (!res.ok || !json.ok || !json.url) throw new Error(json.error || 'No se pudo subir la imagen');
      return json.url;
    }

    var cachedData = null;
    var renderSig = '';
    var mounting = false;

    function isEventsTab(){
      var active = document.querySelector('.admin-panel.open .tabs button.on');
      return !!(active && /eventos|events/i.test(active.textContent || ''));
    }

    function signature(data){
      try {
        return JSON.stringify(EVENT_DEFS.map(function(def){
          var ev = (data && data[def.key]) || {};
          return [def.key, ev.venue, ev.image, ev.image_caption_es, ev.image_caption_en];
        }));
      } catch(e) { return String(Date.now()); }
    }

    function rowHtml(def, ev, lang){
      var img = eventImage(ev);
      var label = lang === 'es' ? def.label_es : def.label_en;
      var caption = pick(ev, 'image_caption', lang);
      return '<div class="aa-event-image-row" data-event-key="' + def.key + '">' +
        '<div class="aa-event-image-preview">' + (img ? '<img src="' + img.replace(/"/g,'&quot;') + '" alt="">' : '<span>Sin imagen</span>') + '</div>' +
        '<div>' +
          '<div class="micro" style="color:var(--sage-deep);font-size:9px;margin-bottom:6px">' + label + '</div>' +
          '<input class="aa-event-image-url" data-role="url" placeholder="URL de imagen" value="' + img.replace(/"/g,'&quot;') + '">' +
          '<input class="aa-event-image-url" data-role="caption" placeholder="Pie de foto opcional" style="margin-top:6px" value="' + String(caption || '').replace(/"/g,'&quot;') + '">' +
          '<div class="aa-event-image-actions">' +
            '<button type="button" class="btn" data-role="upload">Subir imagen</button>' +
            '<button type="button" class="btn" data-role="save-url">Guardar URL</button>' +
            '<button type="button" class="btn" data-role="clear">Quitar</button>' +
          '</div>' +
          '<input type="file" accept="image/*" data-role="file" style="display:none">' +
        '</div>' +
      '</div>';
    }

    function renderPanel(panel, data){
      var lang = (document.documentElement.lang || 'es').slice(0,2) || 'es';
      panel.innerHTML = '<div class="micro" style="color:var(--sage-deep);line-height:1.5">Imágenes de lugares</div>' +
        '<div style="font-size:12px;color:var(--ink-mute);line-height:1.5;margin-top:-6px">Estas fotos aparecen entre la información del lugar y la descripción del evento.</div>' +
        EVENT_DEFS.map(function(def){ return rowHtml(def, (data && data[def.key]) || {}, lang); }).join('') +
        '<div data-role="status" style="font-size:12px;color:var(--ink-mute);min-height:18px"></div>';

      var status = panel.querySelector('[data-role="status"]');
      function setStatus(text, ok){ status.textContent = text || ''; status.style.color = ok ? 'var(--sage-deep)' : 'var(--ink-mute)'; }

      panel.querySelectorAll('.aa-event-image-row').forEach(function(row){
        var key = row.getAttribute('data-event-key');
        var fileInput = row.querySelector('[data-role="file"]');
        var urlInput = row.querySelector('[data-role="url"]');
        var capInput = row.querySelector('[data-role="caption"]');
        row.querySelector('[data-role="upload"]').addEventListener('click', function(){ fileInput.click(); });
        fileInput.addEventListener('change', async function(){
          var file = fileInput.files && fileInput.files[0];
          if (!file) return;
          try {
            setStatus('Subiendo imagen…', false);
            var url = await uploadImage(file);
            var latest = await loadContent();
            latest[key] = latest[key] || {};
            latest[key].image = url;
            latest[key].image_caption_es = capInput.value || latest[key].image_caption_es || '';
            latest[key].image_caption_en = latest[key].image_caption_es;
            var saved = await saveContent(latest);
            cachedData = saved;
            publish(saved);
            renderSig = '';
            renderPanel(panel, saved);
            setStatus('Imagen subida y guardada.', true);
          } catch(e) {
            console.error('[EventImages] upload failed', e);
            setStatus('No se pudo subir la imagen.', false);
          } finally {
            fileInput.value = '';
          }
        });
        row.querySelector('[data-role="save-url"]').addEventListener('click', async function(){
          try {
            setStatus('Guardando imagen…', false);
            var latest = await loadContent();
            latest[key] = latest[key] || {};
            latest[key].image = urlInput.value.trim();
            latest[key].image_caption_es = capInput.value.trim();
            latest[key].image_caption_en = capInput.value.trim();
            var saved = await saveContent(latest);
            cachedData = saved;
            publish(saved);
            renderSig = '';
            renderPanel(panel, saved);
            setStatus('Imagen guardada.', true);
          } catch(e) {
            console.error('[EventImages] save url failed', e);
            setStatus('No se pudo guardar.', false);
          }
        });
        row.querySelector('[data-role="clear"]').addEventListener('click', async function(){
          try {
            setStatus('Quitando imagen…', false);
            var latest = await loadContent();
            latest[key] = latest[key] || {};
            latest[key].image = '';
            latest[key].image_caption_es = '';
            latest[key].image_caption_en = '';
            var saved = await saveContent(latest);
            cachedData = saved;
            publish(saved);
            renderSig = '';
            renderPanel(panel, saved);
            setStatus('Imagen eliminada.', true);
          } catch(e) {
            console.error('[EventImages] clear failed', e);
            setStatus('No se pudo quitar la imagen.', false);
          }
        });
      });
    }

    async function mountAdmin(){
      if (mounting) return;
      if (!isEventsTab()) return;
      var body = document.querySelector('.admin-panel.open .body');
      if (!body) return;
      mounting = true;
      try {
        addStyle();
        if (!cachedData) cachedData = await loadContent();
        var sig = signature(cachedData);
        var panel = body.querySelector('.aa-event-images-admin');
        if (panel && renderSig === sig) return;
        if (!panel) {
          panel = document.createElement('div');
          panel.className = 'aa-event-images-admin';
          body.insertBefore(panel, body.firstChild);
        }
        renderPanel(panel, cachedData);
        renderSig = sig;
      } catch(e) {
        console.error('[EventImages] admin mount failed', e);
      } finally {
        mounting = false;
      }
    }

    function scheduleMount(){ setTimeout(mountAdmin, 80); }
    addStyle();
    scheduleMount();
    ['click','keyup','focus'].forEach(function(evt){ document.addEventListener(evt, scheduleMount, true); });
    var observer = new MutationObserver(scheduleMount);
    observer.observe(document.documentElement, { childList:true, subtree:true });
  } catch(err) {
    console.error('[EventImages] disabled after error:', err);
  }
})();