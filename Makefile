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

devlink:
	@echo "🔗 Symlinking theme for local development..."
	./devlink.sh

unlink:
	@echo "❌ Removing theme symlink..."
	rm -rf web/themes/contrib/jfm_theme
	@echo "✅ Symlink removed."

refresh:
	@echo "🔄 Pulling latest theme version from Git and updating via Lando Composer..."
	lando composer update jamesfmcgrath/jfm_theme
	@echo "✅ Theme updated via Composer."

watch-dev:
	@echo "👀 Starting Tailwind watcher from local theme repo..."
	cd ~/Projects/jfm_theme && npm run watch
