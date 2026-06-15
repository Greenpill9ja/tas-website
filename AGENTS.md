# TAS Hub — Codex Guide

Primary runtime contract for Codex in this repository. This repo is intentionally
lean: a single Next.js App Router site with a local-first validation loop and a
small planning surface.

## Repo Map

- `src/app` — App Router entrypoints and global layout
- `src/components/sections` — Homepage sections and most site-facing content
- `src/components` — Shared UI behavior such as scroll and cursor effects
- `public` — Static assets referenced by the site
- `.codex` — Codex config, environment actions, and role definitions
- `.plans` — Lightweight feature specs, context notes, and audits

## Global Invariants

- Use `bun` for all repo operations. Do not introduce npm, pnpm, or Yarn.
- Use Node `22.22.1`, pinned in `mise.toml` and `.nvmrc`.
- Preserve the single-site Next.js shape. Do not introduce monorepo machinery.
- Default to the smallest sensible change boundary.
- Keep public narrative and marketing copy stable unless the user explicitly asks
  for copy or content edits.
- When smoke tests need stable selectors, prefer section ids and `data-testid`
  hooks over text-dependent selectors.
- Do not add `CLAUDE.md`, `.claude/`, CI workflows, scheduled automations, or
  queue/lane systems unless the task explicitly asks for phase 2 expansion.

## Codex Workflow

1. Read `AGENTS.md` before making changes.
2. Check for an active feature spec in `.plans/features/<feature-slug>/`.
3. Keep changes inside the smallest surface that satisfies the task.
4. Run the lightest validation tier that still proves the change.
5. Escalate to browser smoke verification when navigation, rendering, or CTA
   behavior changes.

## Planning OS

- Active feature work lives in `.plans/features/<feature-slug>/`.
- Each feature folder contains:
  - `spec.md` — execution-ready plan
  - `context.md` — current state, constraints, and relevant notes
- Point-in-time audits live in `.plans/audits/YYYY-MM-DD-<slug>.md`.
- This repo does not use queue scripts, lane files, handoff branches, or
  tool-specific ownership files in phase 1.

## Validation Ladder

- Quick repo verification: `bun run validate:quick`
- Static gate: `bun run check`
- Browser smoke: `bun run test:smoke`
- Full local release gate: `bun run validate:smoke`

## Agentic Modern Web Standard

- Baseline target: Baseline Widely Available. Before frontend, UI, CSS, accessibility, browser proof, motion, 3D, or web-design changes, use Modern Web Guidance search/retrieve and then apply this repo's lean Next.js constraints.
- Prefer semantic HTML, native controls, platform CSS, and browser primitives before custom JavaScript. Keep landmarks, headings, links, buttons, forms, accessible names, focus states, touch targets, loading/error/empty states, and reduced-motion behavior clear in the rendered DOM and accessibility tree.
- Run `bun run agentic:check` for the design-token guard plus quick lane. Treat `bun run agentic:browser-proof` as CI/clean-room proof only.
- The browser-proof lane writes screenshots, ARIA snapshots, `/llms.txt` status, console/page error status, reduced-motion status, and WebMCP discovery JSON to `output/playwright/agentic-browser-proof/`.
- Local agentic browser QA must use the authenticated Brave QA profile. Codex: use the Codex browser-extension path and claim the already-open Brave tab/window. Claude Code: use the Claude Code Chrome/Chromium extension path (`claude --chrome` or `/chrome`) and select the authenticated Brave profile/tab when it is installed, connected, and able to control the already-open Brave window. Do not fall back merely because the extension is branded Chrome. If the Brave extension path is unavailable or not connected, use Claude computer-use/visible desktop control of the already-open Brave window; if neither can reach authenticated Brave, report QA as blocked. Use this for admin, PWA, extension, wallet/passkey, staging-session, installed-app, and profile-dependent verification.
- Do not use isolated Browser, Playwright, or DevTools MCP profiles for local QA. Existing isolated browser-proof commands are CI/clean-room checks only and must not be reported as authenticated verification. If authenticated Brave access is blocked, stop and report QA as blocked.
- WebMCP is strategy-only in v1. Do not ship runtime WebMCP tools unless explicitly requested; future tools must follow `docs/agentic-webmcp-strategy.md`, stay visible/user-confirmable/public-safe, and must not expose private leads, database credentials, hidden admin actions, destructive operations, or background-only actions.

## Design System Guardrails

- Load `DESIGN.md`, `src/app/globals.css`, and the touched section/component before UI/CSS work.
- Run `bun run check:design-tokens` for UI/CSS changes; it blocks new raw colors, arbitrary Tailwind styling, viewport shortcuts, and motion/canvas risks unless they are intentionally recorded in `scripts/data/design-token-baseline.tsv`.
- Preserve the current TAS visual direction: bright solar palette, local-builder narrative, and public marketing clarity. Do not introduce a generic SaaS dashboard language.

## Scope Discipline

- When the user asks to plan, audit, review, or explain, stay read-only unless
  they explicitly ask for implementation.
- For destructive or wide-reaching changes, list the intended surface first and
  avoid silent scope creep.
- Never claim a change is done without running the validation that matches the
  change surface.

## Supply-chain and agent safety

- Do not install or upgrade npm, Python, or package-manager dependencies unless the user explicitly approves that install in the current task.
- Prefer existing repo tooling, checked-in lockfiles, and standard library options over adding new packages.
- Treat `package.json`, lockfiles, package-manager config, `.github/workflows/**`, `AGENTS.md`, `CLAUDE.md`, `.codex/**`, and `.claude/**` as security-sensitive surfaces. Call out any changes to them in final summaries.
- Keep dependency installs on the checked-in lockfile path and preserve the repo's release-age gate configuration.
