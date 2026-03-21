/* eslint-disable no-restricted-globals */
import { clientsClaim } from "workbox-core";
import { precacheAndRoute, cleanupOutdatedCaches } from "workbox-precaching";
import { registerRoute } from "workbox-routing";
import { StaleWhileRevalidate } from "workbox-strategies";

self.skipWaiting();
clientsClaim();
cleanupOutdatedCaches();
precacheAndRoute(self.__WB_MANIFEST || []);

registerRoute(
  ({ request }) =>
    ["style", "script", "image", "font"].includes(request.destination),
  new StaleWhileRevalidate({
    cacheName: "twoje-meble-static-v1",
  }),
);

registerRoute(
  ({ url }) => url.pathname === "/data/products.json",
  new StaleWhileRevalidate({
    cacheName: "twoje-meble-catalog-v1",
  }),
);
