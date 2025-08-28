![Gatekeeper CI](https://img.shields.io/badge/Gatekeeper-CI-green)
![Coverage](https://img.shields.io/badge/Coverage-Auto--report-blue)
![License](https://img.shields.io/badge/License-Project-blueviolet)

# Prophecy Gate – Vault Overview

Welcome to the Vault. This repo powers the ChaosKey333 ecosystem.

## Quickstart
1. `npm ci`
2. `npm run check:lint` (or CI lint)
3. `npm test`
4. `npm run dev` (framework default)

## Architecture
- **Next.js** app → pages/app routes
- **Gatekeeper CI** → lint, format, test, build, (optional deploy)
- **Guardian Tests** → Vitest + coverage

## Contributing
See [CONTRIBUTING.md](./CONTRIBUTING.md)