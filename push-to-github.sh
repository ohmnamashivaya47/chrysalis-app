#!/bin/bash

# GitHub Repository Setup Commands
# Replace YOUR_USERNAME with your actual GitHub username

# Set the remote origin (replace YOUR_USERNAME)
git remote add origin https://github.com/YOUR_USERNAME/chrysalis-meditation-app.git

# Rename branch to main (if needed)
git branch -M main

# Push to GitHub
git push -u origin main

echo "✅ Repository pushed to GitHub!"
echo "🔗 Your repo: https://github.com/YOUR_USERNAME/chrysalis-meditation-app"
