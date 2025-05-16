# Unfussy Drupal 11 Theme

Unfussy is a minimalist, accessible, standards-based Drupal 11 theme using plain CSS and no build tools. It is designed to be beautiful, modern, and developer-friendly out of the box.

## Features

- No npm, Tailwind, or build steps
- Single Directory Components (SDC) support
- Plain CSS, optionally scoped per component
- Fully Drupal 11 native (uses stable9 as base)
- Easy to customize and extend

## Quick Start

Place this theme in `web/themes/custom/unfussy/`, then:

```bash
lando drush theme:enable unfussy
lando drush config:set system.theme default unfussy -y
lando drush cr
```

Then begin theming with clean, modern structure.
