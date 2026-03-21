<template>
  <section class="space-y-4" aria-label="Galeria produktu">
    <div class="overflow-hidden rounded-[1.5rem] bg-sand">
      <img
        class="h-64 w-full object-cover sm:h-72"
        :src="currentImage.src"
        :alt="currentImage.alt"
        loading="eager"
      />
    </div>

    <div class="flex items-center justify-between gap-4">
      <button
        type="button"
        class="secondary-button"
        :disabled="activeIndex === 0"
        aria-label="Poprzednie zdjęcie"
        @click="$emit('change', activeIndex - 1)"
      >
        Poprzednie
      </button>
      <p class="text-sm font-semibold text-bark/85">
        Slajd {{ activeIndex + 1 }} z {{ images.length }}
      </p>
      <button
        type="button"
        class="secondary-button"
        :disabled="activeIndex === images.length - 1"
        aria-label="Następne zdjęcie"
        @click="$emit('change', activeIndex + 1)"
      >
        Następne
      </button>
    </div>

    <ol class="grid grid-cols-3 gap-3 sm:grid-cols-5">
      <li v-for="(image, index) in images" :key="`${image.src}-${index}`">
        <button
          type="button"
          class="w-full overflow-hidden rounded-2xl border-2 transition"
          :class="
            index === activeIndex
              ? 'border-clay'
              : 'border-transparent hover:border-bark/20'
          "
          :aria-label="`Pokaż slajd ${index + 1}`"
          @click="$emit('change', index)"
        >
          <img
            class="h-20 w-full object-cover"
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
  computed: {
    currentImage() {
      return this.images[this.activeIndex] || this.images[0];
    },
  },
};
</script>
