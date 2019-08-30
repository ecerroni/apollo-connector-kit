import Vue from 'vue';
import Router from 'vue-router';
import { Home, Login, Error as E } from '@/views';
const AsyncForbidden = () => import('@/views/_forbidden');
const AsyncError = () => import('@/views/_error');

const AsyncNotFound = () => ({
  component: import('@/views/_not-found'),
  // A component to use while the async component is loading
  // loading: LoadingComp,
  // A component to use if the load fails
  // error: ErrorComp,
  // Delay before showing the loading component. Default: 200ms.
  // delay: 200,
  // The error component will be displayed if a timeout is
  // provided and exceeded. Default: Infinity.
  // timeout: 3000,
});

Vue.use(Router);
export default new Router({
  routes: [
    {
      path: '/',
      name: 'Home',
      component: Home,
    },
    {
      path: '/login',
      name: 'Login',
      component: Login,
    },
    {
      path: '/forbidden',
      name: 'Forbidden',
      component: AsyncForbidden,
    },
    {
      path: '/error/:status',
      name: 'Error',
      component: AsyncError,
      props: true,
    },
    { path: '/40x', component: AsyncNotFound },
    { path: '*', redirect: '/40x' },
  ],
});
