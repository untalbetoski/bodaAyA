// event-place-images.js — disabled to restore stable admin editing
(function restoreStableEventEditing(){
  try {
    window.__AA_EVENT_PLACE_MEDIA_DISABLED__ = true;
    // Este módulo queda desactivado temporalmente porque interfería con el panel real de Eventos.
    // Las imágenes ya existentes vuelven a depender del panel principal sin inyección externa.
  } catch(e) {}
})();
