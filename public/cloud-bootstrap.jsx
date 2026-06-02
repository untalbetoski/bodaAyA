// cloud-bootstrap.jsx — initialize shared content once when cloud storage is empty
(function bootstrapSharedContent(){
  if (!window.MockServer || window.MockServer.__sharedContentBootstrap) return;

  const originalGetContent = window.MockServer.getContent.bind(window.MockServer);
  const originalSaveContent = window.MockServer.saveContent.bind(window.MockServer);
  let bootstrapPromise = null;

  async function ensureInitialized(){
    if (bootstrapPromise) return bootstrapPromise;
    bootstrapPromise = (async () => {
      const current = await originalGetContent();
      const isEmptyCloud = current?.ok && (
        current.source === 'cloud-storage-empty' ||
        current.source === 'cloud-empty' ||
        !current.data ||
        Object.keys(current.data).length === 0
      );

      if (!isEmptyCloud) return current;

      const initial = { ...DEFAULT_DATA };
      const saved = await originalSaveContent(initial);
      if (!saved?.ok) return { ok:false, data:initial, error:saved?.error || 'cloud_bootstrap_failed' };

      return { ok:true, data:initial, source:'cloud-bootstrap', savedAt:saved.savedAt };
    })();
    return bootstrapPromise;
  }

  window.MockServer.getContent = ensureInitialized;
  window.MockServer.__sharedContentBootstrap = true;
})();