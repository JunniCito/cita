/* ============================================================
   BOLUEVARD CINEMAS — script.js
   ============================================================ */

// ─── CONFIGURACIÓN (personaliza aquí) ───────────────────────
const CONFIG = {
  nombre: "Mi Amor 💖",           // Nombre de ella en el ticket
  pelicula: "Boulevard 2026", // Película
  fecha: "2026-05-09T14:00:00",   // Fecha y hora ISO de la cita
  fechaDisplay: "Sábado, 9 de Mayo 2026",
  horaDisplay: "2:00 PM",
  lugar: "NCG Cinemas - Peachtree Corners, 6135 Peachtree Pkwy NW Ste 501, Peachtree Corners, GA 30092",
  sala: "Sala 3 — VIP",
  asiento: "F7 — F8"
};
// ─────────────────────────────────────────────────────────────

// ── Helpers ──
const $ = id => document.getElementById(id);
const screens = {
  intro:  $("screen-intro"),
  invite: $("screen-invite"),
  ticket: $("screen-ticket"),
  yes:    $("screen-yes")
};

// ── Rellena datos dinámicos ──
function fillData() {
  $("invite-date").textContent  = CONFIG.fechaDisplay;
  $("invite-time").textContent  = CONFIG.horaDisplay;
  $("invite-place").textContent = CONFIG.lugar;

  $("ticket-name").textContent  = CONFIG.nombre;
  $("ticket-movie").textContent = CONFIG.pelicula;
  $("ticket-date2").textContent = CONFIG.fechaDisplay;
  $("ticket-time2").textContent = CONFIG.horaDisplay;
  $("ticket-sala").textContent  = CONFIG.sala;
  $("ticket-seat").textContent  = CONFIG.asiento;
  $("stub-sala").textContent    = CONFIG.sala.replace("Sala ","");
  $("stub-seat").textContent    = CONFIG.asiento;

  $("yes-date").textContent  = CONFIG.fechaDisplay;
  $("yes-time").textContent  = CONFIG.horaDisplay;
  $("yes-place").textContent = CONFIG.lugar;
}

// ══════════════════════════════════════════════════════════════
// 1. PARTÍCULAS (canvas)
// ══════════════════════════════════════════════════════════════
(function initParticles() {
  const canvas = $("particles-canvas");
  const ctx    = canvas.getContext("2d");
  let W, H, particles = [];

  function resize() {
    W = canvas.width  = window.innerWidth;
    H = canvas.height = window.innerHeight;
  }
  window.addEventListener("resize", resize);
  resize();

  function rand(a, b) { return a + Math.random() * (b - a); }

  function makeParticle() {
    return {
      x: rand(0, W),
      y: rand(0, H),
      r: rand(0.6, 2.2),
      sp: rand(0.08, 0.35),
      op: rand(0.1, 0.8),
      d: rand(0, 2 * Math.PI),   // drift angle
      dx: rand(-0.15, 0.15),
      color: Math.random() > 0.6
        ? `hsl(${rand(340,360)}, 80%, 75%)`
        : `hsl(${rand(30,55)}, 90%, 80%)`
    };
  }

  for (let i = 0; i < 140; i++) particles.push(makeParticle());

  function draw() {
    ctx.clearRect(0, 0, W, H);
    particles.forEach(p => {
      ctx.beginPath();
      ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
      ctx.fillStyle = p.color;
      ctx.globalAlpha = p.op;
      ctx.fill();

      // Oscilación
      p.d += 0.01;
      p.x += p.dx + Math.sin(p.d) * 0.15;
      p.y -= p.sp;

      // Reset al salir por arriba
      if (p.y < -4) { p.y = H + 4; p.x = rand(0, W); }
      if (p.x < -4 || p.x > W + 4) { p.x = rand(0, W); }
    });
    ctx.globalAlpha = 1;
    requestAnimationFrame(draw);
  }
  draw();
})();

