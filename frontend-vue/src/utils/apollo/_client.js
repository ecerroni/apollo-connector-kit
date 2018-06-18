import { ApolloClient } from 'apollo-client';
import { HttpLink } from 'apollo-link-http';
import { InMemoryCache } from 'apollo-cache-inmemory';
import { setContext } from 'apollo-link-context';
import { onError } from 'apollo-link-error';
import { ApolloLink } from 'apollo-link';
import {
  AUTH,
  APP,
  JWT,
  VERSION,
  CLIENT_AUTH_REQUEST_TYPE,
  CLIENT_AUTHENTICATION_METHOD,
} from '@/environment';
import router from '@/router';

const {
  CONSTANTS: {
    UNAUTHORIZED,
    FORBIDDEN,
  } = {},
} = APP;

const opts = {
  credentials: 'same-origin',
  headers: {
    'frontend-version': VERSION,
    [AUTH.STRATEGIES.CLIENT.AUTH_HEADER]: CLIENT_AUTH_REQUEST_TYPE,
  },
};

const useLocalStorage = CLIENT_AUTHENTICATION_METHOD.LOCAL_STORAGE;

const httpLink = new HttpLink({
  uri: APP.ENDPOINT.GRAPHQL,
  ...opts,
});

const authMiddlewareLink = setContext(() => ({
  headers: {
    [JWT.HEADER.TOKEN.NAME]: localStorage.getItem(JWT.LOCAL_STORAGE.TOKEN.NAME) || null,
    [JWT.HEADER.REFRESH_TOKEN.NAME]: localStorage.getItem(JWT.LOCAL_STORAGE.REFRESH_TOKEN.NAME) || null, // eslint-disable-line
  },
}));

const afterwareLink = new ApolloLink((operation, forward) =>
  forward(operation).map((response) => {
    const context = operation.getContext();
    const { response: { headers } } = context;

    if (headers) {
      const token = headers.get(JWT.HEADER.TOKEN.NAME);
      const refreshToken = headers.get(JWT.HEADER.REFRESH_TOKEN.NAME);

      if (token) {
        localStorage.setItem(JWT.LOCAL_STORAGE.TOKEN.NAME, token);
      }

      if (refreshToken) {
        localStorage.setItem(JWT.LOCAL_STORAGE.REFRESH_TOKEN.NAME, refreshToken);
      }
    }

    return response;
  }),
);

const errorLink = onError(({ networkError }) => {
  if (networkError.statusCode === 401) {
    // eslint-disable-next-line
    console.warn(UNAUTHORIZED);
    router.push('/login');
  }
  if (networkError.statusCode === 403) {
    // Do something
    console.warn(FORBIDDEN);
    router.push('/forbidden');
  }
  if ((networkError.statusCode >= 500)) {
    // eslint-disable-next-line
    console.warn('SERVER ERROR');
    router.push(`/error/${networkError.statusCode}`);
    // DO SOMETHING. HANDLE THIS ONE.
  }
});

let links = [
  errorLink,
  httpLink,
];

if (useLocalStorage) {
  links = [
    errorLink,
    afterwareLink,
    authMiddlewareLink,
    httpLink,
  ];
}

const link = ApolloLink.from(links);


const cache = new InMemoryCache();

export default new ApolloClient({
  link,
  cache,
  connectToDevTools: true,
});

