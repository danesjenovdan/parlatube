// The Vue build version to load with the `import` command
// (runtime-only or standalone) has been set in webpack.base.conf with an alias.
import Vue from 'vue';
import vueResource from 'vue-resource';
import VueCookies from 'vue-cookies';
import App from '@/App';
import router from '@/router';
import store from '@/store';

Vue.config.productionTip = false;

Vue.use(vueResource);
Vue.use(VueCookies);

/* eslint-disable no-new */
new Vue({
  el: '#app',
  router,
  store,
  template: '<App/>',
  components: { App },
});
