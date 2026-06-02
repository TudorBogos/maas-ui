import type { ReactElement } from "react";

import { ContextualMenu, Tooltip } from "@canonical/react-components";
import type { ButtonProps } from "@canonical/react-components";

import type { DataTestElement } from "@/app/base/types";
import { NodeActions } from "@/app/store/types/node";
import { getNodeActionTitle } from "@/app/store/utils";

type ActionGroup = {
  actions: NodeActions[];
  title: string;
};

type ActionLink = DataTestElement<ButtonProps>;

const actionGroups: ActionGroup[] = [
  {
    actions: [NodeActions.ACQUIRE, NodeActions.DEPLOY, NodeActions.RELEASE],
    title: "Actions",
  },
  {
    actions: [
      NodeActions.ON,
      NodeActions.OFF,
      NodeActions.POWER_CYCLE,
      NodeActions.SOFT_OFF,
    ],
    title: "Power",
  },
  {
    actions: [NodeActions.LOCK, NodeActions.UNLOCK],
    title: "Lock",
  },
];

const RestrictedMachineActionMenuGroup = ({
  hasSelection,
  onActionClick,
}: {
  hasSelection: boolean;
  onActionClick: (action: NodeActions) => void;
}): ReactElement => {
  return (
    <Tooltip
      className="p-node-action-menu-group"
      message={
        !hasSelection ? "Select machines below to perform an action." : null
      }
    >
      {actionGroups.map(({ actions, title }) => {
        const links = actions.reduce<ActionLink[]>((links, action) => {
          if (
            action === NodeActions.POWER_CYCLE &&
            import.meta.env.VITE_APP_DPU_PROVISIONING !== "true"
          ) {
            return links;
          }

          links.push({
            children: (
              <div className="u-flex--between">
                <span>{getNodeActionTitle(action)} ...</span>
              </div>
            ),
            "data-testid": `action-link-${action}`,
            onClick: () => {
              onActionClick(action);
            },
          });
          return links;
        }, []);

        if (links.length === 0) {
          return null;
        }

        return (
          <span className="p-action-button--wrapper" key={title}>
            <ContextualMenu
              dropdownProps={{ "aria-label": `${title} submenu` }}
              hasToggleIcon
              links={links}
              position="left"
              toggleLabel={title}
            />
          </span>
        );
      })}
    </Tooltip>
  );
};

export default RestrictedMachineActionMenuGroup;
