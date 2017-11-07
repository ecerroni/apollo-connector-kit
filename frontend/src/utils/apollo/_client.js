import { ApolloClient, createNetworkInterface } from 'apollo-client';
import router from '../../router';
import { AUTH, UUID } from '../../environment';

// TODO: UPGRADE TO APOLLO LINK
// TODO: CHANGE LOGIC TO TOKEN + REFRESH TOKEN
// TODO: SET THE TOKEN HERE INSTEAD OF LOGIN
// TODO: GET RID OF BOTH UUID AND FINGERPRINT LOGIC (WE DON'T SEND ANYTHING LIKE THAT ANYMORE)
// TODO: BECAUSE OF THE ABOVE WE'RE GOING TO SEND ONLY A TIMESTAMP
// (IF CLOCK SKEW STRATEGY IS ENABLED)


// DEFINE WHICH AUTH STRATEGY TO USE. THEY'RE XOR
const auth = {
  strategies: {
    httpOnly: AUTH.STRATEGIES.HTTP_ONLY,
    localStorage: AUTH.STRATEGIES.LOCALSTORAGE,
    uuid: AUTH.STRATEGIES.UUID, // UNIQUE PER DEVICE
  },
};
// Create the apollo client
const networkInterfaceObj = {
  uri: '/graphql',
  // uri: 'http://51.15.60.70:8080/graphql',
  transportBatching: true,
};

if (auth.strategies.httpOnly) {
  networkInterfaceObj.opts = {
    credentials: 'same-origin',
  };
}
const networkInterface = createNetworkInterface(networkInterfaceObj);

/* * -------------- STRATEGY LOCALSTORAGE -------- * */
if (auth.strategies.localStorage) {
  networkInterface.use([{
    applyMiddleware(req, next) {
      if (!req.options.headers) {
        req.options.headers = {};  // Create the header object if needed.
      }

      if (auth.strategies.uuid) {
        req.options.headers.uuid = UUID;
      }

      const token = localStorage.getItem('askerikToken');
      if (token) {
        req.options.headers.authorization = `Bearer ${token}`;
        next();
      } else {
        // eslint-disable-next-line
        console.error('ERROR: no askerikToken');
        router.push('/login'); // window.location.href = 'http://siwei.me';
      }
      // console.log(req.options.headers);
      next();
    },
  }]);
}
/* * --------------------------- * */

/* * -------------- STRATEGY HTTP_ONLY -------- * */
/* * -------------- AS LONG AS UUID IS TRUE -------- * */

if (auth.strategies.httpOnly && auth.uuid) {
  networkInterface.use([{
    applyMiddleware(req, next) {
      if (!req.options.headers) {
        req.options.headers = {};  // Create the header object if needed.
      }

      if (auth.uuid) {
        req.options.headers.uuid = UUID;
      }
      next();
    },
  }]);
}
/* *--------------------------- * */


// DESPITE EITHER STRATEGIES AFTERWARE IS ALWAYS THE SAME
networkInterface.useAfter([{
  applyAfterware({ response }, next) {
    if ((response && response.status >= 500)) {
      // eslint-disable-next-line
      console.log('SERVER ERROR', response);
    }
    if (response && (response.status === 401 || response.status === 403)) {
      // eslint-disable-next-line
      console.log('unauthorized', response);
      router.push('/login');
    }
    next();
  },
}]);

export default new ApolloClient({ networkInterface, connectToDevTools: true });
