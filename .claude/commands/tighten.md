# /tighten — Code Quality & Concision Review

You are performing a focused code quality review. Your job is to make the code
**smaller, clearer, and less fragile** — not to add features, improve coverage,
or enforce style for its own sake.

## Scope

$ARGUMENTS

If no arguments are given, review the files most recently changed (use `git diff
--name-only HEAD` to find them). If a specific file or area is named, limit your
review strictly to that.

---

## What to look for

Work through the target code and flag only issues in these categories:

### 1. Dead weight
- Variables declared but never read
- Branches/conditions that can never be reached
- Early-return opportunities that eliminate nesting
- State that is derived and could be computed inline instead of stored

### 2. Duplication
- Logic copy-pasted across two or more places that belongs in one helper
- Only extract when the helper would be genuinely reusable (used in 2+ places
  or clearly self-contained). Three similar lines are fine; identical blocks
  are not.

### 3. Over-complexity
- Functions longer than ~40 lines of logic — split only along natural seams
- Abstractions that exist for a single call site
- Error handling for states that cannot occur
- Unnecessary intermediate variables that add lines without adding clarity

### 4. Verbosity
- Long conditions that can be collapsed with `??`, `?.`, or `||`
- `if/else` that can be a ternary (only when both branches are short)
- Imperative loops that map cleanly to `.map()`, `.filter()`, `.reduce()`
- Comments that restate what the code already says

---

## Project conventions (apply these)

- `const`/`let` only — never `var`
- Arrow functions for callbacks and short utilities
- React: functional components + hooks only; keep derived state computed inline
- CSS: vanilla, kebab-case classes, CSS variables for all design tokens
- Backend (`api/tutor.js`): thin proxy — one endpoint, one responsibility
- Security invariants (rate limiting, input sanitization, prompt-type allowlist,
  no client-side API keys) must never be weakened, even slightly

---

## How to respond

1. **List issues found**, grouped by category above. For each issue give:
   - File and approximate line range
   - One sentence describing the problem
   - The fix (show the before/after diff inline if short, describe it if long)

2. **Apply all fixes** that are unambiguously safe (dead code, obvious
   simplifications, pure reformulations). For anything that changes observable
   behavior, state the tradeoff and ask before changing.

3. **Do not touch** code outside the identified issues. Do not reformat
   unrelated lines, rename variables for style, or add comments to code you
   didn't change.

4. After applying fixes, **summarize** in one short paragraph: what was removed,
   what was simplified, and the net line-count delta. If nothing needed changing,
   say so plainly.
