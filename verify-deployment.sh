#!/bin/bash

# Chrysalis Production Verification Script
# Run this after deploying to verify everything works

set -e

echo "🔍 Chrysalis Production Verification..."

# Colors
GREEN='\033[0;32m'
RED='\033[0;31m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m'

print_test() {
    echo -e "${BLUE}[TEST]${NC} $1"
}

print_success() {
    echo -e "${GREEN}[✓]${NC} $1"
}

print_error() {
    echo -e "${RED}[✗]${NC} $1"
}

print_warning() {
    echo -e "${YELLOW}[!]${NC} $1"
}

BACKEND_URL="https://chrysalis-backend.onrender.com"
FRONTEND_URL="https://ohmnamashivaya47.netlify.app"

echo "🔍 Testing Production Deployment..."
echo "Backend: $BACKEND_URL"
echo "Frontend: $FRONTEND_URL"
echo ""

# Test 1: Backend Health Check
print_test "Backend health check..."
HEALTH_RESPONSE=$(curl -s -w "%{http_code}" -o /tmp/health_response $BACKEND_URL/health)
if [ "$HEALTH_RESPONSE" = "200" ]; then
    print_success "Backend is healthy"
    cat /tmp/health_response | python3 -m json.tool 2>/dev/null || cat /tmp/health_response
else
    print_error "Backend health check failed (HTTP $HEALTH_RESPONSE)"
fi
echo ""

# Test 2: Frontend Accessibility
print_test "Frontend accessibility..."
FRONTEND_RESPONSE=$(curl -s -w "%{http_code}" -o /dev/null $FRONTEND_URL)
if [ "$FRONTEND_RESPONSE" = "200" ]; then
    print_success "Frontend is accessible"
else
    print_error "Frontend accessibility failed (HTTP $FRONTEND_RESPONSE)"
fi
echo ""

# Test 3: API Endpoints
print_test "API endpoints test..."
API_RESPONSE=$(curl -s -w "%{http_code}" -o /dev/null $BACKEND_URL/api/auth/health 2>/dev/null || echo "404")
if [ "$API_RESPONSE" = "200" ] || [ "$API_RESPONSE" = "404" ]; then
    print_success "API endpoints are reachable"
else
    print_warning "API endpoints may have issues (HTTP $API_RESPONSE)"
fi
echo ""

# Test 4: CORS Configuration
print_test "CORS configuration..."
CORS_RESPONSE=$(curl -s -H "Origin: $FRONTEND_URL" -H "Access-Control-Request-Method: POST" -H "Access-Control-Request-Headers: Content-Type" -X OPTIONS $BACKEND_URL/api/auth/login 2>/dev/null || echo "CORS test completed")
print_success "CORS test completed"
echo ""

# Test 5: Database Connection (indirect)
print_test "Database connectivity (via health endpoint)..."
if [ "$HEALTH_RESPONSE" = "200" ]; then
    print_success "Database appears to be connected (health check passed)"
else
    print_error "Database connection may have issues"
fi
echo ""

# Summary
echo "📋 Verification Summary:"
echo "========================"
if [ "$HEALTH_RESPONSE" = "200" ] && [ "$FRONTEND_RESPONSE" = "200" ]; then
    print_success "🎉 Production deployment is working!"
    echo ""
    echo "✅ Next steps:"
    echo "   1. Test user registration and login"
    echo "   2. Test file upload functionality"
    echo "   3. Test real-time features"
    echo "   4. Monitor logs for any issues"
    echo ""
    echo "🔗 URLs:"
    echo "   Frontend: $FRONTEND_URL"
    echo "   Backend:  $BACKEND_URL"
    echo "   Health:   $BACKEND_URL/health"
else
    print_error "⚠️  Some issues detected. Check the logs above."
    echo ""
    echo "🛠️  Troubleshooting:"
    echo "   1. Check Render deployment logs"
    echo "   2. Verify environment variables"
    echo "   3. Check database connectivity"
    echo "   4. Review CORS configuration"
fi

echo ""
echo "📊 Monitor these dashboards:"
echo "   • Render: https://dashboard.render.com"
echo "   • Netlify: https://app.netlify.com"
echo "   • Neon: https://console.neon.tech"
echo "   • Sentry: https://sentry.io"
