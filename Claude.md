# Claude.md — RSM Math Quest Development Guidelines

## Session Start

**Before writing any code**, sync with `main` to ensure you're working from the latest codebase:

```bash
git fetch origin
git rebase origin/main
```

If your branch doesn't exist yet, create it from the updated `main`:

```bash
git checkout -b claude/<descriptive-name>-<sessionId>
```

This prevents stale-branch issues when multiple sessions run in parallel or when PRs have been merged since your branch was created.

**Multi-chat workflow:** Run one chat per logical task. Finish the task → commit → push → open PR → user merges → then open the next chat. Do not run parallel chats that touch the same files.

---

## Session Workflow

Every Claude Code session that produces code changes **must** end by:

1. **Committing** all changes with a clear, descriptive commit message.
2. **Pushing** to the working branch.
3. **Creating a pull request** against `main`. If a PR already exists for the branch, skip this step.
   - Use `gh pr create` when available. If `gh` is not authenticated, use the GitHub API or provide the user with the direct PR creation link.
   - PR title: short summary of what the session accomplished (under 70 chars).
   - PR body: use the `## Summary` / `## Test plan` format shown below.
   - Always include the session link at the bottom of the PR body.

```bash
# Preferred: gh CLI
gh pr create --title "Short title" --body "$(cat <<'EOF'
## Summary
- Bullet points describing changes

## Test plan
- [ ] Steps to verify the changes

<session-link>
EOF
)"

# Fallback: provide the user with the direct link
# https://github.com/<owner>/<repo>/compare/main...<branch>?expand=1
```

This applies to every session — no exceptions. Do not wait for the user to ask.

---

## Project Overview

RSM Math Quest is an AI-powered math tutoring web app for elementary/middle school students, built on the Russian School of Mathematics (RSM) pedagogical philosophy: Socratic, concept-first, guided discovery. It runs as a single-page React app with a Vercel serverless backend that proxies to the Groq AI API.

**Target users:** Students (ages 8–14) and their non-technical parents.

### Architecture

```
index.html          — Entire frontend: CSS + React 18 SPA (CDN, Babel Standalone)
api/tutor.js        — Vercel serverless function: rate limiting, prompt construction, Groq API proxy
vercel.json         — Deployment config and security headers
```

There is no build step. Babel transpiles JSX in the browser. React is loaded from CDN.

---

## Commands

```bash
# Local development
npx vercel dev            # Start local dev server (requires GROQ_API_KEY in .env)

# Production deploy
npx vercel --prod         # Deploy to Vercel

# No test or lint commands exist yet — see "Evolving the Codebase" below
```

---

## Code Style & Conventions

### JavaScript

- **ES2020+**: Use `const`/`let` (never `var`), arrow functions, template literals, optional chaining (`?.`), nullish coalescing (`??`), `async`/`await`.
- **Naming**: `camelCase` for variables and functions, `PascalCase` for React components, `SCREAMING_SNAKE_CASE` for top-level constants.
- **Functions**: Prefer pure functions. Keep functions short and single-purpose. Extract helpers when a function exceeds ~40 lines of logic.
- **No TypeScript** currently — plain JS throughout. If TypeScript is introduced, adopt it incrementally starting with the backend.

### React

