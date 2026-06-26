const mocks = vi.hoisted(() => ({
  RestrictedMachineListControls: vi.fn(() => (
    <div data-testid="restricted-list-controls" />
  )),
  useFetchMachineCount: vi.fn(),
  usePoolCount: vi.fn(),
}));

vi.mock(
  "@/app/machines/views/MachineList/MachineListControls/RestrictedMachineListControls",
  () => ({
    default: mocks.RestrictedMachineListControls,
  })
);

vi.mock("@/app/api/query/pools", async () => {
  const actual: object = await vi.importActual("@/app/api/query/pools");
  return {
    ...actual,
    usePoolCount: mocks.usePoolCount,
  };
});

vi.mock("@/app/store/machine/utils/hooks", async () => {
  const actual: object = await vi.importActual(
    "@/app/store/machine/utils/hooks"
  );
  return {
    ...actual,
    useFetchMachineCount: mocks.useFetchMachineCount,
  };
});

import RestrictedMachineListHeader from "@/app/machines/views/MachineList/MachineListHeader/RestrictedMachineListHeader";
import { FetchGroupKey } from "@/app/store/machine/types";
import { renderWithProviders, screen, waitFor } from "@/testing/utils";

describe("RestrictedMachineListHeader", () => {
  beforeEach(() => {
    vi.clearAllMocks();
    mocks.useFetchMachineCount.mockReturnValue({ machineCount: 4 });
    mocks.usePoolCount.mockReturnValue({ data: 2 });
  });

  it("clears filters and grouping for the restricted list", async () => {
    const setGrouping = vi.fn();
    const setHiddenGroups = vi.fn();
    const setSearchFilter = vi.fn();

    renderWithProviders(
      <RestrictedMachineListHeader
        hiddenColumns={["zone"]}
        searchFilter="status:ready"
        setGrouping={setGrouping}
        setHiddenColumns={vi.fn()}
        setHiddenGroups={setHiddenGroups}
        setSearchFilter={setSearchFilter}
        setSidePanelContent={vi.fn()}
      />
    );

    await waitFor(() => {
      expect(setSearchFilter).toHaveBeenCalledWith("");
    });
    expect(setGrouping).toHaveBeenCalledWith(FetchGroupKey.None);
    expect(setHiddenGroups).toHaveBeenCalledWith([]);
  });

  it("renders restricted list controls with machine and pool counts", () => {
    const setHiddenColumns = vi.fn();
    const setSidePanelContent = vi.fn();

    renderWithProviders(
      <RestrictedMachineListHeader
        hiddenColumns={["zone"]}
        searchFilter=""
        setGrouping={vi.fn()}
        setHiddenColumns={setHiddenColumns}
        setHiddenGroups={vi.fn()}
        setSearchFilter={vi.fn()}
        setSidePanelContent={setSidePanelContent}
      />
    );

    expect(screen.getByTestId("restricted-list-controls")).toBeInTheDocument();
    expect(mocks.RestrictedMachineListControls).toHaveBeenCalledWith(
      expect.objectContaining({
        hiddenColumns: ["zone"],
        machineCount: 4,
        resourcePoolsCount: 2,
        setHiddenColumns,
        setSidePanelContent,
      }),
      undefined
    );
  });
});
