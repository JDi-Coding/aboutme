# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

A Star Trek LCARS-themed personal portfolio/about-me static website built with **Angular 17+ Standalone Components**. The `ng build` output is a fully static site deployed to Netlify (PROD) and GitHub Pages (staging).

## Commands

```bash
npm start                        # Dev server at localhost:4200
npm run build                    # Production build → dist/aboutme/browser/
npm run build:staging            # Build for GitHub Pages (sets --base-href /aboutme/)
npx serve dist/aboutme/browser   # Preview production build locally
```

## Architecture

### Angular Structure (`src/app/`)

| Path | Role |
|------|------|
| `app.component.ts` | Root shell — LCARS grid layout, hosts SpaceCanvas, Header, Sidebar, router-outlet |
| `app.routes.ts` | Lazy-loaded routes: `/personnel`, `/missions`, `/stellar`, `/bridge`, `/comms` |
| `components/space-canvas/` | Wraps `#space-canvas`; `ngAfterViewInit` → `SpaceService.attachCanvas()` |
| `components/header/` | Stardate display (async pipe from `StardateService`) |
| `components/sidebar/` | Nav buttons with `routerLink`; calls `AudioService.playBeep()` on click |
| `pages/bridge/` | Sliders + Autopilot toggle, two-way bound to `SpaceService` |
| `services/space.service.ts` | All canvas simulation state (`BehaviorSubject<SpaceState>`), Star/Nebula/AutoPilot logic, `attachCanvas`/`detachCanvas` |
| `services/navigation.service.ts` | GSAP fade-in/out on Router events (`NavigationStart`/`NavigationEnd`) |
| `services/stardate.service.ts` | `interval(10000)` → TNG stardate `Observable<string>` |
| `services/audio.service.ts` | Web Audio API beep on navigation |

### CSS

- **`ressources/css/style.css`** — LCARS theme; CSS custom properties: `--lcars-gold`, `--lcars-blue`, `--lcars-red`, `--lcars-light-blue`, `--lcars-purple`; grid layout `250px 1fr` / `120px 1fr 40px`
- **`ressources/css/toggle.css`** — Autopilot toggle switch + `.status-on`/`.status-off` classes
- Both are referenced in `angular.json` `styles` array — **do not import them in component SCSS files**

### Canvas Persistence

`SpaceCanvasComponent` lives in `AppComponent` and is **never destroyed during navigation**. `SpaceService` holds the `requestAnimationFrame` loop. `BridgeComponent` reads/writes state via `SpaceService.updateState(partial)` and `resetState()`.

## Branching & Deployment

| Branch | Environment | Host |
|--------|-------------|------|
| `PROD` | Production | Netlify (auto-deploy via `netlify.toml`) |
| `staging` | Staging | GitHub Pages (use `build:staging` script) |
| feature branches | Local only | — |

Flow: feature → `staging` → `PROD`. Use the PR templates in `.github/PULL_REQUEST_TEMPLATE/` matching the merge type.

GitHub Pages requires a `404.html` copy of `index.html` in the deploy step for Angular Router to work on direct URL access.
