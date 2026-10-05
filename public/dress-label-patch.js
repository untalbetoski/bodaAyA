// dress-label-patch.js — final DOM patch for dress labels + traditional note
(function patchDressSection(){
  if (window.__AA_DRESS_LABEL_PATCH_V2__) return;
  window.__AA_DRESS_LABEL_PATCH_V2__ = true;

  var COLORS = [
    { es:'Naranja Anteado', en:'Sunset Orange' },
    { es:'Durazno', en:'Peach' },
    { es:'Amarillo', en:'Yellow' },
    { es:'Sandía', en:'Watermelon' },
    { es:'Rosa', en:'Pink' },
    { es:'Marfil', en:'Ivory' },
    { es:'Caqui', en:'Khaki' },
    { es:'Crudo', en:'Ecru' },
    { es:'Lino', en:'Linen' },
    { es:'Gris', en:'Gray' }
  ];

  function norm(text) {
    return String(text || '').normalize('NFD').replace(/[\u0300-\u036f]/g,'').replace(/\s+/g,' ').trim().toUpperCase();
  }

  function currentLang(){
    var enButton = Array.prototype.slice.call(document.querySelectorAll('.lang-toggle button')).find(function(b){
      return norm(b.textContent) === 'EN' && b.classList.contains('on');
    });
    return enButton ? 'en' : 'es';
  }

  function applyPatch(){
    var section=document.querySelector('#dress');
    if(!section) return false;
    var lang=currentLang();

    // Find the 10 color captions by their known ES/EN text, regardless of component/class.
    var names={};
    COLORS.forEach(function(x){ names[norm(x.es)]=x; names[norm(x.en)]=x; });
    var nodes=Array.prototype.slice.call(section.querySelectorAll('div,span,p'));
    var labels=nodes.filter(function(el){
      if(el.children.length) return false;
      return !!names[norm(el.textContent)];
    });

    labels.forEach(function(el){
      var item=names[norm(el.textContent)];
      el.textContent=item[lang];
      el.classList.add('dress-swatch-label-final');
      el.style.setProperty('font-family','Arial, sans-serif','important');
      el.style.setProperty('font-size','6px','important');
      el.style.setProperty('font-weight','400','important');
      el.style.setProperty('letter-spacing','0','important');
      el.style.setProperty('text-transform','none','important');
      el.style.setProperty('white-space','nowrap','important');
      el.style.setProperty('line-height','1','important');
      el.style.setProperty('text-align','center','important');
    });

    // Keep existing second-card A EVITAR -> Nota behavior.
    var avoid=Array.prototype.slice.call(section.querySelectorAll('.micro')).filter(function(el){
      var t=norm(el.textContent); return t==='A EVITAR'||t==='AVOID'||t==='NOTA'||t==='NOTE';
    });
    if(avoid.length>=2) avoid[1].textContent=lang==='en'?'Note':'Nota';
    return labels.length>0;
  }

  function start(){
    applyPatch();
    var root=document.getElementById('root')||document.body;
    if(window.MutationObserver&&root){
      var pending=false;
      new MutationObserver(function(){
        if(pending) return; pending=true;
        requestAnimationFrame(function(){ pending=false; applyPatch(); });
      }).observe(root,{childList:true,subtree:true,characterData:true,attributes:true,attributeFilter:['class']});
    }
    document.addEventListener('click',function(e){
      if(e.target&&e.target.closest&&e.target.closest('.lang-toggle')) setTimeout(applyPatch,0);
    },true);
    setInterval(applyPatch,1000);
  }
  if(document.readyState==='loading') document.addEventListener('DOMContentLoaded',start); else start();
})();