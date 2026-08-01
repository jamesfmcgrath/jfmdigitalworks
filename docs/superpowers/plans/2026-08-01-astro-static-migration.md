# Astro Static Migration Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Rebuild the JFM Digital Works marketing homepage as a static Astro site with vanilla JS islands, deployable to Hostinger as `dist/`.

**Architecture:** Astro 5 static site (`output: 'static'`). Markup lives in `.astro` components. Only mobile nav and contact form load client JS (`src/scripts/*.ts` via `<script>`). Styles and content are ported from `~/Projects/jfmdigitalworksv1`. No React, no Next, no AOS, no auth routes.

**Tech Stack:** Astro 5, TypeScript, Tailwind CSS 4 (`@tailwindcss/vite`), `@tailwindcss/forms`, `@fontsource-variable/inter`, `@fontsource/fira-code`, Vitest (for form/nav unit tests), pnpm.

## Global Constraints

- Reference repo (read-only): `/Users/jamesmcgrath/Projects/jfmdigitalworksv1`
- Working repo: `/Users/jamesmcgrath/Projects/jfmdigitalworks`
- Zero React / Next / AOS dependencies
- Env key name: `PUBLIC_WEB3FORMS_KEY` (build-time)
- Keep Vercel Analytics / Speed Insights out; keep Simple Analytics script for parity with current live site
- Services section is **static cards** (not accordion) — match reference, not the speculative accordion note in the design
- Auth routes (`/signin`, `/signup`, `/reset-password`) must not exist
- Package manager: pnpm
- Commits after each task

## File Structure

| Path | Responsibility |
|------|----------------|
| `astro.config.mjs` | Static Astro + Tailwind Vite plugin |
| `package.json` | Scripts: `dev`, `build`, `preview`, `test` |
| `.gitignore` | Node/Astro ignores (replace Drupal leftovers) |
| `.env.example` | Documents `PUBLIC_WEB3FORMS_KEY` |
| `public/` | Favicons, OG image, robots, sitemap, manifest (no `sw.js`) |
| `src/styles/global.css` | Tailwind entry + `@theme` + brand imports |
| `src/styles/jfm-brand.css` | Port from reference |
| `src/styles/additional-styles/utility-patterns.css` | Port from reference |
| `src/styles/additional-styles/theme.css` | Port; strip AOS-only rules if unused |
| `src/layouts/BaseLayout.astro` | HTML shell, fonts, meta, JSON-LD, Simple Analytics |
| `src/pages/index.astro` | Homepage composition |
| `src/pages/404.astro` | Not found |
| `src/components/Logo.astro` | Brand mark |
| `src/components/Header.astro` | Sticky nav markup |
| `src/components/Hero.astro` | Hero section |
| `src/components/CaseStudies.astro` | Portfolio cards |
| `src/components/Services.astro` | Six service cards |
| `src/components/Process.astro` | Three-step process |
| `src/components/FinalCta.astro` | Blue CTA band |
| `src/components/Contact.astro` | Form markup |
| `src/components/Footer.astro` | Footer |
| `src/components/FooterLogo.astro` | Footer brand |
| `src/scripts/nav.ts` | Mobile menu toggle |
| `src/scripts/contact.ts` | Form validation + Web3Forms submit |
| `src/scripts/contact-validate.ts` | Pure validation helpers (unit-tested) |
| `tests/contact-validate.test.ts` | Vitest for validation |
| `tests/nav.test.ts` | Vitest for nav open/close helpers if extracted |
| `README.md` | Dev + Hostinger deploy notes |

---

### Task 1: Scaffold Astro + Tailwind + project hygiene

**Files:**
- Create: `package.json`, `astro.config.mjs`, `tsconfig.json`, `src/env.d.ts`, `.env.example`, `README.md`
- Replace: `.gitignore`
- Create: `src/pages/index.astro` (placeholder), `src/styles/global.css` (minimal)

**Interfaces:**
- Produces: runnable `pnpm dev` / `pnpm build`; Astro project root conventions

- [ ] **Step 1: Replace Drupal `.gitignore` with Astro/Node ignores**

Write `.gitignore`:

```gitignore
# dependencies
node_modules/

# build
dist/
.astro/

# env
.env
.env.*
!.env.example

# logs / OS / IDE
npm-debug.log*
pnpm-debug.log*
.DS_Store
.idea/
.vscode/
*.tsbuildinfo
```

- [ ] **Step 2: Initialize package.json and install deps**

```bash
cd /Users/jamesmcgrath/Projects/jfmdigitalworks
pnpm init
pnpm add astro @fontsource-variable/inter @fontsource/fira-code
pnpm add -D typescript @types/node vitest jsdom @astrojs/check tailwindcss @tailwindcss/vite @tailwindcss/forms
```

