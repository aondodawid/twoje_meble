export default function registerServiceWorker() {
  if (process.env.NODE_ENV !== "production") {
    return;
  }

  if (!("serviceWorker" in navigator)) {
    return;
  }

  window.addEventListener("load", async () => {
    try {
      await navigator.serviceWorker.register("/service-worker.js");
    } catch (error) {
      console.error("Nie udało się zarejestrować service workera.", error);
    }
  });
}
