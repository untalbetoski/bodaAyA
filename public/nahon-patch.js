// nahon-patch.js — base defaults only; never overwrite admin saves
(function normalizeDefaultContentDetails(){
  const BRIDE_PARENTS = 'Virginia Curioca Nahón · Abel Hernández Castillo †';
  const GROOM_PARENTS = 'Mercedes Martínez Yahuaca · Mario Alberto Serrano Coronado';

  try {
    if (window.DEFAULT_DATA) {
      window.DEFAULT_DATA.parents = {
        ...(window.DEFAULT_DATA.parents || {}),
        bride_es: BRIDE_PARENTS,
        bride_en: BRIDE_PARENTS,
        groom_es: GROOM_PARENTS,
        groom_en: GROOM_PARENTS
      };
      DEFAULT_DATA.parents = window.DEFAULT_DATA.parents;
    }
  } catch(e) {}

  // Do not wrap MockServer here. Saved admin content must remain authoritative.
})();
