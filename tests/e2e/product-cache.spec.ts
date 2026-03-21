import { expect, test } from "@playwright/test";

test("caches the local catalog response with Workbox", async ({ page }) => {
  await page.goto("/");
  await page.waitForTimeout(1500);
  await page.reload();

  await page.waitForFunction(() =>
    Boolean(navigator.serviceWorker?.controller),
  );

  await page.evaluate(async () => {
    await fetch("/data/products.json", { cache: "no-store" });
  });
  await page.waitForTimeout(500);

  const cached = await page.evaluate(async () => {
    const cache = await caches.open("twoje-meble-catalog-v1");
    const absoluteUrl = new URL(
      "/data/products.json",
      window.location.origin,
    ).toString();
    const response = await cache.match(absoluteUrl);

    if (response) {
      return true;
    }

    const requests = await cache.keys();
    return requests.some((request) =>
      request.url.endsWith("/data/products.json"),
    );
  });

  expect(cached).toBe(true);
});
