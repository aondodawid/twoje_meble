window.scrollTo = window.scrollTo || (() => {});
window.matchMedia =
  window.matchMedia ||
  function matchMedia() {
    return {
      matches: false,
      addEventListener: () => {},
      removeEventListener: () => {},
    };
  };
