// art.js — original SVG artwork for Ghostponed.
// Original haunted-but-warm scenery: a crooked home, a flying witch, and surreal
// friendly-spooky ghosts. Uneasy purples + dusty pink, warm yellow window light.
// All characters/scenery are original and authored here. No external assets, no IP.

// The haunted house: crooked cottage, sagging roof, glowing warm windows against the dark.
export function houseSVG() {
  return `
  <svg viewBox="0 0 180 200" class="art-house" aria-hidden="true">
    <!-- warm glow spilling from the home -->
    <ellipse cx="90" cy="120" rx="78" ry="56" fill="#f6c45a" opacity="0.12"/>
    <!-- crooked garden fence -->
    <g stroke="#3a2d5e" stroke-width="3" fill="#2a2047">
      <polygon points="8,160 14,154 18,160 16,184 10,184"/>
      <polygon points="30,164 36,158 40,164 38,184 32,184"/>
      <polygon points="140,164 146,158 150,164 148,184 142,184"/>
      <polygon points="162,160 168,154 172,160 170,184 164,184"/>
      <line x1="8" y1="170" x2="172" y2="170"/>
    </g>
    <!-- leaning body (slightly skewed for a haunted feel) -->
    <polygon points="44,96 136,100 132,172 48,168" fill="#3b2c63"/>
    <polygon points="44,96 136,100 132,172 48,168" fill="#000" opacity="0.12"/>
    <!-- sagging roof -->
    <polygon points="34,100 90,52 146,100" fill="#2a1f49"/>
    <polygon points="34,100 90,52 92,58 40,100" fill="#000" opacity="0.18"/>
    <!-- crooked chimney + wisp of smoke -->
    <polygon points="110,66 122,62 124,86 112,88" fill="#241a40"/>
    <circle cx="118" cy="56" r="4.5" fill="#b9a6dd" opacity="0.5"/>
    <circle cx="124" cy="46" r="3.3" fill="#b9a6dd" opacity="0.35"/>
    <!-- arched glowing windows -->
    <g>
      <path d="M58 112 q10 -14 20 0 v20 h-20 z" fill="#f6c45a"/>
      <path d="M102 114 q10 -14 20 0 v20 h-20 z" fill="#f6c45a"/>
      <line x1="68" y1="104" x2="68" y2="132" stroke="#3b2c63" stroke-width="2.5"/>
      <line x1="58" y1="120" x2="78" y2="120" stroke="#3b2c63" stroke-width="2.5"/>
      <line x1="112" y1="106" x2="112" y2="134" stroke="#3b2c63" stroke-width="2.5"/>
      <line x1="102" y1="122" x2="122" y2="122" stroke="#3b2c63" stroke-width="2.5"/>
    </g>
    <!-- round door with warm sliver of light -->
    <path d="M78 172 v-26 q12 -12 24 0 v26 z" fill="#1f1738"/>
    <path d="M90 146 v26" stroke="#f6c45a" stroke-width="2" opacity="0.5"/>
    <circle cx="96" cy="160" r="1.8" fill="#f6c45a"/>
  </svg>`;
}

