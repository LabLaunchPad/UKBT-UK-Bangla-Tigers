import AxeBuilder from '@axe-core/playwright';
import { expect, test } from '@playwright/test';
import { VIEWPORT_MATRIX } from './viewports.js';

/**
 * Stage 7 site-scale pages (Club Captain, Players Profile, Our
 * Franchises, International Tournaments/Events, Contact Us). Same
 * discipline as homepage.spec.ts/about.spec.ts — real, executing checks.
 */

const routes = [
  { path: '/club-captain', name: 'Club Captain' },
  { path: '/players', name: 'Players Profile' },
  { path: '/franchises', name: 'Our Franchises' },
  { path: '/tournaments', name: 'International Tournaments/Events' },
  { path: '/contact', name: 'Contact Us' },
  // Template-mirrored routes (CLIENT_REQ_009 / ROUTE-CONTRACT Amendment 01).
  { path: '/community', name: 'Community' },
  { path: '/coaching', name: 'Coaching & Development' },
  { path: '/services', name: 'What We Do' },
  { path: '/membership', name: 'Membership' },
  { path: '/join', name: 'Join the Club' },
  { path: '/faq', name: 'FAQ' },
  { path: '/news', name: 'Club News' },
];

/**
 * ROUTE-CONTRACT Amendment 01 condition 2: the commerce-shaped shells
 * describe offerings UKBT has no evidence of, so they must not be
 * indexed. An indexed page is a public claim that the club sells the
 * thing. This asserts the condition rather than trusting it was applied.
 */
const NOINDEX_ROUTES = ['/services', '/membership', '/join'];
const INDEXABLE_ROUTES = [
  '/',
  '/about',
  '/community',
  '/coaching',
  '/faq',
  '/news',
];

for (const route of routes) {
  test(`axe-core scan reports zero violations on ${route.name}`, async ({
    page,
  }) => {
    await page.goto(route.path);
    const results = await new AxeBuilder({ page })
      .withTags(['wcag2a', 'wcag2aa', 'wcag22aa'])
      .analyze();
    if (results.violations.length > 0) {
      console.log(JSON.stringify(results.violations, null, 2));
    }
    expect(
      results.violations,
      `axe violations on ${route.path}: ${results.violations.map((v) => v.id).join(', ')}`,
    ).toEqual([]);
  });

  test(`no content-contamination strings appear on ${route.name}`, async ({
    page,
  }) => {
    await page.goto(route.path);
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
        `forbidden term "${term}" found on ${route.path}`,
      ).toBe(false);
    }
  });

  test(`excluded images are never referenced on ${route.name}`, async ({
    page,
  }) => {
    await page.goto(route.path);
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
        `excluded asset "${file}" found on ${route.path}`,
      ).toBe(false);
    }
  });

  test(`no horizontal overflow on ${route.name} at any frozen viewport`, async ({
    page,
  }) => {
    for (const size of VIEWPORT_MATRIX) {
      await page.setViewportSize(size);
      await page.goto(route.path);
      const { scrollWidth, clientWidth } = await page.evaluate(() => ({
        scrollWidth: document.documentElement.scrollWidth,
        clientWidth: document.documentElement.clientWidth,
      }));
      expect(
        scrollWidth,
        `horizontal overflow at ${size.width}x${size.height} on ${route.path}`,
      ).toBeLessThanOrEqual(clientWidth);
    }
  });

  test(`mobile nav toggle works on ${route.name}`, async ({ page }) => {
    await page.setViewportSize({ width: 390, height: 844 });
    await page.goto(route.path);
    const toggle = page.locator('.ukbt-header__toggle');
    await expect(toggle).toBeVisible();
    // Below the collapse breakpoint the nav becomes an off-canvas drawer
    // (reference `.sidebar`), not an inline expansion — assert the drawer.
    const drawerLink = page.locator('.ukbt-header__drawer-menu a').first();
    await expect(drawerLink).not.toBeInViewport();
    await toggle.click();
    await expect(drawerLink).toBeInViewport();
  });
}

