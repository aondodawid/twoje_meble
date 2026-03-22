export const CATALOG_URL = "/data/products.json";

export function resolveCatalogUrl() {
  return CATALOG_URL;
}

export function selectProductById(products, productId) {
  return products.find((product) => product.id === productId) || null;
}

export function clampSlideIndex(index, images) {
  if (!Array.isArray(images) || images.length === 0) {
    return 0;
  }

  return Math.min(Math.max(index, 0), images.length - 1);
}

export function canUseHoverPreview() {
  if (
    typeof window === "undefined" ||
    typeof window.matchMedia !== "function"
  ) {
    return false;
  }

  return window.matchMedia("(hover: hover) and (pointer: fine)").matches;
}
