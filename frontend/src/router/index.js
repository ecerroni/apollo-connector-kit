import Vue from 'vue';
import Router from 'vue-router';
import Home from '@/components/Home';
import Login from '@/components/Login';
import Forbidden from '@/components/Forbidden';
import NotFound from '@/components/NotFound';

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
      component: Forbidden,
    },
    { path: '/40x', component: NotFound },
    { path: '*', redirect: '/40x' },
  ],
});
