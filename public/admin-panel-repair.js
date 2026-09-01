// admin-panel-repair.js — lightweight admin UI safety + persistent image save guard
(function repairAdminPanel(){
  try {
    if (window.__AA_ADMIN_PANEL_REPAIR_V10__) return;
    window.__AA_ADMIN_PANEL_REPAIR_V10__ = true;

    function addStyle(){
      if (document.getElementById('aa-admin-panel-repair-style-v10')) return;
      var style = document.createElement('style');
      style.id = 'aa-admin-panel-repair-style-v10';
      style.textContent = `
        .admin-fab,.admin-link,.admin-panel,.admin-panel *{pointer-events:auto!important;}
        .admin-panel{z-index:330!important;visibility:visible!important;}
        .admin-panel.open{transform:translateX(0)!important;opacity:1!important;visibility:visible!important;}
        .admin-panel .tabs button,.admin-panel .ft button,.admin-panel .body button{cursor:pointer!important;pointer-events:auto!important;}
        .admin-panel .body input,.admin-panel .body textarea,.admin-panel .body select{pointer-events:auto!important;user-select:text!important;}
      `;
      document.head.appendChild(style);
    }

    function clone(obj){
      try { return JSON.parse(JSON.stringify(obj || {})); }
      catch(e) { return Array.isArray(obj) ? obj.slice() : Object.assign({}, obj || {}); }
    }

    function installPersistentImageSaveGuard(){
      try {
        if (window.__AA_PERSISTENT_IMAGE_SAVE_GUARD_V10__) return;
        window.__AA_PERSISTENT_IMAGE_SAVE_GUARD_V10__ = true;

        function hasImg(item){ return item && typeof item.img === 'string' && item.img.trim(); }

        function mergeImageArrays(incomingImages, existingImages){
          var output = Array.isArray(incomingImages) ? incomingImages.map(function(item){ return clone(item); }) : [];
          var existing = Array.isArray(existingImages) ? existingImages : [];

          existing.forEach(function(oldItem, index){
            if (!hasImg(oldItem)) return;
            var alreadyExists = output.some(function(newItem){ return hasImg(newItem) && String(newItem.img).trim() === String(oldItem.img).trim(); });
            if (alreadyExists) return;

            if (output[index] && !hasImg(output[index])) {
              output[index] = Object.assign({}, output[index], clone(oldItem), {
                label: output[index].label || oldItem.label || 'Inspiración'
              });
            } else {
              output.push(clone(oldItem));
            }
          });

          return output;
        }

        function protectDressAdminImages(next, existing){
          if (!existing || !existing.dressAdmin) return next;
          next.dressAdmin = next.dressAdmin || clone(existing.dressAdmin);

          ['day1','day2'].forEach(function(day){
            var oldDay = existing.dressAdmin && existing.dressAdmin[day];
            if (!oldDay) return;
            next.dressAdmin[day] = next.dressAdmin[day] || clone(oldDay);
            next.dressAdmin[day].images = mergeImageArrays(next.dressAdmin[day].images, oldDay.images);
          });

          return next;
        }

        function protectEventVenueImages(next, existing){
          var keys = ['icebreaker','ceremony','reception','traditional'];
          keys.forEach(function(key){
            var oldEv = existing && existing[key];
            if (!oldEv || !String(oldEv.image || '').trim()) return;
            next[key] = next[key] || {};

            // Preserve only when the incoming save does not know about the image field.
            // If the admin explicitly sends image:'', we respect that as an intentional remove.
            if (!Object.prototype.hasOwnProperty.call(next[key], 'image')) {
              next[key].image = oldEv.image;
            }
            if (oldEv.image_caption_es && !Object.prototype.hasOwnProperty.call(next[key], 'image_caption_es')) next[key].image_caption_es = oldEv.image_caption_es;
            if (oldEv.image_caption_en && !Object.prototype.hasOwnProperty.call(next[key], 'image_caption_en')) next[key].image_caption_en = oldEv.image_caption_en;
            if (oldEv.image_alt_es && !Object.prototype.hasOwnProperty.call(next[key], 'image_alt_es')) next[key].image_alt_es = oldEv.image_alt_es;
            if (oldEv.image_alt_en && !Object.prototype.hasOwnProperty.call(next[key], 'image_alt_en')) next[key].image_alt_en = oldEv.image_alt_en;
          });
          return next;
        }

        function protectPersistentImages(incoming, existing){
          if (!incoming || typeof incoming !== 'object') return incoming;
          if (!existing || typeof existing !== 'object') return incoming;
          var next = clone(incoming);
          next = protectDressAdminImages(next, existing);
          next = protectEventVenueImages(next, existing);
          return next;
        }

        window.__AA_PROTECT_DRESS_ADMIN_IMAGES__ = function(incoming, existing){ return protectDressAdminImages(clone(incoming), existing); };
        window.__AA_PROTECT_PERSISTENT_IMAGES__ = protectPersistentImages;

        if (window.fetch && !window.fetch.__aaPersistentImageGuardedV10) {
          var originalFetch = window.fetch.bind(window);
          var guardedFetch = async function(input, init){
            try {
              var url = typeof input === 'string' ? input : ((input && input.url) || '');
              var method = String((init && init.method) || (input && input.method) || 'GET').toUpperCase();
              var isContentSave = method === 'POST' && /\/api\/content(?:$|\?)/.test(url);

              if (isContentSave && init && typeof init.body === 'string') {
                var payload = JSON.parse(init.body);
                if (payload && payload.data) {
                  var existing = window.__AA_SITE_DATA || null;
                  try {
                    var res = await originalFetch('/api/content?preserve=' + Date.now(), { cache:'no-store' });
                    var json = await res.json().catch(function(){ return {}; });
                    if (res.ok && json.ok && json.data) existing = json.data;
                  } catch(loadErr) {}

                  if (existing) {
                    payload.data = protectPersistentImages(payload.data, existing);
                    var nextInit = Object.assign({}, init, { body: JSON.stringify(payload) });
                    nextInit.headers = Object.assign({ 'Content-Type':'application/json' }, init.headers || {});
                    return originalFetch(input, nextInit);
                  }
                }
              }
            } catch(err) {
              console.error('[ImageSaveGuard] save protection skipped:', err);
            }
            return originalFetch(input, init);
          };
          guardedFetch.__aaPersistentImageGuardedV10 = true;
          guardedFetch.__aaOriginalFetch = originalFetch;
          window.fetch = guardedFetch;
        }
      } catch(e) {
        console.error('[ImageSaveGuard] disabled:', e);
      }
    }

    function loadSafeSectionsModal(){
      try {
        if (window.__AA_ADMIN_SAFE_PANEL_V6__) return;
        if (document.querySelector('script[data-aa-admin-safe-panel-v6]')) return;
        document.querySelectorAll('.aa-safe-open-btn').forEach(function(btn){ btn.remove(); });
        var s = document.createElement('script');
        s.src = 'admin-safe-panel-v6.js?v=6';
        s.async = true;
        s.defer = true;
        s.setAttribute('data-aa-admin-safe-panel-v6','1');
        s.onerror = function(){ console.error('[AdminRepair] safe sections modal v6 could not load'); };
        document.body.appendChild(s);
      } catch(e) {
        console.error('[AdminRepair] safe modal loader failed:', e);
      }
    }

    function ensureAdminAccessHints(){
      try {
        var buttons = [document.querySelector('.admin-fab'), document.querySelector('.admin-link')];
        buttons.forEach(function(btn){
          if (!btn || btn.getAttribute('data-aa-admin-repaired-v10')) return;
          btn.setAttribute('data-aa-admin-repaired-v10','1');
          btn.setAttribute('title','Abrir panel de administración');
        });
      } catch(e) {}
    }

    addStyle();
    installPersistentImageSaveGuard();
    var idle = window.requestIdleCallback || function(fn){ return setTimeout(fn, 700); };
    idle(loadSafeSectionsModal);
    setTimeout(loadSafeSectionsModal, 1200);
    setTimeout(loadSafeSectionsModal, 2500);
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