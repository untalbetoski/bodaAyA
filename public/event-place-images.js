// event-place-images.js — stable event media display + fixed admin editor button
(function stableEventPlaceMedia(){
  try {
    if (window.__AA_STABLE_EVENT_PLACE_MEDIA_V5__) return;
    window.__AA_STABLE_EVENT_PLACE_MEDIA_V5__ = true;

    var EVENT_DEFS = [
      { key:'icebreaker', label:'Rompe Hielo' },
      { key:'ceremony', label:'Ceremonia' },
      { key:'reception', label:'Recepción' },
      { key:'traditional', label:'Boda Tradicional' }
    ];

    function byLang(obj, key, lang){
      try { if (window.pickByLang) return window.pickByLang(obj, key, lang); } catch(e) {}
      return (obj && (obj[key + '_' + lang] || obj[key + '_es'] || obj[key])) || '';
    }
    function mediaUrl(ev){ return String((ev && (ev.image || ev.media || ev.video || ev.photo || ev.image_url)) || '').trim(); }
    function mediaType(ev){
      var explicit = String((ev && (ev.media_type || ev.image_type || ev.kind)) || '').toLowerCase();
      if (explicit === 'video' || explicit === 'image') return explicit;
      var url = mediaUrl(ev).toLowerCase().split('?')[0].split('#')[0];
      return /\.(mp4|webm|mov|m4v|ogv|ogg)$/.test(url) ? 'video' : 'image';
    }
    function esc(v){ return String(v || '').replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;').replace(/"/g,'&quot;'); }
    function publish(data){
      try {
        window.__AA_SITE_DATA = data;
        window.dispatchEvent(new CustomEvent('aa:content-updated', { detail:{ data:data } }));
      } catch(e) {}
    }

    function addStyle(){
      if (document.getElementById('aa-stable-event-media-style-v5')) return;
      var style = document.createElement('style');
      style.id = 'aa-stable-event-media-style-v5';
      style.textContent = `
        .aa-event-place-media{margin:10px 0 24px;border:1px solid var(--line);background:rgba(255,250,241,.62);overflow:hidden;box-shadow:0 18px 42px -32px rgba(47,36,24,.45)}
        .aa-event-place-media img,.aa-event-place-media video{width:100%;aspect-ratio:16/10;object-fit:cover;display:block;background:var(--paper-2)}
        .aa-event-place-media figcaption{padding:9px 12px;text-align:center;color:var(--ink-mute)}
        .aa-event-place-video{position:relative}.aa-event-place-video:after{content:'VIDEO';position:absolute;top:10px;right:10px;background:rgba(47,36,24,.58);color:#fffaf1;border:1px solid rgba(255,250,241,.4);font-size:8px;letter-spacing:.18em;padding:5px 8px;border-radius:999px;font-family:var(--sans)}
        .aa-media-fixed-btn{position:fixed!important;right:18px!important;bottom:86px!important;z-index:99999!important;background:#3f3420!important;color:#fffaf1!important;border:1px solid rgba(255,250,241,.35)!important;border-radius:999px!important;padding:12px 16px!important;box-shadow:0 14px 42px -18px rgba(0,0,0,.55)!important;font-family:var(--sans,Arial)!important;font-size:10px!important;letter-spacing:.16em!important;text-transform:uppercase!important;cursor:pointer!important;display:none!important;align-items:center!important;gap:8px!important}
        .admin-panel.open ~ .aa-media-fixed-btn,.aa-media-fixed-btn.aa-show{display:flex!important}
        .aa-media-modal-back{position:fixed;inset:0;z-index:100000;background:rgba(63,52,32,.48);backdrop-filter:blur(5px);display:flex;align-items:center;justify-content:center;padding:18px}
        .aa-media-modal{width:min(620px,100%);max-height:88vh;overflow:auto;background:#fffdf8;border:1px solid var(--line);box-shadow:0 26px 90px -42px rgba(0,0,0,.55);padding:22px;display:grid;gap:14px;color:var(--ink)}
        .aa-media-modal-head{display:flex;align-items:center;justify-content:space-between;gap:12px;border-bottom:1px solid var(--line);padding-bottom:12px}.aa-media-modal-head h3{margin:0;font-family:var(--display);font-size:18px;letter-spacing:.12em;text-transform:uppercase;color:var(--ink)}
        .aa-media-close{border:0;background:transparent;font-size:24px;cursor:pointer;color:var(--ink-soft)}
        .aa-media-row{display:grid;grid-template-columns:94px 1fr;gap:12px;border:1px solid rgba(95,75,52,.16);background:#fff;padding:10px;border-radius:8px;margin-bottom:10px}
        .aa-media-preview{width:94px;height:94px;border:1px solid var(--line);background:var(--paper-2);display:flex;align-items:center;justify-content:center;overflow:hidden;color:var(--ink-mute);font-size:10px;text-align:center;position:relative}.aa-media-preview img,.aa-media-preview video{width:100%;height:100%;object-fit:cover;display:block}.aa-media-preview[data-kind='video']:after{content:'▶';position:absolute;right:6px;bottom:6px;background:rgba(0,0,0,.48);color:#fff;width:22px;height:22px;border-radius:999px;display:flex;align-items:center;justify-content:center;font-size:10px}
        .aa-media-input{width:100%;border:1px solid var(--line);border-radius:4px;padding:8px 9px;font-size:12px;color:var(--ink);background:#fff}.aa-media-select{border:1px solid var(--line);border-radius:4px;padding:7px 9px;background:#fff;color:var(--ink);font-size:12px}
        .aa-media-actions{display:flex;gap:7px;flex-wrap:wrap;margin-top:7px}.aa-media-actions button{font-size:9px!important;padding:7px 10px!important;letter-spacing:.13em!important}.aa-media-status{min-height:18px;font-size:12px;color:var(--ink-mute);font-family:var(--sans)}
        @media(max-width:720px){.aa-media-fixed-btn{right:14px!important;bottom:76px!important}.aa-media-row{grid-template-columns:70px 1fr}.aa-media-preview{width:70px;height:70px}.aa-event-place-media{margin-top:6px}}
      `;
      document.head.appendChild(style);
    }

    // Public visual rendering: patch EventCard only when React components are already present.
    function installPublicEventCard(){
      if (!window.React || !window.Reveal || !window.pickByLang || window.__AA_EVENT_CARD_MEDIA_V5__) return;
      window.__AA_EVENT_CARD_MEDIA_V5__ = true;
      var h = React.createElement;
      function calendarHref(ev, title, addr, note){
        try {
          var start = new Date(ev && ev.iso ? ev.iso : '2027-04-16T17:00:00-06:00');
          var fmt = function(d){ return d.toISOString().replace(/[-:]/g,'').replace(/\.\d{3}/, ''); };
          var params = new URLSearchParams({ action:'TEMPLATE', text:title + ' — Andrea & Alberto', dates:fmt(start) + '/' + fmt(new Date(start.getTime()+4*3600*1000)), details:note || '', location:((ev && ev.venue) || '') + ', ' + (addr || '') });
          return 'https://www.google.com/calendar/render?' + params.toString();
        } catch(e){ return 'https://www.google.com/calendar/render'; }
      }
      function MapFrame(ev){
        return h('div', { className:'img-ph', style:{ aspectRatio:'4/5', borderRadius:0, position:'relative', overflow:'hidden' } },
          h('iframe', { title:(ev && ev.venue) || 'Mapa', src:(ev && ev.map) || '', style:{ position:'absolute', inset:0, width:'100%', height:'100%', border:0, filter:'grayscale(.4) saturate(.6)' }, loading:'lazy' })
        );
      }
      function PlaceMedia(ev, lang){
        var src = mediaUrl(ev); if (!src) return null;
        var type = mediaType(ev);
        var caption = byLang(ev, 'image_caption', lang);
        var node = type === 'video'
          ? h('video', { src:src, autoPlay:true, muted:true, loop:true, playsInline:true, controls:false, preload:'metadata' })
          : h('img', { src:src, alt:byLang(ev, 'image_alt', lang) || ((ev && ev.venue) ? 'Imagen de ' + ev.venue : 'Imagen del lugar'), loading:'lazy', decoding:'async' });
        return h('figure', { className:'aa-event-place-media aa-event-place-' + type }, node, caption ? h('figcaption', { className:'micro' }, caption) : null);
      }
      function EventCardWithMedia(props){
        var ev = props.ev || {}, lang = props.lang || 'es', L = props.L || {}, side = props.side || 'left';
        var title = byLang(ev,'title',lang), date = byLang(ev,'date',lang), addr = byLang(ev,'address',lang), note = byLang(ev,'note',lang);
        var textCol = h('div', null,
          h('h3', { className:'display', style:{ fontSize:'clamp(28px,3.4vw,44px)', margin:0, color:'var(--ink)' } }, title),
          h('div', { className:'script', style:{ fontSize:34, color:'var(--sage-deep)', margin:'6px 0 18px' } }, ev.venue || ''),
          h('div', { style:{ fontSize:17, color:'var(--ink-soft)', lineHeight:1.6, marginBottom:mediaUrl(ev) ? 14 : 24 } }, h('div', { style:{ fontStyle:'italic' } }, date), h('div', null, addr)),
          PlaceMedia(ev, lang),
          h('p', { style:{ fontSize:14.5, color:'var(--ink-mute)', lineHeight:1.6, marginBottom:24, maxWidth:380 } }, note),
          h('div', { style:{ display:'flex', gap:10, flexWrap:'wrap' } },
            h('a', { className:'btn btn-sage', href:'https://www.google.com/maps/search/?api=1&query=' + encodeURIComponent((ev.venue || '') + ', ' + addr), target:'_blank', rel:'noopener' }, L.open_map || 'Mapa'),
            h('a', { className:'btn', href:calendarHref(ev,title,addr,note), target:'_blank', rel:'noopener' }, L.add_calendar || 'Calendario')
          )
        );
        return h(Reveal, null, h('div', { className:'ev-grid', style:{ display:'grid', gridTemplateColumns:'1fr 1fr', gap:48, alignItems:'center' } }, side === 'left' ? MapFrame(ev) : null, textCol, side === 'right' ? MapFrame(ev) : null));
      }
      try { window.EventCard = EventCard = EventCardWithMedia; } catch(e) { window.EventCard = EventCardWithMedia; }
    }

    async function loadContent(){
      var res = await fetch('/api/content?eventMedia=' + Date.now(), { cache:'no-store' });
      var json = await res.json().catch(function(){ return {}; });
      if (!res.ok || !json.ok || !json.data) throw new Error(json.error || 'No se pudo cargar el contenido');
      return json.data;
    }
    async function saveContent(data){
      var res = await fetch('/api/content', { method:'POST', headers:{ 'Content-Type':'application/json' }, body:JSON.stringify({ data:data }) });
      var json = await res.json().catch(function(){ return {}; });
      if (!res.ok || !json.ok) throw new Error(json.error || 'No se pudo guardar');
      return json.data || data;
    }
    function readFileAsDataUrl(file){ return new Promise(function(resolve,reject){ var r=new FileReader(); r.onload=function(){resolve(r.result)}; r.onerror=reject; r.readAsDataURL(file); }); }
    function resizeImage(file){ return new Promise(function(resolve,reject){ var r=new FileReader(); r.onload=function(){ var img=new Image(); img.onload=function(){ var ratio=Math.min(1,1800/img.width); var c=document.createElement('canvas'); c.width=Math.round(img.width*ratio); c.height=Math.round(img.height*ratio); c.getContext('2d').drawImage(img,0,0,c.width,c.height); resolve(c.toDataURL('image/jpeg',.86)); }; img.onerror=reject; img.src=r.result; }; r.onerror=reject; r.readAsDataURL(file); }); }
    async function uploadMedia(file){
      var isVideo = /^video\//i.test(file.type || '');
      var dataUrl = isVideo ? await readFileAsDataUrl(file) : await resizeImage(file);
      var res = await fetch('/api/gallery/upload', { method:'POST', headers:{ 'Content-Type':'application/json' }, body:JSON.stringify({ filename:file.name, dataUrl:dataUrl }) });
      var json = await res.json().catch(function(){ return {}; });
      if (!res.ok || !json.ok || !json.url) throw new Error(json.error || 'No se pudo subir');
      return { url:json.url, type:json.kind || (isVideo ? 'video' : 'image') };
    }
    function previewHtml(ev){
      var url = mediaUrl(ev), type = mediaType(ev);
      if (!url) return '<span>Sin archivo</span>';
      return type === 'video' ? '<video src="' + esc(url) + '" muted playsinline preload="metadata"></video>' : '<img src="' + esc(url) + '" alt="">';
    }

    async function openEditor(){
      try {
        addStyle();
        var data = await loadContent();
        var back = document.createElement('div');
        back.className = 'aa-media-modal-back';
        back.innerHTML = '<div class="aa-media-modal"><div class="aa-media-modal-head"><h3>Media eventos</h3><button class="aa-media-close" type="button">×</button></div><div style="font-size:12px;color:var(--ink-mute);line-height:1.5">Cambia la imagen o video de cada evento. El video se reproduce automáticamente, sin sonido y en loop.</div><div class="aa-media-list"></div><div class="aa-media-status"></div></div>';
        document.body.appendChild(back);
        var list = back.querySelector('.aa-media-list'), status = back.querySelector('.aa-media-status');
        back.querySelector('.aa-media-close').onclick = function(){ back.remove(); };
        back.addEventListener('click', function(e){ if (e.target === back) back.remove(); });
        function setStatus(t, ok){ status.textContent=t||''; status.style.color=ok?'var(--sage-deep)':'var(--ink-mute)'; }
        function render(){
          list.innerHTML = EVENT_DEFS.map(function(def){
            var ev=data[def.key]||{}; var type=mediaType(ev);
            return '<div class="aa-media-row" data-key="'+def.key+'"><div class="aa-media-preview" data-kind="'+type+'">'+previewHtml(ev)+'</div><div><div class="micro" style="color:var(--sage-deep);font-size:9px;margin-bottom:6px">'+def.label+'</div><input class="aa-media-input" data-role="url" placeholder="URL de imagen o video" value="'+esc(mediaUrl(ev))+'"><div style="display:flex;gap:8px;align-items:center;margin-top:7px"><span style="font-size:11px;color:var(--ink-mute)">Tipo:</span><select class="aa-media-select" data-role="type"><option value="image" '+(type==='image'?'selected':'')+'>Imagen</option><option value="video" '+(type==='video'?'selected':'')+'>Video autoplay</option></select></div><input class="aa-media-input" data-role="caption" placeholder="Pie de foto opcional" style="margin-top:7px" value="'+esc(byLang(ev,'image_caption','es'))+'"><div class="aa-media-actions"><button class="btn" type="button" data-role="upload">Subir imagen/video</button><button class="btn" type="button" data-role="save">Guardar</button><button class="btn" type="button" data-role="clear">Quitar</button></div><input type="file" accept="image/*,video/mp4,video/webm,video/quicktime,video/*" data-role="file" style="display:none"></div></div>';
          }).join('');
          list.querySelectorAll('.aa-media-row').forEach(function(row){
            var key=row.getAttribute('data-key'), file=row.querySelector('[data-role=file]'), url=row.querySelector('[data-role=url]'), type=row.querySelector('[data-role=type]'), cap=row.querySelector('[data-role=caption]');
            row.querySelector('[data-role=upload]').onclick=function(){ file.click(); };
            file.onchange=async function(){
              var f=file.files && file.files[0]; if(!f) return;
              try { setStatus(/^video\//i.test(f.type||'')?'Subiendo video…':'Subiendo imagen…', false); var media=await uploadMedia(f); data=await loadContent(); data[key]=data[key]||{}; data[key].image=media.url; data[key].media_type=media.type; data[key].image_caption_es=cap.value || data[key].image_caption_es || ''; data[key].image_caption_en=data[key].image_caption_es; data=await saveContent(data); publish(data); render(); setStatus(media.type==='video'?'Video subido y guardado.':'Imagen subida y guardada.', true); }
              catch(e){ console.error('[EventMedia] upload failed', e); setStatus('No se pudo subir. Usa un MP4 corto y ligero.', false); }
              finally { file.value=''; }
            };
            row.querySelector('[data-role=save]').onclick=async function(){
              try { setStatus('Guardando…', false); data=await loadContent(); data[key]=data[key]||{}; data[key].image=url.value.trim(); data[key].media_type=type.value; data[key].image_caption_es=cap.value.trim(); data[key].image_caption_en=cap.value.trim(); data=await saveContent(data); publish(data); render(); setStatus('Guardado.', true); }
              catch(e){ console.error('[EventMedia] save failed', e); setStatus('No se pudo guardar.', false); }
            };
            row.querySelector('[data-role=clear]').onclick=async function(){
              try { setStatus('Quitando…', false); data=await loadContent(); data[key]=data[key]||{}; data[key].image=''; data[key].media_type=''; data[key].image_caption_es=''; data[key].image_caption_en=''; data=await saveContent(data); publish(data); render(); setStatus('Archivo eliminado.', true); }
              catch(e){ console.error('[EventMedia] clear failed', e); setStatus('No se pudo quitar.', false); }
            };
          });
        }
        render();
      } catch(e) {
        console.error('[EventMedia] editor open failed', e);
        alert('No se pudo abrir Media eventos. Recarga la página e intenta de nuevo.');
      }
    }

    function ensureButton(){
      addStyle();
      var btn = document.getElementById('aa-media-fixed-btn');
      if (!btn) {
        btn = document.createElement('button');
        btn.id = 'aa-media-fixed-btn';
        btn.type = 'button';
        btn.className = 'aa-media-fixed-btn';
        btn.innerHTML = '🎬 Media eventos';
        btn.onclick = openEditor;
        document.body.appendChild(btn);
      }
      var panelOpen = !!document.querySelector('.admin-panel.open');
      if (panelOpen) btn.classList.add('aa-show'); else btn.classList.remove('aa-show');
    }

    addStyle();
    installPublicEventCard();
    setTimeout(installPublicEventCard, 300);
    setTimeout(installPublicEventCard, 900);
    setInterval(function(){ ensureButton(); installPublicEventCard(); }, 700);
    document.addEventListener('click', function(){ setTimeout(ensureButton, 80); }, true);
  } catch(err) {
    console.error('[StableEventMedia] disabled:', err);
  }
})();
