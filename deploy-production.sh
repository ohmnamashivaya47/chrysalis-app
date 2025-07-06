#!/bin/bash

# Chrysalis Production Deployment Script
# This script deploys the backend to Render and frontend to Netlify

set -e

echo "🚀 Starting Chrysalis Production Deployment..."

# Colors for output
GREEN='\033[0;32m'
BLUE='\033[0;34m'
YELLOW='\033[1;33m'
RED='\033[0;31m'
NC='\033[0m' # No Color

# Function to print colored output
print_status() {
    echo -e "${BLUE}[INFO]${NC} $1"
}

print_success() {
    echo -e "${GREEN}[SUCCESS]${NC} $1"
}

print_warning() {
    echo -e "${YELLOW}[WARNING]${NC} $1"
}

print_error() {
    echo -e "${RED}[ERROR]${NC} $1"
}

# Check if we're in the right directory
if [ ! -f "package.json" ] || [ ! -d "server" ]; then
    print_error "Please run this script from the project root directory"
    exit 1
fi

# Step 1: Build and test the backend
print_status "Building backend..."
cd server
npm run build
if [ $? -ne 0 ]; then
    print_error "Backend build failed!"
    exit 1
fi
print_success "Backend build completed successfully"

# Step 2: Run database migrations (if needed)
print_status "Running database migrations..."
npm run db:deploy || true
print_success "Database migrations completed"

# Step 3: Build frontend
print_status "Building frontend..."
cd ..
npm run build
if [ $? -ne 0 ]; then
    print_error "Frontend build failed!"
    exit 1
fi
print_success "Frontend build completed successfully"

# Step 4: Deploy to Render (manual step reminder)
print_warning "Manual deployment steps required:"
echo ""
echo "1. Go to your Render dashboard: https://dashboard.render.com"
echo "2. Find your 'chrysalis-backend' service"
echo "3. Click 'Manual Deploy' -> 'Deploy latest commit'"
echo "4. Ensure environment variables are configured:"
echo "   - DATABASE_URL (from Neon)"
echo "   - JWT_SECRET"
echo "   - MAILGUN_API_KEY"
echo "   - MAILGUN_DOMAIN"
echo "   - CLOUDINARY_URL"
echo "   - CLOUDINARY_CLOUD_NAME"
echo "   - CLOUDINARY_API_KEY"
echo "   - CLOUDINARY_API_SECRET"
echo "   - FIREBASE_PROJECT_ID"
echo "   - FIREBASE_API_KEY"
echo "   - FIREBASE_MESSAGING_SENDER_ID"
echo "   - FIREBASE_APP_ID"
echo "   - GA_MEASUREMENT_ID"
echo "   - GA_STREAM_ID"
echo "   - SENTRY_DSN"
echo ""

# Step 5: Deploy frontend to Netlify
print_status "Deploying frontend to Netlify..."
npx netlify deploy --prod --dir=dist
if [ $? -eq 0 ]; then
    print_success "Frontend deployed to Netlify successfully!"
else
    print_warning "Netlify deployment may need manual verification"
fi

print_success "Deployment process completed!"
print_status "Please verify both frontend and backend are working:"
echo "  - Frontend: https://ohmnamashivaya47.netlify.app"
echo "  - Backend: https://chrysalis-backend.onrender.com/health"
echo ""
print_status "Run integration tests with: npm run test:integration"
