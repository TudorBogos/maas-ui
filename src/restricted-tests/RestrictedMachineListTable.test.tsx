const mocks = vi.hoisted(() => ({
  RestrictedStatusColumn: vi.fn(({ systemId }: { systemId: string }) => (
    <span>Restricted status {systemId}</span>
  )),
}));

vi.mock(
  "@/app/machines/views/MachineList/MachineListTable/StatusColumn/RestrictedStatusColumn",
  () => ({
    default: mocks.RestrictedStatusColumn,
  })
);

import { SortDirection } from "@/app/base/types";
import { RestrictedMachineListTable } from "@/app/machines/views/MachineList/MachineListTable/RestrictedMachineListTable";
import type { Machine, MachineStateListGroup } from "@/app/store/machine/types";
import { FetchGroupKey } from "@/app/store/machine/types";
import type { RootState } from "@/app/store/root/types";
import {
  FetchNodeStatus,
  NodeStatus,
  NodeStatusCode,
} from "@/app/store/types/node";
import * as factory from "@/testing/factories";
import { renderWithProviders, screen } from "@/testing/utils";

const defaultProps = {
  callId: "restricted-list",
  currentPage: 1,
  filter: "",
  grouping: FetchGroupKey.Status,
  hiddenColumns: [],
  hiddenGroups: [],
  machineCount: 2,
  machinesLoading: false,
  pageSize: 20,
  setCurrentPage: vi.fn(),
  setHiddenGroups: vi.fn(),
  setPageSize: vi.fn(),
  setSortDirection: vi.fn(),
  setSortKey: vi.fn(),
  sortDirection: SortDirection.NONE,
  sortKey: null,
  totalPages: 1,
};

describe("RestrictedMachineListTable", () => {
  let readyMachine: Machine;
  let deployedMachine: Machine;
  let groups: MachineStateListGroup[];
  let state: RootState;

  beforeEach(() => {
    vi.clearAllMocks();
    readyMachine = factory.machine({
      fqdn: "ready.example",
      hostname: "ready",
      status: NodeStatus.READY,
      status_code: NodeStatusCode.READY,
      system_id: "ready123",
    });
    deployedMachine = factory.machine({
      fqdn: "deployed.example",
      hostname: "deployed",
      status: NodeStatus.DEPLOYED,
      status_code: NodeStatusCode.DEPLOYED,
      system_id: "deployed123",
    });
    groups = [
      factory.machineStateListGroup({
        count: 1,
        items: [readyMachine.system_id],
        name: "Ready",
        value: FetchNodeStatus.READY,
      }),
      factory.machineStateListGroup({
        count: 1,
        items: [deployedMachine.system_id],
        name: "Deployed",
        value: FetchNodeStatus.DEPLOYED,
      }),
    ];
    state = factory.rootState({
      machine: factory.machineState({
        items: [readyMachine, deployedMachine],
      }),
    });
  });

  it("hides ready machines when active machines exist", () => {
    renderWithProviders(
      <RestrictedMachineListTable
        {...defaultProps}
        groups={groups}
        machines={[readyMachine, deployedMachine]}
      />,
      { state }
    );

    expect(screen.queryByText("ready")).not.toBeInTheDocument();
    expect(screen.getByText("deployed")).toBeInTheDocument();
  });

  it("keeps ready machines visible when no active machines exist", () => {
    groups = [
      factory.machineStateListGroup({
        count: 1,
        items: [readyMachine.system_id],
        name: "Ready",
        value: FetchNodeStatus.READY,
      }),
    ];
    state.machine.items = [readyMachine];

    renderWithProviders(
      <RestrictedMachineListTable
        {...defaultProps}
        groups={groups}
        machines={[readyMachine]}
      />,
      { state }
    );

    expect(screen.getByText("ready")).toBeInTheDocument();
  });

  it("uses the restricted status column for machine rows", () => {
    renderWithProviders(
      <RestrictedMachineListTable
        {...defaultProps}
        groups={groups}
        machines={[readyMachine, deployedMachine]}
      />,
      { state }
    );

    expect(
      screen.getByText(`Restricted status ${deployedMachine.system_id}`)
    ).toBeInTheDocument();
    expect(mocks.RestrictedStatusColumn).toHaveBeenCalledWith(
      expect.objectContaining({
        systemId: deployedMachine.system_id,
      }),
      undefined
    );
  });
});
