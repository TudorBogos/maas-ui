import RestrictedReleaseForm from "@/app/machines/components/MachineForms/MachineActionFormWrapper/ReleaseForm/RestrictedReleaseForm";
import { ConfigNames } from "@/app/store/config/types";
import type { RootState } from "@/app/store/root/types";
import * as factory from "@/testing/factories";
import { renderWithBrowserRouter, screen } from "@/testing/utils";

describe("RestrictedReleaseFormFields", () => {
  let state: RootState;

  beforeEach(() => {
    state = factory.rootState({
      config: factory.configState({
        loaded: true,
        items: [
          factory.config({
            name: ConfigNames.ENABLE_DISK_ERASING_ON_RELEASE,
            value: true,
          }),
        ],
      }),
    });
  });

  it("uses one erase checkbox and omits quick and secure erase controls", () => {
    renderWithBrowserRouter(
      <RestrictedReleaseForm
        clearSidePanelContent={vi.fn()}
        machines={[]}
        processingCount={0}
        viewingDetails={false}
      />,
      { route: "/machines", state }
    );

    expect(
      screen.getByRole("checkbox", { name: "Erase disks before releasing" })
    ).toBeChecked();
    expect(
      screen.queryByRole("checkbox", { name: "Use quick erase (not secure)" })
    ).not.toBeInTheDocument();
    expect(
      screen.queryByRole("checkbox", { name: "Use secure erase" })
    ).not.toBeInTheDocument();
  });
});
