import Vue from "vue";
import "normalize.css";
import "./styles/tailwind.css";
import App from "./App.vue";
import registerServiceWorker from "./service-worker/registerServiceWorker";

Vue.config.productionTip = false;

registerServiceWorker();

new Vue({
  render: (createElement) => createElement(App),
}).$mount("#app");
