# Volvo LKB — Standalone Harmony CMS Template

Leveransklara Bilar (stock vehicle inventory browser) extracted from the Volvo
VolvoEndlessAisle application and rewired for deployment as a Harmony CMS template.

---

## Project Structure

```
src/
├── app/
│   ├── animations/             darken-over-time animation (category tiles)
│   ├── components/
│   │   ├── lkb-filter-button/  Toggle filter button
│   │   ├── lkb-slider/         Dual-handle range slider
│   │   ├── number-pad/         On-screen number pad (insurance entry)
│   │   └── test-key/           Individual key component used by NumberPad
│   ├── enums/                  PageCard route path constants (LKB entries)
│   ├── modals/
│   │   └── change-interest-modal/  Admin modal to adjust finance interest rate
│   ├── modules/
│   │   └── material.module.ts  Angular Material imports
│   ├── pages/leveransklarabilar/
│   │   ├── lkb-categories/     Entry screen — three category tiles
│   │   ├── lkb-category-image/ Individual category tile with animation
│   │   ├── lkb/                List page shell (filter + result grid)
│   │   ├── lkb-filter/         Filter sidebar (accordion + range sliders)
│   │   ├── lkb-resultview/     Scrolling car card grid with infinite scroll
│   │   ├── lkb-car-card/       Individual vehicle card
│   │   ├── lkb-details/        Vehicle detail page with Swiper gallery
│   │   ├── lkb-swiper-view/    Image carousel component
│   │   ├── lkb-finace-box/     Finance calculator panel
│   │   ├── lkb-insurance/      Insurance quote drawer (Wayke)
│   │   ├── models/             TypeScript data models
│   │   └── pipes/              Dealer name, postal code, null-filter pipes
│   ├── services/
│   │   ├── lkb.service.ts          Inventory state + all API calls
│   │   └── harmony-config.service.ts  Reads params from window.Loader
│   ├── app-routing.module.ts   LKB routes only
│   ├── app.component.ts        Minimal root component (router-outlet)
│   └── app.module.ts           Full module declaration
├── assets/
│   ├── fonts/VolvoCentum/      Volvo brand fonts (copy from original project)
│   └── images/AppSpecific/LeveransKlaraBilar/  Category + fallback images
├── index.html
├── main.ts
├── mframe.json                 Harmony CMS template parameter definitions
└── styles.scss                 Global styles + CSS variables + font faces
```

---

## What Was Changed From the Original

| Original | Standalone replacement |
|---|---|
| `ConfigService` reading from `/api/config` | `HarmonyConfigService` reading from `window.Loader.getParams()` |
| `LkbService` calling `http://localhost:3000/api/volvoleveransklarabilar` | `LkbService` calling the URL configured in `InventoryApiUrl` Loader param |
| Insurance proxy via `/api/wayke/insurance` | Direct call to `ecom.wayke.se/insurance/inquiry` (token via Loader param) |
| Full app routing module (all 30+ routes) | LKB-only routing (categories → list → detail) |
| `NavigationService.backClicked` subscription in detail page | Removed (no app-level back navigation in standalone) |
| `NumberPadComponent` importing `Tile` from test-keyboard | `Tile` interface defined inline |

---

## Assets Required

The following files are **not included** in this repository (they are binary assets
from the original deployment). Copy them from the original project or request them
from Volvo:

```

src/assets/images/AppSpecific/LeveransKlaraBilar/
  lkb-missing-img.png   — Fallback image for vehicles without photos > lkb-missing-img-new.jpg used

```

---

## Harmony CMS Configuration (mframe.json)

The `mframe.json` exposes the following parameters to the Harmony CMS editor.
Configure these per player before deploying:

| Parameter | Description |
|---|---|
| `InventoryApiUrl` | Wayke/cloud endpoint returning `VolvoLeveransklarabilar[]` JSON |
| `DealerId` | Wayke branch ID for insurance calls |
| `LkbBranchName` | Branch name — hides location label on cards when set |
| `AllBrandsAvailable` | `true` to enable multi-brand filter |
| `InterestRate` | Fallback annual interest rate % for finance calculator |
| `WaykeApiToken` | Wayke API auth token (from Volvo) |

---

## Wayke Insurance Integration

The insurance panel is included and functional but will require the Wayke API
token before it can return results. Once the token is received from Volvo:

1. Set `WaykeApiToken` in the Harmony template parameters for each player.
2. Uncomment the `Authorization` header line in `lkb.service.ts → getWaykeInsurance()`.

---

## Local Development

```bash
npm install
npm start
```

The app will start at `http://localhost:4200/`.

In development mode, `HarmonyConfigService` falls back to these defaults
(window.Loader is not present locally):

- `InventoryApiUrl`: `http://localhost:3000/api/volvoleveransklarabilar`

To develop locally against a live API, either:
- Run a local mock server at port 3000, or
- Override `devDefaults()` in `harmony-config.service.ts` with your test endpoint.

---

## Production Build

```bash
npm run build:prod
```

Output is written to `www/`. Copy the contents into the Harmony template package.
