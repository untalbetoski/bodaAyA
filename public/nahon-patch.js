// nahon-patch.js — keep bride parent name accent consistent across defaults and saved content
(function fixBrideParentNameAccent(){
  const BRIDE_PARENTS = 'Virginia Curioca Nahón · Abel Hernández Castillo †';

  function normalize(content){
    const next = { ...(content || {}) };
    next.parents = { ...(next.parents || {}), bride_es:BRIDE_PARENTS, bride_en:BRIDE_PARENTS };
    return next;
  }

  try {
    if (window.DEFAULT_DATA) {
      window.DEFAULT_DATA = normalize(window.DEFAULT_DATA);
      DEFAULT_DATA.parents = window.DEFAULT_DATA.parents;
    }
  } catch(e) {}

  if (window.MockServer && !window.MockServer.__nahonAccentPatched) {
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

    window.MockServer.__nahonAccentPatched = true;
  }
})();