import fs from 'fs';
import path from 'path';
import sharp from 'sharp';

const publicDir = path.resolve('public');

// 1. Sleek Modern Emblem Icon (512x512)
// Features: Dynamic stylized H-F sports flame & stadium clash fixture with neon emerald-to-cyan glow
const iconSvg = `<?xml version="1.0" encoding="UTF-8"?>
<svg width="512" height="512" viewBox="0 0 512 512" fill="none" xmlns="http://www.w3.org/2000/svg">
  <defs>
    <!-- Background Gradient -->
    <linearGradient id="bgGrad" x1="0" y1="0" x2="512" y2="512" gradientUnits="userSpaceOnUse">
      <stop offset="0%" stop-color="#0F172A"/>
      <stop offset="50%" stop-color="#090E1A"/>
      <stop offset="100%" stop-color="#020617"/>
    </linearGradient>

    <!-- Border Glow Gradient -->
    <linearGradient id="borderGrad" x1="60" y1="60" x2="452" y2="452" gradientUnits="userSpaceOnUse">
      <stop offset="0%" stop-color="#34D399" stop-opacity="0.8"/>
      <stop offset="50%" stop-color="#059669" stop-opacity="0.2"/>
      <stop offset="100%" stop-color="#06B6D4" stop-opacity="0.9"/>
    </linearGradient>

    <!-- Primary Emerald-Teal Flame Gradient -->
    <linearGradient id="flameGrad" x1="160" y1="90" x2="352" y2="410" gradientUnits="userSpaceOnUse">
      <stop offset="0%" stop-color="#6EE7B7"/>
      <stop offset="25%" stop-color="#10B981"/>
      <stop offset="70%" stop-color="#059669"/>
      <stop offset="100%" stop-color="#047857"/>
    </linearGradient>

    <!-- Electric Cyan Accent Gradient -->
    <linearGradient id="cyanGrad" x1="220" y1="120" x2="380" y2="380" gradientUnits="userSpaceOnUse">
      <stop offset="0%" stop-color="#67E8F9"/>
      <stop offset="50%" stop-color="#06B6D4"/>
      <stop offset="100%" stop-color="#0284C7"/>
    </linearGradient>

    <!-- Fixture Gold / Orange Spark Gradient -->
    <linearGradient id="sparkGrad" x1="260" y1="200" x2="360" y2="320" gradientUnits="userSpaceOnUse">
      <stop offset="0%" stop-color="#FDE047"/>
      <stop offset="60%" stop-color="#F59E0B"/>
      <stop offset="100%" stop-color="#EF4444"/>
    </linearGradient>

    <!-- High Impact Glow Filter -->
    <filter id="neonGlow" x="-20%" y="-20%" width="140%" height="140%" filterUnits="userSpaceOnUse">
      <feGaussianBlur stdDeviation="16" result="blur"/>
      <feComposite in="SourceGraphic" in2="blur" operator="over"/>
    </filter>

    <filter id="softGlow" x="-30%" y="-30%" width="160%" height="160%" filterUnits="userSpaceOnUse">
      <feGaussianBlur stdDeviation="30" result="blur2"/>
    </filter>
  </defs>

  <!-- Squircle Base with Metallic Sports Rim -->
  <rect x="16" y="16" width="480" height="480" rx="108" fill="url(#bgGrad)"/>
  <rect x="16" y="16" width="480" height="480" rx="108" stroke="url(#borderGrad)" stroke-width="4" stroke-opacity="0.85"/>

  <!-- Ambient Neon Field Reflections -->
  <circle cx="256" cy="256" r="160" fill="#10B981" fill-opacity="0.12" filter="url(#softGlow)"/>
  <circle cx="340" cy="180" r="100" fill="#06B6D4" fill-opacity="0.15" filter="url(#softGlow)"/>

  <!-- Geometric Stadium Grid Accent Lines -->
  <path d="M70 256 H442" stroke="#334155" stroke-width="1.5" stroke-dasharray="6 8" stroke-opacity="0.4"/>
  <circle cx="256" cy="256" r="180" stroke="#334155" stroke-width="1.5" stroke-dasharray="4 10" stroke-opacity="0.35"/>

  <!-- MAIN LOGO MARK: Aerodynamic Sports H-F Monogram Flame & Fixture Lightning -->
  <g filter="url(#neonGlow)">
    <!-- Left Wing / "H" Primary Pillar: Dynamic Upward Speed Slash -->
    <path d="M 148 376 
             L 204 136 
             C 208 118, 226 108, 242 116 
             L 240 162 
             C 224 170, 214 186, 210 206 
             L 182 344 
             C 180 354, 188 362, 198 362 
             L 236 362 
             L 226 404 
             L 164 404 
             C 152 404, 144 392, 148 376 Z" 
          fill="url(#flameGrad)" />

    <!-- Center Fixture Bridge / Clash Bolt: Connecting the H and F -->
    <polygon points="198,246 294,220 274,272 356,242 278,328 296,276 212,302" 
             fill="url(#sparkGrad)" />

    <!-- Right Wing / "F" Header Flame: Fast Streamer -->
    <path d="M 236 142 
             L 348 116 
             C 368 112, 386 128, 382 148 
             L 374 182 
             C 370 196, 356 204, 342 202 
             L 282 194 
             L 272 236 
             L 344 220 
             C 358 217, 370 228, 368 242 
             L 362 268 
             C 360 278, 348 286, 338 286 
             L 254 294 
             L 286 146 
             C 288 138, 296 132, 304 132 Z" 
          fill="url(#cyanGrad)" />

    <!-- Speed Sparks / Matchday Flare -->
    <circle cx="366" cy="108" r="7" fill="#67E8F9"/>
    <polygon points="388,162 402,176 384,178 382,192 374,178 360,174 374,166 376,152" fill="#FDE047"/>
    <circle cx="134" cy="392" r="5" fill="#34D399"/>
  </g>

  <!-- Glowing Live Dot Accent -->
  <circle cx="384" cy="384" r="10" fill="#EF4444" filter="url(#neonGlow)"/>
  <circle cx="384" cy="384" r="5" fill="#FECACA"/>
</svg>`;

