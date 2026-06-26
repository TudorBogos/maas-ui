import configureStore from "redux-mock-store";

import RestrictedMachineCheckbox from "@/app/machines/views/MachineList/MachineListTable/MachineCheckbox/RestrictedMachineCheckbox";
import { machineActions } from "@/app/store/machine";
import type { RootState } from "@/app/store/root/types";
import * as factory from "@/testing/factories";
import { renderWithMockStore, screen, userEvent } from "@/testing/utils";

const mockStore = configureStore<RootState>();

describe("RestrictedMachineCheckbox", () => {
  let state: RootState;

  beforeEach(() => {
    state = factory.rootState({
      machine: factory.machineState({
        selected: null,
      }),
    });
  });

  it("is checked when the machine is the selected item", () => {
    state.machine.selected = { items: ["abc123"] };

    renderWithMockStore(
      <RestrictedMachineCheckbox label="koala" systemId="abc123" />,
      { state }
    );

    expect(screen.getByRole("checkbox", { name: "koala" })).toBeChecked();
  });

  it("ignores selected filters and groups", () => {
    state.machine.selected = {
      filter: { owner: "admin" },
      groups: ["deployed"],
    };

    renderWithMockStore(
      <RestrictedMachineCheckbox label="koala" systemId="abc123" />,
      { state }
    );

    expect(screen.getByRole("checkbox", { name: "koala" })).not.toBeChecked();
    expect(screen.getByRole("checkbox", { name: "koala" })).toBeEnabled();
  });

  it("selects only the clicked machine", async () => {
    const store = mockStore(state);

    renderWithMockStore(
      <RestrictedMachineCheckbox label="koala" systemId="abc123" />,
      { store }
    );

    await userEvent.click(screen.getByRole("checkbox", { name: "koala" }));

    expect(
      store.getActions().find((action) => action.type === "machine/setSelected")
    ).toStrictEqual(machineActions.setSelected({ items: ["abc123"] }));
  });

  it("clears the selection when unchecked", async () => {
    state.machine.selected = { items: ["abc123"] };
    const store = mockStore(state);

    renderWithMockStore(
      <RestrictedMachineCheckbox label="koala" systemId="abc123" />,
      { store }
    );

    await userEvent.click(screen.getByRole("checkbox", { name: "koala" }));

    expect(
      store.getActions().find((action) => action.type === "machine/setSelected")
    ).toStrictEqual(machineActions.setSelected(null));
  });
});
