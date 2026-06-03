## Project Directives

- Do not add or alter tests for newly introduced user-only behavior, branded-ui behavior, or component changes unless explicitly requested.
- Implement user-restriction UI and behavior changes in separate components prefixed with `Restricted` instead of modifying the shared/default components directly.
