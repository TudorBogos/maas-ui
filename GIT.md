# Git Remotes

CTI is the main source of truth.

- Pull/fetch from CTI: `git@git.cti.ugal.ro:maas/maas-ui.git`
- Push to CTI and GitHub fork
- Use Canonical GitHub as `upstream` only when needed

## Clone

```bash
git clone git@git.cti.ugal.ro:maas/maas-ui.git
cd maas-ui

git remote set-url --push origin git@git.cti.ugal.ro:maas/maas-ui.git
git remote set-url --add --push origin git@github.com:TudorBogos/maas-ui.git
git remote add upstream git@github.com:canonical/maas-ui.git
```

## Existing Clone

```bash
git remote set-url origin git@git.cti.ugal.ro:maas/maas-ui.git
git remote set-url --push origin git@git.cti.ugal.ro:maas/maas-ui.git
git remote set-url --add --push origin git@github.com:TudorBogos/maas-ui.git
git remote set-url upstream git@github.com:canonical/maas-ui.git
```

## Check

```bash
git remote -v
```

Expected:

```text
origin    git@git.cti.ugal.ro:maas/maas-ui.git (fetch)
origin    git@git.cti.ugal.ro:maas/maas-ui.git (push)
origin    git@github.com:TudorBogos/maas-ui.git (push)
upstream  git@github.com:canonical/maas-ui.git (fetch)
upstream  git@github.com:canonical/maas-ui.git (push)
```

## Daily Use

```bash
git pull --ff-only
git push origin dev
```

`git pull --ff-only` pulls from CTI. `git push origin dev` pushes to both CTI and GitHub.
