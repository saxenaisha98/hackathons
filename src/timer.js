// timer.js — wall-clock focus timer. Survives reloads and tab backgrounding.

export const DEFAULT_DURATION_MS = 25 * 60 * 1000;

export function startTimer(taskId, durationMs = DEFAULT_DURATION_MS, now = Date.now()) {
  return {
    taskId: taskId || null,
    durationMs,
    endsAt: now + durationMs,
    paused: false,
    remainingMs: durationMs,
  };
}

export function pauseTimer(snap, now = Date.now()) {
  if (!snap || snap.paused) return snap;
  return { ...snap, paused: true, remainingMs: Math.max(0, snap.endsAt - now), endsAt: null };
}

export function resumeTimer(snap, now = Date.now()) {
  if (!snap || !snap.paused) return snap;
  return { ...snap, paused: false, endsAt: now + snap.remainingMs };
}

export function resetTimer() {
  return null;
}

// Remaining ms right now — wall-clock based, so backgrounding the tab doesn't drift.
export function remaining(snap, now = Date.now()) {
  if (!snap) return 0;
  if (snap.paused) return Math.max(0, snap.remainingMs);
  return Math.max(0, snap.endsAt - now);
}

export function isComplete(snap, now = Date.now()) {
  return Boolean(snap) && !snap.paused && remaining(snap, now) <= 0;
}

export function formatClock(ms) {
  const total = Math.max(0, Math.round(ms / 1000));
  const m = Math.floor(total / 60);
  const s = total % 60;
  return `${String(m).padStart(2, "0")}:${String(s).padStart(2, "0")}`;
}
