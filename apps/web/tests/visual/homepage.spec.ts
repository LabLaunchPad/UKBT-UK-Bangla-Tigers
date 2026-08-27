import AxeBuilder from '@axe-core/playwright';
import { expect, test } from '@playwright/test';

/**
 * Stage 7G (artifacts/pages/HOMEPAGE-CONTRACT.md acceptance criteria).
 * Real, executing checks — not asserted.
 */

test('axe-core scan reports zero violations on the homepage', async ({
  page,
}) => {
  await page.goto('/');
  // HOMEPAGE-CONTRACT.md acceptance criterion 3 says "0 violations", with
  // no tag-scope qualifier. A wcag-tags-only scan missed a real
  // best-practice-tagged heading-order violation (Stage 8 red team F4) —
  // widened to include it rather than narrowing the criterion to match
  // what was actually being checked.
  const results = await new AxeBuilder({ page })
    .withTags(['wcag2a', 'wcag2aa', 'wcag22aa', 'best-practice'])
    .analyze();
  if (results.violations.length > 0) {
    console.log(JSON.stringify(results.violations, null, 2));
  }
  expect(
    results.violations,
    `axe violations: ${results.violations.map((v) => v.id).join(', ')}`,
  ).toEqual([]);
});

/**
 * Presence AND contrast of the focus ring. Presence alone (outlineStyle
 * !== 'none', outlineWidth > 0) is exactly what the Stage 7 suite
 * checked and why it stayed green through a real defect (Stage 8 red
 * team F3): 13 elements had a real, non-zero-width outline painted in a
 * color effectively invisible against its own background (1.0-1.25:1).
 * This asserts the same real WCAG 1.4.11 minimum (3:1) that the
 * gold-contrast test below already computes for text.
 */
test('every homepage nav link, CTA, and social link shows a visible AND contrast-safe focus outline', async ({
  page,
}) => {
  await page.goto('/');
  const focusable = page.locator(
    '.ukbt-header__nav a, .ukbt-hero .ukbt-button, .ukbt-hero__social a, .ukbt-franchise__cta a, .ukbt-about-cta__social a, .ukbt-footer__social a, .ukbt-footer__links a',
  );
  const count = await focusable.count();
  expect(count).toBeGreaterThan(0);
  for (let i = 0; i < count; i++) {
    await focusable.nth(i).focus();
    const result = await focusable.nth(i).evaluate((el) => {
      const s = getComputedStyle(el);
      const parseRgb = (str: string): number[] | null => {
        const m = str.match(/\d+(\.\d+)?/g);
        return m ? m.slice(0, 3).map(Number) : null;
      };
      const relLum = ([r, g, b]: number[]) => {
        const lin = (c: number) => {
          const v = c / 255;
          return v <= 0.03928 ? v / 12.92 : ((v + 0.055) / 1.055) ** 2.4;
        };
        return 0.2126 * lin(r) + 0.7152 * lin(g) + 0.0722 * lin(b);
      };
      const contrast = (a: number[], b: number[]) => {
        const la = relLum(a);
        const lb = relLum(b);
        const [hi, lo] = la > lb ? [la, lb] : [lb, la];
        return (hi + 0.05) / (lo + 0.05);
      };
      const outline = parseRgb(s.outlineColor);
      // CSS outlines are explicitly excluded from hit-testing/layout by
      // spec, so `elementFromPoint` at a ring's coordinates can never
      // return the ring's own element there — it reports whatever box
      // actually occupies that point, which is only useful once we
      // already know, by the spec's own guarantee, which side of the
      // element's border edge the ring paints on:
      //   - offset >= 0: the ring paints OUTSIDE the border box, in
      //     whatever ancestor's chrome extends there — check the
      //     nearest ancestor background, skipping the element's own
      //     (which the ring never overlaps).
      //   - offset < 0: the ring paints INSIDE the border box, over
      //     the element's own fill — check that directly.
      // This is a direct consequence of the outline-offset spec, not a
      // guess: verified by a zoomed rendered screenshot of the footer
      // social icons at -6px offset (ring fully inset in the gold
      // tile, confirmed by pixel sampling) and of the hero CTA button
      // at its default positive offset (ring painted on the gold card
      // behind it, not the button's own navy fill).
      const offset = Number.parseFloat(s.outlineOffset) || 0;
      let n: Element | null = offset < 0 ? el : el.parentElement;
      let bg: number[] | null = null;
      while (n) {
        const c = getComputedStyle(n).backgroundColor;
        if (c && c !== 'rgba(0, 0, 0, 0)' && !c.endsWith(', 0)')) {
          bg = parseRgb(c);
          break;
        }
        n = n.parentElement;
      }
      const ratio = outline && bg ? contrast(outline, bg) : null;
      return {
        outlineStyle: s.outlineStyle,
        outlineWidth: s.outlineWidth,
        ratio,
      };
    });
    expect(result.outlineStyle, `element ${i} focus outline`).not.toBe('none');
    expect(
      Number.parseFloat(result.outlineWidth),
      `element ${i} outline width`,
    ).toBeGreaterThan(0);
    expect(
      result.ratio,
      `element ${i} outline-vs-background contrast could not be computed`,
    ).not.toBeNull();
    expect(
      result.ratio ?? 0,
      `element ${i} outline-vs-background contrast ${result.ratio?.toFixed(2)}:1, needs 3:1`,
    ).toBeGreaterThanOrEqual(3);
  }
});

