import type { NavGroup } from "./types";

import urls from "@/app/base/urls";

const navGroups: NavGroup[] = [
  {
    groupTitle: "Hardware",
    groupIcon: "machines",
    navLinks: [
      {
        highlight: [urls.machines.index, urls.machines.machine.index(null)],
        label: "Machines",
        url: urls.machines.index,
      },
      {
        adminOnly: true,
        highlight: [urls.devices.index, urls.devices.device.index(null)],
        label: "Devices",
        url: urls.devices.index,
      },
      {
        adminOnly: true,
        highlight: [
          urls.controllers.index,
          urls.controllers.controller.index(null),
        ],
        label: "Controllers",
        url: urls.controllers.index,
      },
    ],
  },
  {
    adminOnly: true,
    groupTitle: "KVM",
    groupIcon: "cluster-light",
    navLinks: [
      {
        adminOnly: true,
        label: "LXD",
        url: urls.kvm.lxd.index,
      },
      {
        adminOnly: true,
        label: "Virsh",
        url: urls.kvm.virsh.index,
      },
    ],
  },
  {
    adminOnly: true,
    groupTitle: "Organisation",
    groupIcon: "tag",
    navLinks: [
      {
        adminOnly: true,
        highlight: [urls.tags.index, urls.tags.tag.index(null)],
        label: "Tags",
        url: urls.tags.index,
      },
      {
        adminOnly: true,
        highlight: [urls.zones.index],
        label: "AZs",
        url: urls.zones.index,
      },
      {
        adminOnly: true,
        label: "Pools",
        url: urls.pools.index,
      },
    ],
  },
  {
    adminOnly: true,
    groupTitle: "Configuration",
    groupIcon: "units",
    navLinks: [
      {
        adminOnly: true,
        label: "Images",
        url: urls.images.index,
      },
    ],
  },
  {
    adminOnly: true,
    groupTitle: "Networking",
    groupIcon: "connected",
    navLinks: [
      {
        highlight: [
          urls.subnets.index,
          urls.subnets.subnet.index(null),
          urls.subnets.space.index(null),
          urls.subnets.fabric.index(null),
          urls.subnets.vlan.index(null),
        ],
        label: "Subnets",
        url: urls.subnets.index,
      },
      {
        adminOnly: true,
        highlight: [urls.domains.index, urls.domains.details(null)],
        label: "DNS",
        url: urls.domains.index,
      },
      {
        adminOnly: true,
        label: "Network discovery",
        url: urls.networkDiscovery.index,
      },
    ],
  },
];

export { navGroups };
