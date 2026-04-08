# Quiz Web App

## Build & Run
- Open: `open index.html` in browser (no server needed)
- Format: `npx prettier --write .`
- Format check: `npx prettier --check .`

## Architecture
- index.html — single page entry, all UI structure
- style.css — all styles, responsive layout
- app.js — quiz logic, timer, scoring, UI updates
- questions.js — quiz data array (separate from logic)

## Config
All game settings live in a `CONFIG` object at the top of app.js:
- `TIMER_SECONDS` — countdown per question (default 15)
- `STREAK_2X` — correct answers needed for 2x bonus (default 3)
- `STREAK_3X` — correct answers needed for 3x bonus (default 5)
- `POINTS_PER_QUESTION` — base points (default 10)

## Coding Conventions
- Vanilla HTML, CSS, JS only — no frameworks, no libraries
- Single quotes, no semicolons (Prettier)
- Use `textContent` for DOM text — never `innerHTML` with dynamic data
- Use `const` by default, `let` when reassignment needed, never `var`
- Functions should be small and single-purpose
- Event listeners attached in an `init()` function

## NEVER
- Do NOT use `innerHTML` with any user or dynamic data (XSS risk)
- Do NOT use `eval()` or `Function()` constructor
- Do NOT add external CDN scripts or libraries without asking
- Do NOT expose error stack traces in the UI
- Do NOT store personal data in localStorage (scores only)
- Do NOT use `var` — use `const` or `let`

## Git Workflow (Feature Branch Strategy)

Every new feature MUST follow this branching workflow. No exceptions.

### 1. Create Feature Branch
- Always branch off from `master`: `git checkout -b feature/<feature-name> master`
- Use descriptive branch names: `feature/dark-mode`, `feature/leaderboard`, `feature/sound-effects`
- Never commit directly to `master`

### 2. Develop on Feature Branch
- All code changes happen on the feature branch only
- Commit frequently with clear messages describing the "why"
- Run `npx prettier --write .` before each commit

### 3. Test Before Merge
- After development is done, use a **subagent** to run all tests and verification:
  - Open index.html — full quiz flow works with no console errors
  - `npx prettier --check .` — passes clean
  - Responsive layout works on mobile (375px) and desktop (1440px)
  - Feature-specific checks relevant to the change
- If tests fail, fix on the feature branch and re-test
- Do NOT proceed to merge until all tests pass

### 4. Review & Merge to Master
- Use a **review subagent** to do a final check before merging:
  - Code quality: no `var`, no `innerHTML` with dynamic data, follows coding conventions
  - No regressions: existing features still work correctly
  - File structure: no unnecessary files added
- Once review passes, merge to master: `git checkout master && git merge feature/<feature-name>`
- Delete the feature branch after successful merge: `git branch -d feature/<feature-name>`

### Branch Rules Summary
- `master` = stable, always working
- `feature/*` = active development, one branch per feature
- Never skip the test + review step before merging
- One feature per branch — do not mix unrelated changes

## Verification
1. Open index.html in browser — full quiz flow works with no console errors
2. `npx prettier --check .` — passes clean
3. Responsive layout works on mobile (375px) and desktop (1440px)