Set `package.json` scripts:

```json
{
  "name": "jfmdigitalworks",
  "type": "module",
  "version": "1.0.0",
  "private": true,
  "scripts": {
    "dev": "astro dev",
    "build": "astro build",
    "preview": "astro preview",
    "check": "astro check",
    "test": "vitest run",
    "test:watch": "vitest"
  }
}
```

- [ ] **Step 3: Add Astro + Tailwind config**

`astro.config.mjs`:

```js
import { defineConfig } from 'astro/config';
import tailwindcss from '@tailwindcss/vite';

export default defineConfig({
  site: 'https://jfmdigitalworks.com',
  output: 'static',
  vite: {
    plugins: [tailwindcss()],
  },
});
```

`tsconfig.json` — extend `astro/tsconfigs/strict`.

`src/env.d.ts`:

```ts
/// <reference types="astro/client" />

interface ImportMetaEnv {
  readonly PUBLIC_WEB3FORMS_KEY?: string;
}

interface ImportMeta {
  readonly env: ImportMetaEnv;
}
```

`.env.example`:

```bash
PUBLIC_WEB3FORMS_KEY=your_web3forms_access_key
```

- [ ] **Step 4: Minimal page + CSS so build works**

`src/styles/global.css`:

```css
@import 'tailwindcss';
@plugin "@tailwindcss/forms" {
  strategy: base;
}
```

`src/pages/index.astro`:

```astro
---
import '../styles/global.css';
---
<html lang="en">
  <head>
    <meta charset="utf-8" />
    <title>JFM Digital Works</title>
  </head>
  <body class="bg-gray-100 text-gray-800">
    <h1 class="p-8 text-2xl font-bold">JFM Digital Works</h1>
  </body>
</html>
```

- [ ] **Step 5: Verify scaffold**

Run: `pnpm build`  
Expected: exit 0; `dist/index.html` exists.

- [ ] **Step 6: Commit**

```bash
git add -A
git commit -m "$(cat <<'EOF'
chore: scaffold Astro static site with Tailwind 4

EOF
)"
```

---

### Task 2: Port styles and public assets

**Files:**
- Create: `src/styles/jfm-brand.css`, `src/styles/additional-styles/utility-patterns.css`, `src/styles/additional-styles/theme.css`
- Modify: `src/styles/global.css`
- Create: `public/**` (selective copy from reference)

**Interfaces:**
- Consumes: Task 1 scaffold
- Produces: CSS tokens/utilities matching reference; essential static assets under `/images`, `/favicon.ico`, etc.

- [ ] **Step 1: Copy CSS from reference**

```bash
REF=/Users/jamesmcgrath/Projects/jfmdigitalworksv1
cp "$REF/app/css/jfm-brand.css" src/styles/jfm-brand.css
mkdir -p src/styles/additional-styles
cp "$REF/app/css/additional-styles/utility-patterns.css" src/styles/additional-styles/
cp "$REF/app/css/additional-styles/theme.css" src/styles/additional-styles/
```

Do **not** copy `critical.css` (unused orphan).

- [ ] **Step 2: Port `style.css` into `global.css` with fontsource imports**

Replace `src/styles/global.css` with:

```css
@import '@fontsource-variable/inter/wght.css';
@import '@fontsource/fira-code/400.css';
@import '@fontsource/fira-code/500.css';
@import '@fontsource/fira-code/600.css';
@import '@fontsource/fira-code/700.css';

@import 'tailwindcss';
@import './jfm-brand.css';
@import './additional-styles/utility-patterns.css' layer(components);
@import './additional-styles/theme.css';

@plugin "@tailwindcss/forms" {
  strategy: base;
}

@theme {
  --font-inter: 'Inter Variable', Inter, -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
  --font-mono: 'Fira Code', 'Monaco', 'Cascadia Code', 'Roboto Mono', monospace;

  --color-jfm-charcoal: #0e1116;
  --color-jfm-blue: #1e90ff;
  --color-jfm-light: #f1f5f9;
  --color-jfm-muted: #94a3b8;

  --color-blue-500: #1a73e8;
  --color-blue-600: #1557b3;
  --color-blue-400: #4285f4;
  --color-blue-300: #6fa8f5;

  --color-accessible-blue: #1a73e8;
  --color-accessible-blue-hover: #1557b3;
  --color-accessible-text-light: #ffffff;
  --color-accessible-text-dark: #0e1116;

  --color-gray-800: #0e1116;
  --color-gray-700: #1f2937;
  --color-gray-600: #374151;
  --color-gray-500: #6b7280;
  --color-gray-400: #9ca3af;
  --color-gray-300: #d1d5db;
  --color-gray-200: #e5e7eb;
  --color-gray-100: #f1f5f9;
  --color-gray-50: #f8fafc;
}
```

