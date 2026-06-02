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