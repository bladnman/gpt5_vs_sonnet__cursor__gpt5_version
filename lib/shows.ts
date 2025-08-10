import {prisma} from "@/lib/db";
import type {MinimalShow} from "@/lib/tmdb/types";

export async function ensureShowExists(minimal: MinimalShow) {
  await prisma.show.upsert({
    where: {id: minimal.id},
    create: {
      id: minimal.id,
      tmdbId: minimal.tmdbId,
      mediaType: minimal.mediaType,
      title: minimal.title,
      posterPath: minimal.posterPath ?? null,
      releaseDate: minimal.releaseDate ?? null,
      tmdbRating: minimal.tmdbRating ?? null,
      tmdbVoteCount: minimal.tmdbVoteCount ?? null,
    },
    update: {
      title: minimal.title,
      posterPath: minimal.posterPath ?? null,
      releaseDate: minimal.releaseDate ?? null,
      tmdbRating: minimal.tmdbRating ?? null,
      tmdbVoteCount: minimal.tmdbVoteCount ?? null,
    },
  });
}
