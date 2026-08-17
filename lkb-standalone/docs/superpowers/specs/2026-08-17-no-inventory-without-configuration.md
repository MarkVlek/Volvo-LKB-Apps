# Volvo LKB — No inventory until a dealership is configured

**Date:** 2026-08-17
**App:** `lkb-standalone/` (Angular 16), shipped as `lkb-standalone-template/`
**Supersedes:** the "Empty results fall through" and "Accepted risk" sections of
`2026-08-10-inventory-source-design.md`

## Why

Volvo raised a legal constraint: one dealership's inventory may not be shown on another
dealership's screen. Their request was that a screen show **no** cars until it is configured.

The app never asked Wayke for the national inventory — every request has always been filtered by
branch name or dealer ID. But two paths could still put the wrong dealer's cars on a screen:

1. **The shipped default.** `LkbBranchName` shipped as `Bildeve AB - Bergahuset`, so any player
   nobody had configured yet showed Bildeve's stock.
2. **The fall-through.** An inventory source that returned zero vehicles moved on to the next
   source, and the last source was that same template default. A mis-typed `DEALER_ID` therefore
   degraded into showing Bildeve's cars — with nothing on screen to say so.

A third, narrower path: if a player was present but its `Loader` threw synchronously, the catch
applied the dev defaults, which also name Bildeve.

## What changed

**One source, no widening.** `getAllCars()` uses the highest-priority setting that is filled in and
nothing else. The priority order is unchanged (device `DEALER_ID`, device `BRANCH_NAMES`, template
`DealerId`, template Branch Name). A configured source that returns zero vehicles now leaves the
screen empty.

The `branchId` → `parentId` probe stays, because both forms name the same dealer: a Wayke ID may
identify a showroom or an organisation and nothing in the value says which.

**Empty template default.** `LkbBranchName` now ships as `""`, and its tooltip states that an empty
value means no vehicles. `DealerId` was already `""`.

**A failed Loader configures nothing.** When a player is present but its `Loader` throws, the
service now logs an error and leaves the parameters empty instead of applying the dev defaults. The
dev defaults are reachable only when there is no player at all, i.e. local `ng serve`.

**The empty state is now reachable.** `lkb.component.html` already carried a
`Tyvärr kunde inga bilar hämtas` panel, but `onCars` was hard-coded `true`, so it was dead markup
and an empty inventory rendered as a blank list. `LkbService.inventoryLoaded$` now reports when the
startup load has finished, which lets the view distinguish "still loading" from "nothing to show".

## Decision: no fallback between a screen's own settings either

Considered allowing a device `DEALER_ID` that returns nothing to retry the device's own
`BRANCH_NAMES`. Both values belong to the same site, so it could not leak another dealer's stock,
and it would protect against a mis-typed ID.

Rejected, on Volvo's reasoning: several IDs can be configured on one screen and they may point at
different showrooms, so a zero result is not evidence that the IDs are wrong. Zero means either
genuinely no stock or a misconfiguration someone should fix — and a retry hides both.

The consequence, accepted knowingly: a screen whose `DEALER_ID` is not a Wayke ID now shows nothing
until the parameter is corrected in Harmony. No production `DEALER_ID` value has been verified as a
Wayke ID; under the previous design the fall-through masked that.

## Files touched

| File | Change |
| --- | --- |
| `src/app/services/lkb.service.ts` | `searchSources()`/`resolveSource()` → `searchSource()`; no fall-through; `inventoryLoaded$` |
| `src/app/services/harmony-config.service.ts` | dev defaults only when no player; failed Loader configures nothing |
| `src/app/pages/leveransklarabilar/lkb/lkb.component.ts` | wires the existing empty-state panel |
| `src/mframe.json` | `LkbBranchName` default emptied, tooltip rewritten |
| `tsconfig.json` | `allowSyntheticDefaultImports` — lets a test read the shipped mframe defaults |
| `src/app/services/lkb.service.spec.ts` | no-fall-through cases; guard on the shipped mframe defaults |
| `src/app/services/harmony-config.service.spec.ts` | **new** — where configuration may come from |
| `src/app/pages/leveransklarabilar/lkb/lkb.component.spec.ts` | **new** — the empty state |

Parameter and component names in mframe are unchanged, so values already configured in Harmony
survive.

## Verification

- **31/31 unit tests pass**, 7 new. Each was watched failing first: the shipped default still named
  Bildeve, both fall-through paths still fired, the Loader catch still applied the dev defaults, and
  the empty state rendered nothing.
- `npm run build:prod` green; `www/mframe.json` copied to the template. Both bundles contain the new
  Health string and no longer contain the `falling back` one.
  **Superseded later the same day** by the branch-name encoding fix
  (`2026-08-17-branch-name-double-encoding.md`); the shipped bundle is now
  `main.012a6579f43eeef1.js` and the suite is 34/34. That document also records the post-build image
  path fixes that this one originally omitted — the bundle first copied for this change had every
  image path broken.
- The build now warns that `src/mframe.json` "is part of the TypeScript compilation but it's
  unused" — a side effect of the spec importing it to guard the default. Same class as the four
  spec-file warnings the build already emitted; no effect on the bundle.
- Not observed on a real player.
- Template version left at 1.6.0 and no `mtemplate compile` run — both are Taras's release steps.
