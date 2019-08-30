import Vue from 'vue';
import Notifications from 'vue-notification'
import VueApollo from 'vue-apollo';
import Vuelidate from 'vuelidate'
import App from './App';
import router from './router';
import { apolloClient } from './apollo';

Vue.use(Notifications)

Vue.config.productionTip = false;

Vue.use(VueApollo);
Vue.use(Vuelidate)

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
