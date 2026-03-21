<template>
  <article class="panel-surface flex h-full flex-col overflow-hidden">
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
      <span
        class="absolute left-4 top-4 rounded-full bg-white/90 px-3 py-1 text-xs font-bold uppercase tracking-[0.2em] text-clay"
      >
        Nowość
      </span>
    </div>

    <div class="flex flex-1 flex-col gap-4 p-5">
      <div class="space-y-2">
        <h2 class="text-xl font-bold leading-tight">{{ product.name }}</h2>
        <p class="text-sm uppercase tracking-[0.25em] text-bark/55">
          {{ product.sku }}
        </p>
        <p class="text-2xl font-black text-clay">{{ product.price }}</p>
      </div>

      <div class="mt-auto flex items-center justify-between gap-4">
        <p class="text-sm text-bark/70">Dostawa: {{ product.leadTime }}</p>
        <button
          :id="triggerId"
          ref="trigger"
          type="button"
          class="action-button product-card__trigger"
          :aria-label="`Pokaż szczegóły produktu ${product.name}`"
          aria-haspopup="dialog"
          @click="emitOpen"
        >
          Szczegóły
        </button>
      </div>
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
