import fs from 'fs';
import path from 'path';

const assetsDir = path.resolve('public', 'assets');
if (!fs.existsSync(assetsDir)) {
  fs.mkdirSync(assetsDir, { recursive: true });
}

// Helper to write SVG
function writeSvg(filename, content) {
  fs.writeFileSync(path.join(assetsDir, filename), content.trim(), 'utf-8');
  console.log(`Created ${filename}`);
}

// 1. Avatar (Artist portrait placeholder)
writeSvg('avatar.svg', `
<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 400 400" width="100%" height="100%">
  <rect width="400" height="400" fill="#1E1D1C" />
  <defs>
    <radialGradient id="avatarGlow" cx="50%" cy="40%" r="50%">
      <stop offset="0%" stop-color="#3A3836" />
      <stop offset="100%" stop-color="#141312" />
    </radialGradient>
  </defs>
  <rect width="400" height="400" fill="url(#avatarGlow)" />
  <!-- Silhouette head and ink brushstrokes -->
  <circle cx="200" cy="160" r="65" fill="#EAE5DE" opacity="0.92" />
  <!-- Flowing dark hair & shadows -->
  <path d="M135 150 C130 90, 270 90, 265 150 C265 230, 245 280, 200 310 C155 280, 135 230, 135 150 Z" fill="#1E1D1C" />
  <path d="M150 140 Q200 80 250 140 Q260 210 200 240 Q140 210 150 140 Z" fill="#2B2A28" />
  <path d="M170 160 Q200 200 230 160 Q215 130 170 160 Z" fill="#F4F1EC" opacity="0.85" />
  <!-- Shards around portrait -->
  <polygon points="90,120 120,105 105,140" fill="#D8D2C9" opacity="0.4" />
  <polygon points="310,180 340,165 325,210" fill="#D8D2C9" opacity="0.5" />
  <polygon points="120,290 140,270 130,310" fill="#D8D2C9" opacity="0.3" />
  <polygon points="280,290 310,270 295,315" fill="#D8D2C9" opacity="0.4" />
  <!-- Collar / shoulders -->
  <path d="M90 400 L140 310 L260 310 L310 400 Z" fill="#141312" />
  <line x1="200" y1="310" x2="200" y2="400" stroke="#77726B" stroke-width="2" stroke-dasharray="4,4" />
  <!-- Label -->
  <text x="200" y="380" font-family="'Cormorant Garamond', Georgia, serif" font-size="14" fill="#8C8279" text-anchor="middle" letter-spacing="4">KAIEN // ATELIER</text>
</svg>
`);