test('the mobile nav drawer is fully keyboard-operable', async ({ page }) => {
  await page.setViewportSize({ width: 390, height: 844 });
  await page.goto('/');

  const toggle = page.locator('#ukbt-nav-toggle');
  await page.locator('.ukbt-header__brand').focus();
  await page.keyboard.press('Tab');
  await expect(toggle).toBeFocused();

  const firstDrawerLink = page.locator('.ukbt-header__drawer-menu a').first();
  await expect(firstDrawerLink).not.toBeInViewport();

  await page.keyboard.press('Enter');
  await expect(toggle).toHaveAttribute('aria-expanded', 'true');
  await expect(firstDrawerLink).toBeInViewport();

  // The drawer must actually be reachable by Tab once open, not just
  // visible — this is what F1 found broken (inert kept it out of the
  // tab order even while transformed on-screen). The close button sits
  // before the link list in the drawer's own markup, so it's the next
  // stop, then the first nav link.
  await page.keyboard.press('Tab');
  await expect(page.locator('#ukbt-nav-close')).toBeFocused();
  await page.keyboard.press('Tab');
  await expect(firstDrawerLink).toBeFocused();

  await page.keyboard.press('Escape');
  await expect(toggle).toHaveAttribute('aria-expanded', 'false');
  await expect(toggle).toBeFocused();
});

test('mobile nav toggle shows and hides the nav without a console error', async ({
  page,
}) => {
  await page.setViewportSize({ width: 390, height: 844 });
  await page.goto('/');
  const toggle = page.locator('.ukbt-header__toggle');
  await expect(toggle).toBeVisible();
  // Below the collapse breakpoint the nav becomes an off-canvas drawer
  // (reference `.sidebar`), not an inline expansion — assert the drawer.
  const drawerLink = page.locator('.ukbt-header__drawer-menu a').first();
  await expect(drawerLink).not.toBeInViewport();
  await toggle.click();
  await expect(drawerLink).toBeInViewport();
});

test('no content-contamination strings appear anywhere in the rendered homepage', async ({
  page,
}) => {
  await page.goto('/');
  const html = await page.content();
  const forbidden = [
    'Adelux',
    'Padel Club',
    'Fox Creation',
    'Nipo Khadem',
    'Nipo',
  ];
  for (const term of forbidden) {
    expect(
      html.includes(term),
      `forbidden term "${term}" found in rendered HTML`,
    ).toBe(false);
  }
});

test('excluded images are never referenced by the built homepage', async ({
  page,
}) => {
  await page.goto('/');
  const html = await page.content();
  const excluded = [
    'home-hero.webp',
    'join-us.webp',
    'gallery-06.webp',
    'nordic-smash-slide.webp',
  ];
  for (const file of excluded) {
    expect(
      html.includes(file),
      `excluded asset "${file}" referenced in rendered HTML`,
    ).toBe(false);
  }
});

