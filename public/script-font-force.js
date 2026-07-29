// script-font-force.js — force script typography after React render
(function forceScriptTypography(){
  if (window.__AA_SCRIPT_FONT_FORCE__) return;
  window.__AA_SCRIPT_FONT_FORCE__ = true;

  var fontLink = document.createElement('link');
  fontLink.rel = 'stylesheet';
  fontLink.href = 'https://fonts.googleapis.com/css2?family=Great+Vibes&display=swap';
  document.head.appendChild(fontLink);

  var style = document.createElement('style');
  style.id = 'aa-script-font-force-style';
  style.textContent = `
    :root{
      --display-font:'Beautifully Delicious Script','Beautifully Delicious','Great Vibes','Snell Roundhand','Segoe Script',cursive!important;
    }
    h1,h2,h3,.hero-title,.section-title,.micro,.kicker,.eyebrow,
    button,.btn,a.btn,.btn-filled,.btn-ghost,
    [class*="title"],[class*="Title"]{
      font-family:var(--display-font)!important;
      text-transform:none!important;
      font-stretch:normal!important;
      letter-spacing:.01em!important;
      font-weight:400!important;
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
    button,.btn,a.btn,.btn-filled,.btn-ghost{
      font-size:24px!important;
      line-height:1!important;
      padding-top:12px!important;
      padding-bottom:12px!important;
    }
    @media(max-width:720px){
      .hero-title{font-size:clamp(58px,17vw,92px)!important;}
      .section-title,h2{font-size:clamp(44px,13vw,66px)!important;}
      .micro,.kicker,.eyebrow{font-size:22px!important;}
      button,.btn,a.btn,.btn-filled,.btn-ghost{font-size:21px!important;}
    }
  `;
  document.head.appendChild(style);

  function applyInline(){
    var selector = 'h1,h2,h3,.hero-title,.section-title,.micro,.kicker,.eyebrow,button,.btn,a.btn,.btn-filled,.btn-ghost';
    document.querySelectorAll(selector).forEach(function(el){
      el.style.setProperty('font-family', "'Beautifully Delicious Script','Beautifully Delicious','Great Vibes','Snell Roundhand','Segoe Script',cursive", 'important');
      el.style.setProperty('text-transform', 'none', 'important');
      el.style.setProperty('letter-spacing', '.01em', 'important');
      el.style.setProperty('font-weight', '400', 'important');
    });
  }

  applyInline();
  var observer = new MutationObserver(applyInline);
  observer.observe(document.documentElement, { childList:true, subtree:true });
  setTimeout(function(){ observer.disconnect(); applyInline(); }, 20000);
})();