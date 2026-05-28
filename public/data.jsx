// data.jsx — default content, i18n strings, y backend mejorado

const DEFAULT_DATA = {
  couple: { a: "Andrea", b: "Alberto", and: "&" },
  tagline_es: "Nos casamos",
  tagline_en: "We're getting married",
  date: { iso: "2027-04-16T16:30:00-06:00", day: "16", month_es: "Abril", month_en: "April", year: "2027", weekday_es: "Viernes", weekday_en: "Friday" },
  date2: { iso: "2027-04-17T13:00:00-06:00", day: "17", weekday_es: "Sábado", weekday_en: "Saturday" },
  city_es: "Oaxaca de Juárez, México",
  city_en: "Oaxaca de Juárez, Mexico",

  ceremony: {
    title_es: "Ceremonia",
    title_en: "Ceremony",
    iso: "2027-04-16T16:30:00-06:00",
    date_es: "Viernes 16 de Abril, 2027 · 16:30 h",
    date_en: "Friday, April 16th 2027 · 4:30 pm",
    venue: "Templo de Santo Domingo de Guzmán",
    address_es: "Calle de Macedonio Alcalá s/n, Centro Histórico, Oaxaca de Juárez",
    address_en: "Macedonio Alcalá Street, Historic Center, Oaxaca de Juárez",
    map: "https://www.openstreetmap.org/export/embed.html?bbox=-96.7270,17.0660,-96.7220,17.0700&layer=mapnik&marker=17.0680,-96.7245",
    note_es: "La ceremonia comenzará puntualmente a las 16:30 h. Te pedimos llegar a las 16:00 h para recibir a los invitados.",
    note_en: "Ceremony starts promptly at 4:30 pm. Please arrive by 4:00 pm — guests are welcomed beforehand.",
  },
  reception: {
    title_es: "Recepción",
    title_en: "Reception",
    iso: "2027-04-16T18:00:00-06:00",
    date_es: "Viernes 16 de Abril, 2027 · 18:00 h",
    date_en: "Friday, April 16th 2027 · 6:00 pm",
    venue: "Cardenal Oaxaca Social Venue",
    address_es: "Oaxaca de Juárez, Oaxaca",
    address_en: "Oaxaca de Juárez, Oaxaca",
    map: "https://www.openstreetmap.org/export/embed.html?bbox=-96.7400,17.0500,-96.7200,17.0700&layer=mapnik&marker=17.0600,-96.7300",
    note_es: "Cena, brindis y baile hasta las 02:00 h. Habrá transporte desde el centro.",
    note_en: "Dinner, toasts and dancing until 2:00 am. Shuttle provided from downtown.",
  },

  traditional: {
    title_es: "Boda Tradicional Oaxaqueña",
    title_en: "Traditional Oaxacan Wedding",
    iso: "2027-04-17T11:00:00-06:00",
    date_es: "Sábado 17 de Abril, 2027 · 11:00 h",
    date_en: "Saturday, April 17th 2027 · 11:00 am",
    venue: "Celebración Tradicional",
    address_es: "Oaxaca de Juárez, Oaxaca",
    address_en: "Oaxaca de Juárez, Oaxaca",
    map: "https://www.openstreetmap.org/export/embed.html?bbox=-96.7400,17.0500,-96.7200,17.0700&layer=mapnik&marker=17.0650,-96.7280",
    note_es: "Celebración con calenda, marmota, chocolate, mole y mezcal. Atuendo cómodo y festivo.",
    note_en: "Celebration with calenda, marmota, chocolate, mole and mezcal. Festive, comfortable attire.",
  },

  dress: {
    code_es: "Formal Primaveral",
    code_en: "Spring Formal",
    day_es: "Viernes · Ceremonia y Recepción",
    day_en: "Friday · Ceremony & Reception",
    desc_es: "Para ellas: vestido largo o midi en tonos pastel. Para ellos: traje formal en lino o algodón, corbata opcional.",
    desc_en: "She: long or midi dress in pastel tones. He: formal suit in linen or cotton, tie optional.",
    avoid_es: "Por favor evita el blanco, el amarillo y el rojo.",
    avoid_en: "Please avoid white, yellow and red.",
  },

  dress2: {
    code_es: "Tradicional Oaxaqueño",
    code_en: "Traditional Oaxacan",
    day_es: "Sábado · Boda Tradicional",
    day_en: "Saturday · Traditional Wedding",
    desc_es: "Para ellos: guayabera blanca o de color claro con pantalón negro o caqui.             Para ellas: vestimenta tradicional de tehuana — huipil bordado, enagua larga y resplandor.",
    desc_en: "Men: white or light guayabera with black or khaki trousers.                        Women: traditional Tehuana attire — embroidered huipil, long skirt, and resplandor headpiece.",
    avoid_es: "Si no tienes vestimenta tradicional, elige colores festivos y zapato cómodo: habrá calenda.",
    avoid_en: "If you don't have traditional dress, choose festive colors and comfortable shoes — there will be a calenda parade.",
  },

  itinerary: [
    { time:"16:00", title_es:"Recepción de invitados", title_en:"Guest reception", icon:"❋" },
    { time:"16:30", title_es:"Ceremonia religiosa", title_en:"Religious ceremony", icon:"❋" },
    { time:"18:00", title_es:"Cóctel y recepción", title_en:"Cocktail & reception", icon:"❋" },
    { time:"11:00", title_es:"Boda Tradicional Oaxaqueña", title_en:"Traditional Oaxacan Wedding", icon:"❋" },
    { time:"13:00", title_es:"Calenda y marmota", title_en:"Calenda & marmota parade", icon:"❋" },
    { time:"15:00", title_es:"Comida y mezcal", title_en:"Lunch & mezcal", icon:"❋" },
    { time:"18:00", title_es:"Cierre con baile", title_en:"Closing dance", icon:"❋" },
  ],

  rsvp: {
    deadline_es: "Confirma antes del 1 de marzo, 2027",
    deadline_en: "Please RSVP by March 1st, 2027",
    reservahub_url: "https://reservahub.com.mx/api/public/events/boda-andrea-y-alberto/og",
    event_slug: "boda-andrea-y-alberto",
  },

  gifts: {
    title_es: "Mesa de regalos",
    title_en: "Gift registry",
    note_es: "Tu presencia es nuestro mejor regalo. Si deseas hacernos un detalle adicional:",
    note_en: "Your presence is the greatest gift. If you'd like to give us a token:",
    items: [
      { label:"Liverpool", code:"51234567", url:"https://mesaderegalos.liverpool.com.mx" },
      { label:"Amazon",    code:"andrea-alberto-2027", url:"https://www.amazon.com.mx/wedding" },
      { label_es:"Luna de miel", label_en:"Honeymoon fund", code:"BBVA · 0123 4567 8901 2345", url:"" },
    ],
  },

  lodging: [
    { name:"Quinta Real Oaxaca", tier_es:"5 estrellas", tier_en:"5 stars", rate_es:"Tarifa preferencial", rate_en:"Preferred rate", code:"BODA-AYA", url:"https://www.quintareal.com" },
    { name:"Hotel Azul de Oaxaca", tier_es:"Boutique", tier_en:"Boutique", rate_es:"15% descuento", rate_en:"15% off", code:"ANDREAALBERTO", url:"https://hotelazuloaxaca.com" },
    { name:"Casa Oaxaca El Restaurante", tier_es:"Boutique", tier_en:"Boutique", rate_es:"Tarifa boda", rate_en:"Wedding rate", code:"AAB27", url:"https://casaoaxaca.com.mx" },
  ],

  gallery: [
    { ph:"01 · El primer café", img:"" },
    { ph:"02 · Roma Norte, 2022", img:"" },
    { ph:"03 · Costa de Oaxaca", img:"" },
    { ph:"04 · Cumpleaños 30", img:"" },
    { ph:"05 · La propuesta", img:"" },
    { ph:"06 · El anillo", img:"" },
  ],

  playlist: {
    title_es: "Sugiérenos una canción",
    title_en: "Suggest a song",
    note_es: "Cuéntanos qué canción te haría salir a la pista. La leeremos todas.",
    note_en: "Tell us what song would get you on the dance floor. We'll read them all.",
    seed: [
      { song:"At Last", artist:"Etta James" },
      { song:"Águas de Março", artist:"Elis Regina & Tom Jobim" },
      { song:"Como la flor", artist:"Selena" },
      { song:"This Must Be the Place", artist:"Talking Heads" },
    ],
  },

  closing: {
    quote_es: "Y de pronto, supimos que todos los caminos llevaban aquí.",
    quote_en: "And suddenly, we knew every road led here.",
    sign_es: "Con amor, los novios y sus padres",
    sign_en: "With love, the couple and their parents",
  },

  parents: {
    bride_es: "Virginia Curioca · Abel Hernández †",
    bride_en: "Virginia Curioca · Abel Hernández †",
    groom_es: "Mercedes Martínez · Mario Alberto Serrano",
    groom_en: "Mercedes Martínez · Mario Alberto Serrano",
  },

  admin_password: "boda2027",
};

