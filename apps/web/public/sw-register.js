/* PWA-lite worker registration: static file (bundlers would inline
 * it into every page's HTML weight). Deferred; silent failure. See
 * public/sw.js for the worker itself. */
if ('serviceWorker' in navigator) {
  window.addEventListener('load', () => {
    navigator.serviceWorker.register('/sw.js').catch(() => {});
  });
}
