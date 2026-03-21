import { mount } from "@vue/test-utils";
import ProductGrid from "@/components/ProductGrid.vue";

const products = Array.from({ length: 2 }, (_, index) => ({
  id: `product-${index}`,
  name: `Produkt ${index}`,
  price: `${index} zł`,
  sku: `SKU-${index}`,
  leadTime: "Dostawa jutro",
  primaryImage: { src: "/primary.svg", alt: "Obraz podstawowy" },
  hoverImage: { src: "/hover.svg", alt: "Obraz hover" },
  galleryImages: [
    { src: "/1.svg", alt: "Zdjęcie 1" },
    { src: "/2.svg", alt: "Zdjęcie 2" },
    { src: "/3.svg", alt: "Zdjęcie 3" },
  ],
}));

describe("ProductGrid", () => {
  it("renders one card per product", () => {
    const wrapper = mount(ProductGrid, {
      propsData: {
        products,
        supportsHover: true,
      },
    });

    expect(wrapper.findAll(".product-card__trigger")).toHaveLength(2);
  });
});
