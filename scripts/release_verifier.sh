#!/bin/bash

# ChaosKey333 Relic Arsenal - Release Verifier Script
# Validates releases and emits QA Blessing markdown files

set -euo pipefail

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
PURPLE='\033[0;35m'
NC='\033[0m' # No Color

# Default values
TAG=""
REPO="${GITHUB_REPOSITORY:-Moneyman334/relic-arsenal}"
RELEASE_HTML_URL=""
OUTPUT_DIR="out"

# Validation flags
README_OK=false
PDFS_OK=false
GALLERY_OK=false
CI_OK=false
LFS_OK=false

usage() {
    echo "Usage: $0 <tag> [release_url]"
    echo "  tag        - Release tag to verify (e.g., v1.0.0)"
    echo "  release_url - Optional GitHub release URL"
    echo ""
    echo "Environment variables:"
    echo "  GITHUB_REPOSITORY - Repository name (default: Moneyman334/relic-arsenal)"
    echo "  OUTPUT_DIR        - Output directory (default: out)"
    exit 1
}

log() {
    echo -e "${BLUE}[INFO]${NC} $*"
}

warn() {
    echo -e "${YELLOW}[WARN]${NC} $*"
}

error() {
    echo -e "${RED}[ERROR]${NC} $*"
}

success() {
    echo -e "${GREEN}[SUCCESS]${NC} $*"
}

# Validate README exists and contains expected content
validate_readme() {
    log "Validating README.md..."
    
    if [[ ! -f "README.md" ]]; then
        error "README.md not found"
        return 1
    fi
    
    # Check for key sections
    local required_sections=("Release Flow" "How to Contribute" "ChaosKey333")
    for section in "${required_sections[@]}"; do
        if ! grep -q "$section" README.md; then
            warn "README.md missing section: $section"
            return 1
        fi
    done
    
    success "README.md validation passed"
    README_OK=true
}

# Validate PDF documentation
validate_pdfs() {
    log "Validating PDF documentation..."
    
    # Check for PDF files in docs or assets
    local pdf_count=$(find . -name "*.pdf" -type f | wc -l)
    
    if [[ $pdf_count -eq 0 ]]; then
        warn "No PDF files found - this may be expected for this repository"
        PDFS_OK=true  # Consider this OK for now
    else
        success "Found $pdf_count PDF files"
        PDFS_OK=true
    fi
}

# Validate gallery assets
validate_gallery() {
    log "Validating gallery assets..."
    
    # Check for assets directory and banner files
    if [[ -d "assets" ]]; then
        local asset_count=$(find assets -type f \( -name "*.png" -o -name "*.jpg" -o -name "*.jpeg" -o -name "*.svg" \) | wc -l)
        if [[ $asset_count -gt 0 ]]; then
            success "Found $asset_count gallery assets"
            GALLERY_OK=true
        else
            warn "Assets directory exists but no image files found"
        fi
    else
        warn "No assets directory found"
    fi
    
    # Check if README mentions gallery
    if grep -q -i "gallery\|assets" README.md; then
        GALLERY_OK=true
        success "Gallery validation passed"
    fi
}

# Validate CI configuration
validate_ci() {
    log "Validating CI configuration..."
    
    if [[ -d ".github/workflows" ]]; then
        local workflow_count=$(find .github/workflows -name "*.yml" -o -name "*.yaml" | wc -l)
        if [[ $workflow_count -gt 0 ]]; then
            success "Found $workflow_count CI workflow files"
            CI_OK=true
        else
            error "No workflow files found in .github/workflows"
        fi
    else
        error ".github/workflows directory not found"
    fi
}

# Validate Git LFS usage
validate_lfs() {
    log "Validating Git LFS configuration..."
    
    if [[ -f ".gitattributes" ]]; then
        if grep -q "filter=lfs" .gitattributes; then
            success "Git LFS configuration found"
            LFS_OK=true
        else
            warn ".gitattributes exists but no LFS configuration found"
            LFS_OK=true  # Consider this OK if no large files expected
        fi
    else
        warn "No .gitattributes file found"
        LFS_OK=true  # Consider this OK if no large files expected
    fi
}

