import {render, screen} from "@testing-library/react";
import ProvidersSection from "../../providers/ProvidersSection";

vi.mock("../../providers/ProviderBadge", () => ({
  __esModule: true,
  default: ({name}: {name: string}) => <div data-testid="badge">{name}</div>,
}));

describe("ProvidersSection", () => {
  it("renders categories when provided", () => {
    render(
      <ProvidersSection
        providers={{
          flatrate: [{id: 1, name: "Netflix"}],
          buy: [{id: 2, name: "iTunes"}],
          rent: [{id: 3, name: "Prime"}],
        }}
      />
    );
    expect(screen.getByText("Where to watch")).toBeInTheDocument();
    expect(screen.getAllByTestId("badge")).toHaveLength(3);
    expect(screen.getByText("Netflix")).toBeInTheDocument();
    expect(screen.getByText("iTunes")).toBeInTheDocument();
    expect(screen.getByText("Prime")).toBeInTheDocument();
  });

  it("returns null for empty", () => {
    const {container} = render(<ProvidersSection providers={undefined} />);
    expect(container.firstChild).toBeNull();
  });
});
