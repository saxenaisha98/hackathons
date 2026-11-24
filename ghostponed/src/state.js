// state.js — data model, persistence, and pure state transitions for Ghostponed.

const STORAGE_KEY = "ghostponed.v1";

export function uuid() {
  if (typeof crypto !== "undefined" && crypto.randomUUID) return crypto.randomUUID();
  // Fallback for older browsers.
  return "id-" + Date.now().toString(36) + "-" + Math.random().toString(36).slice(2, 10);
}

export function emptyState() {
  return {
    version: 1,
    tasks: [],
    shelter: { active: false, shelterDay: null, extensionsUsed: 0 },
    timer: null, // TimerSnapshot or null
  };
}

export function loadState() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return emptyState();
    const parsed = JSON.parse(raw);
    if (!parsed || typeof parsed !== "object" || !Array.isArray(parsed.tasks)) {
      return emptyState();
    }
    // Merge onto a fresh base so missing fields are always valid.
    const base = emptyState();
    return {
      ...base,
      ...parsed,
      shelter: { ...base.shelter, ...(parsed.shelter || {}) },
      tasks: parsed.tasks.map(normalizeTask),
    };
  } catch {
    // Corrupt storage — never throw, just start fresh.
    return emptyState();
  }
}

export function saveState(state) {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
  } catch {
    // Storage full or unavailable — fail silently, app keeps working in-memory.
  }
}

function normalizeTask(t) {
  return {
    id: t.id || uuid(),
    title: String(t.title || "Untitled task"),
    deadline: Number(t.deadline) || Date.now(),
    createdAt: Number(t.createdAt) || Date.now(),
    milestones: Array.isArray(t.milestones) ? t.milestones.map(normalizeMilestone) : [],
    completed: Boolean(t.completed),
    completedAt: t.completedAt == null ? null : Number(t.completedAt),
    ghostVariant: Number.isInteger(t.ghostVariant) ? t.ghostVariant : 0,
  };
}

function normalizeMilestone(m) {
  return { id: m.id || uuid(), text: String(m.text || "Step"), done: Boolean(m.done) };
}

// ---- Pure transitions. Each returns a new tasks array / state; no mutation. ----

export function createTask(title, deadline, variantSeed = 0) {
  const trimmed = String(title || "").trim();
  if (!trimmed) return null; // caller handles the gentle inline message (R1.2)
  return {
    id: uuid(),
    title: trimmed,
    deadline: Number(deadline),
    createdAt: Date.now(),
    milestones: [],
    completed: false,
    completedAt: null,
    ghostVariant: Math.abs(variantSeed) % 3,
  };
}

export function withTaskUpdated(tasks, id, updater) {
  return tasks.map((t) => (t.id === id ? updater({ ...t }) : t));
}

export function addMilestone(tasks, taskId, text) {
  const trimmed = String(text || "").trim();
  if (!trimmed) return tasks;
  return withTaskUpdated(tasks, taskId, (t) => ({
    ...t,
    milestones: [...t.milestones, { id: uuid(), text: trimmed, done: false }],
  }));
}

export function toggleMilestone(tasks, taskId, milestoneId) {
  return withTaskUpdated(tasks, taskId, (t) => ({
    ...t,
    milestones: t.milestones.map((m) =>
      m.id === milestoneId ? { ...m, done: !m.done } : m
    ),
  }));
}

export function completeTask(tasks, taskId) {
  return withTaskUpdated(tasks, taskId, (t) => ({
    ...t,
    completed: true,
    completedAt: Date.now(),
  }));
}

export function uncompleteTask(tasks, taskId) {
  return withTaskUpdated(tasks, taskId, (t) => ({
    ...t,
    completed: false,
    completedAt: null,
  }));
}

export function rescheduleTask(tasks, taskId, newDeadline) {
  return withTaskUpdated(tasks, taskId, (t) => ({ ...t, deadline: Number(newDeadline) }));
}

export function removeTask(tasks, taskId) {
  return tasks.filter((t) => t.id !== taskId);
}

export function progress(task) {
  const total = task.milestones.length;
  const done = task.milestones.filter((m) => m.done).length;
  return { done, total };
}
