import type { ReactElement } from "react";

import NodeActionMenu from "@/app/base/components/NodeActionMenu";
import { useSendAnalytics } from "@/app/base/hooks";
import { MachineSidePanelViews } from "@/app/machines/constants";
import type { MachineSetSidePanelContent } from "@/app/machines/types";
import RestrictedMachineActionMenuGroup from "@/app/machines/views/MachineList/MachineListControls/MachineActionMenu/RestrictedMachineActionMenuGroup";
import type { useHasSelection } from "@/app/store/machine/utils/hooks";
import { NodeActions } from "@/app/store/types/node";
import { getNodeActionTitle } from "@/app/store/utils";

const restrictedExcludedActions = [
  NodeActions.ACQUIRE,
  NodeActions.CHECK_POWER,
  NodeActions.CLONE,
  NodeActions.COMMISSION,
  NodeActions.DELETE,
  NodeActions.EXIT_RESCUE_MODE,
  NodeActions.IMPORT_IMAGES,
  NodeActions.MARK_BROKEN,
  NodeActions.MARK_FIXED,
  NodeActions.OVERRIDE_FAILED_TESTING,
  NodeActions.RESCUE_MODE,
  NodeActions.SET_POOL,
  NodeActions.SET_ZONE,
  NodeActions.TAG,
  NodeActions.TEST,
];

const RestrictedMachineActionMenu = ({
  hasSelection,
  setSidePanelContent,
}: {
  hasSelection: ReturnType<typeof useHasSelection>;
  setSidePanelContent: MachineSetSidePanelContent;
}): ReactElement => {
  const sendAnalytics = useSendAnalytics();

  const commonProps = {
    alwaysShowLifecycle: true,
    excludeActions: restrictedExcludedActions,
    hasSelection,
    nodeDisplay: "machine",
    onActionClick: (action: NodeActions) => {
      const view = Object.values(MachineSidePanelViews).find(
        ([, actionName]) => actionName === action
      );
      if (view) {
        setSidePanelContent({ view });
      }
      sendAnalytics(
        "Machine list action form",
        getNodeActionTitle(action),
        "Open"
      );
    },
  };

  return (
    <>
      <div className="u-hide--medium u-hide--small">
        <RestrictedMachineActionMenuGroup
          hasSelection={hasSelection}
          onActionClick={commonProps.onActionClick}
        />
      </div>
      <div className="u-hide--large">
        <NodeActionMenu
          {...commonProps}
          className="is-maas-select"
          constrainPanelWidth
          menuPosition="left"
          toggleAppearance=""
          toggleClassName="p-action-menu"
          toggleLabel="Menu"
        />
      </div>
    </>
  );
};

export default RestrictedMachineActionMenu;
