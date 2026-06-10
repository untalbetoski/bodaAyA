// nahon-patch.js — keep bride parent name accent and second-day dress code consistent
(function normalizeSavedContentDetails(){
  const BRIDE_PARENTS = 'Virginia Curioca Nahón · Abel Hernández Castillo †';
  const DRESS2_DESC_ES = 'Para ellos: guayabera blanca o de color claro con pantalón negro o caqui. Para ellas: vestimenta tradicional de tehuana — huipil bordado y enagua larga.';
  const DRESS2_DESC_EN = 'Men: white or light guayabera with black or khaki trousers. Women: traditional Tehuana attire — embroidered huipil and long skirt.';

  function normalize(content){
    const next = { ...(content || {}) };
    next.parents = { ...(next.parents || {}), bride_es:BRIDE_PARENTS, bride_en:BRIDE_PARENTS };
    next.dress2 = { ...(next.dress2 || {}), desc_es:DRESS2_DESC_ES, desc_en:DRESS2_DESC_EN };
    return next;
  }

  try {
    if (window.DEFAULT_DATA) {
      window.DEFAULT_DATA = normalize(window.DEFAULT_DATA);
      DEFAULT_DATA.parents = window.DEFAULT_DATA.parents;
      DEFAULT_DATA.dress2 = window.DEFAULT_DATA.dress2;
    }
  } catch(e) {}

  if (window.MockServer && !window.MockServer.__savedContentDetailsPatched) {
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

    window.MockServer.__savedContentDetailsPatched = true;
  }
})();