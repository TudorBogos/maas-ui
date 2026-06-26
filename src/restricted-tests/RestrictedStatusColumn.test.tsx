import { RestrictedStatusColumn } from "@/app/machines/views/MachineList/MachineListTable/StatusColumn/RestrictedStatusColumn";
import type { Machine } from "@/app/store/machine/types";
import type { RootState } from "@/app/store/root/types";
import {
  NodeActions,
  NodeStatus,
  NodeStatusCode,
} from "@/app/store/types/node";
import * as factory from "@/testing/factories";
import {
  renderWithBrowserRouter,
  screen,
  userEvent,
  within,
} from "@/testing/utils";

describe("RestrictedStatusColumn", () => {
  let machine: Machine;
  let state: RootState;

  beforeEach(() => {
    machine = factory.machine({
      actions: [
        NodeActions.ABORT,
        NodeActions.ACQUIRE,
        NodeActions.CLONE,
        NodeActions.COMMISSION,
        NodeActions.DELETE,
        NodeActions.DEPLOY,
        NodeActions.LOCK,
        NodeActions.MARK_BROKEN,
        NodeActions.RELEASE,
        NodeActions.SET_POOL,
        NodeActions.SET_ZONE,
        NodeActions.TAG,
        NodeActions.TEST,
        NodeActions.UNLOCK,
      ],
      distro_series: "bionic",
      osystem: "ubuntu",
      status: NodeStatus.DEPLOYED,
      status_code: NodeStatusCode.DEPLOYED,
      system_id: "abc123",
    });
    state = factory.rootState({
      general: factory.generalState({
        osInfo: factory.osInfoState({
          data: factory.osInfo({
            osystems: [["ubuntu", "Ubuntu"]],
            releases: [["ubuntu/bionic", 'Ubuntu 18.04 LTS "Bionic Beaver"']],
          }),
          loaded: true,
        }),
      }),
      machine: factory.machineState({
        items: [machine],
      }),
    });
  });

  it("shows only restricted row actions and logs", async () => {
    renderWithBrowserRouter(
      <RestrictedStatusColumn onToggleMenu={vi.fn()} systemId="abc123" />,
      { route: "/machines", state }
    );

    await userEvent.click(screen.getByRole("button", { name: /take action/i }));

    const submenu = screen.getByLabelText("submenu");
    [
      NodeActions.DEPLOY,
      NodeActions.RELEASE,
      NodeActions.LOCK,
      NodeActions.UNLOCK,
    ].forEach((action) => {
      expect(
        within(submenu).getByRole("button", { name: action })
      ).toBeInTheDocument();
    });
    expect(
      within(submenu).getByRole("link", { name: "See logs" })
    ).toHaveAttribute("href", "/machine/abc123/logs");
    [
      NodeActions.ABORT,
      NodeActions.ACQUIRE,
      NodeActions.CLONE,
      NodeActions.COMMISSION,
      NodeActions.DELETE,
      NodeActions.SET_POOL,
      NodeActions.SET_ZONE,
      NodeActions.TAG,
      NodeActions.TEST,
    ].forEach((action) => {
      expect(
        within(submenu).queryByRole("button", { name: action })
      ).not.toBeInTheDocument();
    });
  });

  it("does not render an action menu without a toggle handler", () => {
    renderWithBrowserRouter(<RestrictedStatusColumn systemId="abc123" />, {
      route: "/machines",
      state,
    });

    expect(
      screen.queryByRole("button", { name: /take action/i })
    ).not.toBeInTheDocument();
  });
});
