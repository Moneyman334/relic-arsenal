#!/bin/bash

# Release Verifier Script for ChaosKey333 Relic Arsenal
# Validates GitHub releases and their associated assets

set -euo pipefail

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# Default values
TAG=""
REPO="Moneyman334/relic-arsenal"
VERBOSE=false

# Usage information
usage() {
    cat << EOF
Usage: $0 [OPTIONS] [<tag>]

Verifies a GitHub release and its assets for the ChaosKey333 Relic Arsenal.
If no tag is provided, verifies the current HEAD without requiring release assets.

OPTIONS:
    -h, --help      Show this help message
    -v, --verbose   Enable verbose output
    -r, --repo      Repository (default: $REPO)

ARGUMENTS:
    <tag>           Release tag to verify (e.g., v1.7.0). Optional.
                    If not provided, runs in HEAD mode.

EXAMPLES:
    $0 v1.7.0                    # Verify release v1.7.0 (tag mode)
    $0 --verbose v1.7.0          # Verify release with verbose output
    $0                           # Verify current HEAD (HEAD mode)
    $0 --verbose                 # Verify HEAD with verbose output
    $0 --repo owner/repo v1.0.0  # Verify release in different repo

REQUIREMENTS:
    - gh CLI tool (GitHub CLI)
    - jq (JSON processor)
    - Git repository context
EOF
}

# Logging functions
log_info() {
    echo -e "${BLUE}[INFO]${NC} $1"
}

log_success() {
    echo -e "${GREEN}[SUCCESS]${NC} $1"
}

log_warning() {
    echo -e "${YELLOW}[WARNING]${NC} $1"
}

log_error() {
    echo -e "${RED}[ERROR]${NC} $1"
}

log_verbose() {
    if [[ "$VERBOSE" == "true" ]]; then
        echo -e "${BLUE}[VERBOSE]${NC} $1"
    fi
}

# Check if required tools are available
check_dependencies() {
    log_info "Checking dependencies..."
    
    if ! command -v gh &> /dev/null; then
        log_error "GitHub CLI (gh) is not installed or not in PATH"
        log_error "Install it from: https://cli.github.com/"
        exit 1
    fi
    
    if ! command -v jq &> /dev/null; then
        log_error "jq is not installed or not in PATH"
        log_error "Install it from: https://stedolan.github.io/jq/"
        exit 1
    fi
    
    if ! command -v git &> /dev/null; then
        log_error "git is not installed or not in PATH"
        exit 1
    fi
    
    log_success "All dependencies are available"
}

# Check GitHub CLI authentication
check_auth() {
    log_info "Checking GitHub authentication..."
    
    if ! gh auth status &> /dev/null; then
        log_error "GitHub CLI is not authenticated"
        log_error "Run 'gh auth login' to authenticate"
        exit 1
    fi
    
    log_success "GitHub CLI is authenticated"
}

# Validate GitHub release exists
validate_release() {
    local tag="$1"
    log_info "Validating release: $tag"
    
    if ! gh release view "$tag" --repo "$REPO" &> /dev/null; then
        log_error "Release $tag not found in repository $REPO"
        return 1
    fi
    
    log_success "Release $tag exists"
    
    # Get release info
    local release_info
    release_info=$(gh release view "$tag" --repo "$REPO" --json assets,body,createdAt,name,tagName)
    log_verbose "Release info: $release_info"
    
    return 0
}

# Check for required asset patterns
check_asset_patterns() {
    local tag="$1"
    log_info "Checking release assets for required patterns..."
    
    local assets
    assets=$(gh release view "$tag" --repo "$REPO" --json assets --jq '.assets[].name')
    
    log_verbose "Available assets:"
    while IFS= read -r asset; do
        log_verbose "  - $asset"
    done <<< "$assets"
    
    # Check for docs/scrolls/*.pdf pattern
    local pdf_found=false
    while IFS= read -r asset; do
        if [[ "$asset" =~ .*\.pdf$ ]]; then
            pdf_found=true
            log_success "Found PDF asset: $asset"
        fi
    done <<< "$assets"
    
    if [[ "$pdf_found" == "false" ]]; then
        log_warning "No PDF assets found matching docs/scrolls/*.pdf pattern"
    fi
    
    # Check for assets/social/sigil-of-thunder/*.png pattern
    local sigil_found=false
    while IFS= read -r asset; do
        if [[ "$asset" =~ .*sigil.*\.png$ ]] || [[ "$asset" =~ .*social.*\.png$ ]]; then
            sigil_found=true
            log_success "Found sigil/social PNG asset: $asset"
        fi
    done <<< "$assets"
    
    if [[ "$sigil_found" == "false" ]]; then
        log_warning "No PNG assets found matching assets/social/sigil-of-thunder/*.png pattern"
    fi
    
    # Check for optional thumbnail assets
    local thumb_found=false
    while IFS= read -r asset; do
        if [[ "$asset" =~ .*thumb.*\.png$ ]] || [[ "$asset" =~ .*thumbnail.*\.png$ ]]; then
            thumb_found=true
            log_success "Found thumbnail asset: $asset"
        fi
    done <<< "$assets"
    
    if [[ "$thumb_found" == "false" ]]; then
        log_info "No optional thumbnail assets found"
    fi
    
    return 0
}

# Verify required files in main branch
verify_required_files() {
    log_info "Verifying required files in main branch..."
    
    # Check README.md
    if gh api "repos/$REPO/contents/README.md" --jq '.name' &> /dev/null; then
        log_success "README.md exists in main branch"
    else
        log_error "README.md not found in main branch"
        return 1
    fi
    
    # Check docs/gallery/index.md (optional)
    if gh api "repos/$REPO/contents/docs/gallery/index.md" --jq '.name' &> /dev/null; then
        log_success "docs/gallery/index.md exists in main branch"
    else
        log_warning "docs/gallery/index.md not found in main branch (optional)"
    fi
    
    return 0
}

