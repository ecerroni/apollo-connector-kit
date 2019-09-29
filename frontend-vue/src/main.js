import Vue from 'vue';
import VueApollo from 'vue-apollo';
import Vuelidate from 'vuelidate'
import App from './App';
import router from './router';
import { fsm } from './states';
import { apolloClient } from './apollo';
import 'notyf/notyf.min.css';

Vue.config.productionTip = false;

Vue.use(VueApollo);
Vue.use(Vuelidate)

const apolloProvider = new VueApollo({
  defaultClient: apolloClient,
});

Vue.prototype.$fsm = fsm;
Vue.prototype.$state = '';

fsm.observe({
  onAfterTransition: function (_) {
    Vue.prototype.$state = fsm.state
    // console.log(Vue.prototype.$state);
  },
})

/* eslint-disable no-new */
new Vue({
  el: '#app',
  apolloProvider,
  router,
  render: h => h(App),
});
