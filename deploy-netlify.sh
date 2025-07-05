#!/bin/bash

# Chrysalis Netlify Deployment Script
# Quick deployment for testing with real users

echo "Chrysalis - Netlify Deployment Setup"
echo "======================================="

# 1. Build the app for production
echo "Building production app..."
npm run build

# 2. Install Netlify CLI if not present
if ! command -v netlify &> /dev/null; then
    echo "Installing Netlify CLI..."
    npm install -g netlify-cli
fi

# 3. Deploy to Netlify
echo "Deploying to Netlify..."
echo "   → This will generate your ohmnamashivaya47.netlify.app URL"
netlify deploy --dir=dist --prod

echo ""
echo "DEPLOYMENT COMPLETE!"
echo ""
echo "Your app will be live at: https://ohmnamashivaya47.netlify.app"
echo "Share this URL with your 3 beta testers immediately!"
echo ""
echo "TESTING PRIORITIES:"
echo "1. QR code generation and scanning between devices"
echo "2. Real-time leaderboard updates"
echo "3. Social connections and friend adding"
echo "4. Live meditation session tracking"
echo ""
echo "IMPORTANT: Make sure to update your .env with the live URL!"
