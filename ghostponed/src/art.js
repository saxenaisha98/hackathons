// art.js — original SVG artwork for Ghostponed.
// "Cozy courage" direction: a haunted-but-warm home, an anxious-brave guardian, and
// surreal friendly-spooky ghosts. Uneasy purples + dusty pink, warm yellow window light.
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

// Original guardian: "Pip" — a small, round, anxious-but-brave creature with big eyes,
// little ears, and a tiny lantern-leaf it holds up against the dark. Not from any show.
export function guardianSVG(brave = false) {
  // brave=true when progress is being made: Pip stands a touch taller, braver eyes.
  const browY = brave ? 16 : 19;
  return `
  <svg viewBox="0 0 80 96" class="art-guardian" aria-hidden="true">
    <!-- shadow -->
    <ellipse cx="40" cy="90" rx="20" ry="4" fill="#000" opacity="0.3"/>
    <!-- ears -->
    <path d="M24 30 C18 14 30 10 32 24 Z" fill="#6b4a7a"/>
    <path d="M56 30 C62 14 50 10 48 24 Z" fill="#6b4a7a"/>
    <!-- body -->
    <ellipse cx="40" cy="58" rx="24" ry="28" fill="#7b5a9a"/>
    <ellipse cx="40" cy="64" rx="16" ry="18" fill="#9c7bbd"/>
    <!-- big worried-but-determined eyes -->
    <circle cx="31" cy="50" r="7" fill="#fff"/>
    <circle cx="49" cy="50" r="7" fill="#fff"/>
    <circle cx="32" cy="51" r="3.4" fill="#1b1033"/>
    <circle cx="48" cy="51" r="3.4" fill="#1b1033"/>
    <circle cx="33" cy="49" r="1.1" fill="#fff"/>
    <circle cx="49" cy="49" r="1.1" fill="#fff"/>
    <!-- brows: angle shifts with bravery -->
    <path d="M26 ${browY} q5 -3 10 1" stroke="#4a335e" stroke-width="2" fill="none" stroke-linecap="round" transform="translate(0,28)"/>
    <path d="M44 ${browY + 2} q5 -4 10 -1" stroke="#4a335e" stroke-width="2" fill="none" stroke-linecap="round" transform="translate(0,28)"/>
    <!-- tiny mouth -->
    <path d="M36 62 q4 3 8 0" stroke="#4a335e" stroke-width="2" fill="none" stroke-linecap="round"/>
    <!-- a little lantern-leaf held up -->
    <line x1="60" y1="60" x2="66" y2="46" stroke="#5a4478" stroke-width="2.5"/>
    <circle cx="67" cy="42" r="5" fill="#f6c45a"/>
    <circle cx="67" cy="42" r="8" fill="#f6c45a" opacity="0.25"/>
  </svg>`;
}

// Surreal, slightly silly, friendly-spooky ghosts (the "things you've been putting off").
// Bigger than before, with more personality. mood 0..1: far = calm, near = wide-eyed.
export function ghostSVG(variant = 0, mood = 1) {
  const calm = mood > 0.55;
  const mouth = calm
    ? `<path d="M34 46 Q44 54 54 46" stroke="#2b1b40" stroke-width="3" fill="none" stroke-linecap="round"/>`
    : `<ellipse cx="44" cy="48" rx="5" ry="6" fill="#2b1b40"/>`; // worried little "o"
  const eyes = `
    <ellipse cx="34" cy="34" rx="4.4" ry="5.2" fill="#2b1b40"/>
    <ellipse cx="54" cy="34" rx="4.4" ry="5.2" fill="#2b1b40"/>
    <circle cx="32.5" cy="32" r="1.3" fill="#fff"/>
    <circle cx="52.5" cy="32" r="1.3" fill="#fff"/>
    <circle cx="28" cy="43" r="4" fill="#e79ec0" opacity="0.4"/>
    <circle cx="60" cy="43" r="4" fill="#e79ec0" opacity="0.4"/>`;

  if (variant === 1) {
    // Lantern-ghost: drifts holding a dim lantern, long wobbly tail.
    return `
    <svg viewBox="0 0 96 120" class="art-ghost" aria-hidden="true">
      <g class="ghost-body">
        <path d="M44 6 C22 6 14 26 14 48 L14 92 Q22 84 30 92 Q38 100 44 92 Q50 100 58 92 Q66 84 74 92 L74 48 C74 26 66 6 44 6 Z"
              fill="#d9ccf2" opacity="0.95"/>
        ${eyes}${mouth}
        <line x1="66" y1="54" x2="78" y2="70" stroke="#b9a6dd" stroke-width="2.5"/>
        <rect x="72" y="70" width="12" height="15" rx="2" fill="#3b2c63"/>
        <circle cx="78" cy="77.5" r="4" fill="#f6c45a"/>
      </g>
    </svg>`;
  }
  if (variant === 2) {
    // Wisp: taller, wispier, trailing little sparks.
    return `
    <svg viewBox="0 0 96 120" class="art-ghost" aria-hidden="true">
      <g class="ghost-body">
        <path d="M46 8 C26 8 20 28 20 50 L18 96 Q26 86 34 94 Q42 86 48 94 Q54 86 60 94 L68 52 C72 30 64 8 46 8 Z"
              fill="#cbb9ec" opacity="0.92"/>
        ${eyes}${mouth}
        <circle cx="74" cy="36" r="2" fill="#fff0c2"/>
        <circle cx="82" cy="48" r="1.5" fill="#fff0c2"/>
        <circle cx="78" cy="60" r="1.2" fill="#fff0c2"/>
      </g>
    </svg>`;
  }
  // Variant 0: big round classic ghost.
  return `
  <svg viewBox="0 0 96 120" class="art-ghost" aria-hidden="true">
    <g class="ghost-body">
      <path d="M48 6 C22 6 12 28 12 52 L12 96 Q21 86 30 95 Q39 86 48 95 Q57 86 66 95 Q75 86 84 96 L84 52 C84 28 74 6 48 6 Z"
            fill="#ddd0f5" opacity="0.95"/>
      ${eyes}${mouth}
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