// Surreal, slightly silly, friendly-spooky ghosts (the "things you've been putting off").
// Cute, soft, chubby white ghosts — original shapes inspired by cozy-ghost illustration:
// rounded body, wavy hem, little black dot eyes, rosy cheeks, varied expressions.
// `variant` 0..2 picks a face; `mood` 0..1 nudges the expression (calm vs. wide-eyed).
export function ghostSVG(variant = 0, mood = 1) {
  const calm = mood > 0.5;
  const cheeks = `
    <ellipse cx="30" cy="48" rx="6" ry="4" fill="#f4a9c4" opacity="0.65"/>
    <ellipse cx="66" cy="48" rx="6" ry="4" fill="#f4a9c4" opacity="0.65"/>`;

  // three face expressions
  const faces = [
    // 0: happy, round eyes + soft smile
    `<ellipse cx="38" cy="40" rx="4.6" ry="6" fill="#33313a"/>
     <ellipse cx="58" cy="40" rx="4.6" ry="6" fill="#33313a"/>
     <circle cx="36.5" cy="37.5" r="1.4" fill="#fff"/>
     <circle cx="56.5" cy="37.5" r="1.4" fill="#fff"/>
     <path d="M42 52 Q48 57 54 52" stroke="#33313a" stroke-width="2.6" fill="none" stroke-linecap="round"/>`,
    // 1: content, happy closed "^ ^" eyes
    `<path d="M33 42 Q38 36 43 42" stroke="#33313a" stroke-width="3" fill="none" stroke-linecap="round"/>
     <path d="M53 42 Q58 36 63 42" stroke="#33313a" stroke-width="3" fill="none" stroke-linecap="round"/>
     <ellipse cx="48" cy="52" rx="3.5" ry="4.5" fill="#33313a"/>`,
    // 2: surprised little "o"
    `<circle cx="38" cy="40" r="5" fill="#33313a"/>
     <circle cx="58" cy="40" r="5" fill="#33313a"/>
     <circle cx="36.5" cy="38" r="1.5" fill="#fff"/>
     <circle cx="56.5" cy="38" r="1.5" fill="#fff"/>
     <ellipse cx="48" cy="53" rx="3.5" ry="4.5" fill="#33313a"/>`,
  ];
  // when very near (mood low) everyone looks a touch more surprised
  const face = calm ? faces[variant % 3] : faces[2];

  // chubby body with a wavy bottom hem — slight shape variation per variant
  const bodies = [
    `M48 6 C25 6 16 26 16 52 L16 96 Q24 88 31 95 Q39 87 47 95 Q55 87 63 95 Q71 88 80 96 L80 52 C80 26 71 6 48 6 Z`,
    `M48 5 C27 5 18 24 18 50 L17 94 Q25 85 32 93 Q40 85 48 93 Q56 85 64 93 Q72 86 79 95 L82 50 C82 24 69 5 48 5 Z`,
    `M50 6 C28 6 18 27 18 53 L15 95 Q24 86 31 94 Q40 86 47 94 Q55 86 63 94 Q71 87 80 95 L82 53 C82 27 72 6 50 6 Z`,
  ];
  const body = bodies[variant % 3];

  return `
  <svg viewBox="0 0 96 110" class="art-ghost" aria-hidden="true">
    <g class="ghost-body">
      <path d="${body}" fill="#ffffff"/>
      <path d="${body}" fill="none" stroke="#efe9f5" stroke-width="1" opacity="0.6"/>
      ${cheeks}
      ${face}
    </g>
  </svg>`;
}

// Greenhouse overlay shown while sheltered — the emotional center, warm and safe.
export function greenhouseSVG() {
  return `
  <svg viewBox="0 0 120 120" class="art-greenhouse" aria-hidden="true">
    <ellipse cx="60" cy="100" rx="46" ry="10" fill="#f6c45a" opacity="0.14"/>
    <path d="M20 108 L20 50 L60 20 L100 50 L100 108 Z" fill="#8fd0bf" opacity="0.14"/>
    <path d="M20 108 L20 50 L60 20 L100 50 L100 108 Z" fill="none" stroke="#8fd0bf" stroke-width="2" opacity="0.6"/>
    <line x1="60" y1="20" x2="60" y2="108" stroke="#8fd0bf" stroke-width="1.5" opacity="0.5"/>
    <line x1="20" y1="64" x2="100" y2="64" stroke="#8fd0bf" stroke-width="1.5" opacity="0.5"/>
    <line x1="20" y1="86" x2="100" y2="86" stroke="#8fd0bf" stroke-width="1.5" opacity="0.5"/>
    <!-- warm lamp inside -->
    <circle cx="60" cy="58" r="6" fill="#f6c45a"/>
    <circle cx="60" cy="58" r="12" fill="#f6c45a" opacity="0.25"/>
    <!-- potted sprout -->
    <rect x="50" y="90" width="20" height="14" rx="2" fill="#5a4478"/>
    <circle cx="60" cy="84" r="8" fill="#8fd0bf"/>
  </svg>`;
}

