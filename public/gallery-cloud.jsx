// gallery-cloud.jsx — Cloud upload override + icebreaker event patch + fixed dress swatches

const FIXED_DRESS_SWATCHES_DAY1 = [
  { c:"#ffbb7c", l:"Naranja Anteado" },
  { c:"#f6d0b4", l:"Durazno" },
  { c:"#fdfd96", l:"Amarillo" },
  { c:"#fc6c85", l:"Sandía" },
  { c:"#ffb5c0", l:"Rosa" },
];

const FIXED_DRESS_SWATCHES_DAY2 = [
  { c:"#f4ede2", l:"Ivory" },
  { c:"#c5a572", l:"Khaki" },
  { c:"#e0cd95", l:"Crudo" },
  { c:"#faf0e6", l:"Lino" },
  { c:"#d3d3d3", l:"Gris" },
];

(function addFixedDressCSS(){
  const style = document.createElement("style");
  style.textContent = `
    #dress .dress-swatch-grid{display:grid;grid-template-columns:repeat(5,minmax(0,1fr));gap:10px;align-items:start;}
    #dress .dress-swatch-item{min-width:0;display:flex;flex-direction:column;align-items:center;gap:6px;}
    #dress .dress-color-dot{width:44px!important;height:44px!important;min-width:44px!important;max-width:44px!important;flex:0 0 44px!important;border-radius:50%!important;aspect-ratio:1/1!important;margin:0 auto!important;display:block!important;}
    #dress .dress-swatch-label{width:100%;text-align:center;white-space:normal;overflow-wrap:anywhere;line-height:1.15;}
    @media(max-width:720px){#dress .dress-color-dot{width:40px!important;height:40px!important;min-width:40px!important;max-width:40px!important;flex-basis:40px!important;}}
  `;
  document.head.appendChild(style);
})();

if (typeof Reveal !== "undefined" && typeof SectionHead !== "undefined") {
  function FixedDressCard({ d, swatches, lang, L }) {
    if (!d) return null;
    return (
      <Reveal>
        <div style={{padding:"42px 36px 36px",border:"1px solid var(--line)",background:"rgba(255,255,255,.55)",height:"100%",display:"flex",flexDirection:"column",position:"relative"}}>
          <div className="micro" style={{color:"var(--sage-deep)",marginBottom:14,letterSpacing:".28em"}}>{pickByLang(d,"day",lang)}</div>
          <h3 className="display" style={{fontSize:"clamp(28px,3.2vw,40px)",margin:"0 0 6px",lineHeight:1.1,color:"var(--ink)"}}>{pickByLang(d,"code",lang)}</h3>
          <p style={{fontSize:16,color:"var(--ink-soft)",lineHeight:1.7,fontStyle:"italic",margin:"18px 0 0"}}>{pickByLang(d,"desc",lang)}</p>
          <div style={{marginTop:24,display:"flex",alignItems:"center",gap:14,padding:"12px 18px",border:"1px dashed var(--line)"}}>
            <span className="micro" style={{color:"var(--sage-deep)",flexShrink:0}}>{L.dress_avoid}</span>
            <span style={{fontSize:13.5,color:"var(--ink-soft)",lineHeight:1.5}}>{pickByLang(d,"avoid",lang)}</span>
          </div>
          <div className="dress-swatch-grid" style={{marginTop:"auto",paddingTop:32}}>
            {swatches.map((sw,i)=>(
              <div key={i} className="dress-swatch-item">
                <div className="dress-color-dot" style={{background:sw.c,boxShadow:"inset 0 -6px 14px rgba(0,0,0,.08)"}}></div>
                <div className="micro dress-swatch-label" style={{fontSize:8.5}}>{sw.l}</div>
              </div>
            ))}
          </div>
        </div>
      </Reveal>
    );
  }

  function FixedDressSection({ data, L, lang }) {
    const hasDay2 = !!data.dress2;
    return (
      <section className="s" id="dress">
        <div className="inner">
          <SectionHead
            kicker={L.dress_kicker}
            title={hasDay2 ? (lang==="es"?"Dos códigos, dos celebraciones":"Two codes, two celebrations") : pickByLang(data.dress,"code",lang)}
            sub={hasDay2 ? (lang==="es"?"Un código distinto para cada día.":"A different dress code for each day.") : ""}
          />
          <div className="dr-grid" style={{display:"grid",gridTemplateColumns:hasDay2?"1fr 1fr":"1fr",gap:28,maxWidth:hasDay2?980:640,margin:"0 auto"}}>
            <FixedDressCard d={data.dress} swatches={FIXED_DRESS_SWATCHES_DAY1} lang={lang} L={L} />
            {hasDay2 && <FixedDressCard d={data.dress2} swatches={FIXED_DRESS_SWATCHES_DAY2} lang={lang} L={L} />}
          </div>
        </div>
        <style>{`@media (max-width:720px){ .dr-grid{ grid-template-columns: 1fr !important; } }`}</style>
      </section>
    );
  }

  try { DressCard = FixedDressCard; DressSection = FixedDressSection; } catch(e) {}
  window.DressSection = FixedDressSection;
}

