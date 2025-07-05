#!/bin/bash

# Chrysalis - Remove Emojis Script
# Replace all emojis with professional text

echo "Chrysalis - Removing emojis and updating to professional branding"
echo "=================================================================="

# Remove emojis from all markdown files
find . -name "*.md" -type f -exec sed -i '' 's///g; s///g; s///g; s///g; s///g; s///g; s///g; s///g; s///g; s///g; s///g; s///g; s///g; s///g; s///g; s///g; s///g; s///g; s///g; s///g; s///g; s///g; s///g; s///g; s///g; s///g; s///g; s///g; s///g; s///g' {} \;

# Remove emojis from shell scripts
find . -name "*.sh" -type f -exec sed -i '' 's///g; s///g; s///g; s///g; s///g; s///g; s///g; s///g; s///g; s///g; s///g; s///g; s///g; s///g; s///g; s///g; s///g; s///g; s///g; s///g; s///g; s///g; s///g; s///g; s///g; s///g; s///g; s///g; s///g; s///g' {} \;

# Remove emojis from TypeScript/JavaScript files
find . -name "*.ts" -name "*.tsx" -name "*.js" -name "*.jsx" -type f -exec sed -i '' 's///g; s///g; s///g; s///g; s///g; s///g; s///g; s///g; s///g; s///g; s///g; s///g; s///g; s///g; s///g; s///g; s///g; s///g; s///g; s///g; s///g; s///g; s///g; s///g; s///g; s///g; s///g; s///g; s///g; s///g' {} \;

echo ""
echo "EMOJI REMOVAL COMPLETE!"
echo ""
echo "Professional branding applied:"
echo "- Stone, clay, green color palette"
echo "- Custom SVG icons replacing emojis"
echo "- Clean, minimal design language"
echo ""
echo "Next: Deploy updated version to Netlify"
