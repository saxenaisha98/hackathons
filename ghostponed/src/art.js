// art.js — original SVG artwork for Ghostponed.
// All characters and scenery are authored here as inline SVG strings. No external assets.

// The garden house: a small cottage with lit windows, a chimney, and a fence.
export function houseSVG() {
  return `
  <svg viewBox="0 0 160 160" class="art-house" aria-hidden="true">
    <!-- glow behind windows -->
    <ellipse cx="80" cy="96" rx="58" ry="40" fill="#f6b35a" opacity="0.14"/>
    <!-- garden fence -->
    <g stroke="#6b5a86" stroke-width="3" fill="#4a3d63">
      <rect x="12" y="120" width="6" height="22" rx="2"/>
      <rect x="28" y="124" width="6" height="18" rx="2"/>
      <rect x="126" y="124" width="6" height="18" rx="2"/>
      <rect x="142" y="120" width="6" height="22" rx="2"/>
      <line x1="12" y1="128" x2="148" y2="128"/>
    </g>
    <!-- body -->
    <rect x="40" y="78" width="80" height="62" rx="4" fill="#5a4a7a"/>
    <!-- roof -->
    <polygon points="32,80 80,44 128,80" fill="#8a5a3c"/>
    <polygon points="32,80 80,44 128,80" fill="#000" opacity="0.08"/>
    <!-- chimney with little smoke -->
    <rect x="98" y="54" width="12" height="20" rx="2" fill="#7a4a30"/>
    <circle cx="104" cy="48" r="4" fill="#cdbbe0" opacity="0.6"/>
    <circle cx="109" cy="40" r="3" fill="#cdbbe0" opacity="0.4"/>
    <!-- door -->
    <rect x="70" y="104" width="20" height="36" rx="3" fill="#3a2d52"/>
    <circle cx="85" cy="122" r="1.6" fill="#f6b35a"/>
    <!-- windows (warm, lit) -->
    <g>
      <rect x="50" y="92" width="16" height="16" rx="2" fill="#f6b35a"/>
      <rect x="94" y="92" width="16" height="16" rx="2" fill="#f6b35a"/>
      <line x1="58" y1="92" x2="58" y2="108" stroke="#5a4a7a" stroke-width="2"/>
      <line x1="50" y1="100" x2="66" y2="100" stroke="#5a4a7a" stroke-width="2"/>
      <line x1="102" y1="92" x2="102" y2="108" stroke="#5a4a7a" stroke-width="2"/>
      <line x1="94" y1="100" x2="110" y2="100" stroke="#5a4a7a" stroke-width="2"/>
    </g>
  </svg>`;
}

// Three friendly ghost variants. `mood` 0..1 shifts the face from worried (near house)
// to calm (far away) — subtle, never scary.
export function ghostSVG(variant = 0, mood = 1) {
  const eyeY = 30;
  // calmer mood -> gentle smile; worried -> small flat mouth
  const mouth =
    mood > 0.55
      ? `<path d="M30 40 Q40 48 50 40" stroke="#2b1b40" stroke-width="2.5" fill="none" stroke-linecap="round"/>`
      : `<path d="M32 42 Q40 38 48 42" stroke="#2b1b40" stroke-width="2.5" fill="none" stroke-linecap="round"/>`;
  const eyes = `
    <circle cx="31" cy="${eyeY}" r="3.2" fill="#2b1b40"/>
    <circle cx="49" cy="${eyeY}" r="3.2" fill="#2b1b40"/>
    <circle cx="27" cy="38" r="3.5" fill="#f08aa8" opacity="0.35"/>
    <circle cx="53" cy="38" r="3.5" fill="#f08aa8" opacity="0.35"/>`;

  if (variant === 1) {
    // Lantern-ghost: carries a tiny warm lantern.
    return `
    <svg viewBox="0 0 80 96" class="art-ghost" aria-hidden="true">
      <g class="ghost-body">
        <path d="M40 6 C22 6 14 22 14 40 L14 70 Q20 64 26 70 Q32 76 40 70 Q48 76 54 70 Q60 64 66 70 L66 40 C66 22 58 6 40 6 Z"
              fill="#eae6ff" opacity="0.95"/>
        ${eyes}${mouth}
        <!-- lantern -->
        <line x1="60" y1="44" x2="68" y2="56" stroke="#cdbbe0" stroke-width="2"/>
        <rect x="63" y="56" width="10" height="12" rx="2" fill="#4a3d63"/>
        <circle cx="68" cy="62" r="3.4" fill="#f6b35a"/>
      </g>
    </svg>`;
  }
  if (variant === 2) {
    // Wisp: wispier tail, a little trail of stars.
    return `
    <svg viewBox="0 0 80 96" class="art-ghost" aria-hidden="true">
      <g class="ghost-body">
        <path d="M40 8 C24 8 18 24 18 42 L18 74 Q24 66 30 72 Q36 66 42 72 Q48 66 54 72 L58 44 C60 26 54 8 40 8 Z"
              fill="#dfeaff" opacity="0.92"/>
        ${eyes}${mouth}
        <circle cx="62" cy="30" r="1.6" fill="#fff6d6"/>
        <circle cx="68" cy="40" r="1.2" fill="#fff6d6"/>
        <circle cx="64" cy="50" r="1" fill="#fff6d6"/>
      </g>
    </svg>`;
  }
  // Variant 0: classic round sheet-ghost.
  return `
  <svg viewBox="0 0 80 96" class="art-ghost" aria-hidden="true">
    <g class="ghost-body">
      <path d="M40 6 C20 6 12 24 12 44 L12 74 Q19 66 26 73 Q33 66 40 73 Q47 66 54 73 Q61 66 68 74 L68 44 C68 24 60 6 40 6 Z"
            fill="#f1edff" opacity="0.95"/>
      ${eyes}${mouth}
    </g>
  </svg>`;
}

