// ── Moorish door open on click ───────────────────────────────
(function () {
  var overlay = document.getElementById('door-overlay');
  if (!overlay) return;

  function openDoors() {
    overlay.removeEventListener('click',   openDoors);
    overlay.removeEventListener('keydown', onKey);

    overlay.classList.add('opening');

    // After doors finish swinging, fade out and remove
    setTimeout(function () {
      overlay.classList.add('fading');
      setTimeout(function () {
        overlay.remove();
        document.body.classList.remove('door-active');
      }, 580);
    }, 1050);
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