const ICEBREAKER_EVENT = {
  title_es: "Rompe hielo",
  title_en: "Icebreaker",
  iso: "2027-04-15T15:00:00-06:00",
  date_es: "Jueves 15 de abril, 2027 · 15:00 h",
  date_en: "Thursday, April 15th 2027 · 3:00 pm",
  venue: "Mal de Amor",
  address_es: "Santiago Matatlán, Oaxaca",
  address_en: "Santiago Matatlán, Oaxaca",
  map: "https://www.openstreetmap.org/export/embed.html?bbox=-96.4100,16.8400,-96.3800,16.8700&layer=mapnik&marker=16.8550,-96.3950",
  note_es: "Tour por una mezcalera con costo de $750 MXN por persona, por si gustan acompañarnos antes de iniciar la celebración.",
  note_en: "Mezcal distillery tour with a cost of $750 MXN per person, in case you would like to join us before the celebration begins."
};

(function patchIcebreakerData(){
  if (window.DEFAULT_DATA) window.DEFAULT_DATA.icebreaker = window.DEFAULT_DATA.icebreaker || ICEBREAKER_EVENT;
  if (window.MockServer && !window.MockServer.__icebreakerPatched) {
    const originalGetContent = window.MockServer.getContent.bind(window.MockServer);
    const originalSaveContent = window.MockServer.saveContent.bind(window.MockServer);
    window.MockServer.getContent = async function(){
      const result = await originalGetContent();
      if (result && result.ok) {
        const saved = result.data || {};
        result.data = { ...window.DEFAULT_DATA, ...saved, icebreaker: saved.icebreaker || ICEBREAKER_EVENT, _tweaks: saved._tweaks || window.DEFAULT_DATA._tweaks };
      }
      return result;
    };
    window.MockServer.saveContent = async function(data){
      return originalSaveContent({ ...window.DEFAULT_DATA, ...(data || {}), icebreaker: (data && data.icebreaker) || ICEBREAKER_EVENT });
    };
    window.MockServer.__icebreakerPatched = true;
  }
})();

