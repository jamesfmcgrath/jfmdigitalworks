# Astro Static Migration — Design Spec

**Date:** 2026-08-01  
**Repo:** [jamesfmcgrath/jfmdigitalworks](https://github.com/jamesfmcgrath/jfmdigitalworks)  
**Reference (archived Next site):** `~/Projects/jfmdigitalworksv1`

## Goal

Rebuild the JFM Digital Works marketing site as a static Astro site hosted on Hostinger, with the same visual design and content as the current Next.js site, but zero React and minimal client JavaScript.

### Success criteria

- Same homepage content, section order, and branding as the current live site
- Static HTML/CSS/JS output deployable to Hostinger shared hosting (no Node runtime)
- Interactive UI implemented with vanilla JS only (no React)
- Auth/template routes removed
- Contact form continues to work via Web3Forms
- Accessibility baseline preserved (skip link, landmarks, keyboard nav, honeypot, contrast patterns from current CSS)
- Domain registrar move to Cloudflare is out of scope for this cutover (DNS can stay until renewal)

## Non-goals

- Visual redesign
- CMS / blog / multi-page content system
- Server-side rendering or Astro SSR adapters
- Keeping Vercel Analytics / Speed Insights
- Domain or DNS changes beyond pointing Hostinger at the new files when ready

## Approach

**Astro SSG + vanilla islands** (Approach 2 from brainstorming).

Lift-and-shift design/copy from `jfmdigitalworksv1`. Rewrite interactive pieces in plain JavaScript. Ship `dist/` to Hostinger.

## Repo strategy

| Repo | Role |
|------|------|
| `jfmdigitalworksv1` | Archived Next.js / Vercel snapshot — read-only reference for copy, CSS, assets |
| `jfmdigitalworks` | Active Astro site (this repo) |

Local path: `~/Projects/jfmdigitalworks`

## Stack

- Astro 7
- Node.js `>=22.12.0` (see `.nvmrc`)
- TypeScript
- Tailwind CSS 4 (port existing theme / utility patterns)
- Vanilla JS modules for interactivity
- No React, no Next.js, no AOS library

### Environment

| Variable | When | Purpose |
|----------|------|---------|
| `PUBLIC_WEB3FORMS_KEY` | Build time | Public Web3Forms access key (same role as `NEXT_PUBLIC_WEB3FORMS_KEY`) |

## Site structure

Single marketing page plus a 404.

### Homepage section order

1. Skip link → `#main-content`
2. Header (sticky) — Logo \| Services \| Portfolio \| Contact
3. Hero
4. Case studies (portfolio)
5. Services
6. Process
7. Final CTA
8. Contact form
9. Footer

### Routes

| Route | Behavior |
|-------|----------|
| `/` | Homepage |
| `/404` (or Astro default 404) | Not found |
| `/signin`, `/signup`, `/reset-password` | **Not created** |

### SEO / head

Port from current homepage:

- Title: `Fast Web Development for Growing Businesses | JFM Digital Works`
- Meta description (current copy)
- Open Graph / Twitter tags (current values, updated asset paths if needed)
- JSON-LD `ProfessionalService` schema (Westport, County Mayo, IE — per site rules)

## Components & interactivity

Astro `.astro` components for markup. Client JS only where needed.

| Piece | Implementation |
|-------|----------------|
| Header / mobile nav | Astro + small vanilla module (toggle, `aria-expanded`, close on Escape / outside click) |
| Logo | Static SVG/image (port from current) |
| Hero, case studies, process, CTAs, footer | Static Astro markup |
| Services accordion | Prefer native `<details>`/`<summary>`; otherwise vanilla toggle with keyboard support |
| Contact form | Vanilla JS: honeypot, validation, POST to Web3Forms, success/error messaging |
| Motion | CSS transitions only; respect `prefers-reduced-motion`. Do not port AOS |
| Images | Static optimized assets in `public/` (WebP where already present); native `loading="lazy"` |

### Contact form fields (parity)

- Name, email, project type (3 fields max)
- Honeypot field (`botcheck`)
- Submit via `https://api.web3forms.com/submit`
- Fallback message pointing to `hello@jfmdigitalworks.com`

## Styles & assets

- Copy `public/` assets from the reference repo (images, fonts, favicons, etc.)
- Port brand CSS (`jfm-brand.css`, theme utilities, custom fonts) into Astro stylesheets
- Keep existing visual tokens / Tailwind class patterns where practical for visual parity
- Service worker from the Next site is optional/out of scope for v1 unless needed for Hostinger caching; default: omit

## Build & deploy (Hostinger)

1. `pnpm install` / `npm install`
2. Set `PUBLIC_WEB3FORMS_KEY` for production builds
3. `astro build` → output in `dist/`
4. Upload `dist/` contents to Hostinger document root (File Manager, FTP, or Hostinger Git deploy if available)
5. Confirm homepage, anchors, contact submit, 404, and mobile nav on production URL

Astro config: `output: 'static'` (default static site).

## Analytics

- Do not include Vercel Analytics or Speed Insights
- Optional follow-up (not required for launch): Plausible, Cloudflare Web Analytics, or Hostinger analytics

## Reference mapping (from Next site)

| Current (`jfmdigitalworksv1`) | New Astro |
|-------------------------------|-----------|
| `app/(default)/page.tsx` | `src/pages/index.astro` |
| `app/layout.tsx` + default layout | `src/layouts/BaseLayout.astro` |
| `components/*.tsx` (static) | `src/components/*.astro` |
| `components/ui/header.tsx` | `Header.astro` + `src/scripts/nav.ts` |
| `components/contact.tsx` | `Contact.astro` + `src/scripts/contact.ts` |
| `components/accordion.tsx` / services | `<details>` or `src/scripts/accordion.ts` |
| `app/css/*` | `src/styles/*` |
| `public/*` | `public/*` |
| Auth pages | Dropped |

## Risks & mitigations

| Risk | Mitigation |
|------|------------|
| Visual drift during port | Side-by-side compare against live/reference; copy CSS tokens first |
| Accordion a11y regression | Prefer native `<details>`; test keyboard + screen reader |
| Web3Forms key missing at build | Fail form gracefully with email fallback (same as current) |
| Hostinger path/MIME quirks | Verify `dist/` at web root; add `.htaccess` only if Hostinger requires SPA/404 rewrite |

## Approval

Approved in conversation 2026-08-01:

- Goals: performance / less JS, simpler static mental model, Hostinger hosting
- Approach: Astro SSG + vanilla islands
- Scope: lift-and-shift design; drop auth pages
- New repo: `jfmdigitalworks`
