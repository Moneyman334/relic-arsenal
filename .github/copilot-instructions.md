# ChaosKey333 Relic Arsenal - Copilot Instructions

Always reference these instructions first and fallback to search or bash commands only when you encounter unexpected information that does not match the info here.

## Project Overview
ChaosKey333 Relic Arsenal is a Node.js testing framework and documentation repository using Vitest for testing infrastructure. The project is currently in early development stage with a robust CI/CD pipeline but no application source code yet.

## Working Effectively

### Bootstrap and Test the Repository
Run these commands in order to set up a working development environment:

1. **Install dependencies:**
   ```bash
   npm ci
   ```
   - **Timing**: Takes 1-6 seconds (varies by network). NEVER CANCEL. Set timeout to 60+ seconds.
   - This command installs exact versions from package-lock.json
   - Fresh install: ~1.3 seconds, with cache: ~1 second

2. **Run tests with coverage:**
   ```bash
   npm test
   ```
   - **Timing**: Takes ~1 second. NEVER CANCEL. Set timeout to 30+ seconds.
   - Runs all tests and generates coverage report in `coverage/` directory
   - Equivalent to: `vitest run --coverage`
   - Test execution is very fast due to minimal test suite

3. **Run tests in watch mode (optional):**
   ```bash
   npm run test:watch
   ```
   - **Timing**: Takes ~1 second to start, then watches for changes
   - Useful for development, automatically re-runs tests on file changes
   - Equivalent to: `vitest`
   - Terminates automatically after running once if no changes detected

