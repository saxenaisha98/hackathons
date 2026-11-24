# Design — Ghostponed

## 1. Approach

A single-page web app built with vanilla HTML, CSS, and ES modules — no framework, no
build step, no backend. State lives in `localStorage`. Artwork is original inline SVG so
the characters ship with the code and stay copyright-clean.

Rationale: the brief asks for a *small working web app*. Zero dependencies means it opens
by double-clicking `index.html` (or any static server), is trivial to review, and has no
supply-chain or licensing risk for the artwork.

## 2. File structure

```
/projects/sandbox/
  index.html          # app shell, scene container, panels
  styles.css          # cozy-spooky theme, layout, animations
  src/
    state.js          # data model, persistence, pure state transitions
    ghost.js          # ghost distance/position math
    shelter.js        # greenhouse / "overwhelmed today" logic + day math
    timer.js          # focus timer (wall-clock based)
    art.js            # original SVG artwork (house, ghost, plants, greenhouse)
    ui.js             # rendering + event wiring
    app.js            # bootstrap: load state, render, attach handlers
  README.md
```

## 3. Data model

```js
// Task
{
  id: string,            // crypto.randomUUID()
  title: string,
  deadline: number,      // epoch ms
  createdAt: number,
  milestones: Milestone[],
  completed: boolean,
  completedAt: number | null,
  ghostVariant: number   // 0..N, picks one of the original ghost designs
}

// Milestone
{ id: string, text: string, done: boolean }

// Shelter (singleton)
{
  active: boolean,
  shelterDay: string,    // 'YYYY-MM-DD' local — the day shelter protects through
  extensionsUsed: number // 0 or 1
}

// Root persisted blob (localStorage key "ghostponed.v1")
{ version: 1, tasks: Task[], shelter: Shelter, timer: TimerSnapshot }
```

`TimerSnapshot` stores `{ taskId, endsAt, durationMs, paused, remainingMs }` so the
countdown survives reloads (wall-clock based rather than tick-counting).

## 4. Ghost advancement math (`ghost.js`)

Distance is a value in `[0, 1]`, where `1` = far (safe, at tree line) and `0` = at the
house. Position on screen interpolates between a far anchor and the house.

```
timeFactor     = clamp01( (deadline - now) / horizon )     // horizon default 7 days
progressFactor = done / max(1, total)                      // milestone completion ratio
distance       = clamp01( 0.65 * timeFactor + 0.35 * progressFactor )
```

- A fresh task far from its deadline with no progress still sits comfortably back.
- As `now` approaches `deadline`, `timeFactor → 0` and the ghost drifts in.
- Completing milestones raises `progressFactor`, pushing the ghost back out — this is the
  "defense" mechanic.
- Past deadline: `timeFactor` clamps to 0, so with no progress `distance → 0` (ghost at the
  house). Still fully recoverable: completing milestones or rescheduling lifts it again.
- While sheltered, advancement is frozen: the UI pins `now` to the shelter's reference
  time so ghosts do not creep in during the pause.

Each completed milestone also triggers a one-step "push back" animation and grows one
plant tier, so the feedback is immediate and legible independent of the continuous math.

## 5. Shelter / Overwhelmed today (`shelter.js`)

- Days are compared by local `YYYY-MM-DD` string to avoid timezone drift.
- `enterShelter(now)`: sets `active=true`, `shelterDay = today`, resets nothing.
- `isSheltered(state, now)`: true while `active` and `today <= shelterDay`.
- `extendShelter(now)`: allowed only if `extensionsUsed === 0`; sets `shelterDay = tomorrow`,
  `extensionsUsed = 1`. A second attempt returns a declined result with a kind message.
- Auto-expire: on load/render, if `today > shelterDay`, shelter clears itself.
- Leaving the shelter runs the **smaller next step** helper: scan all incomplete tasks for
  the milestone with the shortest text among the nearest-deadline task (a cheap proxy for
  "easiest"); if none exist, offer to create one. The chosen step is surfaced as the single
  suggested action.

## 6. Focus timer (`timer.js`)

Wall-clock based: store `endsAt`. Remaining = `endsAt - now`, recomputed each render tick
(1s interval) and on visibility change, so backgrounding the tab does not drift. Pause
stores `remainingMs` and clears `endsAt`; resume recomputes `endsAt = now + remainingMs`.
On completion: fire encouragement + offer to check off a milestone of the linked task.

## 7. UI layout (`ui.js`, `index.html`)

```
┌───────────────────────────────────────────────┐
│  Ghostponed            [ Overwhelmed today ]    │  header
├───────────────────────────────────────────────┤
│                                                 │
│   SCENE: night sky, tree line, ghosts drifting, │  SVG scene
│   garden plants, the house. (greenhouse overlay │
│   when sheltered)                               │
│                                                 │
├──────────────────────┬──────────────────────────┤
│  Tasks + milestones  │  Focus timer              │  panels
│  [ + add task ]      │  [25:00] start/pause/reset│
└──────────────────────┴──────────────────────────┘
```

- Scene redraws ghost x-positions from `distance` whenever state changes.
- Each task card: title, deadline (relative, e.g. "in 2 days"), progress bar, milestone
  list with checkboxes, add-milestone input, complete/delete actions.
- Delete shows a confirm + a 6s "Undo" toast (recoverable consequence).

## 8. Theme (`styles.css`)

Cozy-spooky palette: deep indigo night (`#1b1033`), moonlit lavender, warm pumpkin accent
(`#e8853b`), sage/garden greens for plants. Soft rounded cards, gentle float animation on
ghosts, glow on the house windows. Respect `prefers-reduced-motion` by disabling drift
animation.

## 9. Original artwork (`art.js`)

All SVG authored here, returned as strings/elements:
- **House**: a small cottage with lit windows and a garden fence.
- **Ghosts**: 3 variants (round sheet-ghost, lantern-ghost, wisp) with simple faces,
  friendly rather than scary.
- **Plants**: 3 growth tiers (sprout → bush → warding-bloom) drawn per plant slot.
- **Greenhouse**: glass-panel overlay for the shelter state.

No external image/font assets; system font stack with a cozy fallback.

## 10. Error handling & edge cases

- Corrupt/missing localStorage → start fresh with an empty, valid state (never throw).
- Deadline in the past at creation → allowed; ghost starts near the house but recoverable.
- No milestones → progress bar shows 0/0 and the "smaller step" helper offers to add one.
- `crypto.randomUUID` fallback for older browsers.

## 11. Testing strategy

Pure logic (`ghost.js`, `shelter.js`, `timer.js`, state transitions) is written as pure
functions so they can be checked with a tiny assertion script (`npm`-free) and by manual
scenario walkthroughs documented in the README. UI is verified manually against the
acceptance criteria. (Automated tests are optional and not added unless requested.)
