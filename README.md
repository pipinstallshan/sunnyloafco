# Sunny Loaf Co. — custom Shopify theme

A premium, mobile-first, conversion-focused theme for **Sunny Loaf Co.** (sunnyloafco.com), a US store selling cat products (window perches, beds, toys, home essentials) to American cat owners. Most traffic arrives from Meta (Instagram/Facebook) ads on mobile, so the theme is designed mobile-first.

It is built on Shopify's open-source **[Horizon](https://github.com/Shopify/horizon)** theme (Theme Blocks architecture) and restyled to the free **Tinker** look: clean product grids, bento-style collection cards, warm cards, and a sticky cart. Horizon's license notice is kept in [`LICENSE.md`](LICENSE.md); the upstream Horizon README is preserved at [`docs/HORIZON-UPSTREAM.md`](docs/HORIZON-UPSTREAM.md).

> **Brand rule reminder:** no bread/bakery/toast/oven/crumbs/dough/wheat imagery or copy anywhere — a "loaf" here is a cat with its paws tucked under. The plural is **loafs**, never "loaves". See `brand-kit.md` / `brand-voice.md` in the handoff for the full brand.

---

## How the repo connects to Shopify

- **Repo:** `pipinstallshan/sunnyloafco` (private).
- **Work branch:** `cursor/sunnyloaf-theme-2328`, connected to the store via **Online Store → Themes → Add theme → Connect from GitHub**. Every push to this branch syncs to the connected theme, so only push working Liquid/JSON.
- `main` holds the base theme; this work lands via a PR from the work branch.
- The theme stays **unpublished** until the owner reviews it. The store is still password-protected, so visitors see the password page (see below).

### Preview without publishing

- In Shopify admin: **Online Store → Themes →** the connected "Sunny Loaf" theme **→ Preview** (eye icon). This never publishes.
- Locally with the Shopify CLI (needs store access): `shopify theme dev --store your-store.myshopify.com`, then open the printed localhost URL. First run opens a browser login.
- A static design preview of the key pages (no Shopify needed) lives in [`docs/preview/`](docs/preview/) — open the `.html` files in a browser. Rendered screenshots are in [`docs/screenshots/`](docs/screenshots/).

---

## Where to set the main things (theme editor)

Open **Online Store → Themes → Customize**.

| What | Where |
|---|---|
| **Logo** | Theme settings → Logo and favicon → *Logo*. If left empty, the header falls back to the bundled `lockup-horizontal.png` automatically. |
| **Favicon** | Theme settings → Logo and favicon → *Favicon*. If empty, falls back to `profile-110.png`. |
| **Colors** | Theme settings → Colors (the palette) and the per-section **Color scheme** picker (Light / Accent / Dark). Defaults are already the brand palette. |
| **Fonts** | Theme settings → Typography → Fraunces (headings) + Figtree (body). Already set. |
| **Announcement bar** | Header → Announcement. Default: *Free US shipping on orders over $49 ☀️*. |
| **Free-shipping threshold** | Theme settings → **Sunny Loaf** → *Free shipping threshold* (default `49`). Also update the real rate in **Settings → Shipping and delivery**. |
| **Variant image behavior** | Theme settings → **Sunny Loaf** → *Move the selected variant's image to the front* (default **off** = keep gallery order, scroll to the variant's image). |
| **Cart upsell** | Theme settings → **Sunny Loaf** → *Upsell products* (leave empty to hide). |
| **Footer contact / socials** | Footer section: email `hello@sunnyloafco.com`, Instagram `@sunnyloafco`, Facebook *Sunny Loaf Co.* |

Logo and favicon are normally uploaded in the editor; the theme ships sensible bundled fallbacks so nothing looks broken before then.

---

## Custom sections (category "Sunny Loaf" in the editor)

