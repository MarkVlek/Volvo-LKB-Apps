# Volvo LKB — Analytics Design

**Date:** 2026-08-05
**App:** `lkb-standalone/` (Angular 16 — the development app; `npm run build` → `www/`, then copied
into `lkb-standalone-template/` and compiled as a Harmony template)
**Reference implementation:** `C:\mood\mvision-templates\custom\volvo\explorer-navigation-menu-v2`
(`menu/js/analytics.js`, `ANALYTICS_EVENTS.md`, `menu/docs/superpowers/specs/2026-08-05-analytics-design.md`)

## Goal

Capture the full kiosk funnel for Leveransklara Bilar — from which category a visitor picks, through
how they filter and what that leaves them, to which car they open, how long they look at it, and
whether they get as far as a finance or insurance calculation — grouped into one analytics session
per visitor.

Today the app captures **nothing**: no session, no events, no call to any player analytics API.

## Scope

| App | Role | Change |
| --- | --- | --- |
| `lkb-standalone/` | Development app — the Angular source | **All analytics code lives here** |
| `lkb-standalone-template/` | Compiled template (`js/main.js`, `mframe.json`, zips) | Receives the rebuilt bundle + the updated `mframe.json` via the existing manual copy process |
| `VolvoTouchAngular/` | Legacy app LKB was extracted from | **Untouched.** Its `analytics.service.ts` targets Google Universal Analytics (`UA-120746515-1`), shut down by Google in 2023 — a different, dead system. Out of scope. |

## What the player gives us

Confirmed present in the bundled `src/assets/js/template-loader.js`:

| API | Behavior |
| --- | --- |
| `Loader.getNewAnalyticsSessionIdPromise()` | Always mints a **brand-new** id. There is no "get the current session id". |
| `Loader.createAnalyticsEvent(userTriggered, sessionId, customParameters)` | Fire-and-forget. |
| `Loader.isStarted()` | Resolves once the player runtime is live. |

`getNewAnalyticsSessionId()` (the synchronous 7.1.1 form) is **deprecated** per the API docs and is
not used.

## Decision: an Angular service, not an HTML interceptor

Rejected: intercepting taps from `index.html`. `main.js` is a minified production bundle, so a
DOM-level interceptor can see *that* something was tapped but not *what* — "user opened Volvo XC60
T8 Recharge, 2023, 459 000 kr, Selekt, Bergahuset" is unreachable from the DOM. Every event worth
having in this design depends on app state.

It also costs a manual step forever: an interceptor in `lkb-standalone-template/index.html` would
have to be re-applied or preserved by hand on every compile, alongside the slug-stripping and image
path fixes already in `instructions`. A service compiles into `main.js` and rides the existing
process with no new step.

## Session model — idle timeout, rotated lazily

The template runs for days without reloading and has **no screensaver or idle mechanism of its
own** (unlike the navigation-menu family, which had `ss-start:` / `ss-dismiss` to mark boundaries).
The player exposes no idle signal either. So the app owns its own idle timer.

- **Boot** → mint id, log `Session started`.
- **Any interaction** → reset the idle timer.
- **Idle timer expires** (default **180s**) → log `Session ended (idle)` and mark the session
  **closed**. The id is *not* rotated yet.
- **Next interaction after a closed session** → mint a new id, log `Session started` as its first
  event, then the interaction's own event.

**Why rotation is lazy.** Rotating at timeout would mint a fresh id for a kiosk that nobody is
standing at. Overnight that manufactures a long tail of sessions containing exactly one
`Session started` event and nothing else. Minting on the *next* touch means every session that
exists had a real visitor in it.

`Session started` is therefore always the first event of a session, and `Session ended (idle)`
always the last — the boot session and every rotated session look identical downstream.

**Interaction detection.** The service attaches `pointerdown`, `touchstart` and `keydown` listeners
to `document` **inside `NgZone.runOutsideAngular()`**. Without that, every touch on a 700-car list
would trigger a full Angular change-detection pass purely for analytics bookkeeping.

**Accepted limitation:** set the timeout to `0` and idle sessions are disabled entirely — one
session per boot. Offered as an escape hatch, not a recommendation.

