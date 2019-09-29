import StateMachine from 'javascript-state-machine'
import { Notyf } from 'notyf';
import router from '@/router'
import { APP } from '../apollo/_config';
const {
  CONSTANTS: {
    UNAUTHORIZED,
    FORBIDDEN,
  } = {},
} = APP;

const notyf = new Notyf();

export default new StateMachine({
  init: 'anonymous',
  transitions: [
    // general
    { name: 'goto', from: '*', to: function (state) { return state } },

    // authenticated
    { name: 'login', from: ['anonymous', 'unauthorized', 'forbidden'], to: 'loggedIn' },
    { name: 'logout', from: '*', to: 'anonymous' },
    { name: 'error50x', from: '*', to: (error = 500) => error },
    { name: 'error40x', from: '*', to: error => error == 401 ? 'unauthorized' : error == 403 ? 'forbidden' : `${error}` },
  ],
  data: {
    //
  },
  methods: {
    onLoggedIn({ from, to }) {
      if (router.history.current.path === '/login') {
        notyf.success('Welcome')
        router.push("/");
      }
    },
    onLogout({ from }) {
      if (from === 'loggedIn') notyf.error('You have been logged out')

    },
    onGoto() {
      // console.log('goto')
    },
    onUnauthorized() {
      //
    },
    onForbidden() {
      notyf.error('You do not have enough privileges');
    },
    onError40x(_, errorCode) {
      const error = errorCode || 404
      if (error == 401) {
        console.warn(UNAUTHORIZED);
        if (router.history.current.path && router.history.current.path !== '/login') {
          router.push('/login');
          notyf.error('You tried to access an authorized area. Please login first');
        }
      }
      if (error == 403) {
        // Do something
        console.warn(FORBIDDEN);
        router.push('/forbidden');
      }
    },
    onError50x(_, errorCode) {
      const error = errorCode || 500
      // eslint-disable-next-line
      console.warn('SERVER ERROR');
      router.push(`/error/${error}`);
      // DO SOMETHING. HANDLE THIS ONE.
    }
  }
});