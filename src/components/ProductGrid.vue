<template>
  <ul
    class="grid gap-6 sm:grid-cols-2 xl:grid-cols-4"
    aria-label="Lista produktów"
  >
    <li v-for="(product, index) in products" :key="product.id" class="h-full">
      <ProductCard
        :product="product"
        :supports-hover="supportsHover"
        :priority-image="index < 4"
        @open="handleOpen"
      />
    </li>
  </ul>
</template>

<script>
import ProductCard from "./ProductCard.vue";

export default {
  name: "ProductGrid",
  components: {
    ProductCard,
  },
  props: {
    products: {
      type: Array,
      required: true,
    },
    supportsHover: {
      type: Boolean,
      default: false,
    },
  },
  methods: {
    handleOpen(productId, triggerElement) {
      this.$emit("open", productId, triggerElement);
    },
  },
};
</script>
