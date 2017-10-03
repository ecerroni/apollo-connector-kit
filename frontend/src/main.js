// The Vue build version to load with the `import` command
// (runtime-only or standalone) has been set in webpack.base.conf with an alias.
import Vue from 'vue';
import ElementUI from 'element-ui';
import wysiwyg from 'vue-wysiwyg';
import VueApollo from 'vue-apollo';
import 'element-ui/lib/theme-default/index.css';
import 'vue-wysiwyg/dist/vueWysiwyg.css';
import App from './App';
import router from './router';
import { apolloClient } from './utils';

Vue.use(ElementUI);
Vue.use(wysiwyg, {
  hideModules: { image: true, link: true, table: true },
});

Vue.config.productionTip = false;

Vue.use(VueApollo);

const apolloProvider = new VueApollo({
  defaultClient: apolloClient,
});

/* eslint-disable no-new */
new Vue({
  el: '#app',
  apolloProvider,
  router,
  template: '<App/>',
  components: { App },
});
