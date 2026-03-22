<template>
  <div
    v-if="visible && product"
    class="fixed inset-0 z-50 flex items-center justify-center p-3 bg-bark/75 sm:p-6"
    @click.self="emitClose"
  >
    <transition name="modal">
      <section
        v-if="visible && product"
        ref="dialog"
        class="panel-surface relative max-h-[95vh] sm:max-h-[96vh] w-full max-w-2xl overflow-auto p-4 sm:p-4 md:p-6"
        role="dialog"
        aria-modal="true"
        :aria-labelledby="titleId"
        @keydown="handleKeydown"
      >
        <button
          ref="closeButton"
          type="button"
          class="absolute flex items-center justify-center w-10 h-10 transition-colors duration-200 rounded-full right-4 top-4 bg-bark/10 hover:bg-bark/20 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-clay focus-visible:ring-offset-2"
          aria-label="Zamknij szczegóły produktu"
          @click="emitClose"
        >
          <svg
            class="w-6 h-6 stroke-current text-bark"
            fill="none"
            stroke-width="2"
            stroke-linecap="round"
            stroke-linejoin="round"
            viewBox="0 0 24 24"
          >
            <path d="M18 6L6 18M6 6l12 12" />
          </svg>
        </button>

        <div class="space-y-5 sm:space-y-6">
          <header class="space-y-3 sm:space-y-3">
            <p
              class="text-sm font-semibold uppercase tracking-[0.28em] text-bark/85"
            >
              Szczegóły produktu
            </p>
            <h2
              :id="titleId"
              class="text-2xl font-black leading-tight sm:text-3xl md:text-4xl"
            >
              {{ product.name }}
            </h2>
            <p class="text-xl sm:text-2xl font-black text-clay">
              {{ product.price }}
            </p>
          </header>

          <ProductSlider
            :images="product.galleryImages"
            :active-index="activeSlideIndex"
            @change="handleSlideChange"
          />

          <div class="rounded-[1.5rem] bg-fog p-4 sm:p-5">
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
      </section>
    </transition>
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

<style scoped>
/* Modal transition - performant with GPU acceleration */
.modal-enter-active,
.modal-leave-active {
  transition: opacity 300ms cubic-bezier(0.4, 0, 0.2, 1),
    transform 300ms cubic-bezier(0.4, 0, 0.2, 1);
  will-change: transform, opacity;
}

.modal-enter,
.modal-leave-to {
  opacity: 0;
  transform: scale(0.95);
}

.modal-enter-to,
.modal-leave {
  opacity: 1;
  transform: scale(1);
}
</style>
