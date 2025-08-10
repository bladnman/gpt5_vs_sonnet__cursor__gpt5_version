"use server";
import {prisma} from "@/lib/db";
import {ensureUserId} from "@/lib/session";
import {ensureShowExists} from "@/lib/shows";
import type {MinimalShow} from "@/lib/tmdb/types";

export async function addToWatchlist(show: MinimalShow) {
  const userId = await ensureUserId();
  await ensureShowExists(show);
  await prisma.watchlist.upsert({
    where: {userId_showId: {userId, showId: show.id}},
    create: {userId, showId: show.id},
    update: {},
  });
}

export async function removeFromWatchlist(showId: string) {
  const userId = await ensureUserId();
  await prisma.watchlist.delete({where: {userId_showId: {userId, showId}}});
}

export async function markWatched(show: MinimalShow) {
  const userId = await ensureUserId();
  await ensureShowExists(show);
  await prisma.watch.create({data: {userId, showId: show.id}});
}

export async function rateShow(show: MinimalShow, rating: number) {
  const userId = await ensureUserId();
  await ensureShowExists(show);
  const clamped = Math.max(1, Math.min(10, Math.round(rating)));
  await prisma.rating.upsert({
    where: {userId_showId: {userId, showId: show.id}},
    create: {userId, showId: show.id, rating: clamped},
    update: {rating: clamped},
  });
}
