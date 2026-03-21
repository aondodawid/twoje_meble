import { mount } from "@vue/test-utils";
import ProductModal from "@/components/ProductModal.vue";

const product = {
  id: "modal",
  name: "Komoda Testowa",
  price: "1 199 zł",
  sku: "SKU-MOD-1",
  leadTime: "Dostawa w 3 dni",
  primaryImage: { src: "/primary.svg", alt: "Zdjęcie główne" },
  galleryImages: [
    { src: "/1.svg", alt: "Zdjęcie 1" },
    { src: "/2.svg", alt: "Zdjęcie 2" },
    { src: "/3.svg", alt: "Zdjęcie 3" },
  ],
};

describe("ProductModal", () => {
  it("renders dialog details", () => {
    const wrapper = mount(ProductModal, {
      attachTo: document.body,
      propsData: {
        visible: true,
        product,
        activeSlideIndex: 0,
      },
    });

    expect(wrapper.find('[role="dialog"]').exists()).toBe(true);
    expect(wrapper.text()).toContain("Komoda Testowa");
    expect(wrapper.text()).toContain("SKU-MOD-1");
  });

  it("closes on escape", async () => {
    const wrapper = mount(ProductModal, {
      attachTo: document.body,
      propsData: {
        visible: true,
        product,
        activeSlideIndex: 0,
      },
    });

    await wrapper.find('[role="dialog"]').trigger("keydown", { key: "Escape" });
    expect(wrapper.emitted().close).toHaveLength(1);
  });
});
