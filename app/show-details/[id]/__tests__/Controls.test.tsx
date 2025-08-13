import {render, screen} from "@testing-library/react";
import Controls from "../features/controls/Controls";

vi.mock("@/app/actions/shows", () => ({
  addToWatchlist: vi.fn(async () => {}),
  removeFromWatchlist: vi.fn(async () => {}),
  markWatched: vi.fn(async () => {}),
  clearWatched: vi.fn(async () => {}),
  rateShow: vi.fn(async () => {}),
  clearRating: vi.fn(async () => {}),
  setInterest: vi.fn(async () => {}),
  setWaiting: vi.fn(async () => {}),
}));

vi.mock("../RatingControl", () => ({
  __esModule: true,
  default: () => <div data-testid="rating-control" />,
}));

vi.mock("../WatchActions", () => ({
  __esModule: true,
  default: ({inWatchlist}: {inWatchlist: boolean}) => (
    <div data-testid="watch-actions" data-in={String(inWatchlist)} />
  ),
}));

const rich = {
  id: "MOVIE_1",
  tmdbId: 1,
  mediaType: "movie" as const,
  title: "Title",
  posterPath: null,
  releaseDate: "2024",
  tmdbRating: 8.2,
  tmdbVoteCount: 1200,
};

describe("Controls", () => {
  it("wires child components with state", () => {
    render(
      <Controls
        rich={rich as any}
        interest={{level: "LOW"}}
        rating={{rating: 5}}
      />
    );
    expect(screen.getByTestId("watch-actions")).toHaveAttribute(
      "data-in",
      "true"
    );
    expect(screen.getByTestId("rating-control")).toBeInTheDocument();
  });
});
