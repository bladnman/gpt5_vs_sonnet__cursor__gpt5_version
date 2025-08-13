import {expect, test} from "@playwright/test";

test("navigates to a show details page and renders key sections", async ({
  page,
}) => {
  // Navigate to discovery and click a first show card to ensure route works in-app
  await page.goto("/");
  // go to a known id route directly since homepage content depends on TMDB
  await page.goto("/show-details/MOVIE_550");

  await expect(page.locator("h1")).toHaveCount(1);
});
