import { type Browser, expect, test } from '@playwright/test';

/**
 * Motion interaction tests — reduced-motion mode, no-JS fallback, and
 * drawer operability independent of animation. CI executes; local
 * render-verification happened during implementation (screenshots read).
 */

async function reducedContext(browser: Browser) {
  return browser.newContext({ reducedMotion: 'reduce' });
}

async function noJsContext(browser: Browser) {
  return browser.newContext({ javaScriptEnabled: false });
}

test('reduced motion: hero resolves to its final visible state', async ({
  browser,
}) => {
  const context = await reducedContext(browser);
  const page = await context.newPage();
  await page.goto('/');
  const headline = page.locator('.ukbt-hero__headline');
  await expect(headline, 'headline visible under reduced motion').toBeVisible();
  // Sweet-spot assertions: entrances resolve (opacity 1 after the short
  // fade), but nothing positional ever eases — the choreography degrades
  // to the soft fade, never the full rise.
  await page.waitForTimeout(800);
  const style = await headline.evaluate((el) => {
    const cs = getComputedStyle(el);
    return {
      opacity: cs.opacity,
      transform: cs.transform,
      animationName: cs.animationName,
    };
  });
  expect(opaque(style.opacity), 'fade resolves under reduced motion').toBe(
    true,
  );
  expect(style.transform, 'no positional easing under reduced motion').toBe(
    'none',
  );
  expect(style.animationName, 'soft fade, not choreography').toContain(
    'ukbt-soft-fade',
  );
  await context.close();
});

function opaque(value: string): boolean {
  return Number(value) >= 0.99;
}

test('reduced motion: drawer still opens and closes by keyboard', async ({
  browser,
}) => {
  const context = await reducedContext(browser);
  const page = await context.newPage();
  await page.setViewportSize({ width: 390, height: 844 });
  await page.goto('/');
  const toggle = page.locator('.ukbt-header__toggle');
  await toggle.focus();
  await page.keyboard.press('Enter');
  const drawerLink = page.locator('.ukbt-header__drawer-menu a').first();
  await expect(
    drawerLink,
    'drawer opens under reduced motion',
  ).toBeInViewport();
  await page.keyboard.press('Escape');
  await expect(
    drawerLink,
    'drawer closes under reduced motion',
  ).not.toBeInViewport();
  await context.close();
});

test('no-JS: hero content visible, navigation performs document loads', async ({
  browser,
}) => {
  const context = await noJsContext(browser);
  const page = await context.newPage();
  await page.goto('/');
  const headline = page.locator('.ukbt-hero__headline');
  await expect(headline, 'headline visible without JS').toBeVisible();
  const opacity = await headline.evaluate((el) => getComputedStyle(el).opacity);
  expect(opaque(opacity), 'no hidden pre-animation state without JS').toBe(
    true,
  );
  // Reveal utility must not hide content when the controller never runs.
  const motionClass = await page.evaluate(() =>
    document.documentElement.classList.contains('ukbt-motion-js'),
  );
  expect(motionClass, 'no arming class without JS').toBe(false);
  await page.locator('.ukbt-header__nav a[href="/about"]').click();
  await expect(page, 'document navigation works without JS').toHaveURL(
    /\/about\/?$/,
  );
  await context.close();
});

test('hero choreography settles: no infinite animation', async ({ page }) => {
  await page.goto('/');
  await page.waitForTimeout(2500);
  const running = await page.evaluate(
    () =>
      document.getAnimations().filter((a) => a.playState === 'running').length,
  );
  expect(running, 'no looping animations after settle').toBe(0);
});
