# Copilot Instructions - ChaosKey333 Relic Arsenal

This document provides project-aware prompts, validated commands, and CI/CD flows for the ChaosKey333 Relic Arsenal project.

## Project Overview

This is a TypeScript/Node.js project using:
- **Testing**: Vitest with coverage reporting
- **CI/CD**: GitHub Actions with Release Please
- **Code Quality**: Linting and formatting checks

## Getting Started

### Local Development Setup
```bash
# Clone the repository
git clone git@github.com:Moneyman334/relic-arsenal.git
cd relic-arsenal

# Install dependencies
npm ci

# Run tests with coverage
npm test

# Watch mode for development
npm run test:watch
```

## Available npm Scripts

### Core Commands
- `npm test` - Run tests with coverage reporting
- `npm run test:watch` - Run tests in watch mode
- `npm run coverage` - Generate coverage reports

### Validation Commands
- `npm run validate:copilot` - Validate that all npm scripts referenced in these instructions exist

## CI/CD Workflows

### Gatekeeper CI
Runs on every push and PR to main:
1. Installs dependencies with `npm ci`
2. Validates Copilot script references with `npm run validate:copilot`
3. Runs linting (if available)
4. Checks code formatting (if available)
5. Runs tests with coverage using `npm test`
6. Attempts build (if available)

### Release Please
Automated releases using conventional commits:
- Use conventional commit format: `feat:`, `fix:`, `chore:`
- Merging to main triggers release PR creation
- Release PR includes version bump and CHANGELOG updates

## Project Structure

```
relic-arsenal/
├── .github/
│   ├── workflows/           # CI/CD workflows
│   ├── copilot-instructions.md  # This file
│   └── PULL_REQUEST_TEMPLATE.md
├── tests/                   # Test files
├── docs/                    # Documentation
├── scripts/                 # Utility scripts
├── package.json             # Dependencies and scripts
└── vitest.config.ts         # Test configuration
```

## Contributing Guidelines

1. Follow conventional commit format
2. Ensure all tests pass: `npm test`
3. Maintain or improve test coverage
4. Update documentation as needed
5. Reference this file for local validation steps

## Coverage Requirements

The project maintains coverage thresholds:
- Statements: 60%
- Branches: 50%
- Functions: 60%
- Lines: 60%

## Troubleshooting

### Common Issues
- **No lint script**: The CI gracefully handles missing lint scripts
- **No build script**: The CI gracefully handles missing build scripts
- **Coverage issues**: Check `vitest.config.ts` for coverage configuration

### Validation
Always run `npm run validate:copilot` to ensure script references in this file are accurate.