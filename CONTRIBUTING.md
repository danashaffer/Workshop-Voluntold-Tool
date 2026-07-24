# Contributing to Workshop Voluntold Tool

Thanks for improving the Workshop Voluntold Tool. Keep changes local-first, dependency-light, and safe to share publicly.

## Development setup

Use Node.js 22.13.0, matching `.nvmrc` and `.node-version`:

```bash
npm ci
npm run dev
```

Vite prints the local development URL. Source changes reload automatically.

## Quality gates

Run the complete local gate before opening a pull request:

```bash
npm run check
```

This runs ESLint, TypeScript, the production build, and tests.

## Privacy and public assets

- Never commit a real company roster, private portrait, credential, or machine-specific path.
- Use fictional names and placeholders in examples.
- Keep local exports outside the repository.
