// script-font-force.js — force final typography after React render
(function forceScriptTypography(){
  if (window.__AA_SCRIPT_FONT_FORCE__) return;
  window.__AA_SCRIPT_FONT_FORCE__ = true;

  var fontLink = document.createElement('link');
  fontLink.rel = 'stylesheet';
  fontLink.href = 'https://fonts.googleapis.com/css2?family=Oooh+Baby&family=Montserrat:wght@300;400;500;600&display=swap';
  document.head.appendChild(fontLink);

  var style = document.createElement('style');
  style.id = 'aa-script-font-force-style';
  style.textContent = `
    :root{
      --display-font:'Oooh Baby','Eyesome Script','Great Vibes','Snell Roundhand','Segoe Script',cursive!important;
      --button-font:'Montserrat','Glacial Indifference','Avenir Next','Century Gothic','Helvetica Neue',Arial,sans-serif!important;
    }
    h1,h2,h3,.hero-title,.section-title,[class*="title"],[class*="Title"]{
      font-family:var(--display-font)!important;
      text-transform:none!important;
      font-stretch:normal!important;
      letter-spacing:.005em!important;
      font-weight:400!important;
    }
    .micro,.kicker,.eyebrow{
      font-family:var(--button-font)!important;
      text-transform:uppercase!important;
      letter-spacing:.22em!important;
      font-weight:500!important;
      font-size:11px!important;
      line-height:1.25!important;
    }
    button,.btn,a.btn,.btn-filled,.btn-ghost,
    input[type="button"],input[type="submit"],input[type="reset"]{
      font-family:var(--button-font)!important;
      text-transform:uppercase!important;
      font-stretch:normal!important;
      letter-spacing:.18em!important;
      font-weight:500!important;
      font-size:11px!important;
      line-height:1.2!important;
      padding-top:13px!important;
      padding-bottom:13px!important;
    }
    .hero-title{font-size:clamp(82px,15vw,188px)!important;line-height:.86!important;}
    .section-title,h2{font-size:clamp(58px,8.5vw,118px)!important;line-height:.86!important;}
    @media(max-width:720px){
      .hero-title{font-size:clamp(66px,19vw,106px)!important;}
      .section-title,h2{font-size:clamp(48px,15vw,76px)!important;}
      .micro,.kicker,.eyebrow{font-size:10px!important;letter-spacing:.18em!important;}
      button,.btn,a.btn,.btn-filled,.btn-ghost{font-size:10px!important;letter-spacing:.16em!important;}
    }
  `;
  document.head.appendChild(style);

  function applyInline(){
    var scriptSelector = 'h1,h2,h3,.hero-title,.section-title';
    document.querySelectorAll(scriptSelector).forEach(function(el){
      el.style.setProperty('font-family', "'Oooh Baby','Eyesome Script','Great Vibes','Snell Roundhand','Segoe Script',cursive", 'important');
      el.style.setProperty('text-transform', 'none', 'important');
      el.style.setProperty('letter-spacing', '.005em', 'important');
      el.style.setProperty('font-weight', '400', 'important');
    });

    var metaSelector = '.micro,.kicker,.eyebrow';
    document.querySelectorAll(metaSelector).forEach(function(el){
      el.style.setProperty('font-family', "'Montserrat','Glacial Indifference','Avenir Next','Century Gothic','Helvetica Neue',Arial,sans-serif", 'important');
      el.style.setProperty('text-transform', 'uppercase', 'important');
      el.style.setProperty('letter-spacing', '.22em', 'important');
      el.style.setProperty('font-weight', '500', 'important');
      el.style.setProperty('font-size', '11px', 'important');
      el.style.setProperty('line-height', '1.25', 'important');
    });

    var buttonSelector = 'button,.btn,a.btn,.btn-filled,.btn-ghost,input[type="button"],input[type="submit"],input[type="reset"]';
    document.querySelectorAll(buttonSelector).forEach(function(el){
      el.style.setProperty('font-family', "'Montserrat','Glacial Indifference','Avenir Next','Century Gothic','Helvetica Neue',Arial,sans-serif", 'important');
      el.style.setProperty('text-transform', 'uppercase', 'important');
      el.style.setProperty('letter-spacing', '.18em', 'important');
      el.style.setProperty('font-weight', '500', 'important');
      el.style.setProperty('font-size', '11px', 'important');
      el.style.setProperty('line-height', '1.2', 'important');
    });
  }

  applyInline();
  var observer = new MutationObserver(applyInline);
  observer.observe(document.documentElement, { childList:true, subtree:true });
  setTimeout(function(){ observer.disconnect(); applyInline(); }, 20000);
})();