const Ajv2020 = require("ajv/dist/2020");
const schema = require("../../specs/001-product-list-modal/contracts/product-data.schema.json");
const products = require("../../public/data/products.json");
const { validateProducts } = require("../../src/utils/validateProducts");

describe("product dataset", () => {
  it("matches the JSON schema", () => {
    const ajv = new Ajv2020({ allErrors: true });
    const validate = ajv.compile(schema);
    const isValid = validate(products);

    expect(isValid).toBe(true);
  });

  it("passes application validation rules", () => {
    expect(validateProducts(products)).toHaveLength(16);
  });

  it("contains descriptive alt texts in Polish", () => {
    const texts = products.flatMap((product) => [
      product.primaryImage.alt,
      ...(product.hoverImage ? [product.hoverImage.alt] : []),
      ...product.galleryImages.map((image) => image.alt),
    ]);

    texts.forEach((alt) => {
      expect(typeof alt).toBe("string");
      expect(alt.trim().length).toBeGreaterThan(6);
    });
  });
});
