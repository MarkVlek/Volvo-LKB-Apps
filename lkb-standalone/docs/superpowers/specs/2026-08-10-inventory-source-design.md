# Volvo LKB — Inventory Source Resolution & Selekt Detection

**Date:** 2026-08-10
**App:** `lkb-standalone/` (Angular 16), shipped as `lkb-standalone-template/` v1.6.0

Two changes to how the vehicle list is built: which dealer's stock is loaded, and which of those
vehicles count as Volvo Selekt.

---

## 1. Inventory source resolution

### Before

`getAllCars()` split the configured branch names on commas and fired **one HTTP request per
branch**, each capped at `hits=700`. The configured `DealerId` was never used for anything — it
travelled from the player through four layers into an insurance request body that is built and
discarded.

### The API, as measured

Probed live against `https://api.wayke.se/search/vehicles`:

| Parameter | Filters by | Verified |
| --- | --- | --- |
| `branch` | showroom **name** | Bergahuset → 77 |
| `branchId` | showroom **ID** | same ID → 77, identical set |
| `parentId` | dealer **organisation** ID | Bildeve ORG → 111 = Bergahuset 77 + Landskrona 34 |

Three properties that shape the design:

- **A parameter can be repeated**, and the results union: `branch=A&branch=B` → 111, exactly the
  two separate calls combined. `A,B` in a single value returns **0** — commas are not a delimiter.
- **Filters combine with AND.** `branchId=X&parentId=Y` returns 0. Sources cannot be mixed.
- **`hits` is not capped at 700.** That was our own value. An organisation with 983 vehicles
  returns 700 at `hits=700` — silently, no error — and all 983 at `hits=1000`.
- **Unknown parameters are ignored, not rejected.** `dealerId`, `organizationId`, `seller` all
  return the full national inventory (7 610 vehicles) rather than an error. Only `parentId` works
  at organisation level.

### After

**One request**, with the parameter repeated per value, and `hits` raised to **2000**.

**Priority chain** — device (player) settings outrank the template's own, and an ID outranks a name
at each level:

| Priority | Source | Setting |
| --- | --- | --- |
| 1 | device | `DEALER_ID` |
| 2 | device | `BRANCH_NAMES` |
| 3 | template | `DealerId` |
| 4 | template | Branch Name |

### Why an ID source tries two parameters

A Wayke GUID may identify a showroom or an organisation, and **nothing in the value says which** —
`Volvo_Wayke_Dealer_IDs.json` stores both kinds under one column headed "Organization ID". Wrong
guess returns 0 vehicles and no error, i.e. a blank screen with no diagnostic.

So an ID source tries `branchId` first, then `parentId`. Verified against both known cases: a
showroom ID resolves on the first call (Bergahuset → 77), an organisation ID on the second
(Bildeve ORG → 111). The second request only happens for organisation IDs, only at startup.

### Empty results fall through

A source that yields no vehicles moves to the next source rather than leaving the screen blank, and
logs a `Health` event naming the source that came back empty. A typo'd ID degrades to the branch
names instead of emptying the kiosk.

### `DealerId` now defaults to empty

It previously shipped as `fab817e9…` (Bildeve ORG). Under the new chain a non-empty template
`DealerId` outranks template branch names, so keeping that default would have pointed **every**
site that relies on branch-name configuration at Bildeve's stock. The default is now `""`, making
the ID path opt-in. The dev stub in `lkb-standalone-template/index.html` was emptied for the same
reason — it shipped a Bildeve org ID alongside a 19-branch Bilia list, and the ID would have won.

### Accepted risk

The player's `DEALER_ID` sits at the top of the chain, and no production player value has been
verified as a Wayke GUID — the only known value is the Bildeve org ID in the mframe default and the
dev stub. If a real site returns something else (an internal dealer code, say), the ID probes both
return 0 and the chain falls through to `BRANCH_NAMES`. The fall-through is what makes this safe to
ship without that confirmation.

