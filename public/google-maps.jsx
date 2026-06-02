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

// Extend the design panel with additional watercolor palettes without changing
// the main application file. This script loads before app.jsx, so the wrapper
// injects the extra palette definitions when App initializes.
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

  const paletteOptions = Object.values(EXTRA_PALETTES).map((p) => [p.paper, p.deep, p.light]);

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
      try { Object.assign(PALETTES, EXTRA_PALETTES); } catch(e) {}
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

  window.__WATERCOLOR_PALETTES__ = EXTRA_PALETTES;
})();