// gallery-cloud.jsx — Cloud upload override + icebreaker event patch

(function normalizeDressSwatches(){
  const style = document.createElement("style");
  style.textContent = `
    #dress .dr-grid div[style*="border-radius: 50%"],
    #dress .dr-grid div[style*="border-radius:\"50%\""] {
      width: 44px !important;
      height: 44px !important;
      max-width: 44px !important;
      min-width: 44px !important;
      aspect-ratio: 1 / 1 !important;
      margin: 0 auto !important;
      flex: 0 0 44px !important;
    }
    @media (max-width: 720px){
      #dress .dr-grid div[style*="border-radius: 50%"],
      #dress .dr-grid div[style*="border-radius:\"50%\""] {
        width: 40px !important;
        height: 40px !important;
        max-width: 40px !important;
        min-width: 40px !important;
        flex-basis: 40px !important;
      }
    }
  `;
  document.head.appendChild(style);
})();

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
  if (window.DEFAULT_DATA) {
    window.DEFAULT_DATA.icebreaker = window.DEFAULT_DATA.icebreaker || ICEBREAKER_EVENT;
  }

  if (window.MockServer && !window.MockServer.__icebreakerPatched) {
    const originalGetContent = window.MockServer.getContent.bind(window.MockServer);
    const originalSaveContent = window.MockServer.saveContent.bind(window.MockServer);

    window.MockServer.getContent = async function(){
      const result = await originalGetContent();
      if (result && result.ok) {
        const saved = result.data || {};
        result.data = {
          ...window.DEFAULT_DATA,
          ...saved,
          icebreaker: saved.icebreaker || ICEBREAKER_EVENT,
          _tweaks: saved._tweaks || window.DEFAULT_DATA._tweaks
        };
      }
      return result;
    };

    window.MockServer.saveContent = async function(data){
      const next = {
        ...window.DEFAULT_DATA,
        ...(data || {}),
        icebreaker: (data && data.icebreaker) || ICEBREAKER_EVENT
      };
      return originalSaveContent(next);
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
          <SectionHead
            kicker={L.program_kicker}
            title={lang === "es" ? "Tres días para celebrar" : "Three days to celebrate"}
            sub={lang === "es" ? "Comenzamos con un rompe hielo en una mezcalera antes de la ceremonia." : "We begin with an icebreaker at a mezcal distillery before the ceremony."}
          />
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
      const res = await fetch("/api/gallery/upload", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ filename: file.name, dataUrl }),
      });
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
      <div className="micro" style={{ color:"var(--ink-mute)", lineHeight:1.6 }}>
        {data.gallery.length} {lang === "es" ? "fotos · guardadas como URL pública" : "photos · saved as public URLs"}
      </div>
      {msg && <div style={{ padding:10, border:"1px solid var(--line)", borderRadius:6, background:"#fff", color:"var(--sage-deep)", fontSize:12 }}>{msg}</div>}
      {data.gallery.map((g,i) => (
        <div key={i} style={{ padding:12, border:"1px solid var(--line)", borderRadius:6, background:"#fff", display:"grid", gridTemplateColumns:"96px 1fr", gap:12 }}>
          <div style={{ width:96, height:96, overflow:"hidden", border:"1px solid var(--line)", display:"flex", alignItems:"center", justifyContent:"center", background:g.img ? "var(--paper-2)" : "var(--sage-wash)", color:"var(--ink-soft)", fontSize:9 }}>
            {g.img ? <img src={g.img} alt="" style={{ width:"100%", height:"100%", objectFit:"cover" }} /> : (lang === "es" ? "Sin foto" : "No photo")}
          </div>
          <div style={{ display:"flex", flexDirection:"column", gap:8 }}>
            <div style={{ display:"flex", justifyContent:"space-between" }}>
              <div className="micro" style={{ color:"var(--ink-mute)" }}>#{i+1}</div>
              <div style={{ display:"flex", gap:4 }}>
                <button onClick={()=>move(i,-1)} disabled={i===0}>↑</button>
                <button onClick={()=>move(i,1)} disabled={i===data.gallery.length-1}>↓</button>
                <button onClick={()=>{ if(confirm(lang === "es" ? "¿Eliminar esta foto?" : "Delete this photo?")) remove(i); }}>×</button>
              </div>
            </div>
            <div className="row" style={{ gap:4 }}>
              <label>{lang === "es" ? "Pie de foto" : "Caption"}</label>
              <input value={g.ph || ""} onChange={e=>update(i, { ph:e.target.value })} onBlur={()=>MockServer.saveContent(data)} />
            </div>
            <div style={{ display:"flex", gap:6 }}>
              <input ref={el => refs.current[i] = el} type="file" accept="image/*" style={{ display:"none" }} onChange={e=>upload(i, e.target.files?.[0])} />
              <button type="button" disabled={busy === i} onClick={()=>refs.current[i]?.click()} style={{ flex:1 }}>{busy === i ? (lang === "es" ? "Subiendo…" : "Uploading…") : g.img ? (lang === "es" ? "Cambiar" : "Replace") : (lang === "es" ? "Subir" : "Upload")}</button>
              {g.img && <button type="button" onClick={()=>saveUpdate(i, { img:"" })}>{lang === "es" ? "Quitar" : "Clear"}</button>}
            </div>
            <div className="row" style={{ gap:4 }}>
              <label style={{ fontSize:9 }}>{lang === "es" ? "…o URL de imagen" : "…or image URL"}</label>
              <input type="url" placeholder="https://…" value={g.img && g.img.startsWith("data:") ? "" : (g.img || "")} onChange={e=>update(i, { img:e.target.value })} onBlur={()=>MockServer.saveContent(data)} />
            </div>
          </div>
        </div>
      ))}
      <button onClick={add} type="button" style={{ padding:16, border:"1px dashed var(--sage)", background:"transparent", color:"var(--sage-deep)", cursor:"pointer" }}>+ {lang === "es" ? "Agregar foto" : "Add photo"}</button>
    </React.Fragment>
  );
}

try { GalleryAdmin = CloudGalleryAdmin; } catch(e) {}
window.GalleryAdmin = CloudGalleryAdmin;