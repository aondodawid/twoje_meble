import { expect, test } from "@playwright/test";

async function modalHasNoHorizontalScroll(page) {
  return page
    .locator('[role="dialog"]')
    .evaluate((element) => element.scrollWidth <= element.clientWidth + 1);
}

test("opens modal, traps focus, and closes with escape", async ({ page }) => {
  await page.goto("/");

  const firstTrigger = page.locator(".product-card__trigger").first();
  await firstTrigger.click();

  const dialog = page.locator('[role="dialog"]');
  await expect(dialog).toBeVisible();
  await expect(dialog).toContainText("Szczegóły produktu");
  await expect(dialog).toContainText("Kod produktu");
  await expect(dialog).toContainText("Czas realizacji");

  await expect(
    page.getByRole("button", { name: "Zamknij szczegóły produktu" }),
  ).toBeFocused();
  await page.keyboard.press("Shift+Tab");
  await expect(
    page.getByRole("button", { name: "Pokaż slajd 3" }),
  ).toBeFocused();
  await page.keyboard.press("Tab");
  await expect(
    page.getByRole("button", { name: "Zamknij szczegóły produktu" }),
  ).toBeFocused();

  await page.keyboard.press("Escape");
  await expect(dialog).toBeHidden();
  await expect(firstTrigger).toBeFocused();
});

test("keeps modal usable at 768px and 390px", async ({ page }) => {
  await page.goto("/");

  await page.setViewportSize({ width: 768, height: 1200 });
  await page.reload();
  await page.locator(".product-card__trigger").first().click();
  expect(await modalHasNoHorizontalScroll(page)).toBe(true);

  await page.keyboard.press("Escape");
  await page.setViewportSize({ width: 390, height: 900 });
  await page.reload();
  await page.locator(".product-card__trigger").first().click();
  expect(await modalHasNoHorizontalScroll(page)).toBe(true);
});