Also copy the remaining `@theme` type-scale tokens from `$REF/app/css/style.css` (`--text-xs` through `--text-6xl` and any `--breakpoint-*` / font-size utilities still present there) so typography matches.

In `theme.css`, remove unused AOS keyframes (`zoom-y-out`) and auth demo keyframes if nothing references them after the port — optional cleanup, do not break utility classes used by homepage sections.

- [ ] **Step 3: Copy essential public assets**

```bash
REF=/Users/jamesmcgrath/Projects/jfmdigitalworksv1
mkdir -p public/images
cp "$REF/public/favicon.ico" public/
cp "$REF/public/robots.txt" public/
cp "$REF/public/sitemap.xml" public/
cp "$REF/public/manifest.json" public/
cp "$REF/public/images/og-preview.png" public/images/
cp "$REF/public/images/android-chrome-192x192.png" public/images/
cp "$REF/public/images/android-chrome-512x512.png" public/images/
cp "$REF/public/images/apple-touch-icon.png" public/images/
cp "$REF/public/images/favicon-16x16.png" public/images/
cp "$REF/public/images/favicon-32x32.png" public/images/
cp "$REF/public/images/logo-192.png" public/images/
cp "$REF/public/images/logo-512.png" public/images/
# Prefer root favicon.ico already copied; images/favicon.ico optional
```

Do **not** copy `sw.js` (service worker out of scope). Skip unused template art (planet, avatars, auth-bg, logo-0x) unless a ported component references them.

- [ ] **Step 4: Verify build still passes**

Run: `pnpm build`  
Expected: exit 0.

- [ ] **Step 5: Commit**

```bash
git add -A
git commit -m "$(cat <<'EOF'
feat: port brand CSS and public assets from Next site

EOF
)"
```

---

### Task 3: BaseLayout with SEO, JSON-LD, fonts

**Files:**
- Create: `src/layouts/BaseLayout.astro`
- Modify: `src/pages/index.astro` (use layout)

**Interfaces:**
- Consumes: `src/styles/global.css`, public icons/OG
- Produces: `BaseLayout` with props `{ title?: string; description?: string }` wrapping `<slot />`

- [ ] **Step 1: Create BaseLayout**

```astro
---
import interVar from '@fontsource-variable/inter/wght.css?url';
import '../styles/global.css';

interface Props {
  title?: string;
  description?: string;
}

const title =
  Astro.props.title ??
  'Fast Web Development for Growing Businesses | JFM Digital Works';
const description =
  Astro.props.description ??
  'Secure, accessible web development with 100+ projects delivered. Drupal, React, WordPress expertise. WCAG compliance guaranteed. Based in Ireland, serving EU. Free discovery call.';

const jsonLd = {
  '@context': 'https://schema.org',
  '@type': 'ProfessionalService',
  name: 'JFM Digital Works',
  description:
    'Web development, security audits, and accessibility services for enterprise and government',
  url: 'https://jfmdigitalworks.com',
  telephone: '+353-87-399-9751',
  email: 'hello@jfmdigitalworks.com',
  address: {
    '@type': 'PostalAddress',
    addressLocality: 'Westport',
    addressRegion: 'County Mayo',
    addressCountry: 'IE',
  },
  geo: {
    '@type': 'GeoCoordinates',
    latitude: 53.8008,
    longitude: -9.5218,
  },
  areaServed: [
    { '@type': 'Country', name: 'Ireland' },
    { '@type': 'Country', name: 'United Kingdom' },
    { '@type': 'Place', name: 'European Union' },
  ],
  priceRange: '€€€',
  knowsAbout: [
    'Drupal Development',
    'React Development',
    'WordPress Development',
    'Web Accessibility',
    'WCAG Compliance',
    'Web Security',
    'Platform Migration',
  ],
  sameAs: [
    'https://www.linkedin.com/in/james-mcgrath-web-development',
    'https://github.com/jamesfmcgrath',
  ],
};
---
<!doctype html>
<html lang="en" class="scroll-smooth">
  <head>
    <meta charset="utf-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1, maximum-scale=5" />
    <title>{title}</title>
    <meta name="description" content={description} />
    <meta
      name="keywords"
      content="web developer Ireland, Drupal developer, accessibility audit, security audit, WCAG compliance, emergency web developer, web development Ireland, Drupal developer Ireland, fix drupal security issues Ireland, migrate drupal 7 to drupal 11, wordpress security audit Ireland"
    />
    <link rel="canonical" href="https://jfmdigitalworks.com" />
    <meta name="theme-color" content="#6366f1" />
    <meta name="color-scheme" content="light dark" />
    <link rel="manifest" href="/manifest.json" />
    <link rel="apple-touch-icon" href="/images/apple-touch-icon.png" />
    <link rel="icon" type="image/png" sizes="192x192" href="/images/android-chrome-192x192.png" />
    <link rel="icon" type="image/png" sizes="512x512" href="/images/android-chrome-512x512.png" />
    <meta property="og:title" content="Fast Web Development | JFM Digital Works" />
    <meta
      property="og:description"
      content="100+ projects delivered. Drupal, React, WordPress. WCAG compliance. Based in Ireland."
    />
    <meta property="og:url" content="https://jfmdigitalworks.com" />
    <meta property="og:site_name" content="JFM Digital Works" />
    <meta property="og:locale" content="en_IE" />
    <meta property="og:type" content="website" />
    <meta property="og:image" content="https://jfmdigitalworks.com/images/og-preview.png" />
    <meta property="og:image:width" content="1200" />
    <meta property="og:image:height" content="630" />
    <meta name="twitter:card" content="summary_large_image" />
    <meta name="twitter:title" content="Fast Web Development | JFM Digital Works" />
    <meta
      name="twitter:description"
      content="100+ projects delivered. Drupal, React, WordPress expertise."
    />
    <meta name="twitter:image" content="https://jfmdigitalworks.com/images/og-preview.png" />
    <link rel="preconnect" href="https://api.web3forms.com" />
    <link rel="dns-prefetch" href="https://api.web3forms.com" />
    <script type="application/ld+json" set:html={JSON.stringify(jsonLd)} />
  </head>
  <body class="bg-gray-100 font-inter tracking-tight text-gray-800 antialiased">
    <div class="flex min-h-screen flex-col overflow-hidden supports-[overflow:clip]:overflow-clip">
      <slot />
    </div>
    <script async src="https://scripts.simpleanalyticscdn.com/latest.js"></script>
  </body>
</html>
```

