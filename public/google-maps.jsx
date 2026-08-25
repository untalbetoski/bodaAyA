// google-maps.jsx — visual palette extensions only
// Map generation now lives in /api/content and event-map-autogenerator.js.
// This file must not wrap MockServer or overwrite saved event data.
(function extendWatercolorPalettesSafely(){
  try {
    const EXTRA_PALETTES = {
      terracotta: { paper:"#fbf4ed", paper2:"#efddcf", deep:"#8b5e4a", main:"#c48770", light:"#e5b9a7", wash:"#f0d8cc" },
      lavender:   { paper:"#faf7fc", paper2:"#ece4f2", deep:"#76618a", main:"#a991b8", light:"#d6c6df", wash:"#e9deee" },
      eucalyptus: { paper:"#f8faf5", paper2:"#e4eadf", deep:"#61735e", main:"#91a58d", light:"#c5d2bf", wash:"#dce5d8" },
      blueMist:   { paper:"#f7fafc", paper2:"#e2ebf0", deep:"#5c7481", main:"#8faab8", light:"#c3d5dd", wash:"#dce8ed" },
      peach:      { paper:"#fff8f3", paper2:"#f4e3d7", deep:"#9a6b56", main:"#d29a7f", light:"#edc8b5", wash:"#f5ded2" },
      olive:      { paper:"#faf9f2", paper2:"#ebe7d6", deep:"#74704c", main:"#a6a071", light:"#d2ccaa", wash:"#e6e1ca" },
      mauve:      { paper:"#fcf7f9", paper2:"#eee1e6", deep:"#876472", main:"#b68e9c", light:"#ddc4cd", wash:"#ead8de" },
      sand:       { paper:"#fbf8f1", paper2:"#eee5d4", deep:"#806e55", main:"#b49b75", light:"#dac8a9", wash:"#e9deca" }
    };

    const paletteOptions = Object.values(EXTRA_PALETTES).map((p) => [p.paper, p.deep, p.light]);

    function mergeIntoAppPalettes(){
      try {
        if (typeof PALETTES !== 'undefined') Object.assign(PALETTES, EXTRA_PALETTES);
        return true;
      } catch(e) { return false; }
    }

    try {
      const style = document.createElement("style");
      style.textContent = `.twk-chips{flex-wrap:wrap}.twk-chip{flex:1 1 calc(25% - 6px);min-width:50px}`;
      document.head.appendChild(style);
    } catch(e) {}

    try {
      const originalUseTweaks = useTweaks;
      useTweaks = function extendedUseTweaks(defaults){
        mergeIntoAppPalettes();
        return originalUseTweaks(defaults);
      };
    } catch(e) {}

    try {
      const OriginalTweakColor = TweakColor;
      TweakColor = function ExtendedTweakColor(props){
        const label = String(props?.label || "").toLowerCase();
        const isWatercolorPalette = label.includes("paleta") || label.includes("palette");
        const options = isWatercolorPalette ? [...(props.options || []), ...paletteOptions] : props.options;
        return React.createElement(OriginalTweakColor, { ...props, options });
      };
    } catch(e) {}

    mergeIntoAppPalettes();
  } catch(e) {
    console.error('[GoogleMaps/Palettes] disabled after error:', e);
  }
})();
