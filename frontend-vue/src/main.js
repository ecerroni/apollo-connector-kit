import Vue from 'vue';
import VueFormly from 'vue-formly';
import VueFormlyBootstrap from 'vue-formly-bootstrap';
import Notifications from 'vue-notification'
import VueApollo from 'vue-apollo';
import App from './App';
import router from './router';
import { apolloClient } from './apollo';

Vue.use(Notifications)


Vue.use(VueFormly);

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
  render: h => h(App),
});
