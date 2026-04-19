import puppeteer from 'puppeteer';
import QRCode from 'qrcode';
import { fileURLToPath } from 'url';
import { readFileSync } from 'fs';
import path from 'path';

const __dirname = path.dirname(fileURLToPath(import.meta.url));

(async () => {
  // Generate QR code as data URL
  const qrDataUrl = await QRCode.toDataURL('https://khaledmjk.github.io/InvitationSite/', {
    width: 640,
    margin: 1,
    color: { dark: '#c9a44e', light: '#00000000' },
    errorCorrectionLevel: 'M'
  });

  // Read logo as base64
  const logoB64 = readFileSync('/tmp/logo_b64.txt', 'utf-8').trim();
  const logoDataUrl = `data:image/png;base64,${logoB64}`;

  const browser = await puppeteer.launch({ headless: 'new' });
  const page = await browser.newPage();
  await page.setViewport({ width: 2160, height: 3080, deviceScaleFactor: 2 });

  const html = buildHTML(qrDataUrl, logoDataUrl);
  await page.setContent(html, { waitUntil: 'networkidle0', timeout: 30000 });
  await page.evaluate(() => document.fonts.ready);
  await new Promise(r => setTimeout(r, 2500));

  const outputPath = path.join(__dirname, 'invitation-card.png');
  await page.screenshot({
    path: outputPath,
    type: 'png',
    clip: { x: 0, y: 0, width: 2160, height: 3080 }
  });

  console.log(`Invitation card saved to: ${outputPath}`);
  await browser.close();
})();


