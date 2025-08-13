import {defineConfig, devices} from "@playwright/test";

export default defineConfig({
  testDir: "./tests/e2e",
  fullyParallel: true,
  use: {
    baseURL: "http://localhost:4000",
    trace: "on-first-retry",
  },
  projects: [
    {
      name: "chromium",
      use: {...devices["Desktop Chrome"]},
    },
  ],
  webServer: {
    command: "npm run dev",
    url: "http://localhost:4000",
    reuseExistingServer: !process.env.CI,
    env: {
      DATABASE_URL: "file:./prisma/dev.db",
      TMDB_API_KEY: "",
      TMDB_V4_TOKEN: "",
      MOCK_TMDB: "1",
    },
  },
});
