# Ghostponed 🌙

A cozy spooky to-do app with a garden-defense feel. Add tasks with deadlines; each gets a
ghost that drifts toward your garden house as the deadline nears. Complete milestones to
grow defensive plants and push ghosts back. Encouraging tone, recoverable consequences.

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
| 6 | Artwork | Original SVG: house, 3 ghosts, 3 plant tiers, greenhouse | `src/art.js` |
| 7 | UI | Scene render, task cards, toasts/undo, shelter flow | `src/ui.js` |
| 8 | Bootstrap | Load, render, tick, visibility handling | `src/app.js` |
| 9 | Shell | Markup + cozy-spooky theme | `index.html`, `styles.css` |

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
