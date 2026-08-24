// welcome-after-countdown.js — data-driven welcome section after countdown
(function addWelcomeAfterCountdown(){
  try {
    if (window.__AA_WELCOME_AFTER_COUNTDOWN_V2__) return;
    window.__AA_WELCOME_AFTER_COUNTDOWN_V2__ = true;

    const DEFAULT_WELCOME = {
      title_es:'Bienvenidos',
      subtitle_es:'Gracias por formar parte de nuestra historia y de este nuevo comienzo.',
      aside_label:'Andrea & Alberto',
      aside_title_es:'Oaxaca nos espera',
      aside_date_es:'15, 16 y 17 de abril 2027',
      aside_place_es:'Oaxaca, México',
      greeting_es:'Querida familia y queridos amigos:',
      body_es:'Si hoy están aquí, es porque de alguna manera han formado parte de nuestra historia. Algunos nos vieron crecer, otros caminaron junto a nosotros en momentos importantes, y muchos llegaron para recordarnos que las mejores cosas de la vida siempre se construyen en compañía.\n\nEl 16 de abril de 2027, en la maravillosa ciudad de Oaxaca, celebraremos el inicio de una nueva etapa. Más que una boda, será un encuentro de personas que amamos profundamente, un día para agradecer, abrazar, reír, recordar y crear nuevos recuerdos que permanecerán con nosotros para siempre.\n\nCreemos que el amor no une únicamente a dos personas; también entrelaza familias, fortalece amistades y nos recuerda que la verdadera riqueza de la vida está en quienes caminan a nuestro lado. Por eso, su presencia es el regalo más valioso que podríamos recibir.\n\nCada palabra de aliento, cada abrazo, cada sonrisa y cada momento compartido han contribuido, de una u otra forma, a llevarnos hasta este día. Gracias por acompañarnos en nuestro pasado, por estar presentes en este momento tan especial y por ser parte del futuro que comenzamos a escribir juntos.\n\nDeseamos que disfruten cada instante de esta celebración tanto como nosotros hemos disfrutado imaginarla y prepararla. Queremos que Oaxaca, con su historia, su cultura y su calidez, sea el escenario perfecto para reunir a quienes ocupan un lugar especial en nuestro corazón.\n\nGracias por recorrer este camino con nosotros. Que esta celebración esté llena de alegría, amor, esperanza y gratitud, y que cada momento vivido nos recuerde que los mejores recuerdos siempre nacen cuando compartimos la vida con las personas que más queremos.',
      sign_label_es:'Con todo nuestro cariño',
      signature:'Andrea & Alberto'
    };

    let welcome = Object.assign({}, DEFAULT_WELCOME);
    let mounted = false;

    function esc(v){ return String(v == null ? '' : v).replace(/[&<>"']/g, function(ch){ return {'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[ch]; }); }
    function normalize(data){ return Object.assign({}, DEFAULT_WELCOME, (data && data.welcome) || {}); }

    function addStyle(){
      if (document.getElementById('aa-welcome-after-countdown-style')) return;
      var style = document.createElement('style');
      style.id = 'aa-welcome-after-countdown-style';
      style.textContent = `
        #aa-welcome-message{position:relative!important;overflow:hidden!important;background:transparent!important;color:var(--ink,#050505)!important;padding-top:96px!important;padding-bottom:112px!important;border-bottom:1px solid var(--line,#e8e8e8)!important;}
        #aa-welcome-message .inner{max-width:1120px!important;margin:0 auto!important;width:min(1120px,calc(100% - 48px))!important;background:transparent!important;}
        #aa-welcome-message .aa-section-head{text-align:center!important;margin:0 auto 62px!important;max-width:760px!important;background:transparent!important;}
        #aa-welcome-message .aa-welcome-title{font-family:'Eyesome Script','Eyesome','Great Vibes','Snell Roundhand','Segoe Script',cursive!important;font-size:clamp(58px,9vw,108px)!important;line-height:.9!important;font-weight:400!important;letter-spacing:.01em!important;margin:0!important;color:var(--ink,#050505)!important;text-align:center!important;text-transform:none!important;}
        #aa-welcome-message .aa-section-sub{margin:22px auto 0!important;max-width:620px!important;font-family:'TT Norms Pro Condensed Thin','TT Norms Pro Condensed','TT Norms Pro','Roboto Condensed','Arial Narrow','Helvetica Neue',Arial,sans-serif!important;font-size:18px!important;line-height:1.65!important;font-weight:300!important;color:var(--ink-soft,#1f1f1f)!important;font-style:italic!important;}
        #aa-welcome-message .aa-welcome-editorial{display:grid!important;grid-template-columns:minmax(220px,.7fr) minmax(0,1.3fr)!important;gap:56px!important;align-items:start!important;border-top:1px solid var(--line,#111)!important;border-bottom:1px solid var(--line,#111)!important;padding:58px 0!important;background:transparent!important;}
        #aa-welcome-message .aa-welcome-aside{position:sticky!important;top:96px!important;padding-right:28px!important;border-right:1px solid rgba(0,0,0,.18)!important;background:transparent!important;}
        #aa-welcome-message .aa-small-label{font-family:'Glacial Indifference','GlacialIndifference','Montserrat','Avenir Next','Century Gothic','Helvetica Neue',Arial,sans-serif!important;font-size:10px!important;letter-spacing:.22em!important;text-transform:uppercase!important;color:var(--ink,#050505)!important;margin-bottom:18px!important;}
        #aa-welcome-message .aa-side-script{font-family:'Eyesome Script','Eyesome','Great Vibes','Snell Roundhand','Segoe Script',cursive!important;font-size:clamp(42px,5vw,68px)!important;line-height:.95!important;color:var(--ink,#050505)!important;margin-bottom:28px!important;}
        #aa-welcome-message .aa-date-line{font-family:'Glacial Indifference','GlacialIndifference','Montserrat','Avenir Next','Century Gothic','Helvetica Neue',Arial,sans-serif!important;font-size:11px!important;letter-spacing:.18em!important;text-transform:uppercase!important;line-height:1.7!important;color:var(--ink-soft,#333)!important;}
        #aa-welcome-message .aa-welcome-copy{font-family:'TT Norms Pro Condensed Thin','TT Norms Pro Condensed','TT Norms Pro','Roboto Condensed','Arial Narrow','Helvetica Neue',Arial,sans-serif!important;font-size:clamp(17px,1.48vw,20px)!important;line-height:1.78!important;font-weight:300!important;letter-spacing:.01em!important;color:var(--ink-soft,#111)!important;background:transparent!important;}
        #aa-welcome-message .aa-welcome-copy p{margin:0 0 23px!important;}
        #aa-welcome-message .aa-welcome-copy p:first-child{font-family:'Eyesome Script','Eyesome','Great Vibes','Snell Roundhand','Segoe Script',cursive!important;font-size:clamp(34px,4vw,54px)!important;line-height:1!important;color:var(--ink,#050505)!important;margin-bottom:24px!important;}
        #aa-welcome-message .aa-welcome-signature{margin-top:46px!important;display:flex!important;justify-content:space-between!important;align-items:flex-end!important;gap:24px!important;padding-top:28px!important;border-top:1px solid rgba(0,0,0,.18)!important;background:transparent!important;}
        #aa-welcome-message .aa-with-love{font-family:'Glacial Indifference','GlacialIndifference','Montserrat','Avenir Next','Century Gothic','Helvetica Neue',Arial,sans-serif!important;font-size:10px!important;letter-spacing:.2em!important;text-transform:uppercase!important;color:var(--ink-soft,#333)!important;}
        #aa-welcome-message .aa-names{font-family:'Eyesome Script','Eyesome','Great Vibes','Snell Roundhand','Segoe Script',cursive!important;font-size:clamp(42px,5.5vw,74px)!important;line-height:1!important;color:var(--ink,#050505)!important;white-space:nowrap!important;}
        #aa-welcome-message .reveal{opacity:1!important;transform:none!important;}
        @media(max-width:820px){#aa-welcome-message{padding-top:76px!important;padding-bottom:86px!important;}#aa-welcome-message .inner{width:min(100% - 30px,1120px)!important;}#aa-welcome-message .aa-section-head{margin-bottom:44px!important;}#aa-welcome-message .aa-welcome-editorial{grid-template-columns:1fr!important;gap:34px!important;padding:42px 0!important;}#aa-welcome-message .aa-welcome-aside{position:relative!important;top:auto!important;border-right:0!important;border-bottom:1px solid rgba(0,0,0,.18)!important;padding-right:0!important;padding-bottom:28px!important;}#aa-welcome-message .aa-welcome-copy{font-size:17px!important;line-height:1.7!important;}#aa-welcome-message .aa-welcome-signature{flex-direction:column!important;align-items:center!important;text-align:center!important;}}
      `;
      document.head.appendChild(style);
    }

    function apply(){
      var section = document.getElementById('aa-welcome-message');
      if (!section) return;
      function text(sel, value){ var el = section.querySelector(sel); if (el) el.textContent = value || ''; }
      text('.aa-welcome-title', welcome.title_es);
      text('.aa-section-sub', welcome.subtitle_es);
      text('.aa-small-label', welcome.aside_label);
      text('.aa-side-script', welcome.aside_title_es);
      var date = section.querySelector('.aa-date-line');
      if (date) date.innerHTML = esc(welcome.aside_date_es) + '<br/>' + esc(welcome.aside_place_es);
      var copy = section.querySelector('.aa-welcome-copy');
      if (copy) {
        var parts = [welcome.greeting_es].concat(String(welcome.body_es || '').split(/\n\s*\n/)).filter(Boolean);
        copy.innerHTML = parts.map(function(p){ return '<p>' + esc(p) + '</p>'; }).join('');
      }
      text('.aa-with-love', welcome.sign_label_es);
      text('.aa-names', welcome.signature);
    }

    function mount(){
      if (document.getElementById('aa-welcome-message')) { apply(); return true; }
      var countdown = document.getElementById('countdown');
      if (!countdown || !countdown.parentNode) return false;
      var section = document.createElement('section');
      section.className = 's';
      section.id = 'aa-welcome-message';
      section.innerHTML = '<div class="inner"><div class="aa-section-head reveal in"><h2 class="aa-welcome-title display"></h2><p class="aa-section-sub"></p></div><div class="aa-welcome-editorial reveal in"><aside class="aa-welcome-aside"><div class="aa-small-label"></div><div class="aa-side-script"></div><div class="aa-date-line"></div></aside><article><div class="aa-welcome-copy"></div><div class="aa-welcome-signature"><div class="aa-with-love"></div><div class="aa-names"></div></div></article></div></div>';
      countdown.insertAdjacentElement('afterend', section);
      mounted = true;
      apply();
      return true;
    }

    async function loadSaved(){
      try {
        if (window.MockServer && typeof window.MockServer.getContent === 'function') {
          var r = await window.MockServer.getContent();
          if (r && r.data) welcome = normalize(r.data);
        } else {
          var res = await fetch('/api/content', { cache:'no-store' });
          var json = await res.json().catch(function(){ return {}; });
          if (json && json.data) welcome = normalize(json.data);
        }
      } catch(e) {}
      apply();
    }

    addStyle();
    loadSaved();
    if (!mount()) {
      var observer = new MutationObserver(function(){ if (mount()) observer.disconnect(); });
      observer.observe(document.documentElement, { childList:true, subtree:true });
      setTimeout(function(){ observer.disconnect(); mount(); }, 15000);
    }

    window.addEventListener('aa:content-updated', function(e){
      welcome = normalize((e && e.detail && e.detail.data) || {});
      apply();
    });
  } catch(err) {
    console.error('[WelcomeAfterCountdown] disabled after error:', err);
  }
})();