// 2. Full Horizontal Brand Logo (1200 x 340)
// High-CTR, Sports Network Broadcast Quality with Typography & Live Indicator
const horizontalSvg = `<?xml version="1.0" encoding="UTF-8"?>
<svg width="1200" height="340" viewBox="0 0 1200 340" fill="none" xmlns="http://www.w3.org/2000/svg">
  <defs>
    <!-- Background Gradient -->
    <linearGradient id="bgHGrad" x1="0" y1="0" x2="1200" y2="340" gradientUnits="userSpaceOnUse">
      <stop offset="0%" stop-color="#0B1120"/>
      <stop offset="50%" stop-color="#020617"/>
      <stop offset="100%" stop-color="#060A14"/>
    </linearGradient>

    <!-- Emblem Box Gradient -->
    <linearGradient id="boxGrad" x1="30" y1="30" x2="290" y2="290" gradientUnits="userSpaceOnUse">
      <stop offset="0%" stop-color="#1E293B"/>
      <stop offset="100%" stop-color="#0B132B"/>
    </linearGradient>

    <linearGradient id="boxBorder" x1="30" y1="30" x2="290" y2="290" gradientUnits="userSpaceOnUse">
      <stop offset="0%" stop-color="#10B981"/>
      <stop offset="50%" stop-color="#334155"/>
      <stop offset="100%" stop-color="#06B6D4"/>
    </linearGradient>

    <!-- Flame & Accents -->
    <linearGradient id="hFlame" x1="80" y1="60" x2="240" y2="260" gradientUnits="userSpaceOnUse">
      <stop offset="0%" stop-color="#6EE7B7"/>
      <stop offset="50%" stop-color="#10B981"/>
      <stop offset="100%" stop-color="#047857"/>
    </linearGradient>

    <linearGradient id="hCyan" x1="140" y1="70" x2="260" y2="240" gradientUnits="userSpaceOnUse">
      <stop offset="0%" stop-color="#67E8F9"/>
      <stop offset="50%" stop-color="#06B6D4"/>
      <stop offset="100%" stop-color="#0369A1"/>
    </linearGradient>

    <linearGradient id="hSpark" x1="120" y1="110" x2="240" y2="210" gradientUnits="userSpaceOnUse">
      <stop offset="0%" stop-color="#FDE047"/>
      <stop offset="50%" stop-color="#F59E0B"/>
      <stop offset="100%" stop-color="#EF4444"/>
    </linearGradient>

    <!-- Text Fixture Gradient -->
    <linearGradient id="fixtureTextGrad" x1="680" y1="100" x2="1080" y2="180" gradientUnits="userSpaceOnUse">
      <stop offset="0%" stop-color="#34D399"/>
      <stop offset="40%" stop-color="#10B981"/>
      <stop offset="100%" stop-color="#06B6D4"/>
    </linearGradient>

    <filter id="hGlow" x="-20%" y="-20%" width="140%" height="140%" filterUnits="userSpaceOnUse">
      <feGaussianBlur stdDeviation="12" result="blur"/>
      <feComposite in="SourceGraphic" in2="blur" operator="over"/>
    </filter>

    <filter id="pulseGlow" x="-50%" y="-50%" width="200%" height="200%" filterUnits="userSpaceOnUse">
      <feGaussianBlur stdDeviation="8" result="blur"/>
      <feComposite in="SourceGraphic" in2="blur" operator="over"/>
    </filter>
  </defs>

  <style>
    .brand-title {
      font-family: system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif;
      font-weight: 900;
      letter-spacing: -2px;
      font-style: italic;
    }
    .brand-sub {
      font-family: system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;
      font-weight: 700;
      letter-spacing: 5px;
      text-transform: uppercase;
      font-size: 20px;
    }
    .badge-text {
      font-family: system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;
      font-weight: 800;
      letter-spacing: 2px;
      font-size: 13px;
    }
  </style>

  <!-- Deep Slate Glassmorphism Base -->
  <rect width="1200" height="340" rx="36" fill="url(#bgHGrad)"/>
  <rect x="1.5" y="1.5" width="1197" height="337" rx="34.5" stroke="#1E293B" stroke-width="2"/>

  <!-- Left Accent Sports Laser Beam -->
  <line x1="320" y1="36" x2="320" y2="304" stroke="#1E293B" stroke-width="2"/>
  <circle cx="320" cy="170" r="4" fill="#10B981"/>

  <!-- EMBLEM BADGE (Left) -->
  <g transform="translate(30, 30)">
    <rect width="260" height="280" rx="54" fill="url(#boxGrad)"/>
    <rect width="260" height="280" rx="54" stroke="url(#boxBorder)" stroke-width="3" stroke-opacity="0.7"/>

    <!-- Ambient glow behind icon -->
    <circle cx="130" cy="140" r="80" fill="#10B981" fill-opacity="0.18" filter="url(#hGlow)"/>

    <!-- Scaled Monogram (Fit inside 260x280) -->
    <g transform="translate(8, 12) scale(0.6)">
      <!-- Left Wing / "H" -->
      <path d="M 108 360 L 160 110 C 164 92, 184 82, 200 90 L 196 138 C 180 146, 170 162, 166 182 L 140 326 C 138 336, 146 344, 156 344 L 194 344 L 184 388 L 122 388 C 110 388, 102 376, 108 360 Z" 
            fill="url(#hFlame)"/>

      <!-- Center Clash Fixture Spark -->
      <polygon points="160,220 260,190 236,248 322,216 242,306 262,252 174,278" 
               fill="url(#hSpark)" />

      <!-- Right Wing / "F" -->
      <path d="M 198 120 L 314 92 C 334 88, 352 104, 348 124 L 340 160 C 336 174, 322 182, 308 180 L 246 172 L 236 216 L 310 198 C 324 195, 336 206, 334 220 L 328 248 C 326 258, 314 266, 304 266 L 218 274 L 250 124 C 252 116, 260 110, 268 110 Z" 
            fill="url(#hCyan)"/>

      <!-- Sparks -->
      <circle cx="336" cy="78" r="8" fill="#67E8F9"/>
      <polygon points="352,138 366,150 350,152 348,164 340,152 328,148 340,142 342,130" fill="#FDE047"/>
    </g>
  </g>

  <!-- BRAND TYPOGRAPHY (Right) -->
  <g transform="translate(360, 0)">
    <!-- Top Sports Category Pill / Tag -->
    <g transform="translate(0, 56)">
      <rect width="210" height="30" rx="15" fill="#042F2E" stroke="#14B8A6" stroke-width="1.5"/>
      <circle cx="16" cy="15" r="5" fill="#2DD4BF" filter="url(#pulseGlow)"/>
      <text x="30" y="20" fill="#2DD4BF" class="badge-text">TICKET COMPARISON</text>
    </g>

    <!-- High CTR Broadcast Network Tag -->
    <g transform="translate(226, 56)">
      <rect width="190" height="30" rx="15" fill="#1E1B4B" stroke="#6366F1" stroke-width="1.5" stroke-opacity="0.6"/>
      <text x="20" y="20" fill="#A5B4FC" class="badge-text">100% GUARANTEED</text>
    </g>

    <!-- Main Wordmark: TICKET FIXTURE -->
    <g transform="translate(0, 172)">
      <!-- TICKET -->
      <text x="0" y="0" fill="#FFFFFF" font-size="104" class="brand-title">TICKET</text>
      
      <!-- FIXTURE -->
      <text x="410" y="0" fill="url(#fixtureTextGrad)" font-size="104" class="brand-title">FIXTURE</text>

      <!-- Pulsing Matchday Red Broadcast Beacon -->
      <circle cx="890" cy="-70" r="13" fill="#EF4444" filter="url(#pulseGlow)"/>
      <circle cx="890" cy="-70" r="7" fill="#FEE2E2"/>
    </g>

    <!-- Tagline & High-Traffic Keywords -->
    <g transform="translate(4, 225)">
      <text x="0" y="0" fill="#94A3B8" class="brand-sub">
        VERIFIED MATCH TICKETS <tspan fill="#34D399">•</tspan> STADIUM SEATS <tspan fill="#06B6D4">•</tspan> BEST VALUE
      </text>
    </g>

    <!-- Sports Icons Badges Row -->
    <g transform="translate(2, 252)">
      <rect width="800" height="36" rx="10" fill="#0F172A" stroke="#1E293B" stroke-width="1"/>
      <text x="20" y="23" fill="#64748B" font-family="system-ui" font-size="13" font-weight="700" letter-spacing="1.5">
        🎟️ PREMIER LEAGUE &#160;|&#160; 🇪🇸 EL CLÁSICO &#160;|&#160; 🏆 CHAMPIONS LEAGUE &#160;|&#160; 🛡️ 100% BUYER PROTECTION
      </text>
    </g>
  </g>
</svg>`;

