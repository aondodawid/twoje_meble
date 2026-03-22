<template>
  <div
    v-if="visible && product"
    class="fixed inset-0 z-50 flex items-center justify-center p-3 bg-bark/75 sm:p-6"
    @click.self="emitClose"
  >
    <transition name="modal">
      <section
        ref="dialog"
        class="panel-surface relative h-[94vh] sm:h-[92vh] md:h-[90vh] w-full max-w-2xl md:max-w-3xl overflow-hidden p-4 sm:p-5 md:p-6"
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

        <div class="flex flex-col gap-3 sm:gap-4 h-full">
          <header class="space-y-1 sm:space-y-2 shrink-0">
            <p
              class="text-xs sm:text-sm font-semibold uppercase tracking-[0.28em] text-bark/85"
            >
              Szczegóły produktu
            </p>
            <h2
              :id="titleId"
              class="text-xl sm:text-2xl md:text-3xl font-black leading-tight"
            >
              {{ product.name }}
            </h2>
            <p class="text-lg sm:text-xl md:text-2xl font-black text-clay">
              {{ product.price }}
            </p>
          </header>

          <ProductSlider
            class="min-h-0 flex-1"
            :images="product.galleryImages"
            :active-index="activeSlideIndex"
            @change="handleSlideChange"
          />

          <div
            class="rounded-xl sm:rounded-[1.5rem] bg-fog p-3 sm:p-4 shrink-0"
          >
            <div class="flex flex-wrap gap-x-8 gap-y-2">
              <div>
                <p
                  class="text-xs font-bold uppercase tracking-[0.22em] text-bark/80"
                >
                  Kod produktu
                </p>
                <p class="mt-1 text-sm sm:text-base font-semibold">
                  {{ product.sku }}
                </p>
              </div>
              <div>
                <p
                  class="text-xs font-bold uppercase tracking-[0.22em] text-bark/80"
                >
                  Czas realizacji
                </p>
                <p class="mt-1 text-sm sm:text-base font-semibold">
                  {{ product.leadTime }}
                </p>
              </div>
            </div>
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
  data() {
    return {
      savedOverflow: null,
    };
  },
  watch: {
    visible(value) {
      if (value) {
        this.savedOverflow = document.body.style.overflow;
        document.body.style.overflow = "hidden";
        this.$nextTick(() => {
          if (this.$refs.closeButton) {
            this.$refs.closeButton.focus();
          }
        });
      } else {
        document.body.style.overflow = this.savedOverflow || "";
        this.savedOverflow = null;
      }
    },
  },
  beforeDestroy() {
    if (this.savedOverflow !== null) {
      document.body.style.overflow = this.savedOverflow;
    }
  },
  methods: {
    emitClose(viaKeyboard = false) {
      this.$emit("close", { viaKeyboard });
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
        this.emitClose(true);
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
