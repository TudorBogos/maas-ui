import RestrictedDeployForm from "@/app/machines/components/MachineForms/MachineActionFormWrapper/DeployForm/RestrictedDeployForm";
import { ConfigNames } from "@/app/store/config/types";
import type { RootState } from "@/app/store/root/types";
import * as factory from "@/testing/factories";
import { authResolvers } from "@/testing/resolvers/auth";
import {
  renderWithBrowserRouter,
  screen,
  setupMockServer,
} from "@/testing/utils";

setupMockServer(authResolvers.getCurrentUser.handler());

describe("RestrictedDeployFormFields", () => {
  let state: RootState;

  beforeEach(() => {
    state = factory.rootState({
      config: factory.configState({
        loaded: true,
        items: [
          factory.config({
            name: ConfigNames.DEFAULT_OSYSTEM,
            value: "ubuntu",
            choices: [["ubuntu", "Ubuntu"]],
          }),
          factory.config({
            name: ConfigNames.ENABLE_KERNEL_CRASH_DUMP,
            value: false,
          }),
        ],
      }),
      general: factory.generalState({
        defaultMinHweKernel: factory.defaultMinHweKernelState({
          data: "",
          loaded: true,
        }),
        osInfo: factory.osInfoState({
          data: factory.osInfo({
            default_osystem: "ubuntu",
            default_release: "bionic",
            osystems: [["ubuntu", "Ubuntu"]],
            releases: [["ubuntu/bionic", 'Ubuntu 18.04 LTS "Bionic Beaver"']],
            kernels: {
              ubuntu: {
                bionic: [["ga-18.04", "bionic (ga-18.04)"]],
              },
            },
          }),
          loaded: true,
        }),
      }),
    });
  });

  it("does not render KVM host deployment controls", () => {
    renderWithBrowserRouter(
      <RestrictedDeployForm
        clearSidePanelContent={vi.fn()}
        machines={[]}
        processingCount={0}
        viewingDetails={false}
      />,
      { route: "/machines", state }
    );

    expect(
      screen.queryByRole("checkbox", { name: /Register as MAAS KVM host/i })
    ).not.toBeInTheDocument();
    expect(
      screen.queryByRole("radio", { name: /LXD/i })
    ).not.toBeInTheDocument();
    expect(
      screen.queryByRole("radio", { name: /libvirt/i })
    ).not.toBeInTheDocument();
  });
});
