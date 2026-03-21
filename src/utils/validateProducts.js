const REQUIRED_FIELDS = [
  "id",
  "name",
  "price",
  "sku",
  "leadTime",
  "primaryImage",
  "galleryImages",
];

function isMeaningfulText(value) {
  return typeof value === "string" && value.trim().length > 0;
}

function validateImage(image, context) {
  if (!image || typeof image !== "object") {
    throw new Error(`Brakuje obrazu dla ${context}.`);
  }

  if (!isMeaningfulText(image.src) || !isMeaningfulText(image.alt)) {
    throw new Error(`Niepoprawne dane obrazu dla ${context}.`);
  }
}

function validateProduct(product, seenSkus) {
  REQUIRED_FIELDS.forEach((field) => {
    if (!(field in product)) {
      throw new Error(`Produkt nie zawiera pola ${field}.`);
    }
  });

  ["id", "name", "price", "sku", "leadTime"].forEach((field) => {
    if (!isMeaningfulText(product[field])) {
      throw new Error(`Pole ${field} musi być niepuste.`);
    }
  });

  if (seenSkus.has(product.sku)) {
    throw new Error(`Kod SKU ${product.sku} nie jest unikalny.`);
  }

  seenSkus.add(product.sku);
  validateImage(product.primaryImage, `${product.name} (obraz główny)`);

  if (product.hoverImage) {
    validateImage(product.hoverImage, `${product.name} (obraz hover)`);
  }

  if (
    !Array.isArray(product.galleryImages) ||
    product.galleryImages.length < 3
  ) {
    throw new Error(
      `Produkt ${product.name} musi mieć co najmniej 3 obrazy galerii.`,
    );
  }

  product.galleryImages.forEach((image, index) => {
    validateImage(image, `${product.name} (galeria ${index + 1})`);
  });

  return product;
}

export function validateProducts(products) {
  if (!Array.isArray(products)) {
    throw new Error("Katalog musi być tablicą produktów.");
  }

  const seenSkus = new Set();
  const validProducts = products.map((product) =>
    validateProduct(product, seenSkus),
  );

  if (validProducts.length !== 16) {
    throw new Error("Katalog musi zawierać dokładnie 16 produktów.");
  }

  return validProducts;
}