Note: font CSS is already imported via `global.css`; remove unused `interVar` import if fonts load from global only — prefer the `global.css` `@import` approach from Task 2 and delete the unused `interVar` line.

- [ ] **Step 2: Point index at layout**

```astro
---
import BaseLayout from '../layouts/BaseLayout.astro';
---
<BaseLayout>
  <main id="main-content" role="main" class="grow">
    <p class="p-8">Layout OK</p>
  </main>
</BaseLayout>
```

- [ ] **Step 3: Verify**

Run: `pnpm build && rg -n "ProfessionalService|og:title|simpleanalytics" dist/index.html`  
Expected: matches for JSON-LD type, OG tag, and Simple Analytics script.

- [ ] **Step 4: Commit**

```bash
git add -A
git commit -m "$(cat <<'EOF'
feat: add BaseLayout with SEO metadata and JSON-LD

EOF
)"
```

---

### Task 4: Static section components (Hero → Footer)

**Files:**
- Create: `src/components/Logo.astro`, `Hero.astro`, `CaseStudies.astro`, `Services.astro`, `Process.astro`, `FinalCta.astro`, `FooterLogo.astro`, `Footer.astro`
- Modify: `src/pages/index.astro`

**Interfaces:**
- Consumes: `BaseLayout`, ported CSS utility classes
- Produces: static Astro components with same section `id`s: `portfolio`, `services`, `contact` (contact shell deferred to Task 6 — leave a placeholder comment or empty `#contact` target only after Contact ships; for this task wire everything except Contact)

**Port rule:** Convert each reference `.tsx` file to `.astro` by:
1. Removing React imports/`export default`
2. Changing `className=` → `class=`
3. Changing `htmlFor=` → `for=`
4. Keeping JSX-like markup valid in Astro (self-close void tags)
5. Inlining SVG icons as in reference
6. Replacing Next `Link` with `<a href="/">`

Source paths (copy markup/content verbatim from):

| Astro | Reference |
|-------|-----------|
| `Logo.astro` | `components/ui/logo.tsx` |
| `Hero.astro` | `components/hero-home.tsx` |
| `CaseStudies.astro` | `components/case-studies.tsx` |
| `Services.astro` | `components/services.tsx` |
| `Process.astro` | `components/process.tsx` |
| `FinalCta.astro` | `components/final-cta.tsx` |
| `FooterLogo.astro` | `components/ui/footer-logo.tsx` |
| `Footer.astro` | `components/ui/footer.tsx` (`border={true}` → always include top border classes used on homepage) |

- [ ] **Step 1: Port Logo, Hero, CaseStudies, Services**

Create the four components from the reference files using the port rule above.

- [ ] **Step 2: Port Process, FinalCta, FooterLogo, Footer**