// Defensive plants in three growth tiers. tier 0 = empty slot, 1 = sprout,
// 2 = bush, 3 = warding bloom.
export function plantSVG(tier = 0) {
  if (tier <= 0) {
    return `<svg viewBox="0 0 48 48" class="art-plant" aria-hidden="true">
      <ellipse cx="24" cy="42" rx="12" ry="3" fill="#2d3a24" opacity="0.5"/>
    </svg>`;
  }
  if (tier === 1) {
    // Sprout
    return `<svg viewBox="0 0 48 48" class="art-plant" aria-hidden="true">
      <ellipse cx="24" cy="42" rx="12" ry="3" fill="#2d3a24" opacity="0.5"/>
      <path d="M24 42 L24 30" stroke="#5f8a4a" stroke-width="3" stroke-linecap="round"/>
      <path d="M24 34 Q16 30 14 36 Q22 38 24 34 Z" fill="#79b15c"/>
      <path d="M24 30 Q32 26 34 32 Q26 34 24 30 Z" fill="#79b15c"/>
    </svg>`;
  }
  if (tier === 2) {
    // Bush
    return `<svg viewBox="0 0 48 48" class="art-plant" aria-hidden="true">
      <ellipse cx="24" cy="42" rx="14" ry="3" fill="#2d3a24" opacity="0.5"/>
      <path d="M24 42 L24 26" stroke="#4f7a3c" stroke-width="3.5" stroke-linecap="round"/>
      <circle cx="24" cy="22" r="10" fill="#6ca34f"/>
      <circle cx="16" cy="28" r="7" fill="#79b15c"/>
      <circle cx="32" cy="28" r="7" fill="#5f934a"/>
    </svg>`;
  }
  // tier 3+: warding bloom (glows, a little magical)
  return `<svg viewBox="0 0 48 48" class="art-plant" aria-hidden="true">
    <ellipse cx="24" cy="42" rx="15" ry="3.5" fill="#2d3a24" opacity="0.5"/>
    <path d="M24 42 L24 24" stroke="#4f7a3c" stroke-width="4" stroke-linecap="round"/>
    <circle cx="24" cy="20" r="11" fill="#6ca34f"/>
    <circle cx="15" cy="27" r="7" fill="#79b15c"/>
    <circle cx="33" cy="27" r="7" fill="#5f934a"/>
    <!-- warding bloom -->
    <g class="bloom">
      <circle cx="24" cy="14" r="5.5" fill="#f6b35a"/>
      <circle cx="24" cy="14" r="9" fill="#f6b35a" opacity="0.25"/>
      <circle cx="24" cy="14" r="2" fill="#fff3d6"/>
    </g>
  </svg>`;
}

// Greenhouse overlay shown while sheltered.
export function greenhouseSVG() {
  return `
  <svg viewBox="0 0 120 120" class="art-greenhouse" aria-hidden="true">
    <path d="M20 108 L20 50 L60 20 L100 50 L100 108 Z" fill="#bfe0d6" opacity="0.18"/>
    <path d="M20 108 L20 50 L60 20 L100 50 L100 108 Z" fill="none" stroke="#bfe0d6" stroke-width="2" opacity="0.6"/>
    <line x1="60" y1="20" x2="60" y2="108" stroke="#bfe0d6" stroke-width="1.5" opacity="0.5"/>
    <line x1="20" y1="64" x2="100" y2="64" stroke="#bfe0d6" stroke-width="1.5" opacity="0.5"/>
    <line x1="20" y1="86" x2="100" y2="86" stroke="#bfe0d6" stroke-width="1.5" opacity="0.5"/>
    <!-- potted plant inside -->
    <rect x="50" y="88" width="20" height="14" rx="2" fill="#8a5a3c"/>
    <circle cx="60" cy="82" r="9" fill="#6ca34f"/>
    <circle cx="60" cy="74" r="4" fill="#f6b35a"/>
  </svg>`;
}
