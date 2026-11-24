# Ghostponed 🌙

An original "cozy courage" to-do app: a nervous-but-brave little guardian (**Pip**)
protects its haunted home from the things it's been putting off. Each task is a ghost that
drifts toward the house as its deadline nears; completing milestones pushes the ghost back.
When it's too much, shelter in the greenhouse — *"Rest tonight. We'll face it together
tomorrow."* Encouraging tone, recoverable consequences, all original art and characters.

**Run it:** open `index.html` in a browser (or `python3 -m http.server` then visit the page).
No build step, no backend. State saved in `localStorage`. v1 is frontend-only.

## What was built — trajectory

| # | Step | What | Files |
|---|------|------|-------|
| 1 | Spec | Requirements, design, task list | `.kiro/specs/ghostponed/*` |
| 2 | State | Data model + localStorage + pure transitions | `src/state.js` |
| 3 | Ghost math | Deadline + milestone → ghost distance/position | `src/ghost.js` |
| 4 | Shelter | "Overwhelmed today", 1 extension, smaller-step helper | `src/shelter.js` |
| 5 | Timer | Wall-clock focus timer (reload-safe) | `src/timer.js` |
| 6 | Artwork | Original SVG: haunted house, guardian "Pip", 3 big ghosts, greenhouse | `src/art.js` |
| 7 | UI | Scene render, task cards, toasts/undo, shelter flow | `src/ui.js` |
| 8 | Bootstrap | Load, render, tick, visibility handling | `src/app.js` |
| 9 | Shell | Markup + Kiro-purple/black spooky theme | `index.html`, `styles.css` |

## Core mechanics

| Feature | How it works |
|---------|--------------|
| Ghost advances | `distance = 0.65·timeLeft + 0.35·milestoneProgress`, clamped 0–1 |
| Defense | Each completed milestone pushes the ghost back + grows a plant |
| Overdue | Ghost reaches house but task is still recoverable (finish / reschedule / shelter) |
| Overwhelmed today | Pauses all ghosts until tomorrow; one extension only |
| Leaving shelter | Suggests the single easiest milestone (or offers to create one) |
| Focus timer | 25 min default, start/pause/reset, survives reload, offers to tick a milestone |
| Recoverable | Delete has confirm + undo; complete has undo; nothing silently lost |

## Not in v1

Frontend only — no accounts, sync, or backend. Logic modules are pure functions, ready for
tests later if wanted.
