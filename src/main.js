import { createApp } from "vue";
import App from "./App.vue";
import router from "./router";

import "bootstrap/dist/js/bootstrap.bundle.min";
import "@mdi/font/css/materialdesignicons.css";
import "@sweetalert2/themes/bootstrap-4/bootstrap-4.css";

createApp(App)
  .use(router)
  .mount('#app');
