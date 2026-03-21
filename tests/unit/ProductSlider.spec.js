import { mount } from "@vue/test-utils";
import ProductSlider from "@/components/ProductSlider.vue";

const images = [
  { src: "/1.svg", alt: "Zdjęcie 1" },
  { src: "/2.svg", alt: "Zdjęcie 2" },
  { src: "/3.svg", alt: "Zdjęcie 3" },
];

describe("ProductSlider", () => {
  it("shows the active image and status label", () => {
    const wrapper = mount(ProductSlider, {
      propsData: {
        images,
        activeIndex: 1,
      },
    });

    expect(wrapper.find("img").attributes("src")).toBe("/2.svg");
    expect(wrapper.text()).toContain("Slajd 2 z 3");
  });

  it("emits change when next is clicked", async () => {
    const wrapper = mount(ProductSlider, {
      propsData: {
        images,
        activeIndex: 0,
      },
    });

    await wrapper.findAll("button").at(1).trigger("click");
    expect(wrapper.emitted().change[0][0]).toBe(1);
  });
});