// 2. Comic Book Cover ("ECHOES OF THE ABYSS")
writeSvg('comic-cover.svg', `
<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 600 850" width="100%" height="100%">
  <rect width="600" height="850" fill="#1E1D1C" />
  <defs>
    <linearGradient id="comicFade" x1="0%" y1="0%" x2="0%" y2="100%">
      <stop offset="0%" stop-color="#2D2B29" />
      <stop offset="60%" stop-color="#1E1D1C" />
      <stop offset="100%" stop-color="#121110" />
    </linearGradient>
    <pattern id="comicHalftone" width="12" height="12" patternUnits="userSpaceOnUse">
      <circle cx="6" cy="6" r="1.5" fill="#3D3A37" />
    </pattern>
  </defs>
  <rect width="600" height="850" fill="url(#comicFade)" />
  <rect y="350" width="600" height="500" fill="url(#comicHalftone)" opacity="0.6" />
  
  <!-- Moon / celestial disk -->
  <circle cx="300" cy="300" r="140" fill="none" stroke="#EAE5DE" stroke-width="2" stroke-dasharray="2,6" opacity="0.6" />
  <circle cx="300" cy="300" r="120" fill="#252422" />
  
  <!-- Silhouette monolith & horned figure -->
  <polygon points="300,160 320,380 280,380" fill="#F4F1EC" opacity="0.9" />
  <path d="M220 440 Q300 280 380 440 L340 540 L260 540 Z" fill="#EAE5DE" opacity="0.95" />
  <!-- Dramatic clawed hands & wings -->
  <path d="M220 440 C140 400 80 480 40 560 C120 530 180 500 240 480 Z" fill="#D8D2C9" opacity="0.5" />
  <path d="M380 440 C460 400 520 480 560 560 C480 530 420 500 360 480 Z" fill="#D8D2C9" opacity="0.5" />

  <!-- Jagged shards floating -->
  <polygon points="120,200 160,180 135,240" fill="#F4F1EC" opacity="0.8" />
  <polygon points="460,220 510,195 480,265" fill="#F4F1EC" opacity="0.75" />
  <polygon points="190,140 220,110 200,160" fill="#8C8279" opacity="0.6" />
  <polygon points="390,130 430,105 405,150" fill="#8C8279" opacity="0.6" />
  <polygon points="260,600 340,600 300,680" fill="#141312" />

  <!-- Comic Framing Borders -->
  <rect x="30" y="30" width="540" height="790" fill="none" stroke="#77726B" stroke-width="1.5" opacity="0.6" />
  <rect x="40" y="40" width="520" height="770" fill="none" stroke="#3D3A37" stroke-width="1" />

  <!-- Title block -->
  <text x="300" y="90" font-family="'Cormorant Garamond', Georgia, serif" font-size="16" fill="#8C8279" text-anchor="middle" letter-spacing="6">VOLUME I &bull; ACT ONE</text>
  <text x="300" y="740" font-family="'Cormorant Garamond', Georgia, serif" font-size="34" font-weight="600" fill="#F4F1EC" text-anchor="middle" letter-spacing="4">ECHOES OF THE ABYSS</text>
  <text x="300" y="775" font-family="'Inter', sans-serif" font-size="12" fill="#77726B" text-anchor="middle" letter-spacing="3">STORY &amp; ART BY KAIEN</text>
</svg>
`);

// 3. Work: The Blind Oracle (OC)
writeSvg('artwork-oc-1.svg', `
<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 700 900" width="100%" height="100%">
  <rect width="700" height="900" fill="#1E1D1C" />
  <circle cx="350" cy="420" r="220" fill="#252422" />
  <path d="M250 320 C250 200, 450 200, 450 320 C450 480, 400 580, 350 640 C300 580, 250 480, 250 320 Z" fill="#EAE5DE" opacity="0.9" />
  <rect x="230" y="330" width="240" height="26" fill="#1E1D1C" />
  <text x="350" y="348" font-family="'Cormorant Garamond', serif" font-size="11" fill="#8C8279" text-anchor="middle" letter-spacing="4">BLINDFOLD OF TRUTH</text>
  <!-- Long flowing silver hair strands -->
  <path d="M260 300 Q180 500 220 750" stroke="#D8D2C9" stroke-width="4" fill="none" opacity="0.8" />
  <path d="M440 300 Q520 500 480 750" stroke="#D8D2C9" stroke-width="4" fill="none" opacity="0.8" />
  <path d="M290 350 Q230 600 270 820" stroke="#F4F1EC" stroke-width="2.5" fill="none" opacity="0.9" />
  <path d="M410 350 Q470 600 430 820" stroke="#F4F1EC" stroke-width="2.5" fill="none" opacity="0.9" />
  <!-- Floating black orbs and shards -->
  <polygon points="140,240 180,200 160,280" fill="#EAE5DE" opacity="0.8" />
  <polygon points="520,260 570,220 540,310" fill="#EAE5DE" opacity="0.7" />
  <polygon points="320,120 380,80 350,150" fill="#8C8279" opacity="0.9" />
  <!-- Ink splatters -->
  <circle cx="190" cy="420" r="5" fill="#8C8279" />
  <circle cx="510" cy="460" r="6" fill="#8C8279" />
  <circle cx="340" cy="740" r="8" fill="#2B2A28" />
</svg>
`);

