<template>
  <div
    v-if="visible && product"
    class="fixed inset-0 z-50 flex items-end justify-center bg-bark/75 p-3 sm:p-6 md:items-center"
    @click.self="emitClose"
  >
    <section
      ref="dialog"
      class="panel-surface relative max-h-[92vh] w-full max-w-5xl overflow-auto p-4 sm:p-6"
      role="dialog"
      aria-modal="true"
      :aria-labelledby="titleId"
      @keydown="handleKeydown"
    >
      <button
        ref="closeButton"
        type="button"
        class="secondary-button absolute right-4 top-4"
        aria-label="Zamknij szczegóły produktu"
        @click="emitClose"
      >
        Zamknij
      </button>

      <div
        class="grid gap-6 lg:grid-cols-[minmax(0,0.9fr)_minmax(0,1.1fr)] lg:items-start"
      >
        <div class="space-y-4">
          <div class="overflow-hidden rounded-[1.75rem] bg-sand">
            <img
              class="h-72 w-full object-cover sm:h-80"
              :src="product.primaryImage.src"
              :alt="product.primaryImage.alt"
              loading="eager"
            />
          </div>
          <div class="rounded-[1.5rem] bg-fog p-5">
            <p
              class="text-xs font-bold uppercase tracking-[0.22em] text-bark/80"
            >
              Kod produktu
            </p>
            <p class="mt-2 text-lg font-semibold">{{ product.sku }}</p>
            <p
              class="mt-5 text-xs font-bold uppercase tracking-[0.22em] text-bark/80"
            >
              Czas realizacji
            </p>
            <p class="mt-2 text-lg font-semibold">{{ product.leadTime }}</p>
          </div>
        </div>

        <div class="space-y-6">
          <header class="space-y-3 pr-12">
            <p
              class="text-sm font-semibold uppercase tracking-[0.28em] text-bark/85"
            >
              Szczegóły produktu
            </p>
            <h2
              :id="titleId"
              class="text-3xl font-black leading-tight sm:text-4xl"
            >
              {{ product.name }}
            </h2>
            <p class="text-2xl font-black text-clay">{{ product.price }}</p>
            <p class="max-w-2xl text-base leading-7 text-bark/90">
              Zobacz pełną galerię zdjęć, sprawdź kod produktu i zaplanuj termin
              dostawy bez opuszczania katalogu.
            </p>
          </header>

          <ProductSlider
            :images="product.galleryImages"
            :active-index="activeSlideIndex"
            @change="handleSlideChange"
          />
        </div>
      </div>
    </section>
  </div>
</template>

<script>
import ProductSlider from "./ProductSlider.vue";

export default {
  name: "ProductModal",
  components: {
    ProductSlider,
  },
  props: {
    visible: {
      type: Boolean,
      default: false,
    },
    product: {
      type: Object,
      default: null,
    },
    activeSlideIndex: {
      type: Number,
      default: 0,
    },
  },
  computed: {
    titleId() {
      return this.product
        ? `product-title-${this.product.id}`
        : "product-title";
    },
  },
  watch: {
    visible(value) {
      if (value) {
        document.body.style.overflow = "hidden";
        this.$nextTick(() => {
          if (this.$refs.closeButton) {
            this.$refs.closeButton.focus();
          }
        });
      } else {
        document.body.style.overflow = "";
      }
    },
  },
  beforeDestroy() {
    document.body.style.overflow = "";
  },
  methods: {
    emitClose() {
      this.$emit("close");
    },
    handleSlideChange(index) {
      this.$emit("change-slide", index);
    },
    getFocusableElements() {
      const root = this.$refs.dialog;

      if (!root) {
        return [];
      }

      return Array.from(
        root.querySelectorAll(
          'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])',
        ),
      ).filter((element) => !element.hasAttribute("disabled"));
    },
    handleKeydown(event) {
      if (event.key === "Escape") {
        event.preventDefault();
        this.emitClose();
        return;
      }

      if (event.key !== "Tab") {
        return;
      }

      const focusable = this.getFocusableElements();

      if (focusable.length === 0) {
        return;
      }

      const first = focusable[0];
      const last = focusable[focusable.length - 1];
      const active = document.activeElement;

      if (event.shiftKey && active === first) {
        event.preventDefault();
        last.focus();
      } else if (!event.shiftKey && active === last) {
        event.preventDefault();
        first.focus();
      }
    },
  },
};
</script>
