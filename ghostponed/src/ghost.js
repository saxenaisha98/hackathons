// ghost.js — pure ghost advancement math.
// distance in [0,1]: 1 = far/safe (tree line), 0 = at the house.

import { progress } from "./state.js";

export const HORIZON_MS = 7 * 24 * 60 * 60 * 1000; // 7 days

export function clamp01(n) {
  if (Number.isNaN(n)) return 0;
  return Math.max(0, Math.min(1, n));
}

export function distance(task, now, horizon = HORIZON_MS) {
  const timeFactor = clamp01((task.deadline - now) / horizon);
  const { done, total } = progress(task);
  const progressFactor = done / Math.max(1, total);
  return clamp01(0.65 * timeFactor + 0.35 * progressFactor);
}

// Map distance to a horizontal scene position.
// Far (distance 1) sits near the tree line (left), close (0) reaches the house (right).
// Returns a percentage 0..100 for CSS positioning.
export function screenX(dist) {
  const d = clamp01(dist);
  const farPct = 6; // tree line
  const housePct = 78; // just short of the house
  return farPct + (housePct - farPct) * (1 - d);
}

// A ghost at the house (deadline reached, no progress) — used for recoverable framing.
export function atHouse(dist) {
  return clamp01(dist) <= 0.02;
}
