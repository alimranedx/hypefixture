import fs from 'fs';
import path from 'path';
import sharp from 'sharp';

const publicDir = path.resolve('public');

// MASTER SHIELD SVG FRAGMENT (Can be embedded or used standalone)
function getShieldSvg({ x = 0, y = 0, scale = 1, showLiveDot = true } = {}) {
  return `
  <g id="master-shield-group" transform="translate(${x}, ${y}) scale(${scale})">
    <defs>
      <!-- Shield Rim Gradient -->
      <linearGradient id="shieldRim" x1="100" y1="50" x2="412" y2="470" gradientUnits="userSpaceOnUse">
        <stop offset="0%" stop-color="#34D399"/>
        <stop offset="45%" stop-color="#10B981"/>
        <stop offset="75%" stop-color="#06B6D4"/>
        <stop offset="100%" stop-color="#3B82F6"/>
      </linearGradient>

      <linearGradient id="shieldInner" x1="120" y1="60" x2="392" y2="450" gradientUnits="userSpaceOnUse">
        <stop offset="0%" stop-color="#1E293B" stop-opacity="0.95"/>
        <stop offset="50%" stop-color="#0F172A" stop-opacity="0.98"/>
        <stop offset="100%" stop-color="#020617"/>
      </linearGradient>

      <!-- Flame Gradients -->
      <linearGradient id="flameLeft" x1="150" y1="120" x2="250" y2="380" gradientUnits="userSpaceOnUse">
        <stop offset="0%" stop-color="#6EE7B7"/>
        <stop offset="40%" stop-color="#10B981"/>
        <stop offset="100%" stop-color="#047857"/>
      </linearGradient>

      <linearGradient id="flameCenter" x1="220" y1="90" x2="292" y2="350" gradientUnits="userSpaceOnUse">
        <stop offset="0%" stop-color="#A7F3D0"/>
        <stop offset="25%" stop-color="#34D399"/>
        <stop offset="70%" stop-color="#06B6D4"/>
        <stop offset="100%" stop-color="#0284C7"/>
      </linearGradient>

      <linearGradient id="flameRight" x1="270" y1="140" x2="370" y2="380" gradientUnits="userSpaceOnUse">
        <stop offset="0%" stop-color="#67E8F9"/>
        <stop offset="50%" stop-color="#0EA5E9"/>
        <stop offset="100%" stop-color="#2563EB"/>
      </linearGradient>

      <!-- Bolt Gradient -->
      <linearGradient id="clashBolt" x1="210" y1="180" x2="330" y2="340" gradientUnits="userSpaceOnUse">
        <stop offset="0%" stop-color="#FFFBEB"/>
        <stop offset="20%" stop-color="#FDE047"/>
        <stop offset="65%" stop-color="#F59E0B"/>
        <stop offset="100%" stop-color="#EF4444"/>
      </linearGradient>

      <!-- Glow -->
      <filter id="shieldGlow" x="-20%" y="-20%" width="140%" height="140%" filterUnits="userSpaceOnUse">
        <feGaussianBlur stdDeviation="8" result="blur2"/>
        <feComposite in="SourceGraphic" in2="blur2" operator="over"/>
      </filter>
    </defs>

    <!-- Outer Rim -->
    <path d="M 256 46 
             C 328 46, 396 68, 426 94 
             C 426 180, 424 290, 386 368 
             C 354 430, 298 466, 256 480 
             C 214 466, 158 430, 126 368 
             C 88 290, 86 180, 86 94 
             C 116 68, 184 46, 256 46 Z" 
          fill="url(#shieldRim)" />

    <!-- Inner Cavity -->
    <path d="M 256 58 
             C 322 58, 386 78, 412 102 
             C 412 182, 410 284, 374 356 
             C 344 414, 292 448, 256 462 
             C 220 448, 168 414, 138 356 
             C 102 284, 100 182, 100 102 
             C 126 78, 190 58, 256 58 Z" 
          fill="url(#shieldInner)" />

    <!-- Grid / Seams -->
    <path d="M 256 68 V 450" stroke="#334155" stroke-width="1.5" stroke-dasharray="6 6" stroke-opacity="0.4"/>
    <path d="M 120 230 C 180 280, 332 280, 392 230" stroke="#334155" stroke-width="1.5" stroke-dasharray="4 8" stroke-opacity="0.3"/>

    <!-- Emblem Core -->
    <g filter="url(#shieldGlow)">
      <!-- Left Flame Wing -->
      <path d="M 160 354 C 148 300, 158 238, 186 184 C 200 156, 222 132, 234 104 C 230 134, 220 162, 206 188 C 192 216, 184 250, 192 286 C 196 304, 208 322, 222 334 L 194 362 C 178 366, 166 364, 160 354 Z" 
            fill="url(#flameLeft)" />

      <!-- Right Flame Wing -->
      <path d="M 352 354 C 364 300, 354 238, 326 184 C 312 156, 290 132, 278 104 C 282 134, 292 162, 306 188 C 320 216, 328 250, 320 286 C 316 304, 304 322, 290 334 L 318 362 C 334 366, 346 364, 352 354 Z" 
            fill="url(#flameRight)" />

      <!-- Center Flame -->
      <path d="M 256 78 C 272 120, 296 160, 294 210 C 292 238, 280 262, 268 284 C 264 266, 266 248, 272 232 C 278 214, 276 194, 266 178 C 258 198, 252 222, 254 246 C 246 230, 244 210, 248 190 C 242 208, 236 228, 236 250 C 236 276, 244 298, 256 318 C 244 316, 232 308, 224 296 C 212 278, 212 254, 218 232 C 224 208, 238 186, 244 162 C 252 134, 252 106, 256 78 Z" 
            fill="url(#flameCenter)" />

      <!-- Clash Bolt -->
      <polygon points="266,168 214,268 260,264 228,374 314,248 268,252 302,168" 
               fill="url(#clashBolt)" 
               stroke="#FFFFFF" 
               stroke-width="1.5" 
               stroke-linejoin="round"/>

      <!-- Flares -->
      <polygon points="256,52 260,62 270,66 260,70 256,80 252,70 242,66 252,62" fill="#67E8F9"/>
      <polygon points="144,196 148,206 158,208 148,212 144,222 140,212 130,208 140,206" fill="#A7F3D0"/>
      <polygon points="368,196 372,206 382,208 372,212 368,222 364,212 354,208 364,206" fill="#FDE047"/>
    </g>

    ${showLiveDot ? `
    <!-- Pulsing Live Matchday Beacon -->
    <circle cx="376" cy="386" r="13" fill="#EF4444" filter="url(#shieldGlow)"/>
    <circle cx="376" cy="386" r="6" fill="#FEE2E2"/>
    ` : ''}
  </g>`;
}

