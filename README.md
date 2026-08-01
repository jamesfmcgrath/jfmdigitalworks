# JFM Digital Works

Static site built with [Astro](https://astro.build/) and Tailwind CSS.

Requires **Node.js 22+** (see `.nvmrc`; run `nvm use` before install/build).

## Development

```bash
nvm use
pnpm install
pnpm dev
```

## Build

```bash
pnpm build
pnpm preview
```

## Scripts

| Command | Description |
| --- | --- |
| `pnpm dev` | Start dev server |
| `pnpm build` | Build static site to `dist/` |
| `pnpm preview` | Preview production build |
| `pnpm check` | Run Astro type check |
| `pnpm test` | Run tests once |
| `pnpm test:watch` | Run tests in watch mode |

## Environment

Copy `.env.example` to `.env` and set `PUBLIC_WEB3FORMS_KEY` for the contact form (added in a later task).