## Configuration — one new mframe parameter

New component in `src/mframe.json`:

```json
{
  "name": "Analytics Settings",
  "params": [
    { "name": "SessionIdleTimeout", "type": "string", "value": "180" }
  ]
}
```

Label: *Session Idle Timeout (s)*. Tooltip: seconds of inactivity before the current analytics
session is closed; the next touch starts a new one; `0` disables idle sessions.

### It must be read defensively

`HarmonyConfigService.loadFromLoader()` resolves parameters through a local `p()` helper that
**throws** when a component or param is missing. That throw happens inside the
`getComponents().then(...)` callback, so it also skips `loader.ready()` — the template never signals
readiness.

`instructions` says to copy `mframe.json` across "if changes are made to it", which makes shipping a
new `main.js` against a stale `mframe.json` an easy and realistic mistake. So `SessionIdleTimeout`
is read in **its own try/catch with a 180 default**, never through the throwing path. A stale
mframe degrades to the default instead of bricking the template.

## `AnalyticsService` — the writer

`src/app/services/analytics.service.ts`, provided in `app.module.ts` alongside the existing
services. Mirrors the reference `window.Analytics` singleton, adapted to Angular DI:

- **Every player call wrapped in `try/catch`.** Analytics must never break the app.
- **Events queue until the session id lands, then flush in order.** The Pinch A Penny templates send
  their first event with `sessionId: ''`; here that would hit the first event of *every* session,
  which defeats per-visitor sessions.
- **3-second timeout on the mint.** With no player answering,
  `getNewAnalyticsSessionIdPromise()` neither resolves nor rejects — it hangs. Buffering alone would
  buffer forever in `ng serve` and in MVision preview. On timeout the session falls back to a
  timestamp-hex id.
- **A generation counter guards the id.** Each `openSession()` claims a generation; a late answer —
  or a previous session's 3s timeout firing during a new session — is discarded if its generation is
  stale. Without it, a stale timeout could overwrite a live session's real id with a fallback.
- **Every event is also `console.log`'d** as `[analytics] user|system | <type> | <details>`.
  On-device that is visible via **Debug Options → Show Console**; locally it prints straight to the
  browser console.

Public surface, kept deliberately small:

```ts
track(userTriggered: boolean, type: AnalyticsType, details: string): void
```

Plus `getId()` / `getLogs()` for debugging, matching the reference.

## Payload scheme

```
userTriggered:    boolean          true = direct user action, false = system/automatic
sessionId:        string           owned by AnalyticsService, one per visitor
customParameters: { type, details }
```

`type` is the grouping axis; `details` is human-readable. This is the same scheme as the
navigation-menu family and the Pinch A Penny catalog, **so LKB data aggregates alongside the other
Volvo templates**. Structured dimensions (a separate `car` or `price` parameter) were considered and
rejected for now on those grounds — the API accepts an arbitrary `<String, String>` dictionary, so
adding them later is a one-line change if the BI side wants them.

Newlines in `details` are flattened to spaces so every event stays on one line.

## The events

### Type vocabulary

`Session` · `Category` · `Filter` · `Vehicle` · `Gallery` · `Finance` · `Insurance` ·
`Navigation` · `Health`

### User actions — `userTriggered: true`

