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

GitHub Actions workflow (manual): **Actions → Deploy to Hostinger → Run workflow**.

- Defaults to **dry run** (`dry_run=true`). Set `dry_run=false` for a real deploy.
- Requires repo secrets: `SSH_KEY`, `SSH_HOST`, `SSH_USER`, `SSH_PORT`, `DEPLOY_PATH`, `PUBLIC_WEB3FORMS_KEY`
- `DEPLOY_PATH` must be `/home/<user>/domains/jfmdigitalworks.com/public_html`

Manual alternative:

1. Set `PUBLIC_WEB3FORMS_KEY` and run `pnpm build`
2. Upload `dist/` to Hostinger `public_html` (include `.htaccess`)
3. Confirm `/`, mobile nav, contact submit, and 404

Production builds require `PUBLIC_WEB3FORMS_KEY`; without it, the contact form logs a configuration warning and cannot submit.
