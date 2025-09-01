# 🔮 ChaosKey333 Automation Features Guide

This document explains the automation features added to enhance the relic arsenal with cosmic efficiency.

## 🛡️ PR Hygiene and Readiness

**File**: `.github/PULL_REQUEST_TEMPLATE.md`

Enhanced PR template with comprehensive readiness checklist including:
- Core validation (lint, format, tests, coverage, build)
- QA blessing (manual testing, edge cases, performance, security)
- Documentation scrolls (code docs, user docs, changelog readiness)
- Integration harmony (breaking changes, dependencies, compatibility)

## 🔒 Compliance Guard

**File**: `.github/workflows/compliance.yml`

Automated security and compliance workflow that runs on push, PR, and weekly schedule:
- **Secrets Scanning**: Uses Truffelhog to detect exposed secrets
- **License Verification**: Validates Node.js dependencies against allowed licenses
- **Security Audit**: Runs npm audit for vulnerability detection
- **Python Support**: Checks Python dependencies if present

**Triggers**: Push to main, PRs, weekly schedule, manual dispatch

## ⚡ Hotfix Ritual

**File**: `scripts/hotfix.sh`

One-command emergency patch management script:

```bash
# Usage examples
./scripts/hotfix.sh patch "Fix critical authentication bug"
./scripts/hotfix.sh minor "Add emergency security feature"  
./scripts/hotfix.sh major "Breaking change for security compliance"
```

**Features**:
- Validates branch state and tests
- Creates conventional commits for Release Please
- Automatically pushes and triggers release workflow
- Includes cosmic ChaosKey333 aesthetics

## 🔮 QA Blessing Ritual

**File**: `.github/ISSUE_TEMPLATE/qa_blessing.yml`

Comprehensive pre-release validation form including:
- Functional validation checklist
- Performance validation metrics
- Security validation requirements  
- Deployment readiness verification
- Documentation validation
- Risk assessment and confidence levels

**Usage**: Create new issue → Select "QA Blessing Ritual" template

## 🧘 Mindset Pulse (Optional)

**File**: `.github/workflows/focus-pulse.yml`

Daily focus and goal-setting reminders with optional Slack/Discord integration:

**Setup**:
1. Add repository secrets: `SLACK_WEBHOOK_URL` and/or `DISCORD_WEBHOOK_URL`
2. Workflow runs daily at 9 AM UTC (Monday-Friday)
3. Supports manual dispatch with message type options

**Features**:
- Daily focus questions and goal setting
- Weekly planning and retrospective prompts
- Cosmic motivation and community building
- Weekly metrics generation

## 🔧 Pre-commit Hooks

**File**: `.pre-commit-config.yaml`

Fast local feedback for code quality:

**Setup**:
```bash
pip install pre-commit
pre-commit install
```

**Included Hooks**:
- **Python**: Ruff linter/formatter, Black formatter
- **JavaScript/TypeScript**: Prettier formatting
- **YAML**: Yamllint validation
- **Markdown**: Markdownlint with auto-fix
- **Git**: Trailing whitespace, merge conflicts, large files
- **Security**: Secret detection with baseline
- **Custom**: NPM audit, lint checks, cosmic banners

## 📜 Release Attachment Automation

**File**: `.github/workflows/attach-scrolls.yml`

Automatically attaches PDF scrolls from `docs/scrolls/` to GitHub releases:

**Features**:
- Triggers on release publication
- Supports manual dispatch for specific releases
- Discovers all PDF files in `docs/scrolls/`
- Updates release description with scroll manifest
- Maintains cosmic ChaosKey333 styling

**Usage**: Just publish a release - scrolls are attached automatically!

## 📚 README Scrolls Auto-Sync

**Files**: 
- `scripts/update_readme_scrolls.py` (Python script)
- `.github/workflows/update_scrolls.yml` (Workflow)

Enhanced scroll synchronization with cosmic descriptions:

**Manual Usage**:
```bash
# Preview changes
python scripts/update_readme_scrolls.py --dry-run --verbose

# Apply updates  
python scripts/update_readme_scrolls.py --verbose
```

**Features**:
- Scans `docs/scrolls/` for PDF, MD, and other document types
- Generates cosmic descriptions based on filename patterns
- Updates README.md between `<!-- SCROLLS:BEGIN -->` and `<!-- SCROLLS:END -->` markers
- Maintains special scroll descriptions for known files
- Automatic workflow trigger on scroll changes

**Workflow Triggers**: Push to main, PRs affecting scrolls, manual dispatch

## 🎯 Integration with Existing Workflows

All new features integrate seamlessly with existing repository workflows:

- **Release Please**: Hotfix script creates conventional commits for automatic versioning
- **CI/CD**: Compliance and pre-commit hooks enhance existing quality gates
- **Documentation**: Scroll sync preserves existing manual documentation structure
- **Security**: Adds layers without disrupting current development flow

## 🔮 Cosmic Configuration

Most features work out-of-the-box, but optional enhancements:

1. **Slack/Discord Integration**: Add webhook URLs to repository secrets
2. **Pre-commit Setup**: Install and configure for local development
3. **Secret Scanning Baseline**: Run detect-secrets to create baseline file
4. **Custom Scroll Descriptions**: Edit `SPECIAL_SCROLLS` in Python script

---

⚡ **"Through automation tempests, we forge efficiency. In cosmic workflows, we crown quality."** ⚡

🐦‍⬛ **ChaosKey333** 🐦‍⬛