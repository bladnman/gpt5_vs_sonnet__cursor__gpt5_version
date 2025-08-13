import {describe, expect, it, vi} from "vitest";
import use_show_details_data from "../../hooks/use_show_details_data";

const showStore: Record<string, any> = {};
vi.mock("@/lib/db", () => ({
  prisma: {
    show: {
      findUnique: vi.fn(async ({where}: any) => showStore[where.id] ?? null),
    },
    rating: {
      findUnique: vi.fn(async () => null),
    },
    interest: {
      findUnique: vi.fn(async () => null),
    },
  },
}));

vi.mock("@/lib/session", () => ({
  getUserId: vi.fn(async () => "user-1"),
}));

vi.mock("@/lib/shows", () => ({
  ensureShowExists: vi.fn(async (minimal: any) => {
    showStore[minimal.id] = minimal;
  }),
  getUserShowStates: vi.fn(async () => ({})),
}));

vi.mock("@/lib/tmdb/client", () => ({
  getDetails: vi.fn(async () => ({
    id: "MOVIE_1",
    tmdbId: 1,
    mediaType: "movie",
    title: "T",
    posterPath: null,
    releaseDate: null,
    tmdbRating: null,
    tmdbVoteCount: null,
  })),
  getRichDetails: vi.fn(async () => ({
    id: "MOVIE_1",
    tmdbId: 1,
    mediaType: "movie",
    title: "T",
    posterPath: null,
    releaseDate: null,
    tmdbRating: null,
    tmdbVoteCount: null,
    overview: null,
    tagline: null,
    backdropPath: null,
    genres: [],
    runtimeMinutes: null,
    episodeRunTimeMinutes: null,
    numberOfSeasons: null,
    numberOfEpisodes: null,
    seasons: [],
    cast: [],
    crew: [],
    providers: undefined,
  })),
  getRecommendations: vi.fn(async () => []),
  getSimilar: vi.fn(async () => []),
}));

describe("use_show_details_data", () => {
  it("parses movie id and returns data", async () => {
    const res = await use_show_details_data("MOVIE_1");
    expect(res.mediaType).toBe("movie");
    expect(res.tmdbId).toBe(1);
    expect(res.rich.title).toBe("T");
    expect(res.relatedStates).toEqual({});
  });

  it("throws on invalid id", async () => {
    await expect(use_show_details_data("INVALID")).rejects.toThrow();
  });
});
