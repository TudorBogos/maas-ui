export type NavItem = {
  adminOnly?: boolean;
  external?: boolean;
  highlight?: string[] | string;
  label: string;
  url: string;
};

export type NavGroup = {
  adminOnly?: boolean;
  navLinks: NavItem[];
  groupTitle?: string;
  groupIcon?: string;
};
