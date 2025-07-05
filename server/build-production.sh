#!/bin/bash

# Chrysalis Backend Deployment Script
# This script builds and prepares the backend for production deployment

set -e

echo "🚀 Starting Chrysalis Backend Production Build..."

# Check if we're in the server directory
if [ ! -f "package.json" ]; then
    echo "❌ Error: Please run this script from the server directory"
    exit 1
fi

# Install dependencies
echo "📦 Installing dependencies..."
npm ci --only=production

# Install dev dependencies for build
echo "🔧 Installing dev dependencies for build..."
npm install --only=dev

# Generate Prisma client
echo "🗄️ Generating Prisma client..."
npx prisma generate

# Build TypeScript
echo "🏗️ Building TypeScript..."
npm run build

# Check if build was successful
if [ ! -d "dist" ]; then
    echo "❌ Build failed: dist directory not found"
    exit 1
fi

echo "✅ Build completed successfully!"

# Create production package.json (without dev dependencies)
echo "📄 Creating production package.json..."
node -e "
const pkg = require('./package.json');
delete pkg.devDependencies;
delete pkg.scripts.dev;
delete pkg.scripts.build;
delete pkg.scripts.lint;
delete pkg.scripts['type-check'];
pkg.scripts.start = 'node server.js';
fs.writeFileSync('./dist/package.json', JSON.stringify(pkg, null, 2));
" 2>/dev/null || echo "Warning: Could not create production package.json"

# Copy necessary files to dist
echo "📁 Copying necessary files..."
cp -f .env.example dist/ 2>/dev/null || echo "Warning: .env.example not found"
cp -f README.md dist/ 2>/dev/null || echo "Warning: README.md not found"

# Copy Prisma schema
mkdir -p dist/prisma
cp -f ../prisma/schema.prisma dist/prisma/ 2>/dev/null || echo "Warning: Prisma schema not found"

echo "📊 Production build summary:"
echo "   📁 Output: ./dist/"
echo "   🎯 Entry: dist/server.js"
echo "   📦 Size: $(du -sh dist | cut -f1)"

echo ""
echo "🎉 Backend production build complete!"
echo ""
echo "Next steps for deployment:"
echo "1. Deploy the 'dist' folder to your hosting service"
echo "2. Set environment variables (DATABASE_URL, JWT_SECRET, etc.)"
echo "3. Run 'npm install --only=production' on the server"
echo "4. Run 'npx prisma db push' to setup the database"
echo "5. Start with 'npm start' or 'node server.js'"
echo ""
echo "Example deployment commands:"
echo "  Railway: railway up"
echo "  Heroku:  git subtree push --prefix dist heroku main"
echo "  Docker:  docker build -t chrysalis-api ."
