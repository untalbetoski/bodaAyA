// icebreaker-data.jsx — adds the pre-wedding icebreaker event and migrates saved content
(function(){
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

  if (window.DEFAULT_DATA) {
    window.DEFAULT_DATA.icebreaker = window.DEFAULT_DATA.icebreaker || ICEBREAKER_EVENT;
  }

  if (window.MockServer) {
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
  }
})();