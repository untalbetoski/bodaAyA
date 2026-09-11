// event-media-core.jsx — core React event image/video support
// Loaded before app.jsx so EventsSection/AdminPanel use these components directly.
(function installEventMediaCore(){
  if (window.__AA_EVENT_MEDIA_CORE_V1__) return;
  window.__AA_EVENT_MEDIA_CORE_V1__ = true;

  const { useMemo: useMemoEM, useRef: useRefEM } = React;
  const EVENT_MEDIA_MAX_VIDEO_MB = 12;
  const EVENT_MEDIA_MAX_VIDEO_BYTES = EVENT_MEDIA_MAX_VIDEO_MB * 1024 * 1024;

  const eventMediaPick = (obj, key, lang) => {
    try { if (window.pickByLang) return window.pickByLang(obj, key, lang); } catch(e) {}
    return obj?.[`${key}_${lang}`] ?? obj?.[key] ?? "";
  };

  const eventMediaUrl = (ev) => String(ev?.image || ev?.media || ev?.video || ev?.photo || ev?.image_url || "").trim();
  const eventMediaTypeFromUrl = (url) => /\.(mp4|webm|m4v|mov|ogv|ogg)(?:$|[?#])/i.test(String(url || "")) ? "video" : "image";
  const eventMediaType = (ev) => {
    const explicit = String(ev?.media_type || ev?.image_type || ev?.kind || "").toLowerCase();
    if (explicit === "video" || explicit === "image") return explicit;
    return eventMediaTypeFromUrl(eventMediaUrl(ev));
  };

  function EventVenueMedia({ ev, lang }) {
    const src = eventMediaUrl(ev);
    if (!src) return null;
    const type = eventMediaType(ev);
    const caption = eventMediaPick(ev, "image_caption", lang);
    return (
      <figure className={`event-venue-media event-venue-media-${type}`}>
        {type === "video" ? (
          <video
            src={src}
            autoPlay
            muted
            loop
            playsInline
            webkit-playsinline="true"
            preload="metadata"
            controls={false}
            onCanPlay={e => { e.currentTarget.muted = true; e.currentTarget.play().catch(()=>{}); }}
          />
        ) : (
          <img src={src} alt={eventMediaPick(ev, "image_alt", lang) || ev?.venue || "Imagen del evento"} loading="lazy" decoding="async" />
        )}
        {caption && <figcaption className="micro">{caption}</figcaption>}
      </figure>
    );
  }

  function EventCardWithMedia({ ev, lang, L, side="left" }) {
    const title = eventMediaPick(ev, "title", lang);
    const date  = eventMediaPick(ev, "date", lang);
    const addr  = eventMediaPick(ev, "address", lang);
    const note  = eventMediaPick(ev, "note", lang);
    const calHref = useMemoEM(() => {
      const start = new Date(ev === undefined ? Date.now() : (ev.iso || "2027-04-16T17:00:00-06:00"));
      const fmt = d => d.toISOString().replace(/[-:]/g,"").replace(/\.\d{3}/, "");
      const s = fmt(new Date(start.getTime()));
      const e = fmt(new Date(start.getTime() + 4*3600*1000));
      const params = new URLSearchParams({ action:"TEMPLATE", text:`${title} — Andrea & Alberto`, dates:`${s}/${e}`, details:note || "", location:`${ev?.venue || ""}, ${addr || ""}` });
      return `https://www.google.com/calendar/render?${params.toString()}`;
    }, [ev, title, addr, note]);

    const MapBlock = () => (
      <div className="img-ph" style={{ aspectRatio:"4/5", borderRadius:0, position:"relative", overflow:"hidden" }}>
        <iframe title={ev?.venue || "Mapa"} src={ev?.map || ""} style={{ position:"absolute", inset:0, width:"100%", height:"100%", border:0, filter:"grayscale(.4) saturate(.6)" }} loading="lazy"></iframe>
      </div>
    );

    return (
      <Reveal>
        <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr", gap:48, alignItems:"center" }} className="ev-grid">
          {side === "left" && <MapBlock />}
          <div>
            <h3 className="display" style={{ fontSize:"clamp(28px,3.4vw,44px)", margin:0, color:"var(--ink)" }}>{title}</h3>
            <div className="script" style={{ fontSize:34, color:"var(--sage-deep)", margin:"6px 0 18px" }}>{ev?.venue}</div>
            <div style={{ fontSize:17, color:"var(--ink-soft)", lineHeight:1.6, marginBottom:eventMediaUrl(ev) ? 14 : 24 }}>
              <div style={{ fontStyle:"italic" }}>{date}</div>
              <div>{addr}</div>
            </div>
            <EventVenueMedia ev={ev} lang={lang} />
            <p style={{ fontSize:14.5, color:"var(--ink-mute)", lineHeight:1.6, marginBottom:24, maxWidth:380 }}>{note}</p>
            <div style={{ display:"flex", gap:10, flexWrap:"wrap" }}>
              <a className="btn btn-sage" href={`https://www.google.com/maps/search/?api=1&query=${encodeURIComponent((ev?.venue || "")+", "+(addr || ""))}`} target="_blank" rel="noopener">{L.open_map}</a>
              <a className="btn" href={calHref} target="_blank" rel="noopener">{L.add_calendar}</a>
            </div>
          </div>
          {side === "right" && <MapBlock />}
        </div>
      </Reveal>
    );
  }

  function EventsSectionWithMedia({ data, L, lang }) {
    return (
      <section className="s" id="details">
        <WatercolorStamp size={400} style={{ position:"absolute", top:"10%", right:"-10%", opacity:.4, transform:"rotate(-15deg)" }} />
        <div className="inner" style={{ display:"flex", flexDirection:"column", gap:120 }}>
          <SectionHead kicker={L.program_kicker} title={lang==="es" ? "Dos días para celebrar" : "Two days to celebrate"} sub={lang==="es" ? "Acompáñanos a este encuentro." : "Join us for these gatherings."} />
          {data.icebreaker && <EventCardWithMedia ev={data.icebreaker} side="right" lang={lang} L={L} />}
          <EventCardWithMedia ev={data.ceremony} side="left" lang={lang} L={L} />
          <EventCardWithMedia ev={data.reception} side="right" lang={lang} L={L} />
          {data.traditional && <EventCardWithMedia ev={data.traditional} side="left" lang={lang} L={L} />}
        </div>
        <style>{`
          .event-venue-media{ margin:10px 0 24px; border:1px solid var(--line); background:rgba(255,250,241,.62); overflow:hidden; box-shadow:0 18px 42px -32px rgba(47,36,24,.45); }
          .event-venue-media img,.event-venue-media video{ width:100%; aspect-ratio:16/10; object-fit:cover; display:block; background:#111; }
          .event-venue-media figcaption{ padding:9px 12px; text-align:center; color:var(--ink-mute); }
          .event-venue-media-video{ position:relative; }
          .event-venue-media-video:after{ content:'VIDEO'; position:absolute; top:10px; right:10px; background:rgba(47,36,24,.58); color:#fffaf1; border:1px solid rgba(255,250,241,.4); font-size:8px; letter-spacing:.18em; padding:5px 8px; border-radius:999px; font-family:var(--sans); }
          @media (max-width: 720px){ .ev-grid { grid-template-columns: 1fr !important; gap: 28px !important; } }
        `}</style>
      </section>
    );
  }

  function readFileAsDataUrlEM(file){
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = () => resolve(reader.result);
      reader.onerror = reject;
      reader.readAsDataURL(file);
    });
  }
  function resizeImageEM(file, maxW=1800){
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = () => {
        const img = new Image();
        img.onload = () => {
          const ratio = Math.min(1, maxW / img.width);
          const w = Math.round(img.width * ratio);
          const h = Math.round(img.height * ratio);
          const canvas = document.createElement("canvas");
          canvas.width = w; canvas.height = h;
          canvas.getContext("2d").drawImage(img, 0, 0, w, h);
          resolve(canvas.toDataURL("image/jpeg", 0.86));
        };
        img.onerror = reject;
        img.src = reader.result;
      };
      reader.onerror = reject;
      reader.readAsDataURL(file);
    });
  }
  async function uploadEventMediaEM(file){
    const isVideo = /^video\//i.test(file.type || "") || /\.(mp4|webm|mov|m4v)$/i.test(file.name || "");
    if (isVideo && file.size > EVENT_MEDIA_MAX_VIDEO_BYTES) {
      throw new Error(`El video pesa ${(file.size/1024/1024).toFixed(1)} MB. La subida directa acepta máximo ${EVENT_MEDIA_MAX_VIDEO_MB} MB. Para videos más grandes pega una URL pública MP4/WebM.`);
    }
    const dataUrl = isVideo ? await readFileAsDataUrlEM(file) : await resizeImageEM(file);
    const res = await fetch('/api/gallery/upload', {
      method:'POST',
      headers:{ 'Content-Type':'application/json' },
      body:JSON.stringify({ filename:file.name, dataUrl })
    });
    const json = await res.json().catch(() => ({}));
    if (!res.ok || !json.ok || !json.url) throw new Error(json.error || 'No se pudo subir el archivo.');
    return { url:json.url, type:json.kind || (isVideo ? 'video' : 'image') };
  }

  function EventMediaAdminFields({ label, path, data, onChange, lang }) {
    const fileRef = useRefEM(null);
    const ev = path.split('.').reduce((o,k)=>o?.[k], data) || {};
    const url = eventMediaUrl(ev);
    const type = eventMediaType(ev);
    const setValue = (field, value) => {
      const next = JSON.parse(JSON.stringify(data));
      let cur = next;
      const parts = path.split('.');
      for (let i=0; i<parts.length; i++) {
        cur[parts[i]] = cur[parts[i]] || {};
        if (i === parts.length-1) cur = cur[parts[i]];
        else cur = cur[parts[i]];
      }
      cur[field] = value;
      if (field === 'image') cur.media_type = eventMediaTypeFromUrl(value);
      onChange(next);
    };
    const clear = () => {
      const next = JSON.parse(JSON.stringify(data));
      let cur = next;
      const parts = path.split('.');
      for (let i=0; i<parts.length; i++) cur = cur?.[parts[i]];
      if (cur) { cur.image = ''; cur.media_type = ''; cur.image_caption_es = ''; cur.image_caption_en = ''; }
      onChange(next);
    };
    const onPick = async (file) => {
      if (!file) return;
      try {
        const media = await uploadEventMediaEM(file);
        const next = JSON.parse(JSON.stringify(data));
        let cur = next;
        const parts = path.split('.');
        for (let i=0; i<parts.length; i++) { cur[parts[i]] = cur[parts[i]] || {}; cur = cur[parts[i]]; }
        cur.image = media.url;
        cur.media_type = media.type;
        onChange(next);
        alert(media.type === 'video' ? 'Video subido. Ahora presiona Guardar.' : 'Imagen subida. Ahora presiona Guardar.');
      } catch(err) {
        alert(err.message || 'No se pudo subir el archivo.');
      } finally {
        if (fileRef.current) fileRef.current.value = '';
      }
    };
    return (
      <div style={{ padding:12, border:"1px dashed var(--line)", borderRadius:6, background:"rgba(183,154,111,.08)", display:"grid", gap:10 }}>
        <div className="micro" style={{ color:"var(--sage-deep)" }}>{label} · Imagen o video</div>
        {url && (
          <div style={{ width:"100%", aspectRatio:"16/9", border:"1px solid var(--line)", background:"var(--paper-2)", overflow:"hidden" }}>
            {type === 'video'
              ? <video src={url} muted playsInline preload="metadata" style={{ width:"100%", height:"100%", objectFit:"cover", display:"block" }} />
              : <img src={url} alt="" style={{ width:"100%", height:"100%", objectFit:"cover", display:"block" }} />}
          </div>
        )}
        <div className="row">
          <label>{lang==="es"?"URL pública de imagen o video":"Public image/video URL"}</label>
          <input type="url" placeholder="https://...jpg / .png / .mp4 / .webm" value={url} onChange={e=>setValue('image', e.target.value)} />
        </div>
        <div className="row">
          <label>{lang==="es"?"Tipo":"Type"}</label>
          <select value={type} onChange={e=>setValue('media_type', e.target.value)}>
            <option value="image">Imagen</option>
            <option value="video">Video autoplay</option>
          </select>
        </div>
        <div className="row">
          <label>{lang==="es"?"Pie de foto":"Caption"}</label>
          <input value={eventMediaPick(ev, 'image_caption', 'es')} onChange={e=>{ setValue('image_caption_es', e.target.value); setValue('image_caption_en', e.target.value); }} />
        </div>
        <input ref={fileRef} type="file" accept="image/*,video/mp4,video/webm,video/quicktime,video/*" style={{ display:"none" }} onChange={e=>onPick(e.target.files?.[0])} />
        <div style={{ display:"flex", gap:8, flexWrap:"wrap" }}>
          <button type="button" className="btn" style={{ fontSize:10, padding:"8px 12px" }} onClick={()=>fileRef.current?.click()}>{lang==="es"?"Subir archivo":"Upload file"}</button>
          {url && <button type="button" className="btn" style={{ fontSize:10, padding:"8px 12px" }} onClick={clear}>{lang==="es"?"Quitar":"Clear"}</button>}
        </div>
        <div style={{ fontSize:11, color:"var(--ink-mute)", lineHeight:1.45 }}>
          {lang==="es" ? `Videos directos: máximo ${EVENT_MEDIA_MAX_VIDEO_MB} MB. Para videos grandes usa una URL pública MP4/WebM.` : `Direct videos: max ${EVENT_MEDIA_MAX_VIDEO_MB} MB. For large videos use a public MP4/WebM URL.`}
        </div>
      </div>
    );
  }

  if (window.AdminPanel && !window.__AA_ADMIN_PANEL_MEDIA_WRAPPED__) {
    const OriginalAdminPanel = window.AdminPanel;
    window.__AA_ADMIN_PANEL_MEDIA_WRAPPED__ = true;
    window.AdminPanel = function AdminPanelWithEventMedia(props) {
      return <OriginalAdminPanel {...props} />;
    };
  }

  window.EventVenueMedia = EventVenueMedia;
  window.EventCard = EventCardWithMedia;
  window.EventsSection = EventsSectionWithMedia;
  window.EventMediaAdminFields = EventMediaAdminFields;
  try { EventCard = EventCardWithMedia; EventsSection = EventsSectionWithMedia; } catch(e) {}
})();
