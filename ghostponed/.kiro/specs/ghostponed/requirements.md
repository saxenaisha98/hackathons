# Requirements — Ghostponed

## Overview

Ghostponed is a cozy, spooky procrastination app with a garden-defense feel. Users add
tasks with deadlines and break them into milestones. Each task has a ghost that drifts
toward the user's garden house as the deadline approaches. Completing milestones grows
defensive plants and pushes the ghost back. A focus timer and an "Overwhelmed today"
greenhouse shelter help users keep going when things pile up.

The tone is encouraging. Every consequence is recoverable — nothing is lost, punished,
or deleted behind the user's back.

## Glossary

- **Task**: a unit of work with a title and a deadline.
- **Milestone**: a small, checkable sub-step of a task.
- **Ghost**: the visual threat tied to a task. Its distance to the house is driven by
  deadline proximity and milestone progress.
- **House**: the garden home the ghosts approach. The thing being defended.
- **Plant**: a defensive garden plant that grows as milestones are completed and visually
  pushes the ghost back.
- **Focus timer**: a countdown session (default 25 min) the user runs to work on a task.
- **Greenhouse / Overwhelmed today**: a shelter state that pauses ghost advancement until
  tomorrow, with one allowed extension.

## Requirements

### R1 — Task management
**User story:** As a user, I want to add tasks with deadlines so that I can track what
needs doing.

**Acceptance criteria:**
1. WHEN the user submits a task with a title and a deadline THEN the system SHALL create
   the task and show it in the task list.
2. IF the title is empty THEN the system SHALL NOT create the task and SHALL show a gentle
   inline message.
3. WHEN the user marks a task complete THEN the system SHALL move it to a completed state
   and banish its ghost with a celebratory cue.
4. WHEN the user deletes a task THEN the system SHALL ask for confirmation and SHALL allow
   an undo for a short window (recoverable consequence).
5. The system SHALL persist tasks across page reloads.

### R2 — Milestones
**User story:** As a user, I want to break a task into small milestones so that progress
feels achievable.

**Acceptance criteria:**
1. WHEN the user adds a milestone to a task THEN the system SHALL display it under that task.
2. WHEN the user checks off a milestone THEN the system SHALL grow a defensive plant and
   push the task's ghost back by one step.
3. WHEN the user unchecks a milestone THEN the system SHALL reverse that step without data
   loss.
4. The system SHALL show per-task progress (completed vs. total milestones).

### R3 — Ghost advancement
**User story:** As a user, I want each ghost to approach as its deadline nears so that I
feel a gentle, visible pressure.

**Acceptance criteria:**
1. The system SHALL compute a ghost's distance to the house from (a) time remaining until
   the deadline and (b) milestone completion ratio.
2. WHEN the deadline gets closer with no progress THEN the ghost SHALL move toward the house.
3. WHEN milestones are completed THEN the ghost SHALL move away from the house.
4. IF a deadline passes with the task incomplete THEN the ghost SHALL reach the house but
   the state SHALL be recoverable: the user can still complete the task, reschedule the
   deadline, or shelter — nothing is deleted.
5. The ghost's position SHALL be clamped so it never leaves the visible scene.

### R4 — Focus timer
**User story:** As a user, I want a focus timer so that I can work in short, bounded sessions.

**Acceptance criteria:**
1. The system SHALL provide a timer with a default duration of 25 minutes and the ability
   to start, pause, and reset.
2. The user SHALL be able to associate a focus session with a specific task.
3. WHEN a focus session completes THEN the system SHALL show an encouraging message and
   SHALL offer to check off a milestone.
4. The timer SHALL keep accurate time even if the user switches away and returns.

### R5 — Overwhelmed today / Greenhouse
**User story:** As a user who feels overwhelmed, I want to shelter in a greenhouse until
tomorrow so that I get a safe pause without losing progress.

**Acceptance criteria:**
1. WHEN the user presses "Overwhelmed today" THEN the system SHALL enter a greenhouse
   shelter state that pauses all ghost advancement until the next calendar day.
2. WHILE sheltered the system SHALL present a calm greenhouse scene and reassurance.
3. The system SHALL allow exactly ONE extension of the shelter (a second day).
4. IF the user tries to extend a second time THEN the system SHALL decline gently and
   suggest a small next step instead.
5. BEFORE the user leaves the shelter THEN the system SHALL help them pick a smaller next
   step: it SHALL suggest the single easiest incomplete milestone (or offer to create one).
6. Shelter state SHALL persist across reloads and SHALL expire automatically when its day
   ends.

### R6 — Encouragement and recoverable consequences
**User story:** As a user, I want the app to feel kind so that procrastination guilt
doesn't make things worse.

**Acceptance criteria:**
1. The system SHALL use warm, non-punishing language throughout.
2. The system SHALL NOT permanently destroy user data without an undo path.
3. WHEN a deadline is missed THEN the system SHALL frame it as recoverable and offer
   concrete next actions (reschedule, shelter, smallest step).

### R7 — Original artwork
**User story:** As a user, I want a distinctive cozy-spooky look that is original.

**Acceptance criteria:**
1. All characters and artwork SHALL be original, authored as inline SVG/CSS within the app.
2. The system SHALL NOT use third-party copyrighted images or fonts that are not free to use.

### R8 — Small working web app
**Acceptance criteria:**
1. The app SHALL run in a modern browser with no build step and no backend.
2. The app SHALL persist state locally (localStorage).
3. The app SHALL be responsive enough to use on a laptop screen.
