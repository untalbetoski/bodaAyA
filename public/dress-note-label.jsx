// dress-note-label.jsx — changes the second dress-code label from A evitar to Nota
(function installDressNoteLabel(){
  try {
    if (window.__AA_DRESS_NOTE_LABEL_V1__) return;
    window.__AA_DRESS_NOTE_LABEL_V1__ = true;

    const DAY1_SWATCHES = [
      { c:"#ffbb7c", l:"Naranja Anteado" },
      { c:"#f6d0b4", l:"Durazno" },
      { c:"#fdfd96", l:"Amarillo" },
      { c:"#fc6c85", l:"Sandía" },
      { c:"#ffb5c0", l:"Rosa" },
    ];
    const DAY2_SWATCHES = [
      { c:"#f4ede2", l:"Ivory" },
      { c:"#c5a572", l:"Khaki" },
      { c:"#e0cd95", l:"Crudo" },
      { c:"#faf0e6", l:"Lino" },
      { c:"#d3d3d3", l:"Gris" },
    ];

    function labelForNote(lang) {
      return lang === "en" ? "Note" : "Nota";
    }

    function DressCardWithCustomLabel({ d, swatches, lang, L, noteLabel }) {
      if (!d) return null;
      const badge = noteLabel || L.dress_avoid;
      return (
        <Reveal>
          <div style={{
            padding:"42px 36px 36px",
            border:"1px solid var(--line)",
            background:"rgba(255,255,255,.55)",
            height:"100%",
            display:"flex", flexDirection:"column",
            position:"relative",
          }}>
            <div className="micro" style={{ color:"var(--sage-deep)", marginBottom:14, letterSpacing:".28em" }}>
              {pickByLang(d, "day", lang)}
            </div>
            <h3 className="display" style={{ fontSize:"clamp(28px,3.2vw,40px)", margin:"0 0 6px", lineHeight:1.1, color:"var(--ink)" }}>
              {pickByLang(d, "code", lang)}
            </h3>
            <p style={{ fontSize:16, color:"var(--ink-soft)", lineHeight:1.7, fontStyle:"italic", margin:"18px 0 0" }}>
              {pickByLang(d, "desc", lang)}
            </p>
            <div style={{ marginTop:24, display:"flex", alignItems:"center", gap:14, padding:"12px 18px", border:"1px dashed var(--line)" }}>
              <span className="micro" style={{ color:"var(--sage-deep)", flexShrink:0 }}>{badge}</span>
              <span style={{ fontSize:13.5, color:"var(--ink-soft)", lineHeight:1.5 }}>
                {pickByLang(d, "avoid", lang)}
              </span>
            </div>
            <div style={{ marginTop:"auto", paddingTop:32, display:"grid", gridTemplateColumns:"repeat(5,1fr)", gap:10 }}>
              {swatches.map((sw,i) => (
                <div key={i} style={{ display:"flex", flexDirection:"column", alignItems:"center", gap:6 }}>
                  <div style={{ width:"100%", aspectRatio:"1", background:sw.c, borderRadius:"50%", boxShadow:"inset 0 -6px 14px rgba(0,0,0,.08)" }}></div>
                  <div className="micro" style={{ fontSize:8.5 }}>{sw.l}</div>
                </div>
              ))}
            </div>
          </div>
        </Reveal>
      );
    }

    function DressSectionWithNote({ data, L, lang }) {
      const hasDay2 = !!data.dress2;
      return (
        <section className="s" id="dress">
          <div className="inner">
            <SectionHead
              kicker={L.dress_kicker}
              title={hasDay2 ? (lang==="es"?"Dos códigos, dos celebraciones":"Two codes, two celebrations") : pickByLang(data.dress, "code", lang)}
              sub={hasDay2 ? (lang==="es"?"Un código distinto para cada día.":"A different dress code for each day.") : ""}
            />
            <div style={{
              display:"grid",
              gridTemplateColumns: hasDay2 ? "1fr 1fr" : "1fr",
              gap:28,
              maxWidth: hasDay2 ? 980 : 640,
              margin:"0 auto",
            }} className="dr-grid">
              <DressCardWithCustomLabel d={data.dress} swatches={DAY1_SWATCHES} lang={lang} L={L} />
              {hasDay2 && <DressCardWithCustomLabel d={data.dress2} swatches={DAY2_SWATCHES} lang={lang} L={L} noteLabel={labelForNote(lang)} />}
            </div>
          </div>
          <style>{`@media (max-width:720px){ .dr-grid{ grid-template-columns: 1fr !important; } }`}</style>
        </section>
      );
    }

    window.DressSection = DressSectionWithNote;
    try { DressSection = DressSectionWithNote; } catch(e) {}
  } catch(err) {
    console.error('[DressNoteLabel] disabled:', err);
  }
})();