### Missing Scripts (CI Expects These)
The following scripts are referenced in documentation and CI but do NOT exist yet:
- `npm run check:lint` - Lint checking (CI gracefully skips if missing)
- `npm run check:format` - Prettier format checking (CI gracefully skips if missing) 
- `npm run build` - Build command (CI gracefully skips if missing)
- `npm run dev` - Development server (referenced in docs but doesn't exist)

**DO NOT** attempt to run these commands - they will fail with "Missing script" errors.

## Validation and Testing

### Manual Validation Scenarios
After making changes, always validate the following:

1. **Test Infrastructure Validation:**
   ```bash
   npm ci && npm test
   ```
   - Verify all tests pass and coverage is generated
   - Check that `coverage/index.html` is created and accessible
   - Verify test count remains accurate (currently 3 test files, 3 tests total)

2. **Coverage Report Functionality:**
   ```bash
   ls -la coverage/
   open coverage/index.html  # Or view in browser
   ```
   - Should contain: index.html, base.css, prettify.js, and other coverage assets
   - HTML report should open and display coverage metrics
   - Currently shows 0% coverage (expected - no source code exists yet)

3. **New Test Addition Workflow:**
   ```bash
   # Create a test file following existing patterns
   cat > tests/example.test.ts << 'EOF'
   import { describe, it, expect } from "vitest";
   describe("example", () => {
     it("should work", () => {
       expect(true).toBe(true);
     });
   });
   EOF
   
   # Run tests to verify it's detected
   npm test
   
   # Clean up
   rm tests/example.test.ts
   npm test
   ```
   - Test count should increase when adding, decrease when removing
   - All tests should continue to pass

4. **CI Pipeline Validation:**
   - The Gatekeeper CI workflow runs on push/PR to main branch
   - Tests on Node.js versions: 18.x, 20.x, 22.x
   - Gracefully handles missing lint/format/build scripts
   - Uploads coverage artifacts for each Node version

### Before Committing Changes
- Run `npm test` to ensure all tests pass
- Check that any new test files follow existing patterns in `tests/` directory
- Use conventional commit format: `feat:`, `fix:`, `chore:`, etc.

## Repository Structure

### Key Directories and Files
```
.
├── .github/
│   ├── workflows/ci.yml        # Gatekeeper CI pipeline
│   ├── workflows/release-please.yml  # Automated releases
│   └── PULL_REQUEST_TEMPLATE.md
├── coverage/                   # Generated test coverage reports
├── docs/                      # Project documentation
│   ├── README.md              # Architecture overview  
│   └── CONTRIBUTING.md        # Development guidelines
├── tests/                     # Vitest test files
│   ├── prophecy.spec.ts       # Sample test file
│   ├── runtime.spec.ts        # Runtime environment test
│   └── smoke.test.ts          # Basic smoke test
├── package.json              # Node.js project configuration
├── vitest.config.ts          # Vitest test configuration
└── README.md                 # Main project README
```

### Test Configuration (vitest.config.ts)
- Uses Node.js environment
- Coverage thresholds: 60% statements/functions/lines, 50% branches
- Generates HTML and text coverage reports
- Global test utilities enabled

## CI/CD Pipeline

### Gatekeeper CI (.github/workflows/ci.yml)
- **Triggers**: Push to main, PRs to main, manual dispatch
- **Node Versions**: 18.x, 20.x, 22.x matrix
- **Steps**: Install deps → Lint (optional) → Format check (optional) → Test with coverage → Build (optional)
- **Artifacts**: Coverage reports uploaded for each Node version

### Release Please (.github/workflows/release-please.yml)
- **Automated releases** using conventional commits
- **Versioning**: feat: = minor, fix: = patch, BREAKING CHANGE = major
- **Files**: .release-please-manifest.json, release-please-config.json
- Release PRs have label: "autorelease: pending"

## Common Tasks

### Adding New Tests
1. Create test file in `tests/` directory with `.test.ts` or `.spec.ts` extension
2. Import from `vitest`: `import { describe, it, expect } from "vitest";`
3. Follow existing test patterns (see `tests/smoke.test.ts` for example)
4. Run `npm test` to verify tests pass

### Project Development Workflow
1. Clone repository
2. Run `npm ci` to install dependencies (6 seconds)
3. Run `npm test` to verify setup (1 second)
4. Make changes
5. Run `npm test` to validate changes
6. Commit using conventional commit format
7. Open PR (CI will run automatically)

## Expected Command Outputs

### npm ci
```
added 151 packages, and audited 152 packages in 1s

37 packages are looking for funding
  run `npm fund` for details

found 0 vulnerabilities
```

### npm test
```
✓ tests/prophecy.spec.ts (1 test) 5ms
✓ tests/runtime.spec.ts (1 test) 4ms
✓ tests/smoke.test.ts (1 test) 4ms

Test Files  3 passed (3)
     Tests  3 passed (3)
  Start at  02:31:45
  Duration  378ms (transform 46ms, setup 0ms, collect 43ms, tests 12ms, environment 1ms, prepare 304ms)

% Coverage report from v8
----------|---------|----------|---------|---------|-------------------
File      | % Stmts | % Branch | % Funcs | % Lines | Uncovered Line #s 
----------|---------|----------|---------|---------|-------------------
All files |       0 |        0 |       0 |       0 |                   
----------|---------|----------|---------|---------|-------------------
```

### npm run (available scripts)
```
Lifecycle scripts included in relic-arsenal@1.0.0:
  test
    vitest run --coverage
available via `npm run-script`:
  test:watch
    vitest
  coverage
    vitest run --coverage
```

## Important Notes

- **NO SOURCE CODE YET**: This repository contains only testing infrastructure, no application code
- **TIMING CRITICAL**: All build/test timings are very fast (1-6 seconds) due to minimal codebase
  - `npm ci`: 1-6 seconds (network dependent)
  - `npm test`: ~1 second consistently 
  - `npm run test:watch`: ~1 second to start
- **CI RESILIENCE**: The CI pipeline is designed to gracefully handle missing scripts
- **COVERAGE EXPECTATIONS**: 0% coverage is expected until source code is added
- **DOCUMENTATION ASPIRATIONAL**: Some documentation references features not yet implemented (Next.js, dev server, lint scripts)

Always run the complete validation workflow (`npm ci && npm test`) after making any changes to ensure the testing infrastructure remains functional.