#!/bin/bash

# Semantic Compare - Manual Deployment Script
# This script builds the application and prepares it for GitHub Pages deployment

set -e

echo "🚀 Building Semantic Compare for deployment..."

# Build the application
npm run build

echo "✅ Build completed successfully!"
echo ""
echo "📁 Built files are in the 'dist' directory"
echo ""
echo "🌐 To deploy to GitHub Pages:"
echo "1. Push your changes to the main branch"
echo "2. The GitHub Action will automatically deploy to GitHub Pages"
echo ""
echo "📋 Or deploy manually:"
echo "1. Copy the contents of the 'dist' folder"
echo "2. Push to your 'gh-pages' branch"
echo "3. Enable GitHub Pages in your repository settings"
echo ""
echo "🔗 Your app will be available at:"
echo "   https://yourusername.github.io/comparator/semantic-compare-app/"
echo ""
echo "✨ Deployment preparation complete!"