# Verify README contains required links
verify_readme_links() {
    log_info "Verifying README contains required links..."
    
    local readme_content
    readme_content=$(gh api "repos/$REPO/contents/README.md" --jq '.content' | base64 -d)
    
    # Check for docs/scrolls/ link
    if echo "$readme_content" | grep -q "docs/scrolls/"; then
        log_success "README contains link to docs/scrolls/"
    else
        log_error "README does not contain link to docs/scrolls/"
        return 1
    fi
    
    # Check for docs/gallery/index.md link (optional)
    if echo "$readme_content" | grep -q "docs/gallery/index.md"; then
        log_success "README contains link to docs/gallery/index.md"
    else
        log_info "README does not contain link to docs/gallery/index.md (optional)"
    fi
    
    return 0
}

# Check CI status for main branch
check_ci_status() {
    log_info "Checking CI status for main branch..."
    
    local workflow_runs
    workflow_runs=$(gh api "repos/$REPO/actions/runs?branch=main&per_page=1" --jq '.workflow_runs[0]')
    
    if [[ "$workflow_runs" == "null" ]]; then
        log_warning "No workflow runs found for main branch"
        return 0
    fi
    
    local status
    local conclusion
    status=$(echo "$workflow_runs" | jq -r '.status')
    conclusion=$(echo "$workflow_runs" | jq -r '.conclusion')
    
    log_verbose "Latest CI run status: $status, conclusion: $conclusion"
    
    if [[ "$status" == "completed" ]]; then
        if [[ "$conclusion" == "success" ]]; then
            log_success "Latest CI run for main branch: SUCCESS"
        else
            log_warning "Latest CI run for main branch: $conclusion"
        fi
    else
        log_info "Latest CI run for main branch is still: $status"
    fi
    
    return 0
}

# Check update_scrolls.yml workflow status (optional)
check_update_scrolls_workflow() {
    log_info "Checking update_scrolls.yml workflow status (optional)..."
    
    local workflow_runs
    workflow_runs=$(gh api "repos/$REPO/actions/workflows/update_scrolls.yml/runs?per_page=1" --jq '.workflow_runs[0]' 2>/dev/null || echo "null")
    
    if [[ "$workflow_runs" == "null" ]]; then
        log_info "No runs found for update_scrolls.yml workflow"
        return 0
    fi
    
    local status
    local conclusion
    status=$(echo "$workflow_runs" | jq -r '.status')
    conclusion=$(echo "$workflow_runs" | jq -r '.conclusion')
    
    log_verbose "Latest update_scrolls.yml run status: $status, conclusion: $conclusion"
    
    if [[ "$status" == "completed" ]]; then
        if [[ "$conclusion" == "success" ]]; then
            log_success "Latest update_scrolls.yml run: SUCCESS"
        else
            log_warning "Latest update_scrolls.yml run: $conclusion"
        fi
    else
        log_info "Latest update_scrolls.yml run is still: $status"
    fi
    
    return 0
}

# Main verification function
verify_release() {
    local tag="$1"
    local errors=0
    
    if [[ -n "$tag" ]]; then
        log_info "🔍 Starting release verification for: $tag"
        echo
        
        # Run tag-specific verification steps
        validate_release "$tag" || ((errors++))
        echo
        
        check_asset_patterns "$tag" || ((errors++))
        echo
    else
        log_info "🔍 Starting HEAD verification (no release tag provided)"
        echo
        
        log_info "Running in HEAD mode - skipping release and asset checks"
        echo
    fi
    
    # Run common verification steps for both modes
    verify_required_files || ((errors++))
    echo
    
    verify_readme_links || ((errors++))
    echo
    
    check_ci_status || ((errors++))
    echo
    
    check_update_scrolls_workflow || ((errors++))
    echo
    
    # Summary
    if [[ $errors -eq 0 ]]; then
        log_success "🎉 Verification completed successfully!"
        if [[ -n "$tag" ]]; then
            log_success "Release $tag is ready for publication"
        else
            log_success "Current HEAD meets all requirements"
        fi
    else
        log_error "❌ Verification failed with $errors error(s)"
        log_error "Please address the issues before proceeding"
        return 1
    fi
    
    return 0
}

# Parse command line arguments
while [[ $# -gt 0 ]]; do
    case $1 in
        -h|--help)
            usage
            exit 0
            ;;
        -v|--verbose)
            VERBOSE=true
            shift
            ;;
        -r|--repo)
            REPO="$2"
            shift 2
            ;;
        -*)
            log_error "Unknown option: $1"
            usage
            exit 1
            ;;
        *)
            if [[ -z "$TAG" ]]; then
                TAG="$1"
            else
                log_error "Multiple tags specified: $TAG and $1"
                usage
                exit 1
            fi
            shift
            ;;
    esac
done

# Validate arguments - TAG is now optional
# If no TAG is provided, we run in HEAD mode
MODE="HEAD"
if [[ -n "$TAG" ]]; then
    MODE="TAG"
fi

# Main execution
main() {
    log_info "🌟 ChaosKey333 Relic Arsenal - Release Verifier"
    log_info "Repository: $REPO"
    if [[ "$MODE" == "TAG" ]]; then
        log_info "Mode: TAG verification"
        log_info "Tag: $TAG"
    else
        log_info "Mode: HEAD verification"
        log_info "Target: Current HEAD"
    fi
    echo
    
    check_dependencies
    check_auth
    echo
    
    verify_release "$TAG"
}

main "$@"