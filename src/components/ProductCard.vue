<template>
  <article
    class="relative flex flex-col h-full overflow-hidden text-left cursor-pointer panel-surface focus-within:ring-4 focus-within:ring-clay/55 focus-within:ring-offset-4 focus-within:ring-offset-fog"
    @mouseenter="setHovered(true)"
    @mouseleave="setHovered(false)"
  >
    <button
      :id="triggerId"
      ref="trigger"
      type="button"
      class="product-card__trigger absolute inset-0 z-10 rounded-[2rem] bg-transparent focus-visible:outline-none"
      :aria-label="`Pokaż szczegóły produktu ${product.name}`"
      aria-haspopup="dialog"
      @click="emitOpen"
    ></button>

    <div class="relative aspect-[4/3] overflow-hidden bg-sand">
      <img
        class="object-cover w-full h-full transition duration-300 ease-out"
        :src="displayImage.src"
        :srcset="imageSrcset"
        sizes="(max-width: 639px) calc(100vw - 2rem), (max-width: 1279px) calc(50vw - 4.5rem), calc(25vw - 6rem)"
        :alt="displayImage.alt"
        :loading="imageLoading"
        :decoding="imageDecoding"
        :fetchpriority="imageFetchPriority"
      />
    </div>

    <div class="flex flex-col flex-1 gap-4 p-5">
      <div class="space-y-2">
        <h2 class="text-xl font-bold leading-tight text-bark">
          {{ product.name }}
        </h2>
        <p class="text-2xl font-black text-bark">{{ product.price }}</p>
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
    imageLoading() {
      return this.priorityImage ? "eager" : "lazy";
    },
    imageDecoding() {
      return this.priorityImage ? "sync" : "async";
    },
    imageFetchPriority() {
      return this.priorityImage ? "high" : null;
    },
    imageSrcset() {
      const src = this.displayImage.src;
      if (!src.endsWith(".webp")) {
        return undefined;
      }
      const src600 = src.replace(/\.webp$/, "-600w.webp");
      const src750 = src.replace(/\.webp$/, "-750w.webp");
      return `${src600} 600w, ${src750} 750w, ${src} 900w`;
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
