#!/bin/bash

#  CHRYSALIS REAL-TIME DEPLOYMENT
# Deploy socket server to Railway for live testing

echo " Deploying Chrysalis Real-Time Features"
echo "========================================="

# 1. Install Railway CLI
if ! command -v railway &> /dev/null; then
    echo " Installing Railway CLI..."
    npm install -g @railway/cli
fi

# 2. Deploy socket server
echo " Deploying socket server to Railway..."
cd server
railway login
railway link
railway up

cd ..

echo ""
echo " SOCKET SERVER DEPLOYED!"
echo ""
echo " Your real-time features are now live"
echo " Update your .env with the Railway socket URL"
echo ""
echo " REAL-TIME TESTING PRIORITIES:"
echo "1. Open app on 2+ devices"
echo "2. Complete meditation on one device"
echo "3. Watch leaderboard update INSTANTLY on other devices"
echo "4. Scan QR codes between devices"
echo "5. Test social feed updates in real-time"
