import { createApp } from "vue";
import App from "./App.vue";
import router from "./routes/routes";
import { createPinia } from "pinia";
const pinia = createPinia();
const app = createApp(App);

app.use(pinia); // 🔥 Register Pinia

app.use(router); // Register the router
app.mount("#app");
