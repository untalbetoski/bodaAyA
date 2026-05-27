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

(function(){
  const link = document.createElement("link");
  link.rel = "stylesheet";
  link.href = "https://fonts.googleapis.com/css2?family=Italianno&display=swap";
  document.head.appendChild(link);
})();

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
    { id:"rsvp", label:L.nav.rsvp },
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

  const setTweak = useCallbackApp((key, value) => {
    rawSetTweak(key, value);
    setDirty(true);
    setSaveState("unsaved");
  }, [rawSetTweak]);

  useEffectApp(() => {
    let alive = true;
    MockServer.getContent().then(r => {
      if (!alive) return;
      const remoteData = (r.ok && r.data) ? r.data : DEFAULT_DATA;
      setData(remoteData);

      if (remoteData?._tweaks) {
        const mergedTweaks = { ...TWEAK_DEFAULTS, ...remoteData._tweaks };
        Object.entries(mergedTweaks).forEach(([key, value]) => rawSetTweak(key, value));
      }

      lastSavedJson.current = JSON.stringify(buildPayload(remoteData, remoteData?._tweaks || t));
      setSaveState("saved");
      setDirty(false);
      setLoaded(true);
    }).catch(() => {
      setLoaded(true);
    });
    return () => { alive = false; };
  }, []);

  useEffectApp(() => {
    const [paper, deep] = t.palette || [];
    let key = "sage";
    Object.entries(PALETTES).forEach(([k,v]) => {
      if (v.paper === paper && v.deep === deep) key = k;
    });
    applyPalette(PALETTES[key]);
  }, [t.palette]);

  useEffectApp(() => { applyFontPair(t.fontPair); }, [t.fontPair]);

  useEffectApp(() => {
    document.body.setAttribute("data-mode", t.mode);
  }, [t.mode]);

  const updateData = useCallbackApp((next) => {
    setData(next);
    setDirty(true);
    setSaveState("unsaved");
  }, []);

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
    await saveNow(data, t);
  }, [saveNow, data, t]);

  useEffectApp(() => {
    if (!loaded || !dirty) return;
    clearTimeout(autosaveTimer.current);
    autosaveTimer.current = setTimeout(() => {
      saveNow(data, t);
    }, 900);
    return () => clearTimeout(autosaveTimer.current);
  }, [loaded, dirty, data, t, saveNow]);

  useEffectApp(() => {
    const beforeUnload = () => {
      if (dirty) saveNow(data, t);
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
        <EventsSection data={data} L={L} lang={lang} />
        <DressSection data={data} L={L} lang={lang} />
        <ItinerarySection data={data} L={L} lang={lang} />
        <RSVPSection data={data} L={L} lang={lang} />
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
        tweaks={t}
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