/**
 * Real WCAG contrast computation (same relative-luminance method used
 * throughout this project) against the ACTUAL rendered computed styles
 * of EVERY element that paints text in the verified accent (gold), on
 * every route — not one hand-picked element.
 *
 * Why it scans rather than samples: gold-on-light has now been
 * reintroduced three separate times in this build (ProfileHeader's role
 * line, TournamentCard's "Completed" tag, WhyChooseUs's card index).
 * axe catches it, but only after a full page scan and only on the routes
 * axe runs against. This states the brand rule from
 * artifacts/brand/UKBT-BRAND-FOUNDATION.md directly: gold is an
 * accent on dark surfaces, never text on a light one.
 *
 * KNOWN BLIND SPOT, kept deliberately rather than papered over: this
 * compares computed `color`, which does not reflect `opacity`. A
 * half-transparent navy over gold blends to something failing, and this
 * check will not see it — that exact case slipped past here and was
 * caught by axe instead. The two guards are complementary; neither alone
 * is sufficient, so both run.
 */
test('gold accent text always meets contrast, on every route', async ({
  page,
}) => {
  const GOLD = [204, 164, 79]; // #CCA44F

  for (const route of [
    '/',
    '/about',
    '/club-captain',
    '/tournaments',
    '/franchises',
    '/contact',
  ]) {
    await page.goto(route);

    const offenders = await page.evaluate((gold) => {
      const parseRgb = (s: string): number[] | null => {
        const m = s.match(/\d+(\.\d+)?/g);
        return m ? m.slice(0, 3).map(Number) : null;
      };
      const relLum = ([r, g, b]: number[]) => {
        const lin = (c: number) => {
          const v = c / 255;
          return v <= 0.03928 ? v / 12.92 : ((v + 0.055) / 1.055) ** 2.4;
        };
        return 0.2126 * lin(r) + 0.7152 * lin(g) + 0.0722 * lin(b);
      };
      const contrast = (a: number[], b: number[]) => {
        const la = relLum(a);
        const lb = relLum(b);
        const [hi, lo] = la > lb ? [la, lb] : [lb, la];
        return (hi + 0.05) / (lo + 0.05);
      };
      const near = (a: number[], b: number[]) =>
        a.every((v, i) => Math.abs(v - b[i]) <= 6);

      const out: string[] = [];
      for (const el of Array.from(
        document.querySelectorAll<HTMLElement>('*'),
      )) {
        if (!el.textContent?.trim()) continue;
        // Only leaf-ish nodes actually paint the text.
        if (
          el.children.length > 0 &&
          el.childElementCount === el.childNodes.length
        )
          continue;
        const cs = getComputedStyle(el);
        const fg = parseRgb(cs.color);
        if (!fg || !near(fg, gold as number[])) continue;

        let n: Element | null = el;
        let bg: number[] | null = null;
        while (n) {
          const c = getComputedStyle(n).backgroundColor;
          if (c && c !== 'rgba(0, 0, 0, 0)' && !c.endsWith(', 0)')) {
            bg = parseRgb(c);
            break;
          }
          n = n.parentElement;
        }
        if (!bg) continue;

        const size = Number.parseFloat(cs.fontSize);
        const bold = Number.parseInt(cs.fontWeight, 10) >= 700;
        const large = size >= 24 || (size >= 18.66 && bold);
        const need = large ? 3 : 4.5;
        const ratio = contrast(fg, bg);
        if (ratio < need) {
          out.push(
            `${el.tagName.toLowerCase()}.${String(el.className).trim().split(/\s+/)[0]} ${ratio.toFixed(2)}:1 (needs ${need}) "${el.textContent.trim().slice(0, 24)}"`,
          );
        }
      }
      return out;
    }, GOLD);

    expect(
      offenders,
      `gold text failing contrast on ${route}:\n${offenders.join('\n')}`,
    ).toEqual([]);
  }
});
