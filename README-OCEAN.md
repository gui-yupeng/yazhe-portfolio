# Yazhe Gao — Ocean Portfolio

A bilingual static portfolio with seven projects, original covers, descriptions and videos. Run `node serve.cjs` and visit http://127.0.0.1:4173. No build or package installation is needed.

## Current design

- Dark crimson water with simulated waves, mouse ripples and reflections. The beach has a neutral-grey water-facing edge fading into black sand inland. The contact section darkens the ocean further.
- Four populated categories: 2D Works, 3D Animation, AIGC Film and Narrative Film. The approved Poster category stays hidden until it has work.
- Four metallic category coins drift from bottom-right to top-left, with animal reliefs, inscriptions, machined edges and a soft white halo. Halos remain behind the rotating coins. Hover flips a coin; left/right keys and buttons browse categories. Vertical scrolling continues the page.
- A leather-bound 3D film shelf uses the actual project covers. Click a spine to bring its cover forward, then open the film. Horizontal dragging, arrows and keyboard navigation are supported.
- The identity badge uses ivory snakeskin texture. The video dialog has a warm ivory surround. The language switch updates both interface and project text.

## Ocean and performance

The active ocean keeps ordinary fish and rays while scrolling. Jellyfish, anemones, starfish and turtles are removed or disabled; dolphins are excluded from scheduled encounters. Separate experimental deep-ocean renderers are not loaded.

Startup requests 56 resident fish (40 silver, 10 reef, 6 clown), with a hard resident limit of 64. Migration events add at most 40 fish, or fewer under lower performance budgets, and cannot restart while already active.

Rendering uses bounded pixel counts and 30/45/60 FPS targets. The coin scene initializes near the viewport and pauses offscreen. Hidden tabs and open video dialogs pause the relevant animation loops. These are resource budgets, not measured hardware FPS guarantees. Reduced-motion preferences stop automatic coin movement.

## Publishing

This is a static site suitable for GitHub Pages. With a repository named `VerityGao.github.io`, select **Settings → Pages → Deploy from a branch → main → / (root)** after uploading. Keep `.nojekyll` at the repository root.

Local undo snapshots and downloaded design references are excluded from version control. Original historical site files remain in the repository history.

## Credits

The ocean is adapted from Rice-dog/code-codex v0.6.57 under MIT. See [ocean/ATTRIBUTION.md](ocean/ATTRIBUTION.md), [LICENSE-CodeCodex](ocean/LICENSE-CodeCodex) and [LICENSE-Three](ocean/LICENSE-Three).

Coin geometry, interaction and engraving motifs are implemented locally; no paid React Bits Pro component source is included. Photo-reference credits are in `assets/coin-engraving/SOURCES.md` and `assets/coin-metal-reference/SOURCES.md`.
