import { mount } from "@vue/test-utils";
import ProductCard from "@/components/ProductCard.vue";

const product = {
  id: "sample",
  name: "Sofa Testowa",
  price: "999 zł",
  sku: "SKU-001",
  leadTime: "Dostawa w 2 dni",
  primaryImage: { src: "/primary.svg", alt: "Widok podstawowy" },
  hoverImage: { src: "/hover.svg", alt: "Widok hover" },
  galleryImages: [
    { src: "/1.svg", alt: "Zdjęcie 1" },
    { src: "/2.svg", alt: "Zdjęcie 2" },
    { src: "/3.svg", alt: "Zdjęcie 3" },
  ],
};

describe("ProductCard", () => {
  it("renders product content", () => {
    const wrapper = mount(ProductCard, {
      propsData: {
        product,
        supportsHover: true,
      },
    });

    expect(wrapper.text()).toContain("Sofa Testowa");
    expect(wrapper.text()).toContain("999 zł");
    expect(wrapper.find("img").attributes("alt")).toBe("Widok podstawowy");
  });

  it("emits open with trigger element", async () => {
    const wrapper = mount(ProductCard, {
      propsData: {
        product,
        supportsHover: true,
      },
    });

    await wrapper.find(".product-card__trigger").trigger("click");

    expect(wrapper.emitted().open).toHaveLength(1);
    expect(wrapper.emitted().open[0][0]).toBe("sample");
    expect(wrapper.emitted().open[0][1].tagName).toBe("BUTTON");
  });

  it("swaps image on hover when supported", async () => {
    const wrapper = mount(ProductCard, {
      propsData: {
        product,
        supportsHover: true,
      },
    });

    await wrapper.find("article").trigger("mouseenter");
    expect(wrapper.find("img").attributes("src")).toBe("/hover.svg");

    await wrapper.find("article").trigger("mouseleave");
    expect(wrapper.find("img").attributes("src")).toBe("/primary.svg");
  });
});
