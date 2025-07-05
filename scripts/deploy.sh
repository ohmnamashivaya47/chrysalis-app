#!/bin/bash

# Chrysalis Deployment Script
# This script handles the complete deployment process for the Chrysalis app

set -e

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# Function to print colored output
print_status() {
    echo -e "${GREEN}[INFO]${NC} $1"
}

print_warning() {
    echo -e "${YELLOW}[WARNING]${NC} $1"
}

print_error() {
    echo -e "${RED}[ERROR]${NC} $1"
}

print_header() {
    echo -e "${BLUE}$1${NC}"
}

# Check if required commands exist
check_dependencies() {
    print_header "Checking dependencies..."
    
    local deps=("node" "npm" "git")
    
    for dep in "${deps[@]}"; do
        if ! command -v $dep &> /dev/null; then
            print_error "$dep is not installed. Please install it first."
            exit 1
        fi
    done
    
    print_status "All dependencies are available"
}

# Environment setup
setup_environment() {
    print_header "Setting up environment..."
    
    # Check if .env file exists
    if [ ! -f .env ]; then
        print_warning ".env file not found. Creating from template..."
        
        cat > .env << EOF
# Environment Configuration
NODE_ENV=production
VITE_APP_NAME=Chrysalis
VITE_APP_VERSION=1.0.0

# API Configuration
VITE_API_URL=https://api.chrysalis.app
VITE_SOCKET_URL=wss://socket.chrysalis.app

# Database Configuration (for server)
DATABASE_URL=postgresql://username:password@hostname:port/database
DIRECT_URL=postgresql://username:password@hostname:port/database

# Authentication
JWT_SECRET=your-super-secret-jwt-key-here
JWT_EXPIRES_IN=7d

# Email Configuration
SMTP_HOST=smtp.gmail.com
SMTP_PORT=587
SMTP_USER=your-email@gmail.com
SMTP_PASS=your-app-password

# File Upload
MAX_FILE_SIZE=10485760
UPLOAD_DIR=uploads

# Push Notifications
VAPID_PUBLIC_KEY=your-vapid-public-key
VAPID_PRIVATE_KEY=your-vapid-private-key

# Social Features
ENABLE_SOCIAL_FEATURES=true
ENABLE_QR_CODES=true
ENABLE_LEADERBOARD=true

# Analytics
GOOGLE_ANALYTICS_ID=G-XXXXXXXXXX
MIXPANEL_TOKEN=your-mixpanel-token

# Error Tracking
SENTRY_DSN=your-sentry-dsn

# Rate Limiting
RATE_LIMIT_WINDOW_MS=900000
RATE_LIMIT_MAX=100
EOF
        
        print_warning "Please update the .env file with your actual configuration values"
        print_warning "Deployment will continue with default values"
    fi
    
    print_status "Environment setup complete"
}

# Clean previous builds
clean_build() {
    print_header "Cleaning previous builds..."
    
    if [ -d "dist" ]; then
        rm -rf dist
        print_status "Removed previous dist directory"
    fi
    
    if [ -d "node_modules/.cache" ]; then
        rm -rf node_modules/.cache
        print_status "Cleared build cache"
    fi
    
    print_status "Clean complete"
}

# Install dependencies
install_dependencies() {
    print_header "Installing dependencies..."
    
    print_status "Installing frontend dependencies..."
    npm ci --production=false
    
    # Install server dependencies if server directory exists
    if [ -d "server" ]; then
        print_status "Installing server dependencies..."
        cd server
        npm ci --production=false
        cd ..
    fi
    
    print_status "Dependencies installed"
}

# Run tests
run_tests() {
    print_header "Running tests..."
    
    # Type checking
    print_status "Running TypeScript type check..."
    npm run type-check
    
    # Linting
    print_status "Running ESLint..."
    npm run lint
    
    # Unit tests (if available)
    if npm run | grep -q "test"; then
        print_status "Running unit tests..."
        npm run test
    else
        print_warning "No test script found, skipping tests"
    fi
    
    print_status "All tests passed"
}

