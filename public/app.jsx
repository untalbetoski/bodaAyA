// app.jsx — root app

const { useState: useStateApp, useEffect: useEffectApp, useMemo: useMemoApp, useCallback: useCallbackApp, useRef: useRefApp } = React;

const TWEAK_DEFAULTS = /*EDITMODE-BEGIN*/{
  "mode": "classic",
  "palette": ["#faf6ee", "#7b684b", "#dcc7a2"],
  "fontPair": "italiana-pinyon",
  "watercolorIntensity": 8,
  "showFAB": true
}/*EDITMODE-END*/;

const PALETTES = {
  sage:   { paper:"#faf6ee", paper2:"#efe3cf", deep:"#7b684b", main:"#b79a6f", light:"#dcc7a2", wash:"#eadcc6" },
  rose:   { paper:"#faf6f4", paper2:"#f0e6e2", deep:"#8c5a5e", main:"#c08a8e", light:"#e0c4c6", wash:"#ecd6d8" },
  bone:   { paper:"#faf6ee", paper2:"#efe3cf", deep:"#7b684b", main:"#b79a6f", light:"#dcc7a2", wash:"#eadcc6" },
  midnight:{ paper:"#f1f2f5", paper2:"#dde0e6", deep:"#3c4860", main:"#6c7a98", light:"#a8b4c8", wash:"#c8d0e0" },
};

function paletteFromTweak(palette){
  const [paper, deep, light] = palette || [];
  const found = Object.values(PALETTES).find(p => p.paper === paper && p.deep === deep);
  if (found) return found;
  return {
    paper: paper || PALETTES.sage.paper,
    paper2: PALETTES.sage.paper2,
    deep: deep || PALETTES.sage.deep,
    main: deep || PALETTES.sage.main,
    light: light || PALETTES.sage.light,
    wash: light || PALETTES.sage.wash,
  };
}

function applyPalette(p){
  const r = document.documentElement.style;
  r.setProperty("--paper", p.paper);
  r.setProperty("--paper-2", p.paper2);
  r.setProperty("--sage-deep", p.deep);
  r.setProperty("--sage", p.main);
  r.setProperty("--sage-light", p.light);
  r.setProperty("--sage-wash", p.wash);
  r.setProperty("--accent", p.main);
}

function applyFontPair(pair) {
  const r = document.documentElement.style;
  if (pair === "italiana-pinyon") {
    r.setProperty("--display", '"Italiana", serif');
    r.setProperty("--script", '"Pinyon Script", cursive');
    r.setProperty("--serif", '"Cormorant Garamond", serif');
  } else if (pair === "cormorant-italianno") {
    r.setProperty("--display", '"Cormorant Garamond", serif');
    r.setProperty("--script", '"Italianno", cursive');
    r.setProperty("--serif", '"Cormorant Garamond", serif');
  } else if (pair === "inter-script") {
    r.setProperty("--display", '"Inter", sans-serif');
    r.setProperty("--script", '"Pinyon Script", cursive');
    r.setProperty("--serif", '"Cormorant Garamond", serif');
  }
}

function applyDesignTweaks(tweaks = {}) {
  const merged = { ...TWEAK_DEFAULTS, ...(tweaks || {}) };
  applyPalette(paletteFromTweak(merged.palette));
  applyFontPair(merged.fontPair);
  document.body.setAttribute("data-mode", merged.mode || "classic");
}

(function(){
  const link = document.createElement("link");
  link.rel = "stylesheet";
  link.href = "https://fonts.googleapis.com/css2?family=Italianno&display=swap";
  document.head.appendChild(link);
})();

