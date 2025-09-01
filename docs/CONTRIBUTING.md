# Contributing

## Branching
- feature/*, fix/*, chore/*

## Commit Style
Conventional commits (e.g., `feat:`, `fix:`, `chore:`).

## PR Checklist
- [ ] Lint passes (`npm run check:lint` or CI)
- [ ] Prettier check passes (`npm run check:format`)
- [ ] Tests added/updated (`npm test`)
- [ ] Coverage stable for touched areas
- [ ] Docs updated (if needed)

## Local Dev
```bash
npm ci
npm run check:lint
npm test
npm run dev
```

## Release Verification

### Overview
The repository includes a release verification system to validate GitHub releases and their associated assets before publication.

### Release Verifier Script
Located at `scripts/release_verifier.sh`, this script performs comprehensive validation:

#### Prerequisites
- GitHub CLI (`gh`) installed and authenticated
- `jq` JSON processor installed
- Git repository context

#### Usage
```bash
# Basic verification
./scripts/release_verifier.sh v1.7.0

# Verbose output
./scripts/release_verifier.sh --verbose v1.7.0

# Different repository
./scripts/release_verifier.sh --repo owner/repo v1.0.0

# Help
./scripts/release_verifier.sh --help
```

#### Verification Checklist
The script validates:
- ✅ GitHub release existence and accessibility
- ✅ Required asset patterns:
  - `docs/scrolls/*.pdf` - Sacred scroll documents
  - `assets/social/sigil-of-thunder/*.png` - Social media sigils
  - Optional thumbnail assets
- ✅ Required files in main branch:
  - `README.md` (required)
  - `docs/gallery/index.md` (optional)
- ✅ README link validation:
  - Must contain links to `docs/scrolls/`
  - Optionally links to `docs/gallery/index.md`
- ✅ CI status for main branch
- ✅ `update_scrolls.yml` workflow status (optional)

### GitHub Action: Verify Release
Manually triggerable workflow at `.github/workflows/verify-release.yml`:

#### Triggering the Action
1. Go to Actions → Verify Release
2. Click "Run workflow"
3. Enter the release tag (e.g., `v1.7.0`)
4. Optionally enable verbose output
5. Click "Run workflow"

#### Output
- Detailed verification logs
- Step-by-step validation results
- Summary in GitHub Actions interface
- Success/failure status for each check

### Integration with Release Flow
The verification system complements the existing Release Please workflow:

1. **Development**: Create features with conventional commits
2. **Release PR**: Release Please creates release PR with version bump
3. **Pre-merge**: Optionally run verification on target tag
4. **Release**: Merge release PR to publish tag and GitHub Release
5. **Post-release**: Run verification to validate published release

### Best Practices
- Run verification before merging release PRs
- Use verbose mode for debugging release issues
- Ensure all required assets are included in releases
- Validate README links point to current content
- Check CI status before release publication

### Post-Release QA Template
After a release is published, use this template to comment on the release page:

```markdown
## 🌟 Post-Release QA Verification

### Automated Checks ✅
- [ ] Release verification script passed
- [ ] All required assets present
- [ ] README links validated
- [ ] CI status confirmed green

### Manual Validation ✅
- [ ] Release notes accurate and complete
- [ ] Assets download correctly
- [ ] Documentation links functional
- [ ] Social media assets ready for distribution

### Community Impact 🌌
- [ ] Release announced on relevant platforms
- [ ] Community feedback channels monitored
- [ ] Known issues documented if any

**Verified by:** @username  
**Timestamp:** YYYY-MM-DD HH:MM UTC  
**Tools used:** Release Verifier Script v1.0

⚡ Render the Prophecy. Seal the Vault.  
🐦‍⬛ ChaosKey333
```