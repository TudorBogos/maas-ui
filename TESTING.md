# Testing

This fork keeps Canonical MAAS UI's existing test stack. Use focused tests for
CTI-only restricted UI behavior and avoid expanding general upstream app
coverage unless that is explicitly requested.

## Unit Tests

Run the Vitest suite in UTC:

```bash
yarn test
```

This is equivalent to:

```bash
TZ=UTC yarn vitest
```

Run coverage with:

```bash
yarn test-coverage
```

The CTI restricted UI tests live in `src/restricted-tests/` and can be run
without the general app suite:

```bash
yarn test-restricted
```

This is equivalent to:

```bash
TZ=UTC yarn vitest run src/restricted-tests
```

Restricted user behavior should stay covered in `src/restricted-tests/` and
target fork-specific `Restricted*` components or their direct integration
points. Do not add broad route, app shell, or unrelated upstream component
tests for restricted UI changes unless the change directly touches those
surfaces.

## Lint And Types

Run linting and TypeScript checks with:

```bash
yarn lint
```

This runs package JSON linting, ESLint, and TypeScript checks for both the app
and Cypress configuration.

## Browser Tests

Run Playwright documentation link checks with:

```bash
yarn test-docs-links
```

Run Cypress tests with:

```bash
yarn cypress-run
```

Cypress tests require the local app/server workflow. For the scripted local
workflow, use:

```bash
yarn test-cypress
```

That command starts the app, waits for it to become available, and then runs the
Cypress suite.
