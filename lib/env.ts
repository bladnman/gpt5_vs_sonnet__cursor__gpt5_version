import {z} from "zod";

const EnvSchema = z.object({
  DATABASE_URL: z.string().min(1, "DATABASE_URL is required"),
  // TMDB v3 key (as query param) OR v4 token (as Bearer). Support both.
  TMDB_API_KEY: z.string().optional().default(""),
  TMDB_V4_TOKEN: z.string().optional().default(""),
  REDIS_URL: z.string().optional().default(""),
});

export type AppEnv = z.infer<typeof EnvSchema>;

export const env: AppEnv = EnvSchema.parse({
  DATABASE_URL: process.env.DATABASE_URL,
  TMDB_API_KEY: process.env.TMDB_API_KEY,
  TMDB_V4_TOKEN: process.env.TMDB_V4_TOKEN,
  REDIS_URL: process.env.REDIS_URL,
});