// 4. Work: Wanderer of the Ash Plains (OC)
writeSvg('artwork-oc-2.svg', `
<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 700 700" width="100%" height="100%">
  <rect width="700" height="700" fill="#1A1918" />
  <polygon points="0,500 250,420 500,460 700,410 700,700 0,700" fill="#262523" />
  <polygon points="0,570 300,510 700,560 700,700 0,700" fill="#1E1D1C" />
  <!-- Lone cloaked figure holding staff with lantern -->
  <polygon points="350,340 370,540 330,540" fill="#EAE5DE" opacity="0.95" />
  <circle cx="350" cy="330" r="16" fill="#D8D2C9" />
  <line x1="375" y1="280" x2="385" y2="550" stroke="#8C8279" stroke-width="3" />
  <circle cx="375" cy="275" r="8" fill="#F4F1EC" />
  <!-- Ash and embers in air -->
  <circle cx="280" cy="310" r="3" fill="#F4F1EC" opacity="0.8" />
  <circle cx="420" cy="260" r="2.5" fill="#F4F1EC" opacity="0.6" />
  <circle cx="210" cy="230" r="4" fill="#8C8279" opacity="0.7" />
  <circle cx="490" cy="380" r="3" fill="#8C8279" opacity="0.5" />
  <!-- Jagged mountain silhouette -->
  <polygon points="80,480 180,310 290,460" fill="#201F1E" opacity="0.8" />
  <polygon points="410,480 530,280 640,450" fill="#201F1E" opacity="0.8" />
</svg>
`);

// 5. Work: Clawed Hand Study (Sketches)
writeSvg('artwork-sketch-1.svg', `
<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 700 700" width="100%" height="100%">
  <rect width="700" height="700" fill="#222120" />
  <defs>
    <pattern id="gridPattern" width="40" height="40" patternUnits="userSpaceOnUse">
      <path d="M 40 0 L 0 0 0 40" fill="none" stroke="#2B2A28" stroke-width="0.8" />
    </pattern>
  </defs>
  <rect width="700" height="700" fill="url(#gridPattern)" />
  <!-- Gestural Claw Anatomy -->
  <g stroke="#EAE5DE" stroke-width="3" fill="none" stroke-linecap="round" stroke-linejoin="round">
    <!-- Palm -->
    <path d="M260 480 Q320 380 420 440 Q390 540 280 520 Z" />
    <!-- Index claw -->
    <path d="M300 390 L260 300 L230 220 L210 170" stroke-width="4" />
    <!-- Middle claw -->
    <path d="M340 380 L330 270 L315 170 L300 110" stroke-width="4.5" />
    <!-- Ring claw -->
    <path d="M380 390 L390 280 L400 190 L405 130" stroke-width="4" />
    <!-- Pinky claw -->
    <path d="M415 420 L450 330 L480 260 L495 210" stroke-width="3.5" />
    <!-- Thumb claw -->
    <path d="M270 450 L200 440 L140 460 L90 490" stroke-width="4" />
  </g>
  <!-- Sharp bone joints & Shards -->
  <circle cx="230" cy="220" r="5" fill="#EAE5DE" />
  <circle cx="315" cy="170" r="5" fill="#EAE5DE" />
  <circle cx="400" cy="190" r="5" fill="#EAE5DE" />
  <polygon points="460,110 490,90 475,140" fill="#8C8279" />
  <polygon points="160,260 190,240 170,290" fill="#8C8279" />
  <!-- Annotation text -->
  <text x="80" y="620" font-family="'Inter', sans-serif" font-size="12" fill="#8C8279" letter-spacing="2">FIG 04. EXTENSOR TENDON TENSION &bull; INK ON TONED BOARD</text>
</svg>
`);

