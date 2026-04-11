// ── Moorish door open on click ───────────────────────────────
(function () {
  var overlay = document.getElementById('door-overlay');
  if (!overlay) return;

  function openDoors() {
    overlay.removeEventListener('click',   openDoors);
    overlay.removeEventListener('keydown', onKey);

    overlay.classList.add('opening');

    // Start fading while zoom is still playing — feels like stepping through
    setTimeout(function () {
      overlay.classList.add('fading');
      setTimeout(function () {
        overlay.remove();
        document.body.classList.remove('door-active');
      }, 1100);
    }, 1500);
  }

  function onKey(e) {
    if (e.key === 'Enter' || e.key === ' ') openDoors();
  }

  overlay.addEventListener('click',   openDoors);
  overlay.addEventListener('keydown', onKey);
})();

// ── Scratch-to-reveal circles (day / month / year) ──────────
window.addEventListener('load', function () {
  document.querySelectorAll('.sc-wrap').forEach(function (wrap) {
    const canvas = wrap.querySelector('.sc-canvas');
    if (!canvas) return;

    const size = wrap.offsetWidth;
    canvas.width  = size;
    canvas.height = size;

    const ctx = canvas.getContext('2d');
    const r   = size / 2;

    // Clip all drawing to the circle
    ctx.beginPath();
    ctx.arc(r, r, r, 0, Math.PI * 2);
    ctx.clip();

    // Radial gold gradient fill
    const grad = ctx.createRadialGradient(r * 0.6, r * 0.6, 0, r, r, r);
    grad.addColorStop(0,   '#f0dc9a');
    grad.addColorStop(0.6, '#c9a44e');
    grad.addColorStop(1,   '#9b7928');
    ctx.fillStyle = grad;
    ctx.fillRect(0, 0, size, size);

    // Hatched lines to hint "scratchable"
    ctx.strokeStyle = 'rgba(58,36,24,0.12)';
    ctx.lineWidth = 1;
    for (let x = -size; x < size * 2; x += 7) {
      ctx.beginPath();
      ctx.moveTo(x, 0);
      ctx.lineTo(x + size, size);
      ctx.stroke();
    }

    // ── Scratch logic ──
    let painting = false;

    function getPos(e) {
      const rect = canvas.getBoundingClientRect();
      const src  = e.touches ? e.touches[0] : e;
      return { x: src.clientX - rect.left, y: src.clientY - rect.top };
    }

    function scratch(e) {
      if (!painting) return;
      e.preventDefault();
      const p = getPos(e);
      ctx.globalCompositeOperation = 'destination-out';
      ctx.beginPath();
      ctx.arc(p.x, p.y, 16, 0, Math.PI * 2);
      ctx.fill();
      checkReveal();
    }

    function checkReveal() {
      const data = ctx.getImageData(0, 0, size, size).data;
      let transparent = 0;
      for (let i = 3; i < data.length; i += 4) {
        if (data[i] < 128) transparent++;
      }
      if (transparent / (data.length / 4) > 0.5) {
        canvas.style.transition = 'opacity 0.4s ease';
        canvas.style.opacity    = '0';
        setTimeout(function () { canvas.remove(); }, 440);
      }
    }

    canvas.addEventListener('mousedown',  function (e) { painting = true; scratch(e); });
    canvas.addEventListener('mousemove',  scratch);
    canvas.addEventListener('mouseup',    function () { painting = false; });
    canvas.addEventListener('mouseleave', function () { painting = false; });
    canvas.addEventListener('touchstart', function (e) { painting = true; scratch(e); }, { passive: false });
    canvas.addEventListener('touchmove',  scratch, { passive: false });
    canvas.addEventListener('touchend',   function () { painting = false; });
  });
});

// ── Countdown to Khaled & Lynda's wedding: 23 May 2026 at 18:00
const weddingDate = new Date('2026-05-23T18:00:00');

function pad(n) {
  return String(n).padStart(2, '0');
}

function updateCountdown() {
  const now  = new Date();
  const diff = weddingDate - now;

  if (diff <= 0) {
    ['days','hours','minutes','seconds'].forEach(id => {
      document.getElementById(id).textContent = '00';
    });
    return;
  }

  const days    = Math.floor(diff / (1000 * 60 * 60 * 24));
  const hours   = Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
  const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
  const seconds = Math.floor((diff % (1000 * 60)) / 1000);

  document.getElementById('days').textContent    = pad(days);
  document.getElementById('hours').textContent   = pad(hours);
  document.getElementById('minutes').textContent = pad(minutes);
  document.getElementById('seconds').textContent = pad(seconds);
}

updateCountdown();
setInterval(updateCountdown, 1000);

