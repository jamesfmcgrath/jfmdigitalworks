#!/bin/bash

# Absolute path to your theme repo outside the Drupal project
THEME_SOURCE="$HOME/Projects/jfm_theme"
THEME_TARGET="web/themes/contrib/jfm_theme"

# Make sure contrib exists
mkdir -p web/themes/contrib

# Remove any existing theme folder
if [ -L "$THEME_TARGET" ] || [ -d "$THEME_TARGET" ]; then
  echo "🔁 Removing existing theme at $THEME_TARGET"
  rm -rf "$THEME_TARGET"
fi

# Create the symlink
echo "🔗 Linking $THEME_TARGET to $THEME_SOURCE"
ln -s "$THEME_SOURCE" "$THEME_TARGET"

echo "✅ Dev link created. You can now develop in $THEME_SOURCE and see changes live."
