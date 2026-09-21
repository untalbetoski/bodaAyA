// event-place-images.js — stable event media editor with strict media detection
(function stableEventMediaV7(){
  try {
    if (window.__AA_EVENT_MEDIA_V7__) return;
    window.__AA_EVENT_MEDIA_V7__ = true;

    var MAX_VIDEO_UPLOAD_MB = 12;
    var MAX_VIDEO_UPLOAD_BYTES = MAX_VIDEO_UPLOAD_MB * 1024 * 1024;
    var EVENTS = [
      { key:'icebreaker', label:'Rompe Hielo' },
      { key:'ceremony', label:'Ceremonia' },
      { key:'reception', label:'Recepción' },
      { key:'traditional', label:'Boda Tradicional' }
    ];

    function clean(v){ return String(v || '').trim(); }
    function esc(v){ return String(v || '').replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;').replace(/"/g,'&quot;'); }
    function baseUrl(url){ return clean(url).toLowerCase().split('?')[0].split('#')[0]; }
    function isImageUrl(url){ return /\.(jpg|jpeg|png|webp|gif|avif)$/i.test(baseUrl(url)); }
    function isVideoUrl(url){ return /\.(mp4|webm|m4v|ogv|ogg)$/i.test(baseUrl(url)); }
    function urlOf(ev){ return clean(ev && (ev.image || ev.media || ev.video || ev.photo || ev.image_url)); }
    function typeOf(ev){
      var url = urlOf(ev);
      if (isImageUrl(url)) return 'image';
      if (isVideoUrl(url)) return 'video';
      var explicit = clean(ev && (ev.media_type || ev.image_type || ev.kind)).toLowerCase();
      return explicit === 'video' ? 'video' : 'image';
    }
    function captionOf(ev){ return clean(ev && (ev.image_caption_es || ev.image_caption || ev.caption)); }
    function mb(bytes){ return (bytes / 1024 / 1024).toFixed(1) + ' MB'; }

    function addStyle(){
      if (document.getElementById('aa-event-media-v7-style')) return;
      var style = document.createElement('style');
      style.id = 'aa-event-media-v7-style';
      style.textContent = `
        .aa-media-fixed-btn{position:fixed!important;right:18px!important;bottom:86px!important;z-index:99999!important;background:#3f3420!important;color:#fffaf1!important;border:1px solid rgba(255,250,241,.38)!important;border-radius:999px!important;padding:12px 16px!important;box-shadow:0 14px 42px -18px rgba(0,0,0,.55)!important;font-family:var(--sans,Arial)!important;font-size:10px!important;letter-spacing:.16em!important;text-transform:uppercase!important;cursor:pointer!important;display:none!important;align-items:center!important;gap:8px!important}
        .admin-panel.open ~ .aa-media-fixed-btn,.aa-media-fixed-btn.aa-show{display:flex!important}
        .aa-media-modal-back{position:fixed;inset:0;z-index:100000;background:rgba(63,52,32,.5);backdrop-filter:blur(5px);display:flex;align-items:center;justify-content:center;padding:18px}
        .aa-media-modal{width:min(680px,100%);max-height:88vh;overflow:auto;background:#fffdf8;border:1px solid var(--line);box-shadow:0 26px 90px -42px rgba(0,0,0,.55);padding:22px;display:grid;gap:14px;color:var(--ink)}
        .aa-media-modal-head{display:flex;align-items:center;justify-content:space-between;gap:12px;border-bottom:1px solid var(--line);padding-bottom:12px}.aa-media-modal-head h3{margin:0;font-family:var(--display);font-size:18px;letter-spacing:.12em;text-transform:uppercase;color:var(--ink)}
        .aa-media-close{border:0;background:transparent;font-size:24px;cursor:pointer;color:var(--ink-soft)}
        .aa-media-help{font-size:12px;color:var(--ink-mute);line-height:1.55;background:rgba(183,154,111,.12);border:1px dashed var(--line);padding:10px 12px;border-radius:8px}
        .aa-media-row{display:grid;grid-template-columns:100px 1fr;gap:12px;border:1px solid rgba(95,75,52,.16);background:#fff;padding:10px;border-radius:8px;margin-bottom:10px}
        .aa-media-preview{width:100px;height:100px;border:1px solid var(--line);background:var(--paper-2);display:flex;align-items:center;justify-content:center;overflow:hidden;color:var(--ink-mute);font-size:10px;text-align:center;position:relative}.aa-media-preview img,.aa-media-preview video{width:100%;height:100%;object-fit:cover;display:block}.aa-media-preview[data-kind='video']:after{content:'▶';position:absolute;right:6px;bottom:6px;background:rgba(0,0,0,.5);color:#fff;width:22px;height:22px;border-radius:999px;display:flex;align-items:center;justify-content:center;font-size:10px}
        .aa-media-input{width:100%;border:1px solid var(--line);border-radius:4px;padding:8px 9px;font-size:12px;color:var(--ink);background:#fff}.aa-media-select{border:1px solid var(--line);border-radius:4px;padding:7px 9px;background:#fff;color:var(--ink);font-size:12px}.aa-media-status{min-height:18px;font-size:12px;color:var(--ink-mute);font-family:var(--sans)}
        .aa-media-actions{display:flex;gap:7px;flex-wrap:wrap;margin-top:7px}.aa-media-actions button{font-size:9px!important;padding:7px 10px!important;letter-spacing:.13em!important}
        @media(max-width:720px){.aa-media-fixed-btn{right:14px!important;bottom:76px!important}.aa-media-row{grid-template-columns:76px 1fr}.aa-media-preview{width:76px;height:76px}}
      `;
      document.head.appendChild(style);
    }

    async function loadContent(){
      var res = await fetch('/api/content?eventMedia=' + Date.now(), { cache:'no-store' });
      var json = await res.json().catch(function(){ return {}; });
      if (!res.ok || !json.ok || !json.data) throw new Error(json.error || 'No se pudo cargar el contenido.');
      return json.data;
    }
    async function saveContent(data){
      var res = await fetch('/api/content', { method:'POST', headers:{ 'Content-Type':'application/json' }, body:JSON.stringify({ data:data }) });
      var json = await res.json().catch(function(){ return {}; });
      if (!res.ok || !json.ok) throw new Error(json.error || 'No se pudo guardar.');
      try { window.__AA_SITE_DATA = json.data || data; window.dispatchEvent(new CustomEvent('aa:content-updated', { detail:{ data:json.data || data } })); } catch(e) {}
      return json.data || data;
    }
    function readFile(file){ return new Promise(function(resolve,reject){ var r=new FileReader(); r.onload=function(){resolve(r.result)}; r.onerror=reject; r.readAsDataURL(file); }); }
    function resizeImage(file){ return new Promise(function(resolve,reject){ var r=new FileReader(); r.onload=function(){ var img=new Image(); img.onload=function(){ var ratio=Math.min(1,1800/img.width); var c=document.createElement('canvas'); c.width=Math.round(img.width*ratio); c.height=Math.round(img.height*ratio); c.getContext('2d').drawImage(img,0,0,c.width,c.height); resolve(c.toDataURL('image/jpeg',.86)); }; img.onerror=reject; img.src=r.result; }; r.onerror=reject; r.readAsDataURL(file); }); }
    async function upload(file){
      var isVideo = /^video\//i.test(file.type || '') || /\.(mp4|webm|m4v|mov)$/i.test(file.name || '');
      if (isVideo && file.size > MAX_VIDEO_UPLOAD_BYTES) throw new Error('El video pesa ' + mb(file.size) + '. La subida directa acepta máximo ' + MAX_VIDEO_UPLOAD_MB + ' MB. Súbelo como MP4/WebM a un hosting público y pega la URL.');
      var dataUrl = isVideo ? await readFile(file) : await resizeImage(file);
      var res = await fetch('/api/gallery/upload', { method:'POST', headers:{ 'Content-Type':'application/json' }, body:JSON.stringify({ filename:file.name, dataUrl:dataUrl }) });
      var json = await res.json().catch(function(){ return {}; });
      if (!res.ok || !json.ok || !json.url) throw new Error(json.error || 'No se pudo subir.');
      return { url:json.url, type:json.kind || (isVideo ? 'video' : 'image') };
    }
    function preview(ev){
      var url = urlOf(ev), type = typeOf(ev);
      if (!url) return '<span>Sin archivo</span>';
      return type === 'video' ? '<video src="' + esc(url) + '" muted playsinline controls preload="metadata"></video>' : '<img src="' + esc(url) + '" alt="">';
    }
    function normalizeType(url, selected){
      if (isImageUrl(url)) return 'image';
      if (isVideoUrl(url)) return 'video';
      return selected === 'video' ? 'video' : 'image';
    }

    async function openEditor(){
      addStyle();
      var data = await loadContent();
      var back = document.createElement('div');
      back.className = 'aa-media-modal-back';
      back.innerHTML = '<div class="aa-media-modal"><div class="aa-media-modal-head"><h3>Media eventos</h3><button class="aa-media-close" type="button">×</button></div><div class="aa-media-help"><strong>Video:</strong> usa una URL directa que termine en <strong>.mp4</strong> o <strong>.webm</strong>. Si la URL termina en .jpg/.png se guardará como imagen, aunque selecciones video. Los videos de iPhone .MOV pueden no reproducirse; conviértelos a MP4 H.264.</div><div class="aa-media-list"></div><div class="aa-media-status"></div></div>';
      document.body.appendChild(back);
      var list = back.querySelector('.aa-media-list'), status = back.querySelector('.aa-media-status');
      function setStatus(text, ok){ status.textContent = text || ''; status.style.color = ok ? 'var(--sage-deep)' : '#9b3f2f'; }
      back.querySelector('.aa-media-close').onclick = function(){ back.remove(); };
      back.addEventListener('click', function(e){ if (e.target === back) back.remove(); });

      function render(){
        list.innerHTML = EVENTS.map(function(def){
          var ev = data[def.key] || {}, type = typeOf(ev);
          return '<div class="aa-media-row" data-key="'+def.key+'"><div class="aa-media-preview" data-kind="'+type+'">'+preview(ev)+'</div><div><div class="micro" style="color:var(--sage-deep);font-size:9px;margin-bottom:6px">'+def.label+'</div><input class="aa-media-input" data-role="url" placeholder="URL directa JPG/PNG/MP4/WEBM" value="'+esc(urlOf(ev))+'"><div style="display:flex;gap:8px;align-items:center;margin-top:7px"><span style="font-size:11px;color:var(--ink-mute)">Tipo:</span><select class="aa-media-select" data-role="type"><option value="image" '+(type==='image'?'selected':'')+'>Imagen</option><option value="video" '+(type==='video'?'selected':'')+'>Video autoplay</option></select></div><input class="aa-media-input" data-role="caption" placeholder="Pie de foto opcional" style="margin-top:7px" value="'+esc(captionOf(ev))+'"><div class="aa-media-actions"><button class="btn" type="button" data-role="upload">Subir archivo pequeño</button><button class="btn" type="button" data-role="save">Guardar URL</button><button class="btn" type="button" data-role="clear">Quitar</button></div><input type="file" accept="image/*,video/mp4,video/webm,video/quicktime,video/*" data-role="file" style="display:none"></div></div>';
        }).join('');

        list.querySelectorAll('.aa-media-row').forEach(function(row){
          var key=row.getAttribute('data-key'), url=row.querySelector('[data-role=url]'), type=row.querySelector('[data-role=type]'), cap=row.querySelector('[data-role=caption]'), file=row.querySelector('[data-role=file]');
          url.addEventListener('input', function(){ type.value = normalizeType(url.value, type.value); });
          row.querySelector('[data-role=upload]').onclick=function(){ file.click(); };
          file.onchange=async function(){
            var f=file.files && file.files[0]; if(!f) return;
            try {
              setStatus('Subiendo…', false);
              var media=await upload(f);
              data=await loadContent(); data[key]=data[key]||{}; data[key].image=media.url; data[key].media_type=normalizeType(media.url, media.type); data[key].image_caption_es=cap.value.trim(); data[key].image_caption_en=cap.value.trim(); data=await saveContent(data); render(); setStatus((data[key].media_type==='video'?'Video':'Imagen')+' guardado. Recarga la página pública para verlo.', true);
            } catch(e){ setStatus(e.message || 'No se pudo subir.', false); }
            finally { file.value=''; }
          };
          row.querySelector('[data-role=save]').onclick=async function(){
            try {
              var finalType = normalizeType(url.value, type.value);
              if (type.value === 'video' && isImageUrl(url.value)) { setStatus('Esa URL termina en imagen, no en video. Se guardará como imagen.', false); }
              data=await loadContent(); data[key]=data[key]||{}; data[key].image=url.value.trim(); data[key].media_type=finalType; data[key].image_caption_es=cap.value.trim(); data[key].image_caption_en=cap.value.trim(); data=await saveContent(data); render(); setStatus((finalType==='video'?'Video':'Imagen')+' guardado.', true);
            } catch(e){ setStatus(e.message || 'No se pudo guardar.', false); }
          };
          row.querySelector('[data-role=clear]').onclick=async function(){
            try { data=await loadContent(); data[key]=data[key]||{}; data[key].image=''; data[key].media_type=''; data[key].image_caption_es=''; data[key].image_caption_en=''; data=await saveContent(data); render(); setStatus('Archivo eliminado.', true); }
            catch(e){ setStatus(e.message || 'No se pudo quitar.', false); }
          };
        });
      }
      render();
    }

    function ensureButton(){
      addStyle();
      var btn=document.getElementById('aa-media-fixed-btn');
      if(!btn){ btn=document.createElement('button'); btn.id='aa-media-fixed-btn'; btn.className='aa-media-fixed-btn'; btn.type='button'; btn.innerHTML='🎬 Media eventos'; btn.onclick=function(){ openEditor().catch(function(e){ alert(e.message || 'No se pudo abrir Media eventos.'); }); }; document.body.appendChild(btn); }
      var open=!!document.querySelector('.admin-panel.open');
      if(open) btn.classList.add('aa-show'); else btn.classList.remove('aa-show');
    }

    addStyle();
    ensureButton();
    setInterval(ensureButton, 700);
    document.addEventListener('click', function(){ setTimeout(ensureButton, 80); }, true);
  } catch(err) { console.error('[EventMediaV7] disabled:', err); }
})();
