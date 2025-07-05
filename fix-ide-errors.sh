#!/bin/bash

#  Chrysalis - Fix IDE Errors Script
# This script fixes stale IDE errors by clearing caches and restarting services

echo " Chrysalis - Fixing IDE Errors..."
echo "=================================="

# 1. Clear TypeScript build caches
echo " Clearing TypeScript caches..."
rm -rf node_modules/.cache
rm -rf .tsbuildinfo
find . -name "*.tsbuildinfo" -delete 2>/dev/null || true

# 2. Clear ESLint cache
echo " Clearing ESLint cache..."
rm -rf node_modules/.eslintcache 2>/dev/null || true

# 3. Verify project structure
echo " Verifying project structure..."
if [ ! -f "src/utils/cn.ts" ]; then
    echo " Missing cn.ts utility"
    exit 1
else
    echo " cn.ts utility exists"
fi

# 4. Run type checking
echo " Running TypeScript type check..."
npm run type-check
if [ $? -eq 0 ]; then
    echo " TypeScript: No errors"
else
    echo " TypeScript: Errors found"
    exit 1
fi

# 5. Run linting
echo " Running ESLint..."
npm run lint
if [ $? -eq 0 ]; then
    echo " ESLint: No errors"
else
    echo " ESLint: Errors found"
    exit 1
fi

# 6. Test build
echo "🏗️ Testing build..."
npm run build > /dev/null 2>&1
if [ $? -eq 0 ]; then
    echo " Build: Successful"
else
    echo " Build: Failed"
    exit 1
fi

echo ""
echo " All checks passed! Your codebase is clean."
echo ""
echo " To fix VS Code IDE errors:"
echo "1. Press Cmd+Shift+P"
echo "2. Type: 'TypeScript: Restart TS Server'"
echo "3. Press Enter"
echo ""
echo "Or simply reload VS Code window:"
echo "1. Press Cmd+Shift+P" 
echo "2. Type: 'Developer: Reload Window'"
echo "3. Press Enter"
echo ""
echo " Your Chrysalis meditation app is ready! "