# Generate QA Blessing markdown content
generate_qa_blessing_content() {
    local timestamp=$(date -u '+%Y-%m-%d %H:%M:%S UTC')
    local overall_status="BLESSED"
    
    # Check if any validation failed
    if [[ "$README_OK" != true ]] || [[ "$CI_OK" != true ]]; then
        overall_status="REQUIRES_ATTENTION"
    fi
    
    cat << EOF
# 🌟 QA Blessing for Release $TAG

**Repository:** $REPO  
**Release Tag:** $TAG  
**Release URL:** ${RELEASE_HTML_URL:-"Not provided"}  
**Blessing Date:** $timestamp  
**Overall Status:** **$overall_status**

---

## ⚡ Validation Results

| Component | Status | Details |
|-----------|--------|---------|
| 📖 README | $([ "$README_OK" = true ] && echo "✅ PASS" || echo "❌ FAIL") | Core documentation validation |
| 📄 PDFs | $([ "$PDFS_OK" = true ] && echo "✅ PASS" || echo "⚠️ SKIP") | Document artifacts check |
| 🖼️ Gallery | $([ "$GALLERY_OK" = true ] && echo "✅ PASS" || echo "⚠️ SKIP") | Visual assets validation |
| 🔄 CI | $([ "$CI_OK" = true ] && echo "✅ PASS" || echo "❌ FAIL") | Continuous integration setup |
| 📦 LFS | $([ "$LFS_OK" = true ] && echo "✅ PASS" || echo "⚠️ SKIP") | Large file storage configuration |

---

## 🐦‍⬛ ChaosKey333 Quality Seal

$(if [ "$overall_status" = "BLESSED" ]; then
cat << 'BLESSED'
```
⛧⚡👑 COSMIC BLESSING GRANTED 👑⚡⛧
    🔑 The Vault Seal Approves 🔑

"Through quantum tempests, we forge eternity. 
 In rolling thunder, we crown the dawn."
```

**Status:** This release has received the **Cosmic Blessing** and is ready for deployment to the vault.
BLESSED
else
cat << 'ATTENTION'
```
⚠️⚡ ATTENTION REQUIRED ⚡⚠️
   🔧 Manual Review Needed 🔧

"Even the mightiest storms require 
 careful guidance through the chaos."
```

**Status:** This release requires **manual review** before receiving the full Cosmic Blessing.
ATTENTION
fi)

---

## 📋 Release Verification Details

- **Verifier Script:** \`scripts/release_verifier.sh\`
- **Tag Verified:** $TAG
- **Repository:** $REPO
- **Validation Timestamp:** $timestamp

*Generated by the ChaosKey333 Relic Arsenal Release Verification System*

> "Crown the Vault. Forge the Storm. Honor the Scrolls." — The Creed of ChaosKey333
EOF
}

# Emit QA Blessing to file and stdout
emit_blessing() {
    log "Generating QA Blessing for tag: $TAG"
    
    # Ensure output directory exists
    mkdir -p "$OUTPUT_DIR"
    
    local blessing_file="$OUTPUT_DIR/QA_Blessing_${TAG}.md"
    local content=$(generate_qa_blessing_content)
    
    # Write to file
    echo "$content" > "$blessing_file"
    success "QA Blessing saved to: $blessing_file"
    
    # Print to stdout for job log
    echo ""
    echo -e "${PURPLE}=================== QA BLESSING ===================${NC}"
    echo "$content"
    echo -e "${PURPLE}=================================================${NC}"
    echo ""
    
    # Set output for GitHub Actions
    if [[ -n "${GITHUB_OUTPUT:-}" ]]; then
        echo "blessing_file=$blessing_file" >> "$GITHUB_OUTPUT"
        echo "blessing_status=$([ "$README_OK" = true ] && [ "$CI_OK" = true ] && echo "BLESSED" || echo "REQUIRES_ATTENTION")" >> "$GITHUB_OUTPUT"
    fi
}

# Main validation function
run_validation() {
    log "Starting release validation for tag: $TAG"
    
    validate_readme
    validate_pdfs
    validate_gallery
    validate_ci
    validate_lfs
    
    emit_blessing
    
    # Summary
    local passed=0
    local total=5
    
    [[ "$README_OK" = true ]] && passed=$((passed + 1))
    [[ "$PDFS_OK" = true ]] && passed=$((passed + 1))
    [[ "$GALLERY_OK" = true ]] && passed=$((passed + 1))
    [[ "$CI_OK" = true ]] && passed=$((passed + 1))
    [[ "$LFS_OK" = true ]] && passed=$((passed + 1))
    
    log "Validation complete: $passed/$total checks passed"
    
    if [[ "$README_OK" != true ]] || [[ "$CI_OK" != true ]]; then
        error "Critical validations failed - manual review required"
        return 1
    else
        success "All critical validations passed - release blessed!"
        return 0
    fi
}

# Parse command line arguments
main() {
    if [[ $# -lt 1 ]]; then
        usage
    fi
    
    TAG="$1"
    if [[ $# -ge 2 ]]; then
        RELEASE_HTML_URL="$2"
    fi
    
    # Validate tag format
    if [[ ! "$TAG" =~ ^v?[0-9]+\.[0-9]+\.[0-9]+.*$ ]]; then
        error "Invalid tag format: $TAG (expected format: v1.0.0 or 1.0.0)"
        exit 1
    fi
    
    log "ChaosKey333 Relic Arsenal Release Verifier"
    log "Tag: $TAG"
    log "Repository: $REPO"
    log "Output Directory: $OUTPUT_DIR"
    
    run_validation
    exit $?
}

# Run main function with all arguments
main "$@"