// ── Hero gold sparkle particles ──────────────────────────────
(function () {
  const canvas = document.getElementById('hero-particles');
  if (!canvas) return;
  const ctx = canvas.getContext('2d');
  let w, h, particles, raf;

  function resize() {
    const hero = canvas.parentElement;
    w = canvas.width  = hero.offsetWidth;
    h = canvas.height = hero.offsetHeight;
  }

  function makeParticle() {
    return {
      x:       Math.random() * w,
      y:       Math.random() * h,
      r:       Math.random() * 2.2 + 0.5,
      speed:   Math.random() * 0.35 + 0.08,
      opacity: Math.random() * 0.45 + 0.08,
      drift:   (Math.random() - 0.5) * 0.25,
      phase:   Math.random() * Math.PI * 2,
    };
  }

  function init() {
    const count = Math.min(Math.floor((w * h) / 7500), 80);
    particles = Array.from({ length: count }, makeParticle);
  }

  function draw() {
    ctx.clearRect(0, 0, w, h);
    const t = Date.now() / 1000;

    for (const p of particles) {
      p.y -= p.speed;
      p.x += p.drift + Math.sin(t * 0.8 + p.phase) * 0.18;

      if (p.y < -8)    { p.y = h + 8; p.x = Math.random() * w; }
      if (p.x < -8)      p.x = w + 8;
      if (p.x >  w + 8)  p.x = -8;

      const pulse = 0.55 + 0.45 * Math.sin(t * 1.4 + p.phase);
      ctx.save();
      ctx.globalAlpha  = p.opacity * pulse;
      ctx.shadowColor  = '#e8d49b';
      ctx.shadowBlur   = 6;
      ctx.fillStyle    = '#c9a44e';
      ctx.translate(p.x, p.y);
      ctx.rotate(Math.PI / 4);
      const s = p.r;
      ctx.fillRect(-s, -s, s * 2, s * 2);
      ctx.restore();
    }

    raf = requestAnimationFrame(draw);
  }

  // Pause when hero scrolls out of view to save CPU
  const heroSection = document.getElementById('hero');
  if ('IntersectionObserver' in window) {
    new IntersectionObserver(entries => {
      if (entries[0].isIntersecting) { if (!raf) raf = requestAnimationFrame(draw); }
      else { cancelAnimationFrame(raf); raf = null; }
    }, { threshold: 0 }).observe(heroSection);
  }

  resize();
  init();
  raf = requestAnimationFrame(draw);

  window.addEventListener('resize', function () { resize(); init(); });
})();

// ── GSAP scroll & post-door animations ───────────────────────
(function () {
  function initGSAP() {
    if (typeof gsap === 'undefined') return;
    gsap.registerPlugin(ScrollTrigger);

    // ── Helper: hide elements before animating them in ──
    function prep(selector) {
      gsap.set(selector, { opacity: 0, y: 28 });
    }

    // ── Section headings ──
    document.querySelectorAll('.section-heading').forEach(el => {
      gsap.set(el, { opacity: 0, y: 20 });
      gsap.to(el, {
        scrollTrigger: { trigger: el, start: 'top 88%', once: true },
        opacity: 1, y: 0, duration: 0.75, ease: 'power2.out',
      });
    });

    // ── Detail cards stagger ──
    const cards = gsap.utils.toArray('.detail-card');
    if (cards.length) {
      gsap.set(cards, { opacity: 0, y: 40 });
      gsap.to(cards, {
        scrollTrigger: { trigger: '.details-grid', start: 'top 82%', once: true },
        opacity: 1, y: 0, duration: 0.65, stagger: 0.13, ease: 'power3.out',
      });
    }

    // ── Venue frame scale-in ──
    const vf = document.querySelector('.venue-frame-border');
    if (vf) {
      gsap.set(vf, { opacity: 0, scale: 0.96 });
      gsap.to(vf, {
        scrollTrigger: { trigger: vf, start: 'top 84%', once: true },
        opacity: 1, scale: 1, duration: 1.1, ease: 'power2.out',
      });
    }

    // ── Countdown boxes bounce in ──
    const boxes = gsap.utils.toArray('.count-box');
    if (boxes.length) {
      gsap.set(boxes, { opacity: 0, y: 30, scale: 0.88 });
      gsap.to(boxes, {
        scrollTrigger: { trigger: '.countdown-grid', start: 'top 82%', once: true },
        opacity: 1, y: 0, scale: 1, duration: 0.6, stagger: 0.1, ease: 'back.out(1.7)',
      });
    }

    // ── Footer fade up ──
    const footer = document.querySelector('footer');
    if (footer) {
      gsap.set(footer, { opacity: 0, y: 22 });
      gsap.to(footer, {
        scrollTrigger: { trigger: footer, start: 'top 92%', once: true },
        opacity: 1, y: 0, duration: 0.85, ease: 'power2.out',
      });
    }

    // ── Hero content staggered reveal after door closes ──
    const heroItems = [
      '.above-arch-logo',
      '.arch-top-logo',
      '.family-names',
      '.orn-divider',
      '.invite-body',
      '.couple-names',
      '.wedding-date',
      '.wedding-venue',
    ].map(s => document.querySelector(s)).filter(Boolean);

    if (heroItems.length) {
      gsap.set(heroItems, { opacity: 0, y: 18 });
      // Delay to let door animation finish (~2.7s total)
      gsap.to(heroItems, {
        opacity: 1, y: 0,
        duration: 0.45,
        stagger: 0.07,
        ease: 'power2.out',
        delay: 2.0,
      });
    }
  }

  // GSAP loads async — wait for it
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initGSAP);
  } else {
    initGSAP();
  }

  // Fallback: retry once if GSAP wasn't ready yet
  window.addEventListener('load', function () {
    if (typeof gsap !== 'undefined') initGSAP();
  });
})();
