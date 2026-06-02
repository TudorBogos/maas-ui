import { useEffect, useState } from "react";

import type { ValueOf } from "@canonical/react-components";
import { useDispatch, useSelector } from "react-redux";

import ErrorsNotification from "./ErrorsNotification";
import RestrictedMachineListTable from "./MachineListTable/RestrictedMachineListTable";
import { DEFAULTS } from "./MachineListTable/constants";
import { usePageSize, type useResponsiveColumns } from "./hooks";

import VaultNotification from "@/app/base/components/VaultNotification";
import { useFetchActions, useWindowTitle } from "@/app/base/hooks";
import type { SortDirection } from "@/app/base/types";
import { controllerActions } from "@/app/store/controller";
import { generalActions } from "@/app/store/general";
import { machineActions } from "@/app/store/machine";
import machineSelectors from "@/app/store/machine/selectors";
import { FetchGroupKey } from "@/app/store/machine/types";
import { useFetchMachines } from "@/app/store/machine/utils/hooks";

type Props = {
  headerFormOpen?: boolean;
  hiddenColumns: ReturnType<typeof useResponsiveColumns>[0];
};

const RestrictedMachineList = ({
  headerFormOpen,
  hiddenColumns,
}: Props): React.ReactElement => {
  useWindowTitle("Machines");
  const dispatch = useDispatch();
  const errors = useSelector(machineSelectors.errors);
  const [currentPage, setCurrentPage] = useState(1);
  const [sortKey, setSortKey] = useState<FetchGroupKey | null>(
    DEFAULTS.sortKey
  );
  const [sortDirection, setSortDirection] = useState<
    ValueOf<typeof SortDirection>
  >(DEFAULTS.sortDirection);
  const [pageSize, setPageSize] = usePageSize();

  const {
    callId,
    groups,
    loading,
    machineCount,
    machines,
    machinesErrors,
    totalPages,
  } = useFetchMachines({
    collapsedGroups: [],
    filters: {},
    grouping: FetchGroupKey.Status,
    sortDirection,
    sortKey,
    pagination: { currentPage, setCurrentPage, pageSize },
  });

  useEffect(
    () => () => {
      dispatch(machineActions.setSelected(null));
      dispatch(machineActions.cleanup());
    },
    [dispatch]
  );

  useFetchActions([controllerActions.fetch, generalActions.fetchVaultEnabled]);

  return (
    <>
      {errors && !headerFormOpen ? (
        <ErrorsNotification
          errors={errors}
          onAfterDismiss={() => dispatch(machineActions.cleanup())}
        />
      ) : null}
      {!headerFormOpen ? <ErrorsNotification errors={machinesErrors} /> : null}
      <VaultNotification />
      <RestrictedMachineListTable
        callId={callId}
        currentPage={currentPage}
        filter=""
        grouping={FetchGroupKey.Status}
        groups={groups}
        hiddenColumns={hiddenColumns}
        hiddenGroups={[]}
        machineCount={machineCount}
        machines={machines}
        machinesLoading={loading}
        pageSize={pageSize}
        setCurrentPage={setCurrentPage}
        setHiddenGroups={() => undefined}
        setPageSize={setPageSize}
        setSortDirection={setSortDirection}
        setSortKey={setSortKey}
        sortDirection={sortDirection}
        sortKey={sortKey}
        totalPages={totalPages}
      />
    </>
  );
};

export default RestrictedMachineList;
