import {render, screen} from "@testing-library/react";
import RelatedGrid from "../../features/RelatedGrid";

vi.mock("@/app/features/shows/PosterCard", () => ({
  __esModule: true,
  default: ({show}: any) => <div data-testid="poster" data-id={show?.id} />,
}));

describe("RelatedGrid", () => {
  it("returns null when empty", () => {
    const {container} = render(
      <RelatedGrid title="Recommended" items={[]} stateMap={{}} />
    );
    expect(container.firstChild).toBeNull();
  });

  it("renders grid and caps to 14 items", () => {
    const items = Array.from({length: 20}).map((_, i) => ({
      id: `MOVIE_${i + 1}`,
      tmdbId: i + 1,
      mediaType: "movie" as const,
      title: `T${i + 1}`,
      posterPath: null,
      releaseDate: null,
      tmdbRating: null,
      tmdbVoteCount: null,
    }));
    const state: Record<string, any> = {};
    for (const it of items) state[it.id] = {};
    render(<RelatedGrid title="Recommended" items={items} stateMap={state} />);
    expect(screen.getByText("Recommended")).toBeInTheDocument();
    expect(screen.getAllByTestId("poster")).toHaveLength(14);
  });
});
