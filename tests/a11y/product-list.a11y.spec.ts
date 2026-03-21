import AxeBuilder from "@axe-core/playwright";
import { expect, test } from "@playwright/test";

test("has no critical accessibility violations on list and modal views", async ({
  page,
}) => {
  await page.goto("/");

  const listResults = await new AxeBuilder({ page }).analyze();
  expect(listResults.violations).toEqual([]);

  await page.locator(".product-card__trigger").first().click();
  const modalResults = await new AxeBuilder({ page })
    .include('[role="dialog"]')
    .analyze();
  expect(modalResults.violations).toEqual([]);
});
