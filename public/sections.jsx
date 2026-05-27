// sections.jsx — all visual section components
// Reads from props: data (content object), L (i18n strings), lang ("es"|"en")
// Each section is wrapped in <section className="s" id="…">

const { useState, useEffect, useRef, useMemo, useCallback } = React;

// helpers ────────────────────────────────────────────────────────────────
const pickByLang = (obj, key, lang) => obj?.[`${key}_${lang}`] ?? obj?.[key] ?? "";

// Reveal — fades children in on scroll, with a safety-net fallback that
// guarantees visibility even if IntersectionObserver never fires (some iframe
// contexts, headless renderers, html-to-image captures, etc.)
function Reveal({ children, delay=0, as:Tag="div", className="", ...rest }) {
  const ref = useRef(null);
  const [shown, setShown] = useState(false);
  useEffect(() => {
    const el = ref.current; if (!el) return;
    let done = false;
    // safety net: always reveal after 1.4s even if IO never fires
    const fallback = setTimeout(() => { if (!done) { done = true; setShown(true); } }, 1400 + delay);
    const io = new IntersectionObserver(([e]) => {
      if (e.isIntersecting && !done) {
        done = true;
        clearTimeout(fallback);
        setTimeout(() => setShown(true), delay);
        io.disconnect();
      }
    }, { threshold:.12 });
    io.observe(el);
    return () => { clearTimeout(fallback); io.disconnect(); };
  }, [delay]);
  return <Tag ref={ref} className={`reveal ${shown?"in":""} ${className}`} {...rest}>{children}</Tag>;
}

// Watercolor field — many SVG-blurred shapes drifting in the background ──
function WatercolorField({ density=8, hue="sage" }) {
  // generate stable positions once
  const blobs = useMemo(() => {
    const out = [];
    for (let i=0; i<density; i++){
      out.push({
        top: Math.random()*100,
        left: Math.random()*100,
        size: 180 + Math.random()*340,
        kind: (i % 3) + 1,
        drift: (i % 3) + 1,
        delay: Math.random()*-20,
        opacity: .35 + Math.random()*.3,
      });
    }
    return out;
  }, [density]);
  return (
    <div aria-hidden="true" style={{ position:"fixed", inset:0, pointerEvents:"none", zIndex:0, overflow:"hidden" }}>
      {blobs.map((b,i) => (
        <div key={i} className={`blob b${b.kind} a-drift${b.drift}`}
          style={{
            top:`${b.top}%`, left:`${b.left}%`,
            width:`${b.size}px`, height:`${b.size}px`,
            opacity:b.opacity,
            animationDelay:`${b.delay}s`,
          }}
        />
      ))}
    </div>
  );
}

// Hand-drawn-feeling watercolor stamp SVG (for section accents)
function WatercolorStamp({ size=160, style }) {
  return (
    <svg viewBox="0 0 200 200" width={size} height={size} style={{ display:"block", filter:"blur(1px)", ...style }}>
      <defs>
        <radialGradient id="wcA" cx="40%" cy="38%" r="70%">
          <stop offset="0%" stopColor="#c8d4bc" stopOpacity=".95"/>
          <stop offset="55%" stopColor="#a8b8a0" stopOpacity=".55"/>
          <stop offset="100%" stopColor="#8a9a8b" stopOpacity="0"/>
        </radialGradient>
        <radialGradient id="wcB" cx="60%" cy="60%" r="60%">
          <stop offset="0%" stopColor="#d6dfd0" stopOpacity=".9"/>
          <stop offset="100%" stopColor="#d6dfd0" stopOpacity="0"/>
        </radialGradient>
      </defs>
      <path d="M50,30 C90,10 150,20 170,60 C200,100 180,160 130,170 C70,185 20,150 25,100 C28,70 30,45 50,30 Z" fill="url(#wcA)"/>
      <ellipse cx="105" cy="100" rx="80" ry="55" fill="url(#wcB)"/>
    </svg>
  );
}

