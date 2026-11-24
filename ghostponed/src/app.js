// app.js — bootstrap: load state, render, tick the timer, auto-expire shelter.

import { loadState, saveState } from "./state.js";
import { autoExpire, isSheltered } from "./shelter.js";
import { isComplete } from "./timer.js";
import { createUI } from "./ui.js";

let state = loadState();

// Auto-expire shelter on load (R5.6).
state.shelter = autoExpire(state.shelter, Date.now());
saveState(state);

const ctx = {
  getState: () => state,
  setState: (next) => {
    state = next;
  },
  // "Effective now": while sheltered, freeze ghost advancement by pinning now to
  // the start of the protected day so ghosts don't creep in during the pause.
  now: () => {
    if (isSheltered(state.shelter, Date.now())) {
      return new Date(state.shelter.shelterDay + "T00:00:00").getTime();
    }
    return Date.now();
  },
};

const ui = createUI(ctx);
ui.renderAll();

// Timer + scene tick. Wall-clock based, so backgrounding doesn't drift.
setInterval(() => {
  const timer = state.timer;
  if (timer && !timer.paused) {
    if (isComplete(timer)) {
      ui.onTimerComplete();
    } else {
      ui.renderTimer();
      // refresh scene so ghost drift is visible over time
      ui.renderScene();
    }
  }
}, 1000);

// Re-check on visibility change so a backgrounded completed timer resolves on return.
document.addEventListener("visibilitychange", () => {
  if (!document.hidden) {
    if (state.timer && !state.timer.paused && isComplete(state.timer)) {
      ui.onTimerComplete();
    } else {
      ui.renderTimer();
      ui.renderScene();
    }
  }
});
