import { expect, test } from "@playwright/test";

test("swaps to the hover image on desktop and restores on pointer leave", async ({
  page,
}) => {
  await page.goto("/");

  const firstCardImage = page.locator("article img").first();
  const initialSrc = await firstCardImage.getAttribute("src");

  await firstCardImage.hover();
  await expect(firstCardImage).not.toHaveAttribute("src", initialSrc || "");

  await page.locator("body").hover();
  await expect(firstCardImage).toHaveAttribute("src", initialSrc || "");
});