if (typeof EventCard !== "undefined") {
  function EventsSectionWithIcebreaker({ data, L, lang }) {
    const current = { ...data, icebreaker: data.icebreaker || ICEBREAKER_EVENT };
    return (
      <section className="s" id="details">
        <WatercolorStamp size={400} style={{ position:"absolute", top:"10%", right:"-10%", opacity:.4, transform:"rotate(-15deg)" }} />
        <div className="inner" style={{ display:"flex", flexDirection:"column", gap:120 }}>
          <SectionHead kicker={L.program_kicker} title={lang === "es" ? "Tres días para celebrar" : "Three days to celebrate"} sub={lang === "es" ? "Comenzamos con un rompe hielo en una mezcalera antes de la ceremonia." : "We begin with an icebreaker at a mezcal distillery before the ceremony."} />
          <EventCard ev={current.icebreaker} side="left" lang={lang} L={L} />
          <EventCard ev={current.ceremony} side="right" lang={lang} L={L} />
          <EventCard ev={current.reception} side="left" lang={lang} L={L} />
          {current.traditional && <EventCard ev={current.traditional} side="right" lang={lang} L={L} />}
        </div>
        <style>{`@media (max-width: 720px){ .ev-grid { grid-template-columns: 1fr !important; gap: 28px !important; } }`}</style>
      </section>
    );
  }
  try { EventsSection = EventsSectionWithIcebreaker; } catch(e) {}
  window.EventsSection = EventsSectionWithIcebreaker;
}

