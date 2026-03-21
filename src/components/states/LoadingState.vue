<template>
  <div
    class="panel-surface flex min-h-[14rem] flex-col items-center justify-center gap-4 px-6 py-10 text-center"
  >
    <div
      class="h-12 w-12 animate-spin rounded-full border-4 border-clay/25 border-t-clay"
      aria-hidden="true"
    ></div>
    <div>
      <p class="text-lg font-bold">Ładowanie kolekcji</p>
      <p class="mt-2 text-sm text-bark/70">
        Za chwilę pokażemy dostępne produkty.
      </p>
    </div>
  </div>
</template>

<script>
export default {
  name: "LoadingState",
};
</script>
