// event-map-autogenerator.js — pure helpers for event Google Maps embeds from venue + address
(function autoGenerateEventMaps(){
  try {
    if (window.__AA_EVENT_MAP_AUTOGENERATOR_V2__) return;
    window.__AA_EVENT_MAP_AUTOGENERATOR_V2__ = true;

    const EVENT_KEYS = ['icebreaker','ceremony','reception','traditional'];
    const DEFAULT_QUERIES = {
      icebreaker: 'Mal de Amor, Santiago Matatlán, Oaxaca',
      ceremony: 'Templo de Santo Domingo de Guzmán, Oaxaca de Juárez, Oaxaca',
      reception: 'Cardenal Oaxaca Social Venue, Oaxaca de Juárez, Oaxaca',
      traditional: 'Oaxaca de Juárez, Oaxaca'
    };

    function clean(value){
      return String(value || '').replace(/\s+/g, ' ').trim();
    }

    function eventQuery(ev, key){
      if (!ev) return DEFAULT_QUERIES[key] || 'Oaxaca, México';
      const venue = clean(ev.venue);
      const address = clean(ev.address_es || ev.address_en || ev.address);
      const parts = [];
      if (venue) parts.push(venue);
      if (address && address.toLowerCase() !== venue.toLowerCase()) parts.push(address);
      const q = clean(parts.join(', '));
      return q || DEFAULT_QUERIES[key] || 'Oaxaca, México';
    }

    function embedUrl(query){
      return 'https://www.google.com/maps?q=' + encodeURIComponent(query) + '&output=embed';
    }

    function publicMapUrl(query){
      return 'https://www.google.com/maps/search/?api=1&query=' + encodeURIComponent(query);
    }

    function normalize(data){
      const next = { ...(data || {}) };
      EVENT_KEYS.forEach(function(key){
        if (!next[key]) return;
        const q = eventQuery(next[key], key);
        next[key] = {
          ...next[key],
          map: embedUrl(q),
          map_query: q,
          map_url: publicMapUrl(q)
        };
      });
      return next;
    }

    try {
      if (window.DEFAULT_DATA) {
        window.DEFAULT_DATA = normalize(window.DEFAULT_DATA);
        EVENT_KEYS.forEach(function(key){
          try { if (window.DEFAULT_DATA[key]) DEFAULT_DATA[key] = window.DEFAULT_DATA[key]; } catch(e) {}
        });
      }
    } catch(e) {}

    // Do not wrap MockServer here. The backend normalizes maps on save,
    // and the admin save flow must remain single-source and predictable.
    window.__AA_NORMALIZE_EVENT_MAPS__ = normalize;
  } catch(err) {
    console.error('[EventMapAutogenerator] disabled after error:', err);
  }
})();
