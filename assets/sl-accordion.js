/*
 * Sunny Loaf accordion
 * Smoothly animates <details class="sl-faq__item"> open AND closed, including
 * the sibling that auto-closes when a list is marked single-open
 * (data-accordion-exclusive). No dependencies.
 */
(() => {
  if (window.__slAccordionLoaded) return;
  window.__slAccordionLoaded = true;

  const DURATION = 320;
  const EASING = 'cubic-bezier(0.33, 0.9, 0.3, 1)';
  const reduce = window.matchMedia('(prefers-reduced-motion: reduce)');

  class Accordion {
    constructor(el, group, exclusive) {
      this.el = el;
      this.group = group;
      this.exclusive = exclusive;
      this.summary = el.querySelector('summary');
      this.content = el.querySelector('.sl-faq__answer');
      this.animation = null;
      this.isClosing = false;
      this.isExpanding = false;
      if (this.summary && this.content) {
        this.summary.addEventListener('click', (e) => this.onClick(e));
      }
    }

    onClick(e) {
      e.preventDefault();

      if (reduce.matches) {
        const willOpen = !this.el.open;
        this.el.open = willOpen;
        if (willOpen) this.closeSiblings(true);
        return;
      }

      this.el.style.overflow = 'hidden';
      if (this.isClosing || !this.el.open) this.open();
      else if (this.isExpanding || this.el.open) this.shrink();
    }

    closeSiblings(instant) {
      if (!this.exclusive) return;
      this.group.forEach((a) => {
        if (a === this || !a.el.open) return;
        if (instant) a.el.open = false;
        else if (!a.isClosing) a.shrink();
      });
    }

    shrink() {
      this.isExpanding = false;
      this.isClosing = true;
      this.el.style.overflow = 'hidden';
      const start = `${this.el.offsetHeight}px`;
      const end = `${this.summary.offsetHeight}px`;
      if (this.animation) this.animation.cancel();
      this.animation = this.el.animate({ height: [start, end] }, { duration: DURATION, easing: EASING });
      this.animation.onfinish = () => this.finish(false);
      this.animation.oncancel = () => { this.isClosing = false; };
    }

    open() {
      this.el.style.height = `${this.el.offsetHeight}px`;
      this.el.open = true;
      this.closeSiblings(false);
      window.requestAnimationFrame(() => this.expand());
    }

    expand() {
      this.isClosing = false;
      this.isExpanding = true;
      const start = `${this.el.offsetHeight}px`;
      const end = `${this.summary.offsetHeight + this.content.offsetHeight}px`;
      if (this.animation) this.animation.cancel();
      this.animation = this.el.animate({ height: [start, end] }, { duration: DURATION, easing: EASING });
      this.animation.onfinish = () => this.finish(true);
      this.animation.oncancel = () => { this.isExpanding = false; };
    }

    finish(open) {
      this.el.open = open;
      this.animation = null;
      this.isClosing = false;
      this.isExpanding = false;
      this.el.style.height = '';
      this.el.style.overflow = '';
    }
  }

  function init(root) {
    (root || document).querySelectorAll('.sl-faq__list').forEach((list) => {
      if (list.dataset.slAccordionReady) return;
      list.dataset.slAccordionReady = '1';
      const exclusive = list.hasAttribute('data-accordion-exclusive');
      const items = Array.from(list.querySelectorAll(':scope > .sl-faq__item'));
      const group = [];
      items.forEach((el) => group.push(new Accordion(el, group, exclusive)));
    });
  }

  if (document.readyState !== 'loading') init();
  else document.addEventListener('DOMContentLoaded', () => init());

  // Shopify theme editor: (re)initialise sections as they are re-rendered.
  document.addEventListener('shopify:section:load', (e) => init(e.target));
})();