function buildHTML(qrDataUrl, logoDataUrl) {
  return `<!DOCTYPE html>
<html lang="fr">
<head>
<meta charset="UTF-8"/>
<style>
  @import url('https://fonts.googleapis.com/css2?family=Great+Vibes&family=Cinzel:wght@400;500;600;700&family=Cormorant+Garamond:ital,wght@0,400;0,500;0,600;1,400&display=swap');

  * { margin:0; padding:0; box-sizing:border-box; }

  body {
    width: 2160px;
    height: 3080px;
    overflow: hidden;
    font-family: 'Cormorant Garamond', serif;
  }

  .card {
    position: relative;
    width: 2160px;
    height: 3080px;
    background: #0c0a07;
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    color: #e8dcc8;
    overflow: hidden;
  }

  /* ── Moorish tiled background ── */
  .moorish-bg {
    position: absolute;
    inset: 0;
    z-index: 0;
    overflow: hidden;
  }

  /* Zellige-inspired geometric tile pattern using CSS */
  .moorish-bg::before {
    content: '';
    position: absolute;
    inset: -40px;
    background-image:
      /* 8-pointed star pattern layer */
      repeating-conic-gradient(
        from 0deg at 50% 50%,
        rgba(201,164,78,0.04) 0deg 45deg,
        transparent 45deg 90deg
      );
    background-size: 160px 160px;
  }

  .moorish-bg::after {
    content: '';
    position: absolute;
    inset: 0;
    background:
      radial-gradient(ellipse at 50% 15%, rgba(201,164,78,0.08) 0%, transparent 50%),
      radial-gradient(ellipse at 50% 85%, rgba(201,164,78,0.06) 0%, transparent 45%),
      radial-gradient(ellipse at 50% 50%, rgba(18,14,8,0) 30%, rgba(12,10,7,0.95) 75%);
  }

  /* SVG tile overlay */
  .tile-pattern {
    position: absolute;
    inset: 0;
    z-index: 0;
    opacity: 0.14;
    background-repeat: repeat;
    background-size: 240px 240px;
  }

  /* ── Arch frame (Moorish horseshoe arch) ── */
  .arch-frame {
    position: absolute;
    top: 80px;
    left: 50%;
    transform: translateX(-50%);
    width: 1840px;
    height: 3680px;
    z-index: 1;
    pointer-events: none;
  }

  /* ── Outer ornamental border ── */
  .border-outer {
    position: absolute;
    inset: 60px;
    border: 4px solid rgba(201,164,78,0.45);
    pointer-events: none;
    z-index: 1;
  }
  .border-inner {
    position: absolute;
    inset: 84px;
    border: 2.5px solid rgba(201,164,78,0.25);
    pointer-events: none;
    z-index: 1;
  }

  /* ── Corner ornaments (Moorish style) ── */
  .corner {
    position: absolute;
    width: 220px;
    height: 220px;
    pointer-events: none;
    z-index: 2;
  }
  .corner svg { width:100%; height:100%; }
  .corner--tl { top:44px; left:44px; }
  .corner--tr { top:44px; right:44px; transform: scaleX(-1); }
  .corner--bl { bottom:44px; left:44px; transform: scaleY(-1); }
  .corner--br { bottom:44px; right:44px; transform: scale(-1,-1); }

  /* ── Side arabesque strips ── */
  .side-strip {
    position: absolute;
    top: 50%;
    transform: translateY(-50%);
    z-index: 1;
    opacity: 0.10;
  }
  .side-strip--left { left: 68px; }
  .side-strip--right { right: 68px; transform: translateY(-50%) scaleX(-1); }

  /* ── Content ── */
  .content {
    position: relative;
    z-index: 3;
    display: flex;
    flex-direction: column;
    align-items: center;
    text-align: center;
    padding: 0 180px;
  }

  /* Top ornament */
  .top-orn {
    color: #c9a44e;
    font-size: 32px;
    letter-spacing: 40px;
    margin-bottom: 48px;
    opacity: 0.6;
  }

  /* Logo */
  .logo-wrap {
    width: 440px;
    height: 440px;
    margin-bottom: 56px;
    position: relative;
    display: flex;
    align-items: center;
    justify-content: center;
  }
  .logo-wrap img {
    width: 400px;
    height: auto;
    filter: brightness(0.95) sepia(0.15);
  }

  /* Families */
  .families { margin-bottom: 12px; }
  .families-label {
    font-family: 'Cormorant Garamond', serif;
    font-size: 38px;
    color: rgba(201,164,78,0.45);
    text-transform: uppercase;
    letter-spacing: 14px;
    margin-bottom: 20px;
  }
  .families-names {
    font-family: 'Cinzel', serif;
    font-size: 64px;
    color: #c9a44e;
    letter-spacing: 14px;
    font-weight: 500;
  }
  .families-amp {
    display: block;
    margin: 12px 0;
    font-family: 'Great Vibes', cursive;
    font-size: 68px;
    color: rgba(201,164,78,0.55);
  }

  /* Divider */
  .divider {
    display: flex;
    align-items: center;
    gap: 32px;
    margin: 44px 0;
  }
  .divider-line {
    width: 220px;
    height: 2px;
    background: linear-gradient(90deg, transparent, rgba(201,164,78,0.45), transparent);
  }
  .divider-diamond {
    color: #c9a44e;
    font-size: 18px;
    opacity: 0.6;
  }

  /* Invite text */
  .invite-text {
    font-family: 'Cormorant Garamond', serif;
    font-style: italic;
    font-size: 66px;
    color: #bfad8f;
    line-height: 1.6;
    margin-bottom: 8px;
  }

  /* Couple names */
  .couple {
    font-family: 'Great Vibes', cursive;
    font-size: 184px;
    color: #c9a44e;
    line-height: 1.2;
    margin: 12px 0;
    text-shadow: 0 0 100px rgba(201,164,78,0.12);
  }
  .couple .amp {
    font-size: 128px;
    display: inline-block;
    margin: 0 20px;
    opacity: 0.65;
    vertical-align: middle;
  }

  /* Date & Venue */
  .date {
    font-family: 'Cinzel', serif;
    font-size: 56px;
    color: #e8dcc8;
    letter-spacing: 10px;
    font-weight: 500;
    margin-top: 8px;
  }
  .time {
    font-family: 'Cormorant Garamond', serif;
    font-size: 44px;
    color: rgba(201,164,78,0.65);
    letter-spacing: 8px;
    margin-top: 16px;
  }
  .venue {
    font-family: 'Cinzel', serif;
    font-size: 52px;
    color: #c9a44e;
    letter-spacing: 14px;
    font-weight: 600;
    margin-top: 40px;
  }
  .venue-sub {
    font-family: 'Cormorant Garamond', serif;
    font-size: 50px;
    color: rgba(191,173,143,0.55);
    letter-spacing: 6px;
    margin-top: 8px;
    font-style: italic;
  }

  .venue-location {
    font-family: 'Cormorant Garamond', serif;
    font-size: 40px;
    color: rgba(191,173,143,0.55);
    letter-spacing: 4px;
    margin-top: 8px;
    font-style: italic;
  }

  /* No kids message */
  .no-kids {
    margin-top: 56px;
    padding: 32px 72px;
    border: 2px solid rgba(201,164,78,0.18);
    border-radius: 12px;
    background: rgba(201,164,78,0.03);
    max-width: 1360px;
  }
  .no-kids-icon {
    font-size: 52px;
    margin-bottom: 12px;
    opacity: 0.7;
  }
  .no-kids-text {
    font-family: 'Cormorant Garamond', serif;
    font-style: italic;
    font-size: 42px;
    color: #bfad8f;
    line-height: 1.5;
  }
  .no-kids-text strong {
    color: #c9a44e;
    font-weight: 600;
    font-style: normal;
  }

  /* QR section */
  .qr-section {
    margin-top: 60px;
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: 16px;
  }
  .qr-label {
    font-family: 'Cormorant Garamond', serif;
    font-size: 42px;
    color: rgba(191,173,143,0.7);
    letter-spacing: 6px;
    text-transform: uppercase;
  }
  .qr-code {
    width: 280px;
    height: 280px;
    padding: 16px;
    border: 2px solid rgba(201,164,78,0.2);
    border-radius: 8px;
    background: rgba(0,0,0,0.3);
  }
  .qr-code img {
    width: 100%;
    height: 100%;
  }
  .qr-url {
    font-family: 'Cinzel', serif;
    font-size: 26px;
    color: rgba(201,164,78,0.45);
    letter-spacing: 2px;
    margin-top: 4px;
  }

  /* Hidden message */
  .hidden-msg {
    position: absolute;
    bottom: 96px;
    right: 104px;
    font-family: 'Cormorant Garamond', serif;
    font-size: 18px;
    color: rgba(201,164,78,0.18);
    letter-spacing: 2px;
    z-index: 2;
    pointer-events: none;
  }

  /* Bottom ornament */
  .bottom-orn {
    margin-top: 48px;
    color: #c9a44e;
    font-size: 52px;
    opacity: 0.35;
  }
</style>
</head>
<body>
<div class="card">

  <!-- Moorish background -->
  <div class="moorish-bg"></div>

  <!-- SVG tile pattern overlay -->
  <svg class="tile-pattern" width="100%" height="100%" xmlns="http://www.w3.org/2000/svg">
    <defs>
      <pattern id="moorish-tile" x="0" y="0" width="120" height="120" patternUnits="userSpaceOnUse">
        <!-- 8-pointed star -->
        <polygon points="60,10 70,35 95,25 78,48 100,60 78,72 95,95 70,85 60,110 50,85 25,95 42,72 20,60 42,48 25,25 50,35"
          fill="none" stroke="#c9a44e" stroke-width="0.6"/>
        <!-- Inner star -->
        <polygon points="60,25 66,42 83,37 72,50 88,60 72,70 83,83 66,78 60,95 54,78 37,83 48,70 32,60 48,50 37,37 54,42"
          fill="none" stroke="#c9a44e" stroke-width="0.4"/>
        <!-- Center circle -->
        <circle cx="60" cy="60" r="8" fill="none" stroke="#c9a44e" stroke-width="0.4"/>
        <!-- Corner diamonds -->
        <polygon points="0,0 10,10 0,20 -10,10" fill="none" stroke="#c9a44e" stroke-width="0.3" transform="translate(0,0)"/>
        <polygon points="120,0 110,10 120,20 130,10" fill="none" stroke="#c9a44e" stroke-width="0.3"/>
        <polygon points="0,120 10,110 0,100 -10,110" fill="none" stroke="#c9a44e" stroke-width="0.3"/>
        <polygon points="120,120 110,110 120,100 130,110" fill="none" stroke="#c9a44e" stroke-width="0.3"/>
        <!-- Connecting lines -->
        <line x1="10" y1="10" x2="37" y2="37" stroke="#c9a44e" stroke-width="0.2"/>
        <line x1="110" y1="10" x2="83" y2="37" stroke="#c9a44e" stroke-width="0.2"/>
        <line x1="10" y1="110" x2="37" y2="83" stroke="#c9a44e" stroke-width="0.2"/>
        <line x1="110" y1="110" x2="83" y2="83" stroke="#c9a44e" stroke-width="0.2"/>
      </pattern>
    </defs>
    <rect width="100%" height="100%" fill="url(#moorish-tile)"/>
  </svg>

  <!-- Borders -->
  <div class="border-outer"></div>
  <div class="border-inner"></div>
  <div class="hidden-msg">1+1=1</div>

  <!-- Moorish corner ornaments -->
  <div class="corner corner--tl">
    <svg viewBox="0 0 110 110" fill="none" xmlns="http://www.w3.org/2000/svg">
      <!-- Outer curve -->
      <path d="M5 105 L5 25 Q5 5 25 5 L105 5" stroke="#c9a44e" stroke-width="1.2" fill="none" opacity="0.5"/>
      <!-- Inner curve -->
      <path d="M15 95 L15 28 Q15 15 28 15 L95 15" stroke="#c9a44e" stroke-width="0.6" fill="none" opacity="0.35"/>
      <!-- Arabesque curl top -->
      <path d="M30 5 Q28 18 38 20 Q28 22 30 35" stroke="#c9a44e" stroke-width="0.6" fill="none" opacity="0.4"/>
      <path d="M55 5 Q53 14 60 16 Q53 18 55 27" stroke="#c9a44e" stroke-width="0.5" fill="none" opacity="0.3"/>
      <!-- Arabesque curl side -->
      <path d="M5 30 Q18 28 20 38 Q22 28 35 30" stroke="#c9a44e" stroke-width="0.6" fill="none" opacity="0.4"/>
      <path d="M5 55 Q14 53 16 60 Q18 53 27 55" stroke="#c9a44e" stroke-width="0.5" fill="none" opacity="0.3"/>
      <!-- Corner rosette -->
      <circle cx="10" cy="10" r="4" fill="none" stroke="#c9a44e" stroke-width="0.7" opacity="0.5"/>
      <circle cx="10" cy="10" r="1.5" fill="#c9a44e" opacity="0.4"/>
      <!-- Diamond accents -->
      <polygon points="10,20 12,24 10,28 8,24" fill="#c9a44e" opacity="0.25"/>
      <polygon points="20,10 24,12 28,10 24,8" fill="#c9a44e" opacity="0.25"/>
    </svg>
  </div>
  <div class="corner corner--tr">
    <svg viewBox="0 0 110 110" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path d="M5 105 L5 25 Q5 5 25 5 L105 5" stroke="#c9a44e" stroke-width="1.2" fill="none" opacity="0.5"/>
      <path d="M15 95 L15 28 Q15 15 28 15 L95 15" stroke="#c9a44e" stroke-width="0.6" fill="none" opacity="0.35"/>
      <path d="M30 5 Q28 18 38 20 Q28 22 30 35" stroke="#c9a44e" stroke-width="0.6" fill="none" opacity="0.4"/>
      <path d="M55 5 Q53 14 60 16 Q53 18 55 27" stroke="#c9a44e" stroke-width="0.5" fill="none" opacity="0.3"/>
      <path d="M5 30 Q18 28 20 38 Q22 28 35 30" stroke="#c9a44e" stroke-width="0.6" fill="none" opacity="0.4"/>
      <path d="M5 55 Q14 53 16 60 Q18 53 27 55" stroke="#c9a44e" stroke-width="0.5" fill="none" opacity="0.3"/>
      <circle cx="10" cy="10" r="4" fill="none" stroke="#c9a44e" stroke-width="0.7" opacity="0.5"/>
      <circle cx="10" cy="10" r="1.5" fill="#c9a44e" opacity="0.4"/>
      <polygon points="10,20 12,24 10,28 8,24" fill="#c9a44e" opacity="0.25"/>
      <polygon points="20,10 24,12 28,10 24,8" fill="#c9a44e" opacity="0.25"/>
    </svg>
  </div>
  <div class="corner corner--bl">
    <svg viewBox="0 0 110 110" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path d="M5 105 L5 25 Q5 5 25 5 L105 5" stroke="#c9a44e" stroke-width="1.2" fill="none" opacity="0.5"/>
      <path d="M15 95 L15 28 Q15 15 28 15 L95 15" stroke="#c9a44e" stroke-width="0.6" fill="none" opacity="0.35"/>
      <circle cx="10" cy="10" r="4" fill="none" stroke="#c9a44e" stroke-width="0.7" opacity="0.5"/>
      <circle cx="10" cy="10" r="1.5" fill="#c9a44e" opacity="0.4"/>
    </svg>
  </div>
  <div class="corner corner--br">
    <svg viewBox="0 0 110 110" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path d="M5 105 L5 25 Q5 5 25 5 L105 5" stroke="#c9a44e" stroke-width="1.2" fill="none" opacity="0.5"/>
      <path d="M15 95 L15 28 Q15 15 28 15 L95 15" stroke="#c9a44e" stroke-width="0.6" fill="none" opacity="0.35"/>
      <circle cx="10" cy="10" r="4" fill="none" stroke="#c9a44e" stroke-width="0.7" opacity="0.5"/>
      <circle cx="10" cy="10" r="1.5" fill="#c9a44e" opacity="0.4"/>
    </svg>
  </div>

  <!-- Side arabesque strips -->
  <div class="side-strip side-strip--left">
    <svg width="36" height="700" viewBox="0 0 36 700" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path d="M18 0 Q30 50 18 100 Q6 150 18 200 Q30 250 18 300 Q6 350 18 400 Q30 450 18 500 Q6 550 18 600 Q30 650 18 700" stroke="#c9a44e" stroke-width="1" fill="none"/>
      <!-- Leaf pairs along the vine -->
      ${[50,150,250,350,450,550,650].map(y => `
        <path d="M18 ${y} Q28 ${y-8} 24 ${y-18} Q18 ${y-6} 18 ${y}Z" fill="#c9a44e" opacity="0.5"/>
        <path d="M18 ${y} Q8 ${y-8} 12 ${y-18} Q18 ${y-6} 18 ${y}Z" fill="#c9a44e" opacity="0.5"/>
        <circle cx="18" cy="${y}" r="2.5" fill="#c9a44e" opacity="0.4"/>
      `).join('')}
      <!-- Small diamonds between -->
      ${[100,200,300,400,500,600].map(y => `
        <polygon points="18,${y-5} 21,${y} 18,${y+5} 15,${y}" fill="#c9a44e" opacity="0.3"/>
      `).join('')}
    </svg>
  </div>
  <div class="side-strip side-strip--right">
    <svg width="36" height="700" viewBox="0 0 36 700" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path d="M18 0 Q30 50 18 100 Q6 150 18 200 Q30 250 18 300 Q6 350 18 400 Q30 450 18 500 Q6 550 18 600 Q30 650 18 700" stroke="#c9a44e" stroke-width="1" fill="none"/>
      ${[50,150,250,350,450,550,650].map(y => `
        <path d="M18 ${y} Q28 ${y-8} 24 ${y-18} Q18 ${y-6} 18 ${y}Z" fill="#c9a44e" opacity="0.5"/>
        <path d="M18 ${y} Q8 ${y-8} 12 ${y-18} Q18 ${y-6} 18 ${y}Z" fill="#c9a44e" opacity="0.5"/>
        <circle cx="18" cy="${y}" r="2.5" fill="#c9a44e" opacity="0.4"/>
      `).join('')}
      ${[100,200,300,400,500,600].map(y => `
        <polygon points="18,${y-5} 21,${y} 18,${y+5} 15,${y}" fill="#c9a44e" opacity="0.3"/>
      `).join('')}
    </svg>
  </div>

  <!-- Main content -->
  <div class="content">

    <div class="top-orn">&#10022;  &#10022;  &#10022;</div>

    <!-- Wedding Logo -->
    <div class="logo-wrap">
      <img src="${logoDataUrl}" alt="K&L"/>
    </div>

    <div class="families">
      <div class="families-label">Les Familles</div>
      <div class="families-names">HARMALI</div>
      <div class="families-amp">&</div>
      <div class="families-names">MEDJKOUH</div>
    </div>

    <div class="divider">
      <span class="divider-line"></span>
      <span class="divider-diamond">&#9670;</span>
      <span class="divider-line"></span>
    </div>

    <p class="invite-text">ont le plaisir de vous inviter<br>au mariage de leurs enfants</p>

    <div class="couple">Lynda <span class="amp">&</span> Khaled</div>

    <div class="divider">
      <span class="divider-line"></span>
      <span class="divider-diamond">&#9670;</span>
      <span class="divider-line"></span>
    </div>

    <p class="date">SAMEDI 23 MAI 2026</p>
    <p class="time">D\u00e9but de la c\u00e9r\u00e9monie \u00e0 14h00</p>

    <div class="divider" style="margin:32px 0;">
      <span class="divider-line" style="width:120px;"></span>
      <span class="divider-diamond">&#9670;</span>
      <span class="divider-line" style="width:120px;"></span>
    </div>

    <p class="venue-sub">Salle des F\u00eates</p>
    <p class="venue">PALAIS LAYEL</p>
    <p class="venue-location">Bordj El Bahri, Alger</p>

    <!-- No children notice -->
    <div class="no-kids">
      <div class="no-kids-text">
        La place des enfants est dans nos c&#339;urs&hellip;<br>
        <span style="color:#c9a44e;">mais pas dans la salle !</span><br>
        Merci de votre compr\u00e9hension
      </div>
    </div>

    <!-- QR Code -->
    <div class="qr-section">
      <span class="qr-label">Un scan et vous aurez tout !<br><span style="font-size:0.7em; opacity:0.7;">(D\u00e9tails + Google Maps)</span></span>
      <div class="qr-code">
        <img src="${qrDataUrl}" alt="QR Code"/>
      </div>
    </div>

    <div class="bottom-orn">&#10087;</div>
  </div>

</div>
</body>
</html>`;
}