| `type` | `details` | Trigger | Source |
| --- | --- | --- | --- |
| `Category` | `User selected <category>` | Landing screen tile | `lkb-category-image.component.ts` |
| `Filter` | `User applied <filterType>: <value> (<n> cars)` | Filter chip on | `lkb-filter.component.ts` |
| `Filter` | `User removed <filterType>: <value> (<n> cars)` | Filter chip off | `lkb-filter.component.ts` |
| `Filter` | `User changed category to <name> (<n> cars)` | Category chip in the filter panel | `lkb-filter.component.ts` |
| `Filter` | `User set <slider> to <min>–<max> (<n> cars)` | Year / price / mileage slider, debounced | `lkb-filter.component.ts` |
| `Filter` | `User enabled all brands (<n> cars)` | "Alla märken" | `lkb-filter.component.ts` |
| `Filter` | `User <opened\|closed> the filter panel` | Sidebar toggle | `lkb-filter.component.ts` |
| `Vehicle` | `User opened <title> — <modelYear>, <price>, <milage> mil, <fuel>, <branch>` (` [Selekt]` appended when applicable) | Car card tap | `lkb-resultview.component.ts` |
| `Vehicle` | `User loaded more results (page <n>, <total> shown)` | Infinite scroll | `lkb-resultview.component.ts` |
| `Finance` | `User adjusted down payment to <x> — <monthly>/month for <title>` | Down-payment slider, debounced | `lkb-finace-box.component.ts` |
| `Finance` | `User adjusted period to <n> months — <monthly>/month for <title>` | Period slider, debounced | `lkb-finace-box.component.ts` |
| `Insurance` | `User opened the insurance calculator for <title>` | "Räkna på försäkring" | `lkb-details.component.ts` |
| `Insurance` | `User set driving distance to <miles> mil` | Distance slider, debounced | `lkb-insurance.component.ts` |
| `Insurance` | `User requested an insurance quote for <title>` | Search submit | `lkb-insurance.component.ts` |
| `Insurance` | `User selected add-on <name> (+<price>/month)` | Add-on chosen (not deselection) | `lkb-insurance.component.ts` |
| `Navigation` | `User went back from <page>` | Back button | `navigation.service.ts` |

### System / automatic — `userTriggered: false`

| `type` | `details` | Trigger | Source |
| --- | --- | --- | --- |
| `Session` | `Session started` | Boot, and first interaction after an idle close | `app.component.ts` / `analytics.service.ts` |
| `Session` | `Session ended (idle)` | Idle timer expiry; last event on the session | `analytics.service.ts` |
| `Filter` | `No cars match the filters` | Filtered result reaches 0 | `lkb-filter.component.ts` |
| `Vehicle` | `Viewed <title> for <n>s` | Leaving the detail page | `lkb-details.component.ts` |
| `Gallery` | `Browsed <n> of <total> images of <title>` | Leaving the detail page, when more than one image was seen | `lkb-swiper-view.component.ts` |
| `Insurance` | `Insurance quote returned <n> options` | Quote success | `lkb-insurance.component.ts` |
| `Insurance` | `Insurance quote failed` | Quote error | `lkb-insurance.component.ts` |
| `Health` | `Inventory loaded: <n> cars` | Startup fetch succeeds | `lkb.service.ts` |
| `Health` | `Inventory load failed` | Startup fetch errors | `lkb.service.ts` |
| `Health` | `Vehicle detail load failed for <id>` | Detail fetch errors | `lkb-details.component.ts` |
| `Health` | `Image failed to load for <title>` | Gallery image 404s | `lkb-swiper-view.component.ts` |

The resulting car count on every `Filter` event is what makes the funnel measurable: which filters
visitors reach for, and which combinations dead-end.

## Privacy — hard rule

The insurance flow collects a Swedish personnummer (`LkbInsuranceComponent.searchValue`, built up
via the number pad). **It never enters an analytics event**, nor does anything derived from it. Only
that a quote was requested, and how it turned out.

**Pre-existing issue, flagged not fixed:** `lkb.service.ts:279` runs `console.log(message)` inside
`getWaykeInsurance()`, printing the personnummer to the console. It predates this work, but matters
more now that operators are being told to enable **Show Console** to watch the analytics stream.
Left in place pending the user's decision; removal is one line.

## Anti-noise decisions

- **Sliders and finance inputs debounce ~600ms**, so a drag produces one event instead of forty.
  `lkb-finace-box` already routes its inputs through RxJS `Subject`s, so `debounceTime` drops in
  naturally.
- **Gallery browsing is summarised once per car** on leaving, not per swipe. The reference design
  made the same call when it rejected logging every `activity` ping.
- **Broken-image events are limited to the detail gallery.** `LkbCarCardComponent.errorImg()` fires
  per card across a list that can hold 700 vehicles; that would swamp the stream.
- **`setStartingCategory()` is not logged.** It replays the choice already captured by the
  `Category` event on the landing screen — logging it would double-count every session.

