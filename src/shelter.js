// shelter.js — greenhouse / "Overwhelmed today" logic and the smaller-next-step helper.

import { progress } from "./state.js";

// Local calendar day as YYYY-MM-DD (avoids timezone/UTC drift).
export function dayKey(ms) {
  const d = new Date(ms);
  const y = d.getFullYear();
  const m = String(d.getMonth() + 1).padStart(2, "0");
  const day = String(d.getDate()).padStart(2, "0");
  return `${y}-${m}-${day}`;
}

export function tomorrowKey(ms) {
  return dayKey(ms + 24 * 60 * 60 * 1000);
}

export function enterShelter(now) {
  return { active: true, shelterDay: dayKey(now), extensionsUsed: 0 };
}

// Sheltered while active and today is within the protected day.
export function isSheltered(shelter, now) {
  if (!shelter || !shelter.active || !shelter.shelterDay) return false;
  return dayKey(now) <= shelter.shelterDay;
}

// Clear shelter if its protected day has passed.
export function autoExpire(shelter, now) {
  if (shelter && shelter.active && dayKey(now) > shelter.shelterDay) {
    return { active: false, shelterDay: null, extensionsUsed: 0 };
  }
  return shelter;
}

// Extend by one day. Allowed only once.
export function extendShelter(shelter, now) {
  if (!shelter || !shelter.active) {
    return { ok: false, reason: "not-sheltered", shelter };
  }
  if (shelter.extensionsUsed >= 1) {
    return {
      ok: false,
      reason: "limit",
      shelter,
      message:
        "You've already stretched the shelter once — that's completely okay. " +
        "Rather than hiding another day, let's pick one tiny step together.",
    };
  }
  return {
    ok: true,
    shelter: { active: true, shelterDay: tomorrowKey(now), extensionsUsed: 1 },
  };
}

// Choose the smallest next step before leaving the shelter (R5.5).
// Strategy: among incomplete tasks, prefer the nearest-deadline task, then its
// shortest-text incomplete milestone (a cheap proxy for "easiest").
export function smallerNextStep(tasks) {
  const open = tasks.filter((t) => !t.completed);
  if (open.length === 0) {
    return { kind: "none", message: "Nothing is open right now. Rest easy." };
  }
  const sorted = [...open].sort((a, b) => a.deadline - b.deadline);
  for (const task of sorted) {
    const openMs = task.milestones.filter((m) => !m.done);
    if (openMs.length > 0) {
      const easiest = openMs.reduce((best, m) =>
        m.text.length < best.text.length ? m : best
      );
      return { kind: "milestone", task, milestone: easiest };
    }
  }
  // No milestones exist anywhere — offer to create one on the nearest task.
  return { kind: "create", task: sorted[0] };
}
