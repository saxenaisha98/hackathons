// ui.js — rendering and event wiring. Warm, non-punishing copy throughout.

import {
  progress,
  createTask,
  addMilestone,
  toggleMilestone,
  completeTask,
  uncompleteTask,
  rescheduleTask,
  removeTask,
  saveState,
} from "./state.js";
import { distance, screenX, atHouse, HORIZON_MS } from "./ghost.js";
import {
  enterShelter,
  isSheltered,
  extendShelter,
  smallerNextStep,
  dayKey,
} from "./shelter.js";
import {
  startTimer,
  pauseTimer,
  resumeTimer,
  resetTimer,
  remaining,
  formatClock,
  DEFAULT_DURATION_MS,
} from "./timer.js";
import {
  houseSVG,
  ghostSVG,
  guardianSVG,
  greenhouseSVG,
  witchSVG,
  spiritParticleSVG,
} from "./art.js";

const GHOST_NAMES = ["Mope", "Flicker", "Drift"];

export function createUI(ctx) {
  // ctx: { getState, setState, now } — now() returns the "effective now"
  // (frozen when sheltered, handled in app.js).
  const el = {
    scene: document.getElementById("scene"),
    taskList: document.getElementById("task-list"),
    taskForm: document.getElementById("task-form"),
    taskTitle: document.getElementById("task-title"),
    taskDeadline: document.getElementById("task-deadline"),
    taskError: document.getElementById("task-error"),
    overwhelmedBtn: document.getElementById("overwhelmed-btn"),
    shelterOverlay: document.getElementById("shelter-overlay"),
    timerClock: document.getElementById("timer-clock"),
    timerTask: document.getElementById("timer-task"),
    timerStart: document.getElementById("timer-start"),
    timerPause: document.getElementById("timer-pause"),
    timerReset: document.getElementById("timer-reset"),
    timerStatus: document.getElementById("timer-status"),
    cauldron: document.querySelector(".cauldron"),
    toast: document.getElementById("toast"),
  };

  let undoTimer = null;

  // ---------- helpers ----------
  function commit(mutator) {
    const s = ctx.getState();
    const next = mutator(structuredCloneSafe(s));
    ctx.setState(next);
    saveState(next);
    renderAll();
  }

  function structuredCloneSafe(obj) {
    return JSON.parse(JSON.stringify(obj));
  }

  function relativeDeadline(deadline, now) {
    const diff = deadline - now;
    const day = 24 * 60 * 60 * 1000;
    const hour = 60 * 60 * 1000;
    if (diff <= 0) {
      const over = Math.abs(diff);
      if (over < day) return "due today";
      return `${Math.round(over / day)}d past — still fixable`;
    }
    if (diff < hour) return `in ${Math.max(1, Math.round(diff / (60 * 1000)))} min`;
    if (diff < day) return `in ${Math.round(diff / hour)}h`;
    return `in ${Math.round(diff / day)} days`;
  }

  function showToast(message, actionLabel, onAction, ms = 6000) {
    el.toast.innerHTML = "";
    const span = document.createElement("span");
    span.textContent = message;
    el.toast.appendChild(span);
    if (actionLabel) {
      const btn = document.createElement("button");
      btn.className = "toast-action";
      btn.textContent = actionLabel;
      btn.addEventListener("click", () => {
        hideToast();
        onAction && onAction();
      });
      el.toast.appendChild(btn);
    }
    el.toast.classList.add("show");
    clearTimeout(undoTimer);
    undoTimer = setTimeout(hideToast, ms);
  }

  function hideToast() {
    el.toast.classList.remove("show");
    el.toast.innerHTML = "";
  }

  // ---------- scene ----------
  function renderScene() {
    const s = ctx.getState();
    const now = ctx.now();
    const sheltered = isSheltered(s.shelter, Date.now());

    el.scene.innerHTML = "";

    // atmosphere layers
    const sky = document.createElement("div");
    sky.className = "scene-sky";
    el.scene.appendChild(sky);

    const activeTasks = s.tasks.filter((t) => !t.completed);
    const totalDone = activeTasks.reduce((acc, t) => acc + progress(t).done, 0);

    // moon: full-ish normally, a thin "new moon" crescent in the empty state
    const moon = document.createElement("div");
    moon.className = activeTasks.length === 0 ? "scene-moon new-moon" : "scene-moon";
    el.scene.appendChild(moon);

    const trees = document.createElement("div");
    trees.className = "scene-trees";
    el.scene.appendChild(trees);

    // drifting fog / mist
    const fog = document.createElement("div");
    fog.className = "scene-fog";
    el.scene.appendChild(fog);

    // floating spirit particles for ambient motion
    const particles = document.createElement("div");
    particles.className = "scene-particles";
    for (let i = 0; i < 6; i++) {
      const p = document.createElement("div");
      p.className = "spirit-particle";
      p.style.left = `${8 + i * 15}%`;
      p.style.setProperty("--delay", `${i * 1.7}s`);
      p.style.setProperty("--dur", `${9 + (i % 4) * 2}s`);
      p.innerHTML = spiritParticleSVG();
      particles.appendChild(p);
    }
    el.scene.appendChild(particles);

    // haunted house (right side)
    const house = document.createElement("div");
    house.className = "scene-house";
    house.innerHTML = houseSVG();
    el.scene.appendChild(house);

    // EMPTY STATE: witch drifting across the new moon
    if (activeTasks.length === 0) {
      const witch = document.createElement("div");
      witch.className = "scene-witch";
      witch.innerHTML = witchSVG();
      el.scene.appendChild(witch);

      const guardianEmpty = document.createElement("div");
      guardianEmpty.className = "scene-guardian calm";
      guardianEmpty.innerHTML = guardianSVG(true);
      el.scene.appendChild(guardianEmpty);

      const hint = document.createElement("div");
      hint.className = "scene-empty-hint";
      hint.textContent = "A quiet, haunted night. Add a task to call forth its ghost.";
      el.scene.appendChild(hint);

      if (sheltered) el.scene.classList.add("sheltered");
      else el.scene.classList.remove("sheltered");
      return;
    }

    // the guardian, Pip — stands in front of the home. Braver when progress is happening.
    const guardian = document.createElement("div");
    guardian.className = "scene-guardian";
    guardian.innerHTML = guardianSVG(totalDone > 0);
    el.scene.appendChild(guardian);

    // ghosts (bigger, surreal) — each wanders on its own looping path. The deadline
    // distance sets how close the wander-band sits to the house (near = more intrusive).
    activeTasks.forEach((task, idx) => {
      const dist = sheltered ? Math.max(0.5, distance(task, now)) : distance(task, now);
      const baseX = screenX(dist);
      const g = document.createElement("div");
      g.className = "scene-ghost wander";
      // anchor the wander band around the deadline-driven x, with vertical lane per ghost
      g.style.setProperty("--anchor-x", `${baseX}%`);
      g.style.setProperty("--lane-y", `${12 + (idx % 3) * 20}%`);
      g.style.setProperty("--rx", `${7 + (idx % 3) * 3}%`);   // horizontal roam radius
      g.style.setProperty("--ry", `${6 + (idx % 2) * 4}%`);   // vertical roam radius
      g.style.setProperty("--dur", `${11 + (idx % 5) * 2.5}s`); // each ghost its own speed
      g.style.setProperty("--delay", `${idx * -2.3}s`);
      g.style.opacity = String(0.6 + 0.4 * (1 - dist));
      // pick one of 4 wander paths so ghosts cross over the whole scene, not one spot
      g.classList.add(`path-${idx % 4}`);
      const mood = dist; // far = calm
      g.innerHTML = ghostSVG(task.ghostVariant, mood);
      const label = document.createElement("div");
      label.className = "ghost-label";
      label.textContent = `${GHOST_NAMES[task.ghostVariant] || "Ghost"} · ${task.title}`;
      g.appendChild(label);
      if (atHouse(dist)) g.classList.add("at-house");
      el.scene.appendChild(g);
    });

    // shelter overlay
    if (sheltered) {
      el.scene.classList.add("sheltered");
    } else {
      el.scene.classList.remove("sheltered");
    }
  }

  // ---------- tasks ----------
  function renderTasks() {
    const s = ctx.getState();
    const now = ctx.now();
    el.taskList.innerHTML = "";

    const active = s.tasks.filter((t) => !t.completed);
    const done = s.tasks.filter((t) => t.completed);

    if (active.length === 0 && done.length === 0) {
      const empty = document.createElement("p");
      empty.className = "empty-hint";
      empty.textContent =
        "No tasks yet. Add one above — start small, you can always grow it.";
      el.taskList.appendChild(empty);
      return;
    }

    active
      .slice()
      .sort((a, b) => a.deadline - b.deadline)
      .forEach((task) => el.taskList.appendChild(taskCard(task, now)));

    if (done.length > 0) {
      const h = document.createElement("h3");
      h.className = "done-heading";
      h.textContent = "Banished ghosts 🎉";
      el.taskList.appendChild(h);
      done.forEach((task) => el.taskList.appendChild(taskCard(task, now)));
    }
  }

  function taskCard(task, now) {
    const { done, total } = progress(task);
    const pct = total === 0 ? 0 : Math.round((done / total) * 100);
    const card = document.createElement("div");
    card.className = "task-card" + (task.completed ? " completed" : "");

    const head = document.createElement("div");
    head.className = "task-head";
    const title = document.createElement("div");
    title.className = "task-title";
    title.textContent = task.title;
    const when = document.createElement("div");
    when.className = "task-deadline";
    when.textContent = task.completed ? "done" : relativeDeadline(task.deadline, now);
    if (!task.completed && task.deadline - now <= 0) when.classList.add("overdue");
    head.appendChild(title);
    head.appendChild(when);
    card.appendChild(head);

    // progress bar
    const bar = document.createElement("div");
    bar.className = "progress";
    const fill = document.createElement("div");
    fill.className = "progress-fill";
    fill.style.width = `${pct}%`;
    bar.appendChild(fill);
    card.appendChild(bar);
    const pLabel = document.createElement("div");
    pLabel.className = "progress-label";
    pLabel.textContent = `${done}/${total} milestones`;
    card.appendChild(pLabel);

    // recoverable framing if overdue and not complete
    if (!task.completed && task.deadline - now <= 0) {
      const rec = document.createElement("div");
      rec.className = "recover-note";
      rec.textContent =
        "This one slipped past its date — totally recoverable. Finish a step, reschedule, or shelter for today.";
      const resched = document.createElement("button");
      resched.className = "link-btn";
      resched.textContent = "Reschedule";
      resched.addEventListener("click", () => {
        const base = new Date(now + 2 * 24 * 60 * 60 * 1000);
        const val = prompt(
          "New deadline (YYYY-MM-DD):",
          dayKey(base.getTime())
        );
        if (val) {
          const ts = new Date(val + "T18:00:00").getTime();
          if (!Number.isNaN(ts)) {
            commit((st) => {
              st.tasks = rescheduleTask(st.tasks, task.id, ts);
              return st;
            });
            showToast("Rescheduled. Fresh start — you've got this.");
          }
        }
      });
      rec.appendChild(document.createTextNode(" "));
      rec.appendChild(resched);
      card.appendChild(rec);
    }

    // milestones
    if (!task.completed) {
      const list = document.createElement("ul");
      list.className = "milestones";
      task.milestones.forEach((m) => {
        const li = document.createElement("li");
        const cb = document.createElement("input");
        cb.type = "checkbox";
        cb.checked = m.done;
        cb.id = `ms-${m.id}`;
        cb.addEventListener("change", () => {
          const wasDone = m.done;
          commit((st) => {
            st.tasks = toggleMilestone(st.tasks, task.id, m.id);
            return st;
          });
          if (!wasDone) {
            pushBackPulse();
            showToast("A plant grows and the ghost drifts back. Nice.");
          }
        });
        const lbl = document.createElement("label");
        lbl.htmlFor = cb.id;
        lbl.textContent = m.text;
        if (m.done) lbl.classList.add("done");
        li.appendChild(cb);
        li.appendChild(lbl);
        list.appendChild(li);
      });
      card.appendChild(list);

      // add milestone
      const msForm = document.createElement("form");
      msForm.className = "ms-form";
      const msInput = document.createElement("input");
      msInput.type = "text";
      msInput.placeholder = "Add a small step…";
      msInput.maxLength = 80;
      const msBtn = document.createElement("button");
      msBtn.type = "submit";
      msBtn.textContent = "+";
      msForm.appendChild(msInput);
      msForm.appendChild(msBtn);
      msForm.addEventListener("submit", (e) => {
        e.preventDefault();
        const text = msInput.value;
        if (!text.trim()) return;
        commit((st) => {
          st.tasks = addMilestone(st.tasks, task.id, text);
          return st;
        });
        msInput.value = "";
      });
      card.appendChild(msForm);
    }

    // actions
    const actions = document.createElement("div");
    actions.className = "task-actions";
    if (!task.completed) {
      const doneBtn = document.createElement("button");
      doneBtn.className = "primary-btn small";
      doneBtn.textContent = "Complete";
      doneBtn.addEventListener("click", () => {
        commit((st) => {
          st.tasks = completeTask(st.tasks, task.id);
          return st;
        });
        showToast(`${task.title} done — ghost banished! 🎉`, "Undo", () => {
          commit((st) => {
            st.tasks = uncompleteTask(st.tasks, task.id);
            return st;
          });
        });
      });
      actions.appendChild(doneBtn);
    } else {
      const reopen = document.createElement("button");
      reopen.className = "link-btn";
      reopen.textContent = "Reopen";
      reopen.addEventListener("click", () => {
        commit((st) => {
          st.tasks = uncompleteTask(st.tasks, task.id);
          return st;
        });
      });
      actions.appendChild(reopen);
    }

    const del = document.createElement("button");
    del.className = "link-btn danger";
    del.textContent = "Delete";
    del.addEventListener("click", () => {
      if (!confirm(`Delete "${task.title}"? You'll have a moment to undo.`)) return;
      const snapshot = JSON.parse(JSON.stringify(task));
      commit((st) => {
        st.tasks = removeTask(st.tasks, task.id);
        return st;
      });
      showToast("Task deleted.", "Undo", () => {
        commit((st) => {
          st.tasks = [...st.tasks, snapshot];
          return st;
        });
      });
    });
    actions.appendChild(del);
    card.appendChild(actions);

    return card;
  }

  function pushBackPulse() {
    el.scene.classList.add("pulse");
    setTimeout(() => el.scene.classList.remove("pulse"), 500);
  }

  // ---------- timer ----------
  function renderTimer() {
    const s = ctx.getState();
    const snap = s.timer;
    const rem = snap ? remaining(snap) : DEFAULT_DURATION_MS;
    el.timerClock.textContent = formatClock(rem);

    // populate task select
    const active = s.tasks.filter((t) => !t.completed);
    const current = el.timerTask.value;
    el.timerTask.innerHTML = "";
    const none = document.createElement("option");
    none.value = "";
    none.textContent = "No specific task";
    el.timerTask.appendChild(none);
    active.forEach((t) => {
      const opt = document.createElement("option");
      opt.value = t.id;
      opt.textContent = t.title;
      if (snap && snap.taskId === t.id) opt.selected = true;
      else if (!snap && t.id === current) opt.selected = true;
      el.timerTask.appendChild(opt);
    });

    const running = snap && !snap.paused;
    el.timerStart.textContent = snap ? (snap.paused ? "Resume" : "Brewing…") : "Begin the brew";
    el.timerStart.disabled = running;
    el.timerPause.disabled = !running;
    el.timerReset.disabled = !snap;
    if (el.cauldron) el.cauldron.classList.toggle("brewing", Boolean(running));
    el.timerStatus.textContent = snap
      ? snap.paused
        ? "The brew rests — stir it again whenever."
        : "The cauldron bubbles. One small step at a time."
      : "25 minutes of witching-hour focus.";
  }

  // ---------- shelter ----------
  function renderShelter() {
    const s = ctx.getState();
    const sheltered = isSheltered(s.shelter, Date.now());
    if (!sheltered) {
      el.shelterOverlay.classList.remove("show");
      el.shelterOverlay.innerHTML = "";
      el.overwhelmedBtn.textContent = "Overwhelmed today";
      return;
    }
    el.overwhelmedBtn.textContent = "In the greenhouse";
    el.shelterOverlay.classList.add("show");
    el.shelterOverlay.innerHTML = "";

    const panel = document.createElement("div");
    panel.className = "shelter-panel";
    panel.innerHTML = `
      <div class="shelter-art">${greenhouseSVG()}</div>
      <h2>You're in the greenhouse 🌿</h2>
      <p>The ghosts are paused until tomorrow. Nothing is slipping while you rest here.
      Breathe. You've already done the hard part by noticing you needed a break.</p>
    `;

    const controls = document.createElement("div");
    controls.className = "shelter-controls";

    const extend = document.createElement("button");
    extend.className = "ghost-btn";
    extend.textContent =
      s.shelter.extensionsUsed >= 1 ? "Extension used" : "Stay one more day";
    extend.disabled = s.shelter.extensionsUsed >= 1;
    extend.addEventListener("click", () => {
      const res = extendShelter(s.shelter, Date.now());
      if (res.ok) {
        commit((st) => {
          st.shelter = res.shelter;
          return st;
        });
        showToast("One more day in the greenhouse. That's your last extension — and that's okay.");
      } else if (res.reason === "limit") {
        showToast(res.message, null, null, 8000);
      }
    });
    controls.appendChild(extend);

    const leave = document.createElement("button");
    leave.className = "primary-btn";
    leave.textContent = "I'm ready — pick a tiny step";
    leave.addEventListener("click", () => offerSmallerStep());
    controls.appendChild(leave);

    panel.appendChild(controls);
    el.shelterOverlay.appendChild(panel);
  }

  function offerSmallerStep() {
    const s = ctx.getState();
    const step = smallerNextStep(s.tasks);
    const panel = el.shelterOverlay.querySelector(".shelter-panel");
    const box = document.createElement("div");
    box.className = "next-step";

    if (step.kind === "none") {
      box.innerHTML = `<p>${step.message}</p>`;
      const btn = leaveButton("Step outside");
      box.appendChild(btn);
    } else if (step.kind === "milestone") {
      box.innerHTML = `<p>Your gentlest next step:</p>
        <p class="step-highlight">“${escapeHtml(step.milestone.text)}”<br>
        <span class="step-sub">from ${escapeHtml(step.task.title)}</span></p>`;
      const btn = leaveButton("Leave and do just this");
      box.appendChild(btn);
    } else if (step.kind === "create") {
      box.innerHTML = `<p>Let's name one tiny step for <b>${escapeHtml(
        step.task.title
      )}</b> so leaving feels easy:</p>`;
      const form = document.createElement("form");
      form.className = "ms-form";
      const input = document.createElement("input");
      input.type = "text";
      input.placeholder = "e.g. open the document";
      const add = document.createElement("button");
      add.type = "submit";
      add.textContent = "Set step";
      form.appendChild(input);
      form.appendChild(add);
      form.addEventListener("submit", (e) => {
        e.preventDefault();
        if (!input.value.trim()) return;
        commit((st) => {
          st.tasks = addMilestone(st.tasks, step.task.id, input.value);
          return st;
        });
        leaveShelter();
        showToast("Step set. Leave the greenhouse whenever you're ready.");
      });
      box.appendChild(form);
      box.appendChild(leaveButton("Skip and step outside"));
    }

    // replace controls with the step chooser
    const oldControls = panel.querySelector(".shelter-controls");
    if (oldControls) oldControls.remove();
    const existing = panel.querySelector(".next-step");
    if (existing) existing.remove();
    panel.appendChild(box);
  }

  function leaveButton(label) {
    const btn = document.createElement("button");
    btn.className = "primary-btn";
    btn.textContent = label;
    btn.addEventListener("click", () => leaveShelter());
    return btn;
  }

  function leaveShelter() {
    commit((st) => {
      st.shelter = { active: false, shelterDay: null, extensionsUsed: st.shelter.extensionsUsed };
      return st;
    });
    showToast("Welcome back out. One small step is plenty for today.");
  }

  function escapeHtml(str) {
    const div = document.createElement("div");
    div.textContent = str;
    return div.innerHTML;
  }

  // ---------- events ----------
  // A ghost drifts over to peek while you're naming a new task (playful "intrusion").
  function showIntruder() {
    if (document.getElementById("intruder-ghost")) return;
    const ghost = document.createElement("div");
    ghost.id = "intruder-ghost";
    ghost.className = "intruder-ghost";
    const variant = ctx.getState().tasks.length % 3;
    ghost.innerHTML =
      ghostSVG(variant, 0.2) +
      `<div class="intruder-speak">ooOOoo… what's this one?</div>`;
    el.taskForm.appendChild(ghost);
  }
  function hideIntruder() {
    const g = document.getElementById("intruder-ghost");
    if (g) {
      g.classList.add("leaving");
      setTimeout(() => g.remove(), 450);
    }
  }
  el.taskTitle.addEventListener("focus", showIntruder);
  el.taskTitle.addEventListener("blur", () => setTimeout(hideIntruder, 150));

  el.taskForm.addEventListener("submit", (e) => {
    e.preventDefault();
    hideIntruder();
    el.taskError.textContent = "";
    const title = el.taskTitle.value;
    const dateVal = el.taskDeadline.value;
    if (!title.trim()) {
      el.taskError.textContent = "A gentle nudge: your task needs a name.";
      return;
    }
    let deadline;
    if (dateVal) {
      deadline = new Date(dateVal + "T18:00:00").getTime();
    } else {
      deadline = Date.now() + 3 * 24 * 60 * 60 * 1000; // default 3 days out
    }
    const seed = ctx.getState().tasks.length;
    const task = createTask(title, deadline, seed);
    if (!task) {
      el.taskError.textContent = "A gentle nudge: your task needs a name.";
      return;
    }
    commit((st) => {
      st.tasks = [...st.tasks, task];
      return st;
    });
    el.taskTitle.value = "";
    el.taskDeadline.value = "";
    showToast(`A new ghost named ${GHOST_NAMES[task.ghostVariant]} appears at the tree line.`);
  });

  el.overwhelmedBtn.addEventListener("click", () => {
    const s = ctx.getState();
    if (isSheltered(s.shelter, Date.now())) {
      // already sheltered — just surface the overlay
      renderShelter();
      return;
    }
    commit((st) => {
      st.shelter = enterShelter(Date.now());
      return st;
    });
  });

  el.timerStart.addEventListener("click", () => {
    commit((st) => {
      if (st.timer && st.timer.paused) {
        st.timer = resumeTimer(st.timer);
      } else if (!st.timer) {
        st.timer = startTimer(el.timerTask.value || null);
      }
      return st;
    });
  });

  el.timerPause.addEventListener("click", () => {
    commit((st) => {
      if (st.timer) st.timer = pauseTimer(st.timer);
      return st;
    });
  });

  el.timerReset.addEventListener("click", () => {
    commit((st) => {
      st.timer = resetTimer();
      return st;
    });
  });

  // ---------- public render ----------
  function renderAll() {
    renderScene();
    renderTasks();
    renderTimer();
    renderShelter();
  }

  function onTimerComplete() {
    const s = ctx.getState();
    const snap = s.timer;
    const task = snap && snap.taskId ? s.tasks.find((t) => t.id === snap.taskId) : null;
    commit((st) => {
      st.timer = resetTimer();
      return st;
    });
    if (task) {
      const openMs = task.milestones.find((m) => !m.done);
      if (openMs) {
        showToast(
          `Focus session done — lovely work on ${task.title}. Mark “${openMs.text}”?`,
          "Mark done",
          () => {
            commit((st) => {
              st.tasks = toggleMilestone(st.tasks, task.id, openMs.id);
              return st;
            });
            pushBackPulse();
          },
          9000
        );
        return;
      }
    }
    showToast("Focus session done. Proud of you — take a breath. 🌙", null, null, 7000);
  }

  return { renderAll, renderTimer, renderScene, onTimerComplete };
}
