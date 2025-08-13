import {render, screen} from "@testing-library/react";
import SeasonsSection from "../../seasons/SeasonsSection";

vi.mock("next/image", () => ({
  __esModule: true,
  default: (props: any) => {
    // eslint-disable-next-line jsx-a11y/alt-text, @next/next/no-img-element
    return <img {...props} />;
  },
}));

describe("SeasonsSection", () => {
  it("renders seasons list", () => {
    render(
      <SeasonsSection
        seasons={[
          {
            id: 1,
            name: "S1",
            seasonNumber: 1,
            episodeCount: 10,
            posterPath: null,
          },
        ]}
      />
    );
    expect(screen.getByText("Seasons")).toBeInTheDocument();
    expect(screen.getByText("S1")).toBeInTheDocument();
    expect(screen.getByText("S1")).toBeInTheDocument();
    expect(screen.getByText("S1")).toBeInTheDocument();
  });

  it("returns null for empty", () => {
    const {container} = render(<SeasonsSection seasons={[]} />);
    expect(container.firstChild).toBeNull();
  });
});