// 6. Work: Monolith Sentinel Concept (Sketches)
writeSvg('artwork-sketch-2.svg', `
<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 700 900" width="100%" height="100%">
  <rect width="700" height="900" fill="#1C1B1A" />
  <!-- Giant Sentinel rising from fog -->
  <polygon points="260,180 440,180 480,780 220,780" fill="#292826" stroke="#77726B" stroke-width="1.5" />
  <!-- Glowing eye slit -->
  <rect x="310" y="270" width="80" height="10" fill="#F4F1EC" />
  <line x1="220" y1="275" x2="480" y2="275" stroke="#F4F1EC" stroke-width="1" stroke-dasharray="8,14" opacity="0.6" />
  <!-- Runes / Inscriptions -->
  <g stroke="#8C8279" stroke-width="2" fill="none">
    <path d="M330 350 L370 350 L350 420" />
    <path d="M340 450 L360 490 L340 530" />
    <line x1="350" y1="560" x2="350" y2="640" />
  </g>
  <!-- Human scale reference -->
  <circle cx="160" cy="760" r="4" fill="#F4F1EC" />
  <line x1="160" y1="764" x2="160" y2="780" stroke="#F4F1EC" stroke-width="1.5" />
  <text x="160" y="805" font-family="'Inter', sans-serif" font-size="10" fill="#8C8279" text-anchor="middle" letter-spacing="1">1.8M SCALE</text>
  <!-- Floating jagged stones -->
  <polygon points="140,320 180,290 160,370" fill="#EAE5DE" opacity="0.8" />
  <polygon points="520,380 560,340 540,430" fill="#EAE5DE" opacity="0.75" />
</svg>
`);

// 7. Work: Lord of Crows (Commissions)
writeSvg('artwork-comm-1.svg', `
<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 700 850" width="100%" height="100%">
  <rect width="700" height="850" fill="#1A1918" />
  <!-- Wings silhouette spreading wide -->
  <path d="M350 420 C220 280 80 320 30 450 C120 460 220 480 310 520 Z" fill="#2E2C2A" />
  <path d="M350 420 C480 280 620 320 670 450 C580 460 480 480 390 520 Z" fill="#2E2C2A" />
  <path d="M350 430 C250 310 130 360 80 480 C160 480 250 500 320 540 Z" fill="#3D3A37" />
  <path d="M350 430 C450 310 570 360 620 480 C540 480 450 500 380 540 Z" fill="#3D3A37" />
  <!-- Regal figure with Crow mask -->
  <polygon points="350,260 385,360 315,360" fill="#EAE5DE" />
  <polygon points="350,330 420,375 350,360" fill="#1A1918" />
  <!-- High collar and coat -->
  <polygon points="315,360 385,360 410,700 290,700" fill="#242322" />
  <line x1="350" y1="360" x2="350" y2="700" stroke="#77726B" stroke-width="2" />
  <!-- Loose feathers falling -->
  <ellipse cx="210" cy="590" rx="6" ry="18" fill="#8C8279" transform="rotate(35 210 590)" />
  <ellipse cx="490" cy="620" rx="5" ry="16" fill="#8C8279" transform="rotate(-25 490 620)" />
  <ellipse cx="160" cy="380" rx="4" ry="14" fill="#D8D2C9" transform="rotate(50 160 380)" />
  <ellipse cx="530" cy="360" rx="4" ry="14" fill="#D8D2C9" transform="rotate(-40 530 360)" />
</svg>
`);

// 8. Work: Astral Huntress (Commissions)
writeSvg('artwork-comm-2.svg', `
<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 700 850" width="100%" height="100%">
  <rect width="700" height="850" fill="#1F1E1D" />
  <!-- Drawn ethereal bow -->
  <path d="M220 200 Q150 425 220 650" stroke="#F4F1EC" stroke-width="3" fill="none" />
  <line x1="220" y1="200" x2="380" y2="425" stroke="#8C8279" stroke-width="1.5" stroke-dasharray="4,4" />
  <line x1="220" y1="650" x2="380" y2="425" stroke="#8C8279" stroke-width="1.5" stroke-dasharray="4,4" />
  <!-- Arrow of light -->
  <line x1="120" y1="425" x2="550" y2="425" stroke="#F4F1EC" stroke-width="2.5" />
  <polygon points="120,425 145,418 145,432" fill="#F4F1EC" />
  <!-- Archer figure silhouette -->
  <circle cx="390" cy="370" r="24" fill="#EAE5DE" />
  <path d="M375 394 L420 480 L350 680" stroke="#EAE5DE" stroke-width="18" stroke-linecap="round" fill="none" />
  <path d="M390 410 L260 425" stroke="#EAE5DE" stroke-width="12" stroke-linecap="round" fill="none" />
  <!-- Shards & starlight -->
  <polygon points="460,280 490,260 475,310" fill="#8C8279" />
  <polygon points="310,180 340,150 325,205" fill="#8C8279" />
</svg>
`);

