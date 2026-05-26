const mocks = vi.hoisted(() => ({
  EditUser: vi.fn(({ id }: { id: number }) => <div>Edit user {id}</div>),
  useGetCurrentUser: vi.fn(),
}));

vi.mock("@/app/api/query/auth", () => ({
  useGetCurrentUser: mocks.useGetCurrentUser,
}));

vi.mock("@/app/settings/views/Users/components", () => ({
  EditUser: mocks.EditUser,
}));

import { Details, Label as DetailsLabels } from "./Details";

import type { RootState } from "@/app/store/root/types";
import * as factory from "@/testing/factories";
import { renderWithProviders, screen } from "@/testing/utils";

describe("Details", () => {
  let state: RootState;

  beforeEach(() => {
    vi.clearAllMocks();

    mocks.useGetCurrentUser.mockReturnValue({
      data: factory.user({ id: 1, is_superuser: true }),
      isPending: false,
      isSuccess: true,
    });

    state = factory.rootState({
      status: factory.statusState({
        externalAuthURL: null,
      }),
    });
  });

  it("can render", () => {
    renderWithProviders(<Details />, { state });
    expect(screen.getByLabelText(DetailsLabels.Title));
  });

  it("renders the edit form for superusers", () => {
    renderWithProviders(<Details />, { state });

    expect(screen.getByText("Edit user 1")).toBeInTheDocument();
    expect(mocks.EditUser).toHaveBeenCalledWith(
      { id: 1, isSelfEditing: true },
      undefined
    );
  });

  it("shows read-only username and email for non-superusers", () => {
    mocks.useGetCurrentUser.mockReturnValue({
      data: factory.user({
        email: "user@example.com",
        is_superuser: false,
        username: "regular-user",
      }),
      isPending: false,
      isSuccess: true,
    });

    renderWithProviders(<Details />, { state });

    expect(screen.getByText(DetailsLabels.Username)).toBeInTheDocument();
    expect(screen.getByText("regular-user")).toBeInTheDocument();
    expect(screen.getByText(DetailsLabels.Email)).toBeInTheDocument();
    expect(screen.getByText("user@example.com")).toBeInTheDocument();
    expect(screen.queryByText("Edit user 1")).not.toBeInTheDocument();
    expect(mocks.EditUser).not.toHaveBeenCalled();
  });

  it("shows a placeholder when non-superusers do not have an email", () => {
    mocks.useGetCurrentUser.mockReturnValue({
      data: factory.user({
        email: undefined,
        is_superuser: false,
        username: "regular-user",
      }),
      isPending: false,
      isSuccess: true,
    });

    renderWithProviders(<Details />, { state });

    expect(screen.getByText(DetailsLabels.NoEmail)).toBeInTheDocument();
  });

  it("shows a message when using external auth", () => {
    state.status.externalAuthURL = "http://login.example.com";
    renderWithProviders(<Details />, { state });
    expect(
      screen.getByText(
        "Users for this MAAS are managed using an external service"
      )
    );
  });
});