Same rule. Footer social links and mailto must match reference.

- [ ] **Step 3: Compose homepage (without Contact / Header yet)**

`src/pages/index.astro`:

```astro
---
import BaseLayout from '../layouts/BaseLayout.astro';
import Hero from '../components/Hero.astro';
import CaseStudies from '../components/CaseStudies.astro';
import Services from '../components/Services.astro';
import Process from '../components/Process.astro';
import FinalCta from '../components/FinalCta.astro';
import Footer from '../components/Footer.astro';
---
<BaseLayout>
  <a
    href="#main-content"
    class="sr-only focus:not-sr-only focus:absolute focus:top-4 focus:left-4 focus:z-50 focus:rounded focus:bg-blue-600 focus:px-4 focus:py-2 focus:text-white focus:outline-none focus:ring-4 focus:ring-blue-300"
  >
    Skip to main content
  </a>
  <main id="main-content" role="main" class="grow">
    <Hero />
    <CaseStudies />
    <Services />
    <Process />
    <FinalCta />
  </main>
  <Footer />
</BaseLayout>
```

- [ ] **Step 4: Verify section anchors exist**

Run: `pnpm build && rg -n 'id="(portfolio|services|hero-heading|process-heading|cta-heading)"' dist/index.html`  
Expected: all five ids present.

- [ ] **Step 5: Visual smoke check**

Run: `pnpm preview`  
Open `http://localhost:4321` and confirm sections render without React errors (static HTML).

- [ ] **Step 6: Commit**

```bash
git add -A
git commit -m "$(cat <<'EOF'
feat: port static homepage sections to Astro

EOF
)"
```

---

### Task 5: Header + vanilla mobile nav

**Files:**
- Create: `src/components/Header.astro`, `src/scripts/nav.ts`, `tests/nav.test.ts`
- Modify: `src/pages/index.astro` (insert Header)
- Create or modify: `vitest.config.ts`

**Interfaces:**
- Consumes: `Logo.astro`
- Produces:
  - `initNav(root?: ParentNode): void` in `nav.ts`
  - DOM contract: `[data-nav-toggle]`, `[data-nav-panel]`, `[data-nav-icon-open]`, `[data-nav-icon-close]`

- [ ] **Step 1: Write failing nav tests**

`vitest.config.ts`:

```ts
import { defineConfig } from 'vitest/config';

export default defineConfig({
  test: {
    environment: 'jsdom',
  },
});
```

`src/scripts/nav.ts` (export helpers under test — implement in Step 3):

```ts
export function setNavOpen(
  toggle: HTMLElement,
  panel: HTMLElement,
  openIcon: HTMLElement,
  closeIcon: HTMLElement,
  open: boolean,
): void {
  toggle.setAttribute('aria-expanded', open ? 'true' : 'false');
  panel.hidden = !open;
  openIcon.hidden = open;
  closeIcon.hidden = !open;
}
```

`tests/nav.test.ts`:

```ts
import { describe, expect, it } from 'vitest';
import { setNavOpen } from '../src/scripts/nav';

function el(tag = 'div') {
  return document.createElement(tag);
}

describe('setNavOpen', () => {
  it('opens the menu', () => {
    const toggle = el('button');
    const panel = el();
    const openIcon = el();
    const closeIcon = el();
    setNavOpen(toggle, panel, openIcon, closeIcon, true);
    expect(toggle.getAttribute('aria-expanded')).toBe('true');
    expect(panel.hidden).toBe(false);
    expect(openIcon.hidden).toBe(true);
    expect(closeIcon.hidden).toBe(false);
  });

  it('closes the menu', () => {
    const toggle = el('button');
    const panel = el();
    const openIcon = el();
    const closeIcon = el();
    setNavOpen(toggle, panel, openIcon, closeIcon, false);
    expect(toggle.getAttribute('aria-expanded')).toBe('false');
    expect(panel.hidden).toBe(true);
  });
});
```

- [ ] **Step 2: Run tests — expect fail until implemented**

Run: `pnpm test`  
Expected: FAIL (module missing or function missing) on first run before Step 3; after scaffolding empty export, FAIL on assertions if stubs wrong — implement in Step 3 until PASS.

- [ ] **Step 3: Implement `nav.ts` fully**