// 1. App Icon SVG (512x512)
function getIconSvg(transparent = false) {
  return `<?xml version="1.0" encoding="UTF-8"?>
<svg width="512" height="512" viewBox="0 0 512 512" fill="none" xmlns="http://www.w3.org/2000/svg">
  <defs>
    <linearGradient id="bgGrad" x1="0" y1="0" x2="512" y2="512" gradientUnits="userSpaceOnUse">
      <stop offset="0%" stop-color="#0F172A"/>
      <stop offset="60%" stop-color="#070C18"/>
      <stop offset="100%" stop-color="#020617"/>
    </linearGradient>
    <radialGradient id="auraGlow" cx="256" cy="240" r="180" gradientUnits="userSpaceOnUse">
      <stop offset="0%" stop-color="#10B981" stop-opacity="0.3"/>
      <stop offset="100%" stop-color="#10B981" stop-opacity="0"/>
    </radialGradient>
  </defs>

  ${transparent ? '' : `
  <rect width="512" height="512" rx="112" fill="url(#bgGrad)"/>
  <rect x="2" y="2" width="508" height="508" rx="110" stroke="#1E293B" stroke-width="3" stroke-opacity="0.6"/>
  <circle cx="256" cy="240" r="180" fill="url(#auraGlow)"/>
  `}

  ${getShieldSvg({ x: 0, y: 0, scale: 1, showLiveDot: true })}
</svg>`;
}

