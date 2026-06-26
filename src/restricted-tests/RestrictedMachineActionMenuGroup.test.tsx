import RestrictedMachineActionMenuGroup from "@/app/machines/views/MachineList/MachineListControls/MachineActionMenu/RestrictedMachineActionMenuGroup";
import { NodeActions } from "@/app/store/types/node";
import { getNodeActionTitle } from "@/app/store/utils";
import {
  renderWithProviders,
  screen,
  userEvent,
  within,
} from "@/testing/utils";

describe("RestrictedMachineActionMenuGroup", () => {
  const allowedActions = [
    NodeActions.DEPLOY,
    NodeActions.RELEASE,
    NodeActions.ON,
    NodeActions.OFF,
    NodeActions.POWER_CYCLE,
    NodeActions.SOFT_OFF,
    NodeActions.LOCK,
    NodeActions.UNLOCK,
  ];
  const excludedActions = [
    NodeActions.ABORT,
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

  beforeEach(() => {
    vi.stubEnv("VITE_APP_DPU_PROVISIONING", "true");
  });

  afterEach(() => {
    vi.unstubAllEnvs();
  });

  it("exposes only the restricted machine actions", async () => {
    renderWithProviders(
      <RestrictedMachineActionMenuGroup hasSelection onActionClick={vi.fn()} />
    );

    const expectedActionsByMenu = {
      Actions: [NodeActions.DEPLOY, NodeActions.RELEASE],
      Power: [
        NodeActions.ON,
        NodeActions.OFF,
        NodeActions.POWER_CYCLE,
        NodeActions.SOFT_OFF,
      ],
      Lock: [NodeActions.LOCK, NodeActions.UNLOCK],
    };

    for (const [menuName, menuActions] of Object.entries(
      expectedActionsByMenu
    )) {
      await userEvent.click(screen.getByRole("button", { name: menuName }));
      menuActions.forEach((action) => {
        expect(screen.getByTestId(`action-link-${action}`)).toHaveTextContent(
          getNodeActionTitle(action)
        );
      });
      await userEvent.click(screen.getByRole("button", { name: menuName }));
    }

    expect(allowedActions).toEqual(Object.values(expectedActionsByMenu).flat());
    excludedActions.forEach((action) => {
      expect(
        screen.queryByTestId(`action-link-${action}`)
      ).not.toBeInTheDocument();
    });
  });

  it("opens the selected restricted action", async () => {
    const onActionClick = vi.fn();
    renderWithProviders(
      <RestrictedMachineActionMenuGroup
        hasSelection
        onActionClick={onActionClick}
      />
    );

    await userEvent.click(screen.getByRole("button", { name: "Actions" }));
    await userEvent.click(
      within(screen.getByLabelText("Actions submenu")).getByRole("button", {
        name: /Deploy/i,
      })
    );

    expect(onActionClick).toHaveBeenCalledWith(NodeActions.DEPLOY);
  });
});
