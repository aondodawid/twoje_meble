import { expect, test } from "@playwright/test";

test("renders the primary product flow across the supported browser matrix", async ({
  page,
}, testInfo) => {
  test.skip(
    process.platform === "linux" &&
      ["webkit", "mobile-safari"].includes(testInfo.project.name),
    "Playwright WebKit crashes before navigation in the current Linux environment; verify Safari manually.",
  );

  await page.goto("/");
  await expect(
    page.getByRole("heading", { name: "Kolekcja do salonu i jadalni" }),
  ).toBeVisible();
  await expect(page.locator(".product-card__trigger").first()).toBeVisible();

  await page.locator(".product-card__trigger").first().click();
  await expect(page.locator('[role="dialog"]')).toBeVisible();
});
