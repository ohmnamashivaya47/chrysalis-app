#!/bin/bash

#  VS Code Workspace Reset Script
# This script completely resets VS Code's workspace state to fix phantom errors

echo " Chrysalis - VS Code Workspace Reset"
echo "======================================"

# 1. Stop any running TypeScript processes
echo " Stopping TypeScript processes..."
pkill -f "tsserver" 2>/dev/null || true

# 2. Clear all TypeScript caches
echo " Clearing TypeScript caches..."
rm -rf node_modules/.tmp/
rm -rf node_modules/.cache/
rm -rf .tsbuildinfo
find . -name "*.tsbuildinfo" -delete 2>/dev/null || true

# 3. Clear ESLint cache
echo " Clearing ESLint cache..."
rm -rf node_modules/.eslintcache 2>/dev/null || true
rm -rf .eslintcache 2>/dev/null || true

# 4. Clear VS Code workspace cache (if exists)
echo " Clearing VS Code workspace cache..."
if [ -d ".vscode/.cache" ]; then
    rm -rf .vscode/.cache
fi

# 5. Create a temporary file to force VS Code to refresh
echo " Forcing VS Code refresh..."
touch .vscode-refresh-trigger
sleep 1
rm -f .vscode-refresh-trigger

# 6. Verify no phantom files exist
echo " Checking for phantom files..."
if [ -f "src/services/socialFeedFixed.ts" ]; then
    echo " Found phantom file: socialFeedFixed.ts - removing..."
    rm "src/services/socialFeedFixed.ts"
else
    echo " No phantom files found"
fi

# 7. Run validation tests
echo " Running validation tests..."

echo "  → TypeScript check..."
npm run type-check > /dev/null 2>&1
if [ $? -eq 0 ]; then
    echo "     TypeScript: Clean"
else
    echo "     TypeScript: Has errors"
fi

echo "  → ESLint check..."
npm run lint > /dev/null 2>&1
if [ $? -eq 0 ]; then
    echo "     ESLint: Clean"
else
    echo "     ESLint: Has errors"
fi

echo "  → Build test..."
npm run build > /dev/null 2>&1
if [ $? -eq 0 ]; then
    echo "     Build: Successful"
else
    echo "     Build: Failed"
fi

echo ""
echo " Workspace reset complete!"
echo ""
echo " IMPORTANT: Complete the reset in VS Code:"
echo "1. Close ALL VS Code windows"
echo "2. Reopen VS Code"
echo "3. Open this project folder"
echo "4. Wait for TypeScript to initialize"
echo ""
echo "If errors persist:"
echo "1. Cmd+Shift+P → 'TypeScript: Restart TS Server'"
echo "2. Cmd+Shift+P → 'ESLint: Restart ESLint Server'"
echo "3. Cmd+Shift+P → 'Developer: Reload Window'"
echo ""
echo " Your workspace should now be error-free! "
