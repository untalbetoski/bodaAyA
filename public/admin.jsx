// admin.jsx — password-protected admin panel + mock-backend sync
// Props:
//   open (bool), onClose, data, onChange (newData) => void, lang, L

const { useState: useStateA, useEffect: useEffectA, useRef: useRefA } = React;

function AdminPanel({ open, onClose, data, onChange, lang, L, onLogout, onSave, saveState, tweaks, setTweak, palettes }) {
  const [tab, setTab] = useStateA("portada");

  const update = (path, value) => {
    // path is dotted string like "ceremony.title_es" or "itinerary.0.time"
    const next = JSON.parse(JSON.stringify(data));
    const parts = path.split(".");
    let cur = next;
    for (let i=0; i<parts.length-1; i++){
      const p = parts[i];
      cur = cur[p];
    }
    cur[parts[parts.length-1]] = value;
    onChange(next);
  };

  const Tab = ({ id, label }) => (
    <button className={tab===id?"on":""} onClick={()=>setTab(id)}>{label}</button>
  );

  const Field = ({ label, path, type="text", rows }) => {
    // navigate to value
    const parts = path.split(".");
    let val = data;
    for (const p of parts) val = val?.[p];
    return (
      <div className="row">
        <label>{label}</label>
        {rows ? (
          <textarea rows={rows} value={val||""} onChange={e=>update(path, e.target.value)} />
        ) : (
          <input type={type} value={val||""} onChange={e=>update(path, e.target.value)} />
        )}
      </div>
    );
  };

  return (
    <React.Fragment>
      {open && <div onClick={onClose} style={{ position:"fixed", inset:0, background:"rgba(0,0,0,.15)", zIndex:245 }}></div>}
      <aside className={`admin-panel ${open?"open":""}`}>
        <div className="hd">
          <h3>{L.admin_title}</h3>
          <button onClick={onClose} style={{ background:"transparent", border:0, cursor:"pointer", color:"var(--ink-soft)", fontSize:18 }}>✕</button>
        </div>

        <div className="tabs">
          <Tab id="portada" label={lang==="es"?"Portada":"Cover"} />
          <Tab id="diseno" label={lang==="es"?"Diseño":"Design"} />
          <Tab id="eventos" label={lang==="es"?"Eventos":"Events"} />
          <Tab id="codigo" label={lang==="es"?"Vestimenta":"Dress"} />
          <Tab id="programa" label={lang==="es"?"Programa":"Schedule"} />
          <Tab id="rsvp" label="RSVP" />
          <Tab id="regalos" label={lang==="es"?"Regalos":"Gifts"} />
          <Tab id="hospedaje" label={lang==="es"?"Hospedaje":"Lodging"} />
          <Tab id="galeria" label={lang==="es"?"Galería":"Gallery"} />
          <Tab id="rsvps" label={lang==="es"?"Respuestas":"Responses"} />
        </div>

        <div className="body">
          {tab === "portada" && (
            <React.Fragment>
              <div className="row" style={{ flexDirection:"row", gap:8 }}>
                <div style={{ flex:1 }}><Field label={lang==="es"?"Nombre 1":"Name 1"} path="couple.a" /></div>
                <div style={{ flex:1 }}><Field label={lang==="es"?"Nombre 2":"Name 2"} path="couple.b" /></div>
              </div>
              <Field label={lang==="es"?"Tagline (ES)":"Tagline (ES)"} path="tagline_es" />
              <Field label={lang==="es"?"Tagline (EN)":"Tagline (EN)"} path="tagline_en" />
              <div style={{ display:"grid", gridTemplateColumns:"1fr 2fr 1fr", gap:8 }}>
                <Field label={lang==="es"?"Día":"Day"} path="date.day" />
                <Field label={lang==="es"?"Mes (ES)":"Month (ES)"} path="date.month_es" />
                <Field label={lang==="es"?"Año":"Year"} path="date.year" />
              </div>
              <Field label={lang==="es"?"Mes (EN)":"Month (EN)"} path="date.month_en" />
              <Field label={lang==="es"?"Fecha ISO":"ISO Date"} path="date.iso" />
              <Field label={lang==="es"?"Ciudad (ES)":"City (ES)"} path="city_es" />
              <Field label={lang==="es"?"Ciudad (EN)":"City (EN)"} path="city_en" />
            </React.Fragment>
          )}

          {tab === "diseno" && tweaks && setTweak && palettes && (
            <DesignAdmin tweaks={tweaks} setTweak={setTweak} palettes={palettes} lang={lang} />
          )}

          {tab === "eventos" && (
            <React.Fragment>
              <div className="micro" style={{ color:"var(--sage-deep)", marginTop:4 }}>{lang==="es"?"Ceremonia":"Ceremony"}</div>
              <Field label={lang==="es"?"Lugar":"Venue"} path="ceremony.venue" />
              <Field label={lang==="es"?"Dirección (ES)":"Address (ES)"} path="ceremony.address_es" />
              <Field label={lang==="es"?"Dirección (EN)":"Address (EN)"} path="ceremony.address_en" />
              <Field label={lang==="es"?"Fecha (ES)":"Date (ES)"} path="ceremony.date_es" />
              <Field label={lang==="es"?"Fecha (EN)":"Date (EN)"} path="ceremony.date_en" />
              <Field label={lang==="es"?"Nota (ES)":"Note (ES)"} path="ceremony.note_es" rows={2} />
              <Field label={lang==="es"?"Nota (EN)":"Note (EN)"} path="ceremony.note_en" rows={2} />

              <div className="micro" style={{ color:"var(--sage-deep)", marginTop:14 }}>{lang==="es"?"Recepción":"Reception"}</div>
              <Field label={lang==="es"?"Lugar":"Venue"} path="reception.venue" />
              <Field label={lang==="es"?"Dirección (ES)":"Address (ES)"} path="reception.address_es" />
              <Field label={lang==="es"?"Dirección (EN)":"Address (EN)"} path="reception.address_en" />
              <Field label={lang==="es"?"Fecha (ES)":"Date (ES)"} path="reception.date_es" />
              <Field label={lang==="es"?"Fecha (EN)":"Date (EN)"} path="reception.date_en" />
              <Field label={lang==="es"?"Nota (ES)":"Note (ES)"} path="reception.note_es" rows={2} />
              <Field label={lang==="es"?"Nota (EN)":"Note (EN)"} path="reception.note_en" rows={2} />

              {data.traditional && <React.Fragment>
                <div className="micro" style={{ color:"var(--sage-deep)", marginTop:14 }}>{lang==="es"?"Boda Tradicional":"Traditional Wedding"}</div>
                <Field label={lang==="es"?"Título (ES)":"Title (ES)"} path="traditional.title_es" />
                <Field label={lang==="es"?"Título (EN)":"Title (EN)"} path="traditional.title_en" />
                <Field label={lang==="es"?"Lugar":"Venue"} path="traditional.venue" />
                <Field label={lang==="es"?"Dirección (ES)":"Address (ES)"} path="traditional.address_es" />
                <Field label={lang==="es"?"Dirección (EN)":"Address (EN)"} path="traditional.address_en" />
                <Field label={lang==="es"?"Fecha (ES)":"Date (ES)"} path="traditional.date_es" />
                <Field label={lang==="es"?"Fecha (EN)":"Date (EN)"} path="traditional.date_en" />
                <Field label={lang==="es"?"Nota (ES)":"Note (ES)"} path="traditional.note_es" rows={2} />
                <Field label={lang==="es"?"Nota (EN)":"Note (EN)"} path="traditional.note_en" rows={2} />
              </React.Fragment>}
            </React.Fragment>
          )}

          {tab === "codigo" && (
            <React.Fragment>
              <div className="micro" style={{ color:"var(--sage-deep)", marginTop:4 }}>{lang==="es"?"Día 1 · Ceremonia y Recepción":"Day 1 · Ceremony & Reception"}</div>
              <Field label={lang==="es"?"Código (ES)":"Code (ES)"} path="dress.code_es" />
              <Field label={lang==="es"?"Código (EN)":"Code (EN)"} path="dress.code_en" />
              <Field label={lang==="es"?"Descripción (ES)":"Description (ES)"} path="dress.desc_es" rows={3} />
              <Field label={lang==="es"?"Descripción (EN)":"Description (EN)"} path="dress.desc_en" rows={3} />
              <Field label={lang==="es"?"A evitar (ES)":"Avoid (ES)"} path="dress.avoid_es" />
              <Field label={lang==="es"?"A evitar (EN)":"Avoid (EN)"} path="dress.avoid_en" />

              {data.dress2 && <React.Fragment>
                <div className="micro" style={{ color:"var(--sage-deep)", marginTop:14 }}>{lang==="es"?"Día 2 · Boda Tradicional":"Day 2 · Traditional Wedding"}</div>
                <Field label={lang==="es"?"Código (ES)":"Code (ES)"} path="dress2.code_es" />
                <Field label={lang==="es"?"Código (EN)":"Code (EN)"} path="dress2.code_en" />
                <Field label={lang==="es"?"Descripción (ES)":"Description (ES)"} path="dress2.desc_es" rows={3} />
                <Field label={lang==="es"?"Descripción (EN)":"Description (EN)"} path="dress2.desc_en" rows={3} />
                <Field label={lang==="es"?"A evitar / nota (ES)":"Avoid / note (ES)"} path="dress2.avoid_es" rows={2} />
                <Field label={lang==="es"?"A evitar / nota (EN)":"Avoid / note (EN)"} path="dress2.avoid_en" rows={2} />
              </React.Fragment>}
            </React.Fragment>
          )}

          {tab === "programa" && (
            <React.Fragment>
              {data.itinerary.map((it,i) => (
                <div key={i} style={{ padding:12, border:"1px solid var(--line)", borderRadius:6, background:"#fff" }}>
                  <div className="micro" style={{ color:"var(--ink-mute)", marginBottom:8 }}>#{i+1}</div>
                  <div style={{ display:"grid", gridTemplateColumns:"80px 1fr", gap:8 }}>
                    <Field label={lang==="es"?"Hora":"Time"} path={`itinerary.${i}.time`} />
                    <Field label={lang==="es"?"Título (ES)":"Title (ES)"} path={`itinerary.${i}.title_es`} />
                  </div>
                  <Field label={lang==="es"?"Título (EN)":"Title (EN)"} path={`itinerary.${i}.title_en`} />
                </div>
              ))}
            </React.Fragment>
          )}

          {tab === "rsvp" && (
            <React.Fragment>
              <Field label={lang==="es"?"Fecha límite (ES)":"Deadline (ES)"} path="rsvp.deadline_es" />
              <Field label={lang==="es"?"Fecha límite (EN)":"Deadline (EN)"} path="rsvp.deadline_en" />
              <Field label={lang==="es"?"URL de ReservaHub":"ReservaHub URL"} path="rsvp.reservahub_url" />
              <Field label={lang==="es"?"Slug del evento":"Event slug"} path="rsvp.event_slug" />
              <div style={{ padding:12, background:"rgba(168,184,160,.15)", border:"1px dashed var(--sage)", borderRadius:6, fontFamily:"ui-monospace, monospace", fontSize:11, color:"var(--ink-soft)", lineHeight:1.6 }}>
                <strong>POST</strong> {data.rsvp.reservahub_url}<br/>
                <span style={{ color:"var(--ink-mute)" }}>→ {lang==="es"?"Las respuestas se envían a este endpoint y se guardan localmente como backup.":"Responses are POSTed to this endpoint and saved locally as backup."}</span>
              </div>
            </React.Fragment>
          )}

          {tab === "regalos" && (
            <React.Fragment>
              <Field label={lang==="es"?"Título (ES)":"Title (ES)"} path="gifts.title_es" />
              <Field label={lang==="es"?"Título (EN)":"Title (EN)"} path="gifts.title_en" />
              <Field label={lang==="es"?"Nota (ES)":"Note (ES)"} path="gifts.note_es" rows={2} />
              <Field label={lang==="es"?"Nota (EN)":"Note (EN)"} path="gifts.note_en" rows={2} />
              {data.gifts.items.map((it,i) => (
                <div key={i} style={{ padding:12, border:"1px solid var(--line)", borderRadius:6, background:"#fff" }}>
                  <div className="micro" style={{ color:"var(--ink-mute)", marginBottom:8 }}>#{i+1}</div>
                  <Field label={lang==="es"?"Nombre":"Name"} path={`gifts.items.${i}.${it.label_es!==undefined?'label_es':'label'}`} />
                  <Field label={lang==="es"?"Código":"Code"} path={`gifts.items.${i}.code`} />
                  <Field label="URL" path={`gifts.items.${i}.url`} />
                </div>
              ))}
            </React.Fragment>
          )}

          {tab === "hospedaje" && (
            <React.Fragment>
              {data.lodging.map((h,i) => (
                <div key={i} style={{ padding:12, border:"1px solid var(--line)", borderRadius:6, background:"#fff" }}>
                  <div className="micro" style={{ color:"var(--ink-mute)", marginBottom:8 }}>#{i+1}</div>
                  <Field label={lang==="es"?"Nombre":"Name"} path={`lodging.${i}.name`} />
                  <Field label={lang==="es"?"Categoría (ES)":"Tier (ES)"} path={`lodging.${i}.tier_es`} />
                  <Field label={lang==="es"?"Tarifa (ES)":"Rate (ES)"} path={`lodging.${i}.rate_es`} />
                  <Field label={lang==="es"?"Código":"Code"} path={`lodging.${i}.code`} />
                  <Field label="URL" path={`lodging.${i}.url`} />
                </div>
              ))}
            </React.Fragment>
          )}

          {tab === "galeria" && <GalleryAdmin data={data} onChange={onChange} lang={lang} L={L} />}

          {tab === "rsvps" && <RsvpList lang={lang} L={L} reservahubUrl={data.rsvp.reservahub_url} />}
        </div>

        <div className="ft">
          <span className="save-state">
            {saveState==="saving" && L.admin_saving}
            {saveState==="saved" && <span style={{ color:"var(--sage-deep)" }}>● {L.admin_saved}</span>}
            {saveState==="unsaved" && <span style={{ color:"#a8896b" }}>● {L.admin_unsaved}</span>}
          </span>
          <button className="btn" onClick={onLogout} style={{ fontSize:10, padding:"8px 14px" }}>{L.admin_logout}</button>
          <button className="btn btn-filled" onClick={onSave} disabled={saveState==="saving"} style={{ fontSize:10, padding:"8px 14px" }}>
            {saveState==="saving" ? L.admin_saving : L.admin_save}
          </button>
        </div>
      </aside>
    </React.Fragment>
  );
}