- Functional components and hooks only. No class components.
- Hooks used: `useState`, `useEffect`, `useRef`. Follow the [Rules of Hooks](https://react.dev/reference/rules/rules-of-hooks).
- Prefer controlled components for form inputs.
- Keep derived state computed inline (e.g., `level = Math.floor(xp / 100) + 1`) rather than syncing with extra `useState`.

### CSS

- Vanilla CSS with custom properties defined on `:root`.
- Class naming: lowercase kebab-case (`.problem-card`, `.btn-primary`).
- No CSS preprocessor or CSS-in-JS. Keep styles in `index.html` within `<style>` tags.
- Use CSS variables for all colors, spacing, and font sizes to support future theming.

### Comments

- Don't add comments that restate what the code does. Comment *why*, not *what*.
- Backend (`api/tutor.js`) uses section-divider comments — maintain that convention.
- No JSDoc on every function. Add doc comments only for non-obvious interfaces or complex algorithms.

---

## Architecture Principles

### Current Constraints (Respect These)

1. **Single-file frontend**: The entire app lives in `index.html`. This is intentional for simplicity and zero-build deployment. Do not introduce a bundler, module system, or multi-file frontend unless explicitly requested.
2. **No persistence**: State lives in React `useState` and resets on refresh. There is no database, localStorage, or session storage. If persistence is added, treat it as a deliberate architectural change, not a casual addition.
3. **No real authentication**: "Login" is profile selection, not auth. Do not add password fields or auth flows without explicit request.
4. **CDN dependencies**: React 18 and Babel Standalone load from unpkg. Do not add npm frontend dependencies that require a build step.

### Design Priorities (In Order)

1. **Safety**: This is a children's app. Never expose API keys client-side. Sanitize all user input. Defend against prompt injection. Maintain all existing security headers.
2. **Pedagogical correctness**: The Socratic method is core — the AI must never give answers directly. Discovery-gated lesson progression must not be bypassed. All math content must be accurate.
3. **Simplicity**: Prefer the simplest solution. The target operator is a non-technical parent running `npx vercel dev`. Avoid tooling complexity.
4. **Reliability**: The fallback tutor (`getSocraticResponse`) must always work when the AI backend is down. Never remove fallback paths.

---

## Game System Guidelines

The app includes gamification to motivate students. When modifying or extending the game system, follow these rules:

### XP & Leveling

- XP is awarded per correct answer. Values range 5–25 based on difficulty.
- Level formula: `Math.floor(xp / 100) + 1`. Do not change this without updating all UI that displays level.
- XP should only be awarded for genuine correct answers — never for retries, hints, or chat interactions.

### Achievements / Badges

- Defined in the `ACHIEVEMENTS` constant. Each has: `id`, `name`, `description`, `icon`, `requirement` (object), `xpReward`.
- Badge-checking logic should run inside `checkAnswer()` after a correct answer. Currently partially implemented — complete it, don't duplicate it.
- New achievements must follow the pattern: define in `ACHIEVEMENTS`, check in `checkAnswer`, store in `user.badges`.

### Streaks

- `stats.streak` tracks consecutive-day engagement. Increment/reset logic should be based on calendar date, not session count.
- Display streaks prominently — they are a core motivator.

### Adding New Game Mechanics

When adding new game features (leaderboards, timed challenges, power-ups, etc.):

- Keep the core learning loop untouched. Gamification supports learning; it must never distract from it.
- New mechanics must not allow students to skip lesson gates or bypass the Socratic scaffolding.
- Test that XP/level/streak values remain consistent after the change.
- Any new state fields must be initialized in the user object creation flow (`selectUser` or profile creation).

---

## Lesson & Problem Authoring

### Lesson Structure

Each lesson in `LESSONS` follows 4 phases in order:

1. **warmup** — Activate prior knowledge, low difficulty.
2. **discovery** — Students discover patterns. Gated: must identify the pattern (AI-validated) before advancing.
3. **application** — Apply the discovered rule to new problems.
4. **exitTicket** — Assess understanding, slightly harder.

When adding new lessons:

- Follow the same 4-phase structure.
- Include `patternDescription` and `ruleToDiscover` for discovery phases — these feed the AI prompts.
- Problem objects need: `question`, `answer`, `hint`, `xp`, and `visualAid` (with `type` and config for the canvas renderer).

### Problem Objects

```js
{
  question: "What is 3x when x = 4?",
  answer: "12",
  hint: "Replace x with 4, then multiply.",
  xp: 10,
  visualAid: { type: "algebra", expression: "3x", xValue: 4 }
}
```

- `answer` is always a string. Comparison is case-insensitive trimmed equality.
- `visualAid.type` must be one of: `"algebra"`, `"geometry"`, `"fraction"` — matching the `drawVisualAid()` canvas renderer.

---

## AI / Backend Guidelines

### Prompt Engineering

- System prompts are constructed **server-side only** in `buildSystemPrompt()`. Never send system prompts from the client.
- Three prompt types exist: `pattern_recognition`, `articulation`, `tutoring`. New types must be added to the server-side allowlist.
- Prompts must include the anti-injection security note. Copy the pattern from existing prompts.
- AI responses are capped at 450 tokens. Keep responses concise — the audience is children.

**Key rules baked into the `tutoring` prompt — preserve these when editing:**

- **RESOLUTION RULE**: If the student gives a correct answer *and* any reasoning (even informal), the tutor must confirm with "✅ PROBLEM SOLVED!" and stop. Do not pile on more questions after a correct answer.
- **ANTI-LOOP RULE**: The tutor must never repeat the same question or strategy twice in a conversation. Each turn must try a new angle or escalate the scaffold level.
- **Scaffolding ladder**: Turns 1–2 orient conceptually, turns 3–4 get concrete, turns 5–6 rebuild from first principles, turns 7+ give a worked parallel example. Never skip levels or regress.

### Groq API

- Model: `llama-3.3-70b-versatile`. Change only if there's a clear reason (cost, quality, deprecation).
- The backend is a **thin proxy**. It should not grow into a general-purpose API server. One endpoint, one responsibility.
- Rate limit: 30 requests/minute/IP. In-memory storage resets per serverless instance — this is acceptable for the current scale.

### Fallback Tutor

- `getSocraticResponse()` in the frontend provides a 6-level scaffolding ladder when the AI is unavailable.
- This function must always work offline. It uses no external dependencies.
- When modifying tutoring logic, update both the AI prompt instructions and the fallback tutor to keep behavior consistent.

---

## Security Checklist

Before merging any change, verify:

- [ ] No API keys, secrets, or `.env` values in client-side code.
- [ ] All user input passed to the AI is sanitized (null bytes stripped, whitespace collapsed).
- [ ] The `promptType` allowlist in `api/tutor.js` has not been weakened.
- [ ] No new `eval()`, `innerHTML` assignments, or `dangerouslySetInnerHTML` usage.
- [ ] Security headers in `vercel.json` are intact.
- [ ] Rate limiting logic has not been bypassed or removed.
- [ ] Chat message validation (max length, max count, role allowlist) is intact.

---

## Evolving the Codebase

### Known Documentation Debt

- `SETUP-GUIDE.md` still references `HUGGINGFACE_API_KEY` — the backend was migrated to Groq. The correct variable is `GROQ_API_KEY`. Fix this when updating the setup guide.

### Recommended Next Steps (Not Urgent, Do When Asked)

These are known improvements. Do not implement proactively — only when explicitly requested:

1. **Persistence**: Add `localStorage` for user progress so data survives page refresh.
2. **Achievement system completion**: Wire up badge-checking in `checkAnswer()` and streak date tracking.
3. **Component extraction**: If `index.html` grows past ~2500 lines, consider splitting into multiple `<script>` tags or a lightweight module approach.
4. **Testing**: Add a minimal test suite for `api/tutor.js` (input validation, prompt construction, rate limiting) using a lightweight framework like `vitest`.
5. **Linting**: Add ESLint with a minimal config (`eslint:recommended` + `plugin:react/recommended`).

### When Refactoring

- Do not refactor code you weren't asked to change.
- Do not introduce abstractions for things used only once.
- Do not add error handling for impossible states.
- Three similar lines are better than a premature abstraction.
- If splitting a function, ensure the new pieces are each independently understandable.

### When Adding Features

- New state must be initialized in the user object. Check `selectUser` and profile creation.
- New views must be added to the `view` state routing (`renderLogin`, `renderHome`, etc.).
- New topics need entries in both `LESSONS` and `PROBLEMS`, plus a matching `visualAid` type in `drawVisualAid()`.
- Test with the fallback tutor (disconnect the API) to ensure the app remains functional offline.

---

## File Reference

| File | Lines | Purpose |
|---|---|---|
| `index.html` | ~2300 | Full frontend: CSS, React SPA, canvas rendering, fallback tutor |
| `api/tutor.js` | ~410 | Serverless backend: validation, rate limiting, prompt construction, Groq proxy |
| `vercel.json` | ~30 | Deployment config, security headers, function settings |
| `package.json` | ~15 | Minimal config: `"type": "module"`, dev/deploy scripts |
| `.gitignore` | ~30 | Standard ignores: node_modules, .env, .vercel, OS/editor files |
