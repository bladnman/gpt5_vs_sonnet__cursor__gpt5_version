import {render, screen} from "@testing-library/react";
import HeaderBlock from "../features/HeaderBlock";

vi.mock("next/image", () => ({
  __esModule: true,
  default: (props: any) => {
    // eslint-disable-next-line jsx-a11y/alt-text, @next/next/no-img-element
    return <img {...props} />;
  },
}));

const richBase = {
  id: "MOVIE_1",
  tmdbId: 1,
  mediaType: "movie" as const,
  title: "Title",
  posterPath: null,
  releaseDate: "2024",
  tmdbRating: 8.2,
  tmdbVoteCount: 1200,
  overview: "Story",
  tagline: "Tag",
  backdropPath: null,
  genres: [{id: 1, name: "Drama"}],
  runtimeMinutes: 100,
  episodeRunTimeMinutes: null,
  numberOfSeasons: null,
  numberOfEpisodes: null,
  seasons: [],
  cast: [],
  crew: [],
  providers: undefined,
};

describe("HeaderBlock", () => {
  it("renders core fields for movie", () => {
    render(
      <HeaderBlock
        rich={richBase}
        mediaType="movie"
        rating={{rating: 7}}
        interest={{level: "HIGH"}}
      />
    );
    expect(screen.getByRole("heading", {name: "Title"})).toBeInTheDocument();
    expect(screen.getByText("Tag")).toBeInTheDocument();
    expect(screen.getByText("2024")).toBeInTheDocument();
    expect(screen.getByText("100 min")).toBeInTheDocument();
    expect(screen.getByText(/TMDB votes: 1200/)).toBeInTheDocument();
    expect(screen.getByText(/Your rating: 7/)).toBeInTheDocument();
    expect(screen.getByText(/On list: Yes/)).toBeInTheDocument();
    expect(screen.getByText(/Interest: HIGH/)).toBeInTheDocument();
  });

  it("renders tv specific fields", () => {
    const richTv = {
      ...richBase,
      mediaType: "tv" as const,
      runtimeMinutes: null,
      numberOfSeasons: 2,
      numberOfEpisodes: 16,
    };
    render(
      <HeaderBlock rich={richTv} mediaType="tv" rating={null} interest={null} />
    );
    expect(screen.getByText(/2 seasons · 16 episodes/)).toBeInTheDocument();
    expect(screen.getByText(/On list: No/)).toBeInTheDocument();
  });
});
