// google-maps.jsx — normalize embedded event maps to Google Maps
(function useGoogleMapsForEvents(){
  const GOOGLE_MAPS = {
    icebreaker: "https://www.google.com/maps?q=Mal+de+Amor,+Santiago+Matatl%C3%A1n,+Oaxaca&output=embed",
    ceremony: "https://www.google.com/maps?q=Templo+de+Santo+Domingo+de+Guzm%C3%A1n,+Oaxaca+de+Ju%C3%A1rez,+Oaxaca&output=embed",
    reception: "https://www.google.com/maps?q=Cardenal+Oaxaca+Social+Venue,+Oaxaca+de+Ju%C3%A1rez,+Oaxaca&output=embed",
    traditional: "https://www.google.com/maps?q=Oaxaca+de+Ju%C3%A1rez,+Oaxaca&output=embed",
  };

  function normalize(content){
    const next = { ...(content || {}) };
    if (next.icebreaker) next.icebreaker = { ...next.icebreaker, map:GOOGLE_MAPS.icebreaker };
    if (next.ceremony) next.ceremony = { ...next.ceremony, map:GOOGLE_MAPS.ceremony };
    if (next.reception) next.reception = { ...next.reception, map:GOOGLE_MAPS.reception };
    if (next.traditional) next.traditional = { ...next.traditional, map:GOOGLE_MAPS.traditional };
    return next;
  }

  if (window.DEFAULT_DATA) {
    window.DEFAULT_DATA = normalize(window.DEFAULT_DATA);
    try { DEFAULT_DATA.icebreaker = window.DEFAULT_DATA.icebreaker; } catch(e) {}
    try { DEFAULT_DATA.ceremony = window.DEFAULT_DATA.ceremony; } catch(e) {}
    try { DEFAULT_DATA.reception = window.DEFAULT_DATA.reception; } catch(e) {}
    try { DEFAULT_DATA.traditional = window.DEFAULT_DATA.traditional; } catch(e) {}
  }

  if (window.ICEBREAKER_EVENT) {
    window.ICEBREAKER_EVENT.map = GOOGLE_MAPS.icebreaker;
  }

  if (window.MockServer && !window.MockServer.__googleMapsPatched) {
    const originalGetContent = window.MockServer.getContent.bind(window.MockServer);
    const originalSaveContent = window.MockServer.saveContent.bind(window.MockServer);

    window.MockServer.getContent = async function(){
      const result = await originalGetContent();
      if (result && result.data) result.data = normalize(result.data);
      return result;
    };

    window.MockServer.saveContent = async function(data){
      return originalSaveContent(normalize(data));
    };

    window.MockServer.__googleMapsPatched = true;
  }

  window.__GOOGLE_MAPS_EVENTS__ = GOOGLE_MAPS;
})();

