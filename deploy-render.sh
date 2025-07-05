#!/bin/bash

# 🚀 Render CLI Deployment Script for Chrysalis Backend

echo "=========================================="
echo "🚀 CHRYSALIS BACKEND - RENDER DEPLOYMENT"
echo "=========================================="

echo ""
echo "✅ GitHub Repository: https://github.com/ohmnamashivaya47/chrysalis-app"
echo "✅ All API keys secured and removed from public code"
echo ""

echo "📋 DEPLOYMENT INSTRUCTIONS:"
echo ""
echo "1. 🌐 Go to: https://render.com"
echo "2. 📝 Sign up/Login with your GitHub account"
echo "3. ➕ Click 'New +' → 'Web Service'"
echo "4. 🔗 Connect GitHub → Select 'chrysalis-app'"
echo ""

echo "⚙️  CONFIGURATION:"
echo "   • Name: chrysalis-backend"
echo "   • Root Directory: server"
echo "   • Environment: Node"
echo "   • Build Command: npm run build:prod"
echo "   • Start Command: npm start"
echo "   • Plan: Free"
echo ""

echo "🔑 ENVIRONMENT VARIABLES TO ADD:"
echo "   (Copy from your local .env files)"
echo ""
echo "   NODE_ENV=production"
echo "   PORT=5000"
echo "   DATABASE_URL=[your database URL]"
echo "   JWT_SECRET=[your JWT secret]"
echo "   MAILGUN_API_KEY=[your Mailgun key]"
echo "   MAILGUN_DOMAIN=[your Mailgun domain]"
echo "   CLOUDINARY_URL=[your Cloudinary URL]"
echo "   CLOUDINARY_CLOUD_NAME=[your cloud name]"
echo "   CLOUDINARY_API_KEY=[your API key]"
echo "   CLOUDINARY_API_SECRET=[your API secret]"
echo "   FIREBASE_PROJECT_ID=[your Firebase project ID]"
echo "   FIREBASE_API_KEY=[your Firebase API key]"
echo "   FIREBASE_MESSAGING_SENDER_ID=[your sender ID]"
echo "   FIREBASE_APP_ID=[your app ID]"
echo "   GA_MEASUREMENT_ID=[your GA measurement ID]"
echo "   GA_STREAM_ID=[your GA stream ID]"
echo ""

echo "🕐 DEPLOYMENT TIME: ~5 minutes"
echo ""
echo "📡 AFTER DEPLOYMENT:"
echo "   You'll get a URL like: https://chrysalis-backend.onrender.com"
echo "   Share this URL and I'll connect the frontend!"
echo ""

echo "🚀 READY TO DEPLOY!"
echo "   Open https://render.com in your browser and follow the steps above."
echo ""

# Check if we have the local environment to show actual values
if [ -f "server/.env" ]; then
    echo "🔍 Found local .env file. Here are your actual values to use:"
    echo ""
    
    # Extract key values (without showing full keys)
    if grep -q "DATABASE_URL" server/.env; then
        echo "   ✅ DATABASE_URL found in server/.env"
    fi
    
    if grep -q "JWT_SECRET" server/.env; then
        echo "   ✅ JWT_SECRET found in server/.env"
    fi
    
    if grep -q "MAILGUN_API_KEY" server/.env; then
        echo "   ✅ MAILGUN_API_KEY found in server/.env"
    fi
    
    if grep -q "CLOUDINARY" server/.env; then
        echo "   ✅ Cloudinary config found in server/.env"
    fi
    
    if grep -q "FIREBASE" server/.env; then
        echo "   ✅ Firebase config found in server/.env"
    fi
    
    echo ""
    echo "   Copy the actual values from server/.env to Render dashboard"
else
    echo "⚠️  No server/.env file found. Make sure you have your API keys ready."
fi

echo ""
echo "=========================================="
echo "🎯 Next: Deploy on https://render.com"
echo "=========================================="
