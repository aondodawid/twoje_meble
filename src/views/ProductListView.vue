<template>
  <section class="px-4 py-8 mx-auto max-w-7xl sm:px-6 lg:px-8 lg:py-12">
    <LoadingState v-if="status === 'loading'" />
    <ErrorState v-else-if="status === 'error'" @retry="loadCatalog" />
    <ProductGrid
      v-else
      :products="products"
      :supports-hover="supportsHover"
      @open="openProduct"
    />

    <ProductModal
      :visible="Boolean(selectedProduct)"
      :product="selectedProduct"
      :active-slide-index="activeSlideIndex"
      @close="closeProduct"
      @change-slide="changeSlide"
    />
  </section>
</template>

<script>
import ProductGrid from "@/components/ProductGrid.vue";
import ProductModal from "@/components/ProductModal.vue";
import ErrorState from "@/components/states/ErrorState.vue";
import LoadingState from "@/components/states/LoadingState.vue";
import {
  clampSlideIndex,
  canUseHoverPreview,
  resolveCatalogUrl,
  selectProductById,
} from "@/utils/productSelectors";
import { validateProducts } from "@/utils/validateProducts";

export default {
  name: "ProductListView",
  components: {
    ErrorState,
    LoadingState,
    ProductGrid,
    ProductModal,
  },
  data() {
    return {
      status: "loading",
      products: [],
      selectedProductId: null,
      activeSlideIndex: 0,
      lastTriggerElement: null,
      catalogUrl: resolveCatalogUrl(),
      supportsHover: canUseHoverPreview(),
    };
  },
  computed: {
    selectedProduct() {
      return selectProductById(this.products, this.selectedProductId);
    },
  },
  mounted() {
    this.loadCatalog();
  },
  methods: {
    async loadCatalog() {
      this.status = "loading";
      this.selectedProductId = null;
      this.activeSlideIndex = 0;

      try {
        const response = await fetch(this.catalogUrl, {
          headers: {
            Accept: "application/json",
          },
        });

        if (!response.ok) {
          throw new Error("Nie udało się pobrać danych katalogu.");
        }

        const payload = await response.json();
        this.products = validateProducts(payload);
        this.status = "ready";
      } catch (error) {
        console.error(error);
        this.products = [];
        this.status = "error";
      }
    },
    openProduct(productId, triggerElement) {
      this.selectedProductId = productId;
      this.activeSlideIndex = 0;
      this.lastTriggerElement = triggerElement || null;
    },
    closeProduct() {
      const lastTriggerElement = this.lastTriggerElement;
      this.selectedProductId = null;
      this.activeSlideIndex = 0;

      this.$nextTick(() => {
        if (
          lastTriggerElement &&
          typeof lastTriggerElement.focus === "function" &&
          document.body.contains(lastTriggerElement)
        ) {
          lastTriggerElement.focus();
        }
      });
    },
    changeSlide(index) {
      if (!this.selectedProduct) {
        return;
      }

      this.activeSlideIndex = clampSlideIndex(
        index,
        this.selectedProduct.galleryImages,
      );
    },
  },
};
</script>
