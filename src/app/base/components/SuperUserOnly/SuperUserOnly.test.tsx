import SuperUserOnly, { Label } from "./SuperUserOnly";

import { renderWithProviders, screen } from "@/testing/utils";

const mocks = vi.hoisted(() => ({
  useGetIsSuperUser: vi.fn(),
}));

vi.mock("@/app/api/query/auth", () => ({
  useGetIsSuperUser: mocks.useGetIsSuperUser,
}));

describe("SuperUserOnly", () => {
  beforeEach(() => {
    mocks.useGetIsSuperUser.mockReset();
  });

  it("renders children for superusers", () => {
    mocks.useGetIsSuperUser.mockReturnValue({ data: true });

    renderWithProviders(
      <SuperUserOnly>
        <div>Protected content</div>
      </SuperUserOnly>
    );

    expect(screen.getByText("Protected content")).toBeInTheDocument();
  });

  it("renders a permission message for non-superusers", () => {
    mocks.useGetIsSuperUser.mockReturnValue({ data: false });

    renderWithProviders(
      <SuperUserOnly>
        <div>Protected content</div>
      </SuperUserOnly>
    );

    expect(screen.getByText(Label.Permissions)).toBeInTheDocument();
    expect(screen.queryByText("Protected content")).not.toBeInTheDocument();
  });
});