| Section | File | What it does |
|---|---|---|
| **Sunny hero** | `sections/sl-hero.liquid` | Image or video background, eyebrow, headline, tagline, subhead, up to two CTAs. Desktop + mobile focal-point and height controls, overlay. Falls back to the bundled hero placeholder. |
| **Why cats love it** | `sections/sl-benefits.liquid` | 1–4 benefit tiles with inline cat/sun/window/paw icons. |
| **Bento collections** | `sections/sl-bento-collections.liquid` | Featured collection cards in a bento grid (first card large), Tinker look. |
| **Loaf of the week** | `sections/sl-loaf-of-the-week.liquid` | One featured product: large image, witty blurb, price, working Add to cart. |
| **Trust & shipping strip** | `sections/sl-trust.liquid` | 1–4 editable trust items (shipping, returns, secure, support) with icons. |
| **Testimonials & UGC** | `sections/sl-testimonials.liquid` | Placeholder testimonials (clearly marked as placeholders in the editor) + an Instagram/UGC photo grid slot. |
| **Email signup** | `sections/sl-email-signup.liquid` | "Join the sunny side" capture via Shopify's customer form. |
| **FAQ accordion** | `sections/sl-faq.liquid` | Collapsible Q&A (shipping, returns, sizing, cat safety). |
| **Recently viewed** | `sections/sl-recently-viewed.liquid` | Client-side recently-viewed products (localStorage), fetched via the Section Rendering API. |
| **Opening soon** | `sections/sl-password.liquid` | Branded password-page content: stacked logo, tagline, email capture, Instagram link, sun glow. |
| **404 content** | `sections/sl-404.liquid` | Witty cat 404 ("This page wandered off to find a sun patch."), search box, shop links. |
| **About / what is a loaf** | `sections/sl-about.liquid` | Explains the cat meaning of "loaf" (never bakery). |

## Custom product-page blocks (category "Sunny Loaf")

| Block | File | What it does |
|---|---|---|
| **Dimensions / spec strip** | `blocks/sl-spec-strip.liquid` | Reads product metafields and hides when empty (see below). |
| **Trust badges** | `blocks/sl-trust-badges.liquid` | Editable badges under the buy button. |
| **Star rating slot** | `blocks/sl-rating.liquid` | Review-app badge target (Judge.me compatible) under the title; optional manual rating from metafields. |
| **Collapsible tabs** | `blocks/sl-product-tabs.liquid` | Features / Details & care / Shipping & returns accordions. |

Shared styles live in `assets/sunnyloaf.css`; brand icons in `snippets/sl-icon.liquid`; the free-shipping bar + upsell in `snippets/sl-cart-extras.liquid`; the gallery scroll-to-variant enhancement in `assets/sl-variant-gallery.js`.

### Product gallery & sticky cart (built on Horizon)

- The mobile gallery swipes **one image per swipe** (`scroll-snap-stop: always`) with dots/thumbnails.
- The **sticky add-to-cart bar** is Horizon's, enabled by default on the product template.
- Recommended products use Horizon's product-recommendations section; recently viewed is the custom section above.

---

## Metafields the spec strip reads

Create these under **Settings → Custom data → Products → Add definition**. Use **namespace and key** exactly as below (type: *Single line text*, one value each). Put the value with its unit, e.g. `22 in`, `40 lb`.

| Field | Namespace | Key | Type |
|---|---|---|---|
| Width | `specs` | `width` | Single line text |
| Height | `specs` | `height` | Single line text |
| Length | `specs` | `length` | Single line text |
| Weight capacity | `specs` | `weight_capacity` | Single line text |
| Material | `specs` | `material` | Single line text |

The spec strip shows only the fields that have a value and hides entirely when all are empty (so products without dimensions, like toys, stay clean). Cat trees/perches are the hero products, so fill these in for them first.

**Optional** (star rating slot manual fallback), namespace `reviews`: `rating` (Rating or decimal) and `rating_count` (Integer). Normally a review app (Judge.me) fills the rating badge instead.

---

## Quality / status

- `shopify theme check` → **0 errors**. The remaining warnings are all in unmodified upstream Horizon files (`sections/header.liquid` settings count, `snippets/divider.liquid` doc params, `snippets/product-media-gallery-content.liquid` complexity) and are left untouched to stay mergeable with Horizon.
- All JSON templates and `settings_schema.json` validate.
- Tested at 390px (mobile) and 1440px (desktop) for homepage, product, collection, cart drawer, password and 404 — see `docs/screenshots/`.

## Left for the owner

- Upload real **logo/favicon** and real **lifestyle product photos** (the hero/bento/loaf-of-week currently use bundled placeholders or collection images).
- Create collections and link them in the **Bento collections** section; pick the **Loaf of the week** product.
- Create product **metafields** (above) and fill them on cat trees/perches.
- Install **Judge.me** when real reviews exist, then add its app block in the product template and confirm the rating slot populates. No fake reviews until then.
- Create an **About page** in admin and assign it the `page.about` template; a page handle `about` matches the header/footer "Our story" links.
- Replace placeholder testimonials with real customer words before launch.
- Set the real **free-shipping rate** in Settings → Shipping to match the $49 threshold, and review shipping/returns copy (editable, not hard-coded).