// i18n labels
const I18N = {
  es: {
    nav: { home:"Inicio", details:"Detalles", program:"Programa", rsvp:"RSVP", gallery:"Galería", more:"Más" },
    save_the_date: "Reserva la fecha",
    count_days:"días", count_hrs:"horas", count_min:"min", count_sec:"seg",
    program_kicker: "El programa",
    program_title: "Cómo viviremos estos dos días",
    program_day1: "Viernes 16 · Ceremonia y Recepción",
    program_day2: "Sábado 17 · Boda Tradicional",
    dress_kicker: "Código de vestimenta",
    dress_avoid: "A evitar",
    rsvp_kicker: "Confirmación de asistencia",
    rsvp_title: "Confírmanos tu presencia",
    rsvp_name: "Nombre completo",
    rsvp_email: "Correo electrónico",
    rsvp_seats: "Lugares confirmados",
    rsvp_diet: "Restricciones alimenticias",
    rsvp_diet_ph: "Vegetariano, alergias, etc.",
    rsvp_song: "Canción que no debe faltar",
    rsvp_msg: "Un mensaje para los novios",
    rsvp_attending: "¿Asistirás?",
    rsvp_yes: "Sí, ahí estaré",
    rsvp_no: "No podré asistir",
    rsvp_submit: "Enviar confirmación",
    rsvp_submitting: "Enviando…",
    rsvp_powered: "Reservaciones gestionadas por ReservaHub",
    rsvp_thanks_title: "¡Confirmación recibida!",
    rsvp_thanks_yes: "No podemos esperar a celebrar contigo. Te enviamos un correo con todos los detalles.",
    rsvp_thanks_no: "Te vamos a extrañar. Gracias por avisarnos.",
    rsvp_ref: "Referencia",
    gallery_kicker: "Nosotros",
    gallery_title: "Sí a todo, si es contigo",
    gifts_kicker: "Mesa de regalos",
    lodging_kicker: "Dónde hospedarse",
    lodging_title: "Sugerencias para tu estancia",
    lodging_code: "Código",
    playlist_kicker: "Playlist",
    playlist_sent: "¡Gracias! Tu canción está en camino.",
    playlist_seed: "Algunas que ya están en la lista",
    playlist_submit: "Agregar",
    open_map: "Abrir en mapa",
    add_calendar: "Agendar",
    open_link: "Ir al sitio",
    admin_title: "Panel de administración",
    admin_pwd: "Contraseña",
    admin_enter: "Entrar",
    admin_save: "Guardar cambios",
    admin_reset: "Restaurar predeterminado",
    admin_logout: "Cerrar sesión",
    admin_saving: "Guardando…",
    admin_saved: "Guardado en servidor",
    admin_unsaved: "Cambios sin guardar",
    admin_wrong: "Contraseña incorrecta",
  },
  en: {
    nav: { home:"Home", details:"Details", program:"Schedule", rsvp:"RSVP", gallery:"Gallery", more:"More" },
    save_the_date: "Save the date",
    count_days:"days", count_hrs:"hrs", count_min:"min", count_sec:"sec",
    program_kicker: "The schedule",
    program_title: "How we'll spend these two days",
    program_day1: "Friday 16 · Ceremony & Reception",
    program_day2: "Saturday 17 · Traditional Wedding",
    dress_kicker: "Dress code",
    dress_avoid: "Please avoid",
    rsvp_kicker: "RSVP",
    rsvp_title: "Confirm your attendance",
    rsvp_name: "Full name",
    rsvp_email: "Email address",
    rsvp_seats: "Number of seats",
    rsvp_diet: "Dietary restrictions",
    rsvp_diet_ph: "Vegetarian, allergies, etc.",
    rsvp_song: "A must-play song",
    rsvp_msg: "A message to the couple",
    rsvp_attending: "Will you attend?",
    rsvp_yes: "Yes, I'll be there",
    rsvp_no: "I can't make it",
    rsvp_submit: "Send RSVP",
    rsvp_submitting: "Sending…",
    rsvp_powered: "Reservations powered by ReservaHub",
    rsvp_thanks_title: "RSVP received!",
    rsvp_thanks_yes: "We can't wait to celebrate with you. A confirmation email is on its way.",
    rsvp_thanks_no: "We'll miss you. Thanks for letting us know.",
    rsvp_ref: "Reference",
    gallery_kicker: "Us",
    gallery_title: "Yes to everything, if it's with you",
    gifts_kicker: "Gift registry",
    lodging_kicker: "Where to stay",
    lodging_title: "A few places we love",
    lodging_code: "Code",
    playlist_kicker: "Playlist",
    playlist_sent: "Thanks! Your song is on the way.",
    playlist_seed: "Already on the list",
    playlist_submit: "Add",
    open_map: "Open map",
    add_calendar: "Add to calendar",
    open_link: "Visit site",
    admin_title: "Admin panel",
    admin_pwd: "Password",
    admin_enter: "Enter",
    admin_save: "Save changes",
    admin_reset: "Reset to default",
    admin_logout: "Sign out",
    admin_saving: "Saving…",
    admin_saved: "Saved to server",
    admin_unsaved: "Unsaved changes",
    admin_wrong: "Wrong password",
  }
};

