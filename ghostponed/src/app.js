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
ui.buildAmbient(); // build the floating world once (don't restart it on every tick)
ui.renderAll();

// Rebuild ambient creatures on resize so they still span the viewport.
let resizeTimer = null;
window.addEventListener("resize", () => {
  clearTimeout(resizeTimer);
  resizeTimer = setTimeout(() => ui.buildAmbient(), 250);
});

// Timer tick — only updates the clock (ghosts drift via CSS, so we must NOT rebuild the
// scene every second or their continuous sweep would restart and jump).
setInterval(() => {
  const timer = state.timer;
  if (!timer || timer.paused) return;
  if (isComplete(timer)) ui.onTimerComplete();
  else ui.renderTimer();
}, 1000);

// Refresh the scene roughly once a minute so ghost speed reflects deadline drift.
setInterval(() => ui.renderScene(), 60000);

// Re-check on visibility change so a backgrounded completed timer resolves on return.
document.addEventListener("visibilitychange", () => {
  if (document.hidden) return;
  if (state.timer && !state.timer.paused && isComplete(state.timer)) {
    ui.onTimerComplete();
  } else {
    ui.renderTimer();
    ui.renderScene();
  }
});
