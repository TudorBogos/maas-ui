# CTI MAAS UI Deployment

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

## Host Prerequisites

See [PREREQUISITES.md](PREREQUISITES.md) for local build and production host
prerequisites.

## GitLab CI

The pipeline has two stages:

- `check`: runs on merge request and push pipelines.
- `deploy`: runs only on default-branch push pipelines.

Both jobs build with:

```bash
yarn install --frozen-lockfile
yarn build
```

The deploy job then mirrors the build output:

```bash
sudo /usr/bin/install -d -o www-data -g deploy -m 2774 /var/www/branded-ui/MAAS/r
sudo /usr/bin/rsync -a --delete --chown=www-data:deploy --chmod=D2774,F0774 build/ /var/www/branded-ui/MAAS/r/
```

## Sudoers

Add this sudoers entry with `visudo`, preferably as
`/etc/sudoers.d/gitlab-runner-maas-ui`:

```sudoers
gitlab-runner ALL=(root) NOPASSWD: /usr/bin/install -d -o www-data -g deploy -m 2774 /var/www/branded-ui/MAAS/r, /usr/bin/rsync -a --delete --chown=www-data\:deploy --chmod=D2774,F0774 build/ /var/www/branded-ui/MAAS/r/
```

The CI deploy job uses explicit ownership and permission modes so deployment
does not depend on the runner user's `umask`.

## Manual Deployment

Run from the repository root:

```bash
yarn install --frozen-lockfile
yarn build
sudo /usr/bin/install -d -o www-data -g deploy -m 2774 /var/www/branded-ui/MAAS/r
sudo /usr/bin/rsync -a --delete --chown=www-data:deploy --chmod=D2774,F0774 build/ /var/www/branded-ui/MAAS/r/
```
