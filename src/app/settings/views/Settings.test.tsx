import { waitFor } from "@testing-library/react";
import configureStore from "redux-mock-store";

import Settings from "./Settings";

import SuperUserOnly, {
  Label as SuperUserOnlyLabel,
} from "@/app/base/components/SuperUserOnly";
import type { RootState } from "@/app/store/root/types";
import * as factory from "@/testing/factories";
import { authResolvers } from "@/testing/resolvers/auth";
import { screen, renderWithProviders, setupMockServer } from "@/testing/utils";

vi.mock("@/app/settings/components/Routes", () => ({
  default: () => <div>Settings routes</div>,
}));

const mockStore = configureStore<RootState>();
const mockServer = setupMockServer(authResolvers.getCurrentUser.handler());

describe("Settings", () => {
  it("dispatches action to fetch config on load", () => {
    const state = factory.rootState();
    const store = mockStore(state);
    renderWithProviders(<Settings />, { store });

    const fetchConfigAction = store
      .getActions()
      .find((action) => action.type === "config/fetch");

    expect(fetchConfigAction).toEqual({
      type: "config/fetch",
      meta: {
        model: "config",
        method: "list",
      },
      payload: null,
    });
  });

  it("displays a message if not an admin when guarded", async () => {
    mockServer.use(
      authResolvers.getCurrentUser.handler(
        factory.user({ is_superuser: false })
      )
    );
    renderWithProviders(
      <SuperUserOnly>
        <Settings />
      </SuperUserOnly>
    );
    await waitFor(() => {
      expect(
        screen.getByRole("heading", {
          name: SuperUserOnlyLabel.Permissions,
        })
      ).toBeInTheDocument();
    });
  });
});
