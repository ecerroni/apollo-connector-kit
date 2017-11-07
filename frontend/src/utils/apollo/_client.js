import { ApolloClient } from 'apollo-client';
import { createHttpLink } from 'apollo-link-http';
import { InMemoryCache } from 'apollo-cache-inmemory';
import { setContext } from 'apollo-link-context';
import { onError } from 'apollo-link-error';
import { ApolloLink } from 'apollo-link';
import router from '../../router';
import { AUTH } from '../../environment';

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

let opts = {};

if (auth.strategies.httpOnly) {
  opts = {
    credentials: 'same-origin',
  };
}


const httpLink = createHttpLink({
  uri: '/graphql',
  ...opts,
});

const middlewareLink = setContext(() => ({
  headers: auth.strategies.localStorage
    ? {
      'x-token': localStorage.getItem('token') || null,
      'x-refresh-token': localStorage.getItem('refreshToken') || null,
    }
    : {},
}));

const afterwareLink = new ApolloLink((operation, forward) => {
  const { headers } = operation.getContext();

  if (headers) {
    const token = headers.get('x-token');
    const refreshToken = headers.get('x-refresh-token');

    if (!(token && refreshToken)) {
      // eslint-disable-next-line
      console.error('ERROR: no tokens');
      router.push('/login'); // window.location.href = 'http://siwei.me';
    }

    if (token) {
      localStorage.setItem('token', token);
    }

    if (refreshToken) {
      localStorage.setItem('refreshToken', refreshToken);
    }
  }

  return forward(operation);
});

const errorLink = onError(({ networkError, graphQLErrors }) => {
  if (networkError.statusCode === 401 || networkError.statusCode === 403) {
    // eslint-disable-next-line
    console.log('Unauthorized', graphQLErrors);
    router.push('/login');
  }
  if ((networkError.statusCode >= 500)) {
    // eslint-disable-next-line
    console.log('SERVER ERROR', graphQLErrors);
    // DO SOMETHING. HANDLE THIS ONE.
  }
});


const link = errorLink.concat(afterwareLink.concat(middlewareLink.concat(httpLink)));

export default new ApolloClient({
  link,
  cache: new InMemoryCache(),
});