---

## 2. Selekt detection

### The bug

The Selekt category showed **one car** at Bilia Kungsbacka Volvo. `isSelekt` required:

```
hasManufacturerPackaging === true
  AND ( resellerPackagingOptions[].title contains "SELEKT"
        OR shortDescription contains "SELEKT" )
```

`resellerPackagingOptions` holds **optional marketing copy** the dealer attaches by hand — a promo
block titled "Volvo Selekt Inclusive" with a description and CTA link. Most dealers never attach
it, so the AND removed their entire Selekt stock.

Measured across all Volvo Car branches: 571 vehicles carry the certified flag, 298 passed the
condition — **273 hidden**. Per branch:

| Branch | Shown before | Actually Selekt |
| --- | --- | --- |
| Bilia Kungsbacka Volvo | 1 | 10 |
| Volvo Car Sörred | 1 | 106 |
| Volvo Car Vallentuna | 2 | 24 |
| Bildeve AB - Bergahuset | 0 | 45 |
| Volvo Car Hisings Backa | 48 | 50 |

Hisings Backa does fill in the promo block, which is why the feature looked healthy wherever it had
been checked.

`shortDescription` containing "SELEKT" matched **0 vehicles anywhere** — that branch never fired.

### The fix

```ts
retCar.isSelekt = carData.hasManufacturerPackaging === true &&
  (carData.manufacturer || '').toUpperCase() === 'VOLVO'
```

`hasManufacturerPackaging` is the certified-programme flag, which for Volvo means Selekt. The
manufacturer guard is defensive: across 2 000 vehicles sampled nationally, **no non-Volvo vehicle
carries the flag**, but a Selekt badge on a BMW would be a visible error and the category filter
already requires Volvo.

### Note on earlier advice

A prior review said `isSelekt` "doesn't exist in the live Wayke data" and had to be mapped from
`hasManufacturerPackaging`. That mapping already existed — the defect was the extra AND condition,
not a missing mapping.

---

## Files touched

| File | Change |
| --- | --- |
| `src/app/services/lkb.service.ts` | source chain, single request, `hits=2000`, Selekt condition |
| `src/app/services/lkb.service.spec.ts` | **new** — 11 tests over both changes |
| `src/app/services/harmony-config.service.ts` | `DealerId` dev default emptied |
| `src/mframe.json` | `DealerId` label/tooltip rewritten, default emptied |
| `lkb-standalone-template/index.html` | dev stub `DEALER_ID` emptied |
| `lkb-standalone-template/package.json` | 1.5.0 → 1.6.0 |

The mframe **parameter and component names are unchanged** (`Fallback Settings` → `DealerId`), so
values already configured in Harmony survive. Renaming either would have reset them to the default.

## Deliberately not changed

- **`Alla bilar` category never matches its filter case.** `filterName` is `'Alla Volvo'` while
  `categoryFilter()` tests `case "ALLA BILAR"`, so it falls to `default: return true`. Masked today
  because the list is pre-filtered to Volvo upstream; only surfaces at `AllBrandsAvailable = true`.
  Left alone by decision — the intended behaviour is a product question.
- **`setWaitToCorrectCategory()` is dead code.** Never called from template or code, and its
  variables are unused. The category spinners work via `lkb-category-image`'s own `onWait`. No user
  impact.
- **The personnummer `console.log`** in `getWaykeInsurance()`. Still open.

## Verification

- **24/24 unit tests pass**, 11 of them new: single-request form, `hits=2000`, all four priority
  levels, branch→organisation probing, fall-through on empty, no-source case, and four Selekt cases.
- `ng build` green; shipped `main.js` byte-identical to the build after the two documented path
  fixes; `node --check` clean on all four bundles; 0 leftover `assets/images`, 0 hashed refs.
- API behaviour measured live rather than assumed — every number in this document came from a real
  request.
- End-to-end delivery on a real player is still unobserved.
