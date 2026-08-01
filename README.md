# JFM Digital Works

Static marketing site (Astro). Reference Next.js archive: `jfmdigitalworksv1`.

## Develop

```bash
pnpm install
cp .env.example .env   # set PUBLIC_WEB3FORMS_KEY
pnpm dev
```

## Test / build

```bash
pnpm test
pnpm build
pnpm preview
```

## Deploy to Hostinger

1. Set `PUBLIC_WEB3FORMS_KEY` in the environment used for `pnpm build`
2. Run `pnpm build`
3. Upload contents of `dist/` to the Hostinger document root (public_html)
4. Confirm `/`, mobile nav, contact submit, and 404