// Login modal
function AdminLogin({ onSuccess, onClose, expected, L, lang }) {
  const [pwd, setPwd] = useStateA("");
  const [err, setErr] = useStateA(false);
  const [busy, setBusy] = useStateA(false);
  const tryLogin = async (e) => {
    e.preventDefault();
    setBusy(true);
    await new Promise(r => setTimeout(r, 450));
    if (pwd === expected) onSuccess();
    else { setErr(true); setBusy(false); }
  };
  return (
    <div className="modal-back" onClick={onClose}>
      <div className="modal" onClick={e=>e.stopPropagation()}>
        <button className="x" onClick={onClose}>✕</button>
        <div className="micro rule" style={{ marginBottom:18, color:"var(--sage-deep)" }}>{lang==="es"?"Acceso":"Access"}</div>
        <h3 className="display" style={{ margin:"0 0 6px", fontSize:32 }}>{L.admin_title}</h3>
        <p style={{ color:"var(--ink-soft)", fontSize:14, fontStyle:"italic", marginTop:0 }}>
          {lang==="es"
            ? "Sólo los novios. Introduce tu contraseña para editar el contenido."
            : "Couple only. Enter your password to edit the content."}
        </p>
        <form onSubmit={tryLogin} style={{ marginTop:24, display:"flex", flexDirection:"column", gap:18 }}>
          <div className="field">
            <label>{L.admin_pwd}</label>
            <input type="password" autoFocus value={pwd} onChange={e=>{ setPwd(e.target.value); setErr(false); }} />
          </div>
          {err && <div style={{ color:"#a55", fontSize:13 }}>{L.admin_wrong}</div>}
          <div style={{ display:"flex", gap:10, justifyContent:"flex-end" }}>
            <button className="btn btn-filled" type="submit" disabled={busy}>{busy ? "…" : L.admin_enter}</button>
          </div>
          <div className="micro" style={{ color:"var(--ink-mute)", textAlign:"center", marginTop:8 }}>
            {lang==="es"?"Pista (demo): ":"Hint (demo): "}<code style={{ fontFamily:"ui-monospace, monospace" }}>boda2027</code>
          </div>
        </form>
      </div>
    </div>
  );
}