// HERO ────────────────────────────────────────────────────────────────────
function Hero({ data, L, lang, mode }) {
  return (
    <section className="s" id="home" style={{ minHeight:"100vh", display:"flex", alignItems:"center", paddingTop:140, paddingBottom:120 }}>
      {/* watercolor accent specifically for hero */}
      <WatercolorStamp size={520} style={{ position:"absolute", top:"6%", left:"-8%", opacity:.55 }} />
      <WatercolorStamp size={420} style={{ position:"absolute", bottom:"4%", right:"-6%", opacity:.5, transform:"rotate(120deg)" }} />

      <div className="inner" style={{ textAlign: mode==="editorial"?"left":"center" }}>
        <Reveal>
          <div className="micro rule" style={{ marginBottom:36 }}>{L.save_the_date}</div>
        </Reveal>

        <Reveal delay={120}>
          <div className="hero-title" style={{
            fontFamily:"var(--display)",
            fontSize: mode==="editorial" ? "clamp(80px,14vw,220px)" : "clamp(56px,10vw,140px)",
            lineHeight: mode==="editorial" ? ".85" : "1",
            letterSpacing:".01em",
            color:"var(--ink)",
          }}>
            <div>{data.couple.a}</div>
            <div className="script" style={{
              fontFamily:"var(--script)",
              fontSize: mode==="editorial" ? "clamp(60px,9vw,150px)" : "clamp(48px,8vw,110px)",
              color:"var(--sage-deep)",
              lineHeight:1,
              margin: mode==="editorial" ? "8px 0" : "12px 0",
            }}>{data.couple.and}</div>
            <div>{data.couple.b}</div>
          </div>
        </Reveal>

        <Reveal delay={280}>
          <div style={{ marginTop:48, display:"flex", flexDirection:"column", alignItems: mode==="editorial"?"flex-start":"center", gap:18 }}>
            <div className="micro">{lang==="es" ? data.tagline_es : data.tagline_en}</div>
            <div style={{
              display:"flex", gap:24, alignItems:"baseline",
              fontFamily:"var(--display)", fontSize:"clamp(20px,2.2vw,30px)",
              color:"var(--ink-soft)", letterSpacing:".26em"
            }}>
              <span>{data.date.day}</span>
              <span style={{ color:"var(--sage-deep)" }}>·</span>
              <span style={{ fontStyle:"italic", fontFamily:"var(--serif)", textTransform:"lowercase" }}>{lang==="es" ? data.date.month_es : data.date.month_en}</span>
              <span style={{ color:"var(--sage-deep)" }}>·</span>
              <span>{data.date.year}</span>
            </div>
            <div className="micro" style={{ color:"var(--ink-mute)" }}>{lang==="es" ? data.city_es : data.city_en}</div>
          </div>
        </Reveal>

        <Reveal delay={500}>
          <div style={{ marginTop:80, display:"flex", justifyContent: mode==="editorial"?"flex-start":"center" }}>
            <div style={{ width:1, height:64, background:"var(--line)", position:"relative" }}>
              <div style={{ position:"absolute", left:-3, top:0, width:7, height:7, borderRadius:"50%", background:"var(--sage-deep)", animation:"drift1 2s ease-in-out infinite" }}></div>
            </div>
          </div>
        </Reveal>
      </div>
    </section>
  );
}

// COUNTDOWN ───────────────────────────────────────────────────────────────
function Countdown({ data, L }) {
  const target = new Date(data.date.iso).getTime();
  const [now, setNow] = useState(Date.now());
  useEffect(() => { const id = setInterval(() => setNow(Date.now()), 1000); return () => clearInterval(id); }, []);
  const diff = Math.max(0, target - now);
  const d = Math.floor(diff / 86400000);
  const h = Math.floor((diff % 86400000) / 3600000);
  const m = Math.floor((diff % 3600000) / 60000);
  const sec = Math.floor((diff % 60000) / 1000);

  const Cell = ({ n, label }) => (
    <div style={{ display:"flex", flexDirection:"column", alignItems:"center", minWidth:84 }}>
      <div style={{ fontFamily:"var(--display)", fontSize:"clamp(44px,6vw,80px)", color:"var(--ink)", lineHeight:1 }}>
        {String(n).padStart(2,"0")}
      </div>
      <div className="micro" style={{ marginTop:10 }}>{label}</div>
    </div>
  );

  return (
    <section className="s" id="countdown" style={{ paddingTop:60, paddingBottom:60 }}>
      <div className="inner">
        <Reveal>
          <div style={{ display:"flex", justifyContent:"center", gap:32, flexWrap:"wrap", padding:"36px 24px", borderTop:"1px solid var(--line)", borderBottom:"1px solid var(--line)" }}>
            <Cell n={d} label={L.count_days} />
            <div style={{ alignSelf:"center", color:"var(--ink-mute)" }}>·</div>
            <Cell n={h} label={L.count_hrs} />
            <div style={{ alignSelf:"center", color:"var(--ink-mute)" }}>·</div>
            <Cell n={m} label={L.count_min} />
            <div style={{ alignSelf:"center", color:"var(--ink-mute)" }}>·</div>
            <Cell n={sec} label={L.count_sec} />
          </div>
        </Reveal>
      </div>
    </section>
  );
}

// SECTION HEADER (reusable kicker + title) ────────────────────────────────
function SectionHead({ kicker, title, sub, align="center" }){
  return (
    <Reveal>
      <div style={{ textAlign:align, marginBottom:60 }}>
        <div className="micro rule">{kicker}</div>
        <h2 className="display" style={{ fontSize:"clamp(36px,5vw,64px)", margin:"22px 0 0", lineHeight:1.05, color:"var(--ink)" }}>{title}</h2>
        {sub && <p style={{ fontSize:18, color:"var(--ink-soft)", maxWidth:560, margin:"18px auto 0", fontStyle:"italic" }}>{sub}</p>}
      </div>
    </Reveal>
  );
}