function WelcomeMessage({ lang, data }) {
  const w = {
    title_es: "Bienvenidos", title_en: "Welcome",
    subtitle_es: "Gracias por formar parte de nuestra historia y de este nuevo comienzo.",
    subtitle_en: "Thank you for being part of our story and this new beginning.",
    aside_label: "Andrea & Alberto",
    aside_title_es: "Oaxaca nos espera", aside_title_en: "Oaxaca awaits us",
    aside_date_es: "15, 16 y 17 de abril 2027", aside_date_en: "April 15, 16 & 17, 2027",
    aside_place_es: "Oaxaca, México", aside_place_en: "Oaxaca, Mexico",
    greeting_es: "Querida familia y queridos amigos:", greeting_en: "Dear family and friends:",
    body_es: "Si hoy están aquí, es porque de alguna manera han formado parte de nuestra historia. Algunos nos vieron crecer, otros caminaron junto a nosotros en momentos importantes, y muchos llegaron para recordarnos que las mejores cosas de la vida siempre se construyen en compañía.\n\nEl 16 de abril de 2027, en la maravillosa ciudad de Oaxaca, celebraremos el inicio de una nueva etapa. Más que una boda, será un encuentro de personas que amamos profundamente, un día para agradecer, abrazar, reír, recordar y crear nuevos recuerdos que permanecerán con nosotros para siempre.\n\nCreemos que el amor no une únicamente a dos personas; también entrelaza familias, fortalece amistades y nos recuerda que la verdadera riqueza de la vida está en quienes caminan a nuestro lado. Por eso, su presencia es el regalo más valioso que podríamos recibir.\n\nCada palabra de aliento, cada abrazo, cada sonrisa y cada momento compartido han contribuido, de una u otra forma, a llevarnos hasta este día. Gracias por acompañarnos en nuestro pasado, por estar presentes en este momento tan especial y por ser parte del futuro que comenzamos a escribir juntos.\n\nDeseamos que disfruten cada instante de esta celebración tanto como nosotros hemos disfrutado imaginarla y prepararla. Queremos que Oaxaca, con su historia, su cultura y su calidez, sea el escenario perfecto para reunir a quienes ocupan un lugar especial en nuestro corazón.\n\nGracias por recorrer este camino con nosotros. Que esta celebración esté llena de alegría, amor, esperanza y gratitud, y que cada momento vivido nos recuerde que los mejores recuerdos siempre nacen cuando compartimos la vida con las personas que más queremos.",
    body_en: "If you are here today, it is because in one way or another you have been part of our story. Some of you watched us grow, others walked beside us through important moments, and many came into our lives to remind us that the best things in life are always built together.\n\nOn April 16, 2027, in the wonderful city of Oaxaca, we will celebrate the beginning of a new chapter. More than a wedding, it will be a gathering of people we deeply love—a day to give thanks, embrace, laugh, remember, and create new memories that will stay with us forever.\n\nWe believe that love does not unite only two people; it also weaves families together, strengthens friendships, and reminds us that life's true richness lies in those who walk beside us. That is why your presence is the most precious gift we could receive.\n\nEvery word of encouragement, every embrace, every smile, and every shared moment has contributed, in one way or another, to bringing us to this day. Thank you for being part of our past, for being present in this very special moment, and for being part of the future we are beginning to write together.\n\nWe hope you enjoy every moment of this celebration as much as we have enjoyed imagining and preparing it. We want Oaxaca, with its history, culture, and warmth, to be the perfect setting to bring together those who hold a special place in our hearts.\n\nThank you for walking this journey with us. May this celebration be filled with joy, love, hope, and gratitude, and may every moment remind us that the best memories are always born when we share life with the people we love most.",
    sign_label_es: "Con todo nuestro cariño", sign_label_en: "With all our love",
    signature: "Andrea & Alberto",
    ...((data && data.welcome) || {})
  };
  const pick = (key) => w[key + "_" + lang] || w[key + "_es"] || "";
  return (
    <section className="s" id="welcome">
      <div className="inner">
        <div className="aa-section-head reveal in">
          <h2 className="aa-welcome-title display">{pick("title")}</h2>
          <p className="aa-section-sub">{pick("subtitle")}</p>
        </div>
        <div className="aa-welcome-editorial reveal in">
          <aside className="aa-welcome-aside">
            <div className="aa-small-label">{w.aside_label}</div>
            <div className="aa-side-script">{pick("aside_title")}</div>
            <div className="aa-date-line">{pick("aside_date")}<br/>{pick("aside_place")}</div>
          </aside>
          <article>
            <div className="aa-welcome-copy">
              <p>{pick("greeting")}</p>
              {String(pick("body")).split(/\n\s*\n/).filter(Boolean).map((p,i)=><p key={i}>{p}</p>)}
            </div>
            <div className="aa-welcome-signature">
              <div className="aa-with-love">{pick("sign_label")}</div>
              <div className="aa-names">{w.signature}</div>
            </div>
          </article>
        </div>
      </div>
    </section>
  );
}

