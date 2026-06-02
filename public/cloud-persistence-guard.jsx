// cloud-persistence-guard.jsx — prevent false-positive local saves in production
(function enforceCloudPersistence(){
  if (!window.MockServer || window.MockServer.__cloudPersistenceGuarded) return;

  const originalGetContent = window.MockServer.getContent.bind(window.MockServer);
  const originalSaveContent = window.MockServer.saveContent.bind(window.MockServer);
  const isLocal = ['localhost', '127.0.0.1'].includes(window.location.hostname);

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