// EVENT CARD (Ceremony / Reception) ────────────────────────────────────────
function EventCard({ ev, lang, L, side="left" }) {
  const title = pickByLang(ev, "title", lang);
  const date  = pickByLang(ev, "date", lang);
  const addr  = pickByLang(ev, "address", lang);
  const note  = pickByLang(ev, "note", lang);
  const calHref = useMemo(() => {
    const start = new Date(ev === undefined ? Date.now() : (ev.iso || "2027-04-16T17:00:00-06:00"));
    const fmt = d => d.toISOString().replace(/[-:]/g,"").replace(/\.\d{3}/, "");
    const s = fmt(new Date(start.getTime()));
    const e = fmt(new Date(start.getTime() + 4*3600*1000));
    const params = new URLSearchParams({ action:"TEMPLATE", text:`${title} — Andrea & Alberto`, dates:`${s}/${e}`, details:note, location:`${ev.venue}, ${addr}` });
    return `https://www.google.com/calendar/render?${params.toString()}`;
  }, [ev, title, addr, note]);

  return (
    <Reveal>
      <div style={{
        display:"grid",
        gridTemplateColumns: side==="left" ? "1fr 1fr" : "1fr 1fr",
        gap:48,
        alignItems:"center",
      }} className="ev-grid">
        {side==="left" && (
          <div className="img-ph" style={{ aspectRatio:"4/5", borderRadius:0, position:"relative", overflow:"hidden" }}>
            <iframe title={ev.venue} src={ev.map} style={{ position:"absolute", inset:0, width:"100%", height:"100%", border:0, filter:"grayscale(.4) saturate(.6)" }} loading="lazy"></iframe>
          </div>
        )}
        <div>
          <h3 className="display" style={{ fontSize:"clamp(28px,3.4vw,44px)", margin:0, color:"var(--ink)" }}>{title}</h3>
          <div className="script" style={{ fontSize:34, color:"var(--sage-deep)", margin:"6px 0 18px" }}>{ev.venue}</div>
          <div style={{ fontSize:17, color:"var(--ink-soft)", lineHeight:1.6, marginBottom:24 }}>
            <div style={{ fontStyle:"italic" }}>{date}</div>
            <div>{addr}</div>
          </div>
          <p style={{ fontSize:14.5, color:"var(--ink-mute)", lineHeight:1.6, marginBottom:24, maxWidth:380 }}>{note}</p>
          <div style={{ display:"flex", gap:10, flexWrap:"wrap" }}>
            <a className="btn btn-sage" href={`https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(ev.venue+", "+addr)}`} target="_blank" rel="noopener">{L.open_map}</a>
            <a className="btn" href={calHref} target="_blank" rel="noopener">{L.add_calendar}</a>
          </div>
        </div>
        {side==="right" && (
          <div className="img-ph" style={{ aspectRatio:"4/5", borderRadius:0, position:"relative", overflow:"hidden" }}>
            <iframe title={ev.venue} src={ev.map} style={{ position:"absolute", inset:0, width:"100%", height:"100%", border:0, filter:"grayscale(.4) saturate(.6)" }} loading="lazy"></iframe>
          </div>
        )}
      </div>
    </Reveal>
  );
}

function EventsSection({ data, L, lang }) {
  return (
    <section className="s" id="details">
      <WatercolorStamp size={400} style={{ position:"absolute", top:"10%", right:"-10%", opacity:.4, transform:"rotate(-15deg)" }} />
      <div className="inner" style={{ display:"flex", flexDirection:"column", gap:120 }}>
        <SectionHead kicker={L.program_kicker} title={lang==="es" ? "Dos días para celebrar" : "Two days to celebrate"} sub={lang==="es" ? "Acompáñanos a este encuentro." : "Join us for these gatherings."} />
        <EventCard ev={data.ceremony} side="left" lang={lang} L={L} />
        <EventCard ev={data.reception} side="right" lang={lang} L={L} />
        {data.traditional && <EventCard ev={data.traditional} side="left" lang={lang} L={L} />}
      </div>

      <style>{`
        @media (max-width: 720px){ .ev-grid { grid-template-columns: 1fr !important; gap: 28px !important; } }
      `}</style>
    </section>
  );
}

// DRESS CODE ──────────────────────────────────────────────────────────────
const DRESS_SWATCHES_DAY1 = [
  { c:"#d6c8e0", l:"Lavanda" },
  { c:"#c8dccf", l:"Menta" },
  { c:"#c8d4e0", l:"Cielo" },
  { c:"#e0c8d4", l:"Lila" },
  { c:"#bcc8b8", l:"Salvia" },
];
const DRESS_SWATCHES_DAY2 = [
  { c:"#f4ede2", l:"Ivory" },
  { c:"#c5a572", l:"Khaki" },
  { c:"#b34f4f", l:"Granate" },
  { c:"#3a6e8a", l:"Añil" },
  { c:"#1a1a1a", l:"Negro" },
];

