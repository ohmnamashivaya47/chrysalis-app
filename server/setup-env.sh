#!/bin/bash

# Chrysalis Backend Environment Setup Script
echo "🔧 Setting up Chrysalis Backend Environment..."

# Copy environment file
if [ -f "../.env" ]; then
    cp ../.env .env
    echo "✅ Environment file copied"
else
    echo "⚠️  No .env file found in parent directory"
fi

# Ensure Prisma schema is accessible
mkdir -p prisma
if [ -f "../prisma/schema.prisma" ]; then
    cp ../prisma/schema.prisma prisma/
    echo "✅ Prisma schema copied"
else
    echo "⚠️  No Prisma schema found"
fi

# Generate Prisma client
echo "🔄 Generating Prisma client..."
npx prisma generate

# Test database connection
echo "🔌 Testing database connection..."
npx prisma db push --accept-data-loss

echo "✅ Environment setup complete!"
