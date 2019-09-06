import Vue from "vue";

import App from "./App.vue";
import router from "./router";
import store from "./store";
import "./plugins/ant-design-vue.js";
import LogViewer from "@femessage/log-viewer";

Vue.component(LogViewer.name, LogViewer);

Vue.config.productionTip = false;
new Vue({
  router,
  store,
  render: h => h(App)
}).$mount("#app");
