#!/bin/bash

# Example usage script for the release verifier
# This demonstrates how to use the release verification script

echo "🌟 ChaosKey333 Relic Arsenal - Release Verifier Examples"
echo

echo "📋 Available examples:"
echo "1. Show help"
echo "2. Test dependencies check (without GitHub auth)"
echo "3. Show script validation (simulated)"
echo

read -p "Enter your choice (1-3): " choice

case $choice in
    1)
        echo "📖 Showing help..."
        ./scripts/release_verifier.sh --help
        ;;
    2)
        echo "🔍 Testing dependencies..."
        echo "Checking for required tools:"
        echo -n "jq: "
        if command -v jq &> /dev/null; then
            echo "✅ Found ($(jq --version))"
        else
            echo "❌ Not found"
        fi
        
        echo -n "git: "
        if command -v git &> /dev/null; then
            echo "✅ Found ($(git --version | head -1))"
        else
            echo "❌ Not found"
        fi
        
        echo -n "gh: "
        if command -v gh &> /dev/null; then
            echo "✅ Found ($(gh --version | head -1))"
        else
            echo "❌ Not found"
        fi
        ;;
    3)
        echo "🎭 Simulated verification example..."
        echo "This is what a successful verification would look like:"
        echo
        echo -e "\033[0;34m[INFO]\033[0m 🔍 Starting release verification for: v1.7.0"
        echo
        echo -e "\033[0;34m[INFO]\033[0m Checking dependencies..."
        echo -e "\033[0;32m[SUCCESS]\033[0m All dependencies are available"
        echo -e "\033[0;34m[INFO]\033[0m Checking GitHub authentication..."
        echo -e "\033[0;32m[SUCCESS]\033[0m GitHub CLI is authenticated"
        echo
        echo -e "\033[0;34m[INFO]\033[0m Validating release: v1.7.0"
        echo -e "\033[0;32m[SUCCESS]\033[0m Release v1.7.0 exists"
        echo
        echo -e "\033[0;34m[INFO]\033[0m Checking release assets for required patterns..."
        echo -e "\033[0;32m[SUCCESS]\033[0m Found PDF asset: ChaosKey333_LaunchTimingPlaybook.pdf"
        echo -e "\033[0;32m[SUCCESS]\033[0m Found sigil/social PNG asset: quantum-dawn-sigil.png"
        echo
        echo -e "\033[0;34m[INFO]\033[0m Verifying required files in main branch..."
        echo -e "\033[0;32m[SUCCESS]\033[0m README.md exists in main branch"
        echo -e "\033[0;32m[SUCCESS]\033[0m docs/gallery/index.md exists in main branch"
        echo
        echo -e "\033[0;34m[INFO]\033[0m Verifying README contains required links..."
        echo -e "\033[0;32m[SUCCESS]\033[0m README contains link to docs/scrolls/"
        echo -e "\033[0;32m[SUCCESS]\033[0m README contains link to docs/gallery/index.md"
        echo
        echo -e "\033[0;34m[INFO]\033[0m Checking CI status for main branch..."
        echo -e "\033[0;32m[SUCCESS]\033[0m Latest CI run for main branch: SUCCESS"
        echo
        echo -e "\033[0;34m[INFO]\033[0m Checking update_scrolls.yml workflow status (optional)..."
        echo -e "\033[0;32m[SUCCESS]\033[0m Latest update_scrolls.yml run: SUCCESS"
        echo
        echo -e "\033[0;32m[SUCCESS]\033[0m 🎉 Release verification completed successfully!"
        echo -e "\033[0;32m[SUCCESS]\033[0m Release v1.7.0 is ready for publication"
        ;;
    *)
        echo "❌ Invalid choice. Please run the script again."
        exit 1
        ;;
esac

echo
echo "⚡ Render the Prophecy. Seal the Vault."
echo "🐦‍⬛ ChaosKey333"