// ══════════════════════════════════════════════════════════════
// 2. ESTRELLAS SVG en cada pantalla
// ══════════════════════════════════════════════════════════════
function spawnStars(containerId, count = 60) {
  const el = $(containerId);
  if (!el) return;
  for (let i = 0; i < count; i++) {
    const s   = document.createElement("span");
    const sz  = (Math.random() * 3 + 1).toFixed(1);
    const dur = (Math.random() * 3 + 2).toFixed(1);
    const del = (Math.random() * 4).toFixed(1);
    s.style.cssText = `
      position:absolute;
      width:${sz}px; height:${sz}px;
      border-radius:50%;
      background:#fff;
      top:${rand01() * 100}%;
      left:${rand01() * 100}%;
      opacity:0;
      animation: twinkle ${dur}s ${del}s ease-in-out infinite;
    `;
    el.appendChild(s);
  }
}
function rand01() { return Math.random(); }

// ══════════════════════════════════════════════════════════════
// 3. BARCODE decorativo
// ══════════════════════════════════════════════════════════════
function buildBarcode() {
  const container = document.querySelector(".barcode-lines");
  if (!container) return;
  for (let i = 0; i < 48; i++) {
    const bar = document.createElement("div");
    const w   = Math.random() > 0.5 ? 2 : 4;
    const h   = 20 + Math.random() * 16;
    bar.style.cssText = `width:${w}px; height:${h}px;`;
    container.appendChild(bar);
  }
}

// ══════════════════════════════════════════════════════════════
// 4. QR decorativo
// ══════════════════════════════════════════════════════════════
function buildQR() {
  const grid = $("qr-pattern");
  if (!grid) return;
  // Patrón fijo que luce como QR
  const pattern = [
    1,1,1,1,1,1,1,
    1,0,0,0,0,0,1,
    1,0,1,0,1,0,1,
    1,0,0,1,0,0,1,
    1,0,1,0,1,0,1,
    1,0,0,0,0,0,1,
    1,1,1,1,1,1,1
  ];
  pattern.forEach(v => {
    const cell = document.createElement("div");
    cell.classList.add("qc");
    cell.style.background = v ? "#1a0a14" : "#fff";
    grid.appendChild(cell);
  });
}

// ══════════════════════════════════════════════════════════════
// 5. COUNTDOWN
// ══════════════════════════════════════════════════════════════
function startCountdown() {
  const target = new Date(CONFIG.fecha).getTime();

  function update() {
    const now  = Date.now();
    const diff = target - now;

    if (diff <= 0) {
      $("cd-days").textContent = "00";
      $("cd-hours").textContent = "00";
      $("cd-mins").textContent  = "00";
      $("cd-secs").textContent  = "00";
      return;
    }

    const days  = Math.floor(diff / 86400000);
    const hours = Math.floor((diff % 86400000) / 3600000);
    const mins  = Math.floor((diff % 3600000) / 60000);
    const secs  = Math.floor((diff % 60000) / 1000);

    $("cd-days").textContent  = String(days).padStart(2,"0");
    $("cd-hours").textContent = String(hours).padStart(2,"0");
    $("cd-mins").textContent  = String(mins).padStart(2,"0");
    $("cd-secs").textContent  = String(secs).padStart(2,"0");
  }

  update();
  setInterval(update, 1000);
}

// ══════════════════════════════════════════════════════════════
// 6. NAVEGACIÓN ENTRE PANTALLAS
// ══════════════════════════════════════════════════════════════
let currentScreen = "intro";

function goTo(name, delay = 0) {
  setTimeout(() => {
    // Oculta actual
    if (screens[currentScreen]) {
      screens[currentScreen].classList.remove("active");
      screens[currentScreen].classList.add("exit");
      setTimeout(() => screens[currentScreen]?.classList.remove("exit"), 700);
    }
    currentScreen = name;
    // Muestra nueva
    const next = screens[name];
    next.classList.add("active");
    next.scrollTop = 0;
  }, delay);
}

// Transición cinemática
function cinematicTransition(callback) {
  const overlay = $("cinematic-overlay");
  overlay.classList.add("active");
  setTimeout(() => {
    callback();
    setTimeout(() => overlay.classList.remove("active"), 800);
  }, 600);
}

// Botón: Abrir invitación
$("btn-open").addEventListener("click", () => {
  cinematicTransition(() => goTo("invite"));
});

// Botón: Ver ticket
$("btn-ticket").addEventListener("click", () => {
  cinematicTransition(() => goTo("ticket"));
});

// Botones: Sí quiero / Obvio sí
["btn-yes1", "btn-yes2"].forEach(id => {
  $(id).addEventListener("click", () => {
    launchHearts(50);
    cinematicTransition(() => goTo("yes"));
    setTimeout(launchMoreHearts, 900);
  });
});