## Deliberately not captured

- **Individual swipes, scrolls and slider drags.** Explicitly declined in favour of debounced and
  summarised equivalents.
- **Add-on *de*selection.** Selection is the intent signal; churn is noise.
- **The personnummer, or its length, format or validity.** See above.
- **Anything from `VolvoTouchAngular`.** Different app, different (dead) analytics system.

## Files touched

| File | Change |
| --- | --- |
| `src/app/services/analytics.service.ts` | **new** — session owner, idle timer, sole `createAnalyticsEvent` caller |
| `src/app/services/analytics.service.spec.ts` | **new** — session state machine tests |
| `src/mframe.json` | new `Analytics Settings` → `SessionIdleTimeout` |
| `src/app/services/harmony-config.service.ts` | defensive read of the new param |
| `src/app/app.module.ts` | provide `AnalyticsService` |
| `src/app/app.component.ts` | `Session started` on boot |
| `src/app/services/lkb.service.ts` | inventory `Health` events |
| `src/app/services/navigation.service.ts` | back-button event |
| `src/app/pages/leveransklarabilar/lkb-category-image/lkb-category-image.component.ts` | category selected |
| `src/app/pages/leveransklarabilar/lkb-filter/lkb-filter.component.ts` | filter events + debounced sliders |
| `src/app/pages/leveransklarabilar/lkb-resultview/lkb-resultview.component.ts` | car opened, load-more |
| `src/app/pages/leveransklarabilar/lkb-details/lkb-details.component.ts` | dwell time, insurance opened, detail load failure |
| `src/app/pages/leveransklarabilar/lkb-swiper-view/lkb-swiper-view.component.ts` | gallery summary, image errors |
| `src/app/pages/leveransklarabilar/lkb-finace-box/lkb-finace-box.component.ts` | finance events |
| `src/app/pages/leveransklarabilar/lkb-insurance/lkb-insurance.component.ts` | insurance flow events |
| `ANALYTICS_EVENTS.md` (repo root) | **new** — captured-events doc, mirroring the reference |

No `mtemplate.json` change — `/js` is already directory-mapped.

## Verification

1. **`ng build` green.** The real gate: this is a TypeScript project, so the compiler catches every
   wiring mistake.
2. **`node -e "JSON.parse(...)"` on `src/mframe.json`.**
3. **Unit tests** for the `AnalyticsService` state machine — queue-then-flush, timeout fallback,
   generation guard, lazy idle rotation. The project currently has **zero** `.spec` files, so if the
   Karma runner turns out not to be usable here that will be reported, not silently skipped.
4. **Local run.** `ng serve` has no `window.Loader` (the `template-loader.js` script tag 404s under
   the dev server, which is why `HarmonyConfigService` has `devDefaults()`), so the service falls
   back to a generated id and prints the whole stream to the browser console. The full journey is
   walkable and observable before anything ships.
5. **On-device**, Debug Options → Show Console shows the same stream.
6. Real end-to-end delivery to the Mood analytics backend is only observable on a real player.

## Amendments

**2026-08-05 — gallery events are now per photo, not only a summary.** As designed, the only
`Gallery` event fired on leaving the car, so clicking through photos produced nothing observable at
the time and read as broken. Each photo now reports the first time it is reached
(`User viewed photo <n> of <total> of <car>`, `userTriggered: true`), with the on-leave summary
kept as the engagement-depth figure. Repeats are still dropped and the opening photo is still not
reported, so the anti-noise property the original design cared about is preserved.

**2026-08-05 — finance box guarded against a missing car.** Pre-existing crash, surfaced during
testing: `lkb-details.component.html` rendered `<app-lkb-finace-box>` unguarded while the vehicle
fetch was still in flight, and the component's `ngAfterViewInit` dereferenced `car` after a 100ms
timeout — `Cannot read properties of undefined (reading 'interestRate')`. Fixed at the source with
`*ngIf="show"` (matching the gallery on the same page) plus a guard in `ngAfterViewInit`. Covered by
`lkb-finace-box.component.spec.ts`.
