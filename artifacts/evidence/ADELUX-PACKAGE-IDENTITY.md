# Adelux Package Identity

**Recorded:** 2026-08-26 · **Method:** direct inspection of the supplied archive,
read-only, in a scratch directory. **Nothing was copied into this repository.**

## 1. Package identity — `MEASURED`

| Field | Value |
|---|---|
| Filename as supplied | `3073e848-adeluxpadelclubcommunityhtmlbootstrap20260107040317utc.zip` |
| Size | 1,296,131 bytes |
| **SHA-256** | `cf4907bb60003b719f3d7712e2d06389c2ab7f8a02590bdea570da9780cafb54` |
| Entries | 110 |
| Root | `Adelux_Main_File/` → `Documentation/`, `HTML_TEMPLATE/` |

The filename is a session upload identifier, not a vendor filename. It carries no
order or purchase reference. The embedded timestamp (`20260107040317utc`) is an
upload artifact and is **not** evidence of a purchase date.

## 2. Product identity — `OBSERVED` (self-declared by the package)

From `Documentation/index.html`:

| Field | Value |
|---|---|
| Product | Adelux — Padel Club & Community HTML Bootstrap Template |
| Version | 1.0.0 |
| Created | October 2025 |
| Author | Fox Creation (links to `themeforest.net/user/fox_creation`) |
| Copyright notice | `© 2025 Adelux. All rights reserved — by Fox Creation` |

**All of the above is the package describing itself.** A package's self-description
identifies the product; it does not establish who holds a licence to it.

## 3. Licence-bearing files — `FACT`: **none exist**

Searched the archive for filenames matching `licen*`, `copying*`, `terms*`,
`purchase*`, `receipt*`, `invoice*`, `credit*`:

```
unzip -Z1 <archive> | grep -iE 'licen|copying|readme|terms|purchase|receipt|invoice|credit'
→ NONE FOUND
```

Searched the archive text for `regular license`, `extended license`,
`purchase code`, `item id`:

```
→ no match outside bundled third-party library headers
```

**There is no licence file, no purchase code, no item ID, no order reference, and
no receipt anywhere in the package.**

The only rights statement present is `All rights reserved` — an assertion that
rights are **retained by the author**, which is the opposite of a grant.

## 4. Third-party components — licences read from the shipped files

These are `FACT` where a licence header exists in the file itself, and `UNKNOWN`
where none does. **No model memory was used**; every value below was read out of
the package.

| Component | Version | Licence per shipped header | Status |
|---|---|---|---|
| Bootstrap | 5.x | `Licensed under MIT` | `FACT` — permissive |
| jQuery | 3.7.1 | `OpenJS Foundation … jquery.org/license` (MIT) | `FACT` — permissive |
| Swiper | — | `License MIT` | `FACT` — permissive |
| Flatpickr | — | `license MIT` | `FACT` — permissive |
| Font Awesome | **Free 6.7.2** | `Icons: CC BY 4.0, Fonts: SIL OFL 1.1, Code: MIT` | `FACT` — **attribution required** |
| **animate.css** | **4.1.1** | **`Licensed under the Hippocratic License 2.1`** | `FACT` — **not an OSI-approved licence** |
| **Isotope PACKAGED** | **v3.0.6** | **`Licensed GPLv3 for open source use or Isotope Commercial License for commercial use`** — Copyright 2010-2018 Metafizzy | `FACT` — **dual-licensed; commercial use needs a paid licence** |
| fsLightbox | — | no header, no licence file | `UNKNOWN` |
| Odometer | — | no header, no licence file | `UNKNOWN` |
| Lato, Montserrat | — | no licence text; CSS loads from `fonts.gstatic.com` | `UNKNOWN` (see §6) |

## 5. Images

| Class | Count | Note |
|---|---|---|
| `dummy-img-*` placeholders | 15 | evidently placeholder |
| Named assets | 26 | `Adelux-Logo.png`, `Adelux-Black-Logo.png`, `Client-1…8.png`, `Gp-1…5`, `Icon-1…11`, `favicon.ico` |

No photograph of an identifiable person was found. The `Client-*` files are
evidently placeholder brand marks; the `Adelux-*` logos are **the template
author's own branding** and are not UKBT's to use under any licence tier.

## 6. Findings that weaken the Documentation as evidence

**6a — The documentation misstates its own package contents.** It claims
`Font Awesome 5x`; the shipped file declares `Font Awesome Free 6.7.2`. A document
that is demonstrably wrong about a component it ships is weak evidence about
anything else it asserts — including its credits section, which is the sole source
for the claim that stock imagery came from *Envato Elements*.

**6b — The fonts are not actually bundled.** `font-family-lato.css` and
`font-family-montserrat.css` contain `@font-face` rules pointing at
`https://fonts.gstatic.com/...`. The template therefore makes **third-party
requests to Google on every page load**, which is a UK GDPR consideration
(visitor IP disclosure to a third party) and directly relevant to U-18 — not only
a licensing question.

## 7. What this record does and does not establish

**Establishes:** the exact bytes under discussion (SHA-256), the product's
self-declared identity, the absence of any licence or purchase artifact, and the
licences of seven bundled third-party components read from their own headers.

**Does not establish:** who holds a licence to Adelux, which tier, whether it
covers UKBT, or whether adaptation and deployment are permitted. Those require
evidence that is not in the package.
