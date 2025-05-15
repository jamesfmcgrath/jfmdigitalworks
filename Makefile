
.PHONY: theme watch cr export

theme:
	@echo "🔧 Building jfm_theme with npm on host machine..."
	cd web/themes/contrib/jfm_theme && npm install && npm run build

watch:
	@echo "👀 Watching for changes in jfm_theme..."
	cd web/themes/contrib/jfm_theme && npm run watch

cr:
	@echo "🧼 Clearing Drupal cache via Lando..."
	lando drush cr

export:
	@echo "📦 Exporting Drupal configuration..."
	lando drush cex -y
