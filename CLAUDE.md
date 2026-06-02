# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

A Star Trek LCARS-themed personal portfolio/about-me static website. No build system — open `index.html` directly in a browser or serve with any static file server.

## Running Locally

```bash
# Any of these work:
open index.html
python3 -m http.server 8080
npx serve .
```

## Architecture

Single-page application with no framework or bundler:

- **`index.html`** — all markup and page structure; sections are toggled via `loadContent(id)` calls
- **`ressources/css/style.css`** — primary stylesheet; LCARS color palette uses CSS custom properties (`--lcars-gold`, `--lcars-blue`, etc.)
- **`ressources/js/main.js`** — Three.js warp/space background rendered on `#warp-canvas` and `#space-canvas`; also handles the Bridge controls (sliders for warp factor, density, etc.) and the autopilot toggle
- **`ressources/js/script.js`** — navigation logic (`loadContent`), stardate display, and any remaining UI interactions

External CDN dependencies: Three.js r128, GSAP 3.12.2, Font Awesome 6.4.0, Google Fonts (Antonio).

## Branching & Deployment

| Branch | Environment | Host |
|--------|-------------|------|
| `PROD` | Production | Netlify (auto-deploy) |
| `staging` | Staging | GitHub Pages |
| feature branches | Local only | — |

Flow: feature → `staging` → `PROD`. Use the PR templates in `.github/PULL_REQUEST_TEMPLATE/` matching the merge type (feature, fix, stage-merge, prod-merge).
