# Volvo LKB — Branch names were being percent-encoded twice

**Date:** 2026-08-17
**App:** `lkb-standalone/` (Angular 16), shipped as `lkb-standalone-template/`
**Regression introduced in:** the 1.6.0 inventory-source rework
(`2026-08-10-inventory-source-design.md`)

## The bug

A branch name reaches the app in one of two shapes:

| Source | Shape | Example |
| --- | --- | --- |
| Harmony template, typed by an operator | plain | `Bilia Jägersro Volvo` |
| Player parameter `BRANCH_NAMES` | already percent-encoded | `Bilia J%C3%A4gersro Volvo` |

Before 1.6.0 the value went into the URL untouched:

```js
`...&branch=${r[o].trim()}`      // one request per branch, no encoding
```

The pre-encoded shape therefore worked: the API received `%C3%A4` and decoded it to `ä`.

1.6.0 collapsed the per-branch requests into one and added `encodeURIComponent`, which also encodes
the `%` itself:

```
Bilia J%C3%A4gersro Volvo   →   Bilia%20J%25C3%25A4gersro%20Volvo
```

The API then searched for a branch literally named `Bilia J%C3%A4gersro Volvo` and matched nothing.
It returned 0 with no error, so the branch simply vanished from the kiosk.

Only names containing `å ä ö` were affected, which is why it looked like a partial failure rather
than a broken feature.

## Measured

Live against `api.wayke.se`, using the 19-branch Bilia list from the dev stub in
`lkb-standalone-template/index.html` — 11 of those 19 names carry an encoded letter:

| One request, 19 names | Vehicles |
| --- | --- |
| 1.6.0 as shipped | 254 |
| Fixed, player values | **544** |
| Fixed, the same names typed by hand | **544** |

Per branch, before → after: Jägersro 0→59, Sisjön 0→57, Södertälje 0→47, Västerås 0→42, Kungälv
0→25, Täby 0→23, Sävedalen 0→18, Köping 0→10, Strängnäs 0→9. **290 of 544 vehicles, 53%.**

## The fix

`LkbService.encodeName()`, applied to `branch` values only — `branchId` and `parentId` are GUIDs and
keep plain `encodeURIComponent`:

```ts
private encodeName(value: string): string {
  return value.includes('%')
    ? value.replace(/ /g, '%20')
    : encodeURIComponent(value);
}
```

A `%` is the discriminator: no Wayke branch name contains one, so its presence means the value
arrived encoded. Chosen over decode-then-encode because `decodeURIComponent` throws on a lone `%`
and would need a guard for a case that cannot legitimately occur.

**Spaces are still encoded in the pass-through path.** The player encodes the letters but not the
spaces, so a straight pass-through yields a URL with raw spaces in it. Browsers repair that
silently — which is why the pre-1.6.0 code worked — but it is not a valid URL: `curl` rejects it
outright, and that is how this was caught while verifying the fix.

## Interaction with the same day's inventory gating

Independent bugs, but they compound. A dealer whose branch names *all* contain `å ä ö` got 0
vehicles from this bug; under the old fall-through that empty result cascaded to the template
default, which named Bildeve. So this bug was one of the live routes by which one dealership's stock
could appear on another's screen. See `2026-08-17-no-inventory-without-configuration.md`.

## Verification

- **34/34 unit tests pass**, 3 new: plain name still encoded, pre-encoded name not re-encoded (and
  its spaces encoded), and a setting mixing both shapes handled per value rather than per setting.
  Each was watched failing first — the double-encoded `T%25C3%25A4by` was visible in the failure
  output.
- Fix verified against the live API, not only in unit tests: 254 → 544 vehicles on the real
  19-branch list, and both input shapes now return the identical 544.
- `npm run build:prod` green; `main.012a6579f43eeef1.js` copied to
  `lkb-standalone-template/js/main.js` and the two post-build path fixes from the root
  `instructions` file applied — `assets/images` → `images` (16×) and
  `/VolvoLKB/backspace.<hash>.png` → `backspace.png`. **The shipped bundle is deliberately not
  identical to the build output** (-139 bytes); an earlier revision of this document claimed md5
  equality, which was the mistake that shipped a bundle with every image path broken. Verified
  against the profile of the last good release (`lkb-standalone-1.6.0.zip`): 0 `assets/images`,
  0 `/VolvoLKB/`, 0 hashed asset refs, `url(backspace.png)`, `node --check` clean, and all 8
  referenced `images/...` paths present on disk. `polyfills`/`runtime`/`scripts` were md5-identical
  to the previous release, so they were not recopied.
- Template version left at 1.6.0 and no `mtemplate compile` run — Taras's release steps.
- Not observed on a real player.
