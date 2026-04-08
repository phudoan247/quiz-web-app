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

Difficulty levels live in a `DIFFICULTY` object (easy/medium/hard), each with `seconds` and `label`. All other game settings live in a `CONFIG` object at the top of app.js:

- `TIMER_SECONDS` — countdown per question (default 15)
- `POINTS_PER_QUESTION` — base points (default 10)
- `STREAK_2X` — streak length for 2x multiplier (default 3)
- `STREAK_3X` — streak length for 3x multiplier (default 5)

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

## Git Workflow (Feature Branch + Pull Request Strategy)

Every new feature MUST follow this branching workflow. No exceptions.

### 1. Create Feature Branch

- Always branch off from `master`: `git checkout -b feature/<feature-name> master`
- Use descriptive branch names: `feature/dark-mode`, `feature/leaderboard`, `feature/sound-effects`
- Never commit directly to `master`

### 2. Develop on Feature Branch

- All code changes happen on the feature branch only
- Commit frequently with clear messages describing the "why"
- Run `npx prettier --write .` before each commit

### 3. Test (MUST pass before proceeding)

- After development is done, use a **test subagent** to run ALL verification:
  - Open index.html in browser — full quiz flow works with no console errors
  - `npx prettier --check .` — passes clean
  - Responsive layout works on mobile (375px) and desktop (1440px)
  - Feature-specific checks relevant to the change
- If tests fail, fix on the feature branch and re-test
- Do NOT proceed to step 4 until ALL tests pass

### 4. Push Feature Branch & Create Pull Request

- Push the feature branch to GitHub: `git push origin feature/<feature-name>`
- Create a Pull Request on GitHub: `feature/<feature-name>` → `master`
- PR title should be clear and descriptive
- PR body should summarize what changed and why

### 5. Review & Merge via PR

- Use a **review subagent** to do a final code review:
  - Code quality: no `var`, no `innerHTML` with dynamic data, follows coding conventions
  - No regressions: existing features still work correctly
  - File structure: no unnecessary files added
- If review finds issues → fix on feature branch, push again, re-run test subagent
- Once review passes → merge the PR on GitHub
- Delete the feature branch after successful merge: `git branch -d feature/<feature-name>`

### Branch Rules Summary

- `master` = stable, always working, never commit directly
- `feature/*` = active development, one branch per feature
- Always: test subagent FIRST → push to GitHub → create PR → review subagent → merge
- Never skip the test + review step before merging
- One feature per branch — do not mix unrelated changes
- All feature branches are preserved on GitHub for history tracking

## Verification

1. Open index.html in browser — full quiz flow works with no console errors
2. `npx prettier --check .` — passes clean
3. Responsive layout works on mobile (375px) and desktop (1440px)
