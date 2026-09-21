// event-media-core.jsx — core React event image/video support
// Loaded before app.jsx so EventsSection uses these components directly.
(function installEventMediaCore(){
  if (window.__AA_EVENT_MEDIA_CORE_V2__) return;
  window.__AA_EVENT_MEDIA_CORE_V2__ = true;

  const { useMemo: useMemoEM } = React;

  const pick = (obj, key, lang) => {
    try { if (window.pickByLang) return window.pickByLang(obj, key, lang); } catch(e) {}
    return obj?.[`${key}_${lang}`] ?? obj?.[`${key}_es`] ?? obj?.[key] ?? "";
  };
  const mediaUrl = (ev) => String(ev?.image || ev?.media || ev?.video || ev?.photo || ev?.image_url || "").trim();
  const cleanUrl = (url) => String(url || "").toLowerCase().split('?')[0].split('#')[0];
  const isImageUrl = (url) => /\.(jpg|jpeg|png|webp|gif|avif)$/i.test(cleanUrl(url));
  const isVideoUrl = (url) => /\.(mp4|webm|m4v|ogv|ogg)$/i.test(cleanUrl(url));
  const mediaType = (ev) => {
    const url = mediaUrl(ev);
    if (isImageUrl(url)) return "image";
    if (isVideoUrl(url)) return "video";
    const explicit = String(ev?.media_type || ev?.image_type || ev?.kind || "").toLowerCase();
    return explicit === "video" ? "video" : "image";
  };

  function EventVenueMedia({ ev, lang }) {
    const src = mediaUrl(ev);
    if (!src) return null;
    const type = mediaType(ev);
    const caption = pick(ev, "image_caption", lang);
    return (
      <figure className={`event-venue-media event-venue-media-${type}`}>
        {type === "video" ? (
          <video
            src={src}
            autoPlay
            muted
            loop
            playsInline
            preload="metadata"
            controls
            onCanPlay={e => { e.currentTarget.muted = true; e.currentTarget.play().catch(()=>{}); }}
          />
        ) : (
          <img src={src} alt={pick(ev, "image_alt", lang) || ev?.venue || "Imagen del evento"} loading="lazy" decoding="async" />
        )}
        {caption && <figcaption className="micro">{caption}</figcaption>}
      </figure>
    );
  }

  function EventCardWithMedia({ ev, lang, L, side="left" }) {
    const title = pick(ev, "title", lang);
    const date  = pick(ev, "date", lang);
    const addr  = pick(ev, "address", lang);
    const note  = pick(ev, "note", lang);
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
            <div style={{ fontSize:17, color:"var(--ink-soft)", lineHeight:1.6, marginBottom:mediaUrl(ev) ? 14 : 24 }}>
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

  window.EventVenueMedia = EventVenueMedia;
  window.EventCard = EventCardWithMedia;
  window.EventsSection = EventsSectionWithMedia;
  try { EventCard = EventCardWithMedia; EventsSection = EventsSectionWithMedia; } catch(e) {}
})();