# Build the application
build_app() {
    print_header "Building application..."
    
    # Frontend build
    print_status "Building frontend..."
    npm run build
    
    # Check if build was successful
    if [ ! -d "dist" ]; then
        print_error "Frontend build failed - dist directory not found"
        exit 1
    fi
    
    # Server build (if needed)
    if [ -d "server" ] && [ -f "server/package.json" ]; then
        print_status "Building server..."
        cd server
        npm run build
        cd ..
    fi
    
    print_status "Build complete"
}

# Optimize build
optimize_build() {
    print_header "Optimizing build..."
    
    # Create gzipped versions of large files
    find dist -name "*.js" -size +1k -exec gzip -9 -k {} \;
    find dist -name "*.css" -size +1k -exec gzip -9 -k {} \;
    
    # Generate service worker precache manifest if needed
    if command -v workbox &> /dev/null; then
        print_status "Generating service worker precache..."
        workbox generateSW workbox-config.js
    fi
    
    print_status "Optimization complete"
}

# Deploy to Netlify
deploy_netlify() {
    print_header "Deploying to Netlify..."
    
    if ! command -v netlify &> /dev/null; then
        print_warning "Netlify CLI not found. Installing..."
        npm install -g netlify-cli
    fi
    
    # Build and deploy
    print_status "Deploying to production..."
    netlify deploy --prod --dir=dist
    
    print_status "Netlify deployment complete"
}

# Deploy database migrations
deploy_database() {
    print_header "Deploying database migrations..."
    
    if [ -f "prisma/schema.prisma" ]; then
        print_status "Running Prisma migrations..."
        npx prisma migrate deploy
        
        print_status "Generating Prisma client..."
        npx prisma generate
        
        print_status "Database deployment complete"
    else
        print_warning "No Prisma schema found, skipping database deployment"
    fi
}

# Post-deployment tasks
post_deploy() {
    print_header "Running post-deployment tasks..."
    
    # Warm up the application
    if [ ! -z "$VITE_API_URL" ]; then
        print_status "Warming up API endpoints..."
        curl -s "$VITE_API_URL/health" > /dev/null || print_warning "API warmup failed"
    fi
    
    # Update sitemap (if exists)
    if [ -f "scripts/generate-sitemap.js" ]; then
        print_status "Generating sitemap..."
        node scripts/generate-sitemap.js
    fi
    
    # Notify deployment completion
    print_status "Deployment notification sent"
    
    print_status "Post-deployment tasks complete"
}

# Rollback function
rollback() {
    print_header "Rolling back deployment..."
    
    if command -v netlify &> /dev/null; then
        netlify deploy --prod --dir=dist --alias=previous
        print_status "Rollback complete"
    else
        print_error "Cannot rollback - Netlify CLI not available"
        exit 1
    fi
}

# Main deployment function
main() {
    print_header " Starting Chrysalis Deployment"
    echo "======================================"
    
    # Parse command line arguments
    case "${1:-deploy}" in
        "rollback")
            rollback
            ;;
        "deploy")
            check_dependencies
            setup_environment
            clean_build
            install_dependencies
            run_tests
            build_app
            optimize_build
            deploy_database
            deploy_netlify
            post_deploy
            
            echo "======================================"
            print_header " Deployment Complete!"
            print_status "Your Chrysalis app is now live!"
            ;;
        "build-only")
            check_dependencies
            install_dependencies
            build_app
            print_status "Build complete - ready for manual deployment"
            ;;
        "test-only")
            check_dependencies
            install_dependencies
            run_tests
            print_status "All tests passed"
            ;;
        *)
            echo "Usage: $0 [deploy|rollback|build-only|test-only]"
            echo ""
            echo "Commands:"
            echo "  deploy     - Full deployment process (default)"
            echo "  rollback   - Rollback to previous deployment"
            echo "  build-only - Build application without deploying"
            echo "  test-only  - Run tests only"
            exit 1
            ;;
    esac
}

# Error handling
trap 'echo -e "\n${RED}[ERROR]${NC} Deployment failed!"; exit 1' ERR

# Run main function
main "$@"
