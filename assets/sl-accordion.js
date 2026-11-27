/*
 * Sunny Loaf accordion — single-open behaviour only.
 * The open/close MOTION is handled in CSS (::details-content). This just makes
 * lists marked [data-accordion-exclusive] open one item at a time: when one
 * opens, the others get their `open` attribute removed, which the CSS animates
 * closed. No preventDefault, no height math — nothing to fight the native toggle.
 */
(() => {
  if (window.__slAccordionLoaded) return;
  window.__slAccordionLoaded = true;

  function init(root) {
    (root || document)
      .querySelectorAll('.sl-faq__list[data-accordion-exclusive]')
      .forEach((list) => {
        if (list.dataset.slAccordionReady) return;
        list.dataset.slAccordionReady = '1';
        const items = Array.from(list.querySelectorAll(':scope > .sl-faq__item'));
        items.forEach((item) => {
          item.addEventListener('toggle', () => {
            if (!item.open) return;
            items.forEach((other) => {
              if (other !== item && other.open) other.open = false;
            });
          });
        });
      });
  }

  if (document.readyState !== 'loading') init();
  else document.addEventListener('DOMContentLoaded', () => init());

  document.addEventListener('shopify:section:load', (e) => init(e.target));
})();
