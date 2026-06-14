# CTI MAAS UI Prerequisites

This document covers the prerequisites needed to build and deploy the CTI MAAS
UI.

## Local Build

Install:

- Node.js `v20`
- Yarn
- Git

The project uses `yarn.lock`; install dependencies with:

```bash
yarn install --frozen-lockfile
```

Build output is written to `build/`. The package is configured for the
`/MAAS/r/` base path.

## Production Host

Production deployment uses a shell GitLab Runner on the web host that serves:

```text
/var/www/branded-ui
```

Install these packages on the host:

- Node.js `v20`
- Yarn
- Git
- rsync
- nginx

Required Linux users and groups:

- `deploy` group exists
- `gitlab-runner` is a member of `deploy`
- deployed files are owned by `www-data:deploy`

One-time host setup, if the group membership is not already configured:

```bash
sudo groupadd --system deploy
sudo usermod -aG deploy gitlab-runner
```

If `deploy` already exists, only ensure `gitlab-runner` is a member:

```bash
sudo usermod -aG deploy gitlab-runner
```

The GitLab Runner must have these tags:

- `maas-check`
- `maas-deploy`
