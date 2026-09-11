// spotify-playlist.jsx — cloud persistence guard + site patch loaders + Spotify collaborative playlist
(function enforceCloudPersistence(){
  if (!window.MockServer || window.MockServer.__cloudPersistenceGuarded) return;
  const originalGetContent = window.MockServer.getContent.bind(window.MockServer);
  const originalSaveContent = window.MockServer.saveContent.bind(window.MockServer);
  const isLocal = ['localhost','127.0.0.1'].includes(window.location.hostname);

  window.MockServer.getContent = async function(){
    try {
      const res = await fetch('/api/content?ts=' + Date.now(), { cache:'no-store' });
      const json = await res.json().catch(() => ({}));
      if (res.ok && json.ok && json.data) {
        try { window.__AA_SITE_DATA = json.data; } catch(e) {}
        return { ok:true, data:json.data, source:json.source || 'cloud' };
      }
      if (res.ok && json.ok && !json.data) return { ok:true, data:DEFAULT_DATA, source:json.source || 'cloud-empty' };
      throw new Error(json.error || 'Cloud content could not be loaded');
    } catch(e) {
      console.error('[CloudPersistence] load failed:', e);
      if (isLocal) return originalGetContent();
      return { ok:false, data:DEFAULT_DATA, error:e.message || 'cloud_load_failed' };
    }
  };

  window.MockServer.saveContent = async function(data){
    try {
      const res = await fetch('/api/content', {
        method:'POST',
        headers:{ 'Content-Type':'application/json' },
        body:JSON.stringify({ data }),
      });
      const json = await res.json().catch(() => ({}));
      if (res.ok && json.ok && json.remoteSaved) {
        const saved = json.data || data;
        try {
          window.__AA_SITE_DATA = saved;
          window.dispatchEvent(new CustomEvent('aa:content-updated', { detail:{ data:saved } }));
        } catch(e) {}
        return { ok:true, savedAt:json.savedAt, remoteSaved:true, source:json.source || 'cloud', data:saved };
      }
      throw new Error(json.error || 'Cloud save was not confirmed');
    } catch(e) {
      console.error('[CloudPersistence] save failed:', e);
      if (isLocal) return originalSaveContent(data);
      return { ok:false, remoteSaved:false, error:e.message || 'cloud_save_failed' };
    }
  };

  window.MockServer.__cloudPersistenceGuarded = true;
})();

(function loadCssOnce(href){
  try {
    if (document.querySelector('link[href="' + href + '"]')) return;
    const link = document.createElement('link');
    link.rel = 'stylesheet';
    link.href = href;
    document.head.appendChild(link);
  } catch(e) {}
})('minimal-editorial-theme.css');

function aaLoadScriptSync(src, opts){
  opts = opts || {};
  try {
    const xhr = new XMLHttpRequest();
    xhr.open('GET', src, false);
    xhr.send(null);
    if (xhr.status >= 200 && xhr.status < 300) {
      const code = opts.react && window.Babel
        ? Babel.transform(xhr.responseText, { presets:['react'] }).code
        : xhr.responseText;
      (0, eval)(code);
    }
  } catch (e) {
    console.error('[' + (opts.name || src) + '] loader failed:', e);
  }
}

aaLoadScriptSync('cloud-bootstrap.jsx?v=1', { name:'CloudBootstrap' });
aaLoadScriptSync('google-maps.jsx?v=1', { name:'GoogleMaps', react:true });
aaLoadScriptSync('event-map-autogenerator.js?v=1', { name:'EventMapAutogenerator' });
aaLoadScriptSync('nahon-patch.js?v=1', { name:'Nahón' });
aaLoadScriptSync('monogram-site.js?v=1', { name:'Monogram' });
aaLoadScriptSync('pinterest-dresscode.js?v=1', { name:'Pinterest' });
aaLoadScriptSync('dress-colors-label.js?v=6', { name:'DressColorsLabel' });
aaLoadScriptSync('dress-code-gallery.js?v=4', { name:'DressCodeGallery' });
aaLoadScriptSync('minimal-theme.js?v=1', { name:'MinimalTheme' });
aaLoadScriptSync('script-font-force.js?v=1', { name:'ScriptFontForce' });
aaLoadScriptSync('welcome-after-countdown.js?v=1', { name:'WelcomeAfterCountdown' });
aaLoadScriptSync('friday-program-close.js?v=1', { name:'FridayProgramClose' });
aaLoadScriptSync('event-place-images.js?v=5', { name:'StableEventMedia' });
aaLoadScriptSync('admin-panel-repair.js?v=11', { name:'AdminPanelRepair' });

