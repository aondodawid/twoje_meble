import { expect, test } from "@playwright/test";

async function hasNoHorizontalScroll(page) {
  return page.evaluate(
    () => document.documentElement.scrollWidth <= window.innerWidth + 1,
  );
}

test("renders 16 products and adapts across breakpoints", async ({ page }) => {
  await page.goto("/");

  await expect(
    page.getByRole("heading", { name: "Kolekcja do salonu i jadalni" }),
  ).toBeVisible();
  await expect(page.locator(".product-card__trigger")).toHaveCount(16);

  const desktopRowTops = await page
    .locator(".product-card__trigger")
    .evaluateAll((buttons) =>
      buttons.slice(0, 4).map((button) => button.getBoundingClientRect().top),
    );
  expect(new Set(desktopRowTops.map((value) => Math.round(value))).size).toBe(
    1,
  );

  await page.setViewportSize({ width: 768, height: 1200 });
  await page.reload();
  const tabletTops = await page
    .locator(".product-card__trigger")
    .evaluateAll((buttons) =>
      buttons.slice(0, 3).map((button) => button.getBoundingClientRect().top),
    );
  expect(Math.round(tabletTops[0])).toBe(Math.round(tabletTops[1]));
  expect(Math.round(tabletTops[2])).toBeGreaterThan(Math.round(tabletTops[0]));
  expect(await hasNoHorizontalScroll(page)).toBe(true);

  await page.setViewportSize({ width: 390, height: 1200 });
  await page.reload();
  const mobileTops = await page
    .locator(".product-card__trigger")
    .evaluateAll((buttons) =>
      buttons.slice(0, 2).map((button) => button.getBoundingClientRect().top),
    );
  expect(Math.round(mobileTops[1])).toBeGreaterThan(Math.round(mobileTops[0]));
  expect(await hasNoHorizontalScroll(page)).toBe(true);
});

test("shows fallback state for invalid catalog data", async ({ page }) => {
  await page.goto("/?catalog=%2Fdata%2Finvalid-products.json");
  await expect(page.getByText("Nie udało się wczytać oferty")).toBeVisible();
  await expect(
    page.getByRole("button", { name: "Spróbuj ponownie" }),
  ).toBeVisible();
});
