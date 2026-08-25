// friday-program-close.js — visual 3-day program: Ice Breaker + Friday wedding + Traditional wedding
(function showProgramDaysSafely(){
  try {
    if (window.__AA_PROGRAM_DAYS_V3__) return;
    window.__AA_PROGRAM_DAYS_V3__ = true;

    const FALLBACK_FRIDAY_CLOSE = {
      time: '2:00 am',
      title_es: 'Cierre con baile',
      title_en: 'Closing dance',
      icon: '❋'
    };

    function textOf(it){
      return [it && it.time, it && it.title_es, it && it.title_en].join(' ').toLowerCase();
    }

    function isClosingItem(it){
      const text = textOf(it);
      return text.indexOf('cierre con baile') >= 0 || text.indexOf('closing dance') >= 0 || text.indexOf('2:00 am') >= 0 || text.indexOf('02:00') >= 0;
    }

    function isTraditionalItem(it){
      const text = textOf(it);
      return text.indexOf('tradicional') >= 0 || text.indexOf('traditional') >= 0 || text.indexOf('calenda') >= 0 || text.indexOf('marmota') >= 0 || text.indexOf('comida') >= 0 || text.indexOf('mezcal') >= 0 || text.indexOf('lunch') >= 0;
    }

    function timeFromIso(iso, fallback){
      const m = String(iso || '').match(/T(\d{2}:\d{2})/);
      return m ? m[1] : (fallback || '15:00');
    }

    function buildIcebreakerItems(data){
      const ev = data && data.icebreaker;
      if (!ev) return [];
      const venue = ev.venue ? ' · ' + ev.venue : '';
      return [{
        time: timeFromIso(ev.iso, '15:00'),
        title_es: (ev.title_es || 'Rompe Hielo') + venue,
        title_en: (ev.title_en || 'Icebreaker') + venue,
        icon: '❋'
      }];
    }

    function splitProgramDays(data){
      const source = Array.isArray(data && data.itinerary) ? data.itinerary.map(function(it){ return Object.assign({}, it || {}); }) : [];
      let traditionalStart = source.findIndex(isTraditionalItem);
      if (traditionalStart < 0) traditionalStart = Math.min(4, source.length);

      const friday = source.slice(0, traditionalStart);
      const traditional = source.slice(traditionalStart);
      if (!friday.some(isClosingItem)) friday.push(Object.assign({}, FALLBACK_FRIDAY_CLOSE));

      return {
        icebreaker: buildIcebreakerItems(data || {}),
        friday: friday,
        traditional: traditional
      };
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
            style:{ display:'grid', gridTemplateColumns:'92px 32px 1fr', alignItems:'center', padding:'20px 0', borderBottom:'1px dashed var(--line)' }
          },
            React.createElement('div', { className:'display', style:{ fontSize:22, color:'var(--ink)', letterSpacing:'.06em' } }, it.time || ''),
            React.createElement('div', { style:{ textAlign:'center', color:'var(--sage-deep)' } }, it.icon || '❋'),
            React.createElement('div', { style:{ fontSize:17, color:'var(--ink-soft)', fontStyle:'italic', lineHeight:1.45 } }, pick(it, 'title', lang))
          )
        );
      }

      function DayColumn(props){
        const items = props.items || [];
        return React.createElement('div', null,
          React.createElement(Reveal, null,
            React.createElement('div', { className:'script', style:{ fontSize:26, color:'var(--sage-deep)', marginBottom:14, lineHeight:1.05 } }, props.title)
          ),
          items.map(function(it, i){ return React.createElement(Row, { key:props.id + '-' + i, it:it, lang:props.lang }); })
        );
      }

      function FixedItinerarySection(props){
        const data = props.data || {};
        const L = props.L || {};
        const lang = props.lang || 'es';
        const days = splitProgramDays(data);
        const title = lang === 'es' ? 'Cómo viviremos estos tres días' : 'How we will spend these three days';
        const day1Title = lang === 'es' ? 'Jueves 15 · Ice Breaker' : 'Thursday 15 · Icebreaker';
        const day2Title = lang === 'es' ? 'Viernes 16 · Ceremonia y Recepción' : 'Friday 16 · Ceremony & Reception';
        const day3Title = lang === 'es' ? 'Sábado 17 · Boda Tradicional' : 'Saturday 17 · Traditional Wedding';

        return React.createElement('section', { className:'s', id:'program', style:{ background:'linear-gradient(180deg, transparent, rgba(216,201,236,.18), transparent)' } },
          React.createElement('div', { className:'inner', style:{ maxWidth:1060 } },
            React.createElement(SectionHead, { kicker:L.program_kicker, title:title }),
            React.createElement('div', { className:'it-grid', style:{ display:'grid', gridTemplateColumns:'repeat(3, minmax(0, 1fr))', gap:34 } },
              React.createElement(DayColumn, { id:'icebreaker', title:day1Title, items:days.icebreaker, lang:lang }),
              React.createElement(DayColumn, { id:'friday', title:day2Title, items:days.friday, lang:lang }),
              React.createElement(DayColumn, { id:'traditional', title:day3Title, items:days.traditional, lang:lang })
            )
          ),
          React.createElement('style', null, '@media (max-width:980px){ .it-grid{ grid-template-columns: 1fr !important; gap:48px !important; } }')
        );
      }

      try { ItinerarySection = FixedItinerarySection; } catch(e) {}
      window.ItinerarySection = FixedItinerarySection;
      window.__AA_SPLIT_PROGRAM_DAYS__ = splitProgramDays;
    }
  } catch(err) {
    console.error('[ProgramDays] disabled after error:', err);
  }
})();
