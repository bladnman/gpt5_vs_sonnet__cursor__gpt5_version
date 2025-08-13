import {render, screen} from "@testing-library/react";
import CastSection from "../../cast/CastSection";

vi.mock("next/image", () => ({
  __esModule: true,
  default: (props: any) => {
    // eslint-disable-next-line jsx-a11y/alt-text, @next/next/no-img-element
    return <img {...props} />;
  },
}));

describe("CastSection", () => {
  it("renders cast items", () => {
    render(
      <CastSection
        cast={[
          {id: 1, name: "A", character: "X", profilePath: null},
          {id: 2, name: "B"},
        ]}
      />
    );
    expect(screen.getByText("Cast")).toBeInTheDocument();
    expect(screen.getByText("A")).toBeInTheDocument();
    expect(screen.getByText("B")).toBeInTheDocument();
    expect(screen.getByText("as X")).toBeInTheDocument();
  });

  it("returns null for empty", () => {
    const {container} = render(<CastSection cast={[]} />);
    expect(container.firstChild).toBeNull();
  });
});