// Extend both design controls with additional watercolor palettes.
(function extendWatercolorPalettes(){
  const EXTRA_PALETTES = {
    terracotta: {
      paper:"#fbf4ed", paper2:"#efddcf", deep:"#8b5e4a",
      main:"#c48770", light:"#e5b9a7", wash:"#f0d8cc"
    },
    lavender: {
      paper:"#faf7fc", paper2:"#ece4f2", deep:"#76618a",
      main:"#a991b8", light:"#d6c6df", wash:"#e9deee"
    },
    eucalyptus: {
      paper:"#f8faf5", paper2:"#e4eadf", deep:"#61735e",
      main:"#91a58d", light:"#c5d2bf", wash:"#dce5d8"
    },
    blueMist: {
      paper:"#f7fafc", paper2:"#e2ebf0", deep:"#5c7481",
      main:"#8faab8", light:"#c3d5dd", wash:"#dce8ed"
    },
    peach: {
      paper:"#fff8f3", paper2:"#f4e3d7", deep:"#9a6b56",
      main:"#d29a7f", light:"#edc8b5", wash:"#f5ded2"
    },
    olive: {
      paper:"#faf9f2", paper2:"#ebe7d6", deep:"#74704c",
      main:"#a6a071", light:"#d2ccaa", wash:"#e6e1ca"
    },
    mauve: {
      paper:"#fcf7f9", paper2:"#eee1e6", deep:"#876472",
      main:"#b68e9c", light:"#ddc4cd", wash:"#ead8de"
    },
    sand: {
      paper:"#fbf8f1", paper2:"#eee5d4", deep:"#806e55",
      main:"#b49b75", light:"#dac8a9", wash:"#e9deca"
    }
  };

  const EXTRA_ENTRIES = [
    { key:"terracotta", name_es:"Terracota",    name_en:"Terracotta" },
    { key:"lavender",   name_es:"Lavanda",      name_en:"Lavender" },
    { key:"eucalyptus", name_es:"Eucalipto",    name_en:"Eucalyptus" },
    { key:"blueMist",   name_es:"Azul niebla",  name_en:"Blue mist" },
    { key:"peach",      name_es:"Durazno",      name_en:"Peach" },
    { key:"olive",      name_es:"Oliva",        name_en:"Olive" },
    { key:"mauve",      name_es:"Malva",        name_en:"Mauve" },
    { key:"sand",       name_es:"Arena",        name_en:"Sand" },
  ];

  const paletteOptions = Object.values(EXTRA_PALETTES).map((p) => [p.paper, p.deep, p.light]);

  function mergeIntoAppPalettes(){
    try {
      Object.assign(PALETTES, EXTRA_PALETTES);
      return true;
    } catch(e) {
      return false;
    }
  }

  try {
    const style = document.createElement("style");
    style.textContent = `
      .twk-chips{flex-wrap:wrap}
      .twk-chip{flex:1 1 calc(25% - 6px);min-width:50px}
    `;
    document.head.appendChild(style);
  } catch(e) {}

  try {
    const originalUseTweaks = useTweaks;
    useTweaks = function extendedUseTweaks(defaults){
      mergeIntoAppPalettes();
      return originalUseTweaks(defaults);
    };
  } catch(e) {
    console.error("[WatercolorPalettes] useTweaks extension failed:", e);
  }

  try {
    const OriginalTweakColor = TweakColor;
    TweakColor = function ExtendedTweakColor(props){
      const label = String(props?.label || "").toLowerCase();
      const isWatercolorPalette = label.includes("paleta") || label.includes("palette");
      const options = isWatercolorPalette
        ? [...(props.options || []), ...paletteOptions]
        : props.options;
      return React.createElement(OriginalTweakColor, { ...props, options });
    };
  } catch(e) {
    console.error("[WatercolorPalettes] color control extension failed:", e);
  }

  // The visible administration panel has its own palette grid. Extend that
  // component as well so the new options appear under Administration → Diseño.
  try {
    const OriginalDesignAdmin = DesignAdmin;
    DesignAdmin = function ExtendedDesignAdmin(props){
      const { tweaks, setTweak, palettes, lang } = props;
      const allPalettes = { ...(palettes || {}), ...EXTRA_PALETTES };
      const [paper, deep] = tweaks?.palette || [];
      const selectedKey = EXTRA_ENTRIES.find((e) => {
        const p = allPalettes[e.key];
        return p.paper === paper && p.deep === deep;
      })?.key;

      const pickExtraPalette = (key) => {
        mergeIntoAppPalettes();
        const p = allPalettes[key];
        try { if (typeof applyPalette === "function") applyPalette(p); } catch(e) {}
        setTweak("palette", [p.paper, p.deep, p.light]);
      };

      return (
        <React.Fragment>
          <div className="micro" style={{ color:"var(--sage-deep)", marginTop:4 }}>
            {lang === "es" ? "Paletas adicionales" : "Additional palettes"}
          </div>
          <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr", gap:10 }}>
            {EXTRA_ENTRIES.map((entry) => {
              const p = allPalettes[entry.key];
              const on = entry.key === selectedKey;
              return (
                <button key={entry.key} type="button"
                  onClick={() => pickExtraPalette(entry.key)}
                  style={{
                    appearance:"none", cursor:"pointer", padding:14, textAlign:"left",
                    border:`1px solid ${on ? "var(--sage-deep)" : "var(--line)"}`,
                    background:on ? "rgba(168,184,160,.18)" : "#fff",
                    borderRadius:6, display:"flex", flexDirection:"column", gap:10,
                  }}>
                  <div style={{ display:"flex", gap:6, height:36 }}>
                    <div style={{ flex:2, background:p.paper, borderRadius:3, border:"1px solid rgba(0,0,0,.08)" }}></div>
                    <div style={{ flex:1, background:p.deep, borderRadius:3 }}></div>
                    <div style={{ flex:1, background:p.main, borderRadius:3 }}></div>
                    <div style={{ flex:1, background:p.light, borderRadius:3 }}></div>
                  </div>
                  <div style={{ display:"flex", justifyContent:"space-between", alignItems:"baseline" }}>
                    <span style={{ fontFamily:"var(--serif)", fontSize:14, color:"var(--ink)", fontStyle:"italic" }}>
                      {lang === "es" ? entry.name_es : entry.name_en}
                    </span>
                    {on && <span className="micro" style={{ color:"var(--sage-deep)", fontSize:9 }}>● {lang === "es" ? "Activa" : "Active"}</span>}
                  </div>
                </button>
              );
            })}
          </div>
          <OriginalDesignAdmin {...props} palettes={allPalettes} />
        </React.Fragment>
      );
    };
    window.DesignAdmin = DesignAdmin;
  } catch(e) {
    console.error("[WatercolorPalettes] admin design extension failed:", e);
  }

  Promise.resolve().then(mergeIntoAppPalettes);
  setTimeout(mergeIntoAppPalettes, 0);
  setTimeout(mergeIntoAppPalettes, 500);
  window.__WATERCOLOR_PALETTES__ = EXTRA_PALETTES;
})();