test('no player photo is rendered on the Our Franchises roster', async ({
  page,
}) => {
  await page.goto('/franchises');
  const rosterImgs = await page.locator('.ukbt-roster-card img').count();
  expect(
    rosterImgs,
    'roster cards must stay text-only, no unconfirmed photos',
  ).toBe(0);
});

test('no captain portrait is rendered on the Club Captain page', async ({
  page,
}) => {
  await page.goto('/club-captain');
  const portrait = await page
    .locator('.ukbt-profile-header__content img')
    .count();
  expect(
    portrait,
    'profile header must stay crest-only, no unconfirmed portrait',
  ).toBe(0);
});

test('Contact Us page renders no submission form (no live backend exists)', async ({
  page,
}) => {
  await page.goto('/contact');
  const forms = await page.locator('form').count();
  expect(
    forms,
    'no fake/non-functional form should ship without a real backend',
  ).toBe(0);
});

for (const route of NOINDEX_ROUTES) {
  test(`${route} is noindex (ROUTE-CONTRACT Amendment 01 condition 2)`, async ({
    page,
  }) => {
    await page.goto(route);
    const robots = await page
      .locator('meta[name="robots"]')
      .getAttribute('content');
    expect(robots, `${route} must carry a noindex robots meta`).toContain(
      'noindex',
    );
  });
}

for (const route of INDEXABLE_ROUTES) {
  test(`${route} is indexable`, async ({ page }) => {
    await page.goto(route);
    const count = await page.locator('meta[name="robots"]').count();
    const robots =
      count > 0
        ? await page.locator('meta[name="robots"]').getAttribute('content')
        : '';
    expect(robots ?? '', `${route} must not be noindex`).not.toContain(
      'noindex',
    );
  });
}

/**
 * Release-gate RM-4 (artifacts/receipts/RELEASE.md): the noindex/indexable
 * split was already tested above, but nothing asserted that an indexable
 * page actually has a real title/description to be indexed WITH. Built
 * from `routes` + the two pages tested in their own spec files, minus the
 * noindex shells — not a fourth hand-maintained list.
 */
const ALL_INDEXABLE_ROUTES = [
  '/',
  '/about',
  ...routes.map((r) => r.path),
].filter((path) => !NOINDEX_ROUTES.includes(path));

for (const route of ALL_INDEXABLE_ROUTES) {
  test(`${route} has a real, non-empty title and meta description`, async ({
    page,
  }) => {
    await page.goto(route);
    const title = await page.title();
    expect(
      title.trim().length,
      `${route} title must not be empty`,
    ).toBeGreaterThan(0);
    expect(title, `${route} title looks like a placeholder`).not.toMatch(
      /lorem|placeholder|TODO|Astro/i,
    );

    const description = await page
      .locator('meta[name="description"]')
      .getAttribute('content');
    expect(
      description?.trim().length ?? 0,
      `${route} must have a non-empty meta description`,
    ).toBeGreaterThan(0);
  });
}

/**
 * Shell sections must say plainly that they are waiting for content.
 * Rendering an empty skeleton, or lorem text, would both fail the point
 * of CLIENT_REQ_009's "shells where UKBT content will go".
 */
test('every shell section declares CONTENT_STATUS = UNKNOWN and explains itself', async ({
  page,
}) => {
  for (const route of ['/services', '/membership', '/join', '/faq', '/news']) {
    await page.goto(route);
    const pending = page.locator('[data-content-status="UNKNOWN"]');
    const n = await pending.count();
    expect(
      n,
      `${route} should render at least one pending-content block`,
    ).toBeGreaterThan(0);
    for (let i = 0; i < n; i++) {
      const text = (await pending.nth(i).innerText()).trim();
      expect(
        text.length,
        `${route} pending block ${i} must explain itself`,
      ).toBeGreaterThan(20);
    }
  }
});
