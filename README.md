# JFM Digital Works

Static marketing site (Astro). Reference Next.js archive: `jfmdigitalworksv1`.

## Develop

Requires Node.js 22 or newer. If you use nvm, select the project version first:

```bash
nvm use
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
3. Upload contents of `dist/` to the Hostinger document root (`public_html`), including the generated `.htaccess`
4. Confirm Hostinger allows the `.htaccess` directive `ErrorDocument 404 /404.html`
5. Confirm `/`, mobile nav, contact submit, and 404

Production builds require `PUBLIC_WEB3FORMS_KEY`; without it, the contact form logs a configuration warning and cannot submit.
