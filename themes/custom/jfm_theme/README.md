# JFM Theme

A custom Drupal 11 theme using **Tailwind CSS**, **Gulp**, and **modern front-end tooling**. Built to be clean, accessible, and developer-friendly.

---

## 📦 Prerequisites

- [Node.js](https://nodejs.org/) `18.x` or `20.x` (LTS recommended)
- [npm](https://www.npmjs.com/) `9.x` or higher
- Drupal 11 site running locally (e.g. via Lando)
- [Gulp CLI](https://gulpjs.com/) (optional)

---

## 🚀 Setup

From your theme directory:

```bash
cd themes/custom/jfm_theme
npm install
```

This will install Tailwind CSS, PostCSS, Gulp, and all required dev dependencies.

---

## 🛠 Available Commands

### One-time build

```bash
npm run build
```

Compiles Tailwind CSS and concatenates JS into the `dist/` folder.

### Watch for changes

```bash
npm run watch
```

Continuously watches `assets/css/` and `assets/js/` for changes and rebuilds automatically.

---

## 🧾 File Structure

```
jfm_theme/
├── assets/
│   ├── css/            → Tailwind source file (tailwind.css)
│   ├── js/             → Custom JS files
│   └── images/
├── components/         → Twig components (optional)
├── dist/               → Output CSS/JS (DO NOT EDIT)
├── templates/          → Drupal templates
├── gulpfile.js         → Gulp tasks
├── package.json        → NPM dependencies and scripts
├── postcss.config.js   → PostCSS plugins
├── tailwind.config.js  → Tailwind custom config
└── jfm_theme.info.yml  → Drupal theme config
```

---

## ✅ Enabling the Theme

Use Drush to enable and set it as the default:

```bash
drush theme:enable jfm_theme
drush config:set system.theme default jfm_theme
```

Or enable via the Drupal admin UI.

---

## ♿ Accessibility

This theme prioritizes:
- Semantic HTML
- WCAG-compliant color contrast
- Keyboard navigation
- Screen reader friendliness

---

## 📘 Notes

- `dist/` folder is **built**, not committed. Add it to `.gitignore`.
- Use [nvm](https://github.com/nvm-sh/nvm) to pin your Node version.
- The build tools run on your **host machine**, not inside Lando.

---

## 📮 Feedback

Created by James McGrath · [jamesfmcgrath.org](https://jamesfmcgrath.org)
