// welcome-after-countdown.js — add welcome text after countdown as an editorial section
(function addWelcomeAfterCountdown(){
  if (window.__AA_WELCOME_AFTER_COUNTDOWN__) return;
  window.__AA_WELCOME_AFTER_COUNTDOWN__ = true;

  var style = document.createElement('style');
  style.id = 'aa-welcome-after-countdown-style';
  style.textContent = `
    #aa-welcome-message{
      position:relative!important;
      overflow:hidden!important;
      background:transparent!important;
      background-color:transparent!important;
      background-image:none!important;
      color:var(--ink,#050505)!important;
      padding-top:96px!important;
      padding-bottom:112px!important;
      border-bottom:1px solid var(--line,#e8e8e8)!important;
    }
    #aa-welcome-message .inner{
      max-width:1120px!important;
      margin:0 auto!important;
      width:min(1120px, calc(100% - 48px))!important;
      background:transparent!important;
    }
    #aa-welcome-message .aa-section-head{
      text-align:center!important;
      margin:0 auto 62px!important;
      max-width:760px!important;
      background:transparent!important;
    }
    #aa-welcome-message .aa-welcome-title{
      font-family:'Eyesome Script','Eyesome','Great Vibes','Snell Roundhand','Segoe Script',cursive!important;
      font-size:clamp(58px,9vw,108px)!important;
      line-height:.9!important;
      font-weight:400!important;
      letter-spacing:.01em!important;
      margin:0!important;
      color:var(--ink,#050505)!important;
      text-align:center!important;
      text-transform:none!important;
    }
    #aa-welcome-message .aa-section-sub{
      margin:22px auto 0!important;
      max-width:620px!important;
      font-family:'TT Norms Pro Condensed Thin','TT Norms Pro Condensed','TT Norms Pro','Roboto Condensed','Arial Narrow','Helvetica Neue',Arial,sans-serif!important;
      font-size:18px!important;
      line-height:1.65!important;
      font-weight:300!important;
      color:var(--ink-soft,#1f1f1f)!important;
      font-style:italic!important;
    }
    #aa-welcome-message .aa-welcome-editorial{
      display:grid!important;
      grid-template-columns:minmax(220px,.7fr) minmax(0,1.3fr)!important;
      gap:56px!important;
      align-items:start!important;
      border-top:1px solid var(--line,#111)!important;
      border-bottom:1px solid var(--line,#111)!important;
      padding:58px 0!important;
      background:transparent!important;
      background-color:transparent!important;
      background-image:none!important;
    }
    #aa-welcome-message .aa-welcome-aside{
      position:sticky!important;
      top:96px!important;
      padding-right:28px!important;
      border-right:1px solid rgba(0,0,0,.18)!important;
      background:transparent!important;
    }
    #aa-welcome-message .aa-welcome-aside .aa-small-label{
      font-family:'Glacial Indifference','GlacialIndifference','Montserrat','Avenir Next','Century Gothic','Helvetica Neue',Arial,sans-serif!important;
      font-size:10px!important;
      letter-spacing:.22em!important;
      text-transform:uppercase!important;
      color:var(--ink,#050505)!important;
      margin-bottom:18px!important;
    }
    #aa-welcome-message .aa-welcome-aside .aa-side-script{
      font-family:'Eyesome Script','Eyesome','Great Vibes','Snell Roundhand','Segoe Script',cursive!important;
      font-size:clamp(42px,5vw,68px)!important;
      line-height:.95!important;
      color:var(--ink,#050505)!important;
      margin-bottom:28px!important;
    }
    #aa-welcome-message .aa-welcome-aside .aa-date-line{
      font-family:'Glacial Indifference','GlacialIndifference','Montserrat','Avenir Next','Century Gothic','Helvetica Neue',Arial,sans-serif!important;
      font-size:11px!important;
      letter-spacing:.18em!important;
      text-transform:uppercase!important;
      line-height:1.7!important;
      color:var(--ink-soft,#333)!important;
    }
    #aa-welcome-message .aa-welcome-copy{
      font-family:'TT Norms Pro Condensed Thin','TT Norms Pro Condensed','TT Norms Pro','Roboto Condensed','Arial Narrow','Helvetica Neue',Arial,sans-serif!important;
      font-size:clamp(17px,1.48vw,20px)!important;
      line-height:1.78!important;
      font-weight:300!important;
      letter-spacing:.01em!important;
      color:var(--ink-soft,#111)!important;
      background:transparent!important;
    }
    #aa-welcome-message .aa-welcome-copy p{
      margin:0 0 23px!important;
    }
    #aa-welcome-message .aa-welcome-copy p:first-child{
      font-family:'Eyesome Script','Eyesome','Great Vibes','Snell Roundhand','Segoe Script',cursive!important;
      font-size:clamp(34px,4vw,54px)!important;
      line-height:1!important;
      color:var(--ink,#050505)!important;
      margin-bottom:24px!important;
    }
    #aa-welcome-message .aa-welcome-signature{
      margin-top:46px!important;
      display:flex!important;
      justify-content:space-between!important;
      align-items:flex-end!important;
      gap:24px!important;
      padding-top:28px!important;
      border-top:1px solid rgba(0,0,0,.18)!important;
      background:transparent!important;
    }
    #aa-welcome-message .aa-welcome-signature .aa-with-love{
      font-family:'Glacial Indifference','GlacialIndifference','Montserrat','Avenir Next','Century Gothic','Helvetica Neue',Arial,sans-serif!important;
      font-size:10px!important;
      letter-spacing:.2em!important;
      text-transform:uppercase!important;
      color:var(--ink-soft,#333)!important;
    }
    #aa-welcome-message .aa-welcome-signature .aa-names{
      font-family:'Eyesome Script','Eyesome','Great Vibes','Snell Roundhand','Segoe Script',cursive!important;
      font-size:clamp(42px,5.5vw,74px)!important;
      line-height:1!important;
      color:var(--ink,#050505)!important;
      white-space:nowrap!important;
    }
    #aa-welcome-message .reveal{
      opacity:1!important;
      transform:none!important;
    }
    @media(max-width:820px){
      #aa-welcome-message{padding-top:76px!important;padding-bottom:86px!important;}
      #aa-welcome-message .inner{width:min(100% - 30px, 1120px)!important;}
      #aa-welcome-message .aa-section-head{margin-bottom:44px!important;}
      #aa-welcome-message .aa-welcome-editorial{grid-template-columns:1fr!important;gap:34px!important;padding:42px 0!important;}
      #aa-welcome-message .aa-welcome-aside{position:relative!important;top:auto!important;border-right:0!important;border-bottom:1px solid rgba(0,0,0,.18)!important;padding-right:0!important;padding-bottom:28px!important;}
      #aa-welcome-message .aa-welcome-copy{font-size:17px!important;line-height:1.7!important;}
      #aa-welcome-message .aa-welcome-signature{flex-direction:column!important;align-items:center!important;text-align:center!important;}
    }
  `;
  document.head.appendChild(style);

  function mount(){
    if (document.getElementById('aa-welcome-message')) return true;
    var countdown = document.getElementById('countdown');
    if (!countdown || !countdown.parentNode) return false;

    var section = document.createElement('section');
    section.className = 's';
    section.id = 'aa-welcome-message';
    section.innerHTML = `
      <div class="inner">
        <div class="aa-section-head reveal in">
          <h2 class="aa-welcome-title display">Bienvenidos</h2>
          <p class="aa-section-sub">Gracias por formar parte de nuestra historia y de este nuevo comienzo.</p>
        </div>
        <div class="aa-welcome-editorial reveal in">
          <aside class="aa-welcome-aside">
            <div class="aa-small-label">Andrea &amp; Alberto</div>
            <div class="aa-side-script">Oaxaca nos espera</div>
            <div class="aa-date-line">15, 16 y 17 de abril 2027<br/>Oaxaca, México</div>
          </aside>
          <article>
            <div class="aa-welcome-copy">
              <p>Querida familia y queridos amigos:</p>
              <p>Si hoy están aquí, es porque de alguna manera han formado parte de nuestra historia. Algunos nos vieron crecer, otros caminaron junto a nosotros en momentos importantes, y muchos llegaron para recordarnos que las mejores cosas de la vida siempre se construyen en compañía.</p>
              <p>El 16 de abril de 2027, en la maravillosa ciudad de Oaxaca, celebraremos el inicio de una nueva etapa. Más que una boda, será un encuentro de personas que amamos profundamente, un día para agradecer, abrazar, reír, recordar y crear nuevos recuerdos que permanecerán con nosotros para siempre.</p>
              <p>Creemos que el amor no une únicamente a dos personas; también entrelaza familias, fortalece amistades y nos recuerda que la verdadera riqueza de la vida está en quienes caminan a nuestro lado. Por eso, su presencia es el regalo más valioso que podríamos recibir.</p>
              <p>Cada palabra de aliento, cada abrazo, cada sonrisa y cada momento compartido han contribuido, de una u otra forma, a llevarnos hasta este día. Gracias por acompañarnos en nuestro pasado, por estar presentes en este momento tan especial y por ser parte del futuro que comenzamos a escribir juntos.</p>
              <p>Deseamos que disfruten cada instante de esta celebración tanto como nosotros hemos disfrutado imaginarla y prepararla. Queremos que Oaxaca, con su historia, su cultura y su calidez, sea el escenario perfecto para reunir a quienes ocupan un lugar especial en nuestro corazón.</p>
              <p>Gracias por recorrer este camino con nosotros. Que esta celebración esté llena de alegría, amor, esperanza y gratitud, y que cada momento vivido nos recuerde que los mejores recuerdos siempre nacen cuando compartimos la vida con las personas que más queremos.</p>
            </div>
            <div class="aa-welcome-signature">
              <div class="aa-with-love">Con todo nuestro cariño</div>
              <div class="aa-names">Andrea &amp; Alberto</div>
            </div>
          </article>
        </div>
      </div>
    `;
    countdown.insertAdjacentElement('afterend', section);
    return true;
  }

  if (!mount()) {
    var observer = new MutationObserver(function(){
      if (mount()) observer.disconnect();
    });
    observer.observe(document.documentElement, { childList:true, subtree:true });
    setTimeout(function(){ observer.disconnect(); mount(); }, 15000);
  }
})();