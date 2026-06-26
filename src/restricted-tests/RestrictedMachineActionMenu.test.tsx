const mocks = vi.hoisted(() => ({
  NodeActionMenu: vi.fn(() => <div data-testid="mobile-action-menu" />),
  RestrictedMachineActionMenuGroup: vi.fn(() => (
    <div data-testid="desktop-action-menu" />
  )),
  setSidePanelContent: vi.fn(),
  useSendAnalytics: vi.fn(() => vi.fn()),
}));

vi.mock("@/app/base/components/NodeActionMenu", () => ({
  default: mocks.NodeActionMenu,
}));

vi.mock("@/app/base/hooks", async () => {
  const actual: object = await vi.importActual("@/app/base/hooks");
  return {
    ...actual,
    useSendAnalytics: mocks.useSendAnalytics,
  };
});

vi.mock(
  "@/app/machines/views/MachineList/MachineListControls/MachineActionMenu/RestrictedMachineActionMenuGroup",
  () => ({
    default: mocks.RestrictedMachineActionMenuGroup,
  })
);

import RestrictedMachineActionMenu from "@/app/machines/views/MachineList/MachineListControls/MachineActionMenu/RestrictedMachineActionMenu";
import { NodeActions } from "@/app/store/types/node";
import { renderWithProviders, screen } from "@/testing/utils";

describe("RestrictedMachineActionMenu", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("renders desktop and mobile restricted action menus", () => {
    renderWithProviders(
      <RestrictedMachineActionMenu
        hasSelection
        setSidePanelContent={mocks.setSidePanelContent}
      />
    );

    expect(screen.getByTestId("desktop-action-menu")).toBeInTheDocument();
    expect(screen.getByTestId("mobile-action-menu")).toBeInTheDocument();
    expect(mocks.NodeActionMenu).toHaveBeenCalledWith(
      expect.objectContaining({
        alwaysShowLifecycle: true,
        excludeActions: expect.arrayContaining([
          NodeActions.ABORT,
          NodeActions.ACQUIRE,
          NodeActions.CLONE,
          NodeActions.COMMISSION,
          NodeActions.DELETE,
          NodeActions.SET_POOL,
          NodeActions.SET_ZONE,
          NodeActions.TAG,
          NodeActions.TEST,
        ]),
        hasSelection: true,
        nodeDisplay: "machine",
      }),
      undefined
    );
  });

  it("opens the side panel for restricted actions", () => {
    renderWithProviders(
      <RestrictedMachineActionMenu
        hasSelection
        setSidePanelContent={mocks.setSidePanelContent}
      />
    );

    const onActionClick =
      mocks.RestrictedMachineActionMenuGroup.mock.calls[0][0].onActionClick;
    onActionClick(NodeActions.DEPLOY);

    expect(mocks.setSidePanelContent).toHaveBeenCalledWith({
      view: expect.arrayContaining([expect.any(String), NodeActions.DEPLOY]),
    });
  });
});
