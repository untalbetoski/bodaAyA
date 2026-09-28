// design-live-fix.js — force pastel design controls to apply and persist
(function designLiveFix(){
  try {
    if (window.__AA_DESIGN_LIVE_FIX_V3__) return;
    window.__AA_DESIGN_LIVE_FIX_V3__ = true;

    const PASTEL = {
      sage: {
        label_es: 'Salvia pastel', label_en: 'Pastel sage',
        match: ['salvia', 'sage'],
        tweak: ['#fbf7f0', '#8fa58a', '#ddebd6'],
        vars: { paper:'#fbf7f0', paper2:'#f1eadf', deep:'#8fa58a', main:'#b8cdb1', light:'#ddebd6', wash:'#eef6ec' }
      },
      rose: {
        label_es: 'Rosa pastel', label_en: 'Pastel rose',
        match: ['rosa', 'rose', 'dusty'],
        tweak: ['#fff6f7', '#b8848d', '#f4d9df'],
        vars: { paper:'#fff6f7', paper2:'#f6e7ea', deep:'#b8848d', main:'#e7b7c1', light:'#f4d9df', wash:'#fbedf0' }
      },
      bone: {
        label_es: 'Marfil cálido', label_en: 'Warm ivory',
        match: ['hueso', 'bone', 'marfil'],
        tweak: ['#fffaf1', '#a99676', '#f3e6cc'],
        vars: { paper:'#fffaf1', paper2:'#f4ead6', deep:'#a99676', main:'#e3cfad', light:'#f3e6cc', wash:'#fff3dc' }
      },
      midnight: {
        label_es: 'Azul lavanda', label_en: 'Lavender blue',
        match: ['medianoche', 'midnight', 'azul', 'lavanda'],
        tweak: ['#f6f8ff', '#7f8fb3', '#dce3f7'],
        vars: { paper:'#f6f8ff', paper2:'#e9edf8', deep:'#7f8fb3', main:'#b9c5e7', light:'#dce3f7', wash:'#eef2ff' }
      },
      lilac: {
        label_es: 'Lila pastel', label_en: 'Pastel lilac',
        match: ['lila', 'lilac', 'morado', 'lavender purple'],
        tweak: ['#fbf7ff', '#9b82bd', '#e8dcf7'],
        vars: { paper:'#fbf7ff', paper2:'#f0e8f8', deep:'#9b82bd', main:'#cdb9e8', light:'#e8dcf7', wash:'#f5effc' }
      }
    };

    const DEFAULT_TWEAKS = {
      mode: 'classic',
      palette: PASTEL.sage.tweak,
      fontPair: 'italiana-pinyon',
      watercolorIntensity: 8,
      showFAB: true
    };

    function setVar(name, value){ document.documentElement.style.setProperty(name, value, 'important'); }
    function setBodyMode(mode){ document.body.setAttribute('data-mode', mode === 'editorial' ? 'editorial' : 'classic'); }

    function applyPaletteKey(key){
      const p = PASTEL[key] || PASTEL.sage;
      setVar('--paper', p.vars.paper);
      setVar('--paper-2', p.vars.paper2);
      setVar('--sage-deep', p.vars.deep);
      setVar('--sage', p.vars.main);
      setVar('--sage-light', p.vars.light);
      setVar('--sage-wash', p.vars.wash);
      setVar('--accent', p.vars.main);
      try { localStorage.setItem('aa_design_palette_key', key); } catch(e) {}
      return p.tweak.slice();
    }

    function keyFromPalette(palette){
      const joined = (Array.isArray(palette) ? palette : []).join('|').toLowerCase();
      if (joined.includes('#9b82bd') || joined.includes('#cdb9e8') || joined.includes('#e8dcf7')) return 'lilac';
      if (joined.includes('#b8848d') || joined.includes('#8c5a5e') || joined.includes('#c08a8e')) return 'rose';
      if (joined.includes('#a99676')) return 'bone';
      if (joined.includes('#7f8fb3') || joined.includes('#3c4860') || joined.includes('#6c7a98')) return 'midnight';
      if (joined.includes('#8fa58a') || joined.includes('#7b684b') || joined.includes('#b79a6f')) return 'sage';
      try { return localStorage.getItem('aa_design_palette_key') || 'sage'; } catch(e) { return 'sage'; }
    }

    function applyFontPair(pair){
      const r = document.documentElement.style;
      if (pair === 'cormorant-italianno') {
        r.setProperty('--display', '"Cormorant Garamond", serif', 'important');
        r.setProperty('--script', '"Italianno", cursive', 'important');
        r.setProperty('--serif', '"Cormorant Garamond", serif', 'important');
      } else if (pair === 'inter-script') {
        r.setProperty('--display', '"Inter", sans-serif', 'important');
        r.setProperty('--script', '"Pinyon Script", cursive', 'important');
        r.setProperty('--serif', '"Cormorant Garamond", serif', 'important');
      } else {
        r.setProperty('--display', '"Italiana", serif', 'important');
        r.setProperty('--script', '"Pinyon Script", cursive', 'important');
        r.setProperty('--serif', '"Cormorant Garamond", serif', 'important');
      }
    }

    function applyTweaks(tweaks){
      const merged = Object.assign({}, DEFAULT_TWEAKS, tweaks || {});
      const key = keyFromPalette(merged.palette);
      merged.palette = applyPaletteKey(key);
      applyFontPair(merged.fontPair);
      setBodyMode(merged.mode);
      window.__AA_LAST_DESIGN_TWEAKS__ = merged;
      return merged;
    }

    function cleanText(el){
      return String(el && el.textContent || '').toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g, '').replace(/\s+/g, ' ').trim();
    }

    function paletteKeyFromText(text){
      return Object.keys(PASTEL).find(key => PASTEL[key].match.some(word => text.includes(word))) || '';
    }

    async function fetchContent(){
      const res = await fetch('/api/content?design_fix=' + Date.now(), { cache:'no-store' });
      const json = await res.json().catch(() => ({}));
      return (res.ok && json && json.data) ? json.data : null;
    }

    let saveTimer = null;
    async function saveTweaks(edits){
      clearTimeout(saveTimer);
      saveTimer = setTimeout(async () => {
        try {
          const current = await fetchContent();
          if (!current) return;
          const nextTweaks = Object.assign({}, DEFAULT_TWEAKS, current._tweaks || {}, edits || {});
          const payload = Object.assign({}, current, { _tweaks: nextTweaks });
          await fetch('/api/content', {
            method:'POST',
            headers:{ 'Content-Type':'application/json' },
            body: JSON.stringify({ data: payload })
          });
        } catch(err) { console.error('[DesignLiveFix] save failed:', err); }
      }, 250);
    }

    function applyFromButton(btn){
      const text = cleanText(btn);
      const edits = {};
      const paletteKey = btn.dataset.aaPaletteKey || paletteKeyFromText(text);
      if (paletteKey) edits.palette = applyPaletteKey(paletteKey);

      if (text.includes('cormorant')) { edits.fontPair = 'cormorant-italianno'; applyFontPair(edits.fontPair); }
      else if (text.includes('inter')) { edits.fontPair = 'inter-script'; applyFontPair(edits.fontPair); }
      else if (text.includes('italiana')) { edits.fontPair = 'italiana-pinyon'; applyFontPair(edits.fontPair); }

      if (text.includes('editorial')) { edits.mode = 'editorial'; setBodyMode('editorial'); }
      else if (text.includes('clasica') || text.includes('classic')) { edits.mode = 'classic'; setBodyMode('classic'); }

      if (Object.keys(edits).length) {
        window.__AA_LAST_DESIGN_TWEAKS__ = Object.assign({}, window.__AA_LAST_DESIGN_TWEAKS__ || DEFAULT_TWEAKS, edits);
        saveTweaks(edits);
        setTimeout(() => applyTweaks(window.__AA_LAST_DESIGN_TWEAKS__), 80);
        setTimeout(() => applyTweaks(window.__AA_LAST_DESIGN_TWEAKS__), 350);
      }
    }

    function colorPreview(p){
      return `<div style="display:flex;gap:6px;height:36px;margin-bottom:10px"><i style="flex:2;background:${p.vars.paper};border:1px solid rgba(0,0,0,.08);border-radius:3px"></i><i style="flex:1;background:${p.vars.deep};border-radius:3px"></i><i style="flex:1;background:${p.vars.main};border-radius:3px"></i><i style="flex:1;background:${p.vars.light};border-radius:3px"></i></div>`;
    }

    function injectLilacButton(){
      const panel = document.querySelector('.admin-panel.open');
      if (!panel || panel.querySelector('[data-aa-palette-key="lilac"]')) return;
      const active = panel.querySelector('.tabs button.on');
      const activeText = cleanText(active);
      const body = panel.querySelector('.body');
      if (!body || !(activeText.includes('diseno') || activeText.includes('design'))) return;

      const p = PASTEL.lilac;
      const btn = document.createElement('button');
      btn.type = 'button';
      btn.dataset.aaPaletteKey = 'lilac';
      btn.style.cssText = 'appearance:none;cursor:pointer;padding:14px;text-align:left;border:1px solid #9b82bd;background:#fff;border-radius:6px;display:flex;flex-direction:column;gap:10px;margin-top:4px;width:100%;';
      btn.innerHTML = colorPreview(p) + '<div style="display:flex;justify-content:space-between;align-items:baseline"><span style="font-family:var(--serif);font-size:14px;color:var(--ink);font-style:italic">Lila pastel</span><span class="micro" style="color:#9b82bd;font-size:9px">Nuevo</span></div>';

      const firstGrid = body.querySelector('div[style*="grid-template-columns"]');
      if (firstGrid) firstGrid.appendChild(btn);
      else body.insertBefore(btn, body.firstChild);
    }

    function paintDesignButtons(){
      injectLilacButton();
      document.querySelectorAll('.admin-panel button').forEach(btn => {
        const key = btn.dataset.aaPaletteKey || paletteKeyFromText(cleanText(btn));
        if (!key || !PASTEL[key] || btn.dataset.aaPastelReady === key) return;
        btn.dataset.aaPastelReady = key;
        const p = PASTEL[key].vars;
        btn.style.setProperty('background', `linear-gradient(135deg, ${p.paper} 0%, ${p.light} 58%, ${p.main} 100%)`, 'important');
        btn.style.setProperty('border-color', p.deep, 'important');
      });
    }

    document.addEventListener('click', function(ev){
      const btn = ev.target.closest && ev.target.closest('.admin-panel button');
      if (!btn) return;
      applyFromButton(btn);
    }, true);

    document.addEventListener('input', function(ev){
      const panel = ev.target.closest && ev.target.closest('.admin-panel');
      if (!panel || ev.target.type !== 'range') return;
      const value = parseInt(ev.target.value, 10);
      if (!Number.isFinite(value)) return;
      const edits = { watercolorIntensity: value };
      window.__AA_LAST_DESIGN_TWEAKS__ = Object.assign({}, window.__AA_LAST_DESIGN_TWEAKS__ || DEFAULT_TWEAKS, edits);
      saveTweaks(edits);
    }, true);

    const mo = new MutationObserver(() => paintDesignButtons());
    mo.observe(document.documentElement, { childList:true, subtree:true });

    applyTweaks(DEFAULT_TWEAKS);
    setTimeout(() => { paintDesignButtons(); applyTweaks(window.__AA_LAST_DESIGN_TWEAKS__ || DEFAULT_TWEAKS); }, 100);
    setTimeout(() => { paintDesignButtons(); applyTweaks(window.__AA_LAST_DESIGN_TWEAKS__ || DEFAULT_TWEAKS); }, 500);
    setInterval(() => { paintDesignButtons(); applyTweaks(window.__AA_LAST_DESIGN_TWEAKS__ || DEFAULT_TWEAKS); }, 2500);

    fetchContent().then(data => {
      const tweaks = data && data._tweaks ? data._tweaks : DEFAULT_TWEAKS;
      window.__AA_LAST_DESIGN_TWEAKS__ = applyTweaks(tweaks);
    }).catch(() => { window.__AA_LAST_DESIGN_TWEAKS__ = applyTweaks(DEFAULT_TWEAKS); });

    window.AAApplyDesignTweaks = applyTweaks;
  } catch(err) { console.error('[DesignLiveFix] disabled:', err); }
})();
