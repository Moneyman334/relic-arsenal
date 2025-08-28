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