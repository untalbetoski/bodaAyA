// friday-program-close.js — data-driven Friday 2:00 am program item, without DOM polling
(function fixFridayProgramSafely(){
  try {
    if (window.__AA_FRIDAY_PROGRAM_SAFE__) return;
    window.__AA_FRIDAY_PROGRAM_SAFE__ = true;

    const FRIDAY_CLOSE = {
      time: '2:00 am',
      title_es: 'Cierre con baile',
      title_en: 'Closing dance',
      icon: '❋'
    };

    function hasClosingItem(items){
      return (items || []).some(function(it){
        const haystack = [it && it.time, it && it.title_es, it && it.title_en].join(' ').toLowerCase();
        return haystack.indexOf('cierre con baile') >= 0 || haystack.indexOf('closing dance') >= 0 || haystack.indexOf('2:00 am') >= 0 || haystack.indexOf('02:00') >= 0;
      });
    }

    function normalizeItinerary(items){
      const list = Array.isArray(items) ? items.slice() : [];
      if (hasClosingItem(list)) return list;
      let insertAt = 3;
      const receptionIndex = list.findIndex(function(it){
        const text = [it && it.time, it && it.title_es, it && it.title_en].join(' ').toLowerCase();
        return text.indexOf('18:00') >= 0 || text.indexOf('cóctel') >= 0 || text.indexOf('cocktail') >= 0 || text.indexOf('recepción') >= 0 || text.indexOf('reception') >= 0;
      });
      if (receptionIndex >= 0) insertAt = receptionIndex + 1;
      list.splice(insertAt, 0, Object.assign({}, FRIDAY_CLOSE));
      return list;
    }

    function normalizeData(data){
      const next = Object.assign({}, data || {});
      next.itinerary = normalizeItinerary(next.itinerary || []);
      return next;
    }

    try {
      if (window.DEFAULT_DATA) {
        window.DEFAULT_DATA = normalizeData(window.DEFAULT_DATA);
        DEFAULT_DATA.itinerary = window.DEFAULT_DATA.itinerary;
      }
    } catch(e) {}

    if (window.MockServer && !window.MockServer.__fridayProgramSafePatched) {
      const originalGetContent = window.MockServer.getContent.bind(window.MockServer);
      const originalSaveContent = window.MockServer.saveContent.bind(window.MockServer);
      window.MockServer.getContent = async function(){
        const result = await originalGetContent();
        if (result && result.data) result.data = normalizeData(result.data);
        return result;
      };
      window.MockServer.saveContent = async function(data){
        return originalSaveContent(normalizeData(data));
      };
      window.MockServer.__fridayProgramSafePatched = true;
    }

    if (typeof React !== 'undefined' && typeof Reveal !== 'undefined' && typeof SectionHead !== 'undefined') {
      function pick(obj, key, lang){
        if (typeof pickByLang === 'function') return pickByLang(obj, key, lang);
        return (obj && (obj[key + '_' + lang] || obj[key])) || '';
      }

      function Row(props){
        const it = props.it || {};
        const lang = props.lang || 'es';
        return React.createElement(Reveal, null,
          React.createElement('div', {
            style:{ display:'grid', gridTemplateColumns:'100px 36px 1fr', alignItems:'center', padding:'22px 0', borderBottom:'1px dashed var(--line)' }
          },
            React.createElement('div', { className:'display', style:{ fontSize:24, color:'var(--ink)', letterSpacing:'.06em' } }, it.time || ''),
            React.createElement('div', { style:{ textAlign:'center', color:'var(--sage-deep)' } }, it.icon || '❋'),
            React.createElement('div', { style:{ fontSize:18, color:'var(--ink-soft)', fontStyle:'italic' } }, pick(it, 'title', lang))
          )
        );
      }

      function FixedItinerarySection(props){
        const data = normalizeData(props.data || {});
        const L = props.L || {};
        const lang = props.lang || 'es';
        const day1 = (data.itinerary || []).slice(0, 4);
        const day2 = (data.itinerary || []).slice(4);
        return React.createElement('section', { className:'s', id:'program', style:{ background:'linear-gradient(180deg, transparent, rgba(214,223,208,.25), transparent)' } },
          React.createElement('div', { className:'inner', style:{ maxWidth:820 } },
            React.createElement(SectionHead, { kicker:L.program_kicker, title:L.program_title }),
            React.createElement('div', { className:'it-grid', style:{ display:'grid', gridTemplateColumns:'1fr 1fr', gap:48 } },
              React.createElement('div', null,
                React.createElement(Reveal, null, React.createElement('div', { className:'script', style:{ fontSize:28, color:'var(--sage-deep)', marginBottom:14 } }, L.program_day1)),
                day1.map(function(it, i){ return React.createElement(Row, { key:'d1-' + i, it:it, lang:lang }); })
              ),
              React.createElement('div', null,
                React.createElement(Reveal, null, React.createElement('div', { className:'script', style:{ fontSize:28, color:'var(--sage-deep)', marginBottom:14 } }, L.program_day2)),
                day2.map(function(it, i){ return React.createElement(Row, { key:'d2-' + i, it:it, lang:lang }); })
              )
            )
          ),
          React.createElement('style', null, '@media (max-width:720px){ .it-grid{ grid-template-columns: 1fr !important; } }')
        );
      }

      try { ItinerarySection = FixedItinerarySection; } catch(e) {}
      window.ItinerarySection = FixedItinerarySection;
    }
  } catch(err) {
    console.error('[FridayProgramSafe] disabled after error:', err);
  }
})();