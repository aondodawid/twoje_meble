<template>
  <article
    :id="triggerId"
    ref="trigger"
    class="panel-surface product-card__trigger flex h-full cursor-pointer flex-col overflow-hidden text-left"
    role="button"
    tabindex="0"
    :aria-label="`Pokaż szczegóły produktu ${product.name}`"
    aria-haspopup="dialog"
    @click="emitOpen"
    @keydown.enter.prevent="emitOpen"
    @keydown.space.prevent="emitOpen"
  >
    <div
      class="relative aspect-[4/3] overflow-hidden bg-sand"
      @mouseenter="setHovered(true)"
      @mouseleave="setHovered(false)"
    >
      <img
        class="h-full w-full object-cover transition duration-300 ease-out"
        :src="displayImage.src"
        :alt="displayImage.alt"
        :loading="priorityImage ? 'eager' : 'lazy'"
        :fetchpriority="priorityImage ? 'high' : 'auto'"
      />
    </div>

    <div class="flex flex-1 flex-col gap-4 p-5">
      <div class="space-y-2">
        <h2 class="text-xl font-bold leading-tight">{{ product.name }}</h2>
        <p class="text-sm uppercase tracking-[0.25em] text-bark/55">
          {{ product.sku }}
        </p>
        <p class="text-2xl font-black text-clay">{{ product.price }}</p>
      </div>

      <p class="mt-auto text-sm text-bark/70">{{ product.leadTime }}</p>
    </div>
  </article>
</template>

<script>
export default {
  name: "ProductCard",
  props: {
    product: {
      type: Object,
      required: true,
    },
    supportsHover: {
      type: Boolean,
      default: false,
    },
    priorityImage: {
      type: Boolean,
      default: false,
    },
  },
  data() {
    return {
      isHovered: false,
    };
  },
  computed: {
    displayImage() {
      if (this.isHovered && this.supportsHover && this.product.hoverImage) {
        return this.product.hoverImage;
      }

      return this.product.primaryImage;
    },
    triggerId() {
      return `product-trigger-${this.product.id}`;
    },
  },
  methods: {
    emitOpen() {
      this.$emit("open", this.product.id, this.$refs.trigger);
    },
    setHovered(value) {
      if (!this.supportsHover || !this.product.hoverImage) {
        return;
      }

      this.isHovered = value;
    },
  },
};
</script>