// 2. Horizontal Master Brand Logo (1200x340)
function getHorizontalLogoSvg(transparent = false) {
  return `<?xml version="1.0" encoding="UTF-8"?>
<svg width="1200" height="340" viewBox="0 0 1200 340" fill="none" xmlns="http://www.w3.org/2000/svg">
  <defs>
    <linearGradient id="bgHGrad" x1="0" y1="0" x2="1200" y2="340" gradientUnits="userSpaceOnUse">
      <stop offset="0%" stop-color="#0B1120"/>
      <stop offset="50%" stop-color="#020617"/>
      <stop offset="100%" stop-color="#050811"/>
    </linearGradient>

    <!-- Fixture Wordmark Gradient -->
    <linearGradient id="fixtureWordGrad" x1="680" y1="120" x2="1100" y2="190" gradientUnits="userSpaceOnUse">
      <stop offset="0%" stop-color="#34D399"/>
      <stop offset="40%" stop-color="#10B981"/>
      <stop offset="100%" stop-color="#06B6D4"/>
    </linearGradient>

    <filter id="textGlow" x="-20%" y="-20%" width="140%" height="140%" filterUnits="userSpaceOnUse">
      <feGaussianBlur stdDeviation="6" result="blurT"/>
      <feComposite in="SourceGraphic" in2="blurT" operator="over"/>
    </filter>

    <radialGradient id="hAura" cx="160" cy="170" r="140" gradientUnits="userSpaceOnUse">
      <stop offset="0%" stop-color="#10B981" stop-opacity="0.25"/>
      <stop offset="100%" stop-color="#10B981" stop-opacity="0"/>
    </radialGradient>
  </defs>

  <style>
    .brand-title {
      font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif;
      font-weight: 900;
      letter-spacing: -2px;
      font-style: italic;
    }
    .brand-sub {
      font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;
      font-weight: 700;
      letter-spacing: 5px;
      text-transform: uppercase;
      font-size: 19px;
    }
    .badge-pill {
      font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;
      font-weight: 800;
      letter-spacing: 2px;
      font-size: 12px;
    }
  </style>

  ${transparent ? '' : `
  <!-- Canvas Base -->
  <rect width="1200" height="340" rx="36" fill="url(#bgHGrad)"/>
  <rect x="2" y="2" width="1196" height="336" rx="34" stroke="#1E293B" stroke-width="2"/>
  <circle cx="160" cy="170" r="140" fill="url(#hAura)"/>
  <line x1="330" y1="40" x2="330" y2="300" stroke="#1E293B" stroke-width="2"/>
  <circle cx="330" cy="170" r="4" fill="#10B981"/>
  `}

  <!-- Left: Shield Emblem (Fitted cleanly at height 270, scaled ~0.58) -->
  ${getShieldSvg({ x: 18, y: 22, scale: 0.58, showLiveDot: true })}

  <!-- Right: Brand Typography & Meta Badges -->
  <g transform="translate(370, 0)">
    <!-- Top Pill Badges -->
    <g transform="translate(0, 54)">
      <rect width="180" height="28" rx="14" fill="#042F2E" stroke="#14B8A6" stroke-width="1.2"/>
      <circle cx="16" cy="14" r="4.5" fill="#2DD4BF"/>
      <text x="30" y="19" fill="#2DD4BF" class="badge-pill">LIVE MATCHDAY</text>

      <g transform="translate(196, 0)">
        <rect width="190" height="28" rx="14" fill="#1E1B4B" stroke="#6366F1" stroke-width="1.2" stroke-opacity="0.8"/>
        <text x="18" y="19" fill="#A5B4FC" class="badge-pill">SPORTS MEDIA HUB</text>
      </g>
    </g>

    <!-- Main Wordmark: HYPE FIXTURE -->
    <g transform="translate(0, 168)">
      <text x="0" y="0" fill="#FFFFFF" font-size="100" class="brand-title">HYPE</text>
      <text x="305" y="0" fill="url(#fixtureWordGrad)" font-size="100" class="brand-title" filter="url(#textGlow)">FIXTURE</text>

      <!-- Broadcast Live Dot with Glow -->
      <circle cx="770" cy="-66" r="12" fill="#EF4444" filter="url(#textGlow)"/>
      <circle cx="770" cy="-66" r="6" fill="#FEE2E2"/>
    </g>

    <!-- Tagline -->
    <g transform="translate(4, 218)">
      <text x="0" y="0" fill="#94A3B8" class="brand-sub">
        WHERE TO WATCH <tspan fill="#34D399">&#8226;</tspan> LIVE STREAMS <tspan fill="#06B6D4">&#8226;</tspan> PREVIEWS
      </text>
    </g>

    <!-- Sport Category Ticker Bar -->
    <g transform="translate(2, 246)">
      <rect width="770" height="36" rx="10" fill="#0F172A" stroke="#1E293B" stroke-width="1"/>
      <text x="24" y="23" fill="#64748B" font-family="system-ui, sans-serif" font-size="13" font-weight="700" letter-spacing="1.5">
        ⚽ SOCCER &#160;|&#160; 🏈 NFL &#160;|&#160; 🏀 NBA &#160;|&#160; 🥊 UFC &amp; BOXING &#160;|&#160; ⚡ HIGH-CTR BROADCASTS
      </text>
    </g>
  </g>
</svg>`;
}

