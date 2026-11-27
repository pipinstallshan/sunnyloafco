/**
 * Sunny Loaf: scroll-to-variant gallery behaviour.
 *
 * When the "Move the selected variant's image to the front" setting is OFF, the gallery
 * keeps its natural order on variant change (Horizon would otherwise re-sort it). This
 * script scrolls the gallery to the newly selected variant's image instead of swapping
 * the featured image, matching the brief's requested behaviour.
 *
 * It listens for the standard `variant:update` / product-select flow by observing the
 * media-gallery element: after Horizon replaces the gallery on variant change, the fresh
 * element carries `data-sl-variant-scroll` and `data-sl-variant-media-id`. We scroll the
 * matching slide into view. Pure progressive enhancement; no effect when the setting is on.
 */
(function () {
  const scrollToVariant = (gallery) => {
    if (!gallery || gallery.dataset.slVariantScroll !== 'true') return;
    const mediaId = gallery.dataset.slVariantMediaId;
    if (!mediaId) return;

    const mediaEl = gallery.querySelector(`[data-media-id="${mediaId}"]`);
    if (!mediaEl) return;

    const slide = mediaEl.closest('slideshow-slide') || mediaEl.closest('li') || mediaEl;

    // Prefer the slideshow's own select() so dots/counter stay in sync on mobile carousels.
    const slideshow = gallery.querySelector('slideshow-component');
    const slides = slideshow ? Array.from(slideshow.querySelectorAll('slideshow-slide')) : [];
    const index = slides.indexOf(slide);

    if (slideshow && typeof slideshow.select === 'function' && index >= 0) {
      try {
        slideshow.select(index, undefined, { animate: true });
        return;
      } catch (e) {
        /* fall through to scrollIntoView */
      }
    }

    slide.scrollIntoView({ behavior: 'smooth', block: 'nearest', inline: 'start' });
  };

  const observe = (root) => {
    const observer = new MutationObserver((mutations) => {
      for (const mutation of mutations) {
        for (const node of mutation.addedNodes) {
          if (!(node instanceof Element)) continue;
          const gallery = node.matches?.('media-gallery') ? node : node.querySelector?.('media-gallery');
          if (gallery && gallery.dataset.slVariantScroll === 'true') {
            // Wait a frame so the new gallery has laid out before we scroll.
            requestAnimationFrame(() => requestAnimationFrame(() => scrollToVariant(gallery)));
          }
        }
      }
    });
    observer.observe(root, { childList: true, subtree: true });
  };

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', () => observe(document.body), { once: true });
  } else {
    observe(document.body);
  }
})();
