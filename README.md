# CTI MAAS UI

CTI MAAS UI is a branded fork of Canonical's `maas-ui` for the CTI MAAS
deployment. The upstream project documentation is preserved in
[CANONICAL_README.md](CANONICAL_README.md).

This repository builds the static MAAS web UI served from:

```text
/MAAS/r/
```

The production build output is copied to:

```text
/var/www/branded-ui/MAAS/r
```

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
- Added Git remote setup documentation in [git.md](git.md).

## Build

Prerequisites:

- Node.js `v20`
- Yarn
- Git

Install dependencies and build:

```bash
yarn install --frozen-lockfile
yarn build
```

The build output is written to `build/`. The package is configured for the
`/MAAS/r/` base path.

## Deployment

Production deployment mirrors the contents of `build/` into:

```text
/var/www/branded-ui/MAAS/r
```

The deployed files should be owned by `www-data:deploy`. Directory permissions
should be `2774` so the setgid bit keeps new files in the `deploy` group. File
permissions should be `0774`.

The deployment is intentionally mirror-style: files that no longer exist in the
new `build/` output are removed from the web root so stale hashed assets do not
remain deployed.

### Manual Deployment

Run from the repository root:

```bash
yarn install --frozen-lockfile
yarn build
sudo /usr/bin/install -d -o www-data -g deploy -m 2774 /var/www/branded-ui/MAAS/r
sudo /usr/bin/rsync -a --delete --chown=www-data:deploy --chmod=D2774,F0774 build/ /var/www/branded-ui/MAAS/r/
```

## GitLab CI Prerequisites

Production CI is expected to run on a shell GitLab Runner installed on the web
host that serves `/var/www/branded-ui/MAAS/r`.

Host prerequisites:

- Node.js `v20`
- Yarn
- Git
- rsync
- A `deploy` group
- A `gitlab-runner` user that belongs to `deploy`
- GitLab Runner tags matching the pipeline jobs:
  - `maas-check`
  - `maas-deploy`

One-time host setup, if the group membership is not already configured:

```bash
sudo groupadd --system deploy
sudo usermod -aG deploy gitlab-runner
```

If `deploy` already exists, only ensure `gitlab-runner` is a member:

```bash
sudo usermod -aG deploy gitlab-runner
```

## Sudoers

Add this sudoers entry with `visudo`, preferably as
`/etc/sudoers.d/gitlab-runner-maas-ui`:

```sudoers
gitlab-runner ALL=(root) NOPASSWD: /usr/bin/install -d -o www-data -g deploy -m 2774 /var/www/branded-ui/MAAS/r, /usr/bin/rsync -a --delete --chown=www-data\:deploy --chmod=D2774,F0774 build/ /var/www/branded-ui/MAAS/r/
```

The CI deploy job should use the same commands as the manual deployment. The
explicit modes make the deployed ownership and permissions predictable without
requiring a deployment `umask`.
