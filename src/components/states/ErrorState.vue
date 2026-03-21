<template>
  <div
    class="panel-surface flex min-h-[14rem] flex-col items-center justify-center gap-4 px-6 py-10 text-center"
  >
    <div class="space-y-2">
      <p class="text-lg font-bold">Nie udało się wczytać oferty</p>
      <p class="text-sm leading-6 text-bark/70">
        Sprawdź połączenie lub spróbuj ponownie, aby załadować produkty jeszcze
        raz.
      </p>
    </div>
    <button type="button" class="action-button" @click="$emit('retry')">
      Spróbuj ponownie
    </button>
  </div>
</template>

<script>
export default {
  name: "ErrorState",
};
</script>