// 3. Transparent Vector Logo Mark (512x512, transparent background for watermarks/navbars/merch)
const transparentMarkSvg = `<?xml version="1.0" encoding="UTF-8"?>
<svg width="512" height="512" viewBox="0 0 512 512" fill="none" xmlns="http://www.w3.org/2000/svg">
  <defs>
    <linearGradient id="flameGradT" x1="160" y1="90" x2="352" y2="410" gradientUnits="userSpaceOnUse">
      <stop offset="0%" stop-color="#6EE7B7"/>
      <stop offset="25%" stop-color="#10B981"/>
      <stop offset="70%" stop-color="#059669"/>
      <stop offset="100%" stop-color="#047857"/>
    </linearGradient>

    <linearGradient id="cyanGradT" x1="220" y1="120" x2="380" y2="380" gradientUnits="userSpaceOnUse">
      <stop offset="0%" stop-color="#67E8F9"/>
      <stop offset="50%" stop-color="#06B6D4"/>
      <stop offset="100%" stop-color="#0284C7"/>
    </linearGradient>

    <linearGradient id="sparkGradT" x1="260" y1="200" x2="360" y2="320" gradientUnits="userSpaceOnUse">
      <stop offset="0%" stop-color="#FDE047"/>
      <stop offset="60%" stop-color="#F59E0B"/>
      <stop offset="100%" stop-color="#EF4444"/>
    </linearGradient>

    <filter id="neonGlowT" x="-20%" y="-20%" width="140%" height="140%" filterUnits="userSpaceOnUse">
      <feGaussianBlur stdDeviation="14" result="blur"/>
      <feComposite in="SourceGraphic" in2="blur" operator="over"/>
    </filter>
  </defs>

  <g filter="url(#neonGlowT)">
    <!-- Left Wing / "H" -->
    <path d="M 148 376 L 204 136 C 208 118, 226 108, 242 116 L 240 162 C 224 170, 214 186, 210 206 L 182 344 C 180 354, 188 362, 198 362 L 236 362 L 226 404 L 164 404 C 152 404, 144 392, 148 376 Z" 
          fill="url(#flameGradT)" />

    <!-- Center Clash Fixture Spark -->
    <polygon points="198,246 294,220 274,272 356,242 278,328 296,276 212,302" 
             fill="url(#sparkGradT)" />

    <!-- Right Wing / "F" -->
    <path d="M 236 142 L 348 116 C 368 112, 386 128, 382 148 L 374 182 C 370 196, 356 204, 342 202 L 282 194 L 272 236 L 344 220 C 358 217, 370 228, 368 242 L 362 268 C 360 278, 348 286, 338 286 L 254 294 L 286 146 C 288 138, 296 132, 304 132 Z" 
          fill="url(#cyanGradT)" />

    <!-- Accents -->
    <circle cx="366" cy="108" r="8" fill="#67E8F9"/>
    <polygon points="388,162 402,176 384,178 382,192 374,178 360,174 374,166 376,152" fill="#FDE047"/>
    <circle cx="134" cy="392" r="6" fill="#34D399"/>
  </g>
</svg>`;

