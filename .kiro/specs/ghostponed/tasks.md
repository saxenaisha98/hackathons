# Implementation Plan — Ghostponed

- [ ] 1. Scaffold the app shell and theme
  - Create `index.html` with header, scene container, task panel, and timer panel.
  - Create `styles.css` with the cozy-spooky palette, layout grid, and reduced-motion support.
  - _Requirements: R7, R8_

- [ ] 2. Build the state model and persistence
  - In `src/state.js`: define the root blob, load/save to localStorage with corruption-safe
    defaults, and pure transitions (addTask, deleteTask, toggleMilestone, addMilestone,
    completeTask, rescheduleTask).
  - Add a UUID helper with fallback.
  - _Requirements: R1.1, R1.3, R1.5, R2.1, R2.3, R6.2_

- [ ] 3. Implement ghost advancement math
  - In `src/ghost.js`: pure `distance(task, now, horizon)` and `screenX(distance)` with
    clamping; freeze behavior when sheltered.
  - _Requirements: R3.1, R3.2, R3.3, R3.5_

- [ ] 4. Implement shelter / "Overwhelmed today" logic
  - In `src/shelter.js`: day math (local YYYY-MM-DD), enter/isSheltered/extend/auto-expire,
    one-extension cap, and the smaller-next-step chooser.
  - _Requirements: R5.1–R5.6, R6.3_

- [ ] 5. Implement the focus timer
  - In `src/timer.js`: wall-clock countdown with start/pause/reset, task association,
    reload-safe snapshot, and completion callback.
  - _Requirements: R4.1–R4.4_

- [ ] 6. Author original SVG artwork
  - In `src/art.js`: house, 3 ghost variants, 3 plant growth tiers, greenhouse overlay.
  - _Requirements: R7.1, R7.2_

- [ ] 7. Build the UI rendering and event wiring
  - In `src/ui.js`: render scene (ghost positions, plants, house), task cards with
    milestones and progress, timer panel, shelter overlay.
  - Wire add/complete/delete (with confirm + undo toast), milestone toggle (grow plant +
    push ghost), overwhelmed button, timer controls.
  - Use warm, non-punishing copy throughout; frame missed deadlines as recoverable.
  - _Requirements: R1.1–R1.4, R2.1–R2.4, R3.4, R4.3, R5.2, R5.5, R6.1, R6.3_

- [ ] 8. Bootstrap and integrate
  - In `src/app.js`: load state, initial render, attach handlers, start render/timer tick,
    handle visibility change, auto-expire shelter on load.
  - _Requirements: R4.4, R5.6, R8.1, R8.2_

- [ ] 9. Verify against acceptance criteria and document
  - Walk through each requirement scenario in the browser; fix issues.
  - Write `README.md`: how to run, the mechanics, and the recoverable-consequences design.
  - _Requirements: all_