// ─────────────────────────────────────────────────────────────────────
// IMPROVED BACKEND — usa APIs reales en servidor, fallback a localStorage
// ─────────────────────────────────────────────────────────────────────

const MockServer = (() => {
  const KEY_CONTENT = "boda_aya_content_v8";
  const KEY_RSVPS = "boda_aya_rsvps_v1";
  const KEY_SONGS = "boda_aya_songs_v1";

  const latency = (min=350, max=900) => new Promise(r => setTimeout(r, min + Math.random()*(max-min)));

  // Detectar si estamos en servidor (API disponible)
  const isServer = typeof window !== 'undefined' && window.location.hostname !== 'localhost:3000';

  return {
    async getContent(){
      try {
        // Intentar API del servidor primero
        const res = await fetch('/api/content');
        if (res.ok) {
          const json = await res.json();
          if (json.ok && json.data) return { ok:true, data: json.data };
        }
      } catch(e) { 
        // Fallback a localStorage
      }
      
      // Fallback: localStorage o datos por defecto
      await latency();
      try {
        const raw = localStorage.getItem(KEY_CONTENT);
        if (raw) return { ok:true, data: JSON.parse(raw) };
      } catch(e){}
      return { ok:true, data: DEFAULT_DATA };
    },

    async saveContent(data){
      try {
        // Intentar API del servidor
        const res = await fetch('/api/content', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ data })
        });
        if (res.ok) {
          const json = await res.json();
          if (json.ok) return { ok:true, savedAt: json.savedAt };
        }
      } catch(e) { 
        // Fallback a localStorage
      }

      // Fallback: guardar en localStorage
      await latency(500, 1100);
      try { 
        localStorage.setItem(KEY_CONTENT, JSON.stringify(data)); 
      } catch(e){ 
        return { ok:false, error:"storage_full" }; 
      }
      return { ok:true, savedAt: new Date().toISOString() };
    },

    async resetContent(){
      try {
        const res = await fetch('/api/content/reset', { method: 'POST' });
        if (res.ok) return { ok:true, data: DEFAULT_DATA };
      } catch(e) {}
      
      await latency();
      localStorage.removeItem(KEY_CONTENT);
      return { ok:true, data: DEFAULT_DATA };
    },

    async submitRsvp(payload){
      try {
        const res = await fetch('/api/rsvp', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(payload)
        });
        if (res.ok) {
          const json = await res.json();
          if (json.ok) return { ok:true, ref: json.ref, entry: json.entry };
        }
      } catch(e) { 
        // Fallback a localStorage
      }

      await latency(600, 1300);
      const ref = "RH-" + Math.random().toString(36).slice(2,8).toUpperCase();
      const entry = { ...payload, ref, submittedAt: new Date().toISOString() };
      try {
        const raw = localStorage.getItem(KEY_RSVPS);
        const arr = raw ? JSON.parse(raw) : [];
        arr.push(entry);
        localStorage.setItem(KEY_RSVPS, JSON.stringify(arr));
      } catch(e){}
      console.log("[RSVP] Submitted →", entry);
      return { ok:true, ref, entry };
    },

    async listRsvps(){
      try {
        const res = await fetch('/api/rsvps');
        if (res.ok) {
          const json = await res.json();
          if (json.ok) return { ok:true, data: json.data };
        }
      } catch(e) {}
      
      await latency();
      try {
        const raw = localStorage.getItem(KEY_RSVPS);
        return { ok:true, data: raw ? JSON.parse(raw) : [] };
      } catch(e){ 
        return { ok:true, data: [] }; 
      }
    },

    async submitSong(song){
      try {
        const res = await fetch('/api/song', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(song)
        });
        if (res.ok) return { ok:true };
      } catch(e) { 
        // Fallback a localStorage
      }

      await latency();
      try {
        const raw = localStorage.getItem(KEY_SONGS);
        const arr = raw ? JSON.parse(raw) : [];
        arr.push({ ...song, at: new Date().toISOString() });
        localStorage.setItem(KEY_SONGS, JSON.stringify(arr));
      } catch(e){}
      return { ok:true };
    },

    async listSongs(){
      try {
        const res = await fetch('/api/songs');
        if (res.ok) {
          const json = await res.json();
          if (json.ok) return { ok:true, data: json.data };
        }
      } catch(e) {}
      
      await latency();
      try {
        const raw = localStorage.getItem(KEY_SONGS);
        return { ok:true, data: raw ? JSON.parse(raw) : [] };
      } catch(e){ 
        return { ok:true, data: [] }; 
      }
    },
  };
})();

Object.assign(window, { DEFAULT_DATA, I18N, MockServer });