async function main() {
  console.log('Writing SVG files...');
  fs.writeFileSync(path.join(publicDir, 'logo-icon.svg'), iconSvg, 'utf8');
  fs.writeFileSync(path.join(publicDir, 'logo.svg'), horizontalSvg, 'utf8');
  fs.writeFileSync(path.join(publicDir, 'logo-mark.svg'), transparentMarkSvg, 'utf8');

  console.log('Rendering High-Res PNGs with sharp...');
  
  // 1. App Icon PNG 512x512
  await sharp(Buffer.from(iconSvg))
    .resize(512, 512)
    .png({ quality: 100 })
    .toFile(path.join(publicDir, 'logo-icon.png'));

  // 2. High-Res Icon 1024x1024
  await sharp(Buffer.from(iconSvg))
    .resize(1024, 1024)
    .png({ quality: 100 })
    .toFile(path.join(publicDir, 'logo-icon-1024.png'));

  // 3. Full Brand Logo 1200x340
  await sharp(Buffer.from(horizontalSvg))
    .resize(1200, 340)
    .png({ quality: 100 })
    .toFile(path.join(publicDir, 'logo.png'));

  // 4. Compact Brand Logo 600x170 (ideal for retina navbar)
  await sharp(Buffer.from(horizontalSvg))
    .resize(600, 170)
    .png({ quality: 100 })
    .toFile(path.join(publicDir, 'logo-compact.png'));

  // 5. Transparent Mark PNG
  await sharp(Buffer.from(transparentMarkSvg))
    .resize(512, 512)
    .png({ quality: 100 })
    .toFile(path.join(publicDir, 'logo-mark.png'));

  // 6. Favicon 64x64 & 32x32
  await sharp(Buffer.from(iconSvg))
    .resize(64, 64)
    .png({ quality: 100 })
    .toFile(path.join(publicDir, 'favicon-64.png'));

  await sharp(Buffer.from(iconSvg))
    .resize(32, 32)
    .png({ quality: 100 })
    .toFile(path.join(publicDir, 'favicon-32.png'));

  // 7. OpenGraph / Social Share Preview Banner (1200x630)
  const ogSvg = `<?xml version="1.0" encoding="UTF-8"?>
<svg width="1200" height="630" viewBox="0 0 1200 630" fill="none" xmlns="http://www.w3.org/2000/svg">
  <defs>
    <linearGradient id="ogBg" x1="0" y1="0" x2="1200" y2="630" gradientUnits="userSpaceOnUse">
      <stop offset="0%" stop-color="#0A0F1D"/>
      <stop offset="50%" stop-color="#020617"/>
      <stop offset="100%" stop-color="#030712"/>
    </linearGradient>
    <radialGradient id="ogGlowGreen" cx="600" cy="240" r="400" gradientUnits="userSpaceOnUse">
      <stop offset="0%" stop-color="#10B981" stop-opacity="0.25"/>
      <stop offset="100%" stop-color="#10B981" stop-opacity="0"/>
    </radialGradient>
    <radialGradient id="ogGlowCyan" cx="720" cy="200" r="300" gradientUnits="userSpaceOnUse">
      <stop offset="0%" stop-color="#06B6D4" stop-opacity="0.2"/>
      <stop offset="100%" stop-color="#06B6D4" stop-opacity="0"/>
    </radialGradient>
    <filter id="ogNeon" x="-20%" y="-20%" width="140%" height="140%" filterUnits="userSpaceOnUse">
      <feGaussianBlur stdDeviation="16" result="blur"/>
      <feComposite in="SourceGraphic" in2="blur" operator="over"/>
    </filter>
  </defs>

  <rect width="1200" height="630" fill="url(#ogBg)"/>
  <circle cx="600" cy="240" r="400" fill="url(#ogGlowGreen)"/>
  <circle cx="720" cy="200" r="300" fill="url(#ogGlowCyan)"/>

  <!-- Stadium Field Light Arcs -->
  <path d="M 100 630 C 300 350, 900 350, 1100 630" stroke="#1E293B" stroke-width="2" stroke-dasharray="8 8" opacity="0.4"/>
  <circle cx="600" cy="630" r="280" stroke="#1E293B" stroke-width="1.5" opacity="0.3"/>

  <!-- Centered Logo Composition -->
  <g transform="translate(180, 120)">
    <!-- Emblem Box -->
    <rect x="0" y="20" width="180" height="180" rx="42" fill="#0F172A" stroke="#10B981" stroke-width="3" stroke-opacity="0.7"/>
    <g transform="translate(15, 25) scale(0.38)">
      <path d="M 148 376 L 204 136 C 208 118, 226 108, 242 116 L 240 162 C 224 170, 214 186, 210 206 L 182 344 C 180 354, 188 362, 198 362 L 236 362 L 226 404 L 164 404 C 152 404, 144 392, 148 376 Z" fill="#10B981"/>
      <polygon points="198,246 294,220 274,272 356,242 278,328 296,276 212,302" fill="#F59E0B"/>
      <path d="M 236 142 L 348 116 C 368 112, 386 128, 382 148 L 374 182 C 370 196, 356 204, 342 202 L 282 194 L 272 236 L 344 220 C 358 217, 370 228, 368 242 L 362 268 C 360 278, 348 286, 338 286 L 254 294 L 286 146 C 288 138, 296 132, 304 132 Z" fill="#06B6D4"/>
    </g>

    <!-- Main Title -->
    <text x="215" y="105" fill="#FFFFFF" font-family="system-ui, sans-serif" font-weight="900" font-size="76" font-style="italic" letter-spacing="-1px">TICKET<tspan fill="#34D399">FIXTURE</tspan></text>
    <circle cx="850" cy="50" r="9" fill="#EF4444" filter="url(#ogNeon)"/>

    <!-- Subtitle -->
    <text x="220" y="155" fill="#38BDF8" font-family="system-ui, sans-serif" font-weight="700" font-size="18" letter-spacing="4px">VERIFIED MATCHDAY TICKETS &amp; SEATING COMPARISON</text>

    <!-- Badge -->
    <rect x="220" y="175" width="240" height="28" rx="14" fill="#064E3B" stroke="#059669" stroke-width="1"/>
    <text x="238" y="194" fill="#6EE7B7" font-family="system-ui, sans-serif" font-weight="800" font-size="12" letter-spacing="2px">🛡️ 100% BUYER GUARANTEE</text>
  </g>

  <!-- Sports Category Footer Bar -->
  <g transform="translate(180, 440)">
    <rect width="840" height="70" rx="18" fill="#0B132B" stroke="#1E293B" stroke-width="1.5"/>
    <text x="40" y="42" fill="#94A3B8" font-family="system-ui, sans-serif" font-size="20" font-weight="700">
      🎟️ Premier League &#160;•&#160; 🇪🇸 El Clásico &#160;•&#160; 🏆 Champions League &#160;•&#160; 🛡️ SeatGeek &amp; StubHub
    </text>
  </g>
</svg>`;

  await sharp(Buffer.from(ogSvg))
    .resize(1200, 630)
    .png({ quality: 100 })
    .toFile(path.join(publicDir, 'og-image.png'));

  console.log('Successfully generated all logos and icons!');
}

main().catch(err => {
  console.error(err);
  process.exit(1);
});