function CloudGalleryAdmin({ data, onChange, lang, L }) {
  const refs = React.useRef({});
  const [busy, setBusy] = React.useState(null);
  const [msg, setMsg] = React.useState("");

  const resize = (file, maxW = 1800) => new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => {
      const img = new Image();
      img.onload = () => {
        const ratio = Math.min(1, maxW / img.width);
        const canvas = document.createElement("canvas");
        canvas.width = Math.round(img.width * ratio);
        canvas.height = Math.round(img.height * ratio);
        canvas.getContext("2d").drawImage(img, 0, 0, canvas.width, canvas.height);
        resolve(canvas.toDataURL("image/jpeg", 0.88));
      };
      img.onerror = reject;
      img.src = reader.result;
    };
    reader.onerror = reject;
    reader.readAsDataURL(file);
  });

  const save = async (next, text) => {
    onChange(next);
    const r = await MockServer.saveContent(next);
    setMsg(r?.ok ? text : (lang === "es" ? "No se pudo confirmar el guardado." : "Save could not be confirmed."));
    setTimeout(() => setMsg(""), 3500);
  };

  const update = (i, patch) => {
    const next = JSON.parse(JSON.stringify(data));
    next.gallery[i] = { ...next.gallery[i], ...patch };
    onChange(next);
  };

  const saveUpdate = async (i, patch, text) => {
    const next = JSON.parse(JSON.stringify(data));
    next.gallery[i] = { ...next.gallery[i], ...patch };
    await save(next, text || (lang === "es" ? "Galería guardada." : "Gallery saved."));
  };

  const upload = async (i, file) => {
    if (!file) return;
    setBusy(i);
    setMsg(lang === "es" ? "Subiendo imagen…" : "Uploading image…");
    try {
      const dataUrl = await resize(file);
      const res = await fetch("/api/gallery/upload", { method:"POST", headers:{ "Content-Type":"application/json" }, body:JSON.stringify({ filename:file.name, dataUrl }) });
      const json = await res.json();
      if (!res.ok || !json.ok || !json.url) throw new Error(json.error || "Upload failed");
      await saveUpdate(i, { img: json.url }, lang === "es" ? "Imagen subida y guardada." : "Image uploaded and saved.");
    } catch (e) {
      console.error(e);
      setMsg("");
      alert(lang === "es" ? "No se pudo subir la imagen." : "Could not upload image.");
    } finally {
      setBusy(null);
      if (refs.current[i]) refs.current[i].value = "";
    }
  };

  const add = async () => {
    const next = JSON.parse(JSON.stringify(data));
    next.gallery.push({ ph: (lang === "es" ? "Nueva foto" : "New photo") + " " + (next.gallery.length + 1), img: "" });
    await save(next, lang === "es" ? "Foto agregada." : "Photo added.");
  };

  const remove = async (i) => {
    const next = JSON.parse(JSON.stringify(data));
    next.gallery.splice(i, 1);
    await save(next, lang === "es" ? "Foto eliminada." : "Photo removed.");
  };

  const move = async (i, dir) => {
    const next = JSON.parse(JSON.stringify(data));
    const j = i + dir;
    if (j < 0 || j >= next.gallery.length) return;
    [next.gallery[i], next.gallery[j]] = [next.gallery[j], next.gallery[i]];
    await save(next, lang === "es" ? "Orden actualizado." : "Order updated.");
  };

  return (
    <React.Fragment>
      <div className="micro" style={{ color:"var(--ink-mute)", lineHeight:1.6 }}>{data.gallery.length} {lang === "es" ? "fotos · guardadas como URL pública" : "photos · saved as public URLs"}</div>
      {msg && <div style={{ padding:10, border:"1px solid var(--line)", borderRadius:6, background:"#fff", color:"var(--sage-deep)", fontSize:12 }}>{msg}</div>}
      {data.gallery.map((g,i) => (
        <div key={i} style={{ padding:12, border:"1px solid var(--line)", borderRadius:6, background:"#fff", display:"grid", gridTemplateColumns:"96px 1fr", gap:12 }}>
          <div style={{ width:96, height:96, overflow:"hidden", border:"1px solid var(--line)", display:"flex", alignItems:"center", justifyContent:"center", background:g.img ? "var(--paper-2)" : "var(--sage-wash)", color:"var(--ink-soft)", fontSize:9 }}>{g.img ? <img src={g.img} alt="" style={{ width:"100%", height:"100%", objectFit:"cover" }} /> : (lang === "es" ? "Sin foto" : "No photo")}</div>
          <div style={{ display:"flex", flexDirection:"column", gap:8 }}>
            <div style={{ display:"flex", justifyContent:"space-between" }}><div className="micro" style={{ color:"var(--ink-mute)" }}>#{i+1}</div><div style={{ display:"flex", gap:4 }}><button onClick={()=>move(i,-1)} disabled={i===0}>↑</button><button onClick={()=>move(i,1)} disabled={i===data.gallery.length-1}>↓</button><button onClick={()=>{ if(confirm(lang === "es" ? "¿Eliminar esta foto?" : "Delete this photo?")) remove(i); }}>×</button></div></div>
            <div className="row" style={{ gap:4 }}><label>{lang === "es" ? "Pie de foto" : "Caption"}</label><input value={g.ph || ""} onChange={e=>update(i, { ph:e.target.value })} onBlur={()=>MockServer.saveContent(data)} /></div>
            <div style={{ display:"flex", gap:6 }}><input ref={el => refs.current[i] = el} type="file" accept="image/*" style={{ display:"none" }} onChange={e=>upload(i, e.target.files?.[0])} /><button type="button" disabled={busy === i} onClick={()=>refs.current[i]?.click()} style={{ flex:1 }}>{busy === i ? (lang === "es" ? "Subiendo…" : "Uploading…") : g.img ? (lang === "es" ? "Cambiar" : "Replace") : (lang === "es" ? "Subir" : "Upload")}</button>{g.img && <button type="button" onClick={()=>saveUpdate(i, { img:"" })}>{lang === "es" ? "Quitar" : "Clear"}</button>}</div>
            <div className="row" style={{ gap:4 }}><label style={{ fontSize:9 }}>{lang === "es" ? "…o URL de imagen" : "…or image URL"}</label><input type="url" placeholder="https://…" value={g.img && g.img.startsWith("data:") ? "" : (g.img || "")} onChange={e=>update(i, { img:e.target.value })} onBlur={()=>MockServer.saveContent(data)} /></div>
          </div>
        </div>
      ))}
      <button onClick={add} type="button" style={{ padding:16, border:"1px dashed var(--sage)", background:"transparent", color:"var(--sage-deep)", cursor:"pointer" }}>+ {lang === "es" ? "Agregar foto" : "Add photo"}</button>
    </React.Fragment>
  );
}

try { GalleryAdmin = CloudGalleryAdmin; } catch(e) {}
window.GalleryAdmin = CloudGalleryAdmin;