```ts
export function setNavOpen(
  toggle: HTMLElement,
  panel: HTMLElement,
  openIcon: HTMLElement,
  closeIcon: HTMLElement,
  open: boolean,
): void {
  toggle.setAttribute('aria-expanded', open ? 'true' : 'false');
  panel.hidden = !open;
  openIcon.hidden = open;
  closeIcon.hidden = !open;
}

export function initNav(root: ParentNode = document): void {
  const toggle = root.querySelector<HTMLElement>('[data-nav-toggle]');
  const panel = root.querySelector<HTMLElement>('[data-nav-panel]');
  const openIcon = root.querySelector<HTMLElement>('[data-nav-icon-open]');
  const closeIcon = root.querySelector<HTMLElement>('[data-nav-icon-close]');
  if (!toggle || !panel || !openIcon || !closeIcon) return;

  let open = false;
  setNavOpen(toggle, panel, openIcon, closeIcon, false);

  const close = () => {
    open = false;
    setNavOpen(toggle, panel, openIcon, closeIcon, false);
  };

  toggle.addEventListener('click', () => {
    open = !open;
    setNavOpen(toggle, panel, openIcon, closeIcon, open);
  });

  panel.querySelectorAll('a').forEach((link) => {
    link.addEventListener('click', close);
  });

  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') close();
  });
}

initNav();
```

- [ ] **Step 4: Port Header markup from reference `ui/header.tsx`**

Use `Logo.astro`. Always render the mobile toggle (no React `mounted` gate). Wire data attributes. Import script:

```astro
---
import Logo from './Logo.astro';
---
<header role="banner" class="fixed top-2 z-30 w-full md:top-6">
  <!-- port glass bar + desktop nav from reference -->
  <!-- mobile button: data-nav-toggle, aria-controls="mobile-nav", aria-expanded="false" -->
  <!-- panel: id="mobile-nav" data-nav-panel hidden -->
  <!-- two SVGs or paths with data-nav-icon-open / data-nav-icon-close -->
</header>
<script>
  import { initNav } from '../scripts/nav.ts';
  initNav();
</script>
```

Exact class strings and link targets (`#services`, `#portfolio`, `#contact`) must match reference. Prefer a single bundled `<script>` that calls `initNav` — if top-level `initNav()` in `nav.ts` double-runs, remove the bottom `initNav()` call and only invoke from the component script.

- [ ] **Step 5: Insert Header in `index.astro` above `<main>`**

- [ ] **Step 6: Run tests + build**

Run: `pnpm test && pnpm build`  
Expected: tests PASS; `dist` contains header markup and a hashed JS chunk for nav.

- [ ] **Step 7: Manual check**

`pnpm preview` → resize to mobile → toggle opens/closes, Escape closes, link click closes.

- [ ] **Step 8: Commit**

```bash
git add -A
git commit -m "$(cat <<'EOF'
feat: add header with vanilla mobile navigation

EOF
)"
```

---

### Task 6: Contact form + Web3Forms (vanilla)

**Files:**
- Create: `src/scripts/contact-validate.ts`, `src/scripts/contact.ts`, `src/components/Contact.astro`, `tests/contact-validate.test.ts`
- Modify: `src/pages/index.astro`

**Interfaces:**
- Consumes: `PUBLIC_WEB3FORMS_KEY` via `import.meta.env.PUBLIC_WEB3FORMS_KEY`
- Produces:
  - `validateContact({ name, email, projectType, botcheck }): { ok: true } | { ok: false; message: string }`
  - `buildWeb3FormsPayload(...): object`
  - `initContactForm(form: HTMLFormElement): void`

- [ ] **Step 1: Write failing validation tests**

`src/scripts/contact-validate.ts` — declare exports (implement Step 3):

```ts
export type ContactFields = {
  name: string;
  email: string;
  projectType: string;
  botcheck: boolean;
};

export type ValidateResult =
  | { ok: true }
  | { ok: false; message: string };

export function validateContact(fields: ContactFields): ValidateResult {
  throw new Error('not implemented');
}

export function buildWeb3FormsPayload(
  accessKey: string,
  fields: Omit<ContactFields, 'botcheck'>,
) {
  return {
    access_key: accessKey,
    name: fields.name,
    email: fields.email,
    subject: `New Contact Form Submission: ${fields.projectType}`,
    message: `Project Type: ${fields.projectType}\n\nSubmitted via contact form on jfmdigitalworks.com`,
    from_name: 'JFM Digital Works Contact Form',
  };
}
```

`tests/contact-validate.test.ts`:

