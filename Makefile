
.PHONY: theme watch cr export unlink refresh watch-dev devlink

theme:
	@echo "🔧 Building jfm_theme with npm on host machine..."
	cd ~/Projects/jfm_theme && npm install && npm run build

watch:
	@echo "👀 Watching for changes in jfm_theme..."
	cd ~/Projects/jfm_theme && npm run watch

cr:
	@echo "🧼 Clearing Drupal cache via Lando..."
	lando drush cr

export:
	@echo "📦 Exporting Drupal configuration..."
	lando drush cex -y

unlink:
	@echo "❌ Removing theme symlink... (not used in mount-based setup)"
	@echo "✔ Nothing to unlink. Theme is mounted via .lando.yml."

refresh:
	@echo "🔄 Pulling latest theme version from Git and updating via Lando Composer..."
	lando composer update jamesfmcgrath/jfm_theme
	@echo "✅ Theme updated via Composer."

devlink:
	@echo "🔗 Devlink is no longer needed — the theme is mounted via .lando.yml."