if (typeof AdminPanel !== "undefined" && !window.__icebreakerAdminWrapped) {
  const BaseAdminPanel = AdminPanel;

  function IcebreakerAdminEditor({ open, data, onChange, onSave, lang }) {
    const [show, setShow] = React.useState(false);

    React.useEffect(() => {
      if (!open) { setShow(false); return; }
      const id = setInterval(() => {
        const active = document.querySelector(".admin-panel .tabs button.on");
        const txt = (active?.textContent || "").toLowerCase();
        setShow(txt.includes("eventos") || txt.includes("events"));
      }, 200);
      return () => clearInterval(id);
    }, [open]);

    if (!open || !show) return null;

    const ice = data.icebreaker || ICEBREAKER_EVENT;
    const updateIce = (key, value) => {
      const next = JSON.parse(JSON.stringify(data));
      next.icebreaker = { ...(next.icebreaker || ICEBREAKER_EVENT), [key]: value };
      onChange(next);
    };

    const Field = ({ label, k, rows }) => (
      <div className="row">
        <label>{label}</label>
        {rows ? (
          <textarea rows={rows} value={ice[k] || ""} onChange={e => updateIce(k, e.target.value)} />
        ) : (
          <input value={ice[k] || ""} onChange={e => updateIce(k, e.target.value)} />
        )}
      </div>
    );

    return (
      <div style={{
        position:"fixed",
        right:12,
        bottom:74,
        width:396,
        maxWidth:"calc(100vw - 24px)",
        maxHeight:"52vh",
        overflowY:"auto",
        zIndex:360,
        padding:14,
        border:"1px solid var(--line)",
        borderRadius:10,
        background:"rgba(255,253,248,.97)",
        boxShadow:"0 18px 50px -24px rgba(0,0,0,.35)",
        display:"flex",
        flexDirection:"column",
        gap:10,
      }}>
        <div className="micro" style={{ color:"var(--sage-deep)", marginBottom:2 }}>
          {lang === "es" ? "Eventos · Rompe hielo" : "Events · Icebreaker"}
        </div>
        <div style={{ fontSize:12.5, color:"var(--ink-mute)", lineHeight:1.45 }}>
          {lang === "es" ? "Edita aquí el evento que aparece antes de la ceremonia." : "Edit here the event shown before the ceremony."}
        </div>
        <Field label={lang === "es" ? "Título (ES)" : "Title (ES)"} k="title_es" />
        <Field label={lang === "es" ? "Título (EN)" : "Title (EN)"} k="title_en" />
        <Field label={lang === "es" ? "Lugar" : "Venue"} k="venue" />
        <Field label={lang === "es" ? "Dirección (ES)" : "Address (ES)"} k="address_es" />
        <Field label={lang === "es" ? "Dirección (EN)" : "Address (EN)"} k="address_en" />
        <Field label={lang === "es" ? "Fecha (ES)" : "Date (ES)"} k="date_es" />
        <Field label={lang === "es" ? "Fecha (EN)" : "Date (EN)"} k="date_en" />
        <Field label={lang === "es" ? "Fecha ISO" : "ISO Date"} k="iso" />
        <Field label={lang === "es" ? "Mapa embed" : "Map embed"} k="map" />
        <Field label={lang === "es" ? "Nota (ES)" : "Note (ES)"} k="note_es" rows={2} />
        <Field label={lang === "es" ? "Nota (EN)" : "Note (EN)"} k="note_en" rows={2} />
        <button className="btn btn-filled" type="button" onClick={onSave} style={{ marginTop:4 }}>
          {lang === "es" ? "Guardar rompe hielo" : "Save icebreaker"}
        </button>
      </div>
    );
  }

  function AdminPanelWithIcebreaker(props) {
    return (
      <React.Fragment>
        <BaseAdminPanel {...props} />
        <IcebreakerAdminEditor {...props} />
      </React.Fragment>
    );
  }

  try { AdminPanel = AdminPanelWithIcebreaker; } catch(e) {}
  window.AdminPanel = AdminPanelWithIcebreaker;
  window.__icebreakerAdminWrapped = true;
}
