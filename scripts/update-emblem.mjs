import fs from 'fs';
import path from 'path';
import sharp from 'sharp';

const publicDir = path.resolve('public');

// MASTER EMBLEM: Sleek Aerodynamic Sports Shield with Roaring Hype Flame & Matchday Clash Bolt
function createMasterEmblem(size = 512, transparent = false) {
  return `<?xml version="1.0" encoding="UTF-8"?>
<svg width="${size}" height="${size}" viewBox="0 0 512 512" fill="none" xmlns="http://www.w3.org/2000/svg">
  <defs>
    <!-- Background Gradient -->
    <linearGradient id="bgGrad" x1="0" y1="0" x2="512" y2="512" gradientUnits="userSpaceOnUse">
      <stop offset="0%" stop-color="#0F172A"/>
      <stop offset="60%" stop-color="#070C18"/>
      <stop offset="100%" stop-color="#020617"/>
    </linearGradient>

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

    <!-- Flame Blade 1 (Left - Emerald to Mint) -->
    <linearGradient id="flameLeft" x1="150" y1="120" x2="250" y2="380" gradientUnits="userSpaceOnUse">
      <stop offset="0%" stop-color="#6EE7B7"/>
      <stop offset="40%" stop-color="#10B981"/>
      <stop offset="100%" stop-color="#047857"/>
    </linearGradient>

    <!-- Flame Blade 2 (Center - High Energy Vivid Teal & Electric Cyan) -->
    <linearGradient id="flameCenter" x1="220" y1="90" x2="292" y2="350" gradientUnits="userSpaceOnUse">
      <stop offset="0%" stop-color="#A7F3D0"/>
      <stop offset="25%" stop-color="#34D399"/>
      <stop offset="70%" stop-color="#06B6D4"/>
      <stop offset="100%" stop-color="#0284C7"/>
    </linearGradient>

    <!-- Flame Blade 3 (Right - Electric Cyan to Royal Blue) -->
    <linearGradient id="flameRight" x1="270" y1="140" x2="370" y2="380" gradientUnits="userSpaceOnUse">
      <stop offset="0%" stop-color="#67E8F9"/>
      <stop offset="50%" stop-color="#0EA5E9"/>
      <stop offset="100%" stop-color="#2563EB"/>
    </linearGradient>

    <!-- Clash Bolt (Gold / Amber / Neon Red Fire Core) -->
    <linearGradient id="clashBolt" x1="210" y1="180" x2="330" y2="340" gradientUnits="userSpaceOnUse">
      <stop offset="0%" stop-color="#FFFBEB"/>
      <stop offset="20%" stop-color="#FDE047"/>
      <stop offset="65%" stop-color="#F59E0B"/>
      <stop offset="100%" stop-color="#EF4444"/>
    </linearGradient>

    <!-- Core Glow Filters -->
    <filter id="auraGlow" x="-30%" y="-30%" width="160%" height="160%" filterUnits="userSpaceOnUse">
      <feGaussianBlur stdDeviation="28" result="blur1"/>
      <feColorMatrix type="matrix" values="0 0 0 0 0.06   0 0 0 0 0.72   0 0 0 0 0.5   0 0 0 0.45 0"/>
    </filter>

    <filter id="neonPop" x="-20%" y="-20%" width="140%" height="140%" filterUnits="userSpaceOnUse">
      <feGaussianBlur stdDeviation="8" result="blur2"/>
      <feComposite in="SourceGraphic" in2="blur2" operator="over"/>
    </filter>
  </defs>

  ${transparent ? '' : `
  <!-- Canvas Background -->
  <rect width="512" height="512" rx="112" fill="url(#bgGrad)"/>
  <rect x="2" y="2" width="508" height="508" rx="110" stroke="#1E293B" stroke-width="3" stroke-opacity="0.6"/>

  <!-- Ambient Stadium Floodlight Backglow -->
  <circle cx="256" cy="240" r="160" fill="url(#auraGlow)"/>
  <ellipse cx="256" cy="270" rx="140" ry="110" fill="#06B6D4" fill-opacity="0.12" filter="url(#auraGlow)"/>
  `}

  <!-- AERODYNAMIC SPORTS SHIELD / CREST -->
  <g id="shield-crest">
    <!-- Outer Shield Bevel Rim -->
    <path d="M 256 46 
             C 328 46, 396 68, 426 94 
             C 426 180, 424 290, 386 368 
             C 354 430, 298 466, 256 480 
             C 214 466, 158 430, 126 368 
             C 88 290, 86 180, 86 94 
             C 116 68, 184 46, 256 46 Z" 
          fill="url(#shieldRim)" />

    <!-- Inner Shield Cavity -->
    <path d="M 256 58 
             C 322 58, 386 78, 412 102 
             C 412 182, 410 284, 374 356 
             C 344 414, 292 448, 256 462 
             C 220 448, 168 414, 138 356 
             C 102 284, 100 182, 100 102 
             C 126 78, 190 58, 256 58 Z" 
          fill="url(#shieldInner)" />

    <!-- Shield High-Tech Grid & Matchday Pitch Stripes -->
    <path d="M 256 68 V 450" stroke="#334155" stroke-width="1.5" stroke-dasharray="6 6" stroke-opacity="0.4"/>
    <path d="M 120 230 C 180 280, 332 280, 392 230" stroke="#334155" stroke-width="1.5" stroke-dasharray="4 8" stroke-opacity="0.3"/>
  </g>

  <!-- HYPE FLAME & FIXTURE LIGHTNING CLASH ICON -->
  <g id="emblem-core" filter="url(#neonPop)">
    <!-- 1. Left Flame Wing ("H" Anchor) -->
    <path d="M 160 354 
             C 148 300, 158 238, 186 184 
             C 200 156, 222 132, 234 104 
             C 230 134, 220 162, 206 188 
             C 192 216, 184 250, 192 286 
             C 196 304, 208 322, 222 334 
             L 194 362 
             C 178 366, 166 364, 160 354 Z" 
          fill="url(#flameLeft)" />

    <!-- 2. Right Flame Wing ("F" Streamer) -->
    <path d="M 352 354 
             C 364 300, 354 238, 326 184 
             C 312 156, 290 132, 278 104 
             C 282 134, 292 162, 306 188 
             C 320 216, 328 250, 320 286 
             C 316 304, 304 322, 290 334 
             L 318 362 
             C 334 366, 346 364, 352 354 Z" 
          fill="url(#flameRight)" />

    <!-- 3. Center Roaring Alpha Flame (The Peak Crest) -->
    <path d="M 256 78 
             C 272 120, 296 160, 294 210 
             C 292 238, 280 262, 268 284 
             C 264 266, 266 248, 272 232 
             C 278 214, 276 194, 266 178 
             C 258 198, 252 222, 254 246 
             C 246 230, 244 210, 248 190 
             C 242 208, 236 228, 236 250 
             C 236 276, 244 298, 256 318 
             C 244 316, 232 308, 224 296 
             C 212 278, 212 254, 218 232 
             C 224 208, 238 186, 244 162 
             C 252 134, 252 106, 256 78 Z" 
          fill="url(#flameCenter)" />

    <!-- 4. High-Voltage Fixture Clash Bolt (The Matchday Energy Surge) -->
    <!-- Stylized dynamic lightning bolt crossing between the flames like an electric spark -->
    <polygon points="266,168 214,268 260,264 228,374 314,248 268,252 302,168" 
             fill="url(#clashBolt)" 
             stroke="#FFFFFF" 
             stroke-width="1.5" 
             stroke-linejoin="round"/>

    <!-- Sharp Speed Sparks & Energy Particles -->
    <!-- Top Spark -->
    <polygon points="256,52 260,62 270,66 260,70 256,80 252,70 242,66 252,62" fill="#67E8F9"/>
    <!-- Left Flare -->
    <polygon points="144,196 148,206 158,208 148,212 144,222 140,212 130,208 140,206" fill="#A7F3D0"/>
    <!-- Right Flare -->
    <polygon points="368,196 372,206 382,208 372,212 368,222 364,212 354,208 364,206" fill="#FDE047"/>
  </g>

  <!-- Pulsing Matchday Red Broadcast Beacon (Bottom Right of Shield) -->
  <circle cx="376" cy="386" r="13" fill="#EF4444" filter="url(#neonPop)"/>
  <circle cx="376" cy="386" r="6" fill="#FEE2E2"/>
</svg>`;
}

async function run() {
  const emblemSvg = createMasterEmblem(512, false);
  const emblemTransparent = createMasterEmblem(512, true);

  fs.writeFileSync(path.join(publicDir, 'logo-icon.svg'), emblemSvg, 'utf8');
  fs.writeFileSync(path.join(publicDir, 'logo-mark.svg'), emblemTransparent, 'utf8');

  await sharp(Buffer.from(emblemSvg))
    .resize(512, 512)
    .png({ quality: 100 })
    .toFile(path.join(publicDir, 'logo-icon.png'));

  await sharp(Buffer.from(emblemSvg))
    .resize(1024, 1024)
    .png({ quality: 100 })
    .toFile(path.join(publicDir, 'logo-icon-1024.png'));

  await sharp(Buffer.from(emblemTransparent))
    .resize(512, 512)
    .png({ quality: 100 })
    .toFile(path.join(publicDir, 'logo-mark.png'));

  console.log('Master emblem updated!');
}

run().catch(console.error);