// Witch — shown in the empty state, drifting across a new moon on her broom.
// Original design: a small hunched figure, pointy hat, trailing cloak, star sparkles.
export function witchSVG() {
  return `
  <svg viewBox="0 0 120 80" class="art-witch" aria-hidden="true">
    <!-- broom -->
    <line x1="18" y1="54" x2="92" y2="40" stroke="#6b4a30" stroke-width="3" stroke-linecap="round"/>
    <g stroke="#caa36a" stroke-width="1.5" stroke-linecap="round">
      <line x1="92" y1="40" x2="104" y2="34"/>
      <line x1="92" y1="40" x2="104" y2="40"/>
      <line x1="92" y1="40" x2="104" y2="46"/>
      <line x1="92" y1="40" x2="102" y2="50"/>
    </g>
    <!-- cloak -->
    <path d="M30 52 Q40 28 54 30 Q66 32 64 52 Q50 46 40 54 Z" fill="#4a2f6e"/>
    <!-- body + head -->
    <circle cx="50" cy="30" r="8" fill="#9c7bbd"/>
    <circle cx="47" cy="29" r="1.4" fill="#1b1033"/>
    <path d="M44 33 q4 2 7 0" stroke="#4a335e" stroke-width="1.3" fill="none" stroke-linecap="round"/>
    <!-- pointy hat -->
    <path d="M38 22 L52 2 L60 24 Z" fill="#2a1f49"/>
    <ellipse cx="49" cy="24" rx="16" ry="4" fill="#2a1f49"/>
    <circle cx="52" cy="4" r="2" fill="#f6c45a"/>
    <!-- trailing sparkles -->
    <circle cx="22" cy="48" r="1.4" fill="#e79ec0" opacity="0.8"/>
    <circle cx="14" cy="52" r="1.1" fill="#a78bda" opacity="0.7"/>
    <circle cx="8" cy="50" r="0.9" fill="#f6c45a" opacity="0.6"/>
  </svg>`;
}

// A drifting spirit particle (tiny wisp) used to add motion/atmosphere to the scene.
export function spiritParticleSVG() {
  return `<svg viewBox="0 0 20 24" aria-hidden="true">
    <path d="M10 2 C5 2 3 7 3 12 L3 20 Q5 17 7 20 Q9 17 10 20 Q11 17 13 20 Q15 17 17 20 L17 12 C17 7 15 2 10 2 Z"
          fill="#cbb9ec" opacity="0.5"/>
    <circle cx="8" cy="10" r="1" fill="#2b1b40"/>
    <circle cx="12" cy="10" r="1" fill="#2b1b40"/>
  </svg>`;
}

// --- Cemetery scenery (original) ---

// A graveyard foreground: crooked tombstones, a bare dead tree, iron fence, mist.
export function cemeterySVG() {
  return `
  <svg viewBox="0 0 1200 300" preserveAspectRatio="xMidYMax slice" class="art-cemetery" aria-hidden="true">
    <!-- far ground mound -->
    <path d="M0 300 L0 200 Q300 170 600 190 Q900 210 1200 180 L1200 300 Z" fill="#160d26"/>
    <!-- near ground -->
    <path d="M0 300 L0 240 Q250 220 520 240 Q820 262 1200 236 L1200 300 Z" fill="#0d0718"/>
    <!-- iron fence silhouette -->
    <g stroke="#1c1230" stroke-width="4">
      ${Array.from({ length: 40 })
        .map((_, i) => {
          const x = 10 + i * 30;
          return `<line x1="${x}" y1="218" x2="${x}" y2="250"/><circle cx="${x}" cy="214" r="3" fill="#1c1230"/>`;
        })
        .join("")}
      <line x1="0" y1="226" x2="1200" y2="226"/>
    </g>
    <!-- tombstones -->
    <g fill="#241a3a" stroke="#1a1230" stroke-width="1.5">
      <path d="M120 250 v-44 a16 16 0 0 1 32 0 v44 z" transform="rotate(-5 136 230)"/>
      <rect x="250" y="206" width="30" height="46" rx="3" transform="rotate(3 265 230)"/>
      <path d="M430 252 v-38 a15 15 0 0 1 30 0 v38 z"/>
      <rect x="690" y="210" width="26" height="42" rx="3" transform="rotate(-4 703 232)"/>
      <path d="M860 252 v-46 a16 16 0 0 1 32 0 v46 z" transform="rotate(4 876 230)"/>
      <rect x="1030" y="208" width="28" height="44" rx="3" transform="rotate(-3 1044 232)"/>
    </g>
    <!-- a couple of crosses -->
    <g stroke="#241a3a" stroke-width="6" stroke-linecap="round">
      <line x1="560" y1="252" x2="560" y2="214"/><line x1="548" y1="224" x2="572" y2="224"/>
      <line x1="960" y1="252" x2="960" y2="216"/><line x1="949" y1="226" x2="971" y2="226"/>
    </g>
    <!-- bare dead tree, left -->
    <g stroke="#140b22" fill="none" stroke-linecap="round">
      <path d="M90 252 C86 200 80 170 70 140" stroke-width="10"/>
      <path d="M74 176 C60 168 52 150 44 138" stroke-width="5"/>
      <path d="M72 158 C84 146 92 132 96 118" stroke-width="5"/>
      <path d="M70 140 C64 128 66 112 60 100" stroke-width="4"/>
      <path d="M70 140 C78 128 86 120 92 106" stroke-width="4"/>
    </g>
  </svg>`;
}

