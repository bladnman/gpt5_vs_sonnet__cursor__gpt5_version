* # The Shows — Product Requirements Document (PRD)

  *Last updated: Aug 10, 2025*

  ## 1) Summary

  A Next.js web app that helps people **discover, track, and rate shows** — where **“shows” = TV + Movies**. Data comes from **TMDB** for search/discovery/metadata; user-specific state (watchlist, history, ratings, interest) is stored in our database. The product ships opinionated structure, centralized theming, and tests for core flows.

  This PRD must be implemented **in compliance with the “Always Rules — Structure, Naming, and Theming” document** (provided separately). That document defines mandatory file/folder structure, naming conventions, and theming rules.

  ## 2) Goals & Non‑Goals

  **Goals**

  - Make it effortless to **find** (search, new, popular, trending) and **organize** shows.
  - Let users **collect** (watchlist), **complete** (watched), and **rate** shows.
  - Show both **personal rating** and **TMDB community rating**.
  - Provide a **clean, extensible** codebase with centralized **theme tokens**, typed services, and caching.
  - Ensure all structure, naming, and theming follows the **Always Rules** document.

  **Non‑Goals (MVP)**

  - Social graph, comments, or multi-user sharing.
  - Full authentication beyond simple sessions (OAuth is a phase‑2).
  - Deep LLM recommendations (phase‑2).

  ## 3) Users & Use Cases

  - Solo viewer curating a backlog and logging what they’ve watched.
  - Explorer browsing what’s new/trending, filtering by genre or mood.
  - Rater who wants a quick, consistent way to rate and sort favorites.

  ## 4) Scope (MVP)

  - Search & discovery (new, popular, trending, genre/year/media filters).
  - Collections (watchlist, history, ratings).
  - Show details (metadata, actions, ratings).
  - Caching TMDB responses; persisting user data.
  - Testing core flows.

  ## 5) Functional Requirements

  - Render lists for new, popular, trending (TV + Movies).
  - Search TMDB (combined + media filters).
  - Add/remove watchlist, mark watched, rate shows.
  - Display both personal and TMDB ratings.
  - Cache TMDB data with TTLs per endpoint.
  - Log cache hits/misses and API errors.

  ## 6) Data Model

  Minimal denormalized show fields stored locally; rich metadata fetched from TMDB and cached.

  ## 7) Performance Targets

  - LCP < 2.5s on 4G.
  - API p95 < 400ms; cached p95 < 150ms.
  - Search-to-watchlist add < 10s p95.

  ## 8) Architecture

  - Next.js (App Router), TypeScript, RSC + Server Actions.
  - Prisma + Postgres (SQLite for dev), Redis cache.
  - Tailwind + shadcn/ui; design tokens from `/theme/tokens.ts`.
  - Follow **Always Rules** for file/folder structure, naming, and theming.

  ## 9) Theming & Design System

  - Centralized design tokens for colors, spacing, typography, breakpoints.
  - No hard-coded values in components.
  - Accessibility per WCAG AA.
  - **Always Rules** governs:
    - Folder & file naming
    - Page & feature structure
    - Spacing/typography rules
    - Accessibility practices

  ## 10) Constraints & Dependencies

  - Must be **Next.js** (App Router) + TypeScript.
  - Must comply with *Always Rules — Structure, Naming, and Theming*.
  - External deps: TMDB, Prisma, shadcn/ui, Tailwind, Redis optional.

  ## 11) Definition of Done (MVP)

  - All functional requirements met.
  - E2E tests for core flows.
  - Perf & a11y targets met.
  - No hard-coded style values.
  - README + setup/run instructions.
  - Structure, naming, and theming fully match **Always Rules**.
