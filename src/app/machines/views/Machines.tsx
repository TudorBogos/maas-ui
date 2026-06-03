import { useCallback, useEffect, useState } from "react";

import { useSelector } from "react-redux";
import { useLocation, useNavigate, useMatch } from "react-router";
import { useStorageState } from "react-storage-hooks";

import MachineForms from "../components/MachineForms";

import MachineListHeader from "./MachineList/MachineListHeader";
import RestrictedMachineListHeader from "./MachineList/MachineListHeader/RestrictedMachineListHeader";
import { useGrouping, useResponsiveColumns } from "./MachineList/hooks";

import { useGetIsSuperUser } from "@/app/api/query/auth";
import PageContent from "@/app/base/components/PageContent/PageContent";
import { getSidePanelTitle, useSidePanel } from "@/app/base/side-panel-context";
import type { SyncNavigateFunction } from "@/app/base/types";
import urls from "@/app/base/urls";
import MachineList from "@/app/machines/views/MachineList";
import RestrictedMachineList from "@/app/machines/views/MachineList/RestrictedMachineList";
import machineSelectors from "@/app/store/machine/selectors";
import { selectedToFilters, FilterMachines } from "@/app/store/machine/utils";
import { useMachineSelectedCount } from "@/app/store/machine/utils/hooks";

const Machines = (): React.ReactElement => {
  const navigate: SyncNavigateFunction = useNavigate();
  const location = useLocation();
  const isSuperUser = useGetIsSuperUser();
  const isRestricted = isSuperUser.data === false;
  const currentFilters = FilterMachines.queryStringToFilters(location.search);
  // The filter state is initialised from the URL.
  const [searchFilter, setFilter] = useState(
    FilterMachines.filtersToString(currentFilters)
  );
  const { sidePanelContent, setSidePanelContent } = useSidePanel();

  const machinesPathMatch = useMatch(urls.machines.index);
  const selectedMachines = useSelector(machineSelectors.selected);

  // Close the side panel when there are no selected machines
  useEffect(() => {
    if (!machinesPathMatch || selectedToFilters(selectedMachines) === null) {
      setSidePanelContent(null);
    }
  }, [machinesPathMatch, selectedMachines, setSidePanelContent]);

  const filter = isRestricted
    ? {}
    : FilterMachines.parseFetchFilters(searchFilter);
  const setSearchFilter = useCallback(
    (searchText: string) => {
      setFilter(searchText);
      const filters = FilterMachines.getCurrentFilters(searchText);
      navigate(
        {
          search: FilterMachines.filtersToQueryString(filters),
        },
        { replace: true }
      );
    },
    [navigate, setFilter]
  );

  const [grouping, setGrouping] = useGrouping();

  const [hiddenColumns, setHiddenColumns] = useResponsiveColumns();

  // Get the count of selected machines that match the current filter
  const { selectedCount, selectedCountLoading } =
    useMachineSelectedCount(filter);

  const [hiddenGroups, setHiddenGroups] = useStorageState<(string | null)[]>(
    localStorage,
    "hiddenGroups",
    []
  );

  return (
    <PageContent
      header={
        isRestricted ? (
          <RestrictedMachineListHeader
            hiddenColumns={hiddenColumns}
            searchFilter={searchFilter}
            setGrouping={setGrouping}
            setHiddenColumns={setHiddenColumns}
            setHiddenGroups={setHiddenGroups}
            setSearchFilter={setSearchFilter}
            setSidePanelContent={setSidePanelContent}
          />
        ) : (
          <MachineListHeader
            grouping={grouping}
            hiddenColumns={hiddenColumns}
            searchFilter={searchFilter}
            setGrouping={setGrouping}
            setHiddenColumns={setHiddenColumns}
            setHiddenGroups={setHiddenGroups}
            setSearchFilter={setSearchFilter}
            setSidePanelContent={setSidePanelContent}
          />
        )
      }
      sidePanelContent={
        sidePanelContent && (
          <MachineForms
            isRestricted={isRestricted}
            searchFilter={isRestricted ? "" : searchFilter}
            selectedCount={selectedCount}
            selectedCountLoading={selectedCountLoading}
            selectedMachines={selectedMachines}
            setSearchFilter={setSearchFilter}
            setSidePanelContent={setSidePanelContent}
            sidePanelContent={sidePanelContent}
          />
        )
      }
      sidePanelTitle={
        sidePanelContent
          ? getSidePanelTitle("Machines", sidePanelContent)
          : null
      }
    >
      {isRestricted ? (
        <RestrictedMachineList
          headerFormOpen={!!sidePanelContent}
          hiddenColumns={hiddenColumns}
        />
      ) : (
        <MachineList
          grouping={grouping}
          headerFormOpen={!!sidePanelContent}
          hiddenColumns={hiddenColumns}
          hiddenGroups={hiddenGroups}
          searchFilter={searchFilter}
          setHiddenGroups={setHiddenGroups}
        />
      )}
    </PageContent>
  );
};

export default Machines;
