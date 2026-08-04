// welcome-after-countdown.js — add welcome text after countdown section
(function addWelcomeAfterCountdown(){
  if (window.__AA_WELCOME_AFTER_COUNTDOWN__) return;
  window.__AA_WELCOME_AFTER_COUNTDOWN__ = true;

  var style = document.createElement('style');
  style.id = 'aa-welcome-after-countdown-style';
  style.textContent = `
    #aa-welcome-message{
      background:#fff!important;
      color:#050505!important;
      padding-top:72px!important;
      padding-bottom:96px!important;
      border-bottom:1px solid #e8e8e8!important;
    }
    #aa-welcome-message .aa-welcome-inner{
      width:min(860px, calc(100% - 40px));
      margin:0 auto;
      text-align:left;
    }
    #aa-welcome-message .aa-welcome-title{
      font-family:'Eyesome Script','Eyesome','Great Vibes','Snell Roundhand','Segoe Script',cursive!important;
      font-size:clamp(58px,9vw,108px)!important;
      line-height:.9!important;
      font-weight:400!important;
      letter-spacing:.01em!important;
      margin:0 0 34px!important;
      color:#050505!important;
      text-align:center;
      text-transform:none!important;
    }
    #aa-welcome-message .aa-welcome-copy{
      font-family:'TT Norms Pro Condensed Thin','TT Norms Pro Condensed','TT Norms Pro','Roboto Condensed','Arial Narrow','Helvetica Neue',Arial,sans-serif!important;
      font-size:clamp(17px,1.55vw,21px)!important;
      line-height:1.72!important;
      font-weight:300!important;
      letter-spacing:.01em!important;
      color:#111!important;
    }
    #aa-welcome-message .aa-welcome-copy p{
      margin:0 0 22px!important;
    }
    #aa-welcome-message .aa-welcome-signature{
      margin-top:38px!important;
      text-align:center;
    }
    #aa-welcome-message .aa-welcome-signature .aa-with-love{
      font-family:'TT Norms Pro Condensed Thin','TT Norms Pro Condensed','TT Norms Pro','Roboto Condensed','Arial Narrow','Helvetica Neue',Arial,sans-serif!important;
      font-size:15px!important;
      letter-spacing:.18em!important;
      text-transform:uppercase!important;
      margin-bottom:12px!important;
      color:#333!important;
    }
    #aa-welcome-message .aa-welcome-signature .aa-names{
      font-family:'Eyesome Script','Eyesome','Great Vibes','Snell Roundhand','Segoe Script',cursive!important;
      font-size:clamp(42px,6vw,72px)!important;
      line-height:1!important;
      color:#050505!important;
    }
    @media(max-width:720px){
      #aa-welcome-message{padding-top:58px!important;padding-bottom:76px!important;}
      #aa-welcome-message .aa-welcome-inner{width:min(100% - 30px, 860px);}
      #aa-welcome-message .aa-welcome-copy{font-size:17px!important;line-height:1.68!important;}
      #aa-welcome-message .aa-welcome-title{font-size:clamp(50px,15vw,76px)!important;}
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
      <div class="aa-welcome-inner">
        <h2 class="aa-welcome-title">Bienvenidos</h2>
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