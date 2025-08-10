import {env} from "@/lib/env";
import Redis from "ioredis";

type CacheEntry<T> = {
  value: T;
  expiresAt: number; // epoch ms
};

const inMemoryCache = new Map<string, CacheEntry<unknown>>();
const redisClient = env.REDIS_URL ? new Redis(env.REDIS_URL) : null;

export async function getCached<T>(key: string): Promise<T | null> {
  if (redisClient) {
    const payload = await redisClient.get(key);
    if (!payload) {
      console.info(`[cache] miss redis ${key}`);
      return null;
    }
    try {
      const parsed = JSON.parse(payload) as CacheEntry<T>;
      if (parsed.expiresAt < Date.now()) {
        await redisClient.del(key);
        console.info(`[cache] expired redis ${key}`);
        return null;
      }
      console.info(`[cache] hit redis ${key}`);
      return parsed.value;
    } catch {
      console.info(`[cache] parse-error redis ${key}`);
      return null;
    }
  }
  const entry = inMemoryCache.get(key) as CacheEntry<T> | undefined;
  if (!entry) {
    console.info(`[cache] miss memory ${key}`);
    return null;
  }
  if (entry.expiresAt < Date.now()) {
    inMemoryCache.delete(key);
    console.info(`[cache] expired memory ${key}`);
    return null;
  }
  console.info(`[cache] hit memory ${key}`);
  return entry.value;
}

export async function setCached<T>(key: string, value: T, ttlSeconds: number) {
  const payload: CacheEntry<T> = {
    value,
    expiresAt: Date.now() + ttlSeconds * 1000,
  };
  if (redisClient) {
    await redisClient.set(key, JSON.stringify(payload), "EX", ttlSeconds);
  } else {
    inMemoryCache.set(key, payload);
  }
}