// 3. OpenGraph Social Share Card (1200x630)
function getOgImageSvg() {
  return `<?xml version="1.0" encoding="UTF-8"?>
<svg width="1200" height="630" viewBox="0 0 1200 630" fill="none" xmlns="http://www.w3.org/2000/svg">
  <defs>
    <linearGradient id="ogBg2" x1="0" y1="0" x2="1200" y2="630" gradientUnits="userSpaceOnUse">
      <stop offset="0%" stop-color="#0B132B"/>
      <stop offset="50%" stop-color="#020617"/>
      <stop offset="100%" stop-color="#040914"/>
    </linearGradient>

    <radialGradient id="ogGlow2" cx="600" cy="220" r="420" gradientUnits="userSpaceOnUse">
      <stop offset="0%" stop-color="#10B981" stop-opacity="0.22"/>
      <stop offset="100%" stop-color="#10B981" stop-opacity="0"/>
    </radialGradient>

    <linearGradient id="ogFixtureGrad" x1="680" y1="120" x2="1080" y2="190" gradientUnits="userSpaceOnUse">
      <stop offset="0%" stop-color="#34D399"/>
      <stop offset="40%" stop-color="#10B981"/>
      <stop offset="100%" stop-color="#06B6D4"/>
    </linearGradient>

    <filter id="ogNeonFilter" x="-20%" y="-20%" width="140%" height="140%" filterUnits="userSpaceOnUse">
      <feGaussianBlur stdDeviation="12" result="blurO"/>
      <feComposite in="SourceGraphic" in2="blurO" operator="over"/>
    </filter>
  </defs>

  <!-- Background -->
  <rect width="1200" height="630" fill="url(#ogBg2)"/>
  <circle cx="600" cy="220" r="420" fill="url(#ogGlow2)"/>

  <!-- Stadium Lighting Curve -->
  <path d="M 80 630 C 320 380, 880 380, 1120 630" stroke="#1E293B" stroke-width="2" stroke-dasharray="8 8" opacity="0.4"/>
  <circle cx="600" cy="630" r="260" stroke="#1E293B" stroke-width="1.5" opacity="0.3"/>

  <!-- Centered Hero Branding Unit -->
  <g transform="translate(160, 110)">
    <!-- Shield Emblem (Scaled ~0.5) -->
    ${getShieldSvg({ x: 0, y: 0, scale: 0.5, showLiveDot: true })}

    <!-- Brand Typography -->
    <g transform="translate(280, 50)">
      <g transform="translate(0, 0)">
        <rect width="210" height="28" rx="14" fill="#042F2E" stroke="#14B8A6" stroke-width="1.2"/>
        <circle cx="16" cy="14" r="4.5" fill="#2DD4BF"/>
        <text x="32" y="19" fill="#2DD4BF" font-family="'Segoe UI', Roboto, Helvetica, Arial, sans-serif" font-size="12" font-weight="800" letter-spacing="2">OFFICIAL FIXTURES</text>
      </g>

      <g transform="translate(0, 86)">
        <text x="0" y="0" fill="#FFFFFF" font-family="'Segoe UI', Roboto, 'Arial Black', Impact, sans-serif" font-weight="900" font-size="80" font-style="italic" letter-spacing="-2px">HYPE<tspan fill="url(#ogFixtureGrad)">FIXTURE</tspan></text>
        <circle cx="630" cy="-56" r="10" fill="#EF4444" filter="url(#ogNeonFilter)"/>
      </g>

      <text x="4" y="132" fill="#38BDF8" font-family="'Segoe UI', Roboto, Helvetica, Arial, sans-serif" font-weight="700" font-size="19" letter-spacing="4px">WHERE TO WATCH &#8226; LIVE STREAMS &#8226; PREVIEWS</text>
    </g>
  </g>

  <!-- Sports Channels & Features Ticker -->
  <g transform="translate(160, 440)">
    <rect width="880" height="72" rx="20" fill="#0F172A" stroke="#1E293B" stroke-width="1.5"/>
    <text x="44" y="44" fill="#94A3B8" font-family="'Segoe UI', Roboto, Helvetica, Arial, sans-serif" font-size="20" font-weight="700">
      ⚽ Football &#160;&#8226;&#160; 🏀 NBA &#160;&#8226;&#160; 🏈 NFL &#160;&#8226;&#160; 🥊 UFC &amp; Boxing &#160;&#8226;&#160; ⚡ 100% Verified Broadcasters
    </text>
  </g>
</svg>`;
}