function SiteFooter({ lang, openAdmin, data }) {
  return (
    <footer className="site-footer">
      <div className="inner">
        <div>
          <div className="brand">{data.couple.a} &amp; {data.couple.b}</div>
          <div className="meta" style={{ marginTop:6 }}>
            {data.date.day} · {lang==="es" ? data.date.month_es : data.date.month_en} · {data.date.year} · {lang==="es" ? data.city_es : data.city_en}
          </div>
        </div>
        <div style={{ display:"flex", gap:14, alignItems:"center" }}>
          <span className="meta">{lang==="es" ? "Con amor" : "With love"} ·</span>
          <button className="admin-link" onClick={openAdmin} title={lang==="es"?"Sólo los novios":"Couple only"}>
            <svg width="10" height="10" viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.5">
              <rect x="3" y="7" width="10" height="7" rx="1"/>
              <path d="M5 7V5a3 3 0 0 1 6 0v2"/>
            </svg>
            {lang==="es" ? "Administración" : "Admin"}
          </button>
        </div>
      </div>
    </footer>
  );
}

function NavBar({ lang, setLang, L }) {
  const items = [
    { id:"home", label:L.nav.home },
    { id:"details", label:L.nav.details },
    { id:"program", label:L.nav.program },
    { id:"gallery", label:L.nav.gallery },
  ];
  const scrollTo = (id) => {
    const el = document.getElementById(id);
    if (el) window.scrollTo({ top: el.offsetTop - 60, behavior:"smooth" });
  };
  return (
    <nav className="top-nav">
      <div className="brand">A &amp; A · 04 · 27</div>
      <div className="links">
        {items.map(it => <button key={it.id} onClick={()=>scrollTo(it.id)}>{it.label}</button>)}
      </div>
      <div className="lang-toggle">
        <button className={lang==="es"?"on":""} onClick={()=>setLang("es")}>ES</button>
        <button className={lang==="en"?"on":""} onClick={()=>setLang("en")}>EN</button>
      </div>
    </nav>
  );
}

