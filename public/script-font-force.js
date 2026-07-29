// script-font-force.js — force final typography after React render
(function forceScriptTypography(){
  if (window.__AA_SCRIPT_FONT_FORCE__) return;
  window.__AA_SCRIPT_FONT_FORCE__ = true;

  var scriptLink = document.createElement('link');
  scriptLink.rel = 'stylesheet';
  scriptLink.href = 'https://fonts.googleapis.com/css2?family=Great+Vibes&display=swap';
  document.head.appendChild(scriptLink);

  var buttonLink = document.createElement('link');
  buttonLink.rel = 'stylesheet';
  buttonLink.href = 'https://fonts.googleapis.com/css2?family=Montserrat:wght@300;400;500&display=swap';
  document.head.appendChild(buttonLink);

  var style = document.createElement('style');
  style.id = 'aa-script-font-force-style';
  style.textContent = `
    :root{
      --display-font:'Eyesome Script','Eyesome','Great Vibes','Snell Roundhand','Segoe Script',cursive!important;
      --button-font:'Glacial Indifference','GlacialIndifference','Montserrat','Avenir Next','Century Gothic','Helvetica Neue',Arial,sans-serif!important;
    }
    h1,h2,h3,.hero-title,.section-title,.micro,.kicker,.eyebrow,
    [class*="title"], [class*="Title"]{
      font-family:var(--display-font)!important;
      text-transform:none!important;
      font-stretch:normal!important;
      letter-spacing:.01em!important;
      font-weight:400!important;
    }
    button,.btn,a.btn,.btn-filled,.btn-ghost,
    input[type="button"],input[type="submit"],input[type="reset"]{
      font-family:var(--button-font)!important;
      text-transform:uppercase!important;
      font-stretch:normal!important;
      letter-spacing:.18em!important;
      font-weight:400!important;
      font-size:11px!important;
      line-height:1.2!important;
      padding-top:13px!important;
      padding-bottom:13px!important;
    }
    .hero-title{
      font-size:clamp(72px,14vw,168px)!important;
      line-height:.88!important;
    }
    .section-title,h2{
      font-size:clamp(52px,8vw,104px)!important;
      line-height:.9!important;
    }
    .micro,.kicker,.eyebrow{
      font-size:28px!important;
      line-height:1!important;
    }
    @media(max-width:720px){
      .hero-title{font-size:clamp(58px,17vw,92px)!important;}
      .section-title,h2{font-size:clamp(44px,13vw,66px)!important;}
      .micro,.kicker,.eyebrow{font-size:22px!important;}
      button,.btn,a.btn,.btn-filled,.btn-ghost{font-size:10px!important;letter-spacing:.16em!important;}
    }
  `;
  document.head.appendChild(style);

  function applyInline(){
    var scriptSelector = 'h1,h2,h3,.hero-title,.section-title,.micro,.kicker,.eyebrow';
    document.querySelectorAll(scriptSelector).forEach(function(el){
      el.style.setProperty('font-family', "'Eyesome Script','Eyesome','Great Vibes','Snell Roundhand','Segoe Script',cursive", 'important');
      el.style.setProperty('text-transform', 'none', 'important');
      el.style.setProperty('letter-spacing', '.01em', 'important');
      el.style.setProperty('font-weight', '400', 'important');
    });

    var buttonSelector = 'button,.btn,a.btn,.btn-filled,.btn-ghost,input[type="button"],input[type="submit"],input[type="reset"]';
    document.querySelectorAll(buttonSelector).forEach(function(el){
      el.style.setProperty('font-family', "'Glacial Indifference','GlacialIndifference','Montserrat','Avenir Next','Century Gothic','Helvetica Neue',Arial,sans-serif", 'important');
      el.style.setProperty('text-transform', 'uppercase', 'important');
      el.style.setProperty('letter-spacing', '.18em', 'important');
      el.style.setProperty('font-weight', '400', 'important');
      el.style.setProperty('font-size', '11px', 'important');
      el.style.setProperty('line-height', '1.2', 'important');
    });
  }

  applyInline();
  var observer = new MutationObserver(applyInline);
  observer.observe(document.documentElement, { childList:true, subtree:true });
  setTimeout(function(){ observer.disconnect(); applyInline(); }, 20000);
})();