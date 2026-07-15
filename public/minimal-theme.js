// minimal-theme.js
(function(){
  if (window.__AA_MINIMAL_THEME__) return;
  window.__AA_MINIMAL_THEME__ = true;
  var style = document.createElement('style');
  style.textContent = `
    :root{
      --paper:#ffffff!important;
      --paper-2:#ffffff!important;
      --ink:#050505!important;
      --ink-soft:#222222!important;
      --muted:#666666!important;
      --sage:#111111!important;
      --sage-deep:#000000!important;
      --line:rgba(0,0,0,.14)!important;
      --shadow:none!important;
      --serif:"Inter","Helvetica Neue",Arial,sans-serif!important;
      --sans:"Inter","Helvetica Neue",Arial,sans-serif!important;
    }
    html,body,#root{background:#fff!important;color:#050505!important;font-family:"Inter","Helvetica Neue",Arial,sans-serif!important;}
    body{background:#fff!important;}
    .s,section,.inner{background:transparent!important;color:#050505!important;}
    h1,h2,h3,.hero-title,.section-title{font-family:"Inter","Helvetica Neue",Arial,sans-serif!important;font-style:normal!important;font-weight:500!important;letter-spacing:-.045em!important;color:#050505!important;}
    .hero-title{font-size:clamp(54px,10vw,132px)!important;line-height:.92!important;}
    h2,.section-title{font-size:clamp(34px,5vw,72px)!important;line-height:1!important;}
    p,li,.sub,.lead,.meta{font-family:"Inter","Helvetica Neue",Arial,sans-serif!important;font-style:normal!important;color:#222!important;letter-spacing:0!important;}
    .micro,.kicker,[class*="micro"],[class*="kicker"]{font-family:"Inter","Helvetica Neue",Arial,sans-serif!important;font-size:10px!important;font-weight:600!important;letter-spacing:.16em!important;text-transform:uppercase!important;color:#000!important;font-style:normal!important;}
    .btn,button,a.btn,.btn-filled,.btn-outline{background:#fff!important;color:#050505!important;border:1px solid #050505!important;border-radius:0!important;font-family:"Inter","Helvetica Neue",Arial,sans-serif!important;font-size:11px!important;font-weight:600!important;letter-spacing:.14em!important;text-transform:uppercase!important;box-shadow:none!important;}
    .btn:hover,button:hover,a.btn:hover,.btn-filled:hover,.btn-outline:hover{background:#050505!important;color:#fff!important;}
    .card,.panel,.modal,.drawer,.rsvp-card,.event-card,.dr-card{background:#fff!important;border:1px solid rgba(0,0,0,.14)!important;border-radius:0!important;box-shadow:none!important;color:#050505!important;}
    input,textarea,select{background:#fff!important;color:#050505!important;border:1px solid rgba(0,0,0,.18)!important;border-radius:0!important;font-family:"Inter","Helvetica Neue",Arial,sans-serif!important;}
    header,nav,.nav{background:rgba(255,255,255,.96)!important;border-bottom:1px solid rgba(0,0,0,.08)!important;box-shadow:none!important;}
    svg[style*="opacity"],.aa-corner-monogram{display:none!important;}
    iframe,img{border-radius:0!important;}
    footer{background:#fff!important;color:#050505!important;border-top:1px solid rgba(0,0,0,.1)!important;}
    @media(max-width:720px){.hero-title{font-size:clamp(46px,15vw,78px)!important}.inner{padding-left:22px!important;padding-right:22px!important}}
  `;
  document.head.appendChild(style);
})();