// 9. Commission Tier Thumbnails: Sketch, Lineart, Full Render
writeSvg('tier-sketch.svg', `
<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 400 300" width="100%" height="100%">
  <rect width="400" height="300" fill="#252422" />
  <!-- Gestural graphite / ink rough sketch -->
  <path d="M120 180 Q190 70 270 170" stroke="#77726B" stroke-width="2" fill="none" stroke-dasharray="6,4" />
  <circle cx="200" cy="110" r="45" stroke="#D8D2C9" stroke-width="2" fill="none" opacity="0.8" />
  <path d="M160 140 Q200 170 240 140" stroke="#8C8279" stroke-width="1.5" fill="none" />
  <line x1="200" y1="80" x2="200" y2="150" stroke="#77726B" stroke-width="1" stroke-dasharray="2,3" />
  <path d="M130 250 L180 180 L220 180 L270 250" stroke="#D8D2C9" stroke-width="2" fill="none" />
  <text x="200" y="275" font-family="'Inter', sans-serif" font-size="11" fill="#8C8279" text-anchor="middle" letter-spacing="3">ROUGH GESTURE &bull; 300 DPI</text>
</svg>
`);

writeSvg('tier-lineart.svg', `
<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 400 300" width="100%" height="100%">
  <rect width="400" height="300" fill="#201F1E" />
  <defs>
    <pattern id="toneGrid" width="6" height="6" patternUnits="userSpaceOnUse">
      <circle cx="3" cy="3" r="1" fill="#4A4744" />
    </pattern>
  </defs>
  <!-- Screentone background patch -->
  <rect x="80" y="60" width="240" height="180" fill="url(#toneGrid)" />
  <!-- Crisp inking lineart -->
  <circle cx="200" cy="110" r="42" fill="#EAE5DE" />
  <path d="M170 100 Q200 65 230 100 Q235 145 200 155 Q165 145 170 100 Z" fill="#1A1918" />
  <path d="M140 240 L185 170 L215 170 L260 240 Z" fill="#2E2C2A" stroke="#EAE5DE" stroke-width="2" />
  <!-- Spot blacks & hatching -->
  <line x1="160" y1="210" x2="180" y2="210" stroke="#EAE5DE" stroke-width="1.5" />
  <line x1="160" y1="216" x2="176" y2="216" stroke="#EAE5DE" stroke-width="1.5" />
  <text x="200" y="275" font-family="'Inter', sans-serif" font-size="11" fill="#8C8279" text-anchor="middle" letter-spacing="3">CLEAN INK &bull; HALFTONE</text>
</svg>
`);

writeSvg('tier-render.svg', `
<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 400 300" width="100%" height="100%">
  <rect width="400" height="300" fill="#161514" />
  <defs>
    <radialGradient id="renderLight" cx="50%" cy="35%" r="60%">
      <stop offset="0%" stop-color="#3D3A37" />
      <stop offset="100%" stop-color="#141312" />
    </radialGradient>
  </defs>
  <rect width="400" height="300" fill="url(#renderLight)" />
  <!-- Detailed character with shards & cinematic lighting -->
  <polygon points="60,90 90,70 75,120" fill="#F4F1EC" opacity="0.9" />
  <polygon points="320,80 355,55 335,115" fill="#F4F1EC" opacity="0.8" />
  <circle cx="200" cy="105" r="48" fill="#EAE5DE" />
  <path d="M150 110 C150 50, 250 50, 250 110 C250 200, 230 220, 200 240 C170 220, 150 200, 150 110 Z" fill="#161514" />
  <path d="M120 260 L180 180 L220 180 L280 260 Z" fill="#292826" stroke="#D8D2C9" stroke-width="1.5" />
  <polygon points="180,180 220,180 200,240" fill="#8C8279" opacity="0.8" />
  <text x="200" y="275" font-family="'Inter', sans-serif" font-size="11" fill="#8C8279" text-anchor="middle" letter-spacing="3">FULL RENDER &bull; LIGHTING &bull; PSD</text>
</svg>
`);

console.log('All placeholder graphic assets created successfully.');
