// admin-panel-repair.js — stable admin persistence + lightweight safety layer
(function stabilizeAdminPersistence(){
  try {
    if (!window.MockServer || window.MockServer.__aaStableAdminPersistence) return;
    window.MockServer.__aaStableAdminPersistence = true;

    const fallbackGetContent = window.MockServer.getContent ? window.MockServer.getContent.bind(window.MockServer) : null;
    const fallbackSaveContent = window.MockServer.saveContent ? window.MockServer.saveContent.bind(window.MockServer) : null;
    const isLocal = ['localhost','127.0.0.1'].includes(window.location.hostname);
    const EVENT_KEYS = ['icebreaker','ceremony','reception','traditional'];
    const DEFAULT_QUERIES = {
      icebreaker:'Mal de Amor, Santiago Matatlán, Oaxaca',
      ceremony:'Templo de Santo Domingo de Guzmán, Oaxaca de Juárez, Oaxaca',
      reception:'Cardenal Oaxaca Social Venue, Oaxaca de Juárez, Oaxaca',
      traditional:'Oaxaca de Juárez, Oaxaca'
    };

    function clone(value){
      try { return JSON.parse(JSON.stringify(value || {})); }
      catch(e) { return Object.assign({}, value || {}); }
    }

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
      return clean(parts.join(', ')) || DEFAULT_QUERIES[key] || 'Oaxaca, México';
    }

    function embedUrl(query){
      return 'https://www.google.com/maps?q=' + encodeURIComponent(query) + '&output=embed';
    }

    function publicMapUrl(query){
      return 'https://www.google.com/maps/search/?api=1&query=' + encodeURIComponent(query);
    }

    function normalizeForPersistence(data){
      const next = clone(data || window.DEFAULT_DATA || {});
      EVENT_KEYS.forEach(function(key){
        if (!next[key]) return;
        const q = eventQuery(next[key], key);
        next[key] = Object.assign({}, next[key], {
          map: embedUrl(q),
          map_query: q,
          map_url: publicMapUrl(q)
        });
      });
      return next;
    }

    function replaceInto(target, source){
      if (!target || typeof target !== 'object') return source;
      try {
        Object.keys(target).forEach(function(k){ delete target[k]; });
        Object.assign(target, source);
        return target;
      } catch(e) {
        return source;
      }
    }

    function publish(data){
      const normalized = normalizeForPersistence(data);
      window.__AA_SITE_DATA = normalized;
      try {
        window.dispatchEvent(new CustomEvent('aa:content-updated', { detail:{ data:normalized } }));
      } catch(e) {}
      return normalized;
    }

    window.MockServer.getContent = async function(){
      try {
        const res = await fetch('/api/content?ts=' + Date.now(), { cache:'no-store' });
        const json = await res.json().catch(function(){ return {}; });
        if (res.ok && json.ok) {
          const data = publish(json.data || window.DEFAULT_DATA || {});
          return { ok:true, data:data, source:json.source || 'cloud-storage' };
        }
        throw new Error(json.error || 'content_load_failed');
      } catch(e) {
        console.error('[AdminPersistence] direct load failed:', e);
        if (isLocal && fallbackGetContent) return fallbackGetContent();
        const data = publish(window.__AA_SITE_DATA || window.DEFAULT_DATA || {});
        return { ok:false, data:data, error:e.message || 'content_load_failed' };
      }
    };

    window.MockServer.saveContent = async function(data){
      const normalized = normalizeForPersistence(data || window.__AA_SITE_DATA || window.DEFAULT_DATA || {});
      replaceInto(data, normalized);
      publish(normalized);
      try {
        const res = await fetch('/api/content', {
          method:'POST',
          headers:{ 'Content-Type':'application/json' },
          body:JSON.stringify({ data:normalized })
        });
        const json = await res.json().catch(function(){ return {}; });
        if (res.ok && json.ok && json.remoteSaved) {
          return { ok:true, savedAt:json.savedAt, remoteSaved:true, source:json.source || 'cloud-storage', data:normalized };
        }
        throw new Error(json.error || 'content_save_failed');
      } catch(e) {
        console.error('[AdminPersistence] direct save failed:', e);
        if (isLocal && fallbackSaveContent) return fallbackSaveContent(normalized);
        return { ok:false, remoteSaved:false, error:e.message || 'content_save_failed', data:normalized };
      }
    };
  } catch(err) {
    console.error('[AdminPersistence] disabled after error:', err);
  }
})();

(function repairAdminPanel(){
  try {
    if (window.__AA_ADMIN_PANEL_REPAIR_V5__) return;
    window.__AA_ADMIN_PANEL_REPAIR_V5__ = true;

    function addStyle(){
      if (document.getElementById('aa-admin-panel-repair-style-v5')) return;
      var style = document.createElement('style');
      style.id = 'aa-admin-panel-repair-style-v5';
      style.textContent = `
        .admin-fab,.admin-link,.admin-panel,.admin-panel *{pointer-events:auto!important;}
        .admin-panel{z-index:330!important;visibility:visible!important;}
        .admin-panel.open{transform:translateX(0)!important;opacity:1!important;visibility:visible!important;}
        .admin-panel .tabs button,.admin-panel .ft button,.admin-panel .body button{cursor:pointer!important;pointer-events:auto!important;}
        .admin-panel .body input,.admin-panel .body textarea,.admin-panel .body select{pointer-events:auto!important;user-select:text!important;}
      `;
      document.head.appendChild(style);
    }

    function loadSafeSectionsModal(){
      try {
        if (window.__AA_ADMIN_SAFE_PANEL_V4__) return;
        if (document.querySelector('script[data-aa-admin-safe-panel-v4]')) return;
        var s = document.createElement('script');
        s.src = 'admin-safe-panel.js?v=4';
        s.async = true;
        s.defer = true;
        s.setAttribute('data-aa-admin-safe-panel-v4','1');
        s.onerror = function(){ console.error('[AdminRepair] safe sections modal could not load'); };
        document.body.appendChild(s);
      } catch(e) {
        console.error('[AdminRepair] safe modal loader failed:', e);
      }
    }

    function ensureAdminAccessHints(){
      try {
        var buttons = [document.querySelector('.admin-fab'), document.querySelector('.admin-link')];
        buttons.forEach(function(btn){
          if (!btn || btn.getAttribute('data-aa-admin-repaired-v5')) return;
          btn.setAttribute('data-aa-admin-repaired-v5','1');
          btn.setAttribute('title','Abrir panel de administración');
        });
      } catch(e) {}
    }

    addStyle();
    var idle = window.requestIdleCallback || function(fn){ return setTimeout(fn, 700); };
    idle(loadSafeSectionsModal);
    setTimeout(ensureAdminAccessHints, 700);
    setTimeout(ensureAdminAccessHints, 1800);

    document.addEventListener('keydown', function(e){
      try {
        if ((e.ctrlKey || e.metaKey) && e.shiftKey && e.key.toLowerCase() === 'a') {
          e.preventDefault();
          var btn = document.querySelector('.admin-fab') || document.querySelector('.admin-link');
          if (btn) btn.click();
        }
      } catch(err) {}
    }, true);
  } catch(err) {
    console.error('[AdminRepair] disabled after error:', err);
  }
})();