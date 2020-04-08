import Vue from "vue";
import singleSpaVue from "single-spa-vue";
import App from "./App.vue";
import Router from "vue-router";
import router from "./router";

Vue.use(Router);
const vueLifecycles = singleSpaVue({
    Vue,
    appOptions: {
        render: (h) => h(App),
        router
    },
});

export const bootstrap = vueLifecycles.bootstrap;
export const mount = vueLifecycles.mount;
export const unmount = vueLifecycles.unmount;