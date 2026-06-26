import { Provider } from "react-redux";
import configureStore from "redux-mock-store";

import RestrictedReleaseForm from "@/app/machines/components/MachineForms/MachineActionFormWrapper/ReleaseForm/RestrictedReleaseForm";
import { ConfigNames } from "@/app/store/config/types";
import type { RootState } from "@/app/store/root/types";
import { NodeActions } from "@/app/store/types/node";
import * as factory from "@/testing/factories";
import { renderWithBrowserRouter, screen, userEvent } from "@/testing/utils";

const mockStore = configureStore<RootState>();

describe("RestrictedReleaseForm", () => {
  let state: RootState;

  beforeEach(() => {
    state = factory.rootState({
      config: factory.configState({
        loaded: true,
        items: [
          factory.config({
            name: ConfigNames.ENABLE_DISK_ERASING_ON_RELEASE,
            value: false,
          }),
        ],
      }),
      machine: factory.machineState({
        items: [
          factory.machine({ system_id: "abc123" }),
          factory.machine({ system_id: "def456" }),
        ],
        statuses: {
          abc123: factory.machineStatus({ releasing: false }),
          def456: factory.machineStatus({ releasing: false }),
        },
      }),
    });
  });

  it("shows only the restricted erase option", () => {
    renderWithBrowserRouter(
      <RestrictedReleaseForm
        clearSidePanelContent={vi.fn()}
        machines={state.machine.items}
        processingCount={0}
        viewingDetails={false}
      />,
      { route: "/machines", state }
    );

    expect(
      screen.getByRole("checkbox", { name: "Erase disks before releasing" })
    ).toBeInTheDocument();
    expect(
      screen.queryByRole("checkbox", { name: "Use secure erase" })
    ).not.toBeInTheDocument();
    expect(
      screen.queryByRole("checkbox", { name: "Use quick erase (not secure)" })
    ).not.toBeInTheDocument();
  });

  it("ties erase and quick erase together and disables secure erase", async () => {
    const store = mockStore(state);

    renderWithBrowserRouter(
      <Provider store={store}>
        <RestrictedReleaseForm
          clearSidePanelContent={vi.fn()}
          machines={state.machine.items}
          processingCount={0}
          viewingDetails={false}
        />
      </Provider>,
      { route: "/machines", store }
    );

    await userEvent.click(
      screen.getByRole("checkbox", { name: "Erase disks before releasing" })
    );
    await userEvent.click(
      screen.getByRole("button", { name: "Release 2 machines" })
    );

    expect(
      store.getActions().filter((action) => action.type === "machine/release")
    ).toStrictEqual([
      {
        type: "machine/release",
        meta: {
          model: "machine",
          method: "action",
        },
        payload: {
          params: {
            action: NodeActions.RELEASE,
            extra: {
              erase: true,
              quick_erase: true,
              secure_erase: false,
            },
            system_id: "abc123",
          },
        },
      },
      {
        type: "machine/release",
        meta: {
          model: "machine",
          method: "action",
        },
        payload: {
          params: {
            action: NodeActions.RELEASE,
            extra: {
              erase: true,
              quick_erase: true,
              secure_erase: false,
            },
            system_id: "def456",
          },
        },
      },
    ]);
  });
});