(function loadCitrusInspirationTheme(){
  try {
    if (document.querySelector('link[href="citrus-inspiration-theme.css"]')) return;
    const link = document.createElement('link');
    link.rel = 'stylesheet';
    link.href = 'citrus-inspiration-theme.css?v=1';
    document.head.appendChild(link);
  } catch (e) {
    console.error('[CitrusTheme] loader failed:', e);
  }
})();

const SPOTIFY_PLAYLIST_URL = "https://open.spotify.com/playlist/2yuFG9u83IBvIlOmMyiBj7?si=RXLU1cmqTAC61rMMHD58Cg&pt=ab3cf25b4dfbfd4c75055e8ceaa97445&pi=iBlavtqCS1G2-";
const SPOTIFY_EMBED_URL = "https://open.spotify.com/embed/playlist/2yuFG9u83IBvIlOmMyiBj7?utm_source=generator&theme=0";

function SpotifyPlaylistSection({ data, L, lang }) {
  const title = lang === "es" ? "Ayúdanos a armar la playlist" : "Help us build the playlist";
  const note = lang === "es"
    ? "Agrega directamente en Spotify esa canción que te haría salir a la pista. La lista es compartida para que todos podamos sumar música."
    : "Add directly on Spotify the song that would get you on the dance floor. The playlist is shared so everyone can add music.";
  const button = lang === "es" ? "Abrir playlist en Spotify" : "Open playlist on Spotify";
  const hint = lang === "es" ? "Se abrirá Spotify en una pestaña nueva." : "Spotify will open in a new tab.";

  return (
    <section className="s" id="playlist">
      <WatercolorStamp size={360} style={{ position:"absolute", top:"8%", left:"-8%", opacity:.35, transform:"rotate(-20deg)" }} />
      <div className="inner" style={{ maxWidth:820 }}>
        <SectionHead kicker={L.playlist_kicker} title={title} sub={note} />
        <Reveal>
          <div style={{
            border:"1px solid var(--line)",
            background:"rgba(255,255,255,.55)",
            padding:"34px 28px",
            boxShadow:"var(--shadow)",
            display:"grid",
            gap:24,
          }}>
            <div style={{ display:"flex", alignItems:"center", justifyContent:"space-between", gap:20, flexWrap:"wrap" }}>
              <div>
                <div className="micro" style={{ color:"var(--sage-deep)", marginBottom:8 }}>Spotify</div>
                <div style={{ fontSize:18, color:"var(--ink-soft)", fontStyle:"italic", lineHeight:1.55 }}>{hint}</div>
              </div>
              <a className="btn btn-filled" href={SPOTIFY_PLAYLIST_URL} target="_blank" rel="noopener noreferrer" style={{ textDecoration:"none" }}>
                {button}
              </a>
            </div>
            <iframe
              title="Spotify playlist Andrea y Alberto"
              src={SPOTIFY_EMBED_URL}
              width="100%"
              height="380"
              frameBorder="0"
              allow="autoplay; clipboard-write; encrypted-media; fullscreen; picture-in-picture"
              loading="lazy"
              style={{ borderRadius:12, border:"1px solid var(--line)", background:"var(--paper-2)" }}
            ></iframe>
          </div>
        </Reveal>
      </div>
    </section>
  );
}

try { PlaylistSection = SpotifyPlaylistSection; } catch(e) {}
window.PlaylistSection = SpotifyPlaylistSection;
