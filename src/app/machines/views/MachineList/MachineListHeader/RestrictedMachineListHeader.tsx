import { useEffect } from "react";

import RestrictedMachineListControls from "../MachineListControls/RestrictedMachineListControls";
import type { useResponsiveColumns } from "../hooks";

import { usePoolCount } from "@/app/api/query/pools";
import type { SetSearchFilter } from "@/app/base/types";
import type { MachineSetSidePanelContent } from "@/app/machines/types";
import { FetchGroupKey } from "@/app/store/machine/types";
import { useFetchMachineCount } from "@/app/store/machine/utils/hooks";

type Props = {
  hiddenColumns?: ReturnType<typeof useResponsiveColumns>[0];
  searchFilter: string;
  setGrouping: (group: FetchGroupKey | null) => void;
  setHiddenColumns: ReturnType<typeof useResponsiveColumns>[1];
  setHiddenGroups: (groups: string[]) => void;
  setSearchFilter: SetSearchFilter;
  setSidePanelContent: MachineSetSidePanelContent;
};

export const RestrictedMachineListHeader = ({
  hiddenColumns = [],
  searchFilter,
  setGrouping,
  setHiddenColumns,
  setHiddenGroups,
  setSearchFilter,
  setSidePanelContent,
}: Props): React.ReactElement => {
  const { machineCount: allMachineCount } = useFetchMachineCount();
  const resourcePoolsCount = usePoolCount();

  useEffect(() => {
    if (searchFilter !== "") {
      setSearchFilter("");
    }
    setGrouping(FetchGroupKey.None);
    setHiddenGroups([]);
  }, [searchFilter, setGrouping, setHiddenGroups, setSearchFilter]);

  return (
    <RestrictedMachineListControls
      hiddenColumns={hiddenColumns}
      machineCount={allMachineCount}
      resourcePoolsCount={resourcePoolsCount.data ?? 0}
      setHiddenColumns={setHiddenColumns}
      setSidePanelContent={setSidePanelContent}
    />
  );
};

export default RestrictedMachineListHeader;
