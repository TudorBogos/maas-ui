import { MainToolbar } from "@canonical/maas-react-components";
import { Button, Icon } from "@canonical/react-components";
import pluralize from "pluralize";
import { useDispatch } from "react-redux";
import { Link } from "react-router";

import urls from "@/app/base/urls";
import type { MachineSetSidePanelContent } from "@/app/machines/types";
import HiddenColumnsSelect from "@/app/machines/views/MachineList/MachineListControls/HiddenColumnsSelect";
import RestrictedMachineActionMenu from "@/app/machines/views/MachineList/MachineListControls/MachineActionMenu/RestrictedMachineActionMenu";
import type { useResponsiveColumns } from "@/app/machines/views/MachineList/hooks";
import { machineActions } from "@/app/store/machine";
import { useHasSelection } from "@/app/store/machine/utils/hooks";

type Props = {
  hiddenColumns: string[];
  machineCount: number;
  resourcePoolsCount: number;
  setHiddenColumns: ReturnType<typeof useResponsiveColumns>[1];
  setSidePanelContent: MachineSetSidePanelContent;
};

const RestrictedMachineListControls = ({
  hiddenColumns,
  machineCount,
  resourcePoolsCount,
  setHiddenColumns,
  setSidePanelContent,
}: Props): React.ReactElement => {
  const hasSelection = useHasSelection();
  const dispatch = useDispatch();

  return (
    <MainToolbar>
      <MainToolbar.Title>
        {machineCount} machines in{" "}
        <Link to={urls.pools.index}>
          {resourcePoolsCount} {pluralize("pool", resourcePoolsCount)}
        </Link>
      </MainToolbar.Title>
      <MainToolbar.Controls>
        {hasSelection ? (
          <>
            <RestrictedMachineActionMenu
              hasSelection={hasSelection}
              setSidePanelContent={setSidePanelContent}
            />
            <Button
              appearance="link"
              onClick={() => dispatch(machineActions.setSelected(null))}
            >
              Clear selection <Icon name="close-link" />
            </Button>
          </>
        ) : null}
        <HiddenColumnsSelect
          hiddenColumns={hiddenColumns}
          setHiddenColumns={setHiddenColumns}
        />
      </MainToolbar.Controls>
    </MainToolbar>
  );
};

export default RestrictedMachineListControls;
