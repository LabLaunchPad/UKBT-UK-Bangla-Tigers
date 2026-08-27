import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { expect, test } from '@playwright/test';

/**
 * Full-page homepage captures for review at the three device classes,
 * with motion positively frozen and VERIFIED frozen rather than assumed.
 *
 * A `fullPage` shot is stitched from scrolled bands, so anything moving
 * during capture — a transition, a scroll-reveal, a sticky element
 * repainting per band — can smear or duplicate across the seam. Disabling
 * motion is not enough on its own: the assertion below checks that the
 * document reports zero running animations/transitions at the moment of
 * capture.
 */
const outDir = path.resolve(
  path.dirname(fileURLToPath(import.meta.url)),
  '..',
  '..',
  '..',
  '..',
  'artifacts',
  'ui',
  'delivery',
);

const FREEZE_CSS = `
  *, *::before, *::after {
    animation: none !important;
    animation-play-state: paused !important;
    transition: none !important;
    scroll-behavior: auto !important;
    caret-color: transparent !important;
    will-change: auto !important;
  }
  /* Sticky/fixed elements repaint in every stitched band. */
  .ukbt-header, [style*="position: sticky"], [style*="position: fixed"] {
    position: static !important;
  }
  /* Any scroll-reveal pattern must be shown, not mid-fade. */
  [data-animate], .animate-box { opacity: 1 !important; transform: none !important; }
`;

const TARGETS = [
  { name: 'mobile', width: 390, height: 844 },
  { name: 'tablet', width: 768, height: 1024 },
  { name: 'desktop', width: 1440, height: 900 },
];

for (const t of TARGETS) {
  test(`homepage ${t.name} (${t.width}x${t.height}) capture with motion frozen`, async ({
    page,
  }) => {
    await page.setViewportSize({ width: t.width, height: t.height });
    await page.goto('/', { waitUntil: 'networkidle' });
    await page.addStyleTag({ content: FREEZE_CSS });
    await page.evaluate(() => window.scrollTo(0, 0));
    // Let the freeze take effect and any in-flight work settle.
    await page.waitForTimeout(300);

    // Positively verify nothing is animating at capture time.
    const moving = await page.evaluate(() => {
      const running = document
        .getAnimations()
        .filter((a) => a.playState === 'running');
      return running.map((a) => {
        const e = a.effect as KeyframeEffect | null;
        const target = e?.target as Element | null;
        return target
          ? `${target.tagName.toLowerCase()}.${String(target.className).trim().split(/\s+/)[0]}`
          : 'unknown';
      });
    });
    expect(
      moving,
      `animations still running at capture: ${moving.join(', ')}`,
    ).toEqual([]);

    // Images must be decoded, or the stitch captures empty boxes.
    await page.evaluate(async () => {
      await Promise.all(
        Array.from(document.images)
          .filter((i) => !i.complete)
          .map(
            (i) =>
              new Promise((res) => {
                i.onload = res;
                i.onerror = res;
              }),
          ),
      );
    });

    fs.mkdirSync(outDir, { recursive: true });
    const file = path.join(
      outDir,
      `homepage-${t.name}-${t.width}x${t.height}.png`,
    );
    await page.screenshot({
      path: file,
      fullPage: true,
      animations: 'disabled',
    });

    const bytes = fs.statSync(file).size;
    console.log(
      `CAPTURED ${t.name} -> ${path.basename(file)} (${bytes} bytes)`,
    );
    expect(bytes, 'screenshot should not be empty').toBeGreaterThan(20_000);
  });
}