function DressCard({ d, swatches, lang, L }) {
  if (!d) return null;
  return (
    <Reveal>
      <div style={{
        padding:"42px 36px 36px",
        border:"1px solid var(--line)",
        background:"rgba(255,255,255,.55)",
        height:"100%",
        display:"flex", flexDirection:"column",
        position:"relative",
      }}>
        <div className="micro" style={{ color:"var(--sage-deep)", marginBottom:14, letterSpacing:".28em" }}>
          {pickByLang(d, "day", lang)}
        </div>
        <h3 className="display" style={{ fontSize:"clamp(28px,3.2vw,40px)", margin:"0 0 6px", lineHeight:1.1, color:"var(--ink)" }}>
          {pickByLang(d, "code", lang)}
        </h3>
        <p style={{ fontSize:16, color:"var(--ink-soft)", lineHeight:1.7, fontStyle:"italic", margin:"18px 0 0" }}>
          {pickByLang(d, "desc", lang)}
        </p>
        <div style={{ marginTop:24, display:"flex", alignItems:"center", gap:14, padding:"12px 18px", border:"1px dashed var(--line)" }}>
          <span className="micro" style={{ color:"var(--sage-deep)", flexShrink:0 }}>{L.dress_avoid}</span>
          <span style={{ fontSize:13.5, color:"var(--ink-soft)", lineHeight:1.5 }}>
            {pickByLang(d, "avoid", lang)}
          </span>
        </div>
        <div style={{ marginTop:"auto", paddingTop:32, display:"grid", gridTemplateColumns:"repeat(5,1fr)", gap:10 }}>
          {swatches.map((sw,i) => (
            <div key={i} style={{ display:"flex", flexDirection:"column", alignItems:"center", gap:6 }}>
              <div style={{ width:"100%", aspectRatio:"1", background:sw.c, borderRadius:"50%", boxShadow:"inset 0 -6px 14px rgba(0,0,0,.08)" }}></div>
              <div className="micro" style={{ fontSize:8.5 }}>{sw.l}</div>
            </div>
          ))}
        </div>
      </div>
    </Reveal>
  );
}

function DressSection({ data, L, lang }) {
  const hasDay2 = !!data.dress2;
  return (
    <section className="s" id="dress">
      <div className="inner">
        <SectionHead
          kicker={L.dress_kicker}
          title={hasDay2 ? (lang==="es"?"Dos códigos, dos celebraciones":"Two codes, two celebrations") : pickByLang(data.dress, "code", lang)}
          sub={hasDay2 ? (lang==="es"?"Un código distinto para cada día.":"A different dress code for each day.") : ""}
        />
        <div style={{
          display:"grid",
          gridTemplateColumns: hasDay2 ? "1fr 1fr" : "1fr",
          gap:28,
          maxWidth: hasDay2 ? 980 : 640,
          margin:"0 auto",
        }} className="dr-grid">
          <DressCard d={data.dress} swatches={DRESS_SWATCHES_DAY1} lang={lang} L={L} />
          {hasDay2 && <DressCard d={data.dress2} swatches={DRESS_SWATCHES_DAY2} lang={lang} L={L} />}
        </div>
      </div>
      <style>{`@media (max-width:720px){ .dr-grid{ grid-template-columns: 1fr !important; } }`}</style>
    </section>
  );
}

// ITINERARY ───────────────────────────────────────────────────────────────
function ItinerarySection({ data, L, lang }) {
  // split into day1/day2 by mid-point heuristic — first 3 day 1, rest day 2
  const day1 = data.itinerary.slice(0,3);
  const day2 = data.itinerary.slice(3);
  const Row = ({ it }) => (
    <Reveal>
      <div style={{ display:"grid", gridTemplateColumns:"100px 36px 1fr", alignItems:"center", padding:"22px 0", borderBottom:"1px dashed var(--line)" }}>
        <div className="display" style={{ fontSize:24, color:"var(--ink)", letterSpacing:".06em" }}>{it.time}</div>
        <div style={{ textAlign:"center", color:"var(--sage-deep)" }}>{it.icon}</div>
        <div style={{ fontSize:18, color:"var(--ink-soft)", fontStyle:"italic" }}>{pickByLang(it, "title", lang)}</div>
      </div>
    </Reveal>
  );
  return (
    <section className="s" id="program" style={{ background:"linear-gradient(180deg, transparent, rgba(214,223,208,.25), transparent)" }}>
      <div className="inner" style={{ maxWidth:820 }}>
        <SectionHead kicker={L.program_kicker} title={L.program_title} />
        <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr", gap:48 }} className="it-grid">
          <div>
            <Reveal><div className="script" style={{ fontSize:28, color:"var(--sage-deep)", marginBottom:14 }}>{L.program_day1}</div></Reveal>
            {day1.map((it,i) => <Row key={i} it={it} />)}
          </div>
          <div>
            <Reveal><div className="script" style={{ fontSize:28, color:"var(--sage-deep)", marginBottom:14 }}>{L.program_day2}</div></Reveal>
            {day2.map((it,i) => <Row key={i} it={it} />)}
          </div>
        </div>
      </div>
      <style>{`@media (max-width:720px){ .it-grid{ grid-template-columns: 1fr !important; } }`}</style>
    </section>
  );
}

