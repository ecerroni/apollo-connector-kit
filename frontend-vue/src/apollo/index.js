import { ApolloClient } from 'apollo-client';
import { withClientState } from 'apollo-link-state';
import { HttpLink } from 'apollo-link-http';
import { InMemoryCache } from 'apollo-cache-inmemory';
import { setContext } from 'apollo-link-context';
import { onError } from 'apollo-link-error';
import { ApolloLink } from 'apollo-link';
import { APP, AUTH, CLIENT_AUTH_REQUEST_TYPE, CLIENT_AUTHENTICATION_METHOD, JWT, VERSION } from '@/environment';
import router from '@/router';
import { defaults, resolvers } from '../api';

const apolloCache = new InMemoryCache({
  dataIdFromObject: e => `${e.__typename}_${e.id}` || null, // eslint-disable-line no-underscore-dangle
});

const stateLink = withClientState({
  cache: apolloCache,
  defaults,
  resolvers,
});

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

const errorLink = onError(({ response, networkError = {}, graphQLErrors = [] }) => {
  const redirect = (networkError && networkError.statusCode) ||
    (graphQLErrors && graphQLErrors.length > 0);
  if (redirect) {
    let { statusCode } = networkError;
    if (!statusCode) {
      const errors = graphQLErrors
        .filter(e => e.status === 403 || e.status === 401);
      const { status = 200 } = errors[0];
      statusCode = status;
    }
    if (statusCode === 401) {
      // eslint-disable-next-line
      console.warn(UNAUTHORIZED);
      if (router.history.current.path && router.history.current.path !== '/login') {
        router.push('/login');
      }
    }
    if (statusCode === 403) {
      // Do something
      console.warn(FORBIDDEN);
      router.push('/forbidden');
    }
    if ((statusCode >= 500)) {
      // eslint-disable-next-line
      console.warn('SERVER ERROR');
      router.push(`/error/${statusCode}`);
      // DO SOMETHING. HANDLE THIS ONE.
    }
    if (response.errors && response.errors.length > 0 && response.errors[0].extensions) {
      response.errors = { ...response.errors[0].extensions };
    }
  }
});

let links = [
  errorLink,
  stateLink,
  httpLink,
];

if (useLocalStorage) {
  links = [
    errorLink,
    stateLink,
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