```ts
import { describe, expect, it } from 'vitest';
import {
  buildWeb3FormsPayload,
  validateContact,
} from '../src/scripts/contact-validate';

describe('validateContact', () => {
  it('rejects honeypot', () => {
    const r = validateContact({
      name: 'Ada',
      email: 'ada@example.com',
      projectType: 'Rapid Web Development',
      botcheck: true,
    });
    expect(r.ok).toBe(false);
    if (!r.ok) expect(r.message).toMatch(/Spam/i);
  });

  it('rejects short name', () => {
    const r = validateContact({
      name: 'A',
      email: 'ada@example.com',
      projectType: 'Rapid Web Development',
      botcheck: false,
    });
    expect(r.ok).toBe(false);
  });

  it('rejects bad email', () => {
    const r = validateContact({
      name: 'Ada',
      email: 'not-an-email',
      projectType: 'Rapid Web Development',
      botcheck: false,
    });
    expect(r.ok).toBe(false);
  });

  it('accepts valid fields', () => {
    const r = validateContact({
      name: 'Ada Lovelace',
      email: 'ada@example.com',
      projectType: 'Rapid Web Development',
      botcheck: false,
    });
    expect(r).toEqual({ ok: true });
  });
});

describe('buildWeb3FormsPayload', () => {
  it('shapes payload like the Next site', () => {
    expect(
      buildWeb3FormsPayload('KEY', {
        name: 'Ada',
        email: 'ada@example.com',
        projectType: 'Rapid Web Development',
      }),
    ).toEqual({
      access_key: 'KEY',
      name: 'Ada',
      email: 'ada@example.com',
      subject: 'New Contact Form Submission: Rapid Web Development',
      message:
        'Project Type: Rapid Web Development\n\nSubmitted via contact form on jfmdigitalworks.com',
      from_name: 'JFM Digital Works Contact Form',
    });
  });
});
```

- [ ] **Step 2: Run tests — expect fail**

Run: `pnpm test`  
Expected: FAIL on `not implemented` / failing assertions.

- [ ] **Step 3: Implement `validateContact`**

```ts
export function validateContact(fields: ContactFields): ValidateResult {
  if (fields.botcheck) {
    return { ok: false, message: 'Spam detected. Please try again.' };
  }
  if (!fields.name || fields.name.trim().length < 2) {
    return { ok: false, message: 'Please enter a valid name.' };
  }
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!emailRegex.test(fields.email)) {
    return { ok: false, message: 'Please enter a valid email address.' };
  }
  if (!fields.projectType) {
    return { ok: false, message: 'Please select a project type.' };
  }
  return { ok: true };
}
```

- [ ] **Step 4: Run tests — expect pass**

Run: `pnpm test`  
Expected: PASS.

- [ ] **Step 5: Implement `contact.ts` submit wiring**

```ts
import {
  buildWeb3FormsPayload,
  validateContact,
} from './contact-validate';

export function initContactForm(form: HTMLFormElement): void {
  const status = form.querySelector<HTMLElement>('[data-contact-status]');
  const submitBtn = form.querySelector<HTMLButtonElement>('[data-contact-submit]');
  if (!status || !submitBtn) return;

  const setStatus = (message: string, ok: boolean) => {
    status.hidden = false;
    status.textContent = message;
    status.dataset.state = ok ? 'success' : 'error';
    status.className = ok
      ? 'rounded-md border border-green-200 bg-green-50 p-4 text-green-800'
      : 'rounded-md border border-red-200 bg-red-50 p-4 text-red-800';
  };

  form.addEventListener('submit', async (e) => {
    e.preventDefault();
    status.hidden = true;

    const data = new FormData(form);
    const fields = {
      name: String(data.get('name') ?? ''),
      email: String(data.get('email') ?? ''),
      projectType: String(data.get('projectType') ?? ''),
      botcheck: data.get('botcheck') === 'on' || data.get('botcheck') === 'true',
    };

    const validated = validateContact(fields);
    if (!validated.ok) {
      setStatus(validated.message, false);
      return;
    }

    const accessKey = import.meta.env.PUBLIC_WEB3FORMS_KEY;
    if (!accessKey) {
      setStatus(
        'Contact form is not properly configured. Please try again later or email hello@jfmdigitalworks.com directly.',
        false,
      );
      return;
    }

    submitBtn.disabled = true;
    submitBtn.textContent = 'Sending...';

    try {
      const response = await fetch('https://api.web3forms.com/submit', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Accept: 'application/json',
        },
        body: JSON.stringify(
          buildWeb3FormsPayload(accessKey, {
            name: fields.name,
            email: fields.email,
            projectType: fields.projectType,
          }),
        ),
      });
      const result = await response.json();
      if (response.ok && result.success) {
        setStatus("Thanks! I'll respond within 24 hours.", true);
        form.reset();
      } else {
        setStatus(
          result?.message ||
            'Something went wrong. Please try again or email hello@jfmdigitalworks.com directly.',
          false,
        );
      }
    } catch {
      setStatus(
        'Network error. Please check your connection and try again, or email hello@jfmdigitalworks.com directly.',
        false,
      );
    } finally {
      submitBtn.disabled = false;
      submitBtn.textContent = 'Send Message';
    }
  });
}
```

