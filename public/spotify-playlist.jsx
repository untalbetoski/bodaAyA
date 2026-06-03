// spotify-playlist.jsx — cloud persistence guard + Spotify collaborative playlist
(function enforceCloudPersistence(){
  if (!window.MockServer || window.MockServer.__cloudPersistenceGuarded) return;
  const originalGetContent = window.MockServer.getContent.bind(window.MockServer);
  const originalSaveContent = window.MockServer.saveContent.bind(window.MockServer);
  const isLocal = ['localhost','127.0.0.1'].includes(window.location.hostname);

  window.MockServer.getContent = async function(){
    try {
      const res = await fetch('/api/content', { cache:'no-store' });
      const json = await res.json().catch(() => ({}));
      if (res.ok && json.ok && json.data) return { ok:true, data:json.data, source:json.source || 'cloud' };
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
        return { ok:true, savedAt:json.savedAt, remoteSaved:true, source:json.source || 'cloud' };
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

(function loadCloudBootstrap(){
  try {
    const xhr = new XMLHttpRequest();
    xhr.open('GET', 'cloud-bootstrap.jsx', false);
    xhr.send(null);
    if (xhr.status >= 200 && xhr.status < 300) {
      (0, eval)(xhr.responseText);
    }
  } catch (e) {
    console.error('[CloudBootstrap] loader failed:', e);
  }
})();

(function loadGoogleMapsPatch(){
  try {
    const xhr = new XMLHttpRequest();
    xhr.open('GET', 'google-maps.jsx', false);
    xhr.send(null);
    if (xhr.status >= 200 && xhr.status < 300) {
      const compiled = window.Babel
        ? Babel.transform(xhr.responseText, { presets:['react'] }).code
        : xhr.responseText;
      (0, eval)(compiled);
    }
  } catch (e) {
    console.error('[GoogleMaps] loader failed:', e);
  }
})();

(function loadNahonAccentPatch(){
  try {
    const xhr = new XMLHttpRequest();
    xhr.open('GET', 'nahon-patch.js', false);
    xhr.send(null);
    if (xhr.status >= 200 && xhr.status < 300) {
      (0, eval)(xhr.responseText);
    }
  } catch (e) {
    console.error('[Nahón] loader failed:', e);
  }
})();

(function loadHeroMonogram(){
  try {
    const xhr = new XMLHttpRequest();
    xhr.open('GET', 'monogram-site.js', false);
    xhr.send(null);
    if (xhr.status >= 200 && xhr.status < 300) {
      (0, eval)(xhr.responseText);
    }
  } catch (e) {
    console.error('[Monogram] loader failed:', e);
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