// RSVP ────────────────────────────────────────────────────────────────────
function RSVPSection({ data, L, lang }) {
  const [form, setForm] = useState({ name:"", email:"", attending:"yes", seats:"1", diet:"", song:"", msg:"" });
  const [state, setState] = useState("idle"); // idle | submitting | ok | err
  const [result, setResult] = useState(null);

  const update = (k,v) => setForm(s => ({ ...s, [k]:v }));

  const submit = async (e) => {
    e.preventDefault();
    setState("submitting");
    const res = await MockServer.submitRsvp({
      ...form,
      event_slug: data.rsvp.event_slug,
      reservahub_url: data.rsvp.reservahub_url,
    });
    if (res.ok) { setResult(res); setState("ok"); }
    else setState("err");
  };

  if (state === "ok") {
    return (
      <section className="s" id="rsvp">
        <WatercolorStamp size={360} style={{ position:"absolute", top:"20%", left:"-6%", opacity:.45 }} />
        <div className="inner" style={{ maxWidth:560, textAlign:"center" }}>
          <Reveal>
            <div className="script" style={{ fontSize:64, color:"var(--sage-deep)", marginBottom:8 }}>✿</div>
            <h2 className="display" style={{ fontSize:"clamp(32px,4.5vw,52px)", margin:"0 0 16px" }}>{L.rsvp_thanks_title}</h2>
            <p style={{ fontSize:18, color:"var(--ink-soft)", lineHeight:1.6, fontStyle:"italic" }}>
              {form.attending === "yes" ? L.rsvp_thanks_yes : L.rsvp_thanks_no}
            </p>
            <div style={{ marginTop:32, padding:"14px 24px", border:"1px solid var(--line)", display:"inline-flex", gap:14, alignItems:"center" }}>
              <span className="micro">{L.rsvp_ref}</span>
              <span style={{ fontFamily:"ui-monospace, monospace", fontSize:16, color:"var(--ink)" }}>{result.ref}</span>
            </div>
            <div style={{ marginTop:24 }} className="micro">{L.rsvp_powered}</div>
          </Reveal>
        </div>
      </section>
    );
  }

  return (
    <section className="s" id="rsvp">
      <WatercolorStamp size={400} style={{ position:"absolute", top:"8%", right:"-8%", opacity:.4, transform:"rotate(40deg)" }} />
      <div className="inner" style={{ maxWidth:720 }}>
        <SectionHead kicker={L.rsvp_kicker} title={L.rsvp_title} sub={pickByLang(data.rsvp, "deadline", lang)} />
        <Reveal>
          <form onSubmit={submit} style={{ display:"grid", gridTemplateColumns:"1fr 1fr", gap:"28px 24px" }} className="rsvp-grid">
            <div className="field" style={{ gridColumn:"1 / -1" }}>
              <label>{L.rsvp_name}</label>
              <input required value={form.name} onChange={e=>update("name", e.target.value)} />
            </div>
            <div className="field">
              <label>{L.rsvp_email}</label>
              <input type="email" required value={form.email} onChange={e=>update("email", e.target.value)} />
            </div>
            <div className="field">
              <label>{L.rsvp_seats}</label>
              <select value={form.seats} onChange={e=>update("seats", e.target.value)}>
                {[1,2,3,4,5].map(n=> <option key={n} value={n}>{n}</option>)}
              </select>
            </div>

            <div className="field" style={{ gridColumn:"1 / -1" }}>
              <label>{L.rsvp_attending}</label>
              <div style={{ display:"flex", gap:14, marginTop:6 }}>
                {[
                  { v:"yes", label:L.rsvp_yes },
                  { v:"no",  label:L.rsvp_no  },
                ].map(opt => (
                  <button key={opt.v} type="button"
                    onClick={()=>update("attending", opt.v)}
                    style={{
                      flex:1, padding:"14px 16px",
                      border:`1px solid ${form.attending===opt.v?"var(--sage-deep)":"var(--line)"}`,
                      background: form.attending===opt.v ? "rgba(168,184,160,.18)" : "transparent",
                      color:"var(--ink)", fontFamily:"var(--serif)", fontSize:16, cursor:"pointer", fontStyle:"italic",
                    }}>
                    {opt.label}
                  </button>
                ))}
              </div>
            </div>

            <div className="field" style={{ gridColumn:"1 / -1" }}>
              <label>{L.rsvp_diet}</label>
              <input placeholder={L.rsvp_diet_ph} value={form.diet} onChange={e=>update("diet", e.target.value)} />
            </div>
            <div className="field" style={{ gridColumn:"1 / -1" }}>
              <label>{L.rsvp_song}</label>
              <input value={form.song} onChange={e=>update("song", e.target.value)} />
            </div>
            <div className="field" style={{ gridColumn:"1 / -1" }}>
              <label>{L.rsvp_msg}</label>
              <textarea rows="3" value={form.msg} onChange={e=>update("msg", e.target.value)}></textarea>
            </div>

            <div style={{ gridColumn:"1 / -1", display:"flex", alignItems:"center", justifyContent:"space-between", marginTop:12, flexWrap:"wrap", gap:14 }}>
              <div className="micro" style={{ color:"var(--ink-mute)" }}>
                <span style={{ display:"inline-block", width:6, height:6, borderRadius:"50%", background:"var(--sage-deep)", marginRight:8, verticalAlign:"middle" }}></span>
                {L.rsvp_powered}
              </div>
              <button className="btn btn-filled" disabled={state==="submitting"} type="submit">
                {state==="submitting" ? L.rsvp_submitting : L.rsvp_submit}
              </button>
            </div>
          </form>
        </Reveal>
      </div>
      <style>{`@media (max-width:720px){ .rsvp-grid{ grid-template-columns: 1fr !important; } }`}</style>
    </section>
  );
}