async function buildAll() {
  console.log('Generating vector SVG files...');

  const iconSvg = getIconSvg(false);
  const markSvg = getIconSvg(true);
  const horizontalSvg = getHorizontalLogoSvg(false);
  const horizontalTransparentSvg = getHorizontalLogoSvg(true);
  const ogSvg = getOgImageSvg();

  fs.writeFileSync(path.join(publicDir, 'logo-icon.svg'), iconSvg, 'utf8');
  fs.writeFileSync(path.join(publicDir, 'logo-mark.svg'), markSvg, 'utf8');
  fs.writeFileSync(path.join(publicDir, 'logo.svg'), horizontalSvg, 'utf8');
  fs.writeFileSync(path.join(publicDir, 'logo-transparent.svg'), horizontalTransparentSvg, 'utf8');

  console.log('Rendering High-Res PNG assets with Sharp...');

  // 1. App Icon 512x512
  await sharp(Buffer.from(iconSvg))
    .resize(512, 512)
    .png({ quality: 100 })
    .toFile(path.join(publicDir, 'logo-icon.png'));

  // 2. Ultra HD Icon 1024x1024
  await sharp(Buffer.from(iconSvg))
    .resize(1024, 1024)
    .png({ quality: 100 })
    .toFile(path.join(publicDir, 'logo-icon-1024.png'));

  // 3. Transparent Mark 512x512
  await sharp(Buffer.from(markSvg))
    .resize(512, 512)
    .png({ quality: 100 })
    .toFile(path.join(publicDir, 'logo-mark.png'));

  // 4. Horizontal Master Brand Logo 1200x340
  await sharp(Buffer.from(horizontalSvg))
    .resize(1200, 340)
    .png({ quality: 100 })
    .toFile(path.join(publicDir, 'logo.png'));

  // 5. Horizontal Transparent Brand Logo 1200x340
  await sharp(Buffer.from(horizontalTransparentSvg))
    .resize(1200, 340)
    .png({ quality: 100 })
    .toFile(path.join(publicDir, 'logo-transparent.png'));

  // 6. Compact Logo 600x170
  await sharp(Buffer.from(horizontalSvg))
    .resize(600, 170)
    .png({ quality: 100 })
    .toFile(path.join(publicDir, 'logo-compact.png'));

  // 7. OpenGraph Social Share Card 1200x630
  await sharp(Buffer.from(ogSvg))
    .resize(1200, 630)
    .png({ quality: 100 })
    .toFile(path.join(publicDir, 'og-image.png'));

  // 8. Favicons (64x64, 32x32, 16x16)
  await sharp(Buffer.from(iconSvg))
    .resize(64, 64)
    .png({ quality: 100 })
    .toFile(path.join(publicDir, 'favicon-64.png'));

  await sharp(Buffer.from(iconSvg))
    .resize(32, 32)
    .png({ quality: 100 })
    .toFile(path.join(publicDir, 'favicon-32.png'));

  console.log('ALL BRAND ASSETS SUCCESSFULLY GENERATED!');
}

buildAll().catch(err => {
  console.error(err);
  process.exit(1);
});
