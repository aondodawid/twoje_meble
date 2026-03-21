<template>
  <div
    class="min-h-screen bg-[radial-gradient(circle_at_top,_rgba(200,111,61,0.18),_transparent_42%),linear-gradient(180deg,_#f8f7f4_0%,_#efe6d9_100%)] text-bark"
  >
    <header class="border-b border-bark/10 bg-white/80 backdrop-blur-sm">
      <div class="mx-auto max-w-7xl px-4 py-6 sm:px-6 lg:px-8">
        <p class="text-sm font-semibold uppercase tracking-[0.28em] text-clay">
          Twoje Meble
        </p>
        <div
          class="mt-3 flex flex-col gap-3 md:flex-row md:items-end md:justify-between"
        >
          <div>
            <h1 class="text-4xl font-black tracking-tight sm:text-5xl">
              Kolekcja do salonu i jadalni
            </h1>
            <p
              class="mt-3 max-w-2xl text-base leading-7 text-bark/75 sm:text-lg"
            >
              Przeglądaj wybrane modele, porównuj wykończenia i otwieraj
              szczegóły bez opuszczania listy produktów.
            </p>
          </div>
          <p
            class="rounded-full bg-bark px-4 py-2 text-sm font-semibold text-fog shadow-panel"
          >
            16 starannie dobranych produktów
          </p>
        </div>
      </div>
    </header>

    <main>
      <ProductListView />
    </main>
  </div>
</template>

<script>
import ProductListView from "./views/ProductListView.vue";

export default {
  name: "App",
  components: {
    ProductListView,
  },
};
</script>
