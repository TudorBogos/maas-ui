# CTI MAAS UI

CTI MAAS UI is a branded fork of Canonical's `maas-ui` for the CTI MAAS
deployment. The upstream project documentation is preserved in
[CANONICAL_README.md](CANONICAL_README.md).

This repository builds the static MAAS web UI served from `/MAAS/r/`.

## Documentation

- [PREREQUISITES.md](PREREQUISITES.md): local build and production host prerequisites
- [DEPLOYMENT.md](DEPLOYMENT.md): GitLab CI deployment, sudoers, and manual deploy commands
- [nginx.conf](nginx.conf): production nginx site for serving the SPA under `/MAAS/r/`
- [CANONICAL_README.md](CANONICAL_README.md): original Canonical MAAS UI documentation
- [GIT.md](GIT.md): Git remote setup

## Changes From Canonical MAAS UI

This fork is based on Canonical MAAS UI 3.7. In this repository, "original"
means the upstream 3.7 codebase before the CTI branded UI changes, represented
locally by commit `249358946`.

Fork-specific changes:

- Added the CTI theme color and made CTI the default theme.
- Removed the status bar from the app shell.
- Hid admin-only navigation entries from non-admin users.
- Added a `SuperUserOnly` guard for protected MAAS routes.
- Changed the user details page so superusers get the editable user form, while
  non-superusers see read-only username and email details.
- Removed the owner full-name column toggle from the machine list.
- Adjusted secondary navigation height after removing the status bar.
- Added Git remote setup documentation.

## Build

```bash
yarn install --frozen-lockfile
yarn build
```

The build output is written to `build/`.