- [ ] **Step 6: Port Contact.astro markup from reference `contact.tsx`**

Same fields/options/classes. Status element:

```html
<div data-contact-status role="alert" aria-live="polite" hidden></div>
```

Submit button: native `<button type="submit" data-contact-submit class="... min-h-[44px] w-full">Send Message</button>` (no React AccessibleButton).

Script at bottom of component:

```astro
<script>
  import { initContactForm } from '../scripts/contact.ts';
  const form = document.querySelector<HTMLFormElement>('[data-contact-form]');
  if (form) initContactForm(form);
</script>
```

Add `data-contact-form` on the `<form>`.

- [ ] **Step 7: Insert `<Contact />` before `</main>` in `index.astro`**

- [ ] **Step 8: Verify**

Run: `pnpm test && pnpm build`  
Expected: PASS; form fields `name`, `email`, `projectType`, `botcheck` present in `dist/index.html`.

Optional live check: copy key from reference `.env.local` into `.env` as `PUBLIC_WEB3FORMS_KEY`, `pnpm preview`, submit once.

- [ ] **Step 9: Commit**

```bash
git add -A
git commit -m "$(cat <<'EOF'
feat: add vanilla Web3Forms contact section

EOF
)"
```

Do **not** commit `.env`.

---

### Task 7: 404 page + README deploy notes + final verification

**Files:**
- Create: `src/pages/404.astro`
- Modify: `README.md`
- Modify: `public/robots.txt` / `sitemap.xml` only if paths need updating (verify they already point at `https://jfmdigitalworks.com`)

**Interfaces:**
- Consumes: `BaseLayout`
- Produces: Hostinger-ready `dist/`; documented deploy steps

- [ ] **Step 1: Add 404 page**

```astro
---
import BaseLayout from '../layouts/BaseLayout.astro';
---
<BaseLayout title="Page Not Found | JFM Digital Works">
  <main class="grow px-4 py-24 text-center" role="main">
    <h1 class="mb-4 text-3xl font-bold text-gray-900">Page not found</h1>
    <p class="mb-8 text-gray-600">That page doesn’t exist.</p>
    <a href="/" class="btn-sm bg-blue-500 text-white hover:bg-blue-600">Back to home</a>
  </main>
</BaseLayout>
```

- [ ] **Step 2: Write README**

Include:

```markdown
# JFM Digital Works

Static marketing site (Astro). Reference Next.js archive: `jfmdigitalworksv1`.

## Develop

pnpm install
cp .env.example .env   # set PUBLIC_WEB3FORMS_KEY
pnpm dev

## Test / build

pnpm test
pnpm build
pnpm preview

## Deploy to Hostinger

1. Set `PUBLIC_WEB3FORMS_KEY` in the environment used for `pnpm build`
2. Run `pnpm build`
3. Upload contents of `dist/` to the Hostinger document root (public_html)
4. Confirm `/`, mobile nav, contact submit, and 404
```

- [ ] **Step 3: Full verification checklist**

Run:

```bash
pnpm test
pnpm build
pnpm check
```

Manual / `rg` checks on `dist/`:

- [ ] No `/signin` `/signup` routes in `dist`
- [ ] Skip link, `#services`, `#portfolio`, `#contact` present
- [ ] JSON-LD `ProfessionalService` present
- [ ] No `react` / `next` in `package.json` dependencies
- [ ] JS payload limited to nav + contact chunks (inspect `dist/_astro/*.js` sizes roughly)

- [ ] **Step 4: Commit**

```bash
git add -A
git commit -m "$(cat <<'EOF'
feat: add 404 page and Hostinger deploy docs

EOF
)"
```

---

## Spec coverage (self-review)

| Spec requirement | Task |
|------------------|------|
| Astro SSG + vanilla islands | 1, 5, 6 |
| Lift-and-shift design/content | 2, 4 |
| Drop auth routes | 4–7 (never created); verified Task 7 |
| Hostinger `dist/` deploy | 7 |
| Web3Forms + honeypot | 6 |
| SEO / JSON-LD / OG | 3 |
| No Vercel Analytics | 3 (omitted); Simple Analytics kept |
| No AOS / React | Global + Tasks 1–6 |
| Accessibility baseline | 4–6 (skip link, landmarks, aria, honeypot) |
| Cloudflare registrar move out of scope | README / non-goal |

**Note vs design:** Services use static cards (matches live Next site). Accordion not implemented — correct for lift-and-shift.

## Placeholder / consistency check

- Env key consistently `PUBLIC_WEB3FORMS_KEY`
- `initNav` / `setNavOpen` / `validateContact` / `buildWeb3FormsPayload` / `initContactForm` names stable across tasks
- No TBD steps remaining
