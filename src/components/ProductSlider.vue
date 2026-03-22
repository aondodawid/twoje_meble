<template>
  <section class="space-y-4" aria-label="Galeria produktu">
    <div
      class="relative overflow-hidden rounded-[1.5rem] bg-sand group cursor-grab active:cursor-grabbing"
      @touchstart="handleTouchStart"
      @touchend="handleTouchEnd"
    >
      <img
        class="w-full aspect-[4/3] max-h-[35vh] sm:max-h-[42vh] object-cover select-none"
        :src="currentImage.src"
        :alt="currentImage.alt"
        loading="eager"
      />

      <div
        class="absolute inset-0 flex items-center justify-between px-3 pointer-events-none sm:px-4"
      >
        <button
          type="button"
          class="flex items-center justify-center w-12 h-12 transition-all duration-200 rounded-full pointer-events-auto sm:w-14 sm:h-14 opacity-70 hover:enabled:opacity-100 disabled:opacity-30 disabled:cursor-not-allowed bg-bark/40 hover:enabled:bg-bark/50 backdrop-blur-md focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-clay focus-visible:ring-offset-2"
          :disabled="activeIndex === 0"
          aria-label="Poprzednie zdjęcie"
          @click="$emit('change', activeIndex - 1)"
        >
          <svg
            class="w-6 h-6 font-bold text-white stroke-current sm:w-7 sm:h-7"
            fill="none"
            stroke-width="3"
            stroke-linecap="round"
            stroke-linejoin="round"
            viewBox="0 0 24 24"
          >
            <path d="M15 19l-7-7 7-7" />
          </svg>
        </button>

        <button
          type="button"
          class="flex items-center justify-center w-12 h-12 transition-all duration-200 rounded-full pointer-events-auto sm:w-14 sm:h-14 opacity-70 hover:enabled:opacity-100 disabled:opacity-30 disabled:cursor-not-allowed bg-bark/40 hover:enabled:bg-bark/50 backdrop-blur-md focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-clay focus-visible:ring-offset-2"
          :disabled="activeIndex === images.length - 1"
          aria-label="Następne zdjęcie"
          @click="$emit('change', activeIndex + 1)"
        >
          <svg
            class="w-6 h-6 font-bold text-white stroke-current sm:w-7 sm:h-7"
            fill="none"
            stroke-width="3"
            stroke-linecap="round"
            stroke-linejoin="round"
            viewBox="0 0 24 24"
          >
            <path d="M9 5l7 7-7 7" />
          </svg>
        </button>
      </div>
    </div>

    <ol class="grid grid-cols-3 gap-3 sm:grid-cols-5">
      <li v-for="(image, index) in images" :key="`${image.src}-${index}`">
        <button
          type="button"
          class="w-full overflow-hidden transition border-2 rounded-2xl"
          :class="
            index === activeIndex
              ? 'border-clay'
              : 'border-transparent hover:border-bark/20'
          "
          :aria-label="`Pokaż slajd ${index + 1}`"
          @click="$emit('change', index)"
        >
          <img
            class="object-cover w-full aspect-square"
            :src="image.src"
            :alt="image.alt"
            loading="lazy"
          />
        </button>
      </li>
    </ol>
  </section>
</template>

<script>
export default {
  name: "ProductSlider",
  props: {
    images: {
      type: Array,
      required: true,
    },
    activeIndex: {
      type: Number,
      default: 0,
    },
  },
  data() {
    return {
      touchStartX: 0,
      touchStartY: 0,
    };
  },
  computed: {
    currentImage() {
      return this.images[this.activeIndex] || this.images[0];
    },
  },
  methods: {
    handleTouchStart(event) {
      this.touchStartX = event.touches[0].clientX;
      this.touchStartY = event.touches[0].clientY;
    },
    handleTouchEnd(event) {
      const touchEndX = event.changedTouches[0].clientX;
      const touchEndY = event.changedTouches[0].clientY;

      const diffX = this.touchStartX - touchEndX;
      const diffY = this.touchStartY - touchEndY;

      // Tylko jeśli ruch był głównie horizontalny
      if (Math.abs(diffX) > Math.abs(diffY) && Math.abs(diffX) > 50) {
        if (diffX > 0) {
          // Swipe w lewo - następne zdjęcie
          if (this.activeIndex < this.images.length - 1) {
            this.$emit("change", this.activeIndex + 1);
          }
        } else {
          // Swipe w prawo - poprzednie zdjęcie
          if (this.activeIndex > 0) {
            this.$emit("change", this.activeIndex - 1);
          }
        }
      }
    },
  },
};
</script>