// Responses list (reads from MockServer)
function RsvpList({ lang, L, reservahubUrl }) {
  const [items, setItems] = useStateA([]);
  const [loading, setLoading] = useStateA(true);
  useEffectA(() => {
    let alive = true;
    MockServer.listRsvps().then(r => { if (alive){ setItems(r.data || []); setLoading(false); } });
    return () => { alive = false; };
  }, []);
  if (loading) return <div className="micro" style={{ color:"var(--ink-mute)" }}>{lang==="es"?"Cargando…":"Loading…"}</div>;
  return (
    <React.Fragment>
      <div className="micro" style={{ color:"var(--ink-mute)" }}>
        {items.length} {lang==="es"?"respuestas recibidas":"responses received"}
      </div>
      <div style={{ padding:10, background:"rgba(168,184,160,.12)", border:"1px dashed var(--sage)", fontFamily:"ui-monospace, monospace", fontSize:10.5, lineHeight:1.5, color:"var(--ink-soft)", borderRadius:6 }}>
        ↳ {lang==="es"?"sincronizadas a":"synced to"}<br/>
        <span style={{ color:"var(--sage-deep)" }}>{reservahubUrl}</span>
      </div>
      {items.length === 0 ? (
        <div style={{ fontStyle:"italic", color:"var(--ink-mute)", padding:24, textAlign:"center", border:"1px dashed var(--line)" }}>
          {lang==="es"?"Aún no hay respuestas. Envía una desde la sección RSVP para probar.":"No responses yet. Submit one from the RSVP section to test."}
        </div>
      ) : items.slice().reverse().map((r,i) => (
        <div key={i} style={{ padding:14, border:"1px solid var(--line)", borderRadius:6, background:"#fff" }}>
          <div style={{ display:"flex", justifyContent:"space-between", alignItems:"baseline", marginBottom:6 }}>
            <strong style={{ fontFamily:"var(--serif)", fontSize:15, color:"var(--ink)" }}>{r.name}</strong>
            <span style={{
              fontFamily:"var(--sans)", fontSize:9, letterSpacing:".15em", textTransform:"uppercase",
              padding:"3px 8px", borderRadius:999,
              background: r.attending==="yes" ? "rgba(168,184,160,.3)" : "rgba(168,137,107,.25)",
              color: r.attending==="yes" ? "var(--sage-deep)" : "#7a6447",
            }}>{r.attending==="yes" ? (lang==="es"?"Asiste":"Yes") : (lang==="es"?"No asiste":"No")}</span>
          </div>
          <div style={{ fontSize:12, color:"var(--ink-soft)" }}>{r.email} · {r.seats} {lang==="es"?"lugares":"seats"}</div>
          {r.diet && <div style={{ fontSize:12, color:"var(--ink-soft)", marginTop:4, fontStyle:"italic" }}>· {r.diet}</div>}
          {r.song && <div style={{ fontSize:12, color:"var(--ink-soft)", marginTop:2 }}>♪ {r.song}</div>}
          {r.msg && <div style={{ fontSize:12, color:"var(--ink-soft)", marginTop:6, fontStyle:"italic", paddingTop:6, borderTop:"1px dashed var(--line)" }}>"{r.msg}"</div>}
          <div style={{ fontSize:9.5, color:"var(--ink-mute)", marginTop:8, fontFamily:"ui-monospace, monospace", letterSpacing:".1em" }}>
            {r.ref} · {new Date(r.submittedAt).toLocaleString()}
          </div>
        </div>
      ))}
    </React.Fragment>
  );
}

