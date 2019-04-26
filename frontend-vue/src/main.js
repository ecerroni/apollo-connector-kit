import Vue from 'vue';
import {
  Button,
  Form,
  FormItem,
  Input,
  Notification,
} from 'element-ui';
import VueApollo from 'vue-apollo';
import App from './App';
import router from './router';
import apolloClient from './apollo';

Vue.use(Button);
Vue.use(Form);
Vue.use(FormItem);
Vue.use(Input);

Vue.prototype.$notify = Notification;

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