// Botón: Volver
$("btn-restart").addEventListener("click", () => {
  cinematicTransition(() => goTo("intro"));
});

// ══════════════════════════════════════════════════════════════
// 7. CORAZONES FLOTANTES
// ══════════════════════════════════════════════════════════════
const HEARTS_LIST = ["💖","💗","💓","💕","❤️","🌹","✨","💝","💞"];

function launchHearts(count) {
  const container = $("hearts-container");
  for (let i = 0; i < count; i++) {
    setTimeout(() => {
      const h   = document.createElement("span");
      h.classList.add("heart");
      h.textContent = HEARTS_LIST[Math.floor(Math.random() * HEARTS_LIST.length)];
      const dur  = (2.5 + Math.random() * 3).toFixed(1);
      const left = Math.random() * 100;
      const size = (1 + Math.random() * 1.2).toFixed(1);
      h.style.cssText = `
        left:${left}%;
        font-size:${size}rem;
        animation-duration:${dur}s;
        animation-delay:0s;
      `;
      container.appendChild(h);
      setTimeout(() => h.remove(), parseFloat(dur) * 1000 + 200);
    }, i * 60);
  }
}

function launchMoreHearts() {
  const container = $("hearts-container");
  setInterval(() => {
    if (currentScreen !== "yes") return;
    const h = document.createElement("span");
    h.classList.add("heart");
    h.textContent = HEARTS_LIST[Math.floor(Math.random() * HEARTS_LIST.length)];
    const dur  = (3 + Math.random() * 2).toFixed(1);
    h.style.cssText = `
      left:${Math.random()*100}%;
      font-size:${(0.8+Math.random()).toFixed(1)}rem;
      animation-duration:${dur}s;
    `;
    container.appendChild(h);
    setTimeout(() => h.remove(), parseFloat(dur) * 1000 + 200);
  }, 400);
}

// ══════════════════════════════════════════════════════════════
// 8. AUDIO
// ══════════════════════════════════════════════════════════════
const audio  = $("bg-music");
const btnAud = $("btn-audio");
let   muted  = true;

btnAud.addEventListener("click", () => {
  muted = !muted;
  if (muted) {
    audio.pause();
    btnAud.textContent = "🔇";
  } else {
    audio.volume = 0.3;
    audio.play().catch(() => {}); // autoplay policy
    btnAud.textContent = "🎵";
  }
});

// ══════════════════════════════════════════════════════════════
// 9. EFECTO HOVER PARALLAX en el ticket
// ══════════════════════════════════════════════════════════════
const ticketCard = $("ticket-card");
if (ticketCard) {
  ticketCard.addEventListener("mousemove", e => {
    const rect = ticketCard.getBoundingClientRect();
    const cx   = rect.width  / 2;
    const cy   = rect.height / 2;
    const dx   = (e.clientX - rect.left - cx) / cx;
    const dy   = (e.clientY - rect.top  - cy) / cy;
    ticketCard.style.transform =
      `perspective(900px) rotateY(${dx * 8}deg) rotateX(${-dy * 6}deg) scale(1.02)`;
  });
  ticketCard.addEventListener("mouseleave", () => {
    ticketCard.style.transform = "perspective(900px) rotateY(0) rotateX(0) scale(1)";
  });
}

// ══════════════════════════════════════════════════════════════
// 10. ANIMACIÓN DE ENTRADA — letras por letra (intro title)
// ══════════════════════════════════════════════════════════════
function animateTitle() {
  const titleEl = document.querySelector(".intro-title");
  if (!titleEl) return;
  // ya tiene animación CSS, no necesita JS extra
  titleEl.style.animation = "fadeInUp 1s .2s cubic-bezier(.4,0,.2,1) both";
}

// ══════════════════════════════════════════════════════════════
// INIT
// ══════════════════════════════════════════════════════════════
fillData();
buildBarcode();
buildQR();
startCountdown();

spawnStars("stars-intro",  80);
spawnStars("stars-invite", 60);
spawnStars("stars-ticket", 60);
spawnStars("stars-yes",    80);

animateTitle();

// Activar pantalla inicial
screens.intro.classList.add("active");
console.log("🎬 Boluevard Cinemas — Invitación cargada 💖");