// Gallery admin — upload images, edit captions, reorder, add/remove
function GalleryAdmin({ data, onChange, lang, L }) {
  const fileInputRefs = useRefA({});

  const updateItem = (i, patch) => {
    const next = JSON.parse(JSON.stringify(data));
    next.gallery[i] = { ...next.gallery[i], ...patch };
    onChange(next);
  };

  const removeItem = (i) => {
    const next = JSON.parse(JSON.stringify(data));
    next.gallery.splice(i, 1);
    onChange(next);
  };

  const moveItem = (i, dir) => {
    const next = JSON.parse(JSON.stringify(data));
    const j = i + dir;
    if (j < 0 || j >= next.gallery.length) return;
    [next.gallery[i], next.gallery[j]] = [next.gallery[j], next.gallery[i]];
    onChange(next);
  };

  const addItem = () => {
    const next = JSON.parse(JSON.stringify(data));
    next.gallery.push({ ph: (lang==="es"?"Nueva foto":"New photo") + " " + (next.gallery.length+1), img:"" });
    onChange(next);
  };

  // Resize images before storing (max 1200px wide) to keep localStorage manageable
  const readFileToDataUrl = (file, maxW=1200) => new Promise((resolve, reject) => {
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
        resolve(canvas.toDataURL("image/jpeg", 0.85));
      };
      img.onerror = reject;
      img.src = reader.result;
    };
    reader.onerror = reject;
    reader.readAsDataURL(file);
  });

  const onPickFile = async (i, file) => {
    if (!file) return;
    try {
      const dataUrl = await readFileToDataUrl(file);
      updateItem(i, { img: dataUrl });
    } catch (err) {
      console.error("image read failed", err);
      alert(lang==="es" ? "No se pudo leer la imagen." : "Could not read the image.");
    }
  };

  return (
    <React.Fragment>
      <div className="micro" style={{ color:"var(--ink-mute)" }}>
        {data.gallery.length} {lang==="es"?"fotos · sube imágenes desde tu dispositivo o pega una URL":"photos · upload from your device or paste a URL"}
      </div>

      {data.gallery.map((g,i) => (
        <div key={i} style={{ padding:12, border:"1px solid var(--line)", borderRadius:6, background:"#fff", display:"grid", gridTemplateColumns:"96px 1fr", gap:12 }}>

          {/* preview */}
          <div style={{
            width:96, height:96, borderRadius:4, overflow:"hidden",
            background: g.img ? "var(--paper-2)" : "repeating-linear-gradient(135deg, var(--sage-wash) 0 8px, var(--paper-2) 8px 16px)",
            border:"1px solid var(--line)",
            display:"flex", alignItems:"center", justifyContent:"center",
            color:"var(--ink-soft)", fontSize:9, textAlign:"center",
          }}>
            {g.img ? (
              <img src={g.img} alt="" style={{ width:"100%", height:"100%", objectFit:"cover" }} />
            ) : (
              <span style={{ padding:6 }}>{lang==="es"?"Sin foto":"No photo"}</span>
            )}
          </div>

          <div style={{ display:"flex", flexDirection:"column", gap:8, minWidth:0 }}>
            <div style={{ display:"flex", justifyContent:"space-between", alignItems:"baseline" }}>
              <div className="micro" style={{ color:"var(--ink-mute)" }}>#{i+1}</div>
              <div style={{ display:"flex", gap:4 }}>
                <button onClick={()=>moveItem(i,-1)} disabled={i===0}
                  style={{ background:"transparent", border:"1px solid var(--line)", cursor:"pointer", width:22, height:22, borderRadius:4, color: i===0 ? "var(--ink-mute)" : "var(--ink-soft)", fontSize:11 }}
                  title={lang==="es"?"Subir":"Move up"}>↑</button>
                <button onClick={()=>moveItem(i,1)} disabled={i===data.gallery.length-1}
                  style={{ background:"transparent", border:"1px solid var(--line)", cursor:"pointer", width:22, height:22, borderRadius:4, color: i===data.gallery.length-1 ? "var(--ink-mute)" : "var(--ink-soft)", fontSize:11 }}
                  title={lang==="es"?"Bajar":"Move down"}>↓</button>
                <button onClick={()=>{ if (confirm(lang==="es"?"¿Eliminar esta foto?":"Delete this photo?")) removeItem(i); }}
                  style={{ background:"transparent", border:"1px solid var(--line)", cursor:"pointer", width:22, height:22, borderRadius:4, color:"#a55", fontSize:11 }}
                  title={lang==="es"?"Eliminar":"Delete"}>×</button>
              </div>
            </div>

            <div className="row" style={{ gap:4 }}>
              <label>{lang==="es"?"Pie de foto":"Caption"}</label>
              <input value={g.ph||""} onChange={e=>updateItem(i, { ph: e.target.value })} />
            </div>

            <div style={{ display:"flex", gap:6, alignItems:"center" }}>
              <input
                ref={el => fileInputRefs.current[i] = el}
                type="file" accept="image/*" style={{ display:"none" }}
                onChange={e => onPickFile(i, e.target.files?.[0])}
              />
              <button type="button"
                onClick={()=>fileInputRefs.current[i]?.click()}
                style={{
                  flex:1, appearance:"none", border:"1px solid var(--sage-deep)", background:"rgba(168,184,160,.15)",
                  color:"var(--sage-deep)", fontFamily:"var(--sans)", fontSize:10, letterSpacing:".18em",
                  textTransform:"uppercase", padding:"8px 10px", cursor:"pointer", borderRadius:4,
                }}>
                {g.img ? (lang==="es"?"Cambiar":"Replace") : (lang==="es"?"Subir":"Upload")}
              </button>
              {g.img && (
                <button type="button" onClick={()=>updateItem(i, { img:"" })}
                  style={{ appearance:"none", border:"1px solid var(--line)", background:"transparent", color:"var(--ink-soft)", fontFamily:"var(--sans)", fontSize:10, letterSpacing:".18em", textTransform:"uppercase", padding:"8px 10px", cursor:"pointer", borderRadius:4 }}>
                  {lang==="es"?"Quitar":"Clear"}
                </button>
              )}
            </div>

            <div className="row" style={{ gap:4 }}>
              <label style={{ fontSize:9 }}>{lang==="es"?"…o URL de imagen":"…or image URL"}</label>
              <input type="url" placeholder="https://…" value={g.img && g.img.startsWith("data:") ? "" : (g.img||"")}
                onChange={e=>updateItem(i, { img: e.target.value })} />
            </div>
          </div>
        </div>
      ))}

      <button onClick={addItem} type="button"
        style={{
          appearance:"none", border:"1px dashed var(--sage)", background:"transparent",
          color:"var(--sage-deep)", fontFamily:"var(--sans)", fontSize:11, letterSpacing:".22em",
          textTransform:"uppercase", padding:"16px", cursor:"pointer", borderRadius:6, marginTop:6,
        }}>
        + {lang==="es"?"Agregar foto":"Add photo"}
      </button>

      <div className="micro" style={{ color:"var(--ink-mute)", lineHeight:1.6, padding:"12px 0 0", borderTop:"1px dashed var(--line)", marginTop:6 }}>
        {lang==="es"
          ? "Las fotos se redimensionan a 1200 px y se guardan localmente. Para muchas fotos en alta resolución, usa URLs externas."
          : "Photos are resized to 1200px and stored locally. For many high-res photos, use external URLs."}
      </div>
    </React.Fragment>
  );
}