// A flapping bat.
export function batSVG() {
  return `<svg viewBox="0 0 40 24" aria-hidden="true">
    <path class="wing-l" d="M20 12 C10 2 2 6 0 14 C6 12 10 14 12 18 C14 13 17 12 20 12 Z" fill="#160d26"/>
    <path class="wing-r" d="M20 12 C30 2 38 6 40 14 C34 12 30 14 28 18 C26 13 23 12 20 12 Z" fill="#160d26"/>
    <ellipse cx="20" cy="13" rx="4" ry="5" fill="#1c1230"/>
    <circle cx="18.5" cy="12" r="0.8" fill="#e79ec0"/>
    <circle cx="21.5" cy="12" r="0.8" fill="#e79ec0"/>
  </svg>`;
}

// A falling leaf.
export function leafSVG() {
  const tones = ["#7a4a2a", "#8a5a30", "#5a3a5e", "#6b4a30"];
  const c = tones[Math.floor(Math.random() * tones.length)];
  return `<svg viewBox="0 0 16 16" aria-hidden="true">
    <path d="M8 1 C13 4 13 12 8 15 C3 12 3 4 8 1 Z" fill="${c}"/>
    <line x1="8" y1="2" x2="8" y2="14" stroke="#2b1b40" stroke-width="0.6"/>
  </svg>`;
}

// A spooky analog pocket-clock. Hands are given ids so the UI can rotate them.
// viewBox is 120x120 with the center at (60,60).
export function clockSVG() {
  // hour pips around the dial
  const pips = Array.from({ length: 12 })
    .map((_, i) => {
      const a = (i * 30 * Math.PI) / 180;
      const r1 = 48, r2 = i % 3 === 0 ? 40 : 44;
      const x1 = 60 + r1 * Math.sin(a), y1 = 60 - r1 * Math.cos(a);
      const x2 = 60 + r2 * Math.sin(a), y2 = 60 - r2 * Math.cos(a);
      const w = i % 3 === 0 ? 3 : 1.6;
      return `<line x1="${x1.toFixed(1)}" y1="${y1.toFixed(1)}" x2="${x2.toFixed(1)}" y2="${y2.toFixed(1)}" stroke="#b9a6dd" stroke-width="${w}" stroke-linecap="round" opacity="0.8"/>`;
    })
    .join("");
  return `
  <svg viewBox="0 0 120 120" class="clock-svg" aria-hidden="true">
    <defs>
      <radialGradient id="dial" cx="50%" cy="42%" r="62%">
        <stop offset="0%" stop-color="#241640"/>
        <stop offset="78%" stop-color="#120a26"/>
        <stop offset="100%" stop-color="#0b0618"/>
      </radialGradient>
    </defs>
    <!-- outer glow ring + bezel -->
    <circle cx="60" cy="60" r="56" fill="none" stroke="#6d28d9" stroke-width="4"/>
    <circle cx="60" cy="60" r="52" fill="url(#dial)" stroke="#8b5cf6" stroke-width="1.5"/>
    <!-- little hanging ring on top -->
    <circle cx="60" cy="6" r="4.5" fill="none" stroke="#8b5cf6" stroke-width="3"/>
    ${pips}
    <!-- hands rotate around the clock center (60,60); the UI sets the angle -->
    <line id="clock-hand-min" x1="60" y1="62" x2="60" y2="30" stroke="#f4a9c4" stroke-width="4" stroke-linecap="round"/>
    <line id="clock-hand-sec" x1="60" y1="64" x2="60" y2="22" stroke="#8b5cf6" stroke-width="2" stroke-linecap="round"/>
    <circle cx="60" cy="60" r="4" fill="#f6c45a"/>
    <circle cx="60" cy="60" r="4" fill="none" stroke="#fff" stroke-width="0.6" opacity="0.5"/>
  </svg>`;
}
