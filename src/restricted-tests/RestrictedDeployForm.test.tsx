import configureStore from "redux-mock-store";

import RestrictedDeployForm from "@/app/machines/components/MachineForms/MachineActionFormWrapper/DeployForm/RestrictedDeployForm";
import { ConfigNames } from "@/app/store/config/types";
import { machineActions } from "@/app/store/machine";
import type { RootState } from "@/app/store/root/types";
import * as factory from "@/testing/factories";
import { authResolvers } from "@/testing/resolvers/auth";
import {
  renderWithBrowserRouter,
  screen,
  setupMockServer,
  userEvent,
} from "@/testing/utils";

const mockStore = configureStore<RootState>();

setupMockServer(authResolvers.getCurrentUser.handler());

describe("RestrictedDeployForm", () => {
  let state: RootState;

  beforeEach(() => {
    state = factory.rootState({
      config: factory.configState({
        loaded: true,
        items: [
          factory.config({
            name: ConfigNames.DEFAULT_OSYSTEM,
            value: "ubuntu",
            choices: [
              ["centos", "CentOS"],
              ["ubuntu", "Ubuntu"],
            ],
          }),
          factory.config({
            name: ConfigNames.ENABLE_ANALYTICS,
            value: true,
          }),
          factory.config({
            name: ConfigNames.ENABLE_KERNEL_CRASH_DUMP,
            value: false,
          }),
        ],
      }),
      general: factory.generalState({
        defaultMinHweKernel: factory.defaultMinHweKernelState({
          data: "ga-18.04",
          loaded: true,
        }),
        osInfo: factory.osInfoState({
          data: factory.osInfo({
            default_osystem: "ubuntu",
            default_release: "bionic",
            osystems: [
              ["centos", "CentOS"],
              ["ubuntu", "Ubuntu"],
            ],
            releases: [
              ["centos/centos70", "CentOS 7"],
              ["ubuntu/bionic", 'Ubuntu 18.04 LTS "Bionic Beaver"'],
              ["ubuntu/focal", 'Ubuntu 20.04 LTS "Focal Fossa"'],
            ],
            kernels: {
              ubuntu: {
                bionic: [
                  ["ga-18.04", "bionic (ga-18.04)"],
                  ["hwe-18.04", "bionic (hwe-18.04)"],
                ],
                focal: [["ga-20.04", "focal (ga-20.04)"]],
              },
            },
          }),
          loaded: true,
        }),
      }),
      machine: factory.machineState({
        items: [
          factory.machine({ system_id: "abc123" }),
          factory.machine({ system_id: "def456" }),
        ],
        statuses: {
          abc123: factory.machineStatus(),
          def456: factory.machineStatus(),
        },
      }),
    });
  });

  it("shows a spinner until deploy data has loaded", () => {
    state.config.loaded = false;

    renderWithBrowserRouter(
      <RestrictedDeployForm
        clearSidePanelContent={vi.fn()}
        machines={[]}
        processingCount={0}
        viewingDetails={false}
      />,
      { route: "/machines", state }
    );

    expect(screen.getByTestId("loading-deploy-data")).toBeInTheDocument();
    expect(screen.queryByRole("form")).not.toBeInTheDocument();
  });

  it("dispatches restricted deploy payloads without KVM host fields", async () => {
    const store = mockStore(state);

    renderWithBrowserRouter(
      <RestrictedDeployForm
        clearSidePanelContent={vi.fn()}
        machines={[state.machine.items[0]]}
        processingCount={0}
        viewingDetails={false}
      />,
      { route: "/machines", store }
    );

    expect(
      screen.queryByRole("checkbox", { name: /Register as MAAS KVM host/i })
    ).not.toBeInTheDocument();

    await userEvent.click(
      screen.getByRole("radio", { name: "Deploy in memory" })
    );
    await userEvent.click(
      screen.getByRole("checkbox", { name: /Cloud-init user-data/i })
    );
    await userEvent.type(
      screen.getByRole("textbox", { name: "Upload script" }),
      "test script"
    );
    await userEvent.click(
      screen.getByRole("checkbox", { name: /Periodically sync hardware/i })
    );
    await userEvent.click(
      screen.getByRole("checkbox", {
        name: /Try to enable kernel crash dump/i,
      })
    );
    await userEvent.click(
      screen.getByRole("button", { name: "Deploy machine" })
    );

    expect(
      store.getActions().filter((action) => action.type === "machine/deploy")
    ).toStrictEqual([
      machineActions.deploy({
        distro_series: "bionic",
        enable_hw_sync: true,
        enable_kernel_crash_dump: true,
        ephemeral_deploy: true,
        hwe_kernel: "ga-18.04",
        osystem: "ubuntu",
        system_id: "abc123",
        user_data: "test script",
      }),
    ]);
    const deployAction = store
      .getActions()
      .find((action) => action.type === "machine/deploy");
    expect(deployAction.payload.params.extra.install_kvm).toBeUndefined();
    expect(deployAction.payload.params.extra.register_vmhost).toBeUndefined();
  });
});
