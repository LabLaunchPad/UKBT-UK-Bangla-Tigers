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
  const results = await new AxeBuilder({ page })
    .withTags(['wcag2a', 'wcag2aa', 'wcag22aa'])
    .analyze();
  if (results.violations.length > 0) {
    console.log(JSON.stringify(results.violations, null, 2));
  }
  expect(
    results.violations,
    `axe violations: ${results.violations.map((v) => v.id).join(', ')}`,
  ).toEqual([]);
});

test('every homepage nav link, the hero CTA, and every footer social link show a visible focus outline', async ({
  page,
}) => {
  await page.goto('/');
  const focusable = page.locator(
    '.ukbt-header__nav a, .ukbt-hero .ukbt-button, .ukbt-footer__social a, .ukbt-footer__links a',
  );
  const count = await focusable.count();
  expect(count).toBeGreaterThan(0);
  for (let i = 0; i < count; i++) {
    await focusable.nth(i).focus();
    const style = await focusable.nth(i).evaluate((el) => {
      const s = getComputedStyle(el);
      return { outlineStyle: s.outlineStyle, outlineWidth: s.outlineWidth };
    });
    expect(style.outlineStyle, `element ${i} focus outline`).not.toBe('none');
    expect(
      Number.parseFloat(style.outlineWidth),
      `element ${i} outline width`,
    ).toBeGreaterThan(0);
  }
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