function AppDressColorName(sw, lang) {
  const raw = String((sw && (sw.l || sw.es || sw.en)) || "").trim();
  if (lang === "es") return (sw && sw.es) || raw;
  if (sw && sw.en) return sw.en;
  const key = raw.normalize("NFD").replace(/[\u0300-\u036f]/g,"").toLowerCase();
  const map = {"durazno":"Peach","verde":"Green","lila":"Lilac","azul":"Blue","rosa":"Pink","rojo":"Red","fucsia":"Fuchsia","cafe":"Brown","naranja":"Orange","naranja anteado":"Orange","amarillo":"Yellow","sandia":"Watermelon","marfil":"Ivory","caqui":"Khaki","crudo":"Ecru","lino":"Linen","gris":"Gray","ivory":"Ivory","khaki":"Khaki"};
  return map[key] || raw;
}
function AppDressCard({ d, swatches, lang, L }) {
  if (!d) return null;
  return <Reveal><div style={{padding:"42px 36px 36px",border:"1px solid var(--line)",background:"rgba(255,255,255,.55)",height:"100%",display:"flex",flexDirection:"column"}}>
    <div className="micro" style={{color:"var(--sage-deep)",marginBottom:14}}>{pickByLang(d,"day",lang)}</div>
    <h3 className="display" style={{fontSize:"clamp(28px,3.2vw,40px)",margin:"0 0 6px"}}>{pickByLang(d,"code",lang)}</h3>
    <p style={{fontSize:16,color:"var(--ink-soft)",lineHeight:1.7,fontStyle:"italic",margin:"18px 0 0"}}>{pickByLang(d,"desc",lang)}</p>
    <div style={{marginTop:24,display:"flex",gap:14,padding:"12px 18px",border:"1px dashed var(--line)"}}><span className="micro" style={{color:"var(--sage-deep)",flexShrink:0}}>{L.dress_avoid}</span><span style={{fontSize:13.5,color:"var(--ink-soft)"}}>{pickByLang(d,"avoid",lang)}</span></div>
    <div style={{marginTop:"auto",paddingTop:28,textAlign:"center",fontFamily:"var(--sans)",fontSize:8,letterSpacing:".16em",textTransform:"uppercase",color:"var(--ink-soft)"}}>{lang==="es"?"Colores sugeridos":"Suggested colors"}</div>
    <div style={{paddingTop:12,display:"grid",gridTemplateColumns:"repeat(5,minmax(0,1fr))",gap:8}}>
      {swatches.map((sw,i)=><div key={i} style={{display:"flex",flexDirection:"column",alignItems:"center",gap:4,minWidth:0}}>
        <div style={{width:38,height:38,background:sw.c,borderRadius:"50%",boxShadow:"inset 0 -6px 14px rgba(0,0,0,.08)",flex:"0 0 38px"}} />
        <span style={{fontFamily:"Arial,sans-serif",fontSize:6,fontWeight:400,letterSpacing:0,textTransform:"none",whiteSpace:"nowrap",lineHeight:1,textAlign:"center"}}>{AppDressColorName(sw,lang)}</span>
      </div>)}
    </div>
  </div></Reveal>;
}
function AppDressSection({ data, L, lang }) {
  const hasDay2=!!data.dress2;
  const day1=(data.dressAdmin?.day1?.swatches)||[];
  const day2=(data.dressAdmin?.day2?.swatches)||[];
  return <section className="s" id="dress"><div className="inner">
    <SectionHead kicker={L.dress_kicker} title={hasDay2?(lang==="es"?"Dos códigos, dos celebraciones":"Two codes, two celebrations"):pickByLang(data.dress,"code",lang)} sub={hasDay2?(lang==="es"?"Un código distinto para cada día.":"A different dress code for each day."):""} />
    <div className="dr-grid" style={{display:"grid",gridTemplateColumns:hasDay2?"1fr 1fr":"1fr",gap:28,maxWidth:hasDay2?980:640,margin:"0 auto"}}>
      <AppDressCard d={data.dress} swatches={day1} lang={lang} L={L}/>
      {hasDay2&&<AppDressCard d={data.dress2} swatches={day2} lang={lang} L={L}/>}
    </div>
  </div><style>{`@media(max-width:720px){.dr-grid{grid-template-columns:1fr!important}}`}</style></section>;
}

