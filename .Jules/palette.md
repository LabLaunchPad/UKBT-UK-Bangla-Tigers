## 2026-08-26 - Accessible Skip to Content Link Pattern

**Learning:** Navigation headers with extensive link items block keyboard and screen reader users from reaching primary content quickly. Providing a visually-hidden, focus-visible "Skip to main content" link as the first focusable element improves keyboard accessibility (WCAG 2.1 SC 2.4.1). In Astro applications, setting `id="main-content"` and `tabindex="-1"` on `<main>` ensures focus moves smoothly to the container without unwanted outlines when navigated to via anchor links.

**Action:** Always include a skip link (`.ukbt-skip-link`) at the top of the header component, using CSS custom properties for focus styling, and ensure all page templates render a `<main id="main-content" tabindex="-1">` container.