// Design admin — change palette, fonts, layout mode, watercolor density
function DesignAdmin({ tweaks, setTweak, palettes, lang }) {
  const paletteEntries = [
    { key:"sage",     name_es:"Salvia",      name_en:"Sage" },
    { key:"rose",     name_es:"Rosa polvo",  name_en:"Dusty rose" },
    { key:"bone",     name_es:"Hueso",       name_en:"Bone" },
    { key:"midnight", name_es:"Medianoche",  name_en:"Midnight" },
  ];
  const fontPairs = [
    { value:"italiana-pinyon",     name_es:"Italiana · Pinyon (actual)", name_en:"Italiana · Pinyon",      sample:"A&A" },
    { value:"cormorant-italianno", name_es:"Cormorant · Italianno",      name_en:"Cormorant · Italianno",  sample:"A&A" },
    { value:"inter-script",        name_es:"Inter · Pinyon",             name_en:"Inter · Pinyon",         sample:"A&A" },
  ];

  // detect currently-selected palette by comparing the stored array
  const selectedKey = (() => {
    const [paper, deep] = tweaks.palette || [];
    return paletteEntries.find(e => palettes[e.key].paper === paper && palettes[e.key].deep === deep)?.key || "sage";
  })();

  const pickPalette = (key) => {
    const p = palettes[key];
    setTweak("palette", [p.paper, p.deep, p.light]);
  };

  return (
    <React.Fragment>
      <div className="micro" style={{ color:"var(--sage-deep)", marginTop:4 }}>{lang==="es"?"Paleta acuarela":"Watercolor palette"}</div>
      <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr", gap:10 }}>
        {paletteEntries.map(e => {
          const p = palettes[e.key];
          const on = e.key === selectedKey;
          return (
            <button key={e.key} type="button"
              onClick={()=>pickPalette(e.key)}
              style={{
                appearance:"none", cursor:"pointer", padding:14, textAlign:"left",
                border:`1px solid ${on ? "var(--sage-deep)" : "var(--line)"}`,
                background: on ? "rgba(168,184,160,.18)" : "#fff",
                borderRadius:6,
                display:"flex", flexDirection:"column", gap:10,
              }}>
              <div style={{ display:"flex", gap:6, height:36 }}>
                <div style={{ flex:2, background:p.paper, borderRadius:3, border:"1px solid rgba(0,0,0,.08)" }}></div>
                <div style={{ flex:1, background:p.deep, borderRadius:3 }}></div>
                <div style={{ flex:1, background:p.main, borderRadius:3 }}></div>
                <div style={{ flex:1, background:p.light, borderRadius:3 }}></div>
              </div>
              <div style={{ display:"flex", justifyContent:"space-between", alignItems:"baseline" }}>
                <span style={{ fontFamily:"var(--serif)", fontSize:14, color:"var(--ink)", fontStyle:"italic" }}>
                  {lang==="es" ? e.name_es : e.name_en}
                </span>
                {on && <span className="micro" style={{ color:"var(--sage-deep)", fontSize:9 }}>● {lang==="es"?"Activa":"Active"}</span>}
              </div>
            </button>
          );
        })}
      </div>

      <div className="micro" style={{ color:"var(--sage-deep)", marginTop:14 }}>{lang==="es"?"Tipografía":"Typography"}</div>
      <div style={{ display:"flex", flexDirection:"column", gap:6 }}>
        {fontPairs.map(f => {
          const on = tweaks.fontPair === f.value;
          return (
            <button key={f.value} type="button"
              onClick={()=>setTweak("fontPair", f.value)}
              style={{
                appearance:"none", cursor:"pointer", padding:"10px 14px", textAlign:"left",
                border:`1px solid ${on ? "var(--sage-deep)" : "var(--line)"}`,
                background: on ? "rgba(168,184,160,.18)" : "#fff",
                borderRadius:6,
                display:"flex", alignItems:"center", justifyContent:"space-between", gap:12,
              }}>
              <span style={{ fontFamily:"var(--sans)", fontSize:12, color:"var(--ink)" }}>
                {lang==="es" ? f.name_es : f.name_en}
              </span>
              {on && <span className="micro" style={{ color:"var(--sage-deep)", fontSize:9 }}>● {lang==="es"?"Activa":"Active"}</span>}
            </button>
          );
        })}
      </div>

      <div className="micro" style={{ color:"var(--sage-deep)", marginTop:14 }}>{lang==="es"?"Variación de portada":"Hero variation"}</div>
      <div style={{ display:"flex", gap:8 }}>
        {[
          { v:"classic",   es:"Clásica",   en:"Classic" },
          { v:"editorial", es:"Editorial", en:"Editorial" },
        ].map(o => {
          const on = tweaks.mode === o.v;
          return (
            <button key={o.v} type="button"
              onClick={()=>setTweak("mode", o.v)}
              style={{
                flex:1, appearance:"none", cursor:"pointer", padding:"10px 14px",
                border:`1px solid ${on ? "var(--sage-deep)" : "var(--line)"}`,
                background: on ? "rgba(168,184,160,.18)" : "#fff",
                borderRadius:6,
                fontFamily:"var(--sans)", fontSize:11, letterSpacing:".18em", textTransform:"uppercase",
                color: on ? "var(--sage-deep)" : "var(--ink-soft)",
              }}>
              {lang==="es" ? o.es : o.en}
            </button>
          );
        })}
      </div>

      <div className="row" style={{ marginTop:14 }}>
        <label>{lang==="es"?"Intensidad de acuarela":"Watercolor density"} ({tweaks.watercolorIntensity})</label>
        <input type="range" min="0" max="16" step="1" value={tweaks.watercolorIntensity}
          onChange={e=>setTweak("watercolorIntensity", parseInt(e.target.value, 10))}
          style={{ width:"100%", accentColor:"var(--sage-deep)" }}
        />
      </div>

      <div className="micro" style={{ color:"var(--ink-mute)", lineHeight:1.6, padding:"12px 0 0", borderTop:"1px dashed var(--line)", marginTop:6 }}>
        {lang==="es"
          ? "Estos cambios son visuales y se guardan automáticamente."
          : "These are visual settings and save automatically."}
      </div>
    </React.Fragment>
  );
}

Object.assign(window, { AdminPanel, AdminLogin, GalleryAdmin, DesignAdmin });