// GALLERY ─────────────────────────────────────────────────────────────────
function GallerySection({ data, L, lang }) {
  const [lb, setLb] = useState(null); // index
  const open = (i) => setLb(i);
  const close = () => setLb(null);
  const next = useCallback(() => setLb(i => (i+1) % data.gallery.length), [data.gallery.length]);
  const prev = useCallback(() => setLb(i => (i-1+data.gallery.length) % data.gallery.length), [data.gallery.length]);
  useEffect(() => {
    if (lb===null) return;
    const onKey = (e) => { if (e.key==="Escape") close(); if (e.key==="ArrowRight") next(); if (e.key==="ArrowLeft") prev(); };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [lb, next, prev]);

  const layouts = [
    { c:"span 5", r:"span 3" },
    { c:"span 4", r:"span 2" },
    { c:"span 3", r:"span 3" },
    { c:"span 4", r:"span 3" },
    { c:"span 4", r:"span 2" },
    { c:"span 4", r:"span 3" },
  ];

  return (
    <section className="s" id="gallery">
      <div className="inner">
        <SectionHead kicker={L.gallery_kicker} title={L.gallery_title} />
        <Reveal>
          <div style={{ display:"grid", gridTemplateColumns:"repeat(12, 1fr)", gridAutoRows:"120px", gap:14 }} className="gal-grid">
            {data.gallery.map((g,i) => {
              const ly = layouts[i % layouts.length];
              const hasImg = !!g.img;
              return (
                <button key={i}
                  onClick={() => open(i)}
                  className={hasImg ? "" : "img-ph"}
                  style={{
                    gridColumn:ly.c, gridRow:ly.r,
                    cursor:"pointer",
                    border:"1px solid var(--line)",
                    padding:0,
                    textAlign:"center",
                    overflow:"hidden",
                    position:"relative",
                    background: hasImg ? "var(--paper-2)" : undefined,
                    transition:"transform .4s ease, opacity .4s ease",
                  }}
                  onMouseEnter={e=>e.currentTarget.style.opacity=".82"}
                  onMouseLeave={e=>e.currentTarget.style.opacity="1"}
                >
                  {hasImg ? (
                    <img src={g.img} alt={g.ph} style={{ width:"100%", height:"100%", objectFit:"cover", display:"block" }} />
                  ) : g.ph}
                </button>
              );
            })}
          </div>
        </Reveal>
      </div>
      {lb !== null && (
        <div className="lb-back" onClick={close}>
          <button className="lb-close" onClick={close}>✕</button>
          <button className="lb-nav lb-prev" onClick={e=>{e.stopPropagation(); prev();}}>‹</button>
          {data.gallery[lb].img ? (
            <img onClick={e=>e.stopPropagation()} src={data.gallery[lb].img} alt={data.gallery[lb].ph} className="lb-img" />
          ) : (
            <div onClick={e=>e.stopPropagation()} className="img-ph lb-img" style={{ width:"min(80vw, 900px)", height:"min(80vh, 700px)", color:"#fff", background:"repeating-linear-gradient(135deg, #4a5a4c 0 14px, #2e3a30 14px 28px)", fontSize:14, display:"flex", alignItems:"center", justifyContent:"center" }}>
              {data.gallery[lb].ph}
            </div>
          )}
          <button className="lb-nav lb-next" onClick={e=>{e.stopPropagation(); next();}}>›</button>
          {data.gallery[lb].ph && <div style={{ position:"absolute", bottom:24, left:0, right:0, textAlign:"center", color:"rgba(255,255,255,.7)", fontFamily:"var(--sans)", fontSize:11, letterSpacing:".24em", textTransform:"uppercase" }}>{data.gallery[lb].ph}</div>}
        </div>
      )}
      <style>{`
        @media (max-width:720px){ .gal-grid{ grid-template-columns: repeat(6, 1fr) !important; grid-auto-rows: 90px !important; } .gal-grid > *{ grid-column: span 3 !important; grid-row: span 2 !important; } }
      `}</style>
    </section>
  );
}

// PLAYLIST ────────────────────────────────────────────────────────────────
function PlaylistSection({ data, L, lang }) {
  const [song, setSong] = useState("");
  const [artist, setArtist] = useState("");
  const [sent, setSent] = useState(false);
  const submit = async (e) => {
    e.preventDefault();
    if (!song.trim()) return;
    await MockServer.submitSong({ song, artist });
    setSent(true);
    setSong(""); setArtist("");
    setTimeout(() => setSent(false), 3000);
  };
  return (
    <section className="s" id="playlist">
      <div className="inner" style={{ maxWidth:760 }}>
        <SectionHead kicker={L.playlist_kicker} title={pickByLang(data.playlist, "title", lang)} sub={pickByLang(data.playlist, "note", lang)} />
        <Reveal>
          <form onSubmit={submit} style={{ display:"grid", gridTemplateColumns:"1fr 1fr auto", gap:16, alignItems:"end" }} className="pl-grid">
            <div className="field">
              <label>{lang==="es"?"Canción":"Song"}</label>
              <input required value={song} onChange={e=>setSong(e.target.value)} />
            </div>
            <div className="field">
              <label>{lang==="es"?"Artista":"Artist"}</label>
              <input value={artist} onChange={e=>setArtist(e.target.value)} />
            </div>
            <button className="btn btn-sage" type="submit" style={{ height:46 }}>{sent ? "♪" : L.playlist_submit}</button>
          </form>
          {sent && <div style={{ marginTop:14, color:"var(--sage-deep)", fontStyle:"italic" }}>{L.playlist_sent}</div>}
        </Reveal>

        <Reveal delay={200}>
          <div style={{ marginTop:64 }}>
            <div className="micro" style={{ marginBottom:18, color:"var(--ink-mute)" }}>{L.playlist_seed}</div>
            <ul style={{ listStyle:"none", padding:0, margin:0, display:"grid", gridTemplateColumns:"1fr 1fr", gap:"14px 32px" }} className="pl-seed">
              {data.playlist.seed.map((s,i) => (
                <li key={i} style={{ display:"flex", justifyContent:"space-between", borderBottom:"1px dotted var(--line)", paddingBottom:8 }}>
                  <span style={{ fontStyle:"italic", color:"var(--ink)" }}>{s.song}</span>
                  <span style={{ color:"var(--ink-soft)" }}>{s.artist}</span>
                </li>
              ))}
            </ul>
          </div>
        </Reveal>
      </div>
      <style>{`@media (max-width:720px){ .pl-grid{ grid-template-columns: 1fr !important; } .pl-seed{ grid-template-columns: 1fr !important; } }`}</style>
    </section>
  );
}

// GIFTS ───────────────────────────────────────────────────────────────────
function GiftsSection({ data, L, lang }) {
  return (
    <section className="s" id="gifts">
      <div className="inner" style={{ maxWidth:880 }}>
        <SectionHead kicker={L.gifts_kicker} title={pickByLang(data.gifts, "title", lang)} sub={pickByLang(data.gifts, "note", lang)} />
        <Reveal>
          <div style={{ display:"grid", gridTemplateColumns:"repeat(3, 1fr)", gap:24 }} className="g-grid">
            {data.gifts.items.map((it,i) => {
              const label = it.label_es || it.label_en ? pickByLang(it, "label", lang) : it.label;
              return (
                <div key={i} style={{ padding:"36px 24px", border:"1px solid var(--line)", textAlign:"center", background:"rgba(255,255,255,.5)", position:"relative" }}>
                  <div className="script" style={{ fontSize:34, color:"var(--sage-deep)", marginBottom:8 }}>{label}</div>
                  <div className="micro" style={{ color:"var(--ink-mute)", marginBottom:18 }}>{lang==="es"?"Código":"Code"}</div>
                  <div style={{ fontFamily:"ui-monospace, monospace", fontSize:14, color:"var(--ink)", letterSpacing:".1em", marginBottom:22 }}>{it.code}</div>
                  {it.url && <a className="btn btn-sage" href={it.url} target="_blank" rel="noopener" style={{ fontSize:10, padding:"10px 18px" }}>{L.open_link}</a>}
                </div>
              );
            })}
          </div>
        </Reveal>
      </div>
      <style>{`@media (max-width:720px){ .g-grid{ grid-template-columns: 1fr !important; } }`}</style>
    </section>
  );
}

// LODGING ─────────────────────────────────────────────────────────────────
function LodgingSection({ data, L, lang }) {
  return (
    <section className="s" id="lodging">
      <WatercolorStamp size={380} style={{ position:"absolute", bottom:"10%", left:"-8%", opacity:.45 }} />
      <div className="inner">
        <SectionHead kicker={L.lodging_kicker} title={L.lodging_title} />
        <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr 1fr", gap:24 }} className="lo-grid">
          {data.lodging.map((h,i) => (
            <Reveal key={i} delay={i*80}>
              <div style={{ padding:"32px 26px", border:"1px solid var(--line)", background:"rgba(255,255,255,.5)", height:"100%", display:"flex", flexDirection:"column" }}>
                <div className="micro" style={{ color:"var(--sage-deep)" }}>{pickByLang(h, "tier", lang)}</div>
                <h3 className="display" style={{ fontSize:24, margin:"10px 0 6px", color:"var(--ink)" }}>{h.name}</h3>
                <div style={{ fontStyle:"italic", color:"var(--ink-soft)", fontSize:15 }}>{pickByLang(h, "rate", lang)}</div>
                <div style={{ marginTop:"auto", paddingTop:24 }}>
                  <div className="micro" style={{ marginBottom:8, color:"var(--ink-mute)" }}>{L.lodging_code}</div>
                  <div style={{ fontFamily:"ui-monospace, monospace", fontSize:13, color:"var(--ink)", marginBottom:18, letterSpacing:".1em" }}>{h.code}</div>
                  <a className="btn" href={h.url} target="_blank" rel="noopener" style={{ fontSize:10, padding:"10px 18px" }}>{L.open_link}</a>
                </div>
              </div>
            </Reveal>
          ))}
        </div>
      </div>
      <style>{`@media (max-width:720px){ .lo-grid{ grid-template-columns: 1fr !important; } }`}</style>
    </section>
  );
}

// CLOSING ─────────────────────────────────────────────────────────────────
function ClosingSection({ data, L, lang }) {
  return (
    <section className="s" id="closing" style={{ paddingTop:80, paddingBottom:140 }}>
      <WatercolorStamp size={460} style={{ position:"absolute", top:"-10%", left:"50%", transform:"translateX(-50%) rotate(180deg)", opacity:.4 }} />
      <div className="inner" style={{ textAlign:"center", maxWidth:680 }}>
        <Reveal>
          <p className="display" style={{ fontSize:"clamp(24px,3vw,36px)", color:"var(--ink)", lineHeight:1.4, fontStyle:"italic", margin:0 }}>
            "{pickByLang(data.closing, "quote", lang)}"
          </p>
        </Reveal>
        <Reveal delay={200}>
          <div style={{ marginTop:60, display:"grid", gridTemplateColumns:"1fr 1fr", gap:36, maxWidth:560, margin:"60px auto 0" }} className="cl-parents">
            <div>
              <div className="micro" style={{ color:"var(--sage-deep)", marginBottom:10 }}>{lang==="es"?"Padres de la novia":"Bride's parents"}</div>
              <div style={{ fontFamily:"var(--serif)", fontSize:17, color:"var(--ink)", lineHeight:1.6, fontStyle:"italic" }}>
                {pickByLang(data.parents, "bride", lang)}
              </div>
            </div>
            <div>
              <div className="micro" style={{ color:"var(--sage-deep)", marginBottom:10 }}>{lang==="es"?"Padres del novio":"Groom's parents"}</div>
              <div style={{ fontFamily:"var(--serif)", fontSize:17, color:"var(--ink)", lineHeight:1.6, fontStyle:"italic" }}>
                {pickByLang(data.parents, "groom", lang)}
              </div>
            </div>
          </div>
          <style>{`@media (max-width:520px){ .cl-parents{ grid-template-columns: 1fr !important; gap: 24px !important; } }`}</style>
        </Reveal>
        <Reveal delay={400}>
          <div className="script" style={{ fontSize:48, color:"var(--sage-deep)", marginTop:48 }}>
            {data.couple.a} {data.couple.and} {data.couple.b}
          </div>
          <div className="micro" style={{ marginTop:14, color:"var(--ink-mute)" }}>{pickByLang(data.closing, "sign", lang)}</div>
        </Reveal>
      </div>
    </section>
  );
}

Object.assign(window, {
  Reveal, WatercolorField, WatercolorStamp,
  Hero, Countdown, EventsSection, DressSection, ItinerarySection,
  RSVPSection, GallerySection, PlaylistSection, GiftsSection, LodgingSection, ClosingSection,
  SectionHead, pickByLang,
});
