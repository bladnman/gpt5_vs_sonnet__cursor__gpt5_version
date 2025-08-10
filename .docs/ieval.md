# IEVAL — Model Comparison Framework (for “Shows” App)

## Goals

* Compare models as **pair-programming partners** and as **autonomous builders**.
* Judge both **working-with-it** (process) and **what-it-makes** (output).
* Keep it fair, repeatable, and audience-comprehensible.

## Evaluation Areas (6)

1. **Task Success & Reliability**

   * *What it measures:* can it complete the requested features without stalling or derailing?
   * **Metrics**

     * Feature pass rate (% of requested stories done to spec)
     * Time-to-first-working-build (mins from start to first local run)
     * Human intervention count (# of nudges, clarifications)
     * Rework/churn (diff size to fix its own mistakes)

2. **Code Quality & Structure**

   * *What it measures:* adherence to our “Always Rules” and sane architecture.
   * **Metrics**

     * Lint status (0 blockers, warnings count)
     * Folder & naming conformance score (checklist %)
     * Modularity (avg file length, function length; # of components per feature)
     * Docs/inline clarity (brief top-of-file or README deltas present? Y/N)

3. **Autonomy & Collaboration (Agentic Behavior)**

   * *What it measures:* stays on task, asks good questions, plans steps, fixes issues.
   * **Metrics**

     * On-task rate (subjective 1–5; did it wander?)
     * Clarifying-question quality (subjective 1–5; asked when appropriate)
     * Self-diagnosis/fix count (times it detected & fixed errors without prompting)
     * Step planning quality (presence of a short plan before coding; 1–5)

4. **Testing & Tooling**

   * *What it measures:* ability to produce meaningful tests and run them.
   * **Metrics**

     * Unit test presence (Y/N) and coverage roughness (lines or key modules covered)
     * UI tests for critical flows (search → add to list → rate) present (Y/N)
     * Local test run success (green on first run? Y/N; flake count)
     * Lint/test automation script quality (single “npm test” / “lint” works? Y/N)

5. **UX & Design Fidelity**

   * *What it measures:* can it ship a clean, usable UI that follows theme rules.
   * **Metrics**

     * Theme usage (no raw hex, tokens only; % conformance)
     * Layout fidelity (card grid + filter sidebar present and sensible; 1–5)
     * Interaction polish (empty states, errors, loading, basic animations; checklist %)
     * Accessibility basics (labels, contrast, keyboard nav basics; checklist %)

6. **Performance & Efficiency**

   * *What it measures:* reasonable front-end perf and back-end thrift.
   * **Metrics**

     * Lighthouse (or similar) quick pass: LCP/CLS “green?” (Y/N)
     * Bundle sanity (no egregious bloat; subjective 1–5)
     * TMDB cache hit ratio on repeat views (≥ X% target)
     * Rate-limit incidents (count), duplicate calls avoided (subjective 1–5)

## Scoring Rubric (per area)

* **Excellent (4):** Meets spec, minimal nudges, clean structure, tests pass, polished UX, strong perf.
* **Good (3):** Minor nudges or rough edges; overall solid and shippable.
* **Frustrating (2):** Frequent hand-holding, structural drift, flaky tests/UX gaps.
* **Bad (1):** Fails core tasks, messy code, unreliable, not demoable.

> **Overall Score** = average of the six area scores (1–4). Also show a **radar chart** of the six areas for quick on-screen comparison.

## Procedure (to keep runs comparable)

* **Fixed brief:** Use the same PRD prompt + “Always Rules.”
* **Same starter repo:** empty Next.js template with lint/test scripts wired (no code).
* **Same budget:** e.g., 60–90 minutes per run (or fixed number of model turns).
* **Same constraints:** online access allowed only for TMDB docs; no external libraries beyond your baseline list (declare it).
* **Evidence capture:** commit history, diffs, lint/test output, Lighthouse quick run, brief screen capture of UX.

## Reporting (what you show in the video)

* One table per model with the 6 area scores + key metrics (pass rate, interventions, cache hits, Lighthouse).
* Short commentary bullets: “Where it shined,” “Where it struggled,” “Who should use this.”

## Known Gaps / Out-of-Scope (call these out explicitly)

* **Deep security** (auth flows, secrets management) beyond basics.
* **Prod-scale reliability** (observability, multi-env deploys).
* **Complex data migrations** and long-running background jobs.
* **Advanced accessibility audits** (we’re doing lightweight checks).
* **True cost/performance under load** (we’re doing sanity checks, not load tests).
* **Subjectivity:** Design elegance and “developer vibe” are partially subjective; we pair them with concrete proxies (lint, coverage, Lighthouse, cache ratio) to reduce hand-wavy takes.

## Quick Instrumentation Tips

* Add npm scripts: `lint`, `test`, `test:ui`, `analyze`, `perf:lh`.
* Log TMDB fetches vs. cache returns with a simple counter.
* Keep a tiny “eval.json” per run storing: timestamps, intervention notes, metrics.
* For structure checks, use a small script to verify folders/names match the rules.

