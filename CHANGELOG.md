# Changelog

All notable changes to this project will be documented in this file.

## [2.0.0](https://github.com/Moneyman334/relic-arsenal/compare/relic-arsenal-v1.7.0...relic-arsenal-v2.0.0) (2025-09-10)


### ⚠ BREAKING CHANGES

* Drop support for Node.js 18, now requires Node.js >=20

### ✨ Features

* expand CI matrix to Node 22.x and switch Vitest to node environment ([63826fe](https://github.com/Moneyman334/relic-arsenal/commit/63826fe7cfc7b3c081943f76873bfc8df8c548c2))
* **guardian:** add Vitest suite + coverage and Vault Docs (README, CONTRIBUTING, templates) ([9fdfa9e](https://github.com/Moneyman334/relic-arsenal/commit/9fdfa9e1b51b4f8672c8515b937248821f799bfe))
* harden repository for ESM compatibility with Node.js &gt;=20 ([9ded78c](https://github.com/Moneyman334/relic-arsenal/commit/9ded78c4fe072c77952567b793bd268ec157586a))
* implement release verification script and GitHub Action ([3cce6a6](https://github.com/Moneyman334/relic-arsenal/commit/3cce6a6c0cbe54a051b59dee480c43b03c2141f9))
* implement Rolling Thunderstorm VII (Quantum Dawn) - complete cosmic refinement ([99772bb](https://github.com/Moneyman334/relic-arsenal/commit/99772bb6a71623a8164e991590e380aa617b475a))


### 🛠 Chores

* add auto-update Scrolls section in README ([1777b76](https://github.com/Moneyman334/relic-arsenal/commit/1777b76d2382fa39f2a724595401953e990a155a))
* **release-please:** enforce manifest mode and top-level release labels ([4cd4496](https://github.com/Moneyman334/relic-arsenal/commit/4cd4496037db195802ed9c7810121a603880d3d8))
* **release-please:** seed manifest/config at 1.0.0 ([cd1f1ce](https://github.com/Moneyman334/relic-arsenal/commit/cd1f1ce3b727f5a9b4464455aa13d8f94ceeda55))


### 📜 Documentation

* add Release Flow section to README ([fc37e34](https://github.com/Moneyman334/relic-arsenal/commit/fc37e342b2f3423e855df12e740d56be488781e1))
* **readme:** add link to release flow section ([7dd6e3c](https://github.com/Moneyman334/relic-arsenal/commit/7dd6e3ce6bf56df9d53523a6a842b5f276afa3c7))

## [1.1.0] - 2025-09-02
- Scaffolded banner templates + reel overlays
- Added CHANGELOG.md + VERSION discipline
- Prepared vault for Relic Gallery expansion

## v0.1.0 – Guardian Online

✨ Highlights
- Gatekeeper CI established with Node.js 18 & 20 matrix.
- Guardian Tests added via Vitest, with coverage thresholds:
  - Statements: 60%
  - Branches: 50%
  - Functions: 60%
  - Lines: 60%
- Runtime sanity test ensures the suite always has a heartbeat.
- Live CI badge added in docs/README.md; Coverage + License badges retained as placeholders.
- Coverage directory check ensures artifacts remain consistent.
- PR template updates enforce coverage and test updates in reviews.

⚡ Breaking Changes
- None.

📝 Notes
- Coverage thresholds are a baseline — strict enough to keep quality, flexible enough to grow.
- Thresholds can be ratcheted up incrementally as the codebase matures.
