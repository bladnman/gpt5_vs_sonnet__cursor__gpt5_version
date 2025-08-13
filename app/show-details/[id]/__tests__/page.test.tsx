import {render, screen} from "@testing-library/react";

// Mock server-only deps used by the page BEFORE importing SUT
vi.mock("next/navigation", () => ({
  notFound: vi.fn(() => null),
}));

vi.mock("../hooks/use_show_details_data", () => ({
  __esModule: true,
  default: vi.fn(),
}));

vi.mock("../features/HeroImage", () => ({
  __esModule: true,
  default: ({backdropPath}: {backdropPath?: string | null}) => (
    <div data-testid="hero" data-path={backdropPath ?? ""} />
  ),
}));

vi.mock("../features/HeaderBlock", () => ({
  __esModule: true,
  default: ({rich}: any) => (
    <div data-testid="header" data-title={rich?.title} />
  ),
}));

vi.mock("../features/controls/Controls", () => ({
  __esModule: true,
  default: () => <div data-testid="controls" />,
}));

vi.mock("../features/providers/ProvidersSection", () => ({
  __esModule: true,
  default: () => <div data-testid="providers" />,
}));

vi.mock("../features/cast/CastSection", () => ({
  __esModule: true,
  default: () => <div data-testid="cast" />,
}));

vi.mock("../features/seasons/SeasonsSection", () => ({
  __esModule: true,
  default: () => <div data-testid="seasons" />,
}));

vi.mock("../features/RelatedGrid", () => ({
  __esModule: true,
  default: ({title}: {title: string}) => (
    <div data-testid={`related-${title.toLowerCase()}`} />
  ),
}));

let Page: any;
let useData: any;
let mockedUseData: any;
describe("ShowDetailsPage", () => {
  beforeAll(async () => {
    Page = (await import("../page")).default;
    useData = (await import("../hooks/use_show_details_data")).default;
  });
  beforeEach(() => {
    mockedUseData = vi.mocked(useData);
    mockedUseData.mockReset?.();
  });
  const {notFound} = require("next/navigation");

  const baseData = {
    mediaType: "movie" as const,
    tmdbId: 123,
    rich: {
      id: "MOVIE_123",
      tmdbId: 123,
      mediaType: "movie" as const,
      title: "Example Movie",
      posterPath: null,
      releaseDate: "2024-01-01",
      tmdbRating: 7.5,
      tmdbVoteCount: 1000,
      overview: "Overview",
      tagline: "Tagline",
      backdropPath: "/hero.jpg",
      genres: [{id: 1, name: "Drama"}],
      runtimeMinutes: 120,
      episodeRunTimeMinutes: null,
      numberOfSeasons: null,
      numberOfEpisodes: null,
      seasons: [],
      cast: [],
      crew: [],
      providers: undefined,
    },
    rating: {rating: 8},
    interest: {level: "MEDIUM" as const},
    recs: [],
    similar: [],
    relatedStates: {},
  };

  it("renders sections for movie", async () => {
    mockedUseData.mockResolvedValueOnce(baseData as any);
    const ui = await Page({params: Promise.resolve({id: "MOVIE_123"})});
    render(ui as any);
    expect(screen.getByTestId("hero")).toBeInTheDocument();
    expect(screen.getByTestId("header")).toHaveAttribute(
      "data-title",
      "Example Movie"
    );
    expect(screen.getByTestId("controls")).toBeInTheDocument();
    expect(screen.getByTestId("providers")).toBeInTheDocument();
    expect(screen.getByTestId("cast")).toBeInTheDocument();
    // Seasons should not render for movie
    expect(screen.queryByTestId("seasons")).toBeNull();
  });

  it("renders seasons for tv", async () => {
    mockedUseData.mockResolvedValueOnce({
      ...baseData,
      mediaType: "tv" as const,
      rich: {
        ...baseData.rich,
        mediaType: "tv" as const,
        numberOfSeasons: 3,
        numberOfEpisodes: 30,
        seasons: [
          {
            id: 1,
            name: "S1",
            seasonNumber: 1,
            episodeCount: 10,
            posterPath: null,
          },
        ],
      },
    });
    const ui = await Page({params: Promise.resolve({id: "TV_123"})});
    render(ui as any);
    expect(screen.getByTestId("seasons")).toBeInTheDocument();
  });

  it("calls notFound on error", async () => {
    mockedUseData.mockRejectedValueOnce(new Error("boom"));
    const res = await Page({params: Promise.resolve({id: "MOVIE_999"})});
    // notFound returns a special symbol in Next; our mock returns null, so res should be null
    expect(res).toBeNull();
  });
});
