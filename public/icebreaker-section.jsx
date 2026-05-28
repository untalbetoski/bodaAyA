// icebreaker-section.jsx — overrides EventsSection to include icebreaker before ceremony
(function(){
  if (typeof EventCard === "undefined") return;

  function EventsSectionWithIcebreaker({ data, L, lang }) {
    return (
      <section className="s" id="details">
        <WatercolorStamp size={400} style={{ position:"absolute", top:"10%", right:"-10%", opacity:.4, transform:"rotate(-15deg)" }} />
        <div className="inner" style={{ display:"flex", flexDirection:"column", gap:120 }}>
          <SectionHead
            kicker={L.program_kicker}
            title={lang === "es" ? "Tres días para celebrar" : "Three days to celebrate"}
            sub={lang === "es" ? "Comenzamos con un rompe hielo en una mezcalera antes de la ceremonia." : "We begin with an icebreaker at a mezcal distillery before the ceremony."}
          />
          {data.icebreaker && <EventCard ev={data.icebreaker} side="left" lang={lang} L={L} />}
          <EventCard ev={data.ceremony} side="right" lang={lang} L={L} />
          <EventCard ev={data.reception} side="left" lang={lang} L={L} />
          {data.traditional && <EventCard ev={data.traditional} side="right" lang={lang} L={L} />}
        </div>
        <style>{`@media (max-width: 720px){ .ev-grid { grid-template-columns: 1fr !important; gap: 28px !important; } }`}</style>
      </section>
    );
  }

  try { EventsSection = EventsSectionWithIcebreaker; } catch(e) {}
  window.EventsSection = EventsSectionWithIcebreaker;
})();