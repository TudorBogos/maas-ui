# CTI maas-ui Architecture

This repository is a CTI-branded fork of Canonical's `maas-ui`. The upstream
architecture remains documented in Canonical's docs and in this repository's
preserved upstream documentation. This document only describes the local CTI
changes layered on top of the upstream MAAS UI 3.7 codebase.

In this repository, the local "original" baseline is commit `249358946`, as
noted in `README.md`.

## Fork Scope

The fork keeps the upstream React, Redux, TanStack Query, websocket, routing,
and build architecture. The CTI changes are concentrated in:

- CTI branding and theme defaults
- non-superuser route and navigation restrictions
- restricted machine list, action menu, and action forms
- read-only preference details for non-superusers
- CTI deployment through GitLab CI and nginx
- removal of upstream GitHub workflow and template files

Avoid documenting or refactoring broad upstream MAAS UI internals here unless a
local CTI change depends on them.

## Branding and Shell Changes

`src/app/base/theme-context.tsx` sets the default theme to `cti`. The general
settings form exposes the CTI theme option and uses CTI as the default when the
server does not provide a saved theme.

SCSS changes add and tune the CTI color treatment and adjust the application
layout after removing the upstream status bar. The app shell still uses the
upstream `Application`, side navigation, websocket connection handling, and
login flow.

The fork keeps Canonical's authenticated MAAS UI runtime model. After login,
the app checks authentication, opens the MAAS websocket, fetches version and
config data, and renders nested routes through `src/router.tsx`.

## Navigation and Route Restrictions

Route-level protection is implemented with
`src/app/base/components/SuperUserOnly/SuperUserOnly.tsx`.

`SuperUserOnly` reads the current user's superuser status with
`useGetIsSuperUser()`. When the user is not a superuser, it renders a simple
permission page instead of the protected route contents. It does not redirect.

`src/router.tsx` keeps these areas available to authenticated non-superusers:

- machine list
- machine details
- preferences, including API keys and SSH/SSL keys
- intro route

Most administrative sections are wrapped with `SuperUserOnly`, including
controllers, devices, DNS, images, KVM, network discovery, pools, settings,
subnets, tags, and zones.

Side navigation mirrors the same intent:

- admin-only groups and links are marked with `adminOnly`
- non-admin users only see allowed navigation entries
- admin users get an external `MAAS manager` link to `/manager/`
- all authenticated users get an external `Documentation` link to
  `https://maas.io/docs/`

`AppSideNavItem` supports external links with normal anchors, `target="_blank"`,
and `rel="noreferrer noopener"`. Internal links continue to use React Router
links.

## Restricted Machine Workflow

The machine page switches behavior based on `useGetIsSuperUser()` in
`src/app/machines/views/Machines.tsx`.

Superusers keep the upstream machine list, filters, grouping, and machine
actions. Non-superusers use the restricted path:

- `RestrictedMachineListHeader`
- `RestrictedMachineListControls`
- `RestrictedMachineActionMenu`
- `RestrictedMachineList`
- `RestrictedMachineListTable`
- `RestrictedStatusColumn`

The restricted list intentionally removes URL filter behavior by passing empty
filters into machine fetching. It forces grouping to status/none behavior,
clears hidden groups, and keeps pagination and sorting local to the restricted
list view.

The restricted action menu allows only a smaller lifecycle/power/lock action
set:

```text
deploy
release
power on
power off
power cycle
soft power off
lock
unlock
```

Actions such as acquire, abort, clone, commission, delete, import images, mark
broken/fixed, rescue mode, set pool, set zone, tag, and test are excluded from
the restricted menu.

The restricted status column exposes only deploy, release, lock, unlock, and
the existing logs link from inline row actions.

## Restricted Machine Forms

`MachineActionFormWrapper` receives the restricted flag from the machine page
and routes selected actions to restricted forms when needed.

Restricted release:

- uses `RestrictedReleaseForm`
- shows `RestrictedReleaseFormFields`
- keeps only the simplified erase toggle
- submits `erase` and `quick_erase` together from that toggle
- always submits `secure_erase: false`

Restricted deploy:

- uses `RestrictedDeployForm`
- shows `RestrictedDeployFormFields`
- removes the KVM host deploy option from the restricted UI
- keeps OS, release, kernel, user data, hardware sync, ephemeral deploy, and
  kernel crash dump options
- dispatches the same upstream machine deploy actions with only the restricted
  form values

The restricted forms still use upstream `ActionForm`, Redux machine actions,
selected-machine dispatch helpers, analytics hooks, and validation patterns.

## Preferences and Settings

`src/app/preferences/views/Details/Details.tsx` chooses the details experience
by current user role:

- superusers see the existing editable `EditUser` form for themselves
- non-superusers see `RestrictedDetails`

`RestrictedDetails` is read-only and displays only username and email, falling
back to `No email` when the email value is empty.

The settings route itself is admin-protected through `SuperUserOnly`. Settings
view changes remove non-CTI-exposed sections while keeping the upstream config
fetch and nested settings route component.

Network discovery is also admin-protected by route wrapping. Its local view no
longer performs a config fetch directly; config availability comes from the
protected app/runtime flow.

## Deployment

The fork deploys as a static build served by nginx:

```text
yarn build
build/ -> /var/www/branded-ui/
```

The package is configured for the `/MAAS/r/` base path. The repository nginx
site listens on `127.0.0.1:8080` and serves the SPA from
`/var/www/branded-ui`:

- `/` redirects to `/MAAS/r/`
- `/MAAS` redirects to `/MAAS/r/`
- `/MAAS/r/assets/...` serves built assets from `/assets/...`
- `/MAAS/r/maas-favicon-32px.png` serves the favicon from the document root
- `/MAAS/r/...` falls back to `index.html` for client-side routing
- dotfiles return `404`

The `/MAAS/r/` prefix exists in browser URL space, not as a physical
subdirectory under the document root.

GitLab CI replaces upstream GitHub workflows for this fork:

- `check` runs on merge request and push pipelines
- `deploy` runs only on default-branch push pipelines
- both jobs run `yarn install --frozen-lockfile` and `yarn build`
- deploy installs `nginx.conf`, mirrors `build/` into `/var/www/branded-ui/`
  with `rsync --delete`, validates nginx, and reloads nginx

The matching sudoers entry is kept in
`sudoers.d/gitlab-runner-branded-ui`.

## Maintenance Notes

Keep CTI-only user restriction behavior in components prefixed with
`Restricted`, following `AGENTS.md`. This keeps fork behavior visible and avoids
burying local policy inside upstream shared components.

Do not add or alter tests for newly introduced user-only behavior, branded UI
behavior, or component changes unless explicitly requested.

When updating from upstream, re-check the fork boundary around:

- `src/router.tsx`
- side navigation group/link definitions
- `Machines.tsx`
- restricted machine list/table/action/form components
- preference details role handling
- CTI theme defaults and SCSS color definitions
- deployment files and removed GitHub workflow files