function App() {
  const [t, rawSetTweak] = useTweaks(TWEAK_DEFAULTS);
  const [lang, setLang] = useStateApp("es");
  const [data, setData] = useStateApp(DEFAULT_DATA);
  const [dirty, setDirty] = useStateApp(false);
  const [saveState, setSaveState] = useStateApp("saved");
  const [adminOpen, setAdminOpen] = useStateApp(false);
  const [adminLogin, setAdminLogin] = useStateApp(false);
  const [adminAuthed, setAdminAuthed] = useStateApp(false);
  const [loaded, setLoaded] = useStateApp(false);
  const autosaveTimer = useRefApp(null);
  const lastSavedJson = useRefApp("");

  const L = I18N[lang];

  const buildPayload = useCallbackApp((content = data, tweaks = t) => ({
    ...content,
    _tweaks: {
      ...TWEAK_DEFAULTS,
      ...(content?._tweaks || {}),
      ...(tweaks || {}),
    },
  }), [data, t]);

  const setTweak = useCallbackApp((keyOrEdits, value) => {
    const edits = typeof keyOrEdits === "object" && keyOrEdits !== null ? keyOrEdits : { [keyOrEdits]: value };
    rawSetTweak(edits);

    setData(prev => {
      const nextTweaks = { ...TWEAK_DEFAULTS, ...(prev?._tweaks || {}), ...(t || {}), ...edits };
      applyDesignTweaks(nextTweaks);
      return { ...prev, _tweaks: nextTweaks };
    });

    setDirty(true);
    setSaveState("unsaved");
  }, [rawSetTweak, t]);

  useEffectApp(() => {
    let alive = true;
    MockServer.getContent().then(r => {
      if (!alive) return;
      const remoteData = (r.ok && r.data) ? r.data : DEFAULT_DATA;
      const mergedTweaks = { ...TWEAK_DEFAULTS, ...(remoteData?._tweaks || {}) };
      const hydratedData = { ...remoteData, _tweaks: mergedTweaks };

      setData(hydratedData);
      rawSetTweak(mergedTweaks);
      applyDesignTweaks(mergedTweaks);

      lastSavedJson.current = JSON.stringify(buildPayload(hydratedData, mergedTweaks));
      setSaveState("saved");
      setDirty(false);
      setLoaded(true);
    }).catch(() => {
      setLoaded(true);
    });
    return () => { alive = false; };
  }, []);

  useEffectApp(() => {
    applyPalette(paletteFromTweak(t.palette));
  }, [t.palette]);

  useEffectApp(() => { applyFontPair(t.fontPair); }, [t.fontPair]);

  useEffectApp(() => {
    document.body.setAttribute("data-mode", t.mode || "classic");
  }, [t.mode]);

  const updateData = useCallbackApp((next) => {
    const withTweaks = { ...next, _tweaks: { ...TWEAK_DEFAULTS, ...(data?._tweaks || {}), ...(t || {}), ...(next?._tweaks || {}) } };
    setData(withTweaks);
    setDirty(true);
    setSaveState("unsaved");
  }, [data, t]);

  const saveNow = useCallbackApp(async (content = data, tweaks = t) => {
    const payload = buildPayload(content, tweaks);
    const json = JSON.stringify(payload);
    if (json === lastSavedJson.current) {
      setSaveState("saved");
      setDirty(false);
      return { ok:true, skipped:true };
    }
    setSaveState("saving");
    const r = await MockServer.saveContent(payload);
    if (r.ok) {
      lastSavedJson.current = json;
      setData(payload);
      setSaveState("saved");
      setDirty(false);
    } else {
      setSaveState("unsaved");
    }
    return r;
  }, [data, t, buildPayload]);

  const onSave = useCallbackApp(async () => {
    await saveNow(data, data?._tweaks || t);
  }, [saveNow, data, t]);

  useEffectApp(() => {
    if (!loaded || !dirty) return;
    clearTimeout(autosaveTimer.current);
    autosaveTimer.current = setTimeout(() => {
      saveNow(data, data?._tweaks || t);
    }, 900);
    return () => clearTimeout(autosaveTimer.current);
  }, [loaded, dirty, data, t, saveNow]);

  useEffectApp(() => {
    const beforeUnload = () => {
      if (dirty) saveNow(data, data?._tweaks || t);
    };
    window.addEventListener("beforeunload", beforeUnload);
    return () => window.removeEventListener("beforeunload", beforeUnload);
  }, [dirty, data, t, saveNow]);

  const openAdmin = useCallbackApp(() => {
    if (adminAuthed) setAdminOpen(true);
    else setAdminLogin(true);
  }, [adminAuthed]);

  const onLogout = useCallbackApp(() => {
    setAdminAuthed(false);
    setAdminOpen(false);
  }, []);

  useEffectApp(() => {
    const onKey = (e) => {
      if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === "e") {
        e.preventDefault();
        openAdmin();
      }
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [openAdmin]);

  return (
    <React.Fragment>
      <WatercolorField density={t.watercolorIntensity} />

      <NavBar lang={lang} setLang={setLang} L={L} />

      <main>
        <Hero data={data} L={L} lang={lang} mode={t.mode} />
        <Countdown data={data} L={L} />
        <WelcomeMessage data={data} lang={lang} />
        <EventsSection data={data} L={L} lang={lang} />
        <AppDressSection data={data} L={L} lang={lang} />
        <ItinerarySection data={data} L={L} lang={lang} />
        <GallerySection data={data} L={L} lang={lang} />
        <PlaylistSection data={data} L={L} lang={lang} />
        <GiftsSection data={data} L={L} lang={lang} />
        <LodgingSection data={data} L={L} lang={lang} />
        <ClosingSection data={data} L={L} lang={lang} />
      </main>

      {t.showFAB && (
        <button className="admin-fab" onClick={openAdmin} title={lang==="es"?"Editar contenido (Ctrl+E)":"Edit content (Ctrl+E)"}>
          <svg width="12" height="12" viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round">
            <path d="M11.5 1.5l3 3-9 9H2.5v-3l9-9z"/>
          </svg>
          {lang==="es" ? "Editar" : "Edit"}
        </button>
      )}

      <SiteFooter lang={lang} openAdmin={openAdmin} data={data} />

      {adminLogin && (
        <AdminLogin
          expected={data.admin_password}
          onClose={()=>setAdminLogin(false)}
          onSuccess={()=>{ setAdminAuthed(true); setAdminLogin(false); setAdminOpen(true); }}
          L={L} lang={lang}
        />
      )}

      <AdminPanel
        open={adminOpen}
        onClose={()=>setAdminOpen(false)}
        data={data}
        onChange={updateData}
        onSave={onSave}
        onLogout={onLogout}
        saveState={saveState}
        lang={lang}
        L={L}
        tweaks={data?._tweaks || t}
        setTweak={setTweak}
        palettes={PALETTES}
      />

      <TweaksPanel>
        <TweakSection label={lang==="es"?"Diseño":"Design"} />
        <TweakRadio label={lang==="es"?"Variación":"Variation"} value={t.mode}
          options={[
            { value:"classic", label:lang==="es"?"Clásica":"Classic" },
            { value:"editorial", label:lang==="es"?"Editorial":"Editorial" },
          ]}
          onChange={(v)=>setTweak("mode", v)} />
        <TweakSelect label={lang==="es"?"Tipografía":"Typography"} value={t.fontPair}
          options={[
            { value:"italiana-pinyon", label:"Italiana + Pinyon" },
            { value:"cormorant-italianno", label:"Cormorant + Italianno" },
            { value:"inter-script", label:"Inter + Pinyon" },
          ]}
          onChange={(v)=>setTweak("fontPair", v)} />
        <TweakColor label={lang==="es"?"Paleta acuarela":"Watercolor palette"} value={t.palette}
          options={[
            [PALETTES.sage.paper, PALETTES.sage.deep, PALETTES.sage.light],
            [PALETTES.rose.paper, PALETTES.rose.deep, PALETTES.rose.light],
            [PALETTES.bone.paper, PALETTES.bone.deep, PALETTES.bone.light],
            [PALETTES.midnight.paper, PALETTES.midnight.deep, PALETTES.midnight.light],
          ]}
          onChange={(v)=>setTweak("palette", v)} />
        <TweakSlider label={lang==="es"?"Intensidad acuarela":"Watercolor density"}
          value={t.watercolorIntensity} min={0} max={16} step={1}
          onChange={(v)=>setTweak("watercolorIntensity", v)} />

        <TweakSection label={lang==="es"?"Administración":"Admin"} />
        <TweakToggle label={lang==="es"?"Mostrar acceso admin":"Show admin button"} value={t.showFAB}
          onChange={(v)=>setTweak("showFAB", v)} />
        <TweakButton label={lang==="es"?"Abrir panel admin":"Open admin panel"} onClick={openAdmin} />
      </TweaksPanel>
    </React.Fragment>
  );
}

ReactDOM.createRoot(document.getElementById("root")).render(<App />);