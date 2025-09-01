#!/bin/bash

# 🔥 ChaosKey333 Hotfix Ritual 🔥
# One-command patch, tag, and release management
# Usage: ./scripts/hotfix.sh [patch|minor|major] "Description of the fix"

set -e

# Configuration
BRANCH="main"
REPO_ROOT="$(cd "$(dirname "${BASH_SOURCE[0]}")/.." && pwd)"
cd "$REPO_ROOT"

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
PURPLE='\033[0;35m'
CYAN='\033[0;36m'
NC='\033[0m' # No Color

# Art
echo -e "${PURPLE}⛧⚡👑 ChaosKey333 Hotfix Ritual 👑⚡⛧${NC}"
echo -e "${CYAN}🔑 Forging Emergency Patches 🔑${NC}"
echo ""

# Function to print colored messages
log_info() { echo -e "${BLUE}ℹ️  $1${NC}"; }
log_success() { echo -e "${GREEN}✅ $1${NC}"; }
log_warning() { echo -e "${YELLOW}⚠️  $1${NC}"; }
log_error() { echo -e "${RED}❌ $1${NC}"; }

# Function to show usage
show_usage() {
    echo "Usage: $0 [patch|minor|major] \"Description of the fix\""
    echo ""
    echo "Examples:"
    echo "  $0 patch \"Fix critical authentication bug\""
    echo "  $0 minor \"Add emergency security feature\""
    echo "  $0 major \"Breaking change for security compliance\""
    echo ""
    echo "This script will:"
    echo "  1. Validate current state and branch"
    echo "  2. Create a hotfix branch"
    echo "  3. Run tests and linting"
    echo "  4. Commit changes with conventional commit format"
    echo "  5. Push to main and trigger Release Please"
    echo ""
}

# Validate arguments
if [ $# -ne 2 ]; then
    log_error "Invalid arguments"
    show_usage
    exit 1
fi

VERSION_TYPE="$1"
DESCRIPTION="$2"

# Validate version type
if [[ ! "$VERSION_TYPE" =~ ^(patch|minor|major)$ ]]; then
    log_error "Invalid version type: $VERSION_TYPE"
    show_usage
    exit 1
fi

# Validate we're on main branch
CURRENT_BRANCH=$(git branch --show-current)
if [ "$CURRENT_BRANCH" != "$BRANCH" ]; then
    log_error "Must be on $BRANCH branch (currently on $CURRENT_BRANCH)"
    echo "Run: git checkout $BRANCH"
    exit 1
fi

# Check for uncommitted changes
if ! git diff-index --quiet HEAD --; then
    log_error "Uncommitted changes detected. Please commit or stash them first."
    git status --short
    exit 1
fi

# Check if we're up to date
log_info "Checking if branch is up to date..."
git fetch origin
if [ "$(git rev-parse HEAD)" != "$(git rev-parse origin/$BRANCH)" ]; then
    log_error "Local branch is not up to date with origin/$BRANCH"
    echo "Run: git pull origin $BRANCH"
    exit 1
fi

# Generate conventional commit type and message
case "$VERSION_TYPE" in
    "patch")
        COMMIT_TYPE="fix"
        COMMIT_MSG="fix: $DESCRIPTION"
        ;;
    "minor")
        COMMIT_TYPE="feat"
        COMMIT_MSG="feat: $DESCRIPTION"
        ;;
    "major")
        COMMIT_TYPE="feat"
        COMMIT_MSG="feat!: $DESCRIPTION

BREAKING CHANGE: $DESCRIPTION"
        ;;
esac

log_info "Starting hotfix ritual for $VERSION_TYPE release..."
log_info "Commit message: $COMMIT_MSG"

# Create hotfix branch
TIMESTAMP=$(date +%Y%m%d-%H%M%S)
HOTFIX_BRANCH="hotfix/$VERSION_TYPE-$TIMESTAMP"

log_info "Creating hotfix branch: $HOTFIX_BRANCH"
git checkout -b "$HOTFIX_BRANCH"

# Run quality checks
log_info "Running quality checks..."

# Install dependencies if needed
if [ ! -d "node_modules" ]; then
    log_info "Installing dependencies..."
    npm ci
fi

# Run linting
log_info "Running lint checks..."
if npm run -s lint 2>/dev/null; then
    log_success "Lint passed"
else
    log_warning "No lint script found or lint failed"
fi

# Run formatting check
log_info "Running format checks..."
if npm run -s check:format 2>/dev/null; then
    log_success "Format check passed"
else
    log_warning "No format check script found or format check failed"
fi

# Run tests
log_info "Running tests..."
if npm test; then
    log_success "Tests passed"
else
    log_error "Tests failed"
    git checkout "$BRANCH"
    git branch -D "$HOTFIX_BRANCH"
    exit 1
fi

# Run build
log_info "Running build..."
if npm run -s build 2>/dev/null; then
    log_success "Build passed"
else
    log_warning "No build script found or build failed"
fi

# Show current status
log_info "Current changes ready for commit:"
git status --short

# Confirm with user
echo ""
read -p "🔮 Proceed with hotfix commit and release? (y/N): " -n 1 -r
echo ""
if [[ ! $REPLY =~ ^[Yy]$ ]]; then
    log_info "Hotfix cancelled"
    git checkout "$BRANCH"
    git branch -D "$HOTFIX_BRANCH"
    exit 0
fi

# Commit changes
log_info "Committing changes..."
git add .
git commit -m "$COMMIT_MSG" || {
    log_warning "No changes to commit"
}

# Merge back to main
log_info "Merging to $BRANCH..."
git checkout "$BRANCH"
git merge --no-ff "$HOTFIX_BRANCH" -m "Merge hotfix: $DESCRIPTION"

# Push to origin
log_info "Pushing to origin..."
git push origin "$BRANCH"

# Clean up hotfix branch
log_info "Cleaning up hotfix branch..."
git branch -d "$HOTFIX_BRANCH"

# Success message
echo ""
log_success "🎉 Hotfix ritual complete!"
log_info "⚡ Release Please will automatically:"
log_info "   1. Detect the conventional commit"
log_info "   2. Create/update a release PR"
log_info "   3. Include version bump and CHANGELOG"
log_info "   4. Tag and release when the PR is merged"
echo ""
log_info "🔮 Monitor the Release Please workflow:"
log_info "   https://github.com/$(git config --get remote.origin.url | sed 's/.*github.com[:/]\([^/]*\/[^/]*\).*/\1/' | sed 's/\.git$//')/actions"
echo ""
echo -e "${PURPLE}⚡ Render the Prophecy. Seal the Vault. ⚡${NC}"
echo -e "${CYAN}🐦‍⬛ ChaosKey333 🐦‍